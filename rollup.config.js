import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
    // Сборка основного кода (ESM + UMD)
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/canvasmapper.es.js',
                format: 'es',
                sourcemap: true,
            },
            {
                file: 'dist/canvasmapper.umd.js',
                format: 'umd',
                name: 'CanvasMapper',
                sourcemap: true,
            },
        ],
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                declaration: true,
                declarationDir: './dist',
            }),
        ],
    },
    // Сборка только типов (.d.ts)
    {
        input: 'dist/index.d.ts',
        output: [{ file: 'dist/canvasmapper.d.ts', format: 'es' }],
        plugins: [dts()],
    },
];
