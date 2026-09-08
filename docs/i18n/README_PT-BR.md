[EN](../../README.md) | [RU](README_RU.md) | [ZH](README_ZH-CN.md) | [ES](README_ES.md) | [JA](README_JA.md) | PT-BR | [FR](README_FR.md)

# 🗺️ CanvasMapper

> Versão em português (Brasil). O texto canônico é o [inglês](../../README.md); em caso de divergência, ele prevalece.

> Engine de mapas Canvas de alto desempenho para mapas interativos em grande escala.

Feito para mapas com milhares de objetos dinâmicos: painéis admin de jogos, radares ao
vivo, dashboards. Tudo é desenhado em um único canvas — sem nós DOM por marcador e sem
dependências pesadas. Nascido em produção (painel admin de RAGE MP).

## ✨ Recursos

- 🚀 Loop rAF com dirty flag — ocioso custa ~0 de CPU
- 🗺️ Renderização de tiles: culling de viewport, cache LRU, dedupe de requisições, clamping LOD
- 🔌 Fontes conectáveis: pirâmide URL, matriz plana, uma imagem grande
- 🎯 Marcadores e camadas com culling, cache de sprites e hit-testing (1000+ a 60 FPS)
- 🖱️ Zoom fracionário suave, zoom no cursor, inércia, toque e pinch
- 🎨 Controles de zoom com temas CSS — seu CSS sempre vence
- 📱 Compatível com Retina/HiDPI
- 🧰 CLI: fatia qualquer imagem em uma pirâmide de tiles
- ⚡ Zero dependências de runtime no navegador; tipos TypeScript completos

## 📦 Instalação

```bash
npm install canvasmapper
```

Ou via script tag (UMD):

```html
<script src="https://unpkg.com/canvasmapper/dist/canvasmapper.umd.js"></script>
```

## 🚀 Início rápido

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

## 📚 Documentação

- [Primeiros passos](../getting-started.md)
- [Fontes de tiles](../tile-sources.md)
- [Controles e temas CSS](../controls-styling.md)
- [Referência da API](../api-reference.md)

## 🧪 Desenvolvimento

```bash
npm run dev      # demos em http://localhost:3000
npm run test     # vitest em modo watch
npm run check    # lint + format + build + build:cli
```

## 🛣️ Roadmap

- Fonte PMTiles (arquivo único, requisições HTTP range)
- Object pooling para efeitos efêmeros (pings, tiros)
- Decodificação de tiles em Web Worker

## 📄 Licença

MIT © akak1y
