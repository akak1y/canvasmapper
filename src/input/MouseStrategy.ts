import type { Point } from '../types';
import { clamp } from '../utils/math';
import type { InputHandlers, InputStrategy } from './types';

/** Mouse: left-button drag pans, wheel zooms, quick click taps */
export class MouseStrategy implements InputStrategy {
    private target: HTMLElement | null = null;
    private handlers: InputHandlers | null = null;
    private dragging = false;
    private last: Point = { x: 0, y: 0 };
    private moved = 0;
    private lastTime = 0;
    private velocity: Point = { x: 0, y: 0 };

    attach(target: HTMLElement, handlers: InputHandlers): void {
        this.target = target;
        this.handlers = handlers;
        target.style.cursor = 'grab';
        target.addEventListener('pointerdown', this.onDown);
        target.addEventListener('pointermove', this.onMove);
        target.addEventListener('pointerup', this.onUp);
        target.addEventListener('pointercancel', this.onUp);
        target.addEventListener('wheel', this.onWheel, { passive: false });
    }

    detach(): void {
        const t = this.target;
        if (!t) return;
        t.removeEventListener('pointerdown', this.onDown);
        t.removeEventListener('pointermove', this.onMove);
        t.removeEventListener('pointerup', this.onUp);
        t.removeEventListener('pointercancel', this.onUp);
        t.removeEventListener('wheel', this.onWheel);
        this.target = null;
        this.handlers = null;
    }

    private toLocal(e: PointerEvent | WheelEvent): Point {
        const rect = this.target!.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    private onDown = (e: PointerEvent): void => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        this.dragging = true;
        this.moved = 0;
        this.velocity = { x: 0, y: 0 };
        this.last = { x: e.clientX, y: e.clientY };
        this.lastTime = performance.now();
        this.target!.setPointerCapture(e.pointerId);
        this.target!.style.cursor = 'grabbing';
        this.handlers!.onPanStart();
    };

    private onMove = (e: PointerEvent): void => {
        if (!this.dragging || e.pointerType !== 'mouse') return;
        const dx = e.clientX - this.last.x;
        const dy = e.clientY - this.last.y;
        this.moved += Math.abs(dx) + Math.abs(dy);

        // Smoothed instantaneous velocity, used for inertia on release
        const now = performance.now();
        const dt = now - this.lastTime;
        if (dt > 0) {
            this.velocity = {
                x: this.velocity.x * 0.2 + (dx / dt) * 0.8,
                y: this.velocity.y * 0.2 + (dy / dt) * 0.8,
            };
        }
        this.lastTime = now;
        this.last = { x: e.clientX, y: e.clientY };
        this.handlers!.onPan(dx, dy);
    };

    private onUp = (e: PointerEvent): void => {
        if (e.pointerType !== 'mouse' || !this.dragging) return;
        this.dragging = false;
        this.target!.style.cursor = 'grab';
        if (this.moved < 5) this.handlers!.onTap(this.toLocal(e));
        else this.handlers!.onPanEnd(this.velocity);
    };

    private onWheel = (e: WheelEvent): void => {
        e.preventDefault();
        // Normalize line/pixel delta modes into zoom units
        const delta = clamp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.002), -0.6, 0.6);
        this.handlers!.onZoom(delta, this.toLocal(e));
    };
}
