import { fetchAsBlob } from '../utils/blob';
import { IDBTileCache } from './idbCache';
import type { TileCoord, TileImage, TileSource } from './TileSource';

export interface SingleImageSourceOptions {
    /** The source image as a Blob (preferred) or a URL to fetch */
    source: Blob | string;
    /** Tile size in pixels (default 256) */
    tileSize?: number;
    /** Cache namespace; same namespace = shared cache between instances */
    cacheKey?: string;
    /** Skip IndexedDB caching (default false) */
    disableCache?: boolean;
}

/**
 * Serves tiles sliced on-the-fly from a single large image.
 *
 * How it works:
 *  - The whole image is loaded ONCE as a Blob (via fetch or directly passed).
 *  - Each tile request decodes only its region via createImageBitmap.
 *  - Decoded tiles are cached in IndexedDB, so second visits are instant.
 *
 * Memory cost: only the Blob bytes + currently-decoded tiles.
 * A 10 000 x 10 000 JPEG typically weighs ~5–15 MB, easily fits anywhere.
 */
export class SingleImageSource implements TileSource {
    // One native level: the source image is a flat matrix at zoom 0.
    // Other zooms are handled by TileManager's LOD clamp.
    readonly minNativeZoom = 0;
    readonly maxNativeZoom = 0;

    private readonly tileSize: number;
    private readonly cache: IDBTileCache | null;
    private blobPromise: Promise<Blob>;
    private imageDimensions: { width: number; height: number } | null = null;
    private cols = 0;
    private rows = 0;

    constructor(options: SingleImageSourceOptions) {
        this.tileSize = options.tileSize ?? 256;
        this.cache = options.disableCache ? null : new IDBTileCache(options.cacheKey ?? `img_${this.tileSize}`);

        // Resolve the blob once, regardless of input shape.
        this.blobPromise = typeof options.source === 'string' ? fetchAsBlob(options.source) : Promise.resolve(options.source);

        // Eagerly measure the image so hasTile can filter out-of-range requests.
        // Swallow failures: dimensions simply stay unknown (hasTile stays
        // optimistic), and a real error will surface later via getTile's reject,
        // which TileManager already handles with its negative cache.
        this.measureImage().catch(() => {});
    }

    /**
     * Decode the blob as an ImageBitmap once to read natural dimensions,
     * then throw it away — we only need width/height for bounds checking.
     */
    private async measureImage(): Promise<void> {
        const blob = await this.blobPromise;
        const probe = await createImageBitmap(blob);
        this.imageDimensions = { width: probe.width, height: probe.height };
        this.cols = Math.ceil(probe.width / this.tileSize);
        this.rows = Math.ceil(probe.height / this.tileSize);
        probe.close();
    }

    hasTile(coord: TileCoord): boolean {
        if (coord.z !== 0) return false;
        // Dimensions may not be known yet (async measureImage); until then
        // we optimistically allow the request and let the tile fail later.
        if (!this.imageDimensions) return true;
        return coord.x >= 0 && coord.y >= 0 && coord.x < this.cols && coord.y < this.rows;
    }

    async getTile(coord: TileCoord): Promise<TileImage> {
        // 1. Try IndexedDB cache first
        const cacheKey = `${coord.z}/${coord.x}_${coord.y}`;
        if (this.cache) {
            const cached = await this.cache.get(cacheKey);
            if (cached) return createImageBitmap(cached);
        }

        // 2. Decode only the requested region from the source blob.
        //    sx/sy/sw/sh tell createImageBitmap to decode just that rect.
        const blob = await this.blobPromise;
        const sx = coord.x * this.tileSize;
        const sy = coord.y * this.tileSize;
        const dims = this.imageDimensions;
        const sw = dims ? Math.min(this.tileSize, dims.width - sx) : this.tileSize;
        const sh = dims ? Math.min(this.tileSize, dims.height - sy) : this.tileSize;

        const tile = await createImageBitmap(blob, sx, sy, sw, sh);

        // 3. Warm the cache asynchronously — don't slow down the tile draw.
        if (this.cache && dims) {
            this.persistToCache(cacheKey, tile).catch(() => {
                /* cache write is best-effort */
            });
        }

        return tile;
    }

    /**
     * Re-encode the tile bitmap into a PNG blob and write to IndexedDB.
     * Uses OffscreenCanvas.convertToBlob when available (off-main-thread-ready),
     * falls back to a regular canvas otherwise.
     */
    private async persistToCache(key: string, bitmap: ImageBitmap): Promise<void> {
        if (!this.cache) return;

        let pngBlob: Blob;

        if (typeof OffscreenCanvas !== 'undefined') {
            // Branch 1: canvas is OffscreenCanvas, ctx is OffscreenCanvasRenderingContext2D
            const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.drawImage(bitmap, 0, 0);
            pngBlob = await canvas.convertToBlob({ type: 'image/png' });
        } else {
            // Branch 2: canvas is HTMLCanvasElement, ctx is CanvasRenderingContext2D
            const canvas = document.createElement('canvas');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.drawImage(bitmap, 0, 0);
            pngBlob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b ?? new Blob()), 'image/png'));
        }

        await this.cache.set(key, pngBlob);
    }
}
