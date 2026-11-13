# Product Requirements Document (PRD)
## Sistem Informasi & Portal Web Yayasan Nahjul Huda

---

### 1. Ringkasan Eksekutif (Executive Summary)
Website Yayasan Nahjul Huda adalah portal profil lembaga pendidikan Islam terpadu yang menaungi 5 jenjang pendidikan:
1. **SDI Al Kindy**
2. **Madrasah Ibtidaiyah (MI) Nahjul Huda**
3. **Madrasah Tsanawiyah (MTs) Nahjul Huda**
4. **Madrasah Aliyah (MA) Nahjul Huda**
5. **Pondok Pesantren Assurur**

Portal ini dilengkapi dengan **Panel Admin CMS Terpadu** (`/kelola`) yang terintegrasi secara langsung (100% Native REST) ke database cloud **Supabase**, bebas dari ketergantungan cache usang `localStorage`, dan dirancang responsif untuk perangkat mobile, tablet, serta desktop.

---

### 2. Arsitektur Sistem & Tech Stack
- **Frontend Core**: HTML5 Semantik, TailwindCSS v3+, Vanilla JavaScript (ES Modules).
- **Bundler & Tooling**: Vite 5.
- **Backend / Database**: Supabase (PostgreSQL, PostgREST API, Supabase Storage).
- **Hosting**: Vercel Serverless Platform.
- **Prinsip Desain & Kualitas UI**: Mengikuti panduan `antislop` (Clean, purposeful design, no AI filler slop), `antislop-layoutmobile` (Three-state reflow, tap targets >= 44px, zero horizontal overflow), dan `antislop-human` (WCAG AA Contrast >= 4.5:1, keyboard focusable, readable typography).

---

### 3. Spesifikasi Skema Database (Supabase)

#### A. Tabel `galleries` (Galeri Dokumentasi)
Tabel tunggal untuk seluruh dokumentasi kegiatan, ekstrakurikuler, dan konfigurasi banner galeri.
| Kolom | Tipe Data | Deskripsi / Nilai |
| :--- | :--- | :--- |
| `id` | `BIGINT PRIMARY KEY` | Auto-increment. **Catatan khusus**: Row `id: 0` dicadangkan permanen untuk banner galeri. |
| `title` | `TEXT NOT NULL` | Judul kegiatan / ekstrakurikuler / judul banner. |
| `category` | `TEXT NOT NULL` | Kategori: `'Ekstrakurikuler'`, `'Kegiatan'`, atau `'banner'`. |
| `jenjang` | `TEXT NOT NULL` | Jenjang target: `'Semua'`, `'SDI'`, `'MI'`, `'MTs'`, `'MA'`, atau `'Ponpes'`. |
| `event_date` | `DATE / TEXT` | Tanggal pelaksanaan dokumentasi (format `YYYY-MM-DD`). |
| `description` | `TEXT` | Deskripsi singkat atau format wrapper perataan teks (`<div class="text-justify">...</div>`). |
| `image_url` | `TEXT` | URL media foto (WebP/JPG) atau video MP4 di Supabase Storage. |
| `created_at` | `TIMESTAMPTZ` | Timestamp pembuatan otomatis. |

#### B. Tabel `news_posts` (Berita & Pengumuman)
| Kolom | Tipe Data | Deskripsi / Nilai |
| :--- | :--- | :--- |
| `id` | `BIGINT PRIMARY KEY` | Auto-increment. Row `id: 0` dicadangkan permanen untuk banner berita. |
| `title` | `TEXT NOT NULL` | Judul berita / judul banner berita. |
| `jenjang` | `TEXT NOT NULL` | Jenjang warta: `'Semua'`, `'SDI'`, `'MI'`, `'MTs'`, `'MA'`, `'Ponpes'`. |
| `date` | `DATE / TEXT` | Tanggal berita (format `YYYY-MM-DD`). |
| `summary` | `TEXT` | Ringkasan singkat untuk tampilan kartu berita. |
| `content` | `TEXT` | Isi berita lengkap untuk modal baca selengkapnya. |
| `images` | `JSONB` | Array URL foto (maksimal 3 foto). |
| `image_url` | `TEXT` | URL foto utama (fallback). |

#### C. Tabel `contact_settings` (Kontak & Pengaturan Yayasan)
Menyimpan konfigurasi profil identitas yayasan yang disinkronkan ke seluruh footer halaman publik (`id: 1`):
- `foundation_name`, `phone`, `whatsapp1`, `email`, `address`, `google_maps_embed`.

