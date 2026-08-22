EN | [RU](README_RU.md)

# 🗺️ CanvasMapper

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/status-alpha-orange.svg)](https://github.com/akak1y/canvasmapper)

> High-performance Canvas map engine for large-scale interactive maps

## 🚧 Status: Alpha

This project is in early development. The API may change without notice.

## ✨ Features

- 🚀 **High Performance** - Render thousands of markers at 60 FPS using HTML5 Canvas
- 🗺️ **Tile-Based Rendering** - Efficiently load and display large maps using tile format
- 🎯 **Interactive** - Built-in pan, zoom, and marker interaction
- 🎨 **Layer System** - Organize markers into layers with z-index control
- 📱 **Touch Support** - Full support for mobile devices
- ⚡ **Zero Dependencies** - Lightweight, no external libraries required
- 🔧 **TypeScript** - Full type definitions included

## 📦 Installation

```bash
npm install canvasmapper
```

Or via CDN:

```html
<script src="https://unpkg.com/canvasmapper@latest/dist/canvasmapper.umd.js"></script>
```

## 🚀 Quick Start

```javascript
import { MapEngine } from 'canvasmapper';

const map = new MapEngine(document.getElementById('map'), {
    tileSize: 256,
    urlTemplate: '/tiles/{z}/{x}_{y}.png',
});

map.setView({ x: 0, y: 0, zoom: 2 });

const layer = map.createLayer('markers');
layer.addMarker({
    x: 100,
    y: 200,
    icon: '/icon.png',
    label: 'Point of Interest',
});
```

## 📚 Documentation

Coming soon...

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

MIT © [akak1y](LICENSE)
