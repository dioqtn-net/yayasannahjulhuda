import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        kelola: resolve(__dirname, 'kelola.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        kelolaKontak: resolve(__dirname, 'kelola-kontak.html'),
        kelolaInfoPpdb: resolve(__dirname, 'kelola-info-ppdb.html'),
        kelolaBeranda: resolve(__dirname, 'kelola-beranda.html'),
        kelolaPengaturan: resolve(__dirname, 'kelola-pengaturan.html'),
        galeri: resolve(__dirname, 'galeri.html'),
        berita: resolve(__dirname, 'berita.html'),
        ppdb: resolve(__dirname, 'ppdb.html'),
        program: resolve(__dirname, 'program.html'),
        profil: resolve(__dirname, 'profil.html'),
        fasilitas: resolve(__dirname, 'fasilitas.html'),
        kontak: resolve(__dirname, 'kontak.html'),
      },
    },
  },
});
