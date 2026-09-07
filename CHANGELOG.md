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

## [1.0.0] - 2026-09-08

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
