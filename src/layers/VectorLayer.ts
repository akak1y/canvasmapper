import type { ViewState } from '../core/Camera';
import type { Point, Size } from '../types';
import { lonLatToWorld } from '../utils/geo';

export interface VectorStyle {
    strokeColor?: string;
    /** screen px, constant across zooms */
    strokeWidth?: number;
    dash?: number[];
    /** polygon/circle only */
    fillColor?: string;
    fillOpacity?: number;
}

export interface VectorShape {
    id: number;
    kind: 'polyline' | 'polygon' | 'circle';
    /** world units; circle uses points[0] as center */
    points: Point[];
    /** world units, circle only */
    radius?: number;
    style: VectorStyle;
    data?: unknown;
    bbox: { minX: number; minY: number; maxX: number; maxY: number };
}

export interface VectorLayerOptions {
    zIndex?: number;
    defaults?: VectorStyle;
}

interface GeoGeometry {
    type: string;
    coordinates: unknown;
}

const DEFAULTS: VectorStyle = { strokeColor: '#7fd1ff', strokeWidth: 2 };

function computeBbox(points: Point[], radius = 0): VectorShape['bbox'] {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const p of points) {
        minX = Math.min(minX, p.x - radius);
        minY = Math.min(minY, p.y - radius);
        maxX = Math.max(maxX, p.x + radius);
        maxY = Math.max(maxY, p.y + radius);
    }
    return { minX, minY, maxX, maxY };
}

function pointInPolygon(p: Point, pts: Point[]): boolean {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const xi = pts[i].x;
        const yi = pts[i].y;
        const xj = pts[j].x;
        const yj = pts[j].y;
        if (yi > p.y !== yj > p.y && p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi) inside = true;
    }
    return inside;
}

function distToSegment(p: Point, a: Point, b: Point): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    let t = len2 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2 : 0;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/**
 * Vector overlays: polylines, polygons, circles.
 * Shapes live in world units; styles are screen-constant (px widths).
 * Off-viewport shapes are culled by bbox before any path building.
 */
export class VectorLayer {
    readonly name: string;
    zIndex: number;
    visible = true;
    onRequestRedraw: (() => void) | null = null;

    private shapes: VectorShape[] = [];
    private nextId = 1;
    private readonly defaults: VectorStyle;

    constructor(name: string, options: VectorLayerOptions = {}) {
        this.name = name;
        this.zIndex = options.zIndex ?? 0;
        this.defaults = options.defaults ?? {};
    }

    get count(): number {
        return this.shapes.length;
    }

    addPolyline(points: Point[], style: VectorStyle = {}, data?: unknown): VectorShape {
        return this.push({ kind: 'polyline', points, style, data });
    }

    addPolygon(points: Point[], style: VectorStyle = {}, data?: unknown): VectorShape {
        return this.push({ kind: 'polygon', points, style, data });
    }

    addCircle(center: Point, radius: number, style: VectorStyle = {}, data?: unknown): VectorShape {
        return this.push({ kind: 'circle', points: [center], radius, style, data });
    }

    /**
     * GeoJSON (lon/lat) → shapes. Supports LineString, MultiLineString,
     * Polygon (outer ring; holes ignored in v1), MultiPolygon.
     */
    addGeoJSON(
        geojson: { type: string; features?: Array<{ geometry: GeoGeometry }>; geometry?: GeoGeometry } & Partial<GeoGeometry>,
        style: VectorStyle = {},
        data?: unknown
    ): VectorShape[] {
        const geometries: GeoGeometry[] =
            geojson.type === 'FeatureCollection'
                ? (geojson.features ?? []).map((f) => f.geometry)
                : geojson.type === 'Feature'
                  ? [geojson.geometry as GeoGeometry]
                  : [geojson as GeoGeometry];
        const toWorld = (ring: [number, number][]) => ring.map(([lon, lat]) => lonLatToWorld(lon, lat));
        const added: VectorShape[] = [];
        for (const g of geometries) {
            if (!g) continue;
            if (g.type === 'LineString') added.push(this.addPolyline(toWorld(g.coordinates as [number, number][]), style, data));
            else if (g.type === 'MultiLineString')
                for (const line of g.coordinates as [number, number][][]) added.push(this.addPolyline(toWorld(line), style, data));
            else if (g.type === 'Polygon') added.push(this.addPolygon(toWorld((g.coordinates as [number, number][][])[0]), style, data));
            else if (g.type === 'MultiPolygon')
                for (const poly of g.coordinates as [number, number][][][]) added.push(this.addPolygon(toWorld(poly[0]), style, data));
        }
        return added;
    }

