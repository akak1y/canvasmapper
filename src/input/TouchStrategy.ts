import type { Point } from '../types';
import type { InputHandlers, InputStrategy } from './types';

/** Touch / pen: one finger pans, two fingers pinch-zoom, quick single-finger taps fire onTap */
export class TouchStrategy implements InputStrategy {
    private target: HTMLElement | null = null;
    private handlers: InputHandlers | null = null;
    private pointers = new Map<number, Point>();
    private prevMid: Point | null = null;
    private prevDist = 0;

    // Tap detection
    private tapStart: { p: Point; t: number; pointerId: number } | null = null;
    private tapMoved = false;
    private readonly TAP_DISTANCE_SQ = 64; // 8px threshold
    private readonly TAP_MAX_MS = 500;

    attach(target: HTMLElement, handlers: InputHandlers): void {
        this.target = target;
        this.handlers = handlers;
        // We handle gestures ourselves; disable browser scroll/zoom on the canvas
        target.style.touchAction = 'none';
        target.addEventListener('pointerdown', this.onDown);
        target.addEventListener('pointermove', this.onMove);
        target.addEventListener('pointerup', this.onUp);
        target.addEventListener('pointercancel', this.onUp);
    }

    detach(): void {
        const t = this.target;
        if (!t) return;
        t.removeEventListener('pointerdown', this.onDown);
        t.removeEventListener('pointermove', this.onMove);
        t.removeEventListener('pointerup', this.onUp);
        t.removeEventListener('pointercancel', this.onUp);
        this.target = null;
        this.handlers = null;
    }

    private toLocal(e: PointerEvent): Point {
        const rect = this.target!.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    private onDown = (e: PointerEvent): void => {
        if (e.pointerType === 'mouse') return;

        if (this.pointers.size === 0) {
            this.handlers!.onPanStart();
            // Start tracking a potential tap (only for the very first finger)
            this.tapStart = { p: this.toLocal(e), t: performance.now(), pointerId: e.pointerId };
            this.tapMoved = false;
        } else {
            // Any extra finger invalidates the tap (pinch in progress)
            this.tapStart = null;
            this.tapMoved = true;
        }

        this.pointers.set(e.pointerId, this.toLocal(e));
        this.prevMid = null;
        this.prevDist = 0;
    };

    private onMove = (e: PointerEvent): void => {
        if (e.pointerType === 'mouse' || !this.pointers.has(e.pointerId)) return;
        const next = this.toLocal(e);
        const prev = this.pointers.get(e.pointerId)!;
        this.pointers.set(e.pointerId, next);

        // Any pointer moving more than the threshold kills the tap
        if (this.tapStart && this.tapStart.pointerId === e.pointerId) {
            const dx = next.x - this.tapStart.p.x;
            const dy = next.y - this.tapStart.p.y;
            if (dx * dx + dy * dy > this.TAP_DISTANCE_SQ) this.tapMoved = true;
        } else if (this.tapStart) {
            this.tapMoved = true;
        }

        if (this.pointers.size === 1) {
            this.handlers!.onPan(next.x - prev.x, next.y - prev.y);
            return;
        }

        if (this.pointers.size === 2) {
            const [a, b] = [...this.pointers.values()];
            const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (this.prevMid) {
                this.handlers!.onPan(mid.x - this.prevMid.x, mid.y - this.prevMid.y);
            }
            if (this.prevDist > 0 && dist > 0) {
                // log2 turns a distance ratio into zoom units: 2x spread = +1 zoom
                this.handlers!.onZoom(Math.log2(dist / this.prevDist), mid);
            }
            this.prevMid = mid;
            this.prevDist = dist;
        }
    };

    private onUp = (e: PointerEvent): void => {
        if (e.pointerType === 'mouse') return;

        // Detect tap: single finger, barely moved, released quickly
        if (
            this.tapStart &&
            this.tapStart.pointerId === e.pointerId &&
            !this.tapMoved &&
            performance.now() - this.tapStart.t < this.TAP_MAX_MS
        ) {
            this.handlers!.onTap(this.tapStart.p);
        }
        if (e.pointerId === this.tapStart?.pointerId) this.tapStart = null;

        this.pointers.delete(e.pointerId);
        this.prevMid = null;
        this.prevDist = 0;
        if (this.pointers.size === 0) {
            this.handlers!.onPanEnd({ x: 0, y: 0 });
            this.tapMoved = false;
        }
    };
}
