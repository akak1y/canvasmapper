/**
 * CanvasMapper — high-performance Canvas map engine
 * @packageDocumentation
 */

// Core
export { MapEngine } from './core/MapEngine';
export type { MapEngineOptions } from './core/MapEngine';
export { Camera } from './core/Camera';
export type { CameraOptions, ViewState } from './core/Camera';
export { EventEmitter } from './core/EventEmitter';
export { animate } from './core/Animation';

// Tiles
export { TileManager, computeVisibleRange } from './tiles/TileManager';
export type { TileRange } from './tiles/TileManager';
export { TileCache } from './tiles/TileCache';
export { UrlTileSource } from './tiles/UrlTileSource';
export type { UrlTileSourceOptions } from './tiles/UrlTileSource';
export type { TileCoord, TileImage, TileSource } from './tiles/TileSource';
export { MatrixTileSource } from './tiles/MatrixTileSource';
export type { MatrixTileSourceOptions } from './tiles/MatrixTileSource';
export { SingleImageSource } from './tiles/SingleImageSource';
export type { SingleImageSourceOptions } from './tiles/SingleImageSource';
export { IDBTileCache } from './tiles/idbCache';

// Controls
export { Controls } from './controls/Controls';
export type { ControlButton, ControlsOptions, ControlsPosition } from './controls/Controls';

// Layers & markers
export { LayerManager } from './layers/LayerManager';
export { MarkerLayer, computeVisibleBounds } from './layers/MarkerLayer';
export type { LayerOptions } from './layers/MarkerLayer';
export { Marker } from './layers/Marker';
export type { MarkerOptions } from './layers/Marker';
export { SpriteCache } from './layers/SpriteCache';

// Input
export { InputController } from './input/InputController';

// Version
export const VERSION = '0.1.0';
