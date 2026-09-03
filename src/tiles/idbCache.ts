/**
 * Minimal IndexedDB wrapper for caching tile blobs.
 * Key: string (tile address), value: Blob (decoded image).
 * Survives page reloads — user reopens the page, tiles are already there.
 */
export class IDBTileCache {
    private readonly dbName: string;
    private readonly storeName = 'tiles';
    private dbPromise: Promise<IDBDatabase> | null = null;

    constructor(namespace: string) {
        this.dbName = `canvasmapper_${namespace}`;
    }

    private open(): Promise<IDBDatabase> {
        if (this.dbPromise) return this.dbPromise;
        this.dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = () => {
                request.result.createObjectStore(this.storeName);
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        return this.dbPromise;
    }

    /** Get a cached blob, or undefined if not present */
    async get(key: string): Promise<Blob | undefined> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, 'readonly');
            const request = tx.objectStore(this.storeName).get(key);
            request.onsuccess = () => resolve(request.result as Blob | undefined);
            request.onerror = () => reject(request.error);
        });
    }

    /** Store a blob under a key */
    async set(key: string, value: Blob): Promise<void> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, 'readwrite');
            tx.objectStore(this.storeName).put(value, key);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    /** Check whether a key exists without loading the value */
    async has(key: string): Promise<boolean> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, 'readonly');
            // count with a key range is the fastest existence check
            const range = IDBKeyRange.only(key);
            const request = tx.objectStore(this.storeName).count(range);
            request.onsuccess = () => resolve(request.result > 0);
            request.onerror = () => reject(request.error);
        });
    }
}
