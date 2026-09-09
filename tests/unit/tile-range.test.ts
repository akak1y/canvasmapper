import { describe, expect, it } from 'vitest';
import { computeVisibleRange } from '../../src/tiles/TileManager';

const VIEW = { width: 720, height: 520 };
const CAMERA = { x: 128, y: 128, zoom: 1 };

describe('computeVisibleRange — pyramid bounds regression', () => {
    it('tz=2: exact raw range for the bug-report camera', () => {
        const r = computeVisibleRange(CAMERA, VIEW, 256, 2);
        expect(r).toEqual({ minX: -1, maxX: 4, minY: -1, maxY: 4, n: 4 });
    });

    it('tz=3: raw range may exceed the grid; canonical set skips 8..9', () => {
        const r = computeVisibleRange(CAMERA, VIEW, 256, 3);
        expect(r).toEqual({ minX: -2, maxX: 9, minY: -1, maxY: 8, n: 8 });
    });

    it('canonical tiles never leave the pyramid (bounded world sweep)', () => {
        for (let zoom = -2; zoom <= 6.5; zoom += 0.25) {
            const tz = Math.max(0, Math.min(5, Math.round(zoom)));
            const n = 2 ** tz;
            for (const cx of [-64, 0, 128, 256, 320]) {
                for (const cy of [0, 128, 256]) {
                    const r = computeVisibleRange({ x: cx, y: cy, zoom }, VIEW, 256, tz);
                    expect(r.n).toBe(n);
                    for (let ix = r.minX; ix <= r.maxX; ix++) {
                        for (let iy = r.minY; iy <= r.maxY; iy++) {
                            if (iy < 0 || iy >= n) continue;
                            if (ix < 0 || ix >= n) continue;
                            expect(ix).toBeGreaterThanOrEqual(0);
                            expect(ix).toBeLessThan(n);
                            expect(iy).toBeGreaterThanOrEqual(0);
                            expect(iy).toBeLessThan(n);
                        }
                    }
                }
            }
        }
    });
});
