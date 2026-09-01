export interface MarkerOptions {
    x: number;
    y: number;
    icon?: string;
    label?: string;
}

export interface Marker {
    id: string;
    options: MarkerOptions;
}

/**
 * MarkerLayer renders markers on a layer
 */
export class MarkerLayer {
    // TODO: implement marker rendering
}
