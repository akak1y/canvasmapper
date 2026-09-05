import type { Camera } from '../core/Camera';
import type { Point, Size } from '../types';
import type { Marker } from './Marker';
import { MarkerLayer, type LayerOptions } from './MarkerLayer';

/**
 * Owns all layers, draws them in z-index order, hit-tests top-down.
 */
export class LayerManager {
    private readonly layers: MarkerLayer[] = [];
    /** @internal wired by the engine */
    onRequestRedraw: (() => void) | null = null;

    createLayer(name: string, options: LayerOptions = {}): MarkerLayer {
        const layer = new MarkerLayer(name, options);
        layer.onRequestRedraw = () => this.onRequestRedraw?.();
        this.layers.push(layer);
        this.layers.sort((a, b) => a.zIndex - b.zIndex);
        this.onRequestRedraw?.();
        return layer;
    }

    getLayer(name: string): MarkerLayer | undefined {
        return this.layers.find((layer) => layer.name === name);
    }

    removeLayer(name: string): void {
        const index = this.layers.findIndex((layer) => layer.name === name);
        if (index !== -1) this.layers.splice(index, 1);
        this.onRequestRedraw?.();
    }

    /** @internal */
    draw(ctx: CanvasRenderingContext2D, camera: Camera, view: Size): void {
        for (const layer of this.layers) layer.draw(ctx, camera, view);
    }

    /** @internal topmost marker under the point across all layers */
    hitTest(screen: Point, camera: Camera, view: Size): Marker | null {
        for (let i = this.layers.length - 1; i >= 0; i--) {
            const hit = this.layers[i].hitTest(screen, camera, view);
            if (hit) return hit;
        }
        return null;
    }
}
