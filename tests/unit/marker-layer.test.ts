import { describe, expect, it } from 'vitest';
import { Camera } from '../../src/core/Camera';
import { computeVisibleBounds, MarkerLayer } from '../../src/layers/MarkerLayer';
import type { Size } from '../../src/types';

const view: Size = { width: 800, height: 600 };

describe('MarkerLayer', () => {
    it('adds, finds and removes markers', () => {
        const layer = new MarkerLayer('players');
        const marker = layer.addMarker({ x: 10, y: 20 });
        expect(layer.count).toBe(1);
        expect(layer.getMarker(marker.id)).toBe(marker);
        marker.remove();
        expect(layer.count).toBe(0);
        expect(layer.getMarker(marker.id)).toBeUndefined();
    });

    it('clear() empties the layer', () => {
        const layer = new MarkerLayer('pois');
        layer.addMarker({ x: 1, y: 1 });
        layer.addMarker({ x: 2, y: 2 });
        layer.clear();
        expect(layer.count).toBe(0);
    });

    it('computeVisibleBounds expands the viewport by the margin', () => {
        const camera = new Camera();
        camera.setViewState({ x: 0, y: 0, zoom: 0 }); // scale 1
        const bounds = computeVisibleBounds(camera, view, 64);
        expect(bounds.minX).toBe(-464);
        expect(bounds.maxX).toBe(464);
        expect(bounds.minY).toBe(-364);
        expect(bounds.maxY).toBe(364);
    });

    it('hitTest finds a marker under the cursor', () => {
        const layer = new MarkerLayer('players');
        const camera = new Camera();
        camera.setViewState({ x: 0, y: 0, zoom: 0 });
        const marker = layer.addMarker({ x: 100, y: 50, size: 20 });
        // screen == world at zoom 0 with center 0,0 => screen = world + (400, 300)
        const hit = layer.hitTest({ x: 500, y: 350 }, camera, view);
        expect(hit).toBe(marker);
        const miss = layer.hitTest({ x: 0, y: 0 }, camera, view);
        expect(miss).toBeNull();
    });
});
