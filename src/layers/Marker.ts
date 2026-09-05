import type { MarkerLayer } from './MarkerLayer';

export interface MarkerOptions {
    /** world position */
    x: number;
    y: number;
    /** icon image url; without it a colored dot is drawn */
    icon?: string;
    /** text label under the marker */
    label?: string;
    /** accent color for dot / label pill */
    color?: string;
    /** sprite size in screen px, constant across zooms (default 32) */
    size?: number;
    /** arbitrary user payload (player id, db row, anything) */
    data?: unknown;
}

let nextMarkerId = 1;

/**
 * A single map marker: plain data + a back-reference to its layer,
 * so mutations can request a redraw.
 */
export class Marker {
    readonly id: string;
    x: number;
    y: number;
    icon?: string;
    label?: string;
    color: string;
    size: number;
    data?: unknown;
    /** @internal set by the owning layer */
    layer: MarkerLayer | null = null;

    constructor(options: MarkerOptions) {
        this.id = 'm' + nextMarkerId++;
        this.x = options.x;
        this.y = options.y;
        this.icon = options.icon;
        this.label = options.label;
        this.color = options.color ?? '#7fd1ff';
        this.size = options.size ?? 32;
        this.data = options.data;
    }

    setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.layer?.requestRedraw();
    }

    /** Patch visual fields; the sprite cache re-keys automatically */
    update(patch: Partial<Omit<MarkerOptions, 'x' | 'y'>>): void {
        if (patch.icon !== undefined) this.icon = patch.icon;
        if (patch.label !== undefined) this.label = patch.label;
        if (patch.color !== undefined) this.color = patch.color;
        if (patch.size !== undefined) this.size = patch.size;
        if (patch.data !== undefined) this.data = patch.data;
        this.layer?.requestRedraw();
    }

    remove(): void {
        this.layer?.removeMarker(this);
    }
}
