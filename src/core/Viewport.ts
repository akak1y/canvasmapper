import type { Size } from '../types';

/**
 * Owns the <canvas> element: sizing, retina (DPR) handling, resize watching.
 */
export class Viewport {
    readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private readonly observer: ResizeObserver;
    private cssSize: Size = { width: 0, height: 0 };
    private dpr = 1;

    /** Called by the engine after every resize */
    onResize: (() => void) | null = null;

    constructor(container: HTMLElement) {
        this.canvas = document.createElement('canvas');
        this.canvas.style.display = 'block';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        container.appendChild(this.canvas);

        const ctx = this.canvas.getContext('2d');
        if (!ctx) throw new Error('CanvasMapper: 2D context is not supported');
        this.context = ctx;

        this.observer = new ResizeObserver(() => this.resize());
        this.observer.observe(container);
        this.resize();
    }

    /** Physical pixels = CSS pixels * devicePixelRatio (retina support) */
    private resize(): void {
        const rect = this.canvas.getBoundingClientRect();
        this.dpr = window.devicePixelRatio || 1;
        this.cssSize = { width: rect.width, height: rect.height };
        this.canvas.width = Math.max(1, Math.round(rect.width * this.dpr));
        this.canvas.height = Math.max(1, Math.round(rect.height * this.dpr));
        // From now on we draw in CSS pixels; the context scales to physical ones
        this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        this.onResize?.();
    }

    get size(): Size {
        return this.cssSize;
    }

    get ctx(): CanvasRenderingContext2D {
        return this.context;
    }

    clear(): void {
        this.context.clearRect(0, 0, this.cssSize.width, this.cssSize.height);
    }

    destroy(): void {
        this.observer.disconnect();
        this.canvas.remove();
    }
}