---

### 4. Spesifikasi Fitur: Kelola Galeri (Admin CMS)

#### 4.1. Penyederhanaan Form Input (Unified Single Form)
Untuk mencegah bug duplikasi / *crosstalk* antara Ekstrakurikuler dan Kegiatan:
1. **Satu Tombol Aksi Utama**: `+ Tambah Galeri Baru`.
2. **Satu Form Tambah / Edit Terpadu** yang memuat:
   - **Judul Dokumentasi** (`input[type="text"]`): Wajib diisi.
   - **Tanggal Pelaksanaan** (`input[type="date"]`): Default hari ini.
   - **Dropdown Kategori Galeri** (`select`):
     - `Ekstrakurikuler`
     - `Kegiatan`
   - **Dropdown Kategori Jenjang** (`select`):
     - `Semua` (Semua Jenjang)
     - `SDI` (SDI Al Kindy)
     - `MI` (Madrasah Ibtidaiyah Nahjul Huda)
     - `MTs` (MTs Nahjul Huda)
     - `MA` (Madrasah Aliyah Nahjul Huda)
     - `Ponpes` (Pondok Pesantren Assurur)
   - **Deskripsi Singkat** (`textarea`): Dilengkapi toolbar perataan teks (Kiri, Tengah, Kanan, Justify).
   - **Upload Media Foto/Video**: Mendukung file gambar (JPG/PNG/WebP terkompresi otomatis) atau file video (MP4).
   - **Tombol Aksi Form**: `Batal` dan `Simpan Galeri`.

#### 4.2. Tabel Manajemen Terpadu (Unified Admin Table)
- Tabel menyajikan daftar seluruh galeri dengan kolom:
  1. **Judul & Media**: Judul galeri serta badge tipe media (`Foto` atau `Video MP4`).
  2. **Kategori**: Badge penanda kategori (`Ekstrakurikuler` / `Kegiatan`).
  3. **Jenjang**: Badge penanda jenjang (`Semua`, `SDI`, `MI`, `MTs`, `MA`, `Ponpes`).
  4. **Tanggal**: Format tanggal bahasa Indonesia.
  5. **Aksi**: Tombol Edit & Tombol Hapus (independen, aman, konfirmasi modal).
- Dilengkapi **Filter Kategori Cepat** (`Semua`, `Ekstrakurikuler`, `Kegiatan`) serta kotak pencarian judul langsung di admin.

#### 4.3. Konfigurasi Banner Galeri & Simpan Total
- Banner header memiliki input Judul dan Deskripsi banner.
- Terdapat tombol `Simpan Perubahan Galeri` di bagian bawah untuk menyimpan perubahan banner secara terpadu.

---

### 5. Spesifikasi Halaman Publik: Galeri (`galeri.html`) & Berita (`berita.html`)

#### 5.1. Arsitektur Siklus Hidup Bebas Glitch (Zero-FOUC & Anti-Glitch Architecture)
Untuk mengeliminasi glitch tampilan konten lama/dummy yang berkedip beberapa detik saat refresh halaman:
1. **Dilarang Render Data Dummy Saat Inisialisasi**: Halaman publik TIDAK BOLEH merender array dummy/hardcoded secara sinkron sebelum data Supabase diterima.
2. **Indikator Loading Elegan (Loading State)**: Selama request jaringan ke Supabase berlangsung (1-2 detik pertama), container wajib menampilkan indikator loading/spinner yang bersih.
3. **Bypass Cache Agresif (Cache-Busting)**: Setiap query REST ke Supabase wajib menyertakan parameter `_t=Date.now()` serta header `Cache-Control: no-cache, no-store, must-revalidate` untuk mencegah caching perantara.
4. **Penanganan Kondisi Kosong (Empty State Baku)**: Jika tabel database kosong atau seluruh data telah dihapus, sistem menampilkan card *Empty State* yang ramah pengguna, bukan kembali (*fallback*) ke data dummy usang.
5. **Penghapusan Permanen di Panel Admin (Direct Native REST DELETE)**: Aksi hapus di panel admin wajib mengeksekusi endpoint REST DELETE secara langsung dengan header `Prefer: return=representation` untuk menjamin data musnah permanen dari server Supabase tanpa terhalang session auth kadaluarsa.

