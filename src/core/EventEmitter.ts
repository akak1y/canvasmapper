/**
 * Event subscriber function shape.
 * `any` is intentional: event payloads are defined by library consumers;
 * `unknown` would break assignability of typed callbacks (contravariance).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- event payload is user-defined
type Listener = (...args: any[]) => void;

/**
 * Lightweight event emitter for CanvasMapper
 */
export class EventEmitter {
    private events: Map<string, Set<Listener>> = new Map();

    /** Subscribe to an event */
    on(event: string, callback: Listener): void {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event)!.add(callback);
    }

    /** Unsubscribe from an event */
    off(event: string, callback: Listener): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
            callbacks.delete(callback);
        }
    }

    /** Emit an event with data */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- event payload is user-defined
    emit(event: string, ...args: any[]): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
            callbacks.forEach((callback) => callback(...args));
        }
    }

    /** Subscribe to an event once */
    once(event: string, callback: Listener): void {
        const wrapper: Listener = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
}
