import type { ViewState } from '../core/Camera';
import type { Size } from '../types';
import { clamp } from '../utils/math';
import { TileCache } from './TileCache';
import type { TileCoord, TileImage, TileSource } from './TileSource';

export interface TileRange {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    n: number;
}

export interface VisibleTile {
    z: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
}

const coordKey = (coord: TileCoord): string => `${coord.z}/${coord.x}_${coord.y}`;

/**
 * Raw viewport∩pyramid range at sampling level tz.
 * Indices may be negative or >= n: slippy semantics (wrap X / skip Y)
 * are applied by the caller, so LOD math and the {z} placeholder
 * always agree on the same tz.
 */
export function computeVisibleRange(state: ViewState, view: Size, tileSize: number, tz: number): TileRange {
    const worldPerTile = tileSize / Math.pow(2, tz);
    const worldPerScreen = Math.pow(2, -state.zoom);
    const halfW = (view.width / 2) * worldPerScreen;
    const halfH = (view.height / 2) * worldPerScreen;
    return {
        minX: Math.floor((state.x - halfW) / worldPerTile),
        maxX: Math.floor((state.x + halfW) / worldPerTile),
        minY: Math.floor((state.y - halfH) / worldPerTile),
        maxY: Math.floor((state.y + halfH) / worldPerTile),
        n: Math.pow(2, tz),
    };
}

/**
 * Loads, caches and draws map tiles for the current view.
 * Works with a plain ViewState: the engine passes camera state, not a camera object.
 */
export class TileManager {
    private readonly cache: TileCache<TileImage>;
    private readonly inFlight = new Map<string, Promise<unknown>>();
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
        const tiles = this.visibleTiles(state, view);
        const z = this.tileZoomFor(state.zoom);
        const worldSize = this.tileSize / Math.pow(2, z);
        const scale = Math.pow(2, state.zoom);
        const cx = view.width / 2;
        const cy = view.height / 2;

        // Center-out ordering: tiles closer to the viewport center load first,
        // so the user always sees the important part of the map first under load.
        // Using squared screen distance — no sqrt needed for ordering.
        tiles.sort((a, b) => {
            const ax = (a.dx * worldSize - state.x) * scale + cx;
            const ay = (a.dy * worldSize - state.y) * scale + cy;
            const bx = (b.dx * worldSize - state.x) * scale + cx;
            const by = (b.dy * worldSize - state.y) * scale + cy;
            const da = (ax - cx) ** 2 + (ay - cy) ** 2;
            const db = (bx - cx) ** 2 + (by - cy) ** 2;
            return da - db;
        });

        for (const t of tiles) {
            const k = coordKey({ z: t.z, x: t.x, y: t.y });
            if (this.cache.get(k) || this.inFlight.has(k) || this.failed.has(k)) continue;

            const promise = this.source
                .getTile({ z: t.z, x: t.x, y: t.y })
                .then((image) => {
                    this.cache.set(k, image);
                    this.inFlight.delete(k);
                    this.onRequestRedraw();
                })
                .catch(() => {
                    this.failed.add(k);
                    this.inFlight.delete(k);
                    this.onRequestRedraw();
                });
            this.inFlight.set(k, promise);
        }
    }

    /** Draw cached tiles intersecting the viewport, scaled for fractional zoom */
    draw(ctx: CanvasRenderingContext2D, state: ViewState, view: Size): void {
        const z = this.tileZoomFor(state.zoom);
        const worldSize = this.tileSize / Math.pow(2, z);
        const screenTile = this.tileSize * Math.pow(2, state.zoom - z);
        const scale = Math.pow(2, state.zoom);
        for (const t of this.visibleTiles(state, view)) {
            const image = this.cache.get(coordKey({ z: t.z, x: t.x, y: t.y }));
            if (!image) continue;
            // world→screen inline: (world - center) * scale + viewport center
            const px = (t.dx * worldSize - state.x) * scale + view.width / 2;
            const py = (t.dy * worldSize - state.y) * scale + view.height / 2;
            const w = screenTile * (image.width / this.tileSize);
            const h = screenTile * (image.height / this.tileSize);
            ctx.drawImage(image, px, py, w + 0.5, h + 0.5);
        }
    }

    /** Canonical (z, x, y) set for this frame; dx/dy = pre-wrap draw offsets */
    private visibleTiles(state: ViewState, view: Size): VisibleTile[] {
        const z = this.tileZoomFor(state.zoom);
        const range = computeVisibleRange(state, view, this.tileSize, z);
        const grid = this.source.getGridSize?.(z) ?? {
            cols: Math.pow(2, z),
            rows: Math.pow(2, z),
        };
        const wrapX = this.source.wrapX ?? false;
        const tiles: VisibleTile[] = [];
        for (let ix = range.minX; ix <= range.maxX; ix++) {
            for (let iy = range.minY; iy <= range.maxY; iy++) {
                if (iy < 0 || iy >= grid.rows) continue; // Y outside world: skip
                let x = ix;
                if (wrapX)
                    x = ((ix % grid.cols) + grid.cols) % grid.cols; // X: wrap
                else if (ix < 0 || ix >= grid.cols) continue; // bounded world: skip
                tiles.push({ z, x, y: iy, dx: ix, dy: iy });
            }
        }
        return tiles;
    }
}
