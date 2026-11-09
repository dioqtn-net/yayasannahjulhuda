/**
 * =======================================================================
 * KELOLA PROGRAM (PANEL ADMIN) - 100% PURE SUPABASE
 * Aturan Mutlak: NO localStorage.getItem / NO localStorage.setItem
 * Fitur: Single Save Button, Auto-Reset Finally, 15s Timeout & Native REST Fallback
 * =======================================================================
 */

(function () {
  console.log("[Kelola Program] Skrip kelola-program.js mulai dimuat...");

  const SUPABASE_URL = "https://lrorriksjooxrpoihfge.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

  let isSaving = false;
  const BTN_PROGRAM_HTML = `<svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg> Simpan Perubahan Program`;

  // Bersihkan sisa-sisa cache lama dari memori browser
  try {
    localStorage.removeItem('cmsData_program');
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
        console.warn("[Kelola Program] createClient warning:", err);
      }
    }
    return null;
  }

  function resetButtonState() {
    const btn = document.getElementById('btnSimpanProgram');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = BTN_PROGRAM_HTML;
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
      promise.finally(() => clearTimeout(timer)),
      timeoutPromise
    ]);
  }

  async function restPatch(table, id, payload) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`REST PATCH ${table} ID ${id} gagal (${res.status}): ${text}`);
    }
    return await res.json();
  }

  // 1. SELECT DARI SUPABASE (LOAD FORM PROGRAM)
  window.loadProgramData = async function () {
    console.log("[Kelola Program] Memulai loadProgramData()...");
    try {
      let units = null;
      const supa = getSupabaseClient();
      if (supa) {
        try {
          const { data, error } = await withTimeout(
            supa.from('education_units').select('*').order('id', { ascending: true }),
            8000
          );
          if (!error && data && data.length > 0) units = data;
        } catch (e) {
          console.warn("[Kelola Program] Supabase client SELECT error/timeout:", e);
        }
      }

      // Fallback via Native REST API jika supa belum menghasilkan data
      if (!units) {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/education_units?select=*&order=id.asc`, {
            cache: 'no-store',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          });
          if (res.ok) {
            units = await res.json();
          }
        } catch (e) {}
      }

      if (units && units.length > 0) {
        console.log("[Kelola Program] Data education_units berhasil dimuat:", units);
        const prefixMap = { 1: 'sdi', 2: 'mi', 3: 'mts', 4: 'ma', 5: 'ponpes' };
        units.forEach(u => {
          const p = prefixMap[u.id];
          if (p) {
            if (u.accreditation) setVal(p + 'Akreditasi', u.accreditation);
            if (u.curriculum) setVal(p + 'Kurikulum', u.curriculum);
            if (u.description) setSafeTextareaValue(p + 'Desc', u.description);
            if (u.vision) setSafeTextareaValue(p + 'Visi', u.vision);
            if (u.mission) setSafeTextareaValue(p + 'Misi', u.mission);
            if (u.featured_programs) setVal(p + 'Unggulan', u.featured_programs);
            if (u.extracurricular) setVal(p + 'Ekskul', u.extracurricular);
            if (u.facilities) setVal(p + 'Fasilitas', u.facilities);
          }
        });
      }
    } catch (e) {
      console.warn("[Kelola Program] Gagal memuat data Supabase:", e);
    }
  };

  // 2. SIMPAN PROGRAM 100% PURE SUPABASE
  window.handleSimpanProgram = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isSaving) {
      console.warn("[Kelola Program] Proses simpan sedang berjalan, klik ganda diabaikan.");
      return;
    }
    isSaving = true;

    console.log("[Kelola Program] === MEMULAI PROSES SIMPAN PROGRAM ===");

    const btnSaveProgram = document.getElementById('btnSimpanProgram');
    if (btnSaveProgram) {
      btnSaveProgram.disabled = true;
      btnSaveProgram.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan ke server...';
    }

    try {
      const unitsPayload = [
        {
          id: 1,
          name: 'SD Islam (SDI) AL KINDY',
          accreditation: getVal('sdiAkreditasi', 'A'),
          curriculum: getVal('sdiKurikulum', 'Kedinasan : Kementerian Pendidikan'),
          description: getSafeTextareaValue('sdiDesc'),
          vision: getSafeTextareaValue('sdiVisi'),
          mission: getSafeTextareaValue('sdiMisi'),
          featured_programs: getVal('sdiUnggulan', "Qira'ati, Tahfidz Al-Qur'an (Juz 30), dan KTIQ."),
          extracurricular: getVal('sdiEkskul', 'Pramuka, Futsal, Tari'),
          facilities: getVal('sdiFasilitas', 'Ruang AC, CCTV, Kantin, Lapangan Olahraga, Laboratorium Komputer')
        },
        {
          id: 2,
          name: 'Madrasah Ibtidaiyah (MI) Nahjul Huda',
          accreditation: getVal('miAkreditasi', '-'),
          curriculum: getVal('miKurikulum', 'Kedinasan : Kementerian Pendidikan'),
          description: getSafeTextareaValue('miDesc'),
          vision: getSafeTextareaValue('miVisi'),
          mission: getSafeTextareaValue('miMisi'),
          featured_programs: getVal('miUnggulan', "Qira'atul Qur'an Metode Qiroati, Keterampilan Kemandirian"),
          extracurricular: getVal('miEkskul', 'Futsal, Menari, Pramuka'),
          facilities: getVal('miFasilitas', 'Lapangan Upacara, Lapangan Olahraga, Lab Komputer, Musholla, Toilet, Kantin, Perpustakaan')
        },
        {
          id: 3,
          name: 'Madrasah Tsanawiyah (MTs) Nahjul Huda',
          accreditation: getVal('mtsAkreditasi', 'A'),
          curriculum: getVal('mtsKurikulum', 'Kedinasan : Kementerian Pendidikan'),
          description: getSafeTextareaValue('mtsDesc'),
          vision: getSafeTextareaValue('mtsVisi'),
          mission: getSafeTextareaValue('mtsMisi'),
          featured_programs: getVal('mtsUnggulan', '-'),
          extracurricular: getVal('mtsEkskul', 'Pramuka, Hadroh, Drumband, Tari Saman, Futsal, Muhadoroh'),
          facilities: getVal('mtsFasilitas', 'Ruang Kelas AC, Lapangan Olahraga, Lapangan Futsal, Laboratorium Komputer, Ruang Asrama, Mushola, Kantin, Kamar Mandi Bersih')
        },
        {
          id: 4,
          name: 'Madrasah Aliyah (MA) Nahjul Huda',
          accreditation: getVal('maAkreditasi', '-'),
          curriculum: getVal('maKurikulum', 'Kedinasan : Kementerian Pendidikan'),
          description: getSafeTextareaValue('maDesc'),
          vision: getSafeTextareaValue('maVisi'),
          mission: getSafeTextareaValue('maMisi'),
          featured_programs: getVal('maUnggulan', '-'),
          extracurricular: getVal('maEkskul', 'Pramuka, Hadroh, Drumband, Tari Saman, Futsal, Muhadoroh'),
          facilities: getVal('maFasilitas', 'Ruang Kelas AC, Lapangan Olahraga, Lapangan Futsal, Laboratorium Komputer, Ruang Asrama, Mushola, Kantin, Kamar Mandi Bersih')
        },
        {
          id: 5,
          name: 'Pondok Pesantren Assurur',
          accreditation: getVal('ponpesAkreditasi', '-'),
          curriculum: getVal('ponpesKurikulum', 'Salafiyah & Modern'),
          description: getSafeTextareaValue('ponpesDesc'),
          vision: getSafeTextareaValue('ponpesVisi'),
          mission: getSafeTextareaValue('ponpesMisi'),
          featured_programs: getVal('ponpesUnggulan', 'Bahasa Arab, Bahasa Inggris, Metode Qiroati, Tahfidzul Qur\'an, Kitab Kuning, Multimedia'),
          extracurricular: getVal('ponpesEkskul', '-'),
          facilities: getVal('ponpesFasilitas', 'Asrama Putra/Putri, Masjid As-Surur')
        }
      ];

      console.log('[Kelola Program] Mengirim 5 unit pendidikan ke Supabase education_units...');

      const supa = getSupabaseClient();
      for (const unit of unitsPayload) {
        let savedUnit = false;
        if (supa) {
          try {
            const { error } = await withTimeout(
              supa.from('education_units').update(unit).eq('id', unit.id),
              8000
            );
            if (!error) savedUnit = true;
          } catch (e) {
            console.warn(`[Kelola Program] Supabase client gagal update unit ${unit.id}:`, e);
          }
        }

        if (!savedUnit) {
          console.log(`[Kelola Program] REST PATCH fallback unit ${unit.id}...`);
          await withTimeout(restPatch('education_units', unit.id, unit), 10000);
        }
      }

      // Bersihkan cache lokal
      try {
        localStorage.removeItem('cmsData_program');
      } catch (e) {}

      console.log("[Kelola Program] === BERHASIL DISIMPAN KE SUPABASE ===");
      alert("Alhamdulillah! Data 5 Jenjang Program Pendidikan BERHASIL DISIMPAN secara online ke database Supabase.\nPerubahan sudah aktif di semua perangkat pengunjung.");
    } catch (error) {
      console.error("[Kelola Program] GAGAL menyimpan ke Supabase:", error);
      let errMsg = error?.message || String(error);
      if (error?.code === '42501' || errMsg.toLowerCase().includes('row-level security') || errMsg.toLowerCase().includes('rls')) {
        errMsg += "\n\n(Akses ditolak oleh RLS di Supabase. Jalankan perintah: ALTER TABLE education_units DISABLE ROW LEVEL SECURITY;)";
      }
      alert("Gagal menyimpan ke database Supabase:\n" + errMsg);
    } finally {
      console.log("[Kelola Program] Mengembalikan state tombol (finally block)...");
      isSaving = false;
      resetButtonState();
    }
  };

  function initKelolaProgram() {
    console.log("[Kelola Program] Menjalankan initKelolaProgram()...");
    window.loadProgramData();

    const btnSaveProgram = document.getElementById('btnSimpanProgram');
    if (btnSaveProgram && !btnSaveProgram.dataset.bound) {
      btnSaveProgram.dataset.bound = 'true';
      btnSaveProgram.addEventListener('click', window.handleSimpanProgram);
    }

    const formProgram = document.getElementById('formProgram');
    if (formProgram && !formProgram.dataset.bound) {
      formProgram.dataset.bound = 'true';
      formProgram.addEventListener('submit', window.handleSimpanProgram);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKelolaProgram);
  } else {
    initKelolaProgram();
  }
})();
