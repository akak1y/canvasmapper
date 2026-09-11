# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0-beta.1] - 2026-09-06

### Added

- Core engine: rAF render loop with dirty flag, fractional zoom, zoom-to-cursor, inertia
- Retina-aware viewport with ResizeObserver
- Mouse + touch input strategies (drag pan, pinch-zoom, tap)
- Tile core: viewport culling, LRU cache, in-flight dedup, negative cache, LOD clamping
- `UrlTileSource` with configurable `{z}/{x}/{y}`-style templates
- `MatrixTileSource` for flat `row-col` grids with mixed-size validation
- `SingleImageSource`: on-the-fly slicing of one big image + IndexedDB cache
- Markers and layers: `MarkerLayer` with culling and hit-testing, `SpriteCache`, `LayerManager` with z-index
- Zoom controls with CSS theming (`:where()` defaults, `--cm-*` variables, stable `.cm-*` class contract)
- CLI: `canvasmapper slice` — tile pyramid cutter with parallel encoding, per-level timing and ETA

## [1.0.0] - 2026-09-07

### Added

- CLI: `canvasmapper slice` — parallel tile pyramid cutter with per-level timing and ETA
- CI pipeline (lint/format/build/tests) and tag-based npm release workflow
- GitHub Pages demos
- Documentation: getting-started, tile-sources, controls-styling, api-reference
- Issue and pull-request templates

### Fixed

- Partial edge tiles no longer stretch at low zoom (true aspect ratio drawing)
- Anti-aliasing seams between neighbouring tiles hidden with 0.5px overlap

### Changed

- `sharp` moved to dependencies (CLI runtime); browser bundle stays zero-dependency

## [1.0.1] - 2026-09-08

### Added

- `npm run size` — gzip size reporter for the ES bundle (static bundle-size badge)
- README translations: zh-CN, es, ja, pt-BR, fr under `docs/i18n/`
- Showcase demo (OSM tiles + live markers + layers + themed controls) and demo hub landing

### Fixed

- Vite build target raised to es2022: top-level await in demos broke the GitHub Pages build

## [1.0.2] - 2026-09-09

### Fixed

- Tile LOD off-by-one: index math and the `{z}` URL placeholder now share one sampling zoom; no more out-of-pyramid requests
- Viewport clamping uses source-reported grid sizes (`TileSource.getGridSize`, optional with slippy fallback): MatrixTileSource and SingleImageSource render in full again
- Out-of-grid tile coordinates are rejected before any network I/O
- `tiles.draw` receives ViewState from Renderer; map redraws as soon as a tile finishes loading
- Showcase demo: OSM URL template corrected (`{z}/{x}/{y}`) and OSM attribution added

### Added

- `wrapX` option for horizontally wrapping worlds
- Regression tests with exact expected tile ranges

## [1.0.3] - 2026-09-11

### Fixed

- Touch tap on a marker emits `marker:click`: TouchStrategy detects quick single-finger taps (8 px / 500 ms)
- 44 px tap targets apply only to hover-less touch devices; touch-enabled desktops keep 36 px controls
- Controls column stays coaxial on every platform (`align-items: center`)
- Reset button icon no longer drifts: inline SVG replaces the metric-quirky U+2302 glyph

### Changed

- Showcase demo: the layer toggle button now reuses the engine `.cm-btn` theme (pill variant)

## [1.0.4] - 2026-09-12

### Changed

- Tile loads are ordered by distance from viewport center (center-out). Under
  slow connections or server throttling, the part of the map the user is
  looking at renders first, while periphery tiles follow.
