import { EventEmitter } from './EventEmitter';
import { Camera, ViewState } from './Camera';

/**
 * MapEngine configuration options
 */
export interface MapEngineOptions {
    tileSize?: number;
    urlTemplate?: string;
    minZoom?: number;
    maxZoom?: number;
}

/**
 * Main entry point for CanvasMapper
 */
export class MapEngine extends EventEmitter {
    private container: HTMLElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private camera: Camera;
    private options: Required<MapEngineOptions>;

    constructor(container: HTMLElement, options: MapEngineOptions = {}) {
        super();

        this.container = container;
        this.options = {
            tileSize: options.tileSize ?? 256,
            urlTemplate: options.urlTemplate ?? '/tiles/{z}/{x}_{y}.png',
            minZoom: options.minZoom ?? 0,
            maxZoom: options.maxZoom ?? 18,
        };

        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.container.appendChild(this.canvas);

        // Get context
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D context');
        }
        this.ctx = ctx;

        // Initialize camera
        this.camera = new Camera();

        // Setup canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    private resize(): void {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.container.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.scale(dpr, dpr);
        this.render();
    }

    /**
     * Set the view (center and zoom)
     */
    setView(state: ViewState): void {
        this.camera.setViewState(state);
        this.render();
    }

    /**
     * Get current view state
     */
    getView(): ViewState {
        return this.camera.getViewState();
    }

    /**
     * Получить опции движка (только чтение)
     */
    getOptions(): Readonly<Required<MapEngineOptions>> {
        return this.options;
    }

    /**
     * Render the map
     */
    private render(): void {
        const rect = this.container.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);

        // TODO: Render tiles and markers
        this.emit('render');
    }
}
