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
const BUTTONS: Record<ControlButton, { text: string; aria: string; className: string }> = {
    in: { text: '+', aria: 'Zoom in', className: 'cm-btn--in' },
    out: { text: '−', aria: 'Zoom out', className: 'cm-btn--out' },
    reset: { text: '⌂', aria: 'Reset view', className: 'cm-btn--reset' },
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
            button.setAttribute('aria-label', meta.aria);
            button.textContent = meta.text;
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
