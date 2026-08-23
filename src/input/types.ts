import type { Point } from '../types';

/** Callbacks the engine gives to the input layer */
export interface InputHandlers {
    onPanStart(): void;
    /** Screen-space drag delta, CSS pixels */
    onPan(dx: number, dy: number): void;
    /** Called on release; velocity in px/ms for inertia */
    onPanEnd(velocity: Point): void;
    /** Zoom intent: delta in zoom units, anchor in canvas-local px */
    onZoom(delta: number, anchor: Point): void;
    /** Quick click without dragging, canvas-local px */
    onTap(screen: Point): void;
}

/** A device-specific way to produce input intents (Strategy pattern) */
export interface InputStrategy {
    attach(target: HTMLElement, handlers: InputHandlers): void;
    detach(): void;
}
