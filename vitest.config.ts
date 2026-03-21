import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@plugin': resolve(__dirname, 'plugin-src'),
      '@plugin/*': resolve(__dirname, 'plugin-src/*'),
      '@ui': resolve(__dirname, 'ui-src'),
      '@ui/*': resolve(__dirname, 'ui-src/*'),
      '@common': resolve(__dirname, 'common'),
      '@common/*': resolve(__dirname, 'common/*'),
      'penpot-exporter/types': resolve(__dirname, 'lib/index.ts')
    }
  },
  test: {
    environment: 'node',
    include: ['figma-adapter/**/*.test.ts', 'tests/**/*.test.ts']
  }
});
