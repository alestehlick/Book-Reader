#!/usr/bin/env python3
"""Build the static, zoom-aware Ancient Japan web atlas.

The authoritative GIS data remain in QGIS/GeoPackage/FlatGeobuf.  This build
creates browser delivery assets only:

* one multi-layer vector PMTiles archive;
* a compact XYZ/WebP terrain pyramid;
* a preset catalog derived from the 23 QGIS atlas specifications; and
* a checksummed validation manifest.

No network access or map server is required.  GDAL 3.8+ is required for its
PMTiles writer; the configured QGIS 3.44 runtime already provides GDAL 3.12.
"""

from __future__ import annotations

import argparse
import ast
import hashlib
import html
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any


DEFAULT_GIS_ROOT = Path(r"F:\GIS\Japan_Ancient_Heian")
DEFAULT_READER_ROOT = Path(r"F:\Book-Reader\GitHub\Book-Reader")
DEFAULT_QGIS_ROOT = Path(r"F:\QGIS 3.44.9")
ATLAS_RELATIVE_DIR = Path("docs") / "Ancient Japan History" / "maps" / "atlas"


class AtlasBuildError(RuntimeError):
    pass


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def run(command: list[str], *, env: dict[str, str] | None = None) -> str:
    printable = " ".join(f'"{part}"' if " " in part else part for part in command)
    print(f"atlas: {printable}", flush=True)
    result = subprocess.run(
        command,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        env=env,
        check=False,
    )
    if result.stdout:
        print(result.stdout.rstrip(), flush=True)
    if result.returncode:
        raise AtlasBuildError(f"Command failed with exit code {result.returncode}: {printable}")
    return result.stdout


def require_file(path: Path, label: str) -> Path:
    if not path.is_file():
        raise AtlasBuildError(f"{label} not found: {path}")
    return path


def require_dir(path: Path, label: str) -> Path:
    if not path.is_dir():
        raise AtlasBuildError(f"{label} not found: {path}")
    return path


def qgis_environment(qgis_root: Path) -> dict[str, str]:
    env = dict(os.environ)
    path_parts = [
        qgis_root / "bin",
        qgis_root / "apps" / "Python312",
        qgis_root / "apps" / "Python312" / "Scripts",
    ]
    env["PATH"] = os.pathsep.join(str(item) for item in path_parts) + os.pathsep + env.get("PATH", "")
    env["OSGEO4W_ROOT"] = str(qgis_root)
    env["GDAL_DATA"] = str(qgis_root / "share" / "gdal")
    env["PROJ_LIB"] = str(qgis_root / "share" / "proj")
    env.setdefault("GDAL_NUM_THREADS", "ALL_CPUS")
    return env


def ogr_vrt_layer(name: str, source: Path, source_layer: str, sql: str | None = None) -> str:
    sql_xml = f'<SrcSQL dialect="OGRSQL">{html.escape(sql)}</SrcSQL>' if sql else f"<SrcLayer>{html.escape(source_layer)}</SrcLayer>"
    return f"""  <OGRVRTLayer name=\"{html.escape(name)}\">
    <SrcDataSource relativeToVRT=\"0\">{html.escape(str(source))}</SrcDataSource>
    {sql_xml}
  </OGRVRTLayer>"""


def csv_point_vrt_layer(name: str, source: Path) -> str:
    return f"""  <OGRVRTLayer name=\"{html.escape(name)}\">
    <SrcDataSource relativeToVRT=\"0\">{html.escape(str(source))}</SrcDataSource>
    <SrcLayer>{html.escape(source.stem)}</SrcLayer>
    <GeometryType>wkbPoint</GeometryType>
    <LayerSRS>EPSG:4326</LayerSRS>
    <GeometryField encoding=\"PointFromColumns\" x=\"lon\" y=\"lat\"/>
  </OGRVRTLayer>"""


