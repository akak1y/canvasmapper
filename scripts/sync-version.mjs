import { readFileSync, writeFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const file = 'src/index.ts';
const source = readFileSync(file, 'utf8');
const updated = source.replace(
    /export const VERSION = '[^']*';/,
    `export const VERSION = '${version}';`,
);
writeFileSync(file, updated);
console.log('src/index.ts VERSION ->', version);