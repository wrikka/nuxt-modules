import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '#stripe': resolve(__dirname, './src/runtime'),
      '#stripe/types': resolve(__dirname, './src/runtime/types'),
      '#app': resolve(__dirname, './node_modules/nuxt/dist/app'),
    },
  },
});
