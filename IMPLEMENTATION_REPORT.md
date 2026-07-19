# History Reader optimization and Chapters 1–2 production delivery

## Delivered result

The repository now uses one unified read-and-listen screen. Each screen centers
one deliberately large paragraph and its matching audio controls. There is no
Reader/Listener switch. Continuous playback, seeking, ±10 seconds, and playback
speed remain available without moving away from the paragraph.

Every paragraph contains references to both standing chapter maps. The reader
therefore displays the relevant pair again for every paragraph, while each map
preset and shared atlas asset is stored only once. The maps carry no added
title, caption, provenance panel, or appended explanatory block. A compact
Map key opens only when requested and identifies the visible marks and line
styles. The maps are zoomable, with labels and features that adapt to scale;
static WebP/PNG plates remain automatic fallbacks and retain the same Map key.

## Ancient Japan, Chapter 1

Chapter 1 has been rebuilt as a source-audited production chapter from the
verified OCR. Its sections and paragraphs follow the material rather than a
fixed four-paragraph pattern.

- 16 sections, 116 synchronized paragraphs, and 9,864 manuscript words from a
  25,517-word primary OCR (38.66 percent retained, above the 35 percent gate).
- 64 deduplicated timeline events selected for paragraph-level contrast.
- 13 approved WebP illustrations with evidence, uncertainty, rights, and audit
  records, plus 116 synchronized audio files.
- Two Chapter 1 map presets linked to a 3.81 MiB, eleven-layer PMTiles archive
  and a 0.72 MiB relief pyramid of 489 WebP tiles; the original WebP/PNG plates
  remain fallbacks, and both presets are referenced by every paragraph.
- JSON and JavaScript are mechanically generated from the same canonical data.
- Production source, illustration, and release validation: zero errors and zero
  warnings.

The rewrite corrects several claims that have changed since the supplied survey
was written. It treats the first secure occupation as roughly 38,000 years ago,
places the earliest pottery in the closing Pleistocene, moves northern Kyushu's
early paddy agriculture to about the tenth century BC, and describes population
history through regional migration and admixture rather than bounded races.
The supporting primary research is recorded in
`source/ancient-japan/ch01-research-notes.md`.

## Ancient Japan, Chapter 2

Chapter 2 uses the corrected `ch2 - raw OCR.txt` as its primary textual source,
with the 55-page PDF rendered and inspected as a visual control. The chapter is
not abridged into uniform blocks: its sixteen sections contain six to ten
paragraphs according to the material.

- 16 sections, 134 synchronized paragraphs, and 9,798 manuscript words from a
  24,196-word primary OCR (40.49 percent retained, above the 35 percent gate).
- 39 deduplicated timeline events, with two varied adjacent or contrasting
  events attached to each paragraph rather than one repeated section set.
- 21 audited WebP illustrations; multi-person scenes pass a dedicated
  face-diversity gate against twin-like faces, cloned extras, mirrored bodies,
  and repeated templates.
- Two Chapter 2 atlas presets, `2a` and `2b`, are referenced by every paragraph.
  Clean 3000-pixel WebP plates provide automatic fallback without the printed
  title/provenance footer.
- 134 synchronized MP3 files are present; the reader remains compatible with a
  user-supplied replacement audio batch using the same paragraph filenames.
- Production source, illustration, and release validation: zero errors and zero
  warnings.

## China in Antiquity migration

- All 31 sections and 155 paragraphs are preserved.
- Schema v2 stores two maps and 90 distinct timeline events once, then uses
  paragraph references instead of repeating full objects.
- The canonical JSON fell from 383,657 to 180,316 bytes; the web JavaScript is
  135,720 bytes.
- The two WebP maps total about 1.7 MiB instead of about 17.0 MiB for the PNG
  originals; PNG files remain only as compatibility fallbacks.
- The 155 audio files retain their timing but use consistent long-listening
  loudness and 64 kbps mono encoding. Their total size fell by 50 percent, from
  89,761,060 to 44,884,095 bytes.
- Final content/media validation: zero errors and zero warnings.

## Reader improvements

- Current paragraph now precedes timeline, genealogy, figures, and maps.
- Generous typography is preserved: about 31 px on iPad mini portrait and 33 px
  on desktop, with calmer left alignment and comfortable line spacing.
- iPad mini portrait test at 744 × 1133 CSS pixels showed no page-width overflow.
- The complete first paragraph and its audio controls fit together in the first
  screen; the timeline no longer pushes the paragraph below the viewport.
- Timelines scroll horizontally on narrow screens rather than being clipped.
- Dark, paper, and sepia themes are genuinely distinct and retain contrast.
- Progress slider, elapsed/total time, ±10-second controls, and 0.75×–2× speed.
- Saved paragraph and playback position, URL paragraph links, and boundary-aware
  Previous/Next buttons.
- Media Session support for iPad lock-screen playback where the browser permits.
- Accessible focus rings, section `aria-current`, sidebar state, reduced-motion
  support, and keyboard operation.
- JavaScript data loading no longer evaluates downloaded source with
  `new Function`; chapter JavaScript is loaded as a normal static script.
