import type { Camera } from '../core/Camera';
import { EventEmitter } from '../core/EventEmitter';
import type { Bounds, Point, Size } from '../types';
import { Marker, type MarkerOptions } from './Marker';
import { SpriteCache } from './SpriteCache';

export interface LayerOptions {
    zIndex?: number;
    visible?: boolean;
}

/** World rect visible on screen, expanded by a margin (sprites hang out) */
export function computeVisibleBounds(camera: Camera, view: Size, margin: number): Bounds {
    const topLeft = camera.screenToWorld({ x: 0, y: 0 }, view);
    const bottomRight = camera.screenToWorld({ x: view.width, y: view.height }, view);
    return {
        minX: topLeft.x - margin,
        minY: topLeft.y - margin,
        maxX: bottomRight.x + margin,
        maxY: bottomRight.y + margin,
    };
}

/**
 * An ordered collection of markers with culling, sprite caching and hit tests.
 */
export class MarkerLayer extends EventEmitter {
    readonly name: string;
    zIndex: number;
    visible: boolean;
    /** @internal wired by LayerManager */
    onRequestRedraw: (() => void) | null = null;

    private readonly markers: Marker[] = [];
    private readonly byId = new Map<string, Marker>();
    private readonly sprites = new SpriteCache();

    constructor(name: string, options: LayerOptions = {}) {
        super();
        this.name = name;
        this.zIndex = options.zIndex ?? 0;
        this.visible = options.visible ?? true;
        this.sprites.onSpriteReady = () => this.requestRedraw();
    }

    get count(): number {
        return this.markers.length;
    }

    addMarker(options: MarkerOptions): Marker {
        const marker = new Marker(options);
        marker.layer = this;
        this.markers.push(marker);
        this.byId.set(marker.id, marker);
        this.requestRedraw();
        return marker;
    }

    removeMarker(marker: Marker): void {
        const index = this.markers.indexOf(marker);
        if (index === -1) return;
        this.markers.splice(index, 1);
        this.byId.delete(marker.id);
        marker.layer = null;
        this.requestRedraw();
    }

    getMarker(id: string): Marker | undefined {
        return this.byId.get(id);
    }

    clear(): void {
        for (const marker of this.markers) marker.layer = null;
        this.markers.length = 0;
        this.byId.clear();
        this.requestRedraw();
    }

    show(): void {
        this.visible = true;
        this.requestRedraw();
    }

    hide(): void {
        this.visible = false;
        this.requestRedraw();
    }

    requestRedraw(): void {
        this.onRequestRedraw?.();
    }

    /** @internal draw only markers inside the visible bounds */
    draw(ctx: CanvasRenderingContext2D, camera: Camera, view: Size): void {
        if (!this.visible || this.markers.length === 0) return;
        const bounds = computeVisibleBounds(camera, view, 64);

        for (const marker of this.markers) {
            // Viewport culling: skip everything outside the visible world rect
            if (marker.x < bounds.minX || marker.x > bounds.maxX) continue;
            if (marker.y < bounds.minY || marker.y > bounds.maxY) continue;

            const p = camera.worldToScreen(marker, view);
            const sprite = this.sprites.getSprite(marker);
            if (sprite) {
                ctx.drawImage(sprite, p.x - sprite.width / 2, p.y - marker.size / 2);
            } else {
                // Icon still loading: cheap placeholder dot
                ctx.fillStyle = marker.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, marker.size / 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    /** @internal topmost marker under a screen point (size×size box) */
    hitTest(screen: Point, camera: Camera, view: Size): Marker | null {
        if (!this.visible) return null;
        for (let i = this.markers.length - 1; i >= 0; i--) {
            const marker = this.markers[i];
            const p = camera.worldToScreen(marker, view);
            const half = marker.size / 2;
            if (screen.x >= p.x - half && screen.x <= p.x + half && screen.y >= p.y - half && screen.y <= p.y + half) {
                return marker;
            }
        }
        return null;
    }
}
