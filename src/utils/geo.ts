import type { Point } from '../types';

/** Web Mercator: lon/lat (degrees) → world units of the 256×256 z0 world */
export function lonLatToWorld(lon: number, lat: number): Point {
    const x = ((lon + 180) / 360) * 256;
    const s = Math.sin((lat * Math.PI) / 180);
    const y = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * 256;
    return { x, y };
}

/** Inverse projection: world units → lon/lat (degrees) */
export function worldToLonLat(p: Point): { lon: number; lat: number } {
    const lon = (p.x / 256) * 360 - 180;
    const n = Math.PI - 2 * Math.PI * (p.y / 256);
    const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    return { lon, lat };
}
