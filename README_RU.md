[EN](README.md) | RU

# 🗺️ CanvasMapper

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/status-alpha-orange.svg)](https://github.com/akak1y/canvasmapper)

> Высокопроизводительный движок карт на HTML5 Canvas для больших интерактивных карт

## 🚧 Статус: Alpha

Проект на ранней стадии разработки. API может измениться без предупреждения.

## ✨ Возможности

- 🚀 **Высокая производительность** — тысячи маркеров при 60 FPS на HTML5 Canvas
- 🗺️ **Тайловый рендеринг** — эффективная загрузка и отображение больших карт по кускам-тайлам
- 🎯 **Интерактивность** — встроенные панорамирование, зум и клики по маркерам
- 🎨 **Система слоёв** — маркеры организуются в слои с управлением z-index
- 📱 **Тач-поддержка** — полная поддержка мобильных устройств
- ⚡ **Ноль зависимостей** — лёгкая библиотека без внешних пакетов
- 🔧 **TypeScript** — полные типы в комплекте

## 📦 Установка

```bash
npm install canvasmapper
```

Или через CDN:

```html
<script src="https://unpkg.com/canvasmapper@latest/dist/canvasmapper.umd.js"></script>
```

## 🚀 Быстрый старт

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
    label: 'Точка интереса',
});
```

## 📚 Документация

Скоро...

## 🤝 Участие в разработке

Пулл-реквесты приветствуются! Подробности — в [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 Лицензия

MIT © [akak1y](LICENSE)