def csv_wkt_vrt_layer(name: str, source: Path) -> str:
    return f"""  <OGRVRTLayer name=\"{html.escape(name)}\">
    <SrcDataSource relativeToVRT=\"0\">{html.escape(str(source))}</SrcDataSource>
    <SrcLayer>{html.escape(source.stem)}</SrcLayer>
    <GeometryType>wkbLineString</GeometryType>
    <LayerSRS>EPSG:4326</LayerSRS>
    <GeometryField encoding=\"WKT\" field=\"wkt\"/>
  </OGRVRTLayer>"""


def csv_polygon_vrt_layer(name: str, source: Path) -> str:
    return f"""  <OGRVRTLayer name=\"{html.escape(name)}\">
    <SrcDataSource relativeToVRT=\"0\">{html.escape(str(source))}</SrcDataSource>
    <SrcLayer>{html.escape(source.stem)}</SrcLayer>
    <GeometryType>wkbPolygon</GeometryType>
    <LayerSRS>EPSG:4326</LayerSRS>
    <GeometryField encoding=\"WKT\" field=\"wkt\"/>
  </OGRVRTLayer>"""


def build_vrt(
    gis_root: Path,
    reader_root: Path,
    temp_dir: Path,
) -> tuple[Path, dict[str, dict[str, Any]]]:
    rebuild = gis_root / "rebuild_v2"
    map_data = reader_root / "tools" / "map_data"
    sources = {
        "land": require_file(gis_root / "base" / "readonly" / "land_high.fgb", "coastline layer"),
        "reference_labels": require_file(gis_root / "base" / "readonly" / "reference_labels.fgb", "reference labels"),
        "lakes": require_file(gis_root / "hydro" / "readonly" / "lakes.fgb", "lake layer"),
        "rivers": require_file(gis_root / "hydro" / "readonly" / "river_segments_named.fgb", "river layer"),
        "sites": require_file(gis_root / "historical" / "readonly" / "historical_sites.fgb", "historical sites"),
        "regions": require_file(gis_root / "historical" / "readonly" / "historical_regions.fgb", "historical regions"),
        "routes": require_file(gis_root / "historical" / "readonly" / "historical_routes.fgb", "historical routes"),
        "provinces": require_file(gis_root / "historical" / "readonly" / "ritsuryo_provinces_proxy.fgb", "province proxy"),
        "province_labels": require_file(gis_root / "historical" / "readonly" / "ritsuryo_province_labels.fgb", "province labels"),
        "study_labels": require_file(rebuild / "data" / "study_labels.csv", "study labels"),
        "chapter_routes": require_file(rebuild / "data" / "chapter_routes.csv", "chapter routes"),
        "ch01_features": require_file(map_data / "ch01-features.csv", "Chapter 1 semantic features"),
        "ch01_routes": require_file(map_data / "ch01-routes.csv", "Chapter 1 narrative routes"),
        "ch01_regions": require_file(map_data / "ch01-regions.csv", "Chapter 1 interpretive regions"),
    }

    layers = [
        ogr_vrt_layer(
            "land",
            sources["land"],
            "land_high",
            "SELECT id, level, source, area FROM land_high",
        ),
        ogr_vrt_layer("reference_labels", sources["reference_labels"], "reference_labels"),
        ogr_vrt_layer("lakes", sources["lakes"], "lakes"),
        ogr_vrt_layer(
            "rivers_primary",
            sources["rivers"],
            "river_segments_named",
            "SELECT river_code, water_system_code, river_class_code, name_ja, river_type_code "
            "FROM river_segments_named WHERE river_class_code = '1' AND river_type_code LIKE '%1%'",
        ),
        ogr_vrt_layer("historical_sites", sources["sites"], "historical_sites"),
        ogr_vrt_layer("historical_regions", sources["regions"], "historical_regions"),
        ogr_vrt_layer("historical_routes", sources["routes"], "historical_routes"),
        ogr_vrt_layer("ritsuryo_provinces", sources["provinces"], "ritsuryo_provinces_proxy"),
        ogr_vrt_layer("ritsuryo_province_labels", sources["province_labels"], "ritsuryo_province_labels"),
        csv_point_vrt_layer("study_labels", sources["study_labels"]),
        csv_wkt_vrt_layer("chapter_routes", sources["chapter_routes"]),
        csv_point_vrt_layer("ch01_features", sources["ch01_features"]),
        csv_wkt_vrt_layer("ch01_routes", sources["ch01_routes"]),
        csv_polygon_vrt_layer("ch01_regions", sources["ch01_regions"]),
    ]
    vrt = temp_dir / "ancient-japan-web-atlas.vrt"
    vrt.write_text("<OGRVRTDataSource>\n" + "\n".join(layers) + "\n</OGRVRTDataSource>\n", encoding="utf-8")

    config = {
        "land": {"minzoom": 3, "maxzoom": 9, "description": "GSHHG coastline and land"},
        "reference_labels": {"minzoom": 3, "maxzoom": 9, "description": "English seas and island labels"},
        "lakes": {"minzoom": 5, "maxzoom": 9, "description": "MLIT lakes"},
        "rivers_primary": {"minzoom": 5, "maxzoom": 9, "description": "MLIT primary rivers"},
        "historical_sites": {"minzoom": 4, "maxzoom": 9, "description": "Curated historical and archaeological sites"},
        "historical_regions": {"minzoom": 3, "maxzoom": 9, "description": "Interpretive historical regions"},
        "historical_routes": {"minzoom": 3, "maxzoom": 9, "description": "Interpretive historical routes"},
        "ritsuryo_provinces": {"minzoom": 5, "maxzoom": 9, "description": "Ritsuryo province proxy"},
        "ritsuryo_province_labels": {"minzoom": 5, "maxzoom": 9, "description": "English province labels"},
        "study_labels": {"minzoom": 3, "maxzoom": 9, "description": "Corpus-linked English study labels"},
        "chapter_routes": {"minzoom": 3, "maxzoom": 9, "description": "Chapter-linked schematic movement corridors"},
        "ch01_features": {"minzoom": 3, "maxzoom": 9, "description": "Chapter 1 prose-linked semantic features"},
        "ch01_routes": {"minzoom": 3, "maxzoom": 9, "description": "Chapter 1 evidence-aware narrative routes"},
        "ch01_regions": {"minzoom": 3, "maxzoom": 9, "description": "Chapter 1 interpretive distributions and candidate fields"},
    }
    return vrt, config


