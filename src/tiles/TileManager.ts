import type { Camera, ViewState } from '../core/Camera';
import type { Size } from '../types';
import { clamp } from '../utils/math';
import { TileCache } from './TileCache';
import type { TileCoord, TileImage, TileSource } from './TileSource';

export interface TileRange {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

const key = (coord: TileCoord): string => `${coord.z}/${coord.x}_${coord.y}`;

/**
 * Pure math: which tile indices intersect the viewport at integer zoom tz.
 * Exported separately for unit tests.
 */
export function computeVisibleRange(state: ViewState, view: Size, tileSize: number, tz: number): TileRange {
    const scale = Math.pow(2, state.zoom);
    const halfW = view.width / 2 / scale;
    const halfH = view.height / 2 / scale;
    const worldSize = tileSize / Math.pow(2, tz);
    return {
        minX: Math.floor((state.x - halfW) / worldSize),
        maxX: Math.floor((state.x + halfW) / worldSize),
        minY: Math.floor((state.y - halfH) / worldSize),
        maxY: Math.floor((state.y + halfH) / worldSize),
    };
}

/**
 * Loads, caches and draws map tiles for the current view.
 */
export class TileManager {
    private readonly cache: TileCache<TileImage>;
    private readonly inFlight = new Map<string, Promise<TileImage>>();
    private readonly failed = new Set<string>();
    private readonly minNative: number;
    private readonly maxNative: number;

    constructor(
        private readonly source: TileSource,
        private readonly tileSize: number,
        private readonly onRequestRedraw: () => void,
        cacheSize = 512
    ) {
        this.cache = new TileCache<TileImage>(cacheSize);
        this.minNative = source.minNativeZoom ?? 0;
        this.maxNative = source.maxNativeZoom ?? 22;
    }

    /** Integer zoom level whose tiles we draw right now (LOD clamp) */
    private tileZoomFor(zoom: number): number {
        return clamp(Math.round(zoom), this.minNative, this.maxNative);
    }

    /** Kick off loads for visible tiles we don't have yet */
    update(state: ViewState, view: Size): void {
        const tz = this.tileZoomFor(state.zoom);
        const range = computeVisibleRange(state, view, this.tileSize, tz);

        // Safety valve: never issue a crazy amount of requests at once
        if ((range.maxX - range.minX + 1) * (range.maxY - range.minY + 1) > 512) return;

        for (let x = range.minX; x <= range.maxX; x++) {
            for (let y = range.minY; y <= range.maxY; y++) {
                const coord: TileCoord = { z: tz, x, y };
                const k = key(coord);
                if (this.source.hasTile && !this.source.hasTile(coord)) continue;
                if (this.cache.has(k) || this.inFlight.has(k) || this.failed.has(k)) continue;

                const promise = this.source.getTile(coord);
                this.inFlight.set(k, promise);
                promise
                    .then((image) => {
                        this.cache.set(k, image);
                        this.onRequestRedraw(); // tile arrived -> frame is dirty
                    })
                    .catch(() => {
                        // Negative cache: don't re-request missing tiles every frame
                        this.failed.add(k);
                    })
                    .finally(() => {
                        this.inFlight.delete(k);
                    });
            }
        }
    }

    /** Draw cached tiles intersecting the viewport, scaled for fractional zoom */
    draw(ctx: CanvasRenderingContext2D, camera: Camera, view: Size): void {
        const state = camera.getViewState();
        const tz = this.tileZoomFor(state.zoom);
        const worldSize = this.tileSize / Math.pow(2, tz);
        const screenTile = this.tileSize * Math.pow(2, state.zoom - tz);
        const range = computeVisibleRange(state, view, this.tileSize, tz);

        for (let x = range.minX; x <= range.maxX; x++) {
            for (let y = range.minY; y <= range.maxY; y++) {
                const image = this.cache.get(`${tz}/${x}_${y}`);
                if (!image) continue;
                const p = camera.worldToScreen({ x: x * worldSize, y: y * worldSize }, view);
                const w = screenTile * (image.width / this.tileSize);
                const h = screenTile * (image.height / this.tileSize);
                ctx.drawImage(image, p.x, p.y, w + 0.5, h + 0.5);
            }
        }
    }
}
