import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        kelola: resolve(__dirname, 'kelola.html'),
        galeri: resolve(__dirname, 'galeri.html'),
      },
    },
  },
});
