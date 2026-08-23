import { describe, expect, it } from 'vitest';
import { clamp, Easings, lerp } from '../../src/utils/math';

describe('math utils', () => {
    it('clamp keeps value inside range', () => {
        expect(clamp(5, 0, 10)).toBe(5);
        expect(clamp(-1, 0, 10)).toBe(0);
        expect(clamp(11, 0, 10)).toBe(10);
    });

    it('lerp interpolates', () => {
        expect(lerp(0, 10, 0.5)).toBe(5);
        expect(lerp(2, 4, 0)).toBe(2);
        expect(lerp(2, 4, 1)).toBe(4);
    });

    it('easings start at 0 and end at 1', () => {
        for (const fn of Object.values(Easings)) {
            expect(fn(0)).toBeCloseTo(0);
            expect(fn(1)).toBeCloseTo(1);
        }
    });
});
