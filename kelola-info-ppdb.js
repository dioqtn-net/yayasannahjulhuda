/**
 * =======================================================================
 * KELOLA INFO PPDB (PANEL ADMIN) - 100% PURE SUPABASE
 * Aturan Mutlak: NO localStorage.getItem / NO localStorage.setItem
 * Fitur: Full PPDB Tabs, Auto-Reset Finally, 15s Timeout & Native REST Fallback
 * =======================================================================
 */

(function () {
  console.log("[Kelola PPDB] Skrip kelola-info-ppdb.js dimuat...");

  const SUPABASE_URL = "https://lrorriksjooxrpoihfge.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

  let isSaving = false;

  const defaultPPDB = {
    header_title: "Penerimaan Peserta Didik Baru",
    header_subtitle: "Papan Informasi Resmi Pendaftaran Peserta Didik Baru Yayasan Nahjul Huda",
    sekretariat_alamat: "Jl. J No.67G / Jl. HH Gg. 1 No. 63, RT.008/RW.001, Kebon Jeruk, Jakarta Barat 11530.",
    sdi: {
      jenjangName: 'SD Islam (SDI) AL KINDY',
      status: 'BUKA',
      hari: 'Senin s/d Sabtu',
      jam: '08.00 - 14.00',
      zona: 'WIB',
      tgl_mulai: '',
      tgl_selesai: '',
      lokasi: 'Pendaftaran dapat dilakukan secara langsung di ruang sekretariat Yayasan Nahjul Huda.',
      syarat: "Mengisi formulir pendaftaran\nFotokopi Akta Kelahiran (2 lembar)\nFotokopi KK & KTP Orang Tua\nPas Foto 3x4 (4 lembar)\nSurat Keterangan Lulus TK / RA (jika ada)",
      syarat_catatan: 'Seluruh berkas administrasi diserahkan ke ruang sekretariat pendaftaran.',
      konsultasi_desc: 'Masih bingung mengenai detail persyaratan, biaya, kurikulum, atau fasilitas sekolah? Jangan ragu untuk bertanya! Panitia kami siap membantu menjawab semua kebingungan Anda sebelum mendaftar.',
      kontak1_nama: 'Ibu Fatimah',
      kontak1_wa: '081234567890',
      kontak2_nama: 'Bapak Ahmad',
      kontak2_wa: '081298765432'
    },
    mi: {
      jenjangName: 'Madrasah Ibtidaiyah (MI) Nahjul Huda',
      status: 'BUKA',
      hari: 'Senin s/d Sabtu',
      jam: '07.30 - 14.30',
      zona: 'WIB',
      tgl_mulai: '',
      tgl_selesai: '',
      lokasi: 'Pendaftaran dapat dilakukan secara langsung di ruang sekretariat Yayasan Nahjul Huda.',
      syarat: "Mengisi formulir pendaftaran\nFotokopi Kartu Keluarga & KTP Orang Tua/Wali\nFotokopi Akta Kelahiran\nPas Foto 3x4 (4 lembar)\nFotokopi Ijazah / Sertifikat RA/TK",
      syarat_catatan: 'Seluruh berkas administrasi diserahkan ke ruang sekretariat pendaftaran.',
      konsultasi_desc: 'Masih bingung mengenai detail persyaratan, biaya, kurikulum, atau fasilitas madrasah? Jangan ragu untuk bertanya! Panitia kami siap membantu menjawab semua kebingungan Anda sebelum mendaftar.',
      kontak1_nama: 'Abi Subhan, SPd.',
      kontak1_wa: '08991168301',
      kontak2_nama: 'Abi Fahri, SPd.',
      kontak2_wa: '085695426904'
    },
    mts: {
      jenjangName: 'Madrasah Tsanawiyah (MTs) Nahjul Huda',
      status: 'BUKA',
      hari: 'Senin s/d Sabtu',
      jam: '08.00 - 14.00',
      zona: 'WIB',
      tgl_mulai: '',
      tgl_selesai: '',
      lokasi: 'Pendaftaran dapat dilakukan secara langsung di ruang sekretariat Yayasan Nahjul Huda.',
      syarat: "Mengisi formulir pendaftaran\nFotokopi Kartu Keluarga & KTP Orang Tua/Wali\nFotokopi Akta Kelahiran\nPas Foto 3x4 (4 lembar)\nFotokopi Ijazah SD/MI (2 lembar legalisir)",
      syarat_catatan: 'Seluruh berkas administrasi diserahkan ke ruang sekretariat pendaftaran.',
      konsultasi_desc: 'Masih bingung mengenai detail persyaratan, biaya, kurikulum, atau fasilitas madrasah? Jangan ragu untuk bertanya! Panitia kami siap membantu menjawab semua kebingungan Anda sebelum mendaftar.',
      kontak1_nama: 'Umi Hj. Dahlia',
      kontak1_wa: '085880682115',
      kontak2_nama: 'Abu Jalaluddin',
      kontak2_wa: '08158316436'
    },
    ma: {
      jenjangName: 'Madrasah Aliyah (MA) Nahjul Huda',
      status: 'BUKA',
      hari: 'Senin s/d Sabtu',
      jam: '08.00 - 14.00',
      zona: 'WIB',
      tgl_mulai: '',
      tgl_selesai: '',
      lokasi: 'Pendaftaran dapat dilakukan secara langsung di ruang sekretariat Yayasan Nahjul Huda.',
      syarat: "Mengisi formulir pendaftaran\nFotokopi Kartu Keluarga & KTP Orang Tua/Wali\nFotokopi Akta Kelahiran\nPas Foto 3x4 (4 lembar)\nFotokopi Ijazah SMP/MTs (2 lembar legalisir)",
      syarat_catatan: 'Seluruh berkas administrasi diserahkan ke ruang sekretariat pendaftaran.',
      konsultasi_desc: 'Masih bingung mengenai detail persyaratan, biaya, kurikulum, atau fasilitas madrasah? Jangan ragu untuk bertanya! Panitia kami siap membantu menjawab semua kebingungan Anda sebelum mendaftar.',
      kontak1_nama: 'Umi Hj. Dahlia',
      kontak1_wa: '085880682115',
      kontak2_nama: 'Abu Jalaluddin',
      kontak2_wa: '08158316436'
    },
    ponpes: {
      jenjangName: 'Pondok Pesantren Assurur',
      status: 'BUKA',
      hari: 'Senin s/d Sabtu',
      jam: '08.00 - 15.00',
      zona: 'WIB',
      tgl_mulai: '',
      tgl_selesai: '',
      lokasi: 'Pendaftaran dapat dilakukan secara langsung di ruang sekretariat Pondok Pesantren Assurur / Yayasan Nahjul Huda.',
      syarat: "Mengisi formulir pendaftaran santri baru\nFotokopi Akta Kelahiran & Kartu Keluarga (KK)\nFotokopi KTP Orang Tua / Wali\nSurat Keterangan Sehat dari Dokter\nPas Foto 3x4 berpakaian muslim/muslimah (5 lembar)\nMengikuti tes penempatan (baca Al-Qur'an & wawancara)",
      syarat_catatan: 'Seluruh berkas administrasi diserahkan ke ruang sekretariat pendaftaran.',
      konsultasi_desc: 'Masih bingung mengenai detail persyaratan, biaya, kurikulum, atau fasilitas pondok pesantren? Jangan ragu untuk bertanya! Panitia kami siap membantu menjawab semua kebingungan Anda sebelum mendaftar.',
      kontak1_nama: 'Bunda Dahlia',
      kontak1_wa: '08589010538',
      kontak2_nama: 'Abu Jalaluddin',
      kontak2_wa: '08158316436'
    }
  };

  let currentPPDBState = JSON.parse(JSON.stringify(defaultPPDB));

  try {
    localStorage.removeItem('cmsData_ppdb');
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
        console.warn("[Kelola PPDB] createClient warning:", err);
      }
    }
    return null;
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

  async function restPatchPPDB(payload) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ppdb_info?id=eq.1`, {
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
      throw new Error(`REST PATCH ppdb_info gagal (${res.status}): ${text}`);
    }
    return await res.json();
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (!el || val === undefined || val === null) return;
    if (el.tagName.toLowerCase() === 'textarea') {
      if (typeof window.setTextareaValueWithAlignment === 'function') {
        window.setTextareaValueWithAlignment(id, val);
      } else {
        el.value = val;
      }
    } else {
      el.value = val;
    }
  }

  function getVal(id, fallback = '') {
    const el = document.getElementById(id);
    const val = el?.value;
    return (typeof val === 'string' && val.trim() !== '') ? val.trim() : fallback;
  }

  function getSafeTextarea(id, fallback = '') {
    if (typeof window.getWrappedTextareaValue === 'function') {
      const wrapped = window.getWrappedTextareaValue(id);
      if (wrapped && wrapped.trim()) return wrapped;
    }
    const el = document.getElementById(id);
    return el?.value?.trim() || fallback;
  }

  function setValDual(id1, id2, val) {
    if (document.getElementById(id1)) setVal(id1, val);
    if (document.getElementById(id2)) setVal(id2, val);
  }

  function getValDual(id1, id2, fallback = '') {
    const el1 = document.getElementById(id1);
    if (el1 && typeof el1.value === 'string' && el1.value.trim() !== '') return el1.value.trim();
    const el2 = document.getElementById(id2);
    if (el2 && typeof el2.value === 'string' && el2.value.trim() !== '') return el2.value.trim();
    if (el1 && el1.value !== undefined && el1.value !== '') return el1.value.trim();
    if (el2 && el2.value !== undefined && el2.value !== '') return el2.value.trim();
    return fallback;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // DYNAMIC SYARAT LIST HANDLERS
  window.renderSyaratList = function (jenjang, syaratStr) {
    const container = document.getElementById(`ppdbAdmin_${jenjang}_syarat_list_container`);
    if (!container) return;
    container.innerHTML = '';

    let lines = [];
    if (typeof syaratStr === 'string' && syaratStr.trim() !== '') {
      lines = syaratStr.split('\n').map(s => s.trim()).filter(Boolean);
    } else if (defaultPPDB[jenjang] && defaultPPDB[jenjang].syarat) {
      lines = defaultPPDB[jenjang].syarat.split('\n').map(s => s.trim()).filter(Boolean);
    }

    lines.forEach(text => {
      window.addSyaratItem(jenjang, text);
    });

    window.updateSyaratUIState(jenjang);
  };

  window.addSyaratItem = function (jenjang, initialVal = '') {
    const container = document.getElementById(`ppdbAdmin_${jenjang}_syarat_list_container`);
    if (!container) return;

    const currentRows = container.querySelectorAll('.syarat-item-row');
    if (currentRows.length >= 8) {
      window.updateSyaratUIState(jenjang);
      return;
    }

    const row = document.createElement('div');
    row.className = 'syarat-item-row flex items-center gap-2.5 bg-white p-2.5 border border-slate-200 rounded-xl shadow-xs transition hover:border-emerald-300';
    
    const escapedVal = escapeHtml(initialVal || '');
    
    row.innerHTML = `
      <span class="syarat-number w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
        ${currentRows.length + 1}
      </span>
      <input type="text" value="${escapedVal}" class="syarat-input flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white text-slate-800 transition" placeholder="Contoh: Fotokopi Akta Kelahiran (2 lembar)">
      <button type="button" onclick="window.removeSyaratItem(this, '${jenjang}')" class="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition" title="Hapus Poin Berkas">
        <i class="far fa-trash-alt text-sm"></i>
      </button>
    `;
    container.appendChild(row);

    window.updateSyaratUIState(jenjang);
  };

  window.removeSyaratItem = function (btn, jenjang) {
    const row = btn.closest('.syarat-item-row');
    if (row) row.remove();
    window.updateSyaratUIState(jenjang);
  };

  window.updateSyaratUIState = function (jenjang) {
    const container = document.getElementById(`ppdbAdmin_${jenjang}_syarat_list_container`);
    const emptyNotice = document.getElementById(`ppdbAdmin_${jenjang}_syarat_empty_notice`);
    const maxNotice = document.getElementById(`ppdbAdmin_${jenjang}_syarat_max_notice`);
    const addBtn = document.getElementById(`ppdbAdmin_${jenjang}_btn_add_syarat`);
    if (!container) return;

    const rows = container.querySelectorAll('.syarat-item-row');
    rows.forEach((r, idx) => {
      const badge = r.querySelector('.syarat-number');
      if (badge) badge.textContent = idx + 1;
    });

    if (emptyNotice) {
      if (rows.length === 0) {
        emptyNotice.classList.remove('hidden');
      } else {
        emptyNotice.classList.add('hidden');
      }
    }

    if (rows.length >= 8) {
      if (maxNotice) maxNotice.classList.remove('hidden');
      if (addBtn) addBtn.classList.add('opacity-50', 'pointer-events-none');
    } else {
      if (maxNotice) maxNotice.classList.add('hidden');
      if (addBtn) addBtn.classList.remove('opacity-50', 'pointer-events-none');
    }
  };

  window.getSyaratListValues = function (jenjang) {
    const container = document.getElementById(`ppdbAdmin_${jenjang}_syarat_list_container`);
    if (!container) return '';
    const inputs = container.querySelectorAll('.syarat-input');
    const values = [];
    inputs.forEach(inp => {
      const v = inp.value.trim();
      if (v) values.push(v);
    });
    return values.join('\n');
  };

  // 1. MUAT DATA PPDB DARI SUPABASE
  window.loadPPDBFields = async function () {
    console.log("[Kelola PPDB] Memuat data PPDB dari Supabase...");
    try {
      let dbPPDB = null;
      const supa = getSupabaseClient();
      if (supa) {
        try {
          const { data, error } = await withTimeout(
            supa.from('ppdb_info').select('*').eq('id', 1).maybeSingle(),
            8000
          );
          if (!error && data) dbPPDB = data;
        } catch (e) {
          console.warn("[Kelola PPDB] Supabase client SELECT error:", e);
        }
      }

      if (!dbPPDB) {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/ppdb_info?id=eq.1&select=*`, {
            cache: 'no-store',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          });
          if (res.ok) {
            const rows = await res.json();
            if (rows && rows[0]) dbPPDB = rows[0];
          }
        } catch (e) {}
      }

      if (dbPPDB) {
        if (dbPPDB.contact_person && typeof dbPPDB.contact_person === 'object') {
          currentPPDBState = { ...defaultPPDB, ...dbPPDB.contact_person };
        }
        if (dbPPDB.greeting_title) currentPPDBState.header_title = dbPPDB.greeting_title;
        if (dbPPDB.greeting_desc) currentPPDBState.header_subtitle = dbPPDB.greeting_desc;

        setVal('ppdbAdmin_header_title', currentPPDBState.header_title || '');
        setVal('ppdbAdmin_header_subtitle', currentPPDBState.header_subtitle || '');
        setVal('ppdbAdmin_sekretariat_alamat', currentPPDBState.sekretariat_alamat || '');

        const jenjangKeys = ['sdi', 'mi', 'mts', 'ma', 'ponpes'];
        jenjangKeys.forEach(k => {
          const item = currentPPDBState[k] || {};
          setVal(`ppdbAdmin_${k}_status`, item.status || 'BUKA');
          setVal(`ppdbAdmin_${k}_hari`, item.hari || '');
          setVal(`ppdbAdmin_${k}_jam`, item.jam || '');
          setVal(`ppdbAdmin_${k}_zona`, item.zona || 'WIB');
          setVal(`ppdbAdmin_${k}_tgl_mulai`, item.tgl_mulai || '');
          setVal(`ppdbAdmin_${k}_tgl_selesai`, item.tgl_selesai || '');
          setVal(`ppdbAdmin_${k}_lokasi`, item.lokasi || '');
          window.renderSyaratList(k, item.syarat);
          setVal(`ppdbAdmin_${k}_syarat_catatan`, item.syarat_catatan || '');

          // Deskripsi Konsultasi
          const defDesc = defaultPPDB[k]?.konsultasi_desc || 'Masih bingung mengenai detail persyaratan, biaya, kurikulum, atau fasilitas madrasah? Jangan ragu untuk bertanya! Panitia kami siap membantu menjawab semua kebingungan Anda sebelum mendaftar.';
          const valDesc = (item.konsultasi_desc !== undefined && item.konsultasi_desc !== '') ? item.konsultasi_desc : defDesc;
          setVal(`ppdbAdmin_${k}_konsultasi_desc`, valDesc);

          // Kontak 1 & 2
          const defK1Nama = defaultPPDB[k]?.kontak1_nama || '';
          const defK1Wa = defaultPPDB[k]?.kontak1_wa || '';
          const defK2Nama = defaultPPDB[k]?.kontak2_nama || '';
          const defK2Wa = defaultPPDB[k]?.kontak2_wa || '';

          const valK1Nama = (item.kontak1_nama !== undefined && item.kontak1_nama !== '') ? item.kontak1_nama : defK1Nama;
          const valK1Wa = (item.kontak1_wa !== undefined && item.kontak1_wa !== '') ? item.kontak1_wa : defK1Wa;
          const valK2Nama = (item.kontak2_nama !== undefined && item.kontak2_nama !== '') ? item.kontak2_nama : defK2Nama;
          const valK2Wa = (item.kontak2_wa !== undefined && item.kontak2_wa !== '') ? item.kontak2_wa : defK2Wa;

          setValDual(`ppdbAdmin_${k}_k1_nama`, `ppdbAdmin_${k}_kontak1_nama`, valK1Nama);
          setValDual(`ppdbAdmin_${k}_k1_wa`, `ppdbAdmin_${k}_kontak1_wa`, valK1Wa);
          setValDual(`ppdbAdmin_${k}_k2_nama`, `ppdbAdmin_${k}_kontak2_nama`, valK2Nama);
          setValDual(`ppdbAdmin_${k}_k2_wa`, `ppdbAdmin_${k}_kontak2_wa`, valK2Wa);
        });
      }
    } catch (e) {
      console.error("[Kelola PPDB] Gagal memuat data PPDB:", e);
    }
  };

  // 2. SIMPAN SAMBUTAN PPDB
  window.savePPDBSambutan = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isSaving) return;
    isSaving = true;

    const btn = document.getElementById('btnSimpanHeaderPPDB');
    const originalHtml = `<i class="fas fa-save"></i> <span>Simpan Teks Sambutan</span>`;
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan...';
    }

    try {
      const header_title = getVal('ppdbAdmin_header_title', defaultPPDB.header_title);
      const header_subtitle = getSafeTextarea('ppdbAdmin_header_subtitle', defaultPPDB.header_subtitle);

      currentPPDBState.header_title = header_title;
      currentPPDBState.header_subtitle = header_subtitle;

      const payload = {
        greeting_title: header_title,
        greeting_desc: header_subtitle,
        requirements: header_subtitle,
        contact_person: currentPPDBState,
        updated_at: new Date().toISOString()
      };

      const supa = getSupabaseClient();
      let saveSuccess = false;
      if (supa) {
        try {
          const { error } = await withTimeout(
            supa.from('ppdb_info').update(payload).eq('id', 1),
            10000
          );
          if (!error) saveSuccess = true;
        } catch (e) {
          console.warn("[Kelola PPDB] Supabase update warning:", e);
        }
      }

      if (!saveSuccess) {
        await withTimeout(restPatchPPDB(payload), 10000);
      }

      try {
        localStorage.removeItem('cmsData_ppdb');
      } catch (e) {}

      alert('Alhamdulillah! Teks Sambutan PPDB berhasil disimpan ke database Supabase.');
    } catch (err) {
      console.error('[Kelola PPDB] Gagal simpan sambutan:', err);
      alert('Gagal menyimpan teks sambutan:\n' + (err.message || err));
    } finally {
      isSaving = false;
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      }
    }
  };

  // 3. SIMPAN SEKRETARIAT PPDB
  window.savePPDBSekretariat = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      const sekretariat_alamat = getSafeTextarea('ppdbAdmin_sekretariat_alamat', defaultPPDB.sekretariat_alamat);
      currentPPDBState.sekretariat_alamat = sekretariat_alamat;

      const payload = {
        contact_person: currentPPDBState,
        updated_at: new Date().toISOString()
      };

      const supa = getSupabaseClient();
      let saveSuccess = false;
      if (supa) {
        try {
          const { error } = await withTimeout(
            supa.from('ppdb_info').update(payload).eq('id', 1),
            10000
          );
          if (!error) saveSuccess = true;
        } catch (e) {}
      }

      if (!saveSuccess) {
        await withTimeout(restPatchPPDB(payload), 10000);
      }

      try {
        localStorage.removeItem('cmsData_ppdb');
      } catch (e) {}

      alert('Alhamdulillah! Alamat Sekretariat PPDB berhasil disimpan.');
    } catch (err) {
      alert('Gagal menyimpan sekretariat:\n' + (err.message || err));
    }
  };

  // 4. SIMPAN PER JENJANG PPDB
  window.savePPDBAdminJenjang = async function (jenjangKey, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const btn = (e && e.currentTarget) || document.querySelector(`[onclick*="savePPDBAdminJenjang('${jenjangKey}')"]`);
    const originalHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan...';
    }

    try {
      const k = jenjangKey;
      currentPPDBState[k] = {
        jenjangName: currentPPDBState[k]?.jenjangName || defaultPPDB[k]?.jenjangName || k.toUpperCase(),
        status: getVal(`ppdbAdmin_${k}_status`, 'BUKA'),
        hari: getVal(`ppdbAdmin_${k}_hari`),
        jam: getVal(`ppdbAdmin_${k}_jam`),
        zona: getVal(`ppdbAdmin_${k}_zona`, 'WIB'),
        tgl_mulai: getVal(`ppdbAdmin_${k}_tgl_mulai`),
        tgl_selesai: getVal(`ppdbAdmin_${k}_tgl_selesai`),
        lokasi: getSafeTextarea(`ppdbAdmin_${k}_lokasi`),
        syarat: window.getSyaratListValues(k),
        syarat_catatan: getSafeTextarea(`ppdbAdmin_${k}_syarat_catatan`),
        konsultasi_desc: getSafeTextarea(`ppdbAdmin_${k}_konsultasi_desc`, defaultPPDB[k]?.konsultasi_desc || ''),
        kontak1_nama: getValDual(`ppdbAdmin_${k}_k1_nama`, `ppdbAdmin_${k}_kontak1_nama`, ''),
        kontak1_wa: getValDual(`ppdbAdmin_${k}_k1_wa`, `ppdbAdmin_${k}_kontak1_wa`, ''),
        kontak2_nama: getValDual(`ppdbAdmin_${k}_k2_nama`, `ppdbAdmin_${k}_kontak2_nama`, ''),
        kontak2_wa: getValDual(`ppdbAdmin_${k}_k2_wa`, `ppdbAdmin_${k}_kontak2_wa`, '')
      };

      const payload = {
        contact_person: currentPPDBState,
        updated_at: new Date().toISOString()
      };

      const supa = getSupabaseClient();
      let saveSuccess = false;
      if (supa) {
        try {
          const { error } = await withTimeout(
            supa.from('ppdb_info').update(payload).eq('id', 1),
            10000
          );
          if (!error) saveSuccess = true;
        } catch (e) {
          console.warn(`[Kelola PPDB] Supabase update ${k} warning:`, e);
        }
      }

      if (!saveSuccess) {
        await withTimeout(restPatchPPDB(payload), 10000);
      }

      try {
        localStorage.removeItem('cmsData_ppdb');
      } catch (e) {}

      alert(`Alhamdulillah! Informasi PPDB untuk jenjang ${k.toUpperCase()} berhasil disimpan ke database Supabase.`);
    } catch (err) {
      console.error(`[Kelola PPDB] Gagal simpan ${jenjangKey}:`, err);
      alert(`Gagal menyimpan jenjang ${jenjangKey}:\n` + (err.message || err));
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHtml || 'Simpan Informasi Jenjang';
      }
    }
  };

  window.simpanInfoPPDB = window.savePPDBAdminJenjang;

  // 5. INISIALISASI TAB & EVENT
  function initPPDBAdmin() {
    // Tab switching
    document.querySelectorAll('.tab-jenjang').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-jenjang').forEach(t => {
          t.classList.remove('bg-green-800', 'bg-emerald-800', 'text-white');
          t.classList.add('text-slate-600', 'bg-white');
        });
        e.currentTarget.classList.remove('text-slate-600', 'bg-white');
        e.currentTarget.classList.add('bg-green-800', 'text-white');

        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        const targetId = e.currentTarget.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) targetEl.classList.remove('hidden');
      });
    });

    window.loadPPDBFields();

    const btnHeaderPPDB = document.getElementById('btnSimpanHeaderPPDB');
    if (btnHeaderPPDB && !btnHeaderPPDB.dataset.bound) {
      btnHeaderPPDB.dataset.bound = 'true';
      btnHeaderPPDB.addEventListener('click', window.savePPDBSambutan);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPPDBAdmin);
  } else {
    initPPDBAdmin();
  }
})();
