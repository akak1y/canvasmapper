import type { MapEngine } from '../core/MapEngine';
import { injectDefaultStyles } from './defaultStyles';

export type ControlButton = 'in' | 'out' | 'reset';
export type ControlsPosition = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

export interface ControlsOptions {
    enabled?: boolean;
    position?: ControlsPosition;
    buttons?: ControlButton[];
    /** false = create buttons without injecting default CSS */
    injectStyles?: boolean;
}

/**
 * Stable class names (.cm-btn, .cm-controls--*) are part of the public API:
 * users style them from external CSS. Do not rename without a major version.
 */
const BUTTONS: Record<ControlButton, { label: string; className: string; text?: string; svg?: string }> = {
    in: { label: 'Zoom in', className: 'cm-btn--in', text: '+' },
    out: { label: 'Zoom out', className: 'cm-btn--out', text: '−' },
    reset: {
        label: 'Reset view',
        className: 'cm-btn--reset',
        // Inline SVG: unlike the U+2302 glyph, its optical center does not
        // depend on platform font metrics, so flex centering is exact
        svg: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 8.2 8 3l5.5 5.2"/><path d="M4.6 7.2v5.3h6.8V7.2"/></svg>',
    },
};

export class Controls {
    private readonly root: HTMLDivElement;

    constructor(engine: MapEngine, container: HTMLElement, options: ControlsOptions = {}) {
        if (options.injectStyles !== false) injectDefaultStyles();

        // Absolute positioning needs a positioned container
        if (getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }

        this.root = document.createElement('div');
        this.root.className = `cm-controls cm-controls--${options.position ?? 'topright'}`;

        for (const name of options.buttons ?? ['in', 'out', 'reset']) {
            const meta = BUTTONS[name];
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `cm-btn ${meta.className}`;
            button.setAttribute('aria-label', meta.label);
            if (meta.svg) button.innerHTML = meta.svg;
            else button.textContent = meta.text ?? '';
            button.addEventListener('click', () => {
                if (name === 'in') engine.zoomIn();
                else if (name === 'out') engine.zoomOut();
                else engine.resetView();
            });
            this.root.appendChild(button);
        }

        container.appendChild(this.root);
    }

    destroy(): void {
        this.root.remove();
    }
}