def build_vector_archive(
    gis_root: Path,
    reader_root: Path,
    qgis_root: Path,
    output_dir: Path,
    temp_dir: Path,
) -> Path:
    vrt, layer_config = build_vrt(gis_root, reader_root, temp_dir)
    conf = temp_dir / "pmtiles-layers.json"
    write_json(conf, layer_config)
    temporary_archive = temp_dir / "ancient-japan-vector.pmtiles"
    ogr2ogr = require_file(qgis_root / "bin" / "ogr2ogr.exe", "GDAL ogr2ogr")
    run(
        [
            str(ogr2ogr),
            "-f", "PMTiles",
            str(temporary_archive),
            str(vrt),
            "-dsco", "NAME=Ancient Japan Study Atlas",
            "-dsco", "DESCRIPTION=Zoom-aware study layers for Japan through 1185",
            "-dsco", "TYPE=baselayer",
            "-dsco", "MINZOOM=3",
            "-dsco", "MAXZOOM=9",
            "-dsco", f"CONF={conf}",
            "-dsco", "SIMPLIFICATION=1.0",
            "-dsco", "SIMPLIFICATION_MAX_ZOOM=0.35",
            "-dsco", "BUFFER=96",
            "-dsco", "MAX_SIZE=750000",
        ],
        env=qgis_environment(qgis_root),
    )
    target = output_dir / temporary_archive.name
    target.parent.mkdir(parents=True, exist_ok=True)
    os.replace(temporary_archive, target)
    return target


