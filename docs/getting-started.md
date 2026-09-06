# Getting Started

## Install

```bash
npm install canvasmapper        # stable (after v1.0)
npm install canvasmapper@beta   # pre-release
```

Or via script tag (UMD build):

```html
<script src="https://unpkg.com/canvasmapper/dist/canvasmapper.umd.js"></script>
<script>
    const map = new CanvasMapper.MapEngine(document.getElementById('map'));
</script>
```

## First map

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

The container needs an explicit CSS size; the engine fills it completely and
reacts to resizes automatically.

## Slicing your own map

```bash
npm install -g canvasmapper
canvasmapper slice -i map.jpg -o ./tiles -s 256 -f jpeg -q 80
```

Then point `UrlTileSource` at the output folder:

```javascript
source: new UrlTileSource({ urlTemplate: '/tiles/{z}/{x}_{y}.jpeg' });
```

See [tile-sources.md](tile-sources.md) for all source types and
[controls-styling.md](controls-styling.md) for theming the buttons.
