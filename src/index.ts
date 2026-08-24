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

// Layers (stubs until stage 5)
export { LayerManager } from './layers/LayerManager';
export { MarkerLayer } from './layers/MarkerLayer';
export type { Marker, MarkerOptions } from './layers/MarkerLayer';

// Input
export { InputController } from './input/InputController';

// Version
export const VERSION = '0.1.0';
