import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        maikada: resolve(import.meta.dirname, 'maikada.html'),
        community: resolve(import.meta.dirname, 'community.html')
      }
    }
  }
});
