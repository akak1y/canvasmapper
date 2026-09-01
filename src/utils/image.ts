import type { Size } from '../types';
import type { TileImage } from '../tiles/TileSource';

/** Load an <img> and resolve when it is ready to draw */
export function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Image failed to load: ${url}`));
        image.src = url;
    });
}

/** Natural pixel size of any TileImage flavor */
export function tileImageSize(image: TileImage): Size {
    if (image instanceof HTMLImageElement) {
        return { width: image.naturalWidth, height: image.naturalHeight };
    }
    return { width: image.width, height: image.height };
}
