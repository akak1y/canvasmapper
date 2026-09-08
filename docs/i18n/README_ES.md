[EN](../../README.md) | [RU](README_RU.md) | [ZH](README_ZH-CN.md) | ES | [JA](README_JA.md) | [PT-BR](README_PT-BR.md) | [FR](README_FR.md)

# 🗺️ CanvasMapper

> Versión en español. El texto canónico es el [inglés](../../README.md); en caso de discrepancia, manda él.

> Motor de mapas Canvas de alto rendimiento para mapas interactivos a gran escala.

Creado para mapas con miles de objetos dinámicos: paneles de administración de juegos,
radares en vivo, dashboards. Todo se dibuja en un único canvas: sin nodos DOM por
marcador y sin dependencias pesadas. Nacido en producción (panel de administración de RAGE MP).

## ✨ Características

- 🚀 Bucle rAF con dirty flag: en reposo el coste de CPU es ~0
- 🗺️ Render de tiles: culling por viewport, caché LRU, deduplicación de peticiones, clamping LOD
- 🔌 Fuentes conectables: pirámide URL, matriz plana, una imagen grande
- 🎯 Marcadores y capas con culling, caché de sprites y hit-testing (1000+ a 60 FPS)
- 🖱️ Zoom fraccional suave, zoom al cursor, inercia, táctil y pinch
- 🎨 Controles de zoom con temas CSS: tu CSS siempre gana
- 📱 Compatible con Retina/HiDPI
- 🧰 CLI: corta cualquier imagen en una pirámide de tiles
- ⚡ Cero dependencias en runtime en el navegador; tipos TypeScript completos

## 📦 Instalación

```bash
npm install canvasmapper
```

O mediante script tag (UMD):

```html
<script src="https://unpkg.com/canvasmapper/dist/canvasmapper.umd.js"></script>
```

## 🚀 Inicio rápido

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

## 📚 Documentación

- [Primeros pasos](../getting-started.md)
- [Fuentes de tiles](../tile-sources.md)
- [Controles y temas CSS](../controls-styling.md)
- [Referencia de API](../api-reference.md)

## 🧪 Desarrollo

```bash
npm run dev      # demos en http://localhost:3000
npm run test     # vitest en modo watch
npm run check    # lint + format + build + build:cli
```

## 🛣️ Hoja de ruta

- Fuente PMTiles (un solo archivo, peticiones HTTP range)
- Object pooling para efectos efímeros (pings, disparos)
- Decodificación de tiles en Web Worker

## 📄 Licencia

MIT © akak1y
