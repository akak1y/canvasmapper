[EN](README.md) | RU

# 🗺️ CanvasMapper

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/status-alpha-orange.svg)](https://github.com/akak1y/canvasmapper)

> Высокопроизводительный движок карт на HTML5 Canvas для больших интерактивных карт

## 🚧 Статус: Alpha

Проект в активной разработке. API может измениться без предупреждения.

**Уже работает:**

- ✅ Плавный пан/зум (дробный зум, зум к курсору, инерция)
- ✅ Тайловый рендеринг с отсечением невидимого и LRU-кэшем
- ✅ Подключаемые источники тайлов (URL-шаблон; остальные на подходе)
- ✅ Retina / HiDPI, тач (пан и pinch-зум)

**Впереди:**

- ⏳ Источник-матрица (`x_y.png`)
- ⏳ Одна большая картинка (автонарезка в Web Worker)
- ⏳ Кнопки зума с кастомным CSS
- ⏳ Маркеры и система слоёв
- ⏳ CLI-слайсер тайлов

## ✨ Возможности

- 🚀 **Производительность** - rAF-цикл с dirty flag; цель — тысячи маркеров при 60 FPS
- 🗺️ **Тайловый рендеринг** - culling, LRU-кэш, LOD-масштабирование
- 🔌 **Сменные источники** - URL-шаблон сегодня; матрица и одиночная картинка в роадмапе
- 🎯 **Интерактивность** - плавный пан/зум, зум к курсору, инерция
- 📱 **Тач-поддержка** - пан и pinch-зум на мобильных
- ⚡ **Ноль зависимостей** - лёгкая библиотека без внешних пакетов
- 🔧 **TypeScript** - полные типы в комплекте

## 📦 Установка

Пакет ещё не опубликован в npm (альфа). Пока так:

```bash
git clone https://github.com/akak1y/canvasmapper.git
cd canvasmapper
npm install
npm run build
```

Затем подключи через `npm link` в свой проект или подключи `dist/canvasmapper.umd.js` через `<script>`.

С беты заработает `npm install canvasmapper`.

## 🚀 Быстрый старт

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

## 🧪 Разработка

```bash
npm run dev     # демки: http://localhost:3000 и /basic-url.html
npm run test    # юнит-тесты
npm run check   # lint + проверка форматирования + сборка
```

## 📚 Документация

Скоро...

## 🤝 Участие в разработке

Пулл-реквесты приветствуются! Подробности — в [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 Лицензия

MIT © [akak1y](LICENSE)