def safe_replace_directory(source: Path, target: Path, permitted_parent: Path) -> None:
    resolved_target = target.resolve()
    resolved_parent = permitted_parent.resolve()
    if resolved_target.parent != resolved_parent:
        raise AtlasBuildError(f"Refusing to replace unexpected directory: {resolved_target}")

    # Copy into a sibling staging directory created under the publication
    # parent. On Windows this makes every generated directory inherit the
    # reader repository ACL instead of retaining a protected ACL from the
    # isolated temporary build directory.
    staging = Path(tempfile.mkdtemp(prefix=f".{target.name}-staging-", dir=resolved_parent))
    try:
        for item in source.iterdir():
            destination = staging / item.name
            if item.is_dir():
                shutil.copytree(item, destination)
            else:
                shutil.copy2(item, destination)
        if target.exists():
            shutil.rmtree(target)
        os.replace(staging, target)
    except Exception:
        if staging.exists():
            shutil.rmtree(staging)
        raise


def build_terrain_tiles(gis_root: Path, qgis_root: Path, output_dir: Path, temp_dir: Path) -> Path:
    derived = gis_root / "derived"
    bathymetry = require_file(derived / "gebco_2026_bathymetry_color_lcc_600m.tif", "bathymetry color raster")
    land = require_file(derived / "japan_land_color_lcc_180m.tif", "land color raster")
    gdalbuildvrt = require_file(qgis_root / "bin" / "gdalbuildvrt.exe", "GDAL gdalbuildvrt")
    gdalwarp = require_file(qgis_root / "bin" / "gdalwarp.exe", "GDAL gdalwarp")
    gdal2tiles = require_file(qgis_root / "apps" / "Python312" / "Scripts" / "gdal2tiles.bat", "GDAL gdal2tiles")
    env = qgis_environment(qgis_root)

    composite = temp_dir / "terrain-composite.vrt"
    webmercator = temp_dir / "terrain-webmercator.tif"
    tile_dir = temp_dir / "terrain"
    run(
        [str(gdalbuildvrt), "-resolution", "highest", "-addalpha", str(composite), str(bathymetry), str(land)],
        env=env,
    )
    run(
        [
            str(gdalwarp),
            "-overwrite",
            "-t_srs", "EPSG:3857",
            "-te_srs", "EPSG:4326",
            "-te", "118.5", "25.5", "148", "46.5",
            "-tr", "450", "450",
            "-r", "bilinear",
            "-dstalpha",
            "-multi",
            "-co", "TILED=YES",
            "-co", "COMPRESS=DEFLATE",
            "-co", "BIGTIFF=IF_SAFER",
            str(composite),
            str(webmercator),
        ],
        env=env,
    )
    run(
        [
            str(gdal2tiles),
            "--zoom=3-8",
            "--xyz",
            "--processes=4",
            "--webviewer=none",
            "--resampling=bilinear",
            "--tiledriver=WEBP",
            "--webp-quality=78",
            "--exclude",
            str(webmercator),
            str(tile_dir),
        ],
        env=env,
    )
    target = output_dir / "terrain"
    safe_replace_directory(tile_dir, target, output_dir)
    return target


def simple_ast_value(node: ast.AST, colors: dict[str, str]) -> Any:
    if isinstance(node, ast.Name):
        return colors.get(node.id, node.id)
    return ast.literal_eval(node)


def extract_qgis_map_specs(builder_path: Path) -> list[dict[str, Any]]:
    tree = ast.parse(builder_path.read_text(encoding="utf-8"))
    assignment = next(
        (
            item
            for item in tree.body
            if isinstance(item, ast.Assign)
            and any(isinstance(target, ast.Name) and target.id == "MAPS" for target in item.targets)
        ),
        None,
    )
    if not assignment or not isinstance(assignment.value, ast.List):
        raise AtlasBuildError(f"Could not locate MAPS in {builder_path}")
    colors = {
        "CINNABAR": "#A64B3C",
        "INDIGO": "#334D6D",
        "PLUM": "#76505F",
        "UMBER": "#80634E",
        "GOLD": "#B69149",
    }
    specs: list[dict[str, Any]] = []
    for element in assignment.value.elts:
        if not isinstance(element, ast.Call) or not isinstance(element.func, ast.Name) or element.func.id != "dict":
            continue
        specs.append({keyword.arg: simple_ast_value(keyword.value, colors) for keyword in element.keywords if keyword.arg})
    if len(specs) != 23:
        raise AtlasBuildError(f"Expected 23 map specifications, found {len(specs)}")
    return specs


