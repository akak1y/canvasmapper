# 🗺️ CanvasMapper

[![npm](https://img.shields.io/npm/v/canvasmapper.svg)](https://www.npmjs.com/package/canvasmapper)
[![CI](https://github.com/akak1y/canvasmapper/actions/workflows/ci.yml/badge.svg)](https://github.com/akak1y/canvasmapper/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> High-performance Canvas map engine for large-scale interactive maps.

Built for maps with thousands of dynamic objects: game admin panels, live
radars, dashboards. Everything is drawn on a single canvas — no DOM nodes per
marker, no heavy dependencies. Born in production (RAGE MP admin panel).

## ✨ Features

- 🚀 rAF render loop with dirty flag — idle costs ~0 CPU
- 🗺️ Tile rendering: viewport culling, LRU cache, in-flight dedup, LOD clamping
- 🔌 Pluggable sources: URL pyramid, flat matrix, single big image
- 🎯 Markers & layers with culling, sprite cache and hit-testing (1000+ at 60 FPS)
- 🖱️ Smooth fractional zoom, zoom-to-cursor, inertia, touch & pinch
- 🎨 Zoom controls with CSS theming — your CSS always wins
- 📱 Retina/HiDPI aware
- 🧰 CLI: slice any image into a tile pyramid
- ⚡ Zero runtime dependencies in the browser; full TypeScript types

## 📦 Install

```bash
npm install canvasmapper
```

Or via script tag (UMD):

```html
<script src="https://unpkg.com/canvasmapper/dist/canvasmapper.umd.js"></script>
```

## 🚀 Quick start

```javascript
import { MapEngine, UrlTileSource } from 'canvasmapper';

const map = new MapEngine(document.getElementById('map'), {
    source: new UrlTileSource({ urlTemplate: '/tiles/{z}/{x}_{y}.png' }),
});
map.setView({ x: 0, y: 0, zoom: 2 });
```

## 🧰 CLI

```bash
npm install -g canvasmapper
canvasmapper slice -i map.jpg -o ./tiles -s 256 -f jpeg -q 80
```

## 📚 Docs

- [Getting Started](docs/getting-started.md)
- [Tile Sources](docs/tile-sources.md)
- [Controls & CSS Theming](docs/controls-styling.md)
- [API Reference](docs/api-reference.md)

## 🧪 Development

```bash
npm run dev      # demos at http://localhost:3000
npm run test     # vitest watch mode
npm run check    # lint + format + build + build:cli
```

## 🛣️ Roadmap

- PMTiles source (one file, HTTP range requests)
- Object pooling for ephemeral effects (pings, shots)
- Trusted Publishing for releases

## 📄 License

MIT © akak1y
