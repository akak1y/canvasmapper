/** Clamp a value into [min, max] */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

/** Linear interpolation from a to b by t in [0, 1] */
export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

/** Easing: maps linear progress [0..1] to a curved one */
export type EasingFn = (t: number) => number;

export const Easings = {
    linear: (t: number): number => t,
    easeOutCubic: (t: number): number => 1 - Math.pow(1 - t, 3),
    easeInOutCubic: (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};
