# API Reference (v0.1.0-beta)

## MapEngine

```ts
new MapEngine(container: HTMLElement, options?: MapEngineOptions)
```

Options: `tileSize`, `urlTemplate`, `minZoom`, `maxZoom`, `source`,
`zoom: { smooth, step }`, `controls`.

Methods: `setView`, `getView`, `zoomIn`, `zoomOut`, `resetView`,
`createLayer(name, opts)`, `worldToScreen`, `screenToWorld`, `getOptions`,
`on`/`off`, `destroy`.

Events: `viewchange` (ViewState), `click` ({ screen, world, marker }),
`marker:click` ({ marker, screen, world }).

## Layers & markers

```ts
const layer = map.createLayer('players', { zIndex: 2, visible: true });
const marker = layer.addMarker({ x, y, icon?, label?, color?, size?, data? });

marker.setPosition(x, y);
marker.update({ label: 'p2' });
marker.remove();
layer.hide(); layer.show(); layer.clear();
layer.on('click', (marker) => ...);
```

Markers are drawn in screen pixels (constant size across zooms); only
visible markers are rendered (viewport culling).

## Camera math

World units are abstract; `scale = 2^zoom` pixels per world unit.
`worldToScreen` / `screenToWorld` convert points; `setView` accepts
fractional zoom.
