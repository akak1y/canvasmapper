import { describe, expect, it } from 'vitest';
import { Camera } from '../../src/core/Camera';
import type { Size } from '../../src/types';

const view: Size = { width: 800, height: 600 };

describe('Camera', () => {
    it('worldToScreen and screenToWorld are inverse', () => {
        const camera = new Camera();
        camera.setViewState({ x: 100, y: -50, zoom: 2 });
        const world = { x: 123, y: 456 };
        const screen = camera.worldToScreen(world, view);
        const back = camera.screenToWorld(screen, view);
        expect(back.x).toBeCloseTo(world.x);
        expect(back.y).toBeCloseTo(world.y);
    });

    it('zoomAt keeps the world point under the cursor fixed', () => {
        const camera = new Camera();
        camera.setViewState({ x: 0, y: 0, zoom: 1 });
        const anchor = { x: 500, y: 200 };
        const fixed = camera.screenToWorld(anchor, view);
        camera.zoomAt(anchor, view, 3);
        const after = camera.worldToScreen(fixed, view);
        expect(after.x).toBeCloseTo(anchor.x, 5);
        expect(after.y).toBeCloseTo(anchor.y, 5);
    });

    it('respects zoom limits', () => {
        const camera = new Camera({ minZoom: 0, maxZoom: 4 });
        camera.setViewState({ zoom: 10 });
        expect(camera.getViewState().zoom).toBe(4);
        camera.setViewState({ zoom: -3 });
        expect(camera.getViewState().zoom).toBe(0);
    });

    it('panByScreen moves the view opposite to the drag', () => {
        const camera = new Camera();
        camera.setViewState({ x: 0, y: 0, zoom: 0 }); // scale = 1
        camera.panByScreen(10, -5);
        const state = camera.getViewState();
        expect(state.x).toBeCloseTo(-10);
        expect(state.y).toBeCloseTo(5);
    });
});
