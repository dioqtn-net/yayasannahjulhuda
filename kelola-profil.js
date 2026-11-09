/**
 * =======================================================================
 * KELOLA PROFIL (PANEL ADMIN) - 100% PURE SUPABASE
 * Aturan Mutlak: NO localStorage.getItem / NO localStorage.setItem / NO localCache
 * Fitur:
 * 1. Client-Side Image Compression (HTML5 Canvas maks 600px, 85% quality).
 * 2. Supabase Storage Upload (Public CDN URL https://...images/...).
 * 3. Graceful Fallback jika Storage belum aktif (<80KB compressed image).
 * 4. Single Save Button, Auto-Reset Finally, 15s Timeout & Native REST Fallback.
 * =======================================================================
 */

(function () {
  console.log("[Kelola Profil] Skrip kelola-profil.js mulai dimuat...");

  const SUPABASE_URL = "https://lrorriksjooxrpoihfge.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

  let isSaving = false;
  const BTN_PROFIL_HTML = `<svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg> Simpan Perubahan Profil`;

  // Memory cache untuk foto yang sudah tersimpan di database pusat
  let currentPengurusState = {
    fotoKetua: '',
    fotoSDI: '',
    fotoMI: '',
    fotoMTs: '',
    fotoMA: '',
    fotoMudir: ''
  };

  // Bersihkan sisa-sisa cache lama dari memori browser
  try {
    localStorage.removeItem('cmsData_profil');
  } catch (e) {}

  function getSupabaseClient() {
    if (window.supabaseClient) return window.supabaseClient;
    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
      try {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: { persistSession: true }
        });
        return window.supabaseClient;
      } catch (err) {
        console.warn("[Kelola Profil] createClient warning:", err);
      }
    }
    return null;
  }

  function resetButtonState() {
    const btn = document.getElementById('btnSimpanProfil');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = BTN_PROFIL_HTML;
    }
  }

  function getVal(id, fallback = '') {
    const el = document.getElementById(id);
    const val = el?.value;
    return (typeof val === 'string' && val.trim() !== '') ? val.trim() : fallback;
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (!el || val === undefined || val === null) return;
    if (el.tagName.toLowerCase() === 'textarea') {
      setSafeTextareaValue(id, val);
    } else {
      el.value = val;
    }
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
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    }
  }

  function withTimeout(promise, ms = 15000, errorMsg = "Batas waktu koneksi terlampaui.") {
    let timer = null;
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(errorMsg)), ms);
    });
    return Promise.race([
      Promise.resolve(promise).finally(() => clearTimeout(timer)),
      timeoutPromise
    ]);
  }

  async function restUpsert(table, payload) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`REST Upsert ${table} gagal (${res.status}): ${text}`);
    }
    return await res.json();
  }

  // Helper kompresi dan upload foto
  async function processPengurusPhoto(inputId, prevVal, prefix) {
    if (typeof window.processImageField === 'function') {
      return await window.processImageField(inputId, prevVal, {
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.85,
        pathPrefix: prefix
      });
    }

    // Fallback inline jika image-compressor.js belum selesai dimuat
    const input = document.getElementById(inputId);
    if (input && input.getAttribute('data-hapus') === 'true') {
      return '';
    }
    if (input && input.files && input.files[0]) {
      return new Promise((resolve) => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width;
            let h = img.height;
            if (w > 600 || h > 600) {
              const r = Math.min(600 / w, 600 / h);
              w = Math.round(w * r);
              h = Math.round(h * r);
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85));
          };
          img.onerror = () => resolve(prevVal || '');
          img.src = e.target.result;
        };
        reader.onerror = () => resolve(prevVal || '');
        reader.readAsDataURL(file);
      });
    }
    return prevVal || '';
  }

  // 1. SELECT DARI SUPABASE (LOAD FORM PROFIL)
  window.loadProfilData = async function () {
    console.log("[Kelola Profil] Memulai loadProfilData()...");
    try {
      let dbData = null;
      const supa = getSupabaseClient();
      if (supa) {
        try {
          const { data, error } = await withTimeout(
            supa.from('profile_settings').select('*').eq('id', 1).maybeSingle(),
            8000
          );
          if (!error && data) dbData = data;
        } catch (e) {
          console.warn("[Kelola Profil] Supabase client SELECT error/timeout:", e);
        }
      }

      // Fallback via Native REST API jika supa belum menghasilkan data
      if (!dbData) {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/profile_settings?id=eq.1&select=*`, {
            cache: 'no-store',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          });
          if (res.ok) {
            const rows = await res.json();
            if (rows && rows[0]) dbData = rows[0];
          }
        } catch (e) {}
      }

      if (dbData) {
        console.log("[Kelola Profil] Data profile_settings berhasil dimuat:", dbData);
        if (dbData.banner_title || dbData.name) setVal('profilTitle', dbData.banner_title || dbData.name);
        if (dbData.banner_desc) setSafeTextareaValue('profilDesc', dbData.banner_desc);
        if (dbData.history) setSafeTextareaValue('sejarahText', dbData.history);
        if (dbData.struktur_title) setVal('strukturTitle', dbData.struktur_title);
        if (dbData.struktur_desc) setSafeTextareaValue('strukturDesc', dbData.struktur_desc);

        if (dbData.pengurus && typeof dbData.pengurus === 'object') {
          const p = dbData.pengurus;
          if (p.namaKetua) setVal('namaKetua', p.namaKetua);
          if (p.namaSDI) setVal('namaSDI', p.namaSDI);
          if (p.namaMI) setVal('namaMI', p.namaMI);
          if (p.namaMTs) setVal('namaMTs', p.namaMTs);
          if (p.namaMA) setVal('namaMA', p.namaMA);
          if (p.namaMudir) setVal('namaMudir', p.namaMudir);

          // Simpan foto di memori untuk keperluan fallback simpan
          currentPengurusState = {
            fotoKetua: p.fotoKetua || '',
            fotoSDI: p.fotoSDI || '',
            fotoMI: p.fotoMI || '',
            fotoMTs: p.fotoMTs || '',
            fotoMA: p.fotoMA || '',
            fotoMudir: p.fotoMudir || ''
          };
        }
      }
    } catch (e) {
      console.warn("[Kelola Profil] Gagal memuat data Supabase:", e);
    }
  };

  // 2. SIMPAN PROFIL 100% PURE SUPABASE
  window.handleSimpanProfil = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isSaving) {
      console.warn("[Kelola Profil] Proses simpan sedang berjalan, klik ganda diabaikan.");
      return;
    }
    isSaving = true;

    console.log("[Kelola Profil] === MEMULAI PROSES SIMPAN PROFIL ===");

    const btnSaveProfil = document.getElementById('btnSimpanProfil');
    if (btnSaveProfil) {
      btnSaveProfil.disabled = true;
      btnSaveProfil.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Mengompres gambar & menyimpan...';
    }

    try {
      // 1. Proses kompresi canvas dan upload storage untuk semua foto pengurus secara paralel
      console.log("[Kelola Profil] Memproses kompresi & upload foto pengurus...");
      const [fotoKetua, fotoSDI, fotoMI, fotoMTs, fotoMA, fotoMudir] = await Promise.all([
        processPengurusPhoto('fotoKetua', currentPengurusState.fotoKetua, 'ketua'),
        processPengurusPhoto('fotoSDI', currentPengurusState.fotoSDI, 'sdi'),
        processPengurusPhoto('fotoMI', currentPengurusState.fotoMI, 'mi'),
        processPengurusPhoto('fotoMTs', currentPengurusState.fotoMTs, 'mts'),
        processPengurusPhoto('fotoMA', currentPengurusState.fotoMA, 'ma'),
        processPengurusPhoto('fotoMudir', currentPengurusState.fotoMudir, 'mudir')
      ]);

      const profilTitle = getVal('profilTitle', 'Profil Yayasan');
      const profilDesc = getSafeTextareaValue('profilDesc');
      const sejarahText = getSafeTextareaValue('sejarahText');
      const strukturTitle = getVal('strukturTitle', 'Struktur Organisasi');
      const strukturDesc = getSafeTextareaValue('strukturDesc');

      const namaKetua = getVal('namaKetua', '-');
      const namaSDI = getVal('namaSDI', '-');
      const namaMI = getVal('namaMI', '-');
      const namaMTs = getVal('namaMTs', '-');
      const namaMA = getVal('namaMA', '-');
      const namaMudir = getVal('namaMudir', '-');

      const newPengurus = {
        namaKetua, fotoKetua,
        namaSDI, fotoSDI,
        namaMI, fotoMI,
        namaMTs, fotoMTs,
        namaMA, fotoMA,
        namaMudir, fotoMudir
      };

      const supabasePayload = {
        id: 1,
        name: profilTitle,
        banner_title: profilTitle,
        banner_desc: profilDesc,
        history: sejarahText,
        struktur_title: strukturTitle,
        struktur_desc: strukturDesc,
        pengurus: newPengurus,
        updated_at: new Date().toISOString()
      };

      console.log("[Kelola Profil] Mengirim payload ke Supabase:", {
        ...supabasePayload,
        pengurus: {
          ...newPengurus,
          fotoKetua: fotoKetua ? (fotoKetua.startsWith('http') ? fotoKetua : `[dataUrl ${fotoKetua.length} chars]`) : 'kosong'
        }
      });

      let saveSuccess = false;
      const supa = getSupabaseClient();

      if (supa) {
        try {
          const { error } = await withTimeout(
            supa.from('profile_settings').upsert(supabasePayload, { onConflict: 'id' }),
            15000,
            "Timeout saat menyimpan profile_settings"
          );
          if (error) throw error;
          saveSuccess = true;
        } catch (clientErr) {
          console.warn("[Kelola Profil] Supabase client gagal, mencoba REST fallback:", clientErr);
        }
      }

      if (!saveSuccess) {
        console.log("[Kelola Profil] Menjalankan REST Upsert langsung...");
        await withTimeout(restUpsert('profile_settings', supabasePayload), 15000, "REST timeout profile_settings");
        saveSuccess = true;
      }

      // Update memory state
      currentPengurusState = newPengurus;

      // Bersihkan attribute data-hapus dan reset input file
      ['fotoKetua', 'fotoSDI', 'fotoMI', 'fotoMTs', 'fotoMA', 'fotoMudir'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.setAttribute('data-hapus', 'false');
          el.value = '';
        }
      });

      try {
        localStorage.removeItem('cmsData_profil');
      } catch (e) {}

      console.log("[Kelola Profil] === BERHASIL DISIMPAN KE SUPABASE ===");
      alert("Alhamdulillah! Data Profil & Struktur Organisasi BERHASIL DISIMPAN secara online ke database Supabase.\nPerubahan sudah aktif di semua perangkat.");
    } catch (error) {
      console.error("[Kelola Profil] GAGAL menyimpan ke Supabase:", error);
      let errMsg = error?.message || String(error);
      if (error?.code === '42501' || errMsg.toLowerCase().includes('row-level security') || errMsg.toLowerCase().includes('rls')) {
        errMsg += "\n\n(Akses ditolak oleh RLS di Supabase. Jalankan perintah: ALTER TABLE profile_settings DISABLE ROW LEVEL SECURITY;)";
      }
      alert("Gagal menyimpan ke database Supabase:\n" + errMsg);
    } finally {
      console.log("[Kelola Profil] Mengembalikan state tombol (finally block)...");
      isSaving = false;
      resetButtonState();
    }
  };

  function initKelolaProfil() {
    console.log("[Kelola Profil] Menjalankan initKelolaProfil()...");
    window.loadProfilData();

    const btnSaveProfil = document.getElementById('btnSimpanProfil');
    if (btnSaveProfil && !btnSaveProfil.dataset.bound) {
      btnSaveProfil.dataset.bound = 'true';
      btnSaveProfil.addEventListener('click', window.handleSimpanProfil);
    }

    const formProfil = document.getElementById('formProfil');
    if (formProfil && !formProfil.dataset.bound) {
      formProfil.dataset.bound = 'true';
      formProfil.addEventListener('submit', window.handleSimpanProfil);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKelolaProfil);
  } else {
    initKelolaProfil();
  }
})();
