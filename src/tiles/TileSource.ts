/** Tile coordinate in pyramid space */
export interface TileCoord {
    z: number;
    x: number;
    y: number;
}

/** Anything ctx.drawImage accepts and tileImageSize can measure */
export type TileImage = ImageBitmap | HTMLImageElement;

/** Contract every tile backend implements */
export interface TileSource {
    /** lowest zoom level with real data */
    readonly minNativeZoom?: number;
    /** highest zoom level with real data */
    readonly maxNativeZoom?: number;
    /** world wraps horizontally (slippy/OSM); default false = bounded world */
    readonly wrapX?: boolean;
    /** load/decode one tile; reject for coordinates outside the source */
    getTile(coord: TileCoord): Promise<TileImage>;
    /** grid dimensions at zoom z; optional: defaults to slippy 2^z×2^z */
    getGridSize?(z: number): { cols: number; rows: number };
    /** optional cheap pre-filter (demos, tools) */
    hasTile?(coord: TileCoord): boolean;
}
