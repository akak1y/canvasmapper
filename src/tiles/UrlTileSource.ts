import type { TileCoord, TileImage, TileSource } from './TileSource';
import { loadImage } from '../utils/image';

export interface UrlTileSourceOptions {
    /** e.g. '/tiles/{z}/{x}_{y}.png' or 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' */
    urlTemplate: string;
    minNativeZoom?: number;
    maxNativeZoom?: number;
}

/** Serves tiles over HTTP using a URL template */
export class UrlTileSource implements TileSource {
    readonly minNativeZoom?: number;
    readonly maxNativeZoom?: number;
    private readonly template: string;

    constructor(options: UrlTileSourceOptions) {
        this.template = options.urlTemplate;
        this.minNativeZoom = options.minNativeZoom;
        this.maxNativeZoom = options.maxNativeZoom;
    }

    getTileUrl(coord: TileCoord): string {
        return this.template.replace('{z}', String(coord.z)).replace('{x}', String(coord.x)).replace('{y}', String(coord.y));
    }

    getTile(coord: TileCoord): Promise<TileImage> {
        return loadImage(this.getTileUrl(coord));
    }
}
