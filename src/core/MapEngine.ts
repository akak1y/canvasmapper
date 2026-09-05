import { InputController } from '../input/InputController';
import type { Point } from '../types';
import { clamp } from '../utils/math';
import { Camera, type ViewState } from './Camera';
import { EventEmitter } from './EventEmitter';
import { Renderer } from './Renderer';
import { Viewport } from './Viewport';
import { TileManager } from '../tiles/TileManager';
import type { TileSource } from '../tiles/TileSource';
import { UrlTileSource } from '../tiles/UrlTileSource';
import { Controls, type ControlsOptions } from '../controls/Controls';
import { LayerManager } from '../layers/LayerManager';
import type { MarkerLayer } from '../layers/MarkerLayer';
import type { LayerOptions } from '../layers/MarkerLayer';

export interface MapEngineOptions {
    tileSize?: number;
    urlTemplate?: string;
    minZoom?: number;
    maxZoom?: number;
    zoom?: {
        /** Fractional, animated zoom. Default: true */
        smooth?: boolean;
        /** Step for zoomIn()/zoomOut(). Default: 1 */
        step?: number;
    };
    /** Custom tile source; defaults to UrlTileSource built from urlTemplate */
    source?: TileSource;
    /** Zoom/reset buttons: false to disable, or an options object */
    controls?: boolean | ControlsOptions;
}

interface ResolvedOptions {
    tileSize: number;
    urlTemplate: string;
    minZoom: number;
    maxZoom: number;
    smoothZoom: boolean;
    zoomStep: number;
}

/**
 * Main entry point of CanvasMapper.
 * Orchestrates viewport, camera, input and the render loop.
 */
export class MapEngine extends EventEmitter {
    private readonly viewport: Viewport;
    private readonly camera: Camera;
    private readonly renderer: Renderer;
    private readonly input: InputController;
    private readonly options: ResolvedOptions;
    private readonly tiles: TileManager;
    private readonly controls: Controls | null;
    private readonly layers = new LayerManager();
    private homeView: ViewState = { x: 0, y: 0, zoom: 0 };

    private dirty = true;
    private raf = 0;
    private lastTime = 0;
    private targetZoom: number;
    private zoomAnchor: Point;
    private inertia: Point | null = null;

    constructor(container: HTMLElement, options: MapEngineOptions = {}) {
        super();
        this.options = {
            tileSize: options.tileSize ?? 256,
            urlTemplate: options.urlTemplate ?? '/tiles/{z}/{x}_{y}.png',
            minZoom: options.minZoom ?? 0,
            maxZoom: options.maxZoom ?? 18,
            smoothZoom: options.zoom?.smooth ?? true,
            zoomStep: options.zoom?.step ?? 1,
        };

        this.viewport = new Viewport(container);
        this.camera = new Camera({
            minZoom: this.options.minZoom,
            maxZoom: this.options.maxZoom,
        });
        const source = options.source ?? new UrlTileSource({ urlTemplate: this.options.urlTemplate });
        this.tiles = new TileManager(source, this.options.tileSize, () => {
            this.dirty = true;
        });
        this.layers.onRequestRedraw = () => {
            this.dirty = true;
        };
        this.renderer = new Renderer(this.viewport, this.camera, this.tiles, this.layers);
        this.targetZoom = this.camera.getViewState().zoom;
        this.zoomAnchor = this.center();

        this.input = new InputController(this.viewport.canvas, {
            onPanStart: () => {
                this.inertia = null;
            },
            onPan: (dx, dy) => {
                this.camera.panByScreen(dx, dy);
                this.dirty = true;
            },
            onPanEnd: (velocity) => {
                if (Math.hypot(velocity.x, velocity.y) > 0.05) this.inertia = velocity;
            },
            onZoom: (delta, anchor) => this.applyZoom(delta, anchor),
            onTap: (screen) => {
                const world = this.screenToWorld(screen);
                const marker = this.layers.hitTest(screen, this.camera, this.viewport.size);
                if (marker) {
                    this.emit('marker:click', { marker, screen, world });
                    marker.layer?.emit('click', marker);
                }
                this.emit('click', { screen, world, marker });
            },
        });
        const controlsRaw = options.controls ?? true;
        const controlsOptions: ControlsOptions = typeof controlsRaw === 'boolean' ? { enabled: controlsRaw } : controlsRaw;
        this.controls = controlsOptions.enabled === false ? null : new Controls(this, container, controlsOptions);

        this.viewport.onResize = () => {
            this.dirty = true;
        };
        this.raf = requestAnimationFrame(this.frame);
    }

