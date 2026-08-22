/**
 * CanvasMapper - High-performance Canvas map engine
 * @packageDocumentation
 */

// Core exports
export { MapEngine } from './core/MapEngine';
export type { MapEngineOptions } from './core/MapEngine';

export { Camera } from './core/Camera';
export type { ViewState } from './core/Camera';

export { EventEmitter } from './core/EventEmitter';

// Tiles
export { TileManager } from './tiles/TileManager';

// Layers
export { LayerManager } from './layers/LayerManager';
export { MarkerLayer } from './layers/MarkerLayer';
export type { MarkerOptions, Marker } from './layers/MarkerLayer';

// Input
export { InputController } from './input/InputController';

// Version
export const VERSION = '0.1.0';
