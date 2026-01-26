/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      // Only proxy .json requests to Express; let client routes through
      '^/decks/.*\\.json$': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '~bootstrap': 'bootstrap',
      '~bootswatch': 'bootswatch',
      '~font-awesome': 'font-awesome',
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  }
});
