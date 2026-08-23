import type { Point, Size } from '../types';
import { clamp } from '../utils/math';

export interface CameraOptions {
    minZoom?: number;
    maxZoom?: number;
}

export interface ViewState {
    x: number;
    y: number;
    zoom: number;
}

/**
 * Camera holds the current view: world-space center + fractional zoom.
 * All coordinate math of the engine lives here.
 */
export class Camera {
    private center: Point = { x: 0, y: 0 };
    private zoom = 0;
    private readonly minZoom: number;
    private readonly maxZoom: number;

    constructor(options: CameraOptions = {}) {
        this.minZoom = options.minZoom ?? 0;
        this.maxZoom = options.maxZoom ?? 18;
    }

    /** Pixels per world unit at the current zoom */
    getScale(): number {
        return Math.pow(2, this.zoom);
    }

    getViewState(): ViewState {
        return { x: this.center.x, y: this.center.y, zoom: this.zoom };
    }

    setViewState(state: Partial<ViewState>): void {
        if (state.x !== undefined) this.center.x = state.x;
        if (state.y !== undefined) this.center.y = state.y;
        if (state.zoom !== undefined) this.zoom = clamp(state.zoom, this.minZoom, this.maxZoom);
    }

    /** Shift the view by a screen-space delta (dragging) */
    panByScreen(dx: number, dy: number): void {
        const scale = this.getScale();
        // Dragging right must move the map right => center moves left
        this.center.x -= dx / scale;
        this.center.y -= dy / scale;
    }

    /**
     * Change zoom keeping the world point under `anchor` (screen px) fixed.
     * This is what makes zoom feel "aimed at the cursor".
     */
    zoomAt(anchor: Point, view: Size, newZoom: number): void {
        const world = this.screenToWorld(anchor, view);
        this.zoom = clamp(newZoom, this.minZoom, this.maxZoom);
        const scale = this.getScale();
        this.center = {
            x: world.x - (anchor.x - view.width / 2) / scale,
            y: world.y - (anchor.y - view.height / 2) / scale,
        };
    }

    worldToScreen(world: Point, view: Size): Point {
        const scale = this.getScale();
        return {
            x: (world.x - this.center.x) * scale + view.width / 2,
            y: (world.y - this.center.y) * scale + view.height / 2,
        };
    }

    screenToWorld(screen: Point, view: Size): Point {
        const scale = this.getScale();
        return {
            x: (screen.x - view.width / 2) / scale + this.center.x,
            y: (screen.y - view.height / 2) / scale + this.center.y,
        };
    }
}
