import { loadImage } from '../utils/image';
import type { Marker } from './Marker';

/**
 * Composes and caches marker sprites (icon + label) on offscreen canvases.
 * Markers with the same visual signature share one sprite — composing a
 * sprite is the expensive part, and we do it once per unique look.
 */
export class SpriteCache {
    private readonly sprites = new Map<string, HTMLCanvasElement>();
    private readonly icons = new Map<string, Promise<HTMLImageElement>>();
    private readonly failedIcons = new Set<string>();

    /** Called when an async sprite finishes composing -> layer redraws */
    onSpriteReady: (() => void) | null = null;

    /** Visual signature: same look = same sprite */
    private keyOf(marker: Marker): string {
        return [marker.icon ?? '', marker.label ?? '', marker.color, marker.size].join('|');
    }

    private loadIcon(url: string): Promise<HTMLImageElement> {
        let promise = this.icons.get(url);
        if (!promise) {
            promise = loadImage(url);
            promise.catch(() => this.failedIcons.add(url));
            this.icons.set(url, promise);
        }
        return promise;
    }

    /**
     * Returns a ready sprite, or null while the icon is still loading
     * (the caller draws a cheap placeholder meanwhile).
     */
    getSprite(marker: Marker): HTMLCanvasElement | null {
        const key = this.keyOf(marker);
        const cached = this.sprites.get(key);
        if (cached) return cached;

        if (marker.icon && !this.failedIcons.has(marker.icon)) {
            this.loadIcon(marker.icon)
                .then((image) => {
                    this.sprites.set(key, this.compose(image, marker));
                    this.onSpriteReady?.();
                })
                .catch(() => {
                    this.sprites.set(key, this.compose(null, marker));
                    this.onSpriteReady?.();
                });
            return null;
        }

        const sprite = this.compose(null, marker);
        this.sprites.set(key, sprite);
        return sprite;
    }

    /** Draw icon (or dot) + label pill onto a fresh offscreen canvas */
    private compose(icon: HTMLImageElement | null, marker: Marker): HTMLCanvasElement {
        const size = marker.size;
        const labelHeight = marker.label ? 16 : 0;
        const pad = 4;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        ctx.font = '11px system-ui, sans-serif';
        const labelWidth = marker.label ? ctx.measureText(marker.label).width : 0;

        canvas.width = Math.ceil(Math.max(size, labelWidth + pad * 2));
        canvas.height = Math.ceil(size + labelHeight);

        const g = canvas.getContext('2d')!;
        if (icon) {
            g.drawImage(icon, (canvas.width - size) / 2, 0, size, size);
        } else {
            g.fillStyle = marker.color;
            g.beginPath();
            g.arc(canvas.width / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
            g.fill();
            g.strokeStyle = 'rgba(255,255,255,0.8)';
            g.lineWidth = 1;
            g.stroke();
        }

        if (marker.label) {
            g.font = '11px system-ui, sans-serif';
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            const pillWidth = g.measureText(marker.label).width + pad * 2;
            g.fillStyle = 'rgba(15, 20, 32, 0.75)';
            g.fillRect((canvas.width - pillWidth) / 2, size, pillWidth, labelHeight);
            g.fillStyle = '#ffffff';
            g.fillText(marker.label, canvas.width / 2, size + labelHeight / 2);
        }
        return canvas;
    }
}