#### 5.2. Sinkronisasi Tab Jenjang:
1. **Tab Jenjang**:
   - Tab: `Semua`, `SDI`, `MI`, `MTs`, `MA`, `Ponpes`.
   - **Tab Semua**: Menampilkan seluruh dokumentasi dari semua jenjang dan semua kategori, dengan badge kategori (`Ekstrakurikuler` / `Kegiatan`) dan jenjang.
   - **Tab Jenjang Spesifik (SDI, MI, MTs, MA, Ponpes)**:
     - Dibagi menjadi 2 sub-bagian yang rapi:
       - Sub-bagian 1: **Ekstrakurikuler** (menampilkan dokumentasi kategori Ekstrakurikuler untuk jenjang tersebut atau jenjang "Semua").
       - Sub-bagian 2: **Kegiatan** (menampilkan dokumentasi kategori Kegiatan untuk jenjang tersebut atau jenjang "Semua").
2. **Kondisi Kosong (Empty State)**:
   - Jika belum ada data sama sekali pada tab yang dipilih, sistem menampilkan card *Empty State* yang ramah pengguna dengan pesan informatif, tanpa ada elemen dummy yang bocor.
3. **Pencarian Realtime**:
   - Tab "Semua" memiliki search bar utama.
   - Sub-kategori pada tab spesifik memiliki search bar tersendiri yang memfilter kartu secara dinamis.
4. **Media Viewer & Lightbox**:
   - Foto dapat diklik untuk memperbesar (*zoom lightbox* menggunakan GLightbox).
   - Video MP4 dapat diputar langsung dengan kontrol pemutar responsif.

---

### 6. Standar Responsivitas & Aksesibilitas (Mobile & Tablet)

Mengacu pada aturan ketat `antislop-layoutmobile` dan `antislop-human`:

#### 6.1. Tiga Tingkat Reflow Responsif (Three-State Reflow)
- **Mobile (< 640px)**:
  - Tata letak reflow menjadi 1 kolom penuh (`grid-cols-1`).
  - Padding section dikurangi proporsional (`py-8 sm:py-12`).
  - Tombol aksi dan form input berukuran penuh (`w-full`) dengan tinggi tap target minimal 44x44px.
  - Font size pada input minimal 16px untuk mencegah *auto-zoom* browser iOS.
  - Tabel admin dibungkus dalam container horizontal-scroll yang mulus tanpa merusak lebar layar (`overflow-x-auto`).
- **Tablet (640px - 1024px)**:
  - Tata letak kartu menggunakan 2 kolom (`sm:grid-cols-2`).
  - Gutter proporsional (`gap-4` hingga `gap-6`).
  - Form input menggunakan grid 2 kolom yang nyaman.
- **Desktop (> 1024px)**:
  - Tata letak kartu menggunakan 4 kolom (`lg:grid-cols-4`).
  - Modal dan dropdown memanfaatkan layar lebar dengan rasio optimal.

#### 6.2. Aksesibilitas Manusia & Kontras Warna
- **Rasio Kontras**: Semua teks memenuhi WCAG AA minimal 4.5:1 untuk teks normal dan 3.0:1 untuk teks tebal/badge.
- **Indikator Fokus Keyboard**: Semua elemen interaktif (tombol, link, input) memiliki `:focus-visible` dengan ring kontras tinggi.
- **Touch Targets**: Tombol aksi icon memiliki padding dan area sentuh minimal 44x44 piksel dengan `aria-label` yang jelas untuk pembaca layar (*screen reader*).
- **Anti-Overflow**: Mencegah kebocoran scroll horizontal pada seluruh halaman dengan memastikan elemen tidak memiliki lebar statis yang melebihi viewport.

---

### 7. Matriks Verifikasi & Validasi
1. Menguji tambah data galeri baru dengan kategori `Ekstrakurikuler` -> Hanya masuk ke kategori Ekstrakurikuler.
2. Menguji tambah data galeri baru dengan kategori `Kegiatan` -> Hanya masuk ke kategori Kegiatan.
3. Menguji edit data galeri -> Form terisi sesuai data terpilih, saat disimpan hanya mengubah data tersebut.
4. Menguji hapus data galeri -> Hanya menghapus data dengan ID yang bersangkutan.
5. Memverifikasi halaman publik `galeri.html` di layar HP (375px - 414px), Tablet (768px - 820px), dan Desktop (1280px+).
6. Memverifikasi build produksi `npm run build` berhasil 100% tanpa peringatan kritis.

---

### 8. Spesifikasi Fitur: Pop-up Brosur PPDB Beranda (5 Slide Jenjang Pendidikan)

#### 8.1. Latar Belakang & Tujuan
Menyediakan media promosi dan iklan pendaftaran peserta didik baru (PPDB / SPMB / PSB) yang tampil secara otomatis saat pengunjung pertama kali membuka beranda website Yayasan Nahjul Huda (`index.html` / `/`). Fitur ini dirancang khusus untuk memfasilitasi panitia sekolah dalam mengunggah brosur / flyer resmi pendaftaran untuk ke-5 jenjang pendidikan.

#### 8.2. Arsitektur Komponen Pop-up Beranda (`index.html`)
1. **5 Slide Jenjang Pendidikan**:
   - Slide 1: **SD Islam (SDI) AL KINDY**
   - Slide 2: **Madrasah Ibtidaiyah (MI) Nahjul Huda**
   - Slide 3: **Madrasah Tsanawiyah (MTs) Nahjul Huda**
   - Slide 4: **Madrasah Aliyah (MA) Nahjul Huda**
   - Slide 5: **Pondok Pesantren Assurur**
2. **Atribut Tampilan Tiap Slide**:
   - **Badge Jenjang**: Badge berwarna emas/hijau (contoh: `SDI AL KINDY`).
   - **Counter Indikator**: Nomor slide aktif (contoh: `1 / 5`).
   - **Judul Slide**: Judul promosi penerimaan (contoh: `Penerimaan Peserta Didik Baru (PPDB)`).
   - **Subtitle / Keterangan**: Deskripsi keunggulan jenjang pendidikan.
   - **Tampilan Foto Brosur**: Wadah poster responsif dengan rasio proporsional, border lembut, dan animasi transisi halus.
   - **Tombol Aksi Utama (CTA)**: Tombol "Buka Brosur / Info Lengkap" yang langsung mengarahkan ke tab jenjang terkait di `/ppdb#<jenjang>`.
3. **Mekanisme Kontrol & Interaksi**:
   - **Auto-Slide**: Rotasi otomatis sesuai durasi (3s, 4s, 5s, 7s) yang dijeda secara cerdas saat disentuh (*touch*) atau didekati kursor (*hover*).
   - **Navigasi Panah & Tab Cepat**: Tombol panah kiri/kanan dan pill selector cepat jenjang pendidikan (SDI, MI, MTs, MA, Ponpes).
   - **Indikator Titik (Dots Pagination)**: 5 titik interaktif di bagian bawah modal.
   - **Dukungan Touch Swipe Mobile**: Pengguna mobile dapat menggeser layar ke kiri atau kanan untuk berpindah slide brosur.
   - **Mekanisme Tutup & Anti-Spam**:
     - Tombol silang (X) di pojok kanan atas.
     - Klik area luar modal (backdrop).
     - Tombol ESC pada keyboard.
     - Menggunakan `sessionStorage` (`nahjul_ppdb_popup_seen`) agar pengunjung tidak terganggu oleh kemunculan pop-up berulang kali di setiap refresh dalam satu sesi.
   - **Tombol Mengambang (Floating Launcher)**: Tombol pill elegan (`📢 Brosur PPDB 5 Jenjang`) di pojok kiri bawah beranda agar pengunjung dapat membuka kembali pop-up brosur kapan saja.

#### 8.3. Pengelolaan di Panel Admin CMS (`kelola.html` & `kelola-beranda.js`)
1. **Lokasi Menu**: Berada di menu **Kelola Beranda** (`#beranda`), Bagian 6: **Pop-up Brosur PPDB Beranda (Slide Otomatis / Iklan)**.
2. **Pengaturan Global**:
   - Toggle Status Pop-up (Aktif / Nonaktif).
   - Toggle Auto-Slide (Aktif / Nonaktif).
   - Pilihan Durasi Rotasi Slide (3s, 4s, 5s, 7s).
   - Tombol **Pratinjau Pop-up Langsung** untuk menguji slider di dalam admin sebelum menyimpan.
3. **Pengelolaan 5 Slide Jenjang**:
   - Tab navigasi untuk masing-masing jenjang.
   - Upload file brosur dengan kompresi otomatis di sisi klien (`image-compressor.js`) ke Supabase Storage atau fallback compressed DataURL yang ringan (<80KB).
   - Kustomisasi badge, judul, subtitle, dan tautan tombol.
4. **Penyimpanan Permanen**:
   - Disimpan secara aman di dalam kolom JSONB `ppdb_info.contact_person.popup_banner` tanpa merusak konfigurasi kontak atau data jenjang lainnya.
