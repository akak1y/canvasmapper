import { MouseStrategy } from './MouseStrategy';
import { TouchStrategy } from './TouchStrategy';
import type { InputHandlers, InputStrategy } from './types';

/**
 * Binds input strategies to the canvas.
 * Mouse and touch strategies coexist: each filters its own pointer type.
 */
export class InputController {
    private readonly strategies: InputStrategy[];

    constructor(target: HTMLElement, handlers: InputHandlers) {
        this.strategies = [new MouseStrategy(), new TouchStrategy()];
        for (const strategy of this.strategies) strategy.attach(target, handlers);
    }

    destroy(): void {
        for (const strategy of this.strategies) strategy.detach();
    }
}
