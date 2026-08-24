/** Tile address in the pyramid */
export interface TileCoord {
    z: number;
    x: number;
    y: number;
}

/** Anything drawable: decoded bitmap, canvas or <img> */
export type TileImage = ImageBitmap | HTMLCanvasElement | HTMLImageElement;

/**
 * Contract for anything that can supply map tiles (Strategy pattern).
 * Implementations: UrlTileSource (now), MatrixTileSource (stage 3),
 * SingleImageSource (stage 4), your own — just implement this interface.
 */
export interface TileSource {
    /** Load and decode a tile. Reject if the tile does not exist. */
    getTile(coord: TileCoord): Promise<TileImage>;
    /** Lowest zoom level this source actually has (default 0) */
    readonly minNativeZoom?: number;
    /** Highest zoom level this source actually has (default 22) */
    readonly maxNativeZoom?: number;
}
