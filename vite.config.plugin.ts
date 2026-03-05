import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      '@ui': resolve(__dirname, 'ui-src'),
      '@ui/*': resolve(__dirname, 'ui-src/*'),
      '@common': resolve(__dirname, 'common'),
      '@common/*': resolve(__dirname, 'common/*'),
      '@plugin': resolve(__dirname, 'plugin-src'),
      '@plugin/*': resolve(__dirname, 'plugin-src/*'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'plugin-src/transformers/index.ts'),
      name: 'PenpotExporterPlugin',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'plugin.js' : 'plugin.cjs.js'),
    },
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: false,
    sourcemap: true,
  },
});
