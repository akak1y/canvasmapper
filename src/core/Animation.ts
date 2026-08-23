import { Easings, type EasingFn } from '../utils/math';

export interface AnimationOptions {
    duration: number;
    easing?: EasingFn;
    /** t = eased progress in [0, 1] */
    onUpdate: (t: number) => void;
    onComplete?: () => void;
}

/** One-shot rAF animation. Returns a cancel function. Used by flyTo (stage 3+) */
export function animate(options: AnimationOptions): () => void {
    const easing = options.easing ?? Easings.easeOutCubic;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number): void => {
        const t = Math.min(1, (now - start) / options.duration);
        options.onUpdate(easing(t));
        if (t < 1) frame = requestAnimationFrame(tick);
        else options.onComplete?.();
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
}
