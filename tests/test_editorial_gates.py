from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

import history_reader  # noqa: E402


def event(event_id: str = "event-1") -> dict:
    return {
        "id": event_id,
        "type": "point",
        "label": "Test event",
        "start": 100,
        "end": 100,
        "display_date": "AD 100",
        "certainty": "secure",
        "caption": "A securely attested test event.",
    }


class EditorialGateTests(unittest.TestCase):
    def test_legacy_point_date_is_normalized(self) -> None:
        normalized = history_reader.normalize_timeline_event(
            {"type": "point", "date": 57, "label": "Na"}
        )
        self.assertEqual(normalized["start"], 57)
        self.assertEqual(normalized["end"], 57)
        self.assertNotIn("date", normalized)

    def test_production_source_audit_requires_coverage_and_retention(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "source.txt").write_text("word " * 100, encoding="utf-8")
            audit = {
                "visualPagesVerified": True,
                "allSourceRangesAccountedFor": True,
                "minimumRetainedWordRatio": 0.35,
                "coverage": [{
                    "sourceRange": "PDF p. 1; OCR lines 1-10",
                    "outputSections": ["01.01"],
                    "substanceRetained": ["The source's central argument."],
                    "omittedAs": [],
                }],
            }
            (root / "audit.json").write_text(json.dumps(audit), encoding="utf-8")
            manifest = {
                "releaseMode": "production",
                "sourceOcr": "source.txt",
                "sourceAudit": "audit.json",
            }
            sections = [{"id": "01.01", "paragraphs": [{"text": "word " * 40}]}]
            errors, warnings, summary = history_reader.validate_source_audit(manifest, root, sections)
            self.assertEqual(errors, [])
            self.assertEqual(warnings, [])
            self.assertAlmostEqual(summary["retentionRatio"], 0.4)

    def test_production_timeline_rejects_section_wide_repetition(self) -> None:
        paragraphs = [
            {"id": f"01.01-p00{number}", "text": "A sentence.", "mapRefs": ["map-1"], "timelineRefs": ["event-1"]}
            for number in range(1, 4)
        ]
        data = {
            "schemaVersion": 2,
            "catalogs": {"maps": [{"id": "map-1", "src": "map.webp"}], "timeline": [event()], "illustrations": []},
            "sections": [{"id": "01.01", "paragraphs": paragraphs}],
        }
        result = history_reader.validate(data, editorial_rules=True)
        self.assertTrue(any("every paragraph repeats" in error for error in result.errors))

    def test_invalid_timeline_certainty_is_rejected(self) -> None:
        invalid = event()
        invalid["certainty"] = "high"
        errors = history_reader.validate_timeline_event(invalid, "timeline event-1")
        self.assertTrue(any("certainty must be one of" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
