import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ATLAS = ROOT / "docs" / "Ancient Japan History" / "maps" / "atlas"
CHAPTER = ROOT / "docs" / "Ancient Japan History" / "ch01" / "ch01-data.json"
CHAPTER_TWO = ROOT / "docs" / "Ancient Japan History" / "ch02" / "ch02-data.json"


class WebAtlasTests(unittest.TestCase):
    def test_build_manifest_and_archive_are_ready(self):
        manifest = json.loads((ATLAS / "build-manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(manifest["status"], "ready")
        self.assertEqual(manifest["terrain"]["tiles"], 489)
        self.assertEqual(manifest["terrain"]["minZoom"], 3)
        self.assertEqual(manifest["terrain"]["maxZoom"], 8)
        archive = ATLAS / manifest["vectorArchive"]
        self.assertGreater(archive.stat().st_size, 1_000_000)
        self.assertEqual(archive.read_bytes()[:7], b"PMTiles")

    def test_all_qgis_atlas_presets_are_published(self):
        catalog = json.loads((ATLAS / "presets.json").read_text(encoding="utf-8"))
        self.assertEqual(len(catalog["presets"]), 23)
        for key in ("1a", "1b", "2a", "2b"):
            preset = catalog["presets"][key]
            self.assertEqual(preset["type"], "interactive")
            self.assertIn("bounds", preset["view"])
            self.assertEqual(preset["localArchive"], "../maps/atlas/ancient-japan-vector.pmtiles")
            self.assertIn("{z}/{x}/{y}", preset["localTerrainTiles"])
            self.assertEqual(
                [entry["symbol"] for entry in preset["legend"][:5]],
                ["terrain", "site", "region", "route", "river"],
            )
            self.assertTrue(all(entry["label"] and entry["detail"] for entry in preset["legend"]))

    def test_chapter_one_uses_interactive_maps_with_fallbacks(self):
        chapter = json.loads(CHAPTER.read_text(encoding="utf-8"))
        maps = chapter["catalogs"]["maps"]
        self.assertEqual([item["plate"] for item in maps], ["1a", "1b"])
        for item in maps:
            self.assertEqual(item["type"], "interactive")
            self.assertTrue(item["src"].endswith(".webp"))
            self.assertTrue(item["fallbackSrc"].endswith(".png"))
            self.assertTrue(item["standing"])
            self.assertTrue(item["legend"])

    def test_chapter_two_uses_interactive_maps_with_webp_fallbacks(self):
        chapter = json.loads(CHAPTER_TWO.read_text(encoding="utf-8"))
        maps = chapter["catalogs"]["maps"]
        self.assertEqual([item["plate"] for item in maps], ["2a", "2b"])
        self.assertTrue(all(item["type"] == "interactive" for item in maps))
        self.assertTrue(all(item["src"].endswith(".webp") for item in maps))
        self.assertTrue(all(item["standing"] and item["legend"] for item in maps))
        for section in chapter["sections"]:
            for paragraph in section["paragraphs"]:
                self.assertEqual(paragraph["mapRefs"], ["map-2a", "map-2b"])

    def test_style_has_zoom_responsive_historical_layers(self):
        style_text = (ATLAS / "ancient-japan-style.json").read_text(encoding="utf-8")
        style = json.loads(style_text)
        layer_ids = {layer["id"] for layer in style["layers"]}
        for required in (
            "terrain-relief",
            "rivers",
            "historical-regions",
            "historical-routes",
            "historical-site-labels",
        ):
            self.assertIn(required, layer_ids)
        self.assertIn("__ATLAS_ARCHIVE__", style_text)
        self.assertIn("__TERRAIN_TILES__", style_text)
        self.assertIn("interpolate", style_text)


if __name__ == "__main__":
    unittest.main()
