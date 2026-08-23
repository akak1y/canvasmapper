/** A point in 2D space */
export interface Point {
    x: number;
    y: number;
}

/** Width/height pair in CSS pixels */
export interface Size {
    width: number;
    height: number;
}

/** Axis-aligned rectangle in world coordinates */
export interface Bounds {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
