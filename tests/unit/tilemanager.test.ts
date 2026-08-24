import { describe, expect, it } from 'vitest';
import { computeVisibleRange } from '../../src/tiles/TileManager';
import { UrlTileSource } from '../../src/tiles/UrlTileSource';
import type { Size } from '../../src/types';

const view: Size = { width: 512, height: 512 };

describe('computeVisibleRange', () => {
    it('returns 3x3 tiles for a 512px viewport at zoom 0', () => {
        const range = computeVisibleRange({ x: 0, y: 0, zoom: 0 }, view, 256, 0);
        expect(range).toEqual({ minX: -1, maxX: 1, minY: -1, maxY: 1 });
    });

    it('keeps the range consistent when zoomed in', () => {
        const range = computeVisibleRange({ x: 0, y: 0, zoom: 2 }, view, 256, 2);
        expect(range.minX).toBe(-1);
        expect(range.maxX).toBe(1);
        expect(range.minY).toBe(-1);
        expect(range.maxY).toBe(1);
    });
});

describe('UrlTileSource', () => {
    it('substitutes the {z}/{x}_{y} template', () => {
        const source = new UrlTileSource({ urlTemplate: '/tiles/{z}/{x}_{y}.png' });
        expect(source.getTileUrl({ z: 2, x: 3, y: 1 })).toBe('/tiles/2/3_1.png');
    });

    it('supports the classic OSM {z}/{x}/{y} template too', () => {
        const source = new UrlTileSource({ urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' });
        expect(source.getTileUrl({ z: 5, x: 17, y: 10 })).toBe('https://tile.openstreetmap.org/5/17/10.png');
    });
});