- Versioned CSS and JavaScript URLs reduce stale GitHub Pages caching.
- Browser tests passed for Ancient Japan at iPad mini dimensions, including
  paragraph/audio coupling, manual Next navigation, illustration loading,
  scalable-map initialization, immediate WebP fallback, and the map legend.

## Scalable Ancient Japan atlas

- The QGIS project remains the source of truth. `tools/build_web_atlas.py`
  converts its approved FlatGeobuf/CSV layers into one static PMTiles archive,
  renders the relief/background into an XYZ WebP pyramid, extracts all 23 atlas
  views into `presets.json`, and writes a checksummed build manifest.
- The browser loads MapLibre GL JS and PMTiles only when an interactive map
  approaches the viewport. This keeps paragraph and audio startup light.
- Eleven vector layers cover land, lakes, primary rivers, historical sites,
  regions, routes, provinces, study labels, reference labels, and chapter
  routes. Text sizes, line widths, visibility, and label density vary with zoom.
- Historical uncertainty is retained through dashed or translucent styling.
  Modern national boundaries are not introduced into prehistoric views.
- Touch controls are at least 44 CSS pixels, rotation and pitch are disabled,
  cooperative gestures prevent accidental page trapping, and maps fit the
  generous iPad mini reading layout.
- Every atlas preset supplies a context-aware legend. The closed key leaves the
  geography unobscured; its symbols match relief, site dots, interpretive
  regions, schematic routes, rivers, and—where enabled—province boundaries.
- Same-site static assets work on Cloudflare Pages with no service or database.
  An optional R2 publisher is supplied if later chapters make the atlas too
  large for the normal Pages deployment.

## Integrated audited illustration production

- Illustration work is mandatory for newly produced chapters unless the user
  explicitly opts out; it is no longer deferred to a later application request.
- The default is an evidence-constrained AI reconstruction whenever a sourced
  image is not exceptionally clear, direct, high-quality, and rights-safe.
- Important authentic evidence can remain as a supporting image while a
  reconstruction provides setting, scale, use, dress, architecture, or action.
- `chXX-illustrations.json` is the canonical plan, evidence ledger, rights
  register, audit record, asset catalog, and paragraph assignment file.
- The builder deduplicates illustration assets into `catalogs.illustrations`
  and writes compact `illustrationRefs` into paragraphs.
- Publication requires separate historical, visual, and rights approvals. The
  validator rejects incomplete evidence briefs, missing sources and exclusions,
  ambiguous rights, unapproved audits, bad references, excessive density,
  missing alt text, and missing web files.
- Multi-person generation now assigns distinct facial geometry, age, build,
  hairline or hairstyle, expression, gaze, and pose before rendering. The audit
  rejects twin-like or cloned people rather than accepting superficial costume
  variation.
- `audit-illustrations` provides a dedicated pre-release gate, while `release`
  repeats the checks as part of complete chapter validation.
- The iPad reader presents one clean primary image and a horizontally swipeable
  supporting gallery. Evidence, uncertainty, credit, and license information
  remain collapsed; audio continues in the same read-and-listen view.
- Maps remain unchanged: the relevant pair is reproduced for every paragraph
  without visible titles, captions, or provenance panels. The only map control
  added to the surface is the compact, optional Map key.

## The optimized chapter workflow

1. Review the source PDF and OCR together; render a contact sheet and inspect
   every map/figure page.
2. Record only research changes that materially affect the source's chronology,
   evidence, or interpretation.
3. Write the finished narration in the standard manuscript template, one spoken
   sentence per line and one blank line per synchronized paragraph.
4. Create the chapter illustration manifest, acquire only exceptionally clean
   and rights-safe source images, and generate the remaining evidence-led
   reconstructions.
5. Perform the independent historical, visual, and rights audit, optimize the
   approved web derivatives, and bind them to paragraph ids.
6. Select the chapter's standing atlas presets and add paragraph-level
   timeline metadata plus chapter-level genealogy data to one manifest.
7. If GIS content changed, run `build_web_atlas.py`; audit the resulting presets
   and zoom levels against the QGIS atlas specification.
8. Build JSON and JavaScript together with the generic builder.
9. Generate one low-voice MP3 per paragraph using the fixed audio profile.
10. Run `history_reader.py audit-illustrations`, followed by
   `history_reader.py release`; do not deliver unless both report zero errors.
11. Serve locally and verify the real reader, including map zoom and static
    fallback behavior, at 744 × 1133 and at desktop size.

For the next chapter, duplicate the four template files in `config/` and
`source/ancient-japan/`, including the illustration plan, replace the chapter
number and content, then use the same build, audit, audio, validation, and
device-test tools. No chapter-specific Python script or hand-edited JavaScript
data file is needed.

## Deployment

Run the guarded installer in the parent delivery folder. It verifies the exact
F:/H: targets, backs up overwritten files, installs the reader/GIS/project
updates, and reports the backup location. Review `git status`, run the release
validation, and commit. Cloudflare Pages can serve `docs` directly; see
`cloudflare/README.md` for the optional R2 route.
