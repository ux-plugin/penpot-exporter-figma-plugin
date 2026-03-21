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
      '@plugin/*': resolve(__dirname, 'plugin-src/*')
    }
  },
  build: {
    lib: {
      entry: {
        transformers: resolve(__dirname, 'plugin-src/transformers/index.ts'),
        figmaAdapter: resolve(__dirname, 'figma-adapter/index.ts')
      },
      name: 'PenpotExporterPlugin',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (entryName === 'transformers') {
          return format === 'es' ? 'plugin.js' : 'plugin.cjs.js';
        }
        if (entryName === 'figmaAdapter') {
          return format === 'es' ? 'figma-adapter.es.js' : 'figma-adapter.cjs.js';
        }
        throw new Error(`Unknown entry: ${String(entryName)}`);
      }
    },
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      external: id => {
        if (id === 'penpot-exporter/types' || id.startsWith('penpot-exporter/types/')) {
          return true;
        }
        if (id === 'penpot-exporter/transformers') {
          return true;
        }
        return false;
      }
    }
  }
});
