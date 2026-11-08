import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Halaman Utama & Publik
        main: resolve(__dirname, 'index.html'),
        profil: resolve(__dirname, 'profil.html'),
        program: resolve(__dirname, 'program.html'),
        fasilitas: resolve(__dirname, 'fasilitas.html'),
        berita: resolve(__dirname, 'berita.html'),
        galeri: resolve(__dirname, 'galeri.html'),
        kontak: resolve(__dirname, 'kontak.html'),
        ppdb: resolve(__dirname, 'ppdb.html'),
        infoPpdb: resolve(__dirname, 'info-ppdb.html'),

        // Autentikasi & Dashboard
        login: resolve(__dirname, 'login.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),

        // Panel Admin & Pengelolaan CMS
        kelola: resolve(__dirname, 'kelola.html'),
        kelolaBeranda: resolve(__dirname, 'kelola-beranda.html'),
        kelolaProfil: resolve(__dirname, 'kelola-profil.html'),
        kelolaPengaturan: resolve(__dirname, 'kelola-pengaturan.html'),
        kelolaKontak: resolve(__dirname, 'kelola-kontak.html'),
        kelolaInfoPpdb: resolve(__dirname, 'kelola-info-ppdb.html'),
      },
    },
  },
});
