# History Reader production kit

This folder is a GitHub Pages-ready reader and a reusable chapter-production
workflow. JSON is the canonical data file; the matching JavaScript file is
generated from it and is never edited by hand.

## One chapter, start to finish

1. Prepare the chapter manuscript in `CHAPTER / CONTENTS / SECTION` format.
   Keep one spoken sentence per line and a blank line between paragraphs.
2. Finalize paragraph ids, timeline metadata, genealogy references, and the two
   standing map preset keys. The web atlas is built once from the authoritative
   QGIS project; every paragraph reuses the relevant presets without duplicating
   map data.
3. Duplicate `ILLUSTRATION_PLAN_TEMPLATE.json` as `chXX-illustrations.json`.
   Give every paragraph a visual evidence brief and exactly one primary image.
4. Use an authentic source image only when it is exceptionally clear, directly
   relevant, and explicitly safe to republish. Otherwise create an
   evidence-constrained AI reconstruction. Authentic evidence may remain as a
   supporting image even when the reconstruction is primary.
5. Audit every image in a separate pass. Historical accuracy, visual quality,
   and rights must all be `approved`; the asset itself must then be `approved`.
6. Retain archival masters and prompt records in the chapter research folder.
   Put only optimized WebP derivatives in the chapter's `illustrations/`
   directory. A standard conversion is:

   `python tools/history_reader.py optimize-illustration --input MASTER --output WEB.webp`

7. Duplicate `config/chapter-template.json` and set the manuscript, metadata,
   illustration plan, map presets, audio, and output paths.
8. Generate one MP3 per paragraph. Its filename must be the paragraph id, such
   as `01.03-p007.mp3`.
9. Rebuild the web atlas after any approved GIS change:

   `python tools/build_web_atlas.py`

10. Run the dedicated illustration gate:

   `python tools/history_reader.py audit-illustrations --manifest config/your-chapter.json`

11. Build and validate the complete release:

   `python tools/history_reader.py release --manifest config/your-chapter.json`

12. Preview with byte-range support and inspect at iPad mini dimensions:

   `python tools/serve_reader.py`

A chapter is ready only when both commands report zero errors. The release
command rebuilds canonical JSON and matching JavaScript from the same sources.
For each chapter duplicate `config/chapter-template.json`,
`source/ancient-japan/CHAPTER_TEMPLATE.txt`,
`source/ancient-japan/SECTION_METADATA_TEMPLATE.json`, and
`source/ancient-japan/ILLUSTRATION_PLAN_TEMPLATE.json`. Use
`ILLUSTRATION_AUDIT_CHECKLIST.md` for the independent audit pass.

## Production safeguards

New chapters use `releaseMode: "production"`. Before prose begins, create a
verified raw OCR in the matching `H:/Ancient Japan History/chXX/` folder and a
`chXX-source-audit.json` ledger from `SOURCE_AUDIT_TEMPLATE.json`. The source
audit records page/OCR coverage, retained substance, legitimate omissions, and
all material supplemental research. It prevents an attractive but silently
abridged rewrite from passing as a completed chapter.

Production release requires `sourceOcr`, `sourceAudit`, and an
`illustrationPlan`; it also rejects a section whose paragraphs all reuse the
same non-empty timeline references. Run the full gate in this order:

`python tools/history_reader.py audit-source --manifest config/chXX.json`

`python tools/history_reader.py audit-illustrations --manifest config/chXX.json`

`python tools/history_reader.py release --manifest config/chXX.json`

`releaseMode: "pilot"` is permitted for technical experiments only. It is not
a content-complete chapter and must not be treated as a production benchmark.

Timeline metadata is keyed by paragraph id. Each event uses `start` and `end`
(identical for a point) and exactly one certainty value: `secure`,
`approximate`, `disputed`, or `traditional`. A paragraph normally shows only
the focal event or period plus useful adjacent context; it does not inherit an
entire section's date list.

The standard long-listening voice is `bm_lewis`: masculine, low, and played at
0.88 generation speed. The web reader then offers 0.75×–2× playback without
requiring a separate listening mode.

The builder stores each map preset and timeline event once. Every paragraph
still contains its chapter map references, so the two maps are shown beside
every paragraph without duplicating their full records hundreds of times. The
maps use MapLibre and PMTiles: labels, points, boundaries, and line weights
respond to zoom, while a compact WebP terrain pyramid preserves the relief
aesthetic. Static WebP and PNG maps remain automatic fallbacks.

The same rule applies to illustrations. `catalogs.illustrations` stores each
audited asset once, while `illustrationRefs` binds it to one or more paragraphs.
The reader displays a clean primary image followed by a swipeable supporting
gallery. Evidence, uncertainty, credit, and license information remain in a
collapsed panel; maps remain clean and are repeated for every paragraph. A
small touch-friendly **Map key** opens only on request and explains the marks
and line styles actually used by that preset, including when its static fallback
plate is shown.

## Media standards

- Maps: authoritative QGIS/GIS sources remain outside the web package. Publish
  one multi-layer PMTiles archive, WebP terrain tiles, and chapter presets,
  with the original WebP/PNG plates retained as automatic fallbacks. No title,
  caption, or permanent explanatory panel is added to the map surface. Each
  preset includes a compact, on-demand Map key for its marks and line styles.
- Illustrations: archival master and prompt/evidence records retained outside
  Git; sRGB WebP quality 84, normally no wider than 2000 pixels, lazy-loaded
  after the primary image.
- Audio: mono, 24 kHz, 64 kbps MP3, approximately -19 LUFS integrated and no
  higher than -1.5 dB true peak.
- Prose: one sentence per line; no sentence line longer than 230 characters.

## Legacy migration

`python tools/history_reader.py migrate --input old.json --output new.json --js-output new.js --id book-id`

This command removes repeated full map and timeline objects and replaces them
with catalog references without changing the prose. Legacy chapters without an
illustration plan remain readable; newly produced chapters use the mandatory
audited illustration stage.
