import type { TileCoord, TileImage, TileSource } from './TileSource';
import { loadImage } from '../utils/image';

export interface UrlTileSourceOptions {
    /** e.g. '/tiles/{z}/{x}_{y}.png' or 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' */
    urlTemplate: string;
    minNativeZoom?: number;
    maxNativeZoom?: number;
    wrapX?: boolean;
}

/** Serves tiles over HTTP using a URL template */
export class UrlTileSource implements TileSource {
    readonly minNativeZoom?: number;
    readonly maxNativeZoom?: number;
    readonly wrapX: boolean;
    private readonly template: string;

    constructor(options: UrlTileSourceOptions) {
        this.template = options.urlTemplate;
        this.minNativeZoom = options.minNativeZoom;
        this.maxNativeZoom = options.maxNativeZoom;
        this.wrapX = options.wrapX ?? false;
    }

    getTileUrl(coord: TileCoord): string {
        return this.template.replace('{z}', String(coord.z)).replace('{x}', String(coord.x)).replace('{y}', String(coord.y));
    }

    getGridSize(z: number): { cols: number; rows: number } {
        const n = Math.pow(2, z);
        return { cols: n, rows: n };
    }

    getTile(coord: TileCoord): Promise<TileImage> {
        const grid = this.getGridSize(coord.z);
        if (coord.x < 0 || coord.x >= grid.cols || coord.y < 0 || coord.y >= grid.rows) {
            return Promise.reject(new Error(`tile ${coord.z}/${coord.x}_${coord.y} is outside the source grid`));
        }
        return loadImage(this.getTileUrl(coord));
    }
}
