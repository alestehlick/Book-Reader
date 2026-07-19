#!/usr/bin/env python3
"""Build, migrate, and validate static-history-reader chapter packages.

The canonical artifact is JSON.  The matching JavaScript file is generated
mechanically so that GitHub Pages can open a chapter without dynamic code
evaluation or a web server.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable


SECTION_RE = re.compile(r"^SECTION\s+(\d{2}\.\d{2})\s+-\s+(.+)$")
CHAPTER_RE = re.compile(r"^CHAPTER\s+(\d{2})\s+-\s+(.+)$")

ILLUSTRATION_CATEGORIES = {
    "object",
    "geography",
    "people",
    "occasion",
    "culture",
    "myth-religion",
}
ILLUSTRATION_HISTORICAL_STATUSES = {
    "contemporary-evidence",
    "archaeological-evidence",
    "documented-landscape",
    "scholarly-reconstruction",
    "ai-reconstruction",
    "later-depiction",
    "mythic-interpretation",
}
ILLUSTRATION_EVIDENCE_LEVELS = {"documented", "reconstructed", "interpretive"}
ILLUSTRATION_ROLES = {"primary", "supporting"}
APPROVED_AUDIT_VALUE = "approved"
TIMELINE_TYPES = {"span", "point"}
TIMELINE_CERTAINTIES = {"secure", "approximate", "disputed", "traditional"}
PRODUCTION_RELEASE_MODE = "production"
DEFAULT_MINIMUM_SOURCE_RETENTION = 0.35


class BuildError(RuntimeError):
    pass


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def write_js(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    body = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    path.write_text(f"window.BOOK_DATA={body};\n", encoding="utf-8")


def canonical(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def is_remote_reference(value: str) -> bool:
    return bool(re.match(r"^(?:https?:)?//", str(value or ""), flags=re.IGNORECASE))


def stable_id(prefix: str, value: Any, used: set[str]) -> str:
    digest = hashlib.sha1(canonical(value).encode("utf-8")).hexdigest()[:10]
    candidate = f"{prefix}-{digest}"
    n = 2
    while candidate in used:
        candidate = f"{prefix}-{digest}-{n}"
        n += 1
    used.add(candidate)
    return candidate


def normalize_map(item: dict[str, Any], map_id: str) -> dict[str, Any]:
    result = dict(item)
    result["id"] = map_id
    result["src"] = item.get("src", item.get("fallbackSrc", ""))
    # Labels and captions are retained only as internal metadata for legacy
    # compatibility.  The reader deliberately does not render them.
    if item.get("label"):
        result["label"] = item["label"]
    return result


def expand_manifest_maps(manifest: dict[str, Any], root: Path) -> list[dict[str, Any]]:
    """Merge compact manifest map entries with generated web-atlas presets."""
    presets: dict[str, Any] = {}
    preset_path = manifest.get("webAtlasPresets")
    if preset_path:
        catalog = read_json((root / preset_path).resolve())
        presets = catalog.get("presets", {})
        if not isinstance(presets, dict):
            raise BuildError("webAtlasPresets must contain a presets object.")

    maps: list[dict[str, Any]] = []
    for item in manifest.get("maps", []):
        clean = dict(item)
        preset_id = str(clean.pop("preset", "")).strip()
        if preset_id:
            preset = presets.get(preset_id)
            if not isinstance(preset, dict):
                raise BuildError(f"Unknown web-atlas preset: {preset_id}")
            clean = {**preset, **clean}
        if not clean.get("id"):
            raise BuildError("Every manifest map requires an id.")
        if clean.get("type") == "interactive" and not clean.get("src"):
            clean["src"] = clean.get("fallbackSrc", "")
        maps.append(clean)
    return maps


def normalize_illustration_ref(value: Any) -> dict[str, str] | None:
    if isinstance(value, str):
        illustration_id = value.strip()
        return {"id": illustration_id, "role": "supporting"} if illustration_id else None
    if not isinstance(value, dict):
        return None
    illustration_id = str(value.get("id", "")).strip()
    if not illustration_id:
        return None
    role = str(value.get("role", "supporting")).strip().lower()
    return {"id": illustration_id, "role": role}


def normalize_illustration_plan(plan: dict[str, Any]) -> tuple[dict[str, Any], list[dict[str, Any]], dict[str, list[dict[str, str]]]]:
    policy = dict(plan.get("policy") or {})
    policy.setdefault("required", True)
    policy.setdefault("minimumPerParagraph", 1)
    policy.setdefault("maximumPerParagraph", 4)
    policy.setdefault("defaultStrategy", "ai-first-when-source-is-not-straightforward-and-clean")
    policy.setdefault("requireAudit", True)

    assets: list[dict[str, Any]] = []
    for raw_asset in plan.get("assets", []):
        if isinstance(raw_asset, dict):
            assets.append(dict(raw_asset))

    assignments: dict[str, list[dict[str, str]]] = {}
    for paragraph_id, raw_refs in (plan.get("paragraphs") or {}).items():
        refs = []
        for raw_ref in raw_refs if isinstance(raw_refs, list) else []:
            normalized = normalize_illustration_ref(raw_ref)
            if normalized:
                refs.append(normalized)
        assignments[str(paragraph_id)] = refs
    return policy, assets, assignments


def resolve_manifest_path(root: Path, value: str) -> Path:
    path = Path(str(value))
    return (path if path.is_absolute() else root / path).resolve()


def word_count(value: str) -> int:
    return len(re.findall(r"\b[\w'’-]+\b", value))


def normalize_timeline_event(raw_event: dict[str, Any]) -> dict[str, Any]:
    """Normalize legacy point dates into the documented start/end schema."""
    event = dict(raw_event)
    event_type = str(event.get("type", "")).strip().lower()
    if event_type not in TIMELINE_TYPES:
        return event

    if event_type == "point":
        point = event.get("start", event.get("date"))
        event["start"] = point
        event["end"] = event.get("end", point)
        event.pop("date", None)
    else:
        event["start"] = event.get("start")
        event["end"] = event.get("end")
    return event


def validate_timeline_event(event: dict[str, Any], prefix: str) -> list[str]:
    errors: list[str] = []
    event_type = event.get("type")
    if event_type not in TIMELINE_TYPES:
        errors.append(f"{prefix}: type must be span or point")
    for field in ("label", "display_date", "caption"):
        if not str(event.get(field, "")).strip():
            errors.append(f"{prefix}: {field} is required")
    certainty = event.get("certainty")
    if certainty not in TIMELINE_CERTAINTIES:
        errors.append(
            f"{prefix}: certainty must be one of {', '.join(sorted(TIMELINE_CERTAINTIES))}"
        )
    for field in ("start", "end"):
        value = event.get(field)
        if value is not None and (not isinstance(value, (int, float)) or isinstance(value, bool)):
            errors.append(f"{prefix}: {field} must be a number or null")
    if event_type == "point" and event.get("start") != event.get("end"):
        errors.append(f"{prefix}: a point must use the same start and end year")
    return errors


def release_mode(manifest: dict[str, Any]) -> str:
    return str(manifest.get("releaseMode", "pilot")).strip().lower() or "pilot"


def validate_source_audit(
    manifest: dict[str, Any],
    manifest_root: Path,
    sections: list[dict[str, Any]],
) -> tuple[list[str], list[str], dict[str, Any]]:
    """Check the documentary accounting that protects against silent abridgement."""
    errors: list[str] = []
    warnings: list[str] = []
    production = release_mode(manifest) == PRODUCTION_RELEASE_MODE
    summary: dict[str, Any] = {"releaseMode": release_mode(manifest)}
    source_ocr_value = manifest.get("sourceOcr")
    source_audit_value = manifest.get("sourceAudit")
    if not source_ocr_value or not source_audit_value:
        if production:
            errors.append("Production release requires sourceOcr and sourceAudit in the manifest.")
        else:
            warnings.append("Pilot release has no source OCR audit and is not certified as editorially complete.")
        return errors, warnings, summary

    source_ocr = resolve_manifest_path(manifest_root, str(source_ocr_value))
    source_audit = resolve_manifest_path(manifest_root, str(source_audit_value))
    if not source_ocr.is_file():
        errors.append(f"Source OCR not found: {source_ocr}")
        return errors, warnings, summary
    if not source_audit.is_file():
        errors.append(f"Source audit not found: {source_audit}")
        return errors, warnings, summary

    audit = read_json(source_audit)
    source_words = word_count(source_ocr.read_text(encoding="utf-8-sig"))
    manuscript_words = sum(word_count(paragraph.get("text", "")) for section in sections for paragraph in section["paragraphs"])
    retention = manuscript_words / source_words if source_words else 0.0
    summary.update({
        "sourceOcr": str(source_ocr),
        "sourceWords": source_words,
        "manuscriptWords": manuscript_words,
        "retentionRatio": round(retention, 4),
    })

    if not bool(audit.get("visualPagesVerified")):
        errors.append("Source audit must confirm visual verification of pages against the OCR.")
    if not bool(audit.get("allSourceRangesAccountedFor")):
        errors.append("Source audit must account for every substantive source range.")
    coverage = audit.get("coverage")
    if not isinstance(coverage, list) or not coverage:
        errors.append("Source audit requires a non-empty coverage ledger.")
    else:
        known_sections = {section["id"] for section in sections}
        covered_sections: set[str] = set()
        for index, entry in enumerate(coverage, 1):
            prefix = f"source audit coverage {index}"
            if not isinstance(entry, dict):
                errors.append(f"{prefix}: entry must be an object")
                continue
            if not str(entry.get("sourceRange", "")).strip():
                errors.append(f"{prefix}: sourceRange is required")
            output_sections = entry.get("outputSections")
            if not isinstance(output_sections, list) or not output_sections:
                errors.append(f"{prefix}: outputSections is required")
            else:
                for section_id in output_sections:
                    section_id = str(section_id)
                    if section_id not in known_sections:
                        errors.append(f"{prefix}: unknown output section {section_id}")
                    else:
                        covered_sections.add(section_id)
            if not isinstance(entry.get("substanceRetained"), list) or not entry["substanceRetained"]:
                errors.append(f"{prefix}: substanceRetained must identify the retained arguments or evidence")
            if not isinstance(entry.get("omittedAs"), list):
                errors.append(f"{prefix}: omittedAs must be a list, even when empty")
        missing_sections = sorted(known_sections - covered_sections)
        if missing_sections:
            errors.append("Source audit does not cover output section(s): " + ", ".join(missing_sections))

    minimum = audit.get("minimumRetainedWordRatio", DEFAULT_MINIMUM_SOURCE_RETENTION)
    if not isinstance(minimum, (int, float)) or isinstance(minimum, bool) or not 0 < minimum <= 1:
        errors.append("Source audit minimumRetainedWordRatio must be a number greater than 0 and no more than 1.")
        minimum = DEFAULT_MINIMUM_SOURCE_RETENTION
    summary["minimumRetentionRatio"] = minimum
    if retention < minimum:
        approval = audit.get("approvedBelowMinimum")
        rationale = str(audit.get("belowMinimumRationale", "")).strip()
        if approval is True and rationale:
            warnings.append(
                f"Source retention is {retention:.1%}, below the stated {minimum:.1%} floor, under explicit recorded approval."
            )
        else:
            errors.append(
                f"Source retention is {retention:.1%}, below the stated {minimum:.1%} floor. "
                "A production chapter may not be silently abridged."
            )
    return errors, warnings, summary


def migrate_v1(data: dict[str, Any], book_id: str | None = None, prefer_webp: bool = False) -> dict[str, Any]:
    map_catalog: list[dict[str, Any]] = []
    timeline_catalog: list[dict[str, Any]] = []
    map_key_to_id: dict[str, str] = {}
    timeline_key_to_id: dict[str, str] = {}
    used_ids: set[str] = set()

    def map_ref(item: dict[str, Any]) -> str:
        source = item.get("src", "")
        fallback = item.get("fallbackSrc", "")
        if prefer_webp and str(source).lower().endswith((".png", ".jpg", ".jpeg")):
            fallback = source
            source = str(source).rsplit(".", 1)[0] + ".webp"
        key_item = {"src": source, "fallbackSrc": fallback}
        key = canonical(key_item)
        if key not in map_key_to_id:
            map_id = stable_id("map", key_item, used_ids)
            map_key_to_id[key] = map_id
            catalog_item = dict(item)
            catalog_item.update(key_item)
            map_catalog.append(normalize_map(catalog_item, map_id))
        return map_key_to_id[key]

    def timeline_ref(item: dict[str, Any]) -> str:
        clean = normalize_timeline_event(item)
        clean.pop("id", None)
        key = canonical(clean)
        if key not in timeline_key_to_id:
            event_id = stable_id("event", clean, used_ids)
            timeline_key_to_id[key] = event_id
            timeline_catalog.append({"id": event_id, **clean})
        return timeline_key_to_id[key]

    standing_maps = [map_ref(item) for item in data.get("sharedMaps", [])]
    sections: list[dict[str, Any]] = []
    for section in data.get("sections", []):
        paragraphs: list[dict[str, Any]] = []
        for paragraph in section.get("paragraphs", []):
            paragraph_maps = paragraph.get("maps") or []
            refs = [map_ref(item) for item in paragraph_maps]
            if not refs:
                refs = list(standing_maps)
            timeline_refs = [timeline_ref(item) for item in paragraph.get("timeline", [])]
            out = {
                "id": paragraph["id"],
                "text": paragraph.get("text", ""),
                "mapRefs": list(dict.fromkeys(refs)),
                "timelineRefs": list(dict.fromkeys(timeline_refs)),
            }
            for key in ("figures", "genealogy", "notes", "audio"):
                value = paragraph.get(key)
                if value:
                    out[key] = value
            paragraphs.append(out)
        sections.append(
            {
                "id": section.get("id") or section.get("number"),
                "number": section.get("number") or section.get("id"),
                "title": section.get("title", ""),
                "paragraphs": paragraphs,
            }
        )

    result: dict[str, Any] = {
        "schemaVersion": 2,
        "id": book_id or data.get("id") or "book",
        "title": data.get("title", "Untitled book"),
        "language": data.get("language", "en"),
        "catalogs": {"maps": map_catalog, "timeline": timeline_catalog},
        "sections": sections,
    }
    for key in ("subtitle", "genealogy", "notes", "credits"):
        if data.get(key):
            result[key] = data[key]
    add_stats(result)
    return result


def parse_manuscript(path: Path) -> tuple[str, list[dict[str, Any]]]:
    lines = path.read_text(encoding="utf-8-sig").splitlines()
    if not lines:
        raise BuildError(f"Empty manuscript: {path}")
    chapter_match = CHAPTER_RE.match(lines[0].strip())
    if not chapter_match:
        raise BuildError("Manuscript must begin with 'CHAPTER CC - Title'.")
    title = chapter_match.group(2).strip()
    sections: list[dict[str, Any]] = []
    current: dict[str, Any] | None = None
    buffer: list[str] = []

    def flush_paragraph() -> None:
        nonlocal buffer
        if current is None or not buffer:
            buffer = []
            return
        text = "\n".join(line.strip() for line in buffer if line.strip())
        if text:
            number = len(current["paragraphs"]) + 1
            current["paragraphs"].append(
                {"id": f"{current['id']}-p{number:03d}", "text": text}
            )
        buffer = []

    in_contents = False
    for raw in lines[1:]:
        line = raw.strip()
        if line == "CONTENTS":
            in_contents = True
            continue
        if in_contents:
            if not line:
                in_contents = False
            continue
        section_match = SECTION_RE.match(line)
        if section_match:
            flush_paragraph()
            current = {
                "id": section_match.group(1),
                "number": section_match.group(1),
                "title": section_match.group(2).strip(),
                "paragraphs": [],
            }
            sections.append(current)
            continue
        if in_contents or current is None:
            continue
        if not line:
            flush_paragraph()
        else:
            buffer.append(line)
    flush_paragraph()
    if not sections:
        raise BuildError("No SECTION headings were found in the manuscript.")
    return title, sections


def build_from_manifest(manifest_path: Path) -> dict[str, Any]:
    manifest = read_json(manifest_path)
    root = manifest_path.parent
    manuscript = (root / manifest["manuscript"]).resolve()
    title, sections = parse_manuscript(manuscript)
    metadata: dict[str, Any] = {}
    if manifest.get("paragraphMetadata"):
        metadata = read_json((root / manifest["paragraphMetadata"]).resolve())
    section_metadata: dict[str, Any] = {}
    if manifest.get("sectionMetadata"):
        section_metadata = read_json((root / manifest["sectionMetadata"]).resolve())

    illustration_policy: dict[str, Any] = {}
    illustrations: list[dict[str, Any]] = []
    illustration_assignments: dict[str, list[dict[str, str]]] = {}
    if manifest.get("illustrationPlan"):
        illustration_plan = read_json((root / manifest["illustrationPlan"]).resolve())
        illustration_policy, illustrations, illustration_assignments = normalize_illustration_plan(illustration_plan)

    maps = expand_manifest_maps(manifest, root)
    standing_refs = [item["id"] for item in maps if item.get("standing", True)]

    timeline: list[dict[str, Any]] = []
    timeline_by_key: dict[str, str] = {}
    used_timeline_ids: set[str] = set()
    for paragraph_meta in [*section_metadata.values(), *metadata.values()]:
        for event in paragraph_meta.get("timeline", []):
            clean = normalize_timeline_event(event)
            requested_id = clean.pop("id", None)
            key = canonical(clean)
            if key in timeline_by_key:
                continue
            event_id = requested_id or stable_id("event", clean, used_timeline_ids)
            timeline_by_key[key] = event_id
            timeline.append({"id": event_id, **clean})

    for section in sections:
        for paragraph in section["paragraphs"]:
            item_meta = dict(section_metadata.get(section["id"], {}))
            item_meta.update(metadata.get(paragraph["id"], {}))
            paragraph["mapRefs"] = item_meta.get("mapRefs", standing_refs)
            paragraph["timelineRefs"] = []
            for event in item_meta.get("timeline", []):
                clean = normalize_timeline_event(event)
                clean.pop("id", None)
                paragraph["timelineRefs"].append(timeline_by_key[canonical(clean)])
            if illustration_policy:
                paragraph["illustrationRefs"] = illustration_assignments.get(paragraph["id"], [])
            for key in ("figures", "genealogy", "notes", "audio"):
                if item_meta.get(key):
                    paragraph[key] = item_meta[key]

    data: dict[str, Any] = {
        "schemaVersion": 2,
        "id": manifest["id"],
        "title": manifest.get("title", title),
        "language": manifest.get("language", "en"),
        "catalogs": {"maps": maps, "timeline": timeline, "illustrations": illustrations},
        "sections": sections,
    }
    if illustration_policy:
        data["illustrationPolicy"] = illustration_policy
    for key in ("subtitle", "genealogy", "notes", "credits"):
        if manifest.get(key):
            data[key] = manifest[key]
    add_stats(data)

    output_json = (root / manifest["outputJson"]).resolve()
    output_js = (root / manifest["outputJs"]).resolve()
    write_json(output_json, data)
    write_js(output_js, data)
    return data


def iter_paragraphs(data: dict[str, Any]) -> Iterable[tuple[dict[str, Any], dict[str, Any]]]:
    for section in data.get("sections", []):
        for paragraph in section.get("paragraphs", []):
            yield section, paragraph


def add_stats(data: dict[str, Any]) -> None:
    paragraphs = [p for _, p in iter_paragraphs(data)]
    words = sum(len(re.findall(r"\b[\w'’-]+\b", p.get("text", ""))) for p in paragraphs)
    data["stats"] = {
        "sections": len(data.get("sections", [])),
        "paragraphs": len(paragraphs),
        "words": words,
    }


@dataclass
class ValidationResult:
    errors: list[str]
    warnings: list[str]
    summary: dict[str, Any]


def validate_illustrations(
    data: dict[str, Any],
    paragraphs: list[dict[str, Any]],
    base_dir: Path | None,
) -> tuple[list[str], list[str], dict[str, int]]:
    errors: list[str] = []
    warnings: list[str] = []
    catalogs = data.get("catalogs", {})
    raw_assets = [item for item in catalogs.get("illustrations", []) if isinstance(item, dict)]
    asset_ids = [str(item.get("id", "")).strip() for item in raw_assets]
    duplicate_ids = [key for key, count in Counter(asset_ids).items() if key and count > 1]
    if duplicate_ids:
        errors.append("Duplicate illustration ids: " + ", ".join(duplicate_ids))
    if any(not item for item in asset_ids):
        errors.append("One or more illustrations have no id.")
    assets = {str(item.get("id")): item for item in raw_assets if item.get("id")}

    policy = data.get("illustrationPolicy") or {}
    required = bool(policy.get("required", False))
    try:
        minimum = max(0, int(policy.get("minimumPerParagraph", 1 if required else 0)))
        maximum = max(1, int(policy.get("maximumPerParagraph", 4)))
    except (TypeError, ValueError):
        minimum, maximum = 1 if required else 0, 4
        errors.append("Illustration policy minimum/maximum values must be integers.")
    if maximum > 6:
        errors.append("Illustration policy maximumPerParagraph may not exceed 6.")
    if minimum > maximum:
        errors.append("Illustration policy minimumPerParagraph exceeds maximumPerParagraph.")

    referenced_ids: set[str] = set()
    missing_media: list[str] = []
    for paragraph in paragraphs:
        paragraph_id = paragraph.get("id", "unknown")
        normalized_refs = [
            normalized
            for raw_ref in paragraph.get("illustrationRefs", [])
            if (normalized := normalize_illustration_ref(raw_ref))
        ]
        unique_refs: list[dict[str, str]] = []
        seen: set[str] = set()
        for ref in normalized_refs:
            if ref["id"] in seen:
                warnings.append(f"{paragraph_id}: duplicate illustration reference {ref['id']}")
                continue
            seen.add(ref["id"])
            unique_refs.append(ref)

        if required and len(unique_refs) < minimum:
            errors.append(f"{paragraph_id}: requires at least {minimum} approved illustration(s)")
        if len(unique_refs) > maximum:
            errors.append(f"{paragraph_id}: has {len(unique_refs)} illustrations (maximum {maximum})")
        primary_count = sum(1 for ref in unique_refs if ref["role"] == "primary")
        if unique_refs and primary_count != 1:
            errors.append(f"{paragraph_id}: requires exactly one primary illustration")

        for ref in unique_refs:
            illustration_id = ref["id"]
            referenced_ids.add(illustration_id)
            if ref["role"] not in ILLUSTRATION_ROLES:
                errors.append(f"{paragraph_id}: invalid illustration role {ref['role']} for {illustration_id}")
            if illustration_id not in assets:
                errors.append(f"{paragraph_id}: unknown illustration reference {illustration_id}")

    for illustration_id, asset in assets.items():
        prefix = f"illustration {illustration_id}"
        if asset.get("category") not in ILLUSTRATION_CATEGORIES:
            errors.append(f"{prefix}: invalid category {asset.get('category')!r}")
        if asset.get("historicalStatus") not in ILLUSTRATION_HISTORICAL_STATUSES:
            errors.append(f"{prefix}: invalid historicalStatus {asset.get('historicalStatus')!r}")
        if asset.get("evidenceLevel") not in ILLUSTRATION_EVIDENCE_LEVELS:
            errors.append(f"{prefix}: invalid evidenceLevel {asset.get('evidenceLevel')!r}")
        is_referenced = illustration_id in referenced_ids
        is_approved = asset.get("status") == "approved"
        if is_referenced and not is_approved:
            errors.append(f"{prefix}: status must be approved before publication")
        if not is_referenced and not is_approved:
            continue
        if not str(asset.get("src", "")).strip():
            errors.append(f"{prefix}: missing src")
        if not str(asset.get("alt", "")).strip():
            errors.append(f"{prefix}: missing alt text")

        audit = asset.get("audit") if isinstance(asset.get("audit"), dict) else {}
        for gate in ("historical", "visual", "rights"):
            if audit.get(gate) != APPROVED_AUDIT_VALUE:
                errors.append(f"{prefix}: {gate} audit is not approved")
        if not str(audit.get("reviewedBy", "")).strip() or not str(audit.get("reviewedAt", "")).strip():
            errors.append(f"{prefix}: audit requires reviewedBy and reviewedAt")

        rights = asset.get("rights") if isinstance(asset.get("rights"), dict) else {}
        if not str(rights.get("status", "")).strip() or not str(rights.get("license", "")).strip():
            errors.append(f"{prefix}: rights status and license are required")

        generated = bool(asset.get("generated", False))
        if generated:
            evidence = asset.get("evidence") if isinstance(asset.get("evidence"), dict) else {}
            generation = asset.get("generation") if isinstance(asset.get("generation"), dict) else {}
            if asset.get("historicalStatus") not in {"ai-reconstruction", "mythic-interpretation"}:
                errors.append(f"{prefix}: generated asset must be an AI reconstruction or mythic interpretation")
            if not str(evidence.get("brief", "")).strip():
                errors.append(f"{prefix}: generated asset requires an evidence brief")
            if not isinstance(evidence.get("sources"), list) or not evidence.get("sources"):
                errors.append(f"{prefix}: generated asset requires at least one research source")
            if not isinstance(evidence.get("uncertainties"), list):
                errors.append(f"{prefix}: generated asset requires an uncertainties list")
            if not isinstance(evidence.get("exclusions"), list) or not evidence.get("exclusions"):
                errors.append(f"{prefix}: generated asset requires explicit anachronism exclusions")
            if not str(generation.get("model", "")).strip() or not str(generation.get("promptFile", "")).strip():
                errors.append(f"{prefix}: generated asset requires model and promptFile records")
        else:
            if not str(asset.get("sourceUrl", "")).strip():
                errors.append(f"{prefix}: sourced asset requires sourceUrl")
            if not str(rights.get("credit", "")).strip():
                errors.append(f"{prefix}: sourced asset requires a credit line")

        src = str(asset.get("src", "")).strip()
        if base_dir and src and not (base_dir / src).is_file():
            fallback = str(asset.get("fallbackSrc", "")).strip()
            if not fallback or not (base_dir / fallback).is_file():
                missing_media.append(src)

    if missing_media:
        errors.append("Missing illustration files: " + ", ".join(sorted(set(missing_media))))

    unused = sorted(
        {illustration_id for illustration_id, asset in assets.items() if asset.get("status") == "approved"}
        - referenced_ids
    )
    if unused:
        warnings.append(f"Unused approved illustration assets: {len(unused)}")
    return errors, warnings, {
        "illustrations": len(assets),
        "illustrationReferences": len(referenced_ids),
    }


def validate(
    data: dict[str, Any],
    base_dir: Path | None = None,
    audio_dir: Path | None = None,
    *,
    editorial_rules: bool = False,
) -> ValidationResult:
    errors: list[str] = []
    warnings: list[str] = []
    paragraphs = [p for _, p in iter_paragraphs(data)]
    paragraph_ids = [p.get("id", "") for p in paragraphs]
    duplicate_ids = [key for key, count in Counter(paragraph_ids).items() if key and count > 1]
    if duplicate_ids:
        errors.append(f"Duplicate paragraph ids: {', '.join(duplicate_ids)}")
    if any(not item for item in paragraph_ids):
        errors.append("One or more paragraphs have no id.")

    catalogs = data.get("catalogs", {})
    maps = {item.get("id"): item for item in catalogs.get("maps", [])}
    raw_timeline = [item for item in catalogs.get("timeline", []) if isinstance(item, dict)]
    timeline = {item.get("id"): item for item in raw_timeline}
    timeline_ids = [str(item.get("id", "")).strip() for item in raw_timeline]
    duplicate_timeline_ids = [key for key, count in Counter(timeline_ids).items() if key and count > 1]
    if duplicate_timeline_ids:
        errors.append("Duplicate timeline ids: " + ", ".join(duplicate_timeline_ids))
    for event in raw_timeline:
        event_id = str(event.get("id", "unknown"))
        if not event_id:
            errors.append("One or more timeline events have no id.")
        errors.extend(validate_timeline_event(event, f"timeline {event_id}"))

    for paragraph in paragraphs:
        pid = paragraph.get("id", "unknown")
        refs = paragraph.get("mapRefs", [])
        if not refs:
            errors.append(f"{pid}: no chapter map references")
        for ref in refs:
            if ref not in maps:
                errors.append(f"{pid}: unknown map reference {ref}")
        timeline_refs = paragraph.get("timelineRefs", [])
        if not isinstance(timeline_refs, list):
            errors.append(f"{pid}: timelineRefs must be a list")
            timeline_refs = []
        if len(timeline_refs) > 5:
            errors.append(f"{pid}: has {len(timeline_refs)} timeline events (maximum 5)")
        if len(timeline_refs) != len(set(timeline_refs)):
            errors.append(f"{pid}: duplicate timeline references")
        for ref in timeline_refs:
            if ref not in timeline:
                errors.append(f"{pid}: unknown timeline reference {ref}")
        for sentence in paragraph.get("text", "").splitlines():
            if len(sentence) > 230:
                errors.append(f"{pid}: sentence line is {len(sentence)} characters (maximum 230)")
        if not paragraph.get("text", "").strip():
            errors.append(f"{pid}: empty text")

    if editorial_rules:
        for section in data.get("sections", []):
            section_paragraphs = section.get("paragraphs", [])
            if len(section_paragraphs) < 3:
                continue
            signatures = {
                tuple(paragraph.get("timelineRefs", []))
                for paragraph in section_paragraphs
            }
            if len(signatures) == 1 and next(iter(signatures), ()):
                errors.append(
                    f"{section.get('id', 'unknown')}: every paragraph repeats the same timeline references; "
                    "production timelines must be selected at paragraph level."
                )

    missing_media: list[str] = []
    if base_dir:
        for item in maps.values():
            src = item.get("src")
            if src and not (base_dir / src).is_file():
                fallback = item.get("fallbackSrc")
                if not fallback or not (base_dir / fallback).is_file():
                    missing_media.append(src)
            if item.get("type") == "interactive":
                for required in ("style", "archive", "terrainTiles", "plate", "view"):
                    if not item.get(required):
                        errors.append(f"{item.get('id', 'unknown map')}: interactive map lacks {required}")
                style = item.get("style")
                if style and not is_remote_reference(style) and not (base_dir / style).is_file():
                    errors.append(f"{item.get('id', 'unknown map')}: missing map style {style}")
                local_archive = item.get("localArchive")
                if local_archive and not (base_dir / local_archive).is_file():
                    errors.append(f"{item.get('id', 'unknown map')}: missing PMTiles archive {local_archive}")
        if missing_media:
            errors.append("Missing map files: " + ", ".join(missing_media))

    illustration_errors, illustration_warnings, illustration_summary = validate_illustrations(
        data, paragraphs, base_dir
    )
    errors.extend(illustration_errors)
    warnings.extend(illustration_warnings)

    audio_count = 0
    missing_audio: list[str] = []
    orphan_audio: list[str] = []
    if audio_dir:
        expected = {f"{pid}.mp3" for pid in paragraph_ids}
        present = {item.name for item in audio_dir.glob("*.mp3")}
        missing_audio = sorted(expected - present)
        orphan_audio = sorted(present - expected)
        audio_count = len(present)
        if missing_audio:
            errors.append(f"Missing audio for {len(missing_audio)} paragraph(s)")
        if orphan_audio:
            warnings.append(f"Orphan audio files: {len(orphan_audio)}")

    summary = {
        "schemaVersion": data.get("schemaVersion", 1),
        "sections": len(data.get("sections", [])),
        "paragraphs": len(paragraphs),
        "maps": len(maps),
        "timelineEvents": len(timeline),
        **illustration_summary,
        "audioFiles": audio_count,
        "errors": len(errors),
        "warnings": len(warnings),
    }
    return ValidationResult(errors, warnings, summary)


def optimize_map(source: Path, destination: Path, quality: int) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    command = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
        "-c:v", "libwebp", "-quality", str(quality), "-compression_level", "6", str(destination),
    ]
    subprocess.run(command, check=True)


def optimize_illustration(source: Path, destination: Path, quality: int, max_width: int) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    command = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
        "-vf", f"scale=w='min({max_width},iw)':h=-2",
        "-c:v", "libwebp", "-quality", str(quality), "-compression_level", "6", str(destination),
    ]
    subprocess.run(command, check=True)


def normalize_audio(source_dir: Path, destination_dir: Path) -> None:
    destination_dir.mkdir(parents=True, exist_ok=True)
    sources = sorted(source_dir.glob("*.mp3"))
    if not sources:
        raise BuildError(f"No MP3 files found in {source_dir}")
    for number, source in enumerate(sources, 1):
        destination = destination_dir / source.name
        command = [
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
            "-af", "loudnorm=I=-19:TP=-1.5:LRA=7", "-ar", "24000", "-ac", "1",
            "-c:a", "libmp3lame", "-b:a", "64k", str(destination),
        ]
        subprocess.run(command, check=True)
        if number % 25 == 0 or number == len(sources):
            print(f"audio {number}/{len(sources)}", flush=True)


def command_migrate(args: argparse.Namespace) -> int:
    source = Path(args.input).resolve()
    data = migrate_v1(read_json(source), args.id, args.webp_maps)
    write_json(Path(args.output).resolve(), data)
    write_js(Path(args.js_output).resolve(), data)
    print(json.dumps(data["stats"], indent=2))
    return 0


def command_build(args: argparse.Namespace) -> int:
    data = build_from_manifest(Path(args.manifest).resolve())
    print(json.dumps(data["stats"], indent=2))
    return 0


def command_release(args: argparse.Namespace) -> int:
    manifest_path = Path(args.manifest).resolve()
    manifest = read_json(manifest_path)
    data = build_from_manifest(manifest_path)
    root = manifest_path.parent
    output_json = (root / manifest["outputJson"]).resolve()
    audio_dir = (root / manifest["audioDir"]).resolve() if manifest.get("audioDir") else None
    report_path = (root / manifest["validationReport"]).resolve() if manifest.get("validationReport") else output_json.with_name("validation.json")
    production = release_mode(manifest) == PRODUCTION_RELEASE_MODE
    result = validate(data, output_json.parent, audio_dir, editorial_rules=production)
    errors = list(result.errors)
    warnings = list(result.warnings)
    source_errors, source_warnings, source_summary = validate_source_audit(
        manifest, root, data.get("sections", [])
    )
    errors.extend(source_errors)
    warnings.extend(source_warnings)
    if production and not manifest.get("illustrationPlan"):
        errors.append("Production release requires an illustrationPlan.")
    summary = {
        **result.summary,
        **source_summary,
        "releaseMode": release_mode(manifest),
        "errors": len(errors),
        "warnings": len(warnings),
    }
    report = {"summary": summary, "errors": errors, "warnings": warnings}
    write_json(report_path, report)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if errors else 0


def command_illustration_audit(args: argparse.Namespace) -> int:
    manifest_path = Path(args.manifest).resolve()
    manifest = read_json(manifest_path)
    data = build_from_manifest(manifest_path)
    root = manifest_path.parent
    output_json = (root / manifest["outputJson"]).resolve()
    paragraphs = [paragraph for _, paragraph in iter_paragraphs(data)]
    errors, warnings, summary = validate_illustrations(data, paragraphs, output_json.parent)
    if release_mode(manifest) == PRODUCTION_RELEASE_MODE and not manifest.get("illustrationPlan"):
        errors.append("Production release requires an illustrationPlan.")
    report = {
        "summary": {**summary, "errors": len(errors), "warnings": len(warnings)},
        "errors": errors,
        "warnings": warnings,
    }
    report_value = args.report or manifest.get("illustrationAuditReport")
    if report_value:
        report_path = Path(report_value)
        if not report_path.is_absolute():
            report_path = (root / report_path).resolve()
        write_json(report_path, report)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if errors else 0


def command_source_audit(args: argparse.Namespace) -> int:
    manifest_path = Path(args.manifest).resolve()
    manifest = read_json(manifest_path)
    data = build_from_manifest(manifest_path)
    errors, warnings, summary = validate_source_audit(
        manifest, manifest_path.parent, data.get("sections", [])
    )
    report = {
        "summary": {**summary, "errors": len(errors), "warnings": len(warnings)},
        "errors": errors,
        "warnings": warnings,
    }
    report_value = args.report or manifest.get("sourceAuditReport")
    if report_value:
        report_path = resolve_manifest_path(manifest_path.parent, str(report_value))
        write_json(report_path, report)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if errors else 0


def command_validate(args: argparse.Namespace) -> int:
    path = Path(args.input).resolve()
    data = read_json(path)
    result = validate(
        data,
        Path(args.base_dir).resolve() if args.base_dir else path.parent,
        Path(args.audio_dir).resolve() if args.audio_dir else None,
    )
    report = {"summary": result.summary, "errors": result.errors, "warnings": result.warnings}
    if args.report:
        write_json(Path(args.report).resolve(), report)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if result.errors else 0


def command_map(args: argparse.Namespace) -> int:
    optimize_map(Path(args.input).resolve(), Path(args.output).resolve(), args.quality)
    return 0


def command_illustration(args: argparse.Namespace) -> int:
    optimize_illustration(
        Path(args.input).resolve(),
        Path(args.output).resolve(),
        args.quality,
        args.max_width,
    )
    return 0


def command_audio(args: argparse.Namespace) -> int:
    normalize_audio(Path(args.input_dir).resolve(), Path(args.output_dir).resolve())
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)

    migrate = sub.add_parser("migrate", help="convert a legacy chapter to schema v2")
    migrate.add_argument("--input", required=True)
    migrate.add_argument("--output", required=True)
    migrate.add_argument("--js-output", required=True)
    migrate.add_argument("--id")
    migrate.add_argument("--webp-maps", action="store_true", help="use WebP map sources with legacy files as fallbacks")
    migrate.set_defaults(func=command_migrate)

    build = sub.add_parser("build", help="build JSON and JS from a chapter manifest")
    build.add_argument("--manifest", required=True)
    build.set_defaults(func=command_build)

    release = sub.add_parser("release", help="build and fully validate a manifest-defined chapter")
    release.add_argument("--manifest", required=True)
    release.set_defaults(func=command_release)

    illustration_audit = sub.add_parser(
        "audit-illustrations",
        help="verify illustration evidence, rights, assignments, audit gates, and files",
    )
    illustration_audit.add_argument("--manifest", required=True)
    illustration_audit.add_argument("--report")
    illustration_audit.set_defaults(func=command_illustration_audit)

    source_audit = sub.add_parser(
        "audit-source",
        help="verify OCR coverage, source accounting, and retention before production release",
    )
    source_audit.add_argument("--manifest", required=True)
    source_audit.add_argument("--report")
    source_audit.set_defaults(func=command_source_audit)

    check = sub.add_parser("validate", help="validate a built chapter")
    check.add_argument("--input", required=True)
    check.add_argument("--base-dir")
    check.add_argument("--audio-dir")
    check.add_argument("--report")
    check.set_defaults(func=command_validate)

    image = sub.add_parser("optimize-map", help="encode a map as compact WebP")
    image.add_argument("--input", required=True)
    image.add_argument("--output", required=True)
    image.add_argument("--quality", type=int, default=82)
    image.set_defaults(func=command_map)

    illustration = sub.add_parser("optimize-illustration", help="encode a web illustration without upscaling")
    illustration.add_argument("--input", required=True)
    illustration.add_argument("--output", required=True)
    illustration.add_argument("--quality", type=int, default=84)
    illustration.add_argument("--max-width", type=int, default=2000)
    illustration.set_defaults(func=command_illustration)

    audio = sub.add_parser("normalize-audio", help="loudness-normalize a chapter audio directory")
    audio.add_argument("--input-dir", required=True)
    audio.add_argument("--output-dir", required=True)
    audio.set_defaults(func=command_audio)
    return parser


def main() -> int:
    try:
        args = build_parser().parse_args()
        return args.func(args)
    except (BuildError, OSError, subprocess.CalledProcessError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
