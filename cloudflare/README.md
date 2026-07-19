# Cloudflare deployment

The reader remains a static site. Cloudflare Pages serves `docs`; the optional
R2 bucket serves only the heavier web-atlas assets.

## Cloudflare Pages

For the GitHub-linked Pages project use:

- Production branch: the repository's normal publication branch
- Build command: leave empty
- Build output directory: `docs`
- Root directory: repository root

The repository-supplied `docs/_headers` file adds safe browser headers and a
long immutable cache lifetime for versioned atlas assets.

## Optional R2 atlas storage

The Chapter 1 pilot works with same-site assets and therefore needs no R2
configuration. Move the following paths to R2 only if the full atlas becomes
too large for the Pages deployment:

```text
ancient-japan-vector.pmtiles
terrain/
```

Configure the R2 bucket for public reads and CORS `GET`/`HEAD` requests. Expose
the `ETag`, `Accept-Ranges`, and `Content-Range` headers. Then set
`assetBaseUrl` in:

```text
docs/Ancient Japan History/map-runtime-config.js
```

The public prefix should contain the archive and `terrain` directory directly.
The application code, style, presets, fallbacks, audio, and text remain in the
GitHub repository.

## Publishing with Wrangler

`tools/publish_web_atlas.ps1` uploads the archive and all terrain tiles without
storing Cloudflare credentials in the repository. Authenticate Wrangler on the
machine, then run:

```powershell
.\tools\publish_web_atlas.ps1 -Bucket ancient-japan-atlas
```

Pass `-DryRun` first to inspect the exact upload set.
