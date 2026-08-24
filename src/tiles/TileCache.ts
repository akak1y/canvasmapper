/**
 * Generic LRU cache built on Map insertion order.
 * get() refreshes recency; set() evicts the oldest when over capacity.
 */
export class TileCache<V> {
    private readonly entries = new Map<string, V>();

    constructor(private readonly max: number) {}

    get size(): number {
        return this.entries.size;
    }

    has(key: string): boolean {
        return this.entries.has(key);
    }

    get(key: string): V | undefined {
        const value = this.entries.get(key);
        if (value !== undefined) {
            // Re-insert so the entry becomes the most recent one
            this.entries.delete(key);
            this.entries.set(key, value);
        }
        return value;
    }

    set(key: string, value: V): void {
        if (this.entries.has(key)) this.entries.delete(key);
        this.entries.set(key, value);
        while (this.entries.size > this.max) {
            const oldest = this.entries.keys().next();
            if (oldest.done) break;
            this.entries.delete(oldest.value);
        }
    }

    clear(): void {
        this.entries.clear();
    }
}
