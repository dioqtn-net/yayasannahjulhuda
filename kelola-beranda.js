/**
 * =======================================================================
 * KELOLA BERANDA (PANEL ADMIN) - 100% PURE SUPABASE
 * Aturan Mutlak: NO localStorage.getItem / NO localStorage.setItem / NO localCache
 * Dilengkapi: Diagnostic Logs, Null-Safety Chaining, Auto-Reset Finally, & 15s Timeout
 * =======================================================================
 */

(function () {
  console.log("[Kelola Beranda] Skrip kelola-beranda.js mulai dimuat...");

  const SUPABASE_URL = "https://lrorriksjooxrpoihfge.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

  // Flag guard agar tidak terjadi double-submit atau race condition
  let isSaving = false;

  // Template HTML default tombol agar tidak pernah macet di teks 'Menyimpan...'
  const BTN_BERANDA_HTML = `<svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg> Simpan Perubahan Beranda`;
  const BTN_TAGLINE_HTML = `<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg> Simpan Tagline`;

  // Bersihkan sisa-sisa cache lama dari memori browser
  try {
    localStorage.removeItem('cmsData_beranda');
  } catch (e) {}

  // 1. Inisialisasi & Validasi Ketat Klien Supabase
  function getSupabaseClient() {
    console.log("[Kelola Beranda] Tahap 1: Memeriksa ketersediaan Supabase Client...");

    if (window.supabaseClient) {
      console.log("[Kelola Beranda] -> Menggunakan window.supabaseClient yang sudah ada.");
      return window.supabaseClient;
    }

    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
      try {
        console.log("[Kelola Beranda] -> Menginisialisasi client baru via window.supabase.createClient...");
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: { persistSession: true }
        });
        return window.supabaseClient;
      } catch (err) {
        console.error("[Kelola Beranda] Gagal createClient Supabase:", err);
      }
    }

    console.error("[Kelola Beranda] KRITIS: Library Supabase (@supabase/supabase-js) belum termuat di window.supabase!");
    return null;
  }

  // Helper untuk reset tampilan tombol kembali normal
  function resetButtonState() {
    const btnBeranda = document.getElementById('btnSimpanBeranda');
    if (btnBeranda) {
      btnBeranda.disabled = false;
      btnBeranda.innerHTML = BTN_BERANDA_HTML;
    }
    const btnTagline = document.getElementById('btnSimpanTagline');
    if (btnTagline) {
      btnTagline.disabled = false;
      btnTagline.innerHTML = BTN_TAGLINE_HTML;
    }
  }

  // 2. Helper aman ambil nilai input form (Optional Chaining & Fallback)
  function getVal(id, fallback = '') {
    const el = document.getElementById(id);
    const val = el?.value;
    return (typeof val === 'string' && val.trim() !== '') ? val.trim() : fallback;
  }

  function getSafeTextareaValue(id, fallback = '') {
    try {
      const el = document.getElementById(id);
      if (!el) return fallback;
      if (typeof window.getWrappedTextareaValue === 'function') {
        const wrapped = window.getWrappedTextareaValue(id);
        if (wrapped && typeof wrapped === 'string' && wrapped.trim() !== '') return wrapped;
      }
      const raw = el?.value;
      if (!raw || typeof raw !== 'string' || raw.trim() === '') return fallback;
      const align = el?.dataset?.align || 'text-justify';
      return `<div class="${align}">${raw.trim()}</div>`;
    } catch (err) {
      console.warn("[Kelola Beranda] Fallback getSafeTextareaValue:", id, err);
      const el = document.getElementById(id);
      return el?.value?.trim() || fallback;
    }
  }

  function setSafeTextareaValue(id, val) {
    try {
      const el = document.getElementById(id);
      if (!el || val === undefined || val === null) return;
      if (typeof window.setTextareaValueWithAlignment === 'function') {
        window.setTextareaValueWithAlignment(id, val);
        return;
      }
      if (typeof val === 'string' && (val.includes('<div') || val.includes('<p'))) {
        const temp = document.createElement('div');
        temp.innerHTML = val;
        el.value = temp.textContent || temp.innerText || val;
      } else {
        el.value = val;
      }
    } catch (err) {
      console.warn("[Kelola Beranda] Fallback setSafeTextareaValue:", id, err);
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    }
  }

  // Helper Promise dengan batas waktu (Timeout 15 detik) agar fetch tidak pernah hang selamanya
  function withTimeout(promise, timeoutMs = 15000, errorMsg = "Koneksi ke Supabase timeout (melebihi 15 detik).") {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(errorMsg)), timeoutMs))
    ]);
  }

  // 3. LOAD DATA DARI SUPABASE
  window.loadBerandaData = async function () {
    console.log("[Kelola Beranda] Memulai loadBerandaData()...");
    try {
      const supa = getSupabaseClient();
      if (!supa) {
        console.warn("[Kelola Beranda] Supabase Client belum tersedia saat loadBerandaData dijalankan.");
        return;
      }

      console.log("[Kelola Beranda] Mengambil data home_settings dari Supabase...");
      const { data: home, error: errHome } = await withTimeout(
        supa.from('home_settings').select('*').eq('id', 1).maybeSingle(),
        10000,
        "Timeout saat memuat data home_settings."
      );

      if (errHome) {
        console.error("[Kelola Beranda] Error saat SELECT home_settings:", errHome);
      } else if (home) {
        console.log("[Kelola Beranda] Data home_settings berhasil diterima:", home);
        const heroTitleEl = document.getElementById('heroTitle');
        if (heroTitleEl && home.hero_title) heroTitleEl.value = home.hero_title;
        if (home.hero_desc) setSafeTextareaValue('heroDesc', home.hero_desc);

        const taglineTitleEl = document.getElementById('taglineTitle');
        if (taglineTitleEl && home.tagline_title) taglineTitleEl.value = home.tagline_title;
        if (home.tagline_desc) setSafeTextareaValue('taglineDesc', home.tagline_desc);

        const s1n = document.getElementById('stat1Num');
        if (s1n && home.stat1_num) s1n.value = home.stat1_num;
        const s1t = document.getElementById('stat1Text');
        if (s1t && home.stat1_text) s1t.value = home.stat1_text;

        const s2n = document.getElementById('stat2Num');
        if (s2n && home.stat2_num) s2n.value = home.stat2_num;
        const s2t = document.getElementById('stat2Text');
        if (s2t && home.stat2_text) s2t.value = home.stat2_text;

        const s3n = document.getElementById('stat3Num');
        if (s3n && home.stat3_num) s3n.value = home.stat3_num;
        const s3t = document.getElementById('stat3Text');
        if (s3t && home.stat3_text) s3t.value = home.stat3_text;

        const s4n = document.getElementById('stat4Num');
        if (s4n && home.stat4_num) s4n.value = home.stat4_num;
        const s4t = document.getElementById('stat4Text');
        if (s4t && home.stat4_text) s4t.value = home.stat4_text;

        const ps1t = document.getElementById('progSosial1Title');
        if (ps1t && home.social_prog1_title) ps1t.value = home.social_prog1_title;
        if (home.social_prog1_desc) setSafeTextareaValue('progSosial1Desc', home.social_prog1_desc);

        const ps2t = document.getElementById('progSosial2Title');
        if (ps2t && home.social_prog2_title) ps2t.value = home.social_prog2_title;
        if (home.social_prog2_desc) setSafeTextareaValue('progSosial2Desc', home.social_prog2_desc);
      }

      console.log("[Kelola Beranda] Mengambil data ppdb_info dari Supabase...");
      const { data: ppdb, error: errPpdb } = await withTimeout(
        supa.from('ppdb_info').select('academic_year, status').eq('id', 1).maybeSingle(),
        10000,
        "Timeout saat memuat data ppdb_info."
      );

      if (errPpdb) {
        console.error("[Kelola Beranda] Error saat SELECT ppdb_info:", errPpdb);
      } else if (ppdb) {
        console.log("[Kelola Beranda] Data ppdb_info berhasil diterima:", ppdb);
        const yEl = document.getElementById('ppdbYear');
        if (yEl && ppdb.academic_year) yEl.value = ppdb.academic_year;
        const sEl = document.getElementById('ppdbStatus');
        if (sEl && ppdb.status) sEl.value = ppdb.status;
      }
    } catch (e) {
      console.warn("[Kelola Beranda] Peringatan saat loadBerandaData:", e);
    }
  };

  // 4. SIMPAN DATA KE SUPABASE (UPSERT)
  window.handleSimpanBeranda = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isSaving) {
      console.warn("[Kelola Beranda] Proses simpan sedang berjalan, mengabaikan klik ganda.");
      return;
    }
    isSaving = true;

    console.log("[Kelola Beranda] === MEMULAI PROSES SIMPAN BERANDA ===");

    // Ambil referensi tombol & ubah state loading
    const clickedBtn = (e && e.currentTarget && e.currentTarget.tagName === 'BUTTON') ? e.currentTarget : null;
    const btnBeranda = document.getElementById('btnSimpanBeranda');
    const btnTagline = document.getElementById('btnSimpanTagline');

    if (clickedBtn) {
      clickedBtn.disabled = true;
      clickedBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan ke server...';
    } else {
      if (btnBeranda) {
        btnBeranda.disabled = true;
        btnBeranda.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan ke server...';
      }
      if (btnTagline) {
        btnTagline.disabled = true;
        btnTagline.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan...';
      }
    }

    try {
      // 1. Cek Klien Supabase
      const supa = getSupabaseClient();
      if (!supa) {
        throw new Error("Library Supabase belum siap atau koneksi terputus. Muat ulang halaman dan periksa koneksi internet.");
      }

      // 2. Kumpulkan Nilai Form (Optional Chaining & Fallback)
      console.log("[Kelola Beranda] Mengumpulkan nilai form...");
      const heroTitle = getVal('heroTitle', 'Selamat Datang di Yayasan Nahjul Huda');
      const heroDesc = getSafeTextareaValue('heroDesc');
      const taglineTitle = getVal('taglineTitle', 'Mencetak Generasi Rabbani');
      const taglineDesc = getSafeTextareaValue('taglineDesc');

      const stat1Num = getVal('stat1Num', '5');
      const stat1Text = getVal('stat1Text', 'JENJANG PENDIDIKAN');
      const stat2Num = getVal('stat2Num', '100+');
      const stat2Text = getVal('stat2Text', 'TENAGA PENDIDIK');
      const stat3Num = getVal('stat3Num', '1000+');
      const stat3Text = getVal('stat3Text', 'SANTRI & SISWA');
      const stat4Num = getVal('stat4Num', '1980');
      const stat4Text = getVal('stat4Text', 'TAHUN BERDIRI');

      const ppdbYear = getVal('ppdbYear', '2024/2025');
      const ppdbStatus = getVal('ppdbStatus', 'BUKA');

      const progSosial1Title = getVal('progSosial1Title', "Majelis Ta'lim Nahjul Huda");
      const progSosial1Desc = getSafeTextareaValue('progSosial1Desc');
      const progSosial2Title = getVal('progSosial2Title', "Pengajian Rutin Bulanan");
      const progSosial2Desc = getSafeTextareaValue('progSosial2Desc');

      const homePayload = {
        id: 1,
        hero_title: heroTitle,
        hero_desc: heroDesc,
        tagline_title: taglineTitle,
        tagline_desc: taglineDesc,
        stat1_num: stat1Num,
        stat1_text: stat1Text,
        stat2_num: stat2Num,
        stat2_text: stat2Text,
        stat3_num: stat3Num,
        stat3_text: stat3Text,
        stat4_num: stat4Num,
        stat4_text: stat4Text,
        social_prog1_title: progSosial1Title,
        social_prog1_desc: progSosial1Desc,
        social_prog2_title: progSosial2Title,
        social_prog2_desc: progSosial2Desc,
        updated_at: new Date().toISOString()
      };

      console.log("[Kelola Beranda] Mengirim payload ke Supabase (home_settings):", homePayload);

      // 3. Eksekusi UPSERT ke home_settings dengan Timeout 15 detik
      const { data: homeRes, error: errHome } = await withTimeout(
        supa.from('home_settings').upsert(homePayload, { onConflict: 'id' }).select(),
        15000,
        "Timeout: Server Supabase tidak merespons dalam 15 detik saat menyimpan home_settings."
      );

      if (errHome) {
        console.error("[Kelola Beranda] Supabase error (home_settings):", errHome);
        throw errHome;
      }
      console.log("[Kelola Beranda] Sukses UPSERT home_settings:", homeRes);

      // 4. Eksekusi UPSERT ke ppdb_info dengan Timeout 15 detik
      const ppdbPayload = {
        id: 1,
        academic_year: ppdbYear,
        status: ppdbStatus,
        updated_at: new Date().toISOString()
      };
      console.log("[Kelola Beranda] Mengirim payload ke Supabase (ppdb_info):", ppdbPayload);

      const { data: ppdbRes, error: errPpdb } = await withTimeout(
        supa.from('ppdb_info').upsert(ppdbPayload, { onConflict: 'id' }).select(),
        15000,
        "Timeout: Server Supabase tidak merespons dalam 15 detik saat menyimpan ppdb_info."
      );

      if (errPpdb) {
        console.error("[Kelola Beranda] Supabase error (ppdb_info):", errPpdb);
        throw errPpdb;
      }
      console.log("[Kelola Beranda] Sukses UPSERT ppdb_info:", ppdbRes);

      // Pastikan cache lokal bersih
      try {
        localStorage.removeItem('cmsData_beranda');
      } catch (e) {}

      console.log("[Kelola Beranda] === SEMUA DATA BERHASIL DISIMPAN KE SUPABASE ===");
      alert("Alhamdulillah! Data Beranda BERHASIL DISIMPAN secara online ke database Supabase.\nPerubahan sudah aktif di semua perangkat.");
    } catch (error) {
      console.error("[Kelola Beranda] GAGAL menyimpan ke Supabase:", error);
      let errMsg = error?.message || String(error);
      if (error?.code === '42501' || errMsg.toLowerCase().includes('row-level security') || errMsg.toLowerCase().includes('rls')) {
        errMsg += "\n\n(Akses ditolak oleh RLS di Supabase. Jalankan perintah: ALTER TABLE home_settings DISABLE ROW LEVEL SECURITY; ALTER TABLE ppdb_info DISABLE ROW LEVEL SECURITY;)";
      }
      alert("Gagal menyimpan ke database Supabase:\n" + errMsg);
    } finally {
      console.log("[Kelola Beranda] Mengembalikan state tombol (finally block)...");
      isSaving = false;
      resetButtonState();
    }
  };

  // 5. Inisialisasi Listener
  function initKelolaBeranda() {
    console.log("[Kelola Beranda] Menjalankan initKelolaBeranda()...");
    window.loadBerandaData();

    const btnTagline = document.getElementById('btnSimpanTagline');
    if (btnTagline && !btnTagline.dataset.bound) {
      btnTagline.dataset.bound = 'true';
      btnTagline.addEventListener('click', window.handleSimpanBeranda);
    }

    const btnBeranda = document.getElementById('btnSimpanBeranda');
    if (btnBeranda && !btnBeranda.dataset.bound) {
      btnBeranda.dataset.bound = 'true';
      btnBeranda.addEventListener('click', window.handleSimpanBeranda);
    }

    const formBeranda = document.getElementById('formBeranda');
    if (formBeranda && !formBeranda.dataset.bound) {
      formBeranda.dataset.bound = 'true';
      formBeranda.addEventListener('submit', window.handleSimpanBeranda);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKelolaBeranda);
  } else {
    initKelolaBeranda();
  }
})();
