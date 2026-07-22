/*
 * Static map runtime configuration.
 *
 * Leave assetBaseUrl empty while atlas assets are served by the same
 * Cloudflare Pages/GitHub site.  If the PMTiles archive and terrain directory
 * are moved to a public Cloudflare R2 bucket, set the public bucket prefix,
 * without a trailing slash, for example:
 *
 *   assetBaseUrl: "https://maps.example.org/ancient-japan"
 */
window.ANCIENT_JAPAN_MAP_CONFIG = Object.freeze({
  assetBaseUrl: "",
  assetVersion: "2026-07-21-hq3",
  maplibreVersion: "5.24.0",
  pmtilesVersion: "4.4.1",
  maplibreJs: "https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.js",
  maplibreCss: "https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css",
  pmtilesJs: "https://unpkg.com/pmtiles@4.4.1/dist/pmtiles.js",
  cooperativeGestures: true,
  directTouchNavigation: true,
  maxPixelRatio: 2,
  attribution: "Ancient Japan Study Atlas",
});
