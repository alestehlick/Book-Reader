from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

import history_reader  # noqa: E402


def approved_generated_asset() -> dict:
    return {
        "id": "01-jomon-dwelling-01",
        "src": "illustrations/01-jomon-dwelling-01.webp",
        "alt": "A reconstructed Jomon pit dwelling beside a forest clearing.",
        "caption": "Evidence-constrained reconstruction of a settlement setting.",
        "category": "culture",
        "historicalStatus": "ai-reconstruction",
        "evidenceLevel": "interpretive",
        "generated": True,
        "status": "approved",
        "rights": {
            "status": "project-generated",
            "license": "project-generated",
            "credit": "Generated for the reader.",
        },
        "evidence": {
            "brief": "Middle Jomon dwelling based on excavated postholes and hearths.",
            "sources": ["Archaeological site report, example citation."],
            "uncertainties": ["Roof finish is reconstructed."],
            "exclusions": ["No Yayoi raised granary; no later tiled roof."],
        },
        "generation": {
            "model": "image-model-version",
            "promptFile": "illustration-prompts/01-jomon-dwelling-01.txt",
        },
        "audit": {
            "historical": "approved",
            "visual": "approved",
            "rights": "approved",
            "reviewedBy": "Codex audit pass",
            "reviewedAt": "2026-07-19",
        },
    }


class IllustrationValidationTests(unittest.TestCase):
    def data(self, asset: dict) -> dict:
        return {
            "schemaVersion": 2,
            "id": "test",
            "title": "Test",
            "language": "en",
            "illustrationPolicy": {
                "required": True,
                "minimumPerParagraph": 1,
                "maximumPerParagraph": 4,
            },
            "catalogs": {"maps": [], "timeline": [], "illustrations": [asset]},
            "sections": [
                {
                    "id": "01.01",
                    "number": "01.01",
                    "title": "Test",
                    "paragraphs": [
                        {
                            "id": "01.01-p001",
                            "text": "Sentence.",
                            "mapRefs": [],
                            "timelineRefs": [],
                            "illustrationRefs": [
                                {"id": asset["id"], "role": "primary"}
                            ],
                        }
                    ],
                }
            ],
        }

    def test_approved_generated_asset_passes_illustration_gate(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            base = Path(directory)
            image = base / "illustrations" / "01-jomon-dwelling-01.webp"
            image.parent.mkdir(parents=True)
            image.write_bytes(b"test")
            data = self.data(approved_generated_asset())
            paragraphs = [data["sections"][0]["paragraphs"][0]]
            errors, warnings, summary = history_reader.validate_illustrations(data, paragraphs, base)
            self.assertEqual(errors, [])
            self.assertEqual(warnings, [])
            self.assertEqual(summary["illustrations"], 1)

    def test_pending_audit_is_rejected(self) -> None:
        asset = approved_generated_asset()
        asset["audit"]["historical"] = "pending"
        data = self.data(asset)
        paragraphs = [data["sections"][0]["paragraphs"][0]]
        errors, _, _ = history_reader.validate_illustrations(data, paragraphs, None)
        self.assertTrue(any("historical audit is not approved" in item for item in errors))

    def test_builder_imports_plan_and_paragraph_references(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "manuscript.txt").write_text(
                "CHAPTER 01 - Test\nCONTENTS\nSECTION 01.01 - Test\n\n"
                "SECTION 01.01 - Test\nSentence.\n",
                encoding="utf-8",
            )
            (root / "metadata.json").write_text("{}\n", encoding="utf-8")
            plan = {
                "policy": {"required": True, "minimumPerParagraph": 1, "maximumPerParagraph": 4},
                "assets": [approved_generated_asset()],
                "paragraphs": {
                    "01.01-p001": [{"id": "01-jomon-dwelling-01", "role": "primary"}]
                },
            }
            (root / "illustrations.json").write_text(json.dumps(plan), encoding="utf-8")
            manifest = {
                "id": "test",
                "title": "Test",
                "manuscript": "manuscript.txt",
                "sectionMetadata": "metadata.json",
                "illustrationPlan": "illustrations.json",
                "outputJson": "web/data.json",
                "outputJs": "web/data.js",
                "maps": [],
            }
            manifest_path = root / "manifest.json"
            manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
            data = history_reader.build_from_manifest(manifest_path)
            paragraph = data["sections"][0]["paragraphs"][0]
            self.assertEqual(paragraph["illustrationRefs"][0]["role"], "primary")
            self.assertEqual(data["catalogs"]["illustrations"][0]["id"], "01-jomon-dwelling-01")


if __name__ == "__main__":
    unittest.main()
