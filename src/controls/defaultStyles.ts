/**
 * Default control styles. Every selector is wrapped in :where(), which has
 * ZERO specificity — so ANY user rule like `.cm-btn { ... }` wins regardless
 * of stylesheet order. Theming hooks: --cm-* CSS variables.
 */
export const DEFAULT_CONTROLS_CSS = `
:where(.cm-controls) {
    position: absolute; z-index: 10; display: flex;
    flex-direction: column; gap: 6px; margin: 12px;
}
:where(.cm-controls--topright)  { top: 0; right: 0; }
:where(.cm-controls--topleft)   { top: 0; left: 0; }
:where(.cm-controls--bottomright) { bottom: 0; right: 0; }
:where(.cm-controls--bottomleft)  { bottom: 0; left: 0; }
:where(.cm-btn) {
    width: var(--cm-btn-size, 36px);
    height: var(--cm-btn-size, 36px);
    border-radius: var(--cm-btn-radius, 8px);
    background: var(--cm-btn-bg, rgba(15, 20, 32, 0.85));
    color: var(--cm-btn-color, #7fd1ff);
    border: 1px solid var(--cm-btn-border, rgba(127, 209, 255, 0.25));
    font: 600 18px/1 system-ui, sans-serif;
    cursor: pointer;
    transition: transform 0.15s, background 0.15s;
}
:where(.cm-btn:hover) { background: var(--cm-btn-bg-hover, rgba(30, 41, 59, 0.9)); }
:where(.cm-btn:active) { transform: scale(0.95); }
:where(.cm-btn:focus-visible) { outline: 2px solid var(--cm-btn-color, #7fd1ff); outline-offset: 2px; }
`;

/** Inject once per page (multiple maps share one style tag) */
export function injectDefaultStyles(): void {
    if (document.getElementById('cm-default-styles')) return;
    const style = document.createElement('style');
    style.id = 'cm-default-styles';
    style.textContent = DEFAULT_CONTROLS_CSS;
    document.head.appendChild(style);
}
