import { describe, expect, it } from 'vitest';
import { IDBTileCache } from '../../src/tiles/idbCache';

describe('IDBTileCache', () => {
    it('is constructable with a namespace', () => {
        // We only test that the class exists and accepts its constructor arg.
        // Real IndexedDB is only available in browser environments.
        const cache = new IDBTileCache('test_ns');
        expect(cache).toBeDefined();
        expect(typeof cache.get).toBe('function');
        expect(typeof cache.set).toBe('function');
        expect(typeof cache.has).toBe('function');
    });
});
