# 🗺️ CanvasMapper

[EN](../../README.md) | [RU](README_RU.md) | [ZH](README_ZH-CN.md) | [ES](README_ES.md) | [JA](README_JA.md) | [PT-BR](README_PT-BR.md) | FR

> Version française. Le texte de référence est la [version anglaise](../../README.md) ; en cas de divergence, c'est elle qui fait foi.

> Moteur de cartes Canvas haute performance pour les cartes interactives à grande échelle.

Conçu pour des cartes avec des milliers d'objets dynamiques : panneaux d'administration
de jeux, radars en direct, dashboards. Tout est dessiné sur un seul canvas — aucun nœud
DOM par marqueur, aucune dépendance lourde. Né en production (panneau d'administration RAGE MP).

## ✨ Fonctionnalités

- 🚀 Boucle rAF avec dirty flag — au repos, coût CPU ~0
- 🗺️ Rendu des tuiles : culling du viewport, cache LRU, déduplication des requêtes, clamping LOD
- 🔌 Sources enfichables : pyramide URL, matrice plate, grande image unique
- 🎯 Marqueurs et calques avec culling, cache de sprites et hit-testing (1000+ à 60 FPS)
- 🖱️ Zoom fractionnaire fluide, zoom vers le curseur, inertie, tactile et pinch
- 🎨 Contrôles de zoom thémables en CSS — votre CSS gagne toujours
- 📱 Compatible Retina/HiDPI
- 🧰 CLI : découpe n'importe quelle image en pyramide de tuiles
- ⚡ Zéro dépendance d'exécution dans le navigateur ; types TypeScript complets

## 📦 Installation

```bash
npm install canvasmapper
```

Ou via script tag (UMD) :

```html
<script src="https://unpkg.com/canvasmapper/dist/canvasmapper.umd.js"></script>
```

## 🚀 Démarrage rapide

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

## 📚 Documentation

- [Bien démarrer](../getting-started.md)
- [Sources de tuiles](../tile-sources.md)
- [Contrôles et thèmes CSS](../controls-styling.md)
- [Référence API](../api-reference.md)

## 🧪 Développement

```bash
npm run dev      # démos sur http://localhost:3000
npm run test     # vitest en mode watch
npm run check    # lint + format + build + build:cli
```

## 🛣️ Feuille de route

- Source PMTiles (fichier unique, requêtes HTTP range)
- Object pooling pour les effets éphémères (pings, tirs)
- Décodage des tuiles en Web Worker

## 📄 Licence

MIT © akak1y
