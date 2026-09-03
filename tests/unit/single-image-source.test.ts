import { describe, expect, it } from 'vitest';
import { SingleImageSource } from '../../src/tiles/SingleImageSource';

describe('SingleImageSource', () => {
    it('rejects non-zero zooms via hasTile', () => {
        // In Node we cannot create a real Blob → we pass a fake one and only
        // exercise the synchronous part of hasTile (the z !== 0 check).
        const fakeBlob = new Blob([]);
        const source = new SingleImageSource({ source: fakeBlob, disableCache: true });
        expect(source.hasTile({ z: 1, x: 0, y: 0 })).toBe(false);
        expect(source.hasTile({ z: -1, x: 0, y: 0 })).toBe(false);
    });

    it('exposes native zoom bounds 0..0', () => {
        const fakeBlob = new Blob([]);
        const source = new SingleImageSource({ source: fakeBlob, disableCache: true });
        expect(source.minNativeZoom).toBe(0);
        expect(source.maxNativeZoom).toBe(0);
    });
});