def build_presets(gis_root: Path, reader_root: Path, output_dir: Path) -> Path:
    builder = require_file(gis_root / "rebuild_v2" / "scripts" / "build_qgis_atlas_v2.py", "QGIS atlas builder")
    specs = extract_qgis_map_specs(builder)
    presets: dict[str, Any] = {}
    for spec in specs:
        west, south, east, north = spec["extent"]
        key = str(spec["study_key"])
        legend = [
            {
                "symbol": "terrain",
                "label": "Relief and water",
                "detail": "Terrain and water orient the view; neither marks a historical boundary.",
            },
            {
                "symbol": "site",
                "label": "Selected sites and study places",
                "detail": "Dots are chapter-selected archaeological, historical, or thematic anchors.",
            },
            {
                "symbol": "region",
                "label": "Approximate historical zone",
                "detail": "Tint and dashed edge mark an interpretive extent, not a fixed frontier.",
            },
            {
                "symbol": "route",
                "label": "Route or connection",
                "detail": "Dashed cinnabar lines mark schematic historical or chapter-specific connections.",
            },
            {
                "symbol": "river",
                "label": "Major river",
                "detail": "Blue lines appear as the map is enlarged.",
            },
        ]
        if bool(spec["provinces"]):
            legend.append(
                {
                    "symbol": "province",
                    "label": "Province boundary",
                    "detail": "A later historical proxy, shown only as an administrative guide.",
                }
            )
        presets[key] = {
            "type": "interactive",
            "style": "../maps/atlas/ancient-japan-style.json",
            "archive": "ancient-japan-vector.pmtiles",
            "localArchive": "../maps/atlas/ancient-japan-vector.pmtiles",
            "terrainTiles": "terrain/{z}/{x}/{y}.webp",
            "localTerrainTiles": "../maps/atlas/terrain/{z}/{x}/{y}.webp",
            "plate": key,
            "period": spec["period"],
            "sitePeriods": spec["site_periods"],
            "date": spec["date"],
            "accent": spec["accent"],
            "showProvinces": bool(spec["provinces"]),
            "legend": legend,
            "view": {
                "bounds": [[west, south], [east, north]],
                "minZoom": 3,
                "maxZoom": 9,
            },
            "metadata": {
                "slug": spec["slug"],
                "plateLabel": spec["plate_label"],
                "note": spec["note"],
            },
        }

    chapter_scene_catalog = read_json(
        require_file(
            reader_root / "tools" / "map_data" / "ch01-scenes.json",
            "Chapter 1 scene catalog",
        )
    )
    for key, raw_scene in chapter_scene_catalog.get("scenes", {}).items():
        scene = dict(raw_scene)
        scene_metadata = dict(scene.pop("metadata", {}))
        presets[str(key)] = {
            "type": "interactive",
            "style": "../maps/atlas/ancient-japan-style.json",
            "archive": "ancient-japan-vector.pmtiles",
            "localArchive": "../maps/atlas/ancient-japan-vector.pmtiles",
            "terrainTiles": "terrain/{z}/{x}/{y}.webp",
            "localTerrainTiles": "../maps/atlas/terrain/{z}/{x}/{y}.webp",
            "sprite": "ch01-symbols",
            "localSprite": "../maps/atlas/ch01-symbols",
            "plate": str(key),
            "showProvinces": False,
            **scene,
            "metadata": {
                "slug": str(key),
                "plateLabel": "",
                "note": "Scene filters and visual hierarchy are derived from the Chapter 1 prose.",
                **scene_metadata,
            },
        }
    output = output_dir / "presets.json"
    write_json(
        output,
        {
            "schemaVersion": 2,
            "atlas": "ancient-japan",
            "presets": presets,
        },
    )
    return output


