# 🗺️ CanvasMapper

[![npm](https://img.shields.io/npm/v/canvasmapper.svg)](https://www.npmjs.com/package/canvasmapper)
[![CI](https://github.com/akak1y/canvasmapper/actions/workflows/ci.yml/badge.svg)](https://github.com/akak1y/canvasmapper/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Высокопроизводительный движок карт на HTML5 Canvas для больших интерактивных карт.

Создан для карт с тысячами динамических объектов: игровые админки, живые
радары, дашборды. Всё рисуется на одном canvas — без DOM-узлов на маркер и
без тяжёлых зависимостей. Родился в production (админка RAGE MP).

## ✨ Возможности

- 🚀 rAF-цикл с dirty flag — в простое ~0 CPU
- 🗺️ Тайлы: culling, LRU-кэш, дедупликация запросов, LOD-клампинг
- 🔌 Сменные источники: URL-пирамида, плоская матрица, одна большая картинка
- 🎯 Маркеры и слои: culling, кэш спрайтов, hit-test (1000+ при 60 FPS)
- 🖱️ Плавный дробный зум, зум к курсору, инерция, тач и pinch
- 🎨 Кнопки зума с CSS-темизацией — твой CSS побеждает всегда
- 📱 Retina/HiDPI
- 🧰 CLI: нарезка любой картинки в пирамиду тайлов
- ⚡ Ноль runtime-зависимостей в браузере; полные типы TypeScript

## 📦 Установка

```bash
npm install canvasmapper
```

Или через script tag (UMD):

```html
<script src="https://unpkg.com/canvasmapper/dist/canvasmapper.umd.js"></script>
```

## 🚀 Быстрый старт

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

## 📚 Документация

- [Быстрый старт](docs/getting-started.md)
- [Источники тайлов](docs/tile-sources.md)
- [Кнопки и CSS-темизация](docs/controls-styling.md)
- [API Reference](docs/api-reference.md)

## 🧪 Разработка

```bash
npm run dev      # демки на http://localhost:3000
npm run test     # vitest в watch-режиме
npm run check    # lint + format + build + build:cli
```

## 🛣️ Роадмап

- Источник PMTiles (один файл, HTTP range-запросы)
- Object pooling для эфемерных эффектов (пинги, выстрелы)
- Trusted Publishing для релизов

## 📄 Лицензия

MIT © akak1y
