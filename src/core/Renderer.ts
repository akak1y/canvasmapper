import type { Camera } from './Camera';
import type { Viewport } from './Viewport';

/**
 * Draw pipeline. Stage 1: a world-space grid so pan/zoom are visible.
 * Stage 2+ adds the tiles pass, then the layers pass.
 */
export class Renderer {
    constructor(
        private readonly viewport: Viewport,
        private readonly camera: Camera
    ) {}

    render(): void {
        const { ctx } = this.viewport;
        const size = this.viewport.size;
        this.viewport.clear();

        ctx.fillStyle = '#0f1420';
        ctx.fillRect(0, 0, size.width, size.height);
        this.drawGrid();
    }

    /** Infinite grid in world coordinates: proves the camera math works */
    private drawGrid(): void {
        const { ctx } = this.viewport;
        const size = this.viewport.size;
        const step = 100;

        const topLeft = this.camera.screenToWorld({ x: 0, y: 0 }, size);
        const bottomRight = this.camera.screenToWorld({ x: size.width, y: size.height }, size);

        ctx.strokeStyle = 'rgba(127, 209, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = Math.floor(topLeft.x / step) * step; x <= bottomRight.x; x += step) {
            const s = this.camera.worldToScreen({ x, y: 0 }, size);
            ctx.moveTo(s.x, 0);
            ctx.lineTo(s.x, size.height);
        }
        for (let y = Math.floor(topLeft.y / step) * step; y <= bottomRight.y; y += step) {
            const s = this.camera.worldToScreen({ x: 0, y }, size);
            ctx.moveTo(0, s.y);
            ctx.lineTo(size.width, s.y);
        }
        ctx.stroke();

        // World origin marker
        const origin = this.camera.worldToScreen({ x: 0, y: 0 }, size);
        ctx.fillStyle = '#7fd1ff';
        ctx.fillRect(origin.x - 2, origin.y - 2, 4, 4);
    }
}
