import { describe, expect, it } from 'vitest';
import { TileCache } from '../../src/tiles/TileCache';

describe('TileCache (LRU)', () => {
    it('evicts the least recently used entry', () => {
        const cache = new TileCache<number>(2);
        cache.set('a', 1);
        cache.set('b', 2);
        cache.set('c', 3); // evicts 'a'
        expect(cache.has('a')).toBe(false);
        expect(cache.get('b')).toBe(2);
        expect(cache.get('c')).toBe(3);
    });

    it('get() refreshes recency', () => {
        const cache = new TileCache<number>(2);
        cache.set('a', 1);
        cache.set('b', 2);
        cache.get('a'); // 'a' becomes most recent
        cache.set('c', 3); // evicts 'b'
        expect(cache.has('a')).toBe(true);
        expect(cache.has('b')).toBe(false);
    });

    it('overwrite does not duplicate entries', () => {
        const cache = new TileCache<number>(2);
        cache.set('a', 1);
        cache.set('a', 10);
        cache.set('b', 2);
        expect(cache.size).toBe(2);
        expect(cache.get('a')).toBe(10);
    });
});
