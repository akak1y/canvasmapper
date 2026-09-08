import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const bytes = gzipSync(readFileSync('dist/canvasmapper.es.js')).length;
console.log((bytes / 1024).toFixed(1) + ' kB gzip');