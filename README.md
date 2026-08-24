EN | [RU](README_RU.md)

# 🗺️ CanvasMapper

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/status-alpha-orange.svg)](https://github.com/akak1y/canvasmapper)

> High-performance Canvas map engine for large-scale interactive maps

## 🚧 Status: Alpha

The project is in active development. The API may change without notice.

**Already working:**

- ✅ Smooth pan / zoom (fractional zoom, zoom-to-cursor, inertia)
- ✅ Tile rendering with viewport culling and LRU cache
- ✅ Pluggable tile sources (URL template; more on the way)
- ✅ Retina / HiDPI support, touch support (pan + pinch)

**Coming next:**

- ⏳ Matrix tile source (`x_y.png` grid)
- ⏳ Single large image source (auto-slicing in a Web Worker)
- ⏳ Zoom controls with CSS theming
- ⏳ Markers and layer system
- ⏳ CLI tile slicer

## ✨ Features

- 🚀 **High Performance** - rAF render loop with dirty flag; designed for thousands of markers at 60 FPS
- 🗺️ **Tile-Based Rendering** - viewport culling, LRU cache, LOD scaling
- 🔌 **Pluggable Sources** - URL template today; matrix and single-image sources on the roadmap
- 🎯 **Interactive** - smooth pan/zoom, zoom-to-cursor, inertia
- 📱 **Touch Support** - pan and pinch-zoom on mobile devices
- ⚡ **Zero Dependencies** - lightweight, no external libraries required
- 🔧 **TypeScript** - full type definitions included

## 📦 Installation

Not published to npm yet (alpha). For now:

```bash
git clone https://github.com/akak1y/canvasmapper.git
cd canvasmapper
npm install
npm run build
```

Then either `npm link` it into your project, or include `dist/canvasmapper.umd.js` with a `<script>` tag.

`npm install canvasmapper` will work once we hit beta.

## 🚀 Quick Start

```javascript
import { MapEngine, UrlTileSource } from 'canvasmapper';

const map = new MapEngine(document.getElementById('map'), {
    minZoom: 0,
    maxZoom: 10,
    source: new UrlTileSource({ urlTemplate: '/tiles/{z}/{x}_{y}.png' }),
});

map.setView({ x: 0, y: 0, zoom: 2 });

map.on('click', (e) => console.log(e.world));
```

## 🧪 Development

```bash
npm run dev     # demos at http://localhost:3000 (and /basic-url.html)
npm run test    # unit tests
npm run check   # lint + format check + build
```

## 📚 Documentation

Coming soon...

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

MIT © [akak1y](LICENSE)
