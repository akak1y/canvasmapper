import { describe, expect, it } from 'vitest';
import { VectorLayer } from '../../src/layers/VectorLayer';
import { lonLatToWorld, worldToLonLat } from '../../src/utils/geo';

describe('geo projection', () => {
    it('roundtrips lon/lat', () => {
        const back = worldToLonLat(lonLatToWorld(37.617, 55.756));
        expect(back.lon).toBeCloseTo(37.617, 6);
        expect(back.lat).toBeCloseTo(55.756, 6);
    });
    it('maps (0, 0) to the world center', () => {
        const p = lonLatToWorld(0, 0);
        expect(p.x).toBeCloseTo(128, 6);
        expect(p.y).toBeCloseTo(128, 6);
    });
});

describe('VectorLayer hit testing', () => {
    it('polygon contains interior points only', () => {
        const layer = new VectorLayer('zones');
        layer.addPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 },
        ]);
        expect(layer.hitTest({ x: 5, y: 5 }, 0, 0)).not.toBeNull();
        expect(layer.hitTest({ x: 15, y: 5 }, 0, 0)).toBeNull();
    });

    it('polyline hits within stroke tolerance', () => {
        const layer = new VectorLayer('routes');
        layer.addPolyline(
            [
                { x: 0, y: 0 },
                { x: 10, y: 0 },
            ],
            { strokeWidth: 2 }
        );
        expect(layer.hitTest({ x: 5, y: 0.5 }, 1, 0)).not.toBeNull();
        expect(layer.hitTest({ x: 5, y: 5 }, 1, 0)).toBeNull();
    });

    it('circle hits within radius', () => {
        const layer = new VectorLayer('radii');
        layer.addCircle({ x: 0, y: 0 }, 5);
        expect(layer.hitTest({ x: 3, y: 3 }, 0, 0)).not.toBeNull();
        expect(layer.hitTest({ x: 8, y: 0 }, 0, 0)).toBeNull();
    });
});
