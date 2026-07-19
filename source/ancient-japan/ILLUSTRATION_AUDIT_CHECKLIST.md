# Illustration audit gate

No image may be marked `approved` until all three audit fields are approved.

## Historical audit

- The image matches the paragraph's date range, place, climate, season, and landscape.
- Architecture, tools, weapons, vessels, pottery, textiles, ornaments, crops, and animals are supported for that context.
- Clothing, hair, posture, social roles, and bodily presentation avoid modern or generic “ancient Asian” assumptions.
- Archaeology, contemporary testimony, later chronicle, later depiction, myth, and modern interpretation remain distinct.
- The evidence brief records the principal sources, material uncertainties, and excluded anachronisms.
- A named person without a contemporary likeness is described as an interpretive reconstruction, not a portrait.
- Ritual, belief, emotion, motive, violence, and ceremony are not presented with greater certainty than the evidence permits.

## Visual audit

- The image is clear and immediately useful at iPad mini size.
- It has documentary legibility, natural materials, restrained light, and an austere palette.
- It contains no fantasy glow, anime conventions, generic exoticism, excessive monumentality, modern cosmetics, or decorative pseudo-history.
- Anatomy, hands, faces, tools, joinery, perspective, inscriptions, repeated people, and background structures have been inspected closely.
- The primary subject remains legible after conversion to the web derivative.
- The alt text describes what is visibly present; the caption states the historical status without pretending certainty.

## Rights audit

- A sourced image has a stable original page, exact reuse status, license, credit line, institution, and access date.
- “Visible online” has not been treated as permission to republish.
- Cropping or color correction is permitted by the license.
- AI-generated material records the model, prompt file, evidence brief, and project-generated rights status.
- The archival master remains outside the web repository; only the optimized derivative is published.

## Publication gate

- Every illustrated paragraph has exactly one `primary` reference and no more than the policy maximum.
- Every referenced asset is `approved` and all three audit fields are `approved`.
- `python tools/history_reader.py audit-illustrations --manifest config/chXX.json` reports zero errors.
- `python tools/history_reader.py release --manifest config/chXX.json` reports zero errors.
