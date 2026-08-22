/**
 * Camera state
 */
export interface ViewState {
    x: number;
    y: number;
    zoom: number;
}

/**
 * Camera manages viewport transformation
 */
export class Camera {
    private state: ViewState = { x: 0, y: 0, zoom: 1 };

    getViewState(): ViewState {
        return { ...this.state };
    }

    setViewState(state: Partial<ViewState>): void {
        this.state = { ...this.state, ...state };
    }

    /**
     * Convert world coordinates to screen coordinates
     */
    worldToScreen(worldX: number, worldY: number, canvasWidth: number, canvasHeight: number): { x: number; y: number } {
        const scale = Math.pow(2, this.state.zoom);
        return {
            x: (worldX - this.state.x) * scale + canvasWidth / 2,
            y: (worldY - this.state.y) * scale + canvasHeight / 2,
        };
    }

    /**
     * Convert screen coordinates to world coordinates
     */
    screenToWorld(screenX: number, screenY: number, canvasWidth: number, canvasHeight: number): { x: number; y: number } {
        const scale = Math.pow(2, this.state.zoom);
        return {
            x: (screenX - canvasWidth / 2) / scale + this.state.x,
            y: (screenY - canvasHeight / 2) / scale + this.state.y,
        };
    }
}