def build_manifest(output_dir: Path, archive: Path | None, terrain: Path | None, presets: Path) -> Path:
    artifacts: list[dict[str, Any]] = []
    for item in [
        archive,
        presets,
        output_dir / "ancient-japan-style.json",
        output_dir / "ch01-symbols.png",
        output_dir / "ch01-symbols.json",
        output_dir / "ch01-symbols@2x.png",
        output_dir / "ch01-symbols@2x.json",
    ]:
        if item and item.is_file():
            artifacts.append(
                {
                    "path": item.relative_to(output_dir).as_posix(),
                    "bytes": item.stat().st_size,
                    "sha256": sha256(item),
                }
            )
    tile_files = list(terrain.rglob("*.webp")) if terrain and terrain.is_dir() else []
    manifest = {
        "schemaVersion": 1,
        "status": "ready",
        "vectorArchive": archive.name if archive else None,
        "terrain": {
            "template": "terrain/{z}/{x}/{y}.webp" if terrain else None,
            "minZoom": 3,
            "maxZoom": 8,
            "tiles": len(tile_files),
            "bytes": sum(item.stat().st_size for item in tile_files),
        },
        "artifacts": artifacts,
    }
    output = output_dir / "build-manifest.json"
    write_json(output, manifest)
    return output


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--gis-root", type=Path, default=DEFAULT_GIS_ROOT)
    parser.add_argument("--reader-root", type=Path, default=DEFAULT_READER_ROOT)
    parser.add_argument("--qgis-root", type=Path, default=DEFAULT_QGIS_ROOT)
    parser.add_argument("--output", type=Path, help="override output atlas directory")
    parser.add_argument("--skip-vector", action="store_true")
    parser.add_argument("--skip-terrain", action="store_true")
    return parser.parse_args()


def build_ch01_sprites(reader_root: Path, output_dir: Path) -> None:
    builder = require_file(reader_root / "tools" / "build_ch01_sprites.py", "Chapter 1 sprite builder")
    run([sys.executable, str(builder), "--output", str(output_dir)])


def main() -> int:
    args = parse_args()
    gis_root = require_dir(args.gis_root.resolve(), "GIS root")
    reader_root = require_dir(args.reader_root.resolve(), "Book Reader root")
    qgis_root = require_dir(args.qgis_root.resolve(), "QGIS root")
    output_dir = (args.output.resolve() if args.output else (reader_root / ATLAS_RELATIVE_DIR).resolve())
    output_dir.mkdir(parents=True, exist_ok=True)
    style = output_dir / "ancient-japan-style.json"
    require_file(style, "MapLibre style template")

    archive: Path | None = None
    terrain: Path | None = None
    with tempfile.TemporaryDirectory(prefix="ancient-japan-web-atlas-") as raw_temp:
        temp_dir = Path(raw_temp)
        if not args.skip_vector:
            archive = build_vector_archive(gis_root, reader_root, qgis_root, output_dir, temp_dir)
        elif (output_dir / "ancient-japan-vector.pmtiles").is_file():
            archive = output_dir / "ancient-japan-vector.pmtiles"
        if not args.skip_terrain:
            terrain = build_terrain_tiles(gis_root, qgis_root, output_dir, temp_dir)
        elif (output_dir / "terrain").is_dir():
            terrain = output_dir / "terrain"

    build_ch01_sprites(reader_root, output_dir)
    presets = build_presets(gis_root, reader_root, output_dir)
    manifest = build_manifest(output_dir, archive, terrain, presets)
    print(f"atlas: ready — {manifest}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except AtlasBuildError as exc:
        print(f"atlas: ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)