    remove(shape: VectorShape): void {
        const i = this.shapes.indexOf(shape);
        if (i >= 0) this.shapes.splice(i, 1);
        this.onRequestRedraw?.();
    }

    clear(): void {
        this.shapes = [];
        this.onRequestRedraw?.();
    }

    draw(ctx: CanvasRenderingContext2D, state: ViewState, view: Size): void {
        if (!this.visible || this.shapes.length === 0) return;
        const scale = Math.pow(2, state.zoom);
        const halfW = view.width / 2 / scale;
        const halfH = view.height / 2 / scale;
        const minX = state.x - halfW;
        const maxX = state.x + halfW;
        const minY = state.y - halfH;
        const maxY = state.y + halfH;
        const toX = (wx: number) => (wx - state.x) * scale + view.width / 2;
        const toY = (wy: number) => (wy - state.y) * scale + view.height / 2;

        for (const s of this.shapes) {
            if (s.bbox.maxX < minX || s.bbox.minX > maxX || s.bbox.maxY < minY || s.bbox.minY > maxY) continue;
            const st = { ...DEFAULTS, ...this.defaults, ...s.style };
            ctx.save();
            ctx.lineWidth = st.strokeWidth ?? 2;
            ctx.strokeStyle = st.strokeColor ?? '#7fd1ff';
            if (st.dash) ctx.setLineDash(st.dash);
            ctx.beginPath();
            if (s.kind === 'circle') {
                ctx.arc(toX(s.points[0].x), toY(s.points[0].y), (s.radius ?? 0) * scale, 0, Math.PI * 2);
            } else {
                ctx.moveTo(toX(s.points[0].x), toY(s.points[0].y));
                for (let i = 1; i < s.points.length; i++) ctx.lineTo(toX(s.points[i].x), toY(s.points[i].y));
                if (s.kind === 'polygon') ctx.closePath();
            }
            if (st.fillColor && s.kind !== 'polyline') {
                ctx.globalAlpha = st.fillOpacity ?? 0.25;
                ctx.fillStyle = st.fillColor;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
            ctx.stroke();
            ctx.restore();
        }
    }

    /** Topmost shape under a world point; tolerance in screen px */
    hitTest(world: Point, tolerancePx: number, zoom: number): VectorShape | null {
        const scale = Math.pow(2, zoom);
        const tol = tolerancePx / scale;
        for (let i = this.shapes.length - 1; i >= 0; i--) {
            const s = this.shapes[i];
            if (s.kind === 'polygon') {
                if (pointInPolygon(world, s.points)) return s;
                continue;
            }
            if (s.kind === 'circle') {
                const d = Math.hypot(world.x - s.points[0].x, world.y - s.points[0].y);
                if (d <= (s.radius ?? 0) + tol) return s;
                continue;
            }
            const half = (s.style.strokeWidth ?? this.defaults.strokeWidth ?? 2) / 2 / scale + tol;
            for (let j = 1; j < s.points.length; j++) {
                if (distToSegment(world, s.points[j - 1], s.points[j]) <= half) return s;
            }
        }
        return null;
    }

    private push(part: Omit<VectorShape, 'id' | 'bbox'>): VectorShape {
        const shape: VectorShape = {
            ...part,
            id: this.nextId++,
            bbox: computeBbox(part.points, part.radius ?? 0),
        };
        this.shapes.push(shape);
        this.onRequestRedraw?.();
        return shape;
    }
}
