# Controls & CSS Theming

Default buttons (`+`, `−`, reset) are enabled. Configuration:

```javascript
new MapEngine(el, {
    controls: {
        position: 'topright', // topleft | topright | bottomleft | bottomright
        buttons: ['in', 'out', 'reset'],
        injectStyles: true, // false = bring your own CSS entirely
    },
});
```

## Why your CSS always wins

Injected defaults are wrapped in `:where()`, which has **zero specificity**.
Any rule in your stylesheet overrides them regardless of load order:

```css
.cm-btn {
    border-radius: 999px;
    background: #24435c;
    color: #ffd166;
}
```

## Theming variables

```css
:root {
    --cm-btn-size: 40px;
    --cm-btn-radius: 10px;
    --cm-btn-bg: #1e293b;
    --cm-btn-color: #7fd1ff;
}
```

## Class contract (public API, never renamed without a major version)

- `.cm-controls`, `.cm-controls--<position>`
- `.cm-btn`, `.cm-btn--in`, `.cm-btn--out`, `.cm-btn--reset`
