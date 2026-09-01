import { describe, expect, it, vi } from 'vitest';
import { MatrixTileSource } from '../../src/tiles/MatrixTileSource';

describe('MatrixTileSource', () => {
    it('builds urls with a 1-based file index by default', () => {
        const source = new MatrixTileSource({ urlTemplate: '/m/{x}-{y}.png' });
        expect(source.getUrl(0, 0)).toBe('/m/1-1.png');
        expect(source.getUrl(9, 4)).toBe('/m/10-5.png');
    });

    it('supports 0-based files', () => {
        const source = new MatrixTileSource({ urlTemplate: '/m/{x}_{y}.png', firstIndex: 0 });
        expect(source.getUrl(3, 1)).toBe('/m/3_1.png');
    });

    it('hasTile respects grid bounds and native zoom', () => {
        const source = new MatrixTileSource({ urlTemplate: '/m/{x}-{y}.png', cols: 10, rows: 10 });
        expect(source.hasTile({ z: 0, x: 0, y: 0 })).toBe(true);
        expect(source.hasTile({ z: 0, x: 9, y: 9 })).toBe(true);
        expect(source.hasTile({ z: 0, x: 10, y: 0 })).toBe(false);
        expect(source.hasTile({ z: 0, x: -1, y: 5 })).toBe(false);
        expect(source.hasTile({ z: 1, x: 0, y: 0 })).toBe(false);
    });

    it('warns on mixed tile sizes', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const source = new MatrixTileSource({ urlTemplate: '/m/{x}-{y}.png' });
        source.noteTileSize({ z: 0, x: 0, y: 0 }, { width: 256, height: 256 });
        expect(warn).not.toHaveBeenCalled();
        source.noteTileSize({ z: 0, x: 1, y: 0 }, { width: 128, height: 128 });
        expect(warn).toHaveBeenCalledTimes(1);
        warn.mockRestore();
    });

    it('can silence the warning', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const source = new MatrixTileSource({ urlTemplate: '/m/{x}-{y}.png', warnOnMismatch: false });
        source.noteTileSize({ z: 0, x: 0, y: 0 }, { width: 256, height: 256 });
        source.noteTileSize({ z: 0, x: 1, y: 0 }, { width: 128, height: 128 });
        expect(warn).not.toHaveBeenCalled();
        warn.mockRestore();
    });

    it('requires a template or a resolver', () => {
        expect(() => new MatrixTileSource({})).toThrow();
    });
});