    /** Current view: world-space center + fractional zoom */
    getView(): ViewState {
        return this.camera.getViewState();
    }

    setView(state: Partial<ViewState>): void {
        this.camera.setViewState(state);
        if (state.zoom !== undefined) this.targetZoom = this.camera.getViewState().zoom;
        this.zoomAnchor = this.center();
        this.dirty = true;
        this.homeView = this.camera.getViewState();
    }

    zoomIn(): void {
        this.applyZoom(this.options.zoomStep, this.center());
    }

    zoomOut(): void {
        this.applyZoom(-this.options.zoomStep, this.center());
    }

    /** Return to the last explicitly set view */
    resetView(): void {
        this.setView({ ...this.homeView });
    }

    getOptions(): Readonly<ResolvedOptions> {
        return this.options;
    }

    worldToScreen(point: Point): Point {
        return this.camera.worldToScreen(point, this.viewport.size);
    }

    screenToWorld(point: Point): Point {
        return this.camera.screenToWorld(point, this.viewport.size);
    }

    destroy(): void {
        cancelAnimationFrame(this.raf);
        this.input.destroy();
        this.viewport.destroy();
        this.controls?.destroy();
    }

    /** Create a marker layer (drawn in z-index order) */
    createLayer(name: string, options: LayerOptions = {}): MarkerLayer {
        return this.layers.createLayer(name, options);
    }

    private center(): Point {
        const size = this.viewport.size;
        return { x: size.width / 2, y: size.height / 2 };
    }

    private applyZoom(delta: number, anchor: Point): void {
        this.zoomAnchor = anchor;
        const next = clamp(this.targetZoom + delta, this.options.minZoom, this.options.maxZoom);
        this.targetZoom = next;
        if (!this.options.smoothZoom) {
            this.camera.zoomAt(anchor, this.viewport.size, next);
            this.dirty = true;
        }
        // smooth mode: the render loop eases towards targetZoom itself
    }

    /** The heartbeat: rAF loop with dirty flag, smooth zoom and inertia */
    private frame = (now: number): void => {
        this.raf = requestAnimationFrame(this.frame);
        const dt = this.lastTime ? Math.min(50, now - this.lastTime) : 16;
        this.lastTime = now;
        let active = this.dirty;

        // 1) ease current zoom towards the target (fractional smooth zoom)
        const zoom = this.camera.getViewState().zoom;
        const diff = this.targetZoom - zoom;
        if (Math.abs(diff) > 0.0005) {
            // Frame-rate independent exponential smoothing
            const t = 1 - Math.pow(0.001, dt / 1000);
            this.camera.zoomAt(this.zoomAnchor, this.viewport.size, zoom + diff * t);
            active = true;
        }

        // 2) inertia after a drag release
        if (this.inertia) {
            this.camera.panByScreen(this.inertia.x * dt, this.inertia.y * dt);
            const decay = Math.pow(0.5, dt / 120); // speed halves every 120ms
            this.inertia.x *= decay;
            this.inertia.y *= decay;
            if (Math.hypot(this.inertia.x, this.inertia.y) < 0.02) this.inertia = null;
            active = true;
        }

        if (active) {
            this.renderer.render();
            this.dirty = false;
            this.emit('viewchange', this.getView());
        }
    };
}
