# Tile Sources

All sources implement one interface (`TileSource`), so the engine does not
care where tiles come from. Pick by map size:

| Map size           | Source                | Notes                                            |
| ------------------ | --------------------- | ------------------------------------------------ |
| ≤ 10K × 10K px     | `SingleImageSource`   | one file, sliced on the fly, IndexedDB cache     |
| any, pre-sliced    | `UrlTileSource`       | pyramid `z/x_y.png` on your server/CDN           |
| flat grid of files | `MatrixTileSource`    | `1-1.png … N-N.png`, one zoom level              |
| huge (50K+)        | `UrlTileSource` + CLI | pre-generated pyramid, only visible tiles travel |

## UrlTileSource

```javascript
new UrlTileSource({
    urlTemplate: '/tiles/{z}/{x}_{y}.png', // any placeholder order
    minNativeZoom: 0,
    maxNativeZoom: 18,
});
```

## MatrixTileSource

```javascript
new MatrixTileSource({
    urlTemplate: '/matrix/{y}-{x}.jpg', // files named [row]-[col]
    cols: 10,
    rows: 10,
    firstIndex: 1, // 1 => 1-1.png; 0 => 0-0.png
    warnOnMismatch: true, // console.warn when tile sizes differ
});
```

The matrix is a single native zoom level; other zooms are scaled by the
engine automatically (LOD clamping).

## SingleImageSource

```javascript
new SingleImageSource({
    source: blobOrUrl, // Blob (e.g. from <input type="file">) or URL
    tileSize: 256,
    cacheKey: 'my-map', // IndexedDB namespace
});
```

Only visible regions are decoded (`createImageBitmap` with a crop rect);
decoded tiles persist in IndexedDB, so reloads are instant.

## CLI

```bash
canvasmapper slice -i map.jpg -o ./tiles [options]

  -s, --tile-size <num>   default 256
  -q, --quality <num>     default 85
  -f, --format <fmt>      png | jpeg | webp (use jpeg/webp for photos!)
      --min-zoom <num>    default 0
      --max-zoom <num>    auto-detected
```

Writes `manifest.json` (width, height, zoom range, tile count, duration).
The browser runtime is zero-dependency; the CLI uses `sharp`.
