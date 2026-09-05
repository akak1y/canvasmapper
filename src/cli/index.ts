#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { slice } from './slice.js';

const HELP = `
canvasmapper - CLI for CanvasMapper

Usage:
  canvasmapper slice -i <input> -o <output> [options]

Commands:
  slice    Slice a large image into a zoom pyramid (z/x_y.png)

Options:
  -i, --input <path>      Input image (JPEG, PNG, WebP)
  -s, --tile-size <num>   Tile size in pixels (default: 256)
  -o, --output <dir>      Output directory for tiles
      --min-zoom <num>    Minimum zoom level (default: 0)
      --max-zoom <num>    Maximum zoom level (auto-detected if omitted)
  -q, --quality <num>     JPEG/WebP quality 1-100 (default: 85)
  -f, --format <fmt>      Output format: png, jpeg, webp (default: png)
  -h, --help              Show this help

Example:
  canvasmapper slice -i map.jpg -o ./tiles -s 256 -q 85
`;

const { values, positionals } = parseArgs({
    // 'slice' is a positional argument (subcommand) — allow it explicitly
    allowPositionals: true,
    options: {
        input: { type: 'string', short: 'i' },
        output: { type: 'string', short: 'o' },
        'tile-size': { type: 'string', short: 's' },
        'min-zoom': { type: 'string' },
        'max-zoom': { type: 'string' },
        quality: { type: 'string', short: 'q' },
        format: { type: 'string', short: 'f' },
        help: { type: 'boolean', short: 'h' },
    },
});

if (values.help) {
    console.log(HELP);
    process.exit(0);
}

const command = positionals[0];
if (command !== 'slice' || !values.input || !values.output) {
    console.error(command ? `Unknown or incomplete command: "${command}"` : 'Missing command.');
    console.log(HELP);
    process.exit(1);
}

slice({
    input: values.input,
    output: values.output,
    tileSize: values['tile-size'] ? parseInt(values['tile-size'], 10) : undefined,
    minZoom: values['min-zoom'] ? parseInt(values['min-zoom'], 10) : undefined,
    maxZoom: values['max-zoom'] ? parseInt(values['max-zoom'], 10) : undefined,
    quality: values.quality ? parseInt(values.quality, 10) : undefined,
    format: (values.format as 'png' | 'jpeg' | 'webp') ?? 'png',
})
    .then(() => {
        console.log('🎉 Done!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Error:', err.message);
        process.exit(1);
    });
