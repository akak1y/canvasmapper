import type { Size } from '../types';
import { loadImage, tileImageSize } from '../utils/image';
import type { TileCoord, TileImage, TileSource } from './TileSource';

export interface MatrixTileSourceOptions {
    /** e.g. '/tiles/{x}-{y}.png'; ignored if resolveUrl is set */
    urlTemplate?: string;
    /** custom resolver for exotic cases (data/blob urls) */
    resolveUrl?: (x: number, y: number) => string;
    /** grid size in tiles; enables fast out-of-range skipping */
    cols?: number;
    rows?: number;
    /** first file index: 1 for '1-1.png' (default), 0 for '0-0.png' */
    firstIndex?: 0 | 1;
    /** warn when tile sizes differ (default true) */
    warnOnMismatch?: boolean;
    /** which zoom level this matrix represents (default 0) */
    nativeZoom?: number;
}

/**
 * A flat matrix of same-size images: 1-1.png .. N-N.png.
 * The matrix is a single native zoom level; other zooms are scaled
 * automatically by TileManager (LOD clamp).
 */
export class MatrixTileSource implements TileSource {
    readonly minNativeZoom: number;
    readonly maxNativeZoom: number;

    private readonly template: string | null;
    private readonly resolveUrl: ((x: number, y: number) => string) | null;
    private readonly cols?: number;
    private readonly rows?: number;
    private readonly firstIndex: number;
    private readonly warnOnMismatch: boolean;

    private expected: Size | null = null;

    constructor(options: MatrixTileSourceOptions) {
        if (!options.urlTemplate && !options.resolveUrl) {
            throw new Error('MatrixTileSource requires urlTemplate or resolveUrl');
        }
        this.template = options.urlTemplate ?? null;
        this.resolveUrl = options.resolveUrl ?? null;
        this.cols = options.cols;
        this.rows = options.rows;
        this.firstIndex = options.firstIndex ?? 1;
        this.warnOnMismatch = options.warnOnMismatch ?? true;
        const nz = options.nativeZoom ?? 0;
        this.minNativeZoom = nz;
        this.maxNativeZoom = nz;
    }

    /** File url for internal 0-based tile indices */
    getUrl(x: number, y: number): string {
        if (this.resolveUrl) return this.resolveUrl(x, y);
        return this.template!.replace('{x}', String(x + this.firstIndex)).replace('{y}', String(y + this.firstIndex));
    }

    hasTile(coord: TileCoord): boolean {
        if (coord.z !== this.minNativeZoom) return false;
        if (this.cols === undefined || this.rows === undefined) return true;
        return coord.x >= 0 && coord.y >= 0 && coord.x < this.cols && coord.y < this.rows;
    }

    async getTile(coord: TileCoord): Promise<TileImage> {
        const image = await loadImage(this.getUrl(coord.x, coord.y));
        this.noteTileSize(coord, tileImageSize(image));
        return image;
    }

    /**
     * Size bookkeeping: first size becomes "expected", the largest one is
     * the "best". Mismatches produce a warning; rendering stretches every
     * tile to its grid cell anyway (smaller sources just look blurrier).
     */
    noteTileSize(coord: TileCoord, size: Size): void {
        if (!this.expected) this.expected = size;
        if (this.warnOnMismatch && (size.width !== this.expected.width || size.height !== this.expected.height)) {
            console.warn(
                `CanvasMapper: tile ${coord.x}_${coord.y} is ${size.width}x${size.height}, ` +
                    `expected ${this.expected.width}x${this.expected.height}. ` +
                    'Mixed sizes will be stretched and may look blurry. ' +
                    'Pass warnOnMismatch: false to silence this.'
            );
        }
    }
}
