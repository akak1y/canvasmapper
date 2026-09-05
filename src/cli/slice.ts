import { mkdir, writeFile } from 'node:fs/promises';
import { cpus } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

export interface SliceOptions {
    input: string;
    output: string;
    tileSize?: number;
    minZoom?: number;
    maxZoom?: number;
    quality?: number;
    format?: 'png' | 'jpeg' | 'webp';
    /** parallel tile encoders (default: CPU count) */
    concurrency?: number;
}

export interface SliceManifest {
    width: number;
    height: number;
    tileSize: number;
    minZoom: number;
    maxZoom: number;
    format: string;
    tileCount: number;
    generatedAt: string;
    durationMs: number;
}

interface LevelPlan {
    z: number;
    cols: number;
    rows: number;
    scaledWidth: number;
    scaledHeight: number;
    tiles: number;
    pixels: number;
}

function formatDuration(ms: number): string {
    const totalSeconds = ms / 1000;
    if (totalSeconds < 60) return `${totalSeconds.toFixed(1)}s`;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds - minutes * 60);
    return `${minutes}m ${seconds}s`;
}

/**
 * Slice a large image into a zoom pyramid: z/x_y.png
 *
 * Performance model:
 * - each zoom level is resized ONCE into a raw pixel buffer;
 * - tiles are cheap extracts from that buffer, encoded in parallel;
 * - per-level timing and a pixel-based ETA are reported as we go.
 */
export async function slice(options: SliceOptions): Promise<SliceManifest> {
    const startedAt = Date.now();
    const { input, output } = options;
    const tileSize = options.tileSize ?? 256;
    const quality = options.quality ?? 85;
    const format = options.format ?? 'png';
    const concurrency = options.concurrency ?? Math.max(4, cpus().length);

    console.log(`📷 Loading ${input}...`);
    const image = sharp(input);
    const metadata = await image.metadata();
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;
    if (!width || !height) throw new Error('Could not read image dimensions');

    const maxZoom = options.maxZoom ?? Math.ceil(Math.log2(Math.max(width, height) / tileSize));
    const minZoom = options.minZoom ?? 0;

    // Build the full plan first so the scope is visible before any work starts
    const plan: LevelPlan[] = [];
    for (let z = maxZoom; z >= minZoom; z--) {
        const scale = Math.pow(2, z - maxZoom);
        const scaledWidth = Math.ceil(width * scale);
        const scaledHeight = Math.ceil(height * scale);
        const cols = Math.ceil(scaledWidth / tileSize);
        const rows = Math.ceil(scaledHeight / tileSize);
        plan.push({
            z,
            cols,
            rows,
            scaledWidth,
            scaledHeight,
            tiles: cols * rows,
            pixels: scaledWidth * scaledHeight,
        });
    }
    const totalTiles = plan.reduce((sum, level) => sum + level.tiles, 0);
    const totalPixels = plan.reduce((sum, level) => sum + level.pixels, 0);

    console.log(`📐 Image size: ${width}×${height}`);
    console.log(`🔍 Zoom levels: ${minZoom} to ${maxZoom}`);
    console.log(`🧮 Plan: ${totalTiles} tiles, ${(totalPixels / 1e6).toFixed(0)} MP total, concurrency ${concurrency}`);
    console.log('⏳ ETA will be calibrated after the first (largest) level.');

    let totalDone = 0;
    let processedPixels = 0;

    for (const level of plan) {
        const levelStart = Date.now();
        await mkdir(join(output, String(level.z)), { recursive: true });

        // 1) Resize the source ONCE for this level into raw pixels
        const { data, info } = await image
            .clone()
            .resize(level.scaledWidth, level.scaledHeight, { kernel: sharp.kernel.lanczos3 })
            .raw()
            .toBuffer({ resolveWithObject: true });

        // 2) Extract + encode tiles from the raw buffer, in parallel chunks
        interface Job {
            x: number;
            y: number;
            left: number;
            top: number;
            w: number;
            h: number;
        }
        const jobs: Job[] = [];
        for (let y = 0; y < level.rows; y++) {
            for (let x = 0; x < level.cols; x++) {
                jobs.push({
                    x,
                    y,
                    left: x * tileSize,
                    top: y * tileSize,
                    w: Math.min(tileSize, level.scaledWidth - x * tileSize),
                    h: Math.min(tileSize, level.scaledHeight - y * tileSize),
                });
            }
        }

        for (let i = 0; i < jobs.length; i += concurrency) {
            const chunk = jobs.slice(i, i + concurrency);
            await Promise.all(
                chunk.map((job) =>
                    sharp(data, {
                        raw: { width: info.width, height: info.height, channels: info.channels },
                    })
                        .extract({ left: job.left, top: job.top, width: job.w, height: job.h })
                        .toFormat(format, { quality })
                        .toFile(join(output, String(level.z), `${job.x}_${job.y}.${format}`))
                )
            );
        }

        totalDone += level.tiles;
        processedPixels += level.pixels;
        const levelMs = Date.now() - levelStart;
        const elapsedMs = Date.now() - startedAt;
        // Pixel-based speed model: remaining time scales with remaining pixels
        const remainingMs = (elapsedMs / processedPixels) * (totalPixels - processedPixels);
        console.log(
            `📦 Zoom ${level.z}: ${level.cols}×${level.rows} tiles in ${formatDuration(levelMs)}` +
                ` | done ${totalDone}/${totalTiles} | remaining ≈ ${formatDuration(remainingMs)}`
        );
    }

    const durationMs = Date.now() - startedAt;
    console.log(`✅ Generated ${totalTiles} tiles in ${formatDuration(durationMs)}`);

    const manifest: SliceManifest = {
        width,
        height,
        tileSize,
        minZoom,
        maxZoom,
        format,
        tileCount: totalTiles,
        generatedAt: new Date().toISOString(),
        durationMs,
    };
    const manifestPath = join(output, 'manifest.json');
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`📄 Manifest written to ${manifestPath}`);

    return manifest;
}
