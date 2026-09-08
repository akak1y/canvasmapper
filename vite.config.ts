import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const pages = readdirSync(fileURLToPath(new URL('./examples', import.meta.url)))
    .filter((file) => file.endsWith('.html'))
    .map((file) => [file.slice(0, -5), fileURLToPath(new URL(`./examples/${file}`, import.meta.url))]);

export default defineConfig({
    root: 'examples',
    server: { port: 3000 },
    build: {
        target: 'es2022',
        rollupOptions: { input: Object.fromEntries(pages) },
    },
});
