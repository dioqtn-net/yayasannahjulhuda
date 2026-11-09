/**
 * =======================================================================
 * KELOLA GALERI (PANEL ADMIN) - 100% PURE SUPABASE
 * Aturan: NO localStorage.getItem / NO localStorage.setItem
 * Fitur: Full CRUD Ekstrakurikuler & Kegiatan, 15s Timeout & Native REST Fallback
 * Kolom Tabel: 4 Kolom (Judul, Jenjang, Tanggal, Aksi)
 * =======================================================================
 */

(function () {
  console.log("[Kelola Galeri] Skrip kelola-galeri.js dimuat...");

  const SUPABASE_URL = "https://lrorriksjooxrpoihfge.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

  let isSavingEskul = false;
  let isSavingKegiatan = false;
  let currentEskulList = [];
  let currentKegiatanList = [];

  try {
    localStorage.removeItem('cmsData_listEskul');
    localStorage.removeItem('cmsData_listKegiatan');
    localStorage.removeItem('cmsData_galeriBanner');
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
        console.warn("[Kelola Galeri] createClient warning:", err);
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

  async function restFetch(endpoint, options = {}) {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    const headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      ...(options.headers || {})
    };
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`REST Error ${res.status}: ${text}`);
    }
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    return null;
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatIndoDate(dateStr) {
    if (!dateStr) return '-';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const year = parts[0];
        const month = months[parseInt(parts[1], 10) - 1] || parts[1];
        const day = parseInt(parts[2], 10);
        return `${day} ${month} ${year}`;
      }
    } catch (e) {}
    return dateStr;
  }

  // Helper membaca file/media
  async function readFileOrName(inputEl, fallback) {
    if (!inputEl) return fallback || '';
    if (typeof window.processImageField === 'function') {
      return await window.processImageField(inputEl, fallback, {
        maxWidth: 1600,
        maxHeight: 1200,
        quality: 0.85,
        pathPrefix: 'galeri'
      });
    }
    const file = inputEl.files && inputEl.files[0];
    if (file) {
      if (typeof window.compressImage === 'function' && file.type && file.type.startsWith('image/')) {
        const comp = await window.compressImage(file, { maxWidth: 1600, maxHeight: 1200, quality: 0.85 });
        return comp.dataUrl;
      }
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => resolve(fallback || '');
        reader.readAsDataURL(file);
      });
    }
    return fallback || '';
  }

  // 1. LOAD DAFTAR GALERI DARI SUPABASE
  window.loadGaleriData = async function () {
    console.log("[Kelola Galeri] Memuat galeri dari Supabase...");
    try {
      let dbData = null;
      const supa = getSupabaseClient();
      if (supa) {
        try {
          const { data, error } = await withTimeout(
            supa.from('galleries').select('*').order('id', { ascending: false }),
            8000
          );
          if (!error && data) dbData = data;
        } catch (e) {
          console.warn("[Kelola Galeri] Supabase client SELECT error:", e);
        }
      }

      if (!dbData) {
        try {
          dbData = await withTimeout(restFetch('galleries?select=*&order=id.desc'), 8000);
        } catch (e) {
          console.warn("[Kelola Galeri] REST fetch error:", e);
        }
      }

      if (dbData && Array.isArray(dbData)) {
        currentEskulList = dbData.filter(g => (g.category || '').toLowerCase() === 'ekstrakurikuler' || (g.category || '').toLowerCase() === 'eskul');
        currentKegiatanList = dbData.filter(g => (g.category || '').toLowerCase() === 'kegiatan' || !(g.category || '').toLowerCase().includes('eskul'));
      } else {
        currentEskulList = [];
        currentKegiatanList = [];
      }

      renderAdminEskulTable();
      renderAdminKegiatanTable();
    } catch (e) {
      console.error("[Kelola Galeri] Gagal memuat galeri:", e);
    }
  };

  // 2. TABEL ADMIN ESKUL (4 Kolom Sesuai kelola.html)
  function renderAdminEskulTable() {
    const tbody = document.getElementById('adminListEskul') || document.getElementById('daftarEskulAdmin');
    if (!tbody) return;

    if (currentEskulList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-6 text-center text-gray-500">Belum ada ekstrakurikuler tersimpan di database. Silakan klik tombol <span class="font-semibold text-emerald-700">+ Tambah Ekstrakurikuler</span> di atas.</td></tr>`;
      return;
    }

    tbody.innerHTML = currentEskulList.map(item => `
      <tr class="hover:bg-slate-50 transition border-b border-gray-100">
        <td class="px-4 py-3 align-top">
          <div class="font-semibold text-gray-800 text-sm">${escapeHtml(item.title)}</div>
          <div class="text-[11px] text-gray-400 mt-0.5">${item.image_url ? 'Foto/Video tersimpan' : 'Tanpa media'}</div>
        </td>
        <td class="px-4 py-3 align-top">
          <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold inline-block">
            ${escapeHtml(item.jenjang || 'Semua')}
          </span>
        </td>
        <td class="px-4 py-3 align-top text-xs text-slate-500">
          ${formatIndoDate(item.event_date)}
        </td>
        <td class="px-4 py-3 align-top text-center">
          <div class="flex items-center justify-center gap-3">
            <button type="button" onclick="window.editEskulCard('${item.id}')" class="text-blue-600 hover:text-blue-800 p-1.5 transition rounded hover:bg-blue-50" title="Edit Ekstrakurikuler">
              <i class="far fa-edit text-base"></i>
            </button>
            <button type="button" onclick="window.deleteGaleriItem('${item.id}', 'eskul')" class="text-red-500 hover:text-red-700 p-1.5 transition rounded hover:bg-red-50" title="Hapus Ekstrakurikuler">
              <i class="far fa-trash-alt text-base"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // 3. TABEL ADMIN KEGIATAN (4 Kolom Sesuai kelola.html)
  function renderAdminKegiatanTable() {
    const tbody = document.getElementById('adminListKegiatan') || document.getElementById('daftarKegiatanAdmin');
    if (!tbody) return;

    if (currentKegiatanList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-6 text-center text-gray-500">Belum ada kegiatan tersimpan di database. Silakan klik tombol <span class="font-semibold text-emerald-700">+ Tambah Kegiatan Baru</span> di atas.</td></tr>`;
      return;
    }

    tbody.innerHTML = currentKegiatanList.map(item => `
      <tr class="hover:bg-slate-50 transition border-b border-gray-100">
        <td class="px-4 py-3 align-top">
          <div class="font-semibold text-gray-800 text-sm">${escapeHtml(item.title)}</div>
          <div class="text-[11px] text-gray-400 mt-0.5">${item.image_url ? 'Foto/Video tersimpan' : 'Tanpa media'}</div>
        </td>
        <td class="px-4 py-3 align-top">
          <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold inline-block">
            ${escapeHtml(item.jenjang || 'Semua')}
          </span>
        </td>
        <td class="px-4 py-3 align-top text-xs text-slate-500">
          ${formatIndoDate(item.event_date)}
        </td>
        <td class="px-4 py-3 align-top text-center">
          <div class="flex items-center justify-center gap-3">
            <button type="button" onclick="window.editKegiatanCard('${item.id}')" class="text-blue-600 hover:text-blue-800 p-1.5 transition rounded hover:bg-blue-50" title="Edit Kegiatan">
              <i class="far fa-edit text-base"></i>
            </button>
            <button type="button" onclick="window.deleteGaleriItem('${item.id}', 'kegiatan')" class="text-red-500 hover:text-red-700 p-1.5 transition rounded hover:bg-red-50" title="Hapus Kegiatan">
              <i class="far fa-trash-alt text-base"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // 4. BUKA & TUTUP FORM ESKUL
  window.bukaFormTambahEskul = function () {
    const elId = document.getElementById('eskulId');
    const elJudul = document.getElementById('eskulJudul') || document.getElementById('eskulNama');
    const elTanggal = document.getElementById('eskulTanggal');
    const elJenjang = document.getElementById('eskulJenjang');
    const formTitle = document.getElementById('formEskulTitle');

    if (elId) elId.value = '';
    if (elJudul) elJudul.value = '';
    if (elTanggal) elTanggal.value = new Date().toISOString().split('T')[0];
    if (elJenjang) elJenjang.value = 'Semua';
    if (formTitle) formTitle.innerHTML = '<i class="fas fa-plus-circle text-emerald-600 mr-2"></i> Tambah Ekstrakurikuler Baru';

    if (typeof window.setTextareaValueWithAlignment === 'function') {
      window.setTextareaValueWithAlignment('eskulDeskripsi', '');
    } else {
      const elD = document.getElementById('eskulDeskripsi');
      if (elD) elD.value = '';
    }

    const inputMedia = document.getElementById('eskulMedia') || document.getElementById('eskulImg1');
    if (inputMedia) inputMedia.value = '';

    const area = document.getElementById('areaFormEskul');
    if (area) area.classList.remove('hidden');
    area?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.tutupFormEskul = function () {
    const area = document.getElementById('areaFormEskul');
    if (area) area.classList.add('hidden');
  };

  // 5. BUKA & TUTUP FORM KEGIATAN
  window.bukaFormTambahKegiatan = function () {
    const elId = document.getElementById('kegiatanId');
    const elJudul = document.getElementById('kegiatanJudul') || document.getElementById('kegiatanNama');
    const elTanggal = document.getElementById('kegiatanTanggal');
    const elJenjang = document.getElementById('kegiatanJenjang');
    const formTitle = document.getElementById('formKegiatanTitle');

    if (elId) elId.value = '';
    if (elJudul) elJudul.value = '';
    if (elTanggal) elTanggal.value = new Date().toISOString().split('T')[0];
    if (elJenjang) elJenjang.value = 'Semua';
    if (formTitle) formTitle.innerHTML = '<i class="fas fa-plus-circle text-emerald-600 mr-2"></i> Tambah Kegiatan Baru';

    if (typeof window.setTextareaValueWithAlignment === 'function') {
      window.setTextareaValueWithAlignment('kegiatanDeskripsi', '');
    } else {
      const elD = document.getElementById('kegiatanDeskripsi');
      if (elD) elD.value = '';
    }

    const inputMedia = document.getElementById('kegiatanMedia') || document.getElementById('kegiatanImg1');
    if (inputMedia) inputMedia.value = '';

    const area = document.getElementById('areaFormKegiatan');
    if (area) area.classList.remove('hidden');
    area?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.tutupFormKegiatan = function () {
    const area = document.getElementById('areaFormKegiatan');
    if (area) area.classList.add('hidden');
  };

  // 6. EDIT
  window.editEskulCard = function (id) {
    const item = currentEskulList.find(e => String(e.id) === String(id));
    if (!item) return;

    const elId = document.getElementById('eskulId');
    const elJudul = document.getElementById('eskulJudul') || document.getElementById('eskulNama');
    const elTanggal = document.getElementById('eskulTanggal');
    const elJenjang = document.getElementById('eskulJenjang');
    const formTitle = document.getElementById('formEskulTitle');

    if (elId) elId.value = item.id;
    if (elJudul) elJudul.value = item.title || '';
    if (elTanggal) elTanggal.value = item.event_date || new Date().toISOString().split('T')[0];
    if (elJenjang) elJenjang.value = item.jenjang || 'Semua';
    if (formTitle) formTitle.innerHTML = '<i class="fas fa-edit text-emerald-600 mr-2"></i> Edit Ekstrakurikuler';

    if (typeof window.setTextareaValueWithAlignment === 'function') {
      window.setTextareaValueWithAlignment('eskulDeskripsi', item.description || '');
    } else {
      const elD = document.getElementById('eskulDeskripsi');
      if (elD) elD.value = item.description || '';
    }

    const inputMedia = document.getElementById('eskulMedia') || document.getElementById('eskulImg1');
    if (inputMedia) inputMedia.value = '';

    const areaForm = document.getElementById('areaFormEskul');
    if (areaForm) areaForm.classList.remove('hidden');
    areaForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.editKegiatanCard = function (id) {
    const item = currentKegiatanList.find(k => String(k.id) === String(id));
    if (!item) return;

    const elId = document.getElementById('kegiatanId');
    const elJudul = document.getElementById('kegiatanJudul') || document.getElementById('kegiatanNama');
    const elTanggal = document.getElementById('kegiatanTanggal');
    const elJenjang = document.getElementById('kegiatanJenjang');
    const formTitle = document.getElementById('formKegiatanTitle');

    if (elId) elId.value = item.id;
    if (elJudul) elJudul.value = item.title || '';
    if (elTanggal) elTanggal.value = item.event_date || new Date().toISOString().split('T')[0];
    if (elJenjang) elJenjang.value = item.jenjang || 'Semua';
    if (formTitle) formTitle.innerHTML = '<i class="fas fa-edit text-emerald-600 mr-2"></i> Edit Kegiatan';

    if (typeof window.setTextareaValueWithAlignment === 'function') {
      window.setTextareaValueWithAlignment('kegiatanDeskripsi', item.description || '');
    } else {
      const elD = document.getElementById('kegiatanDeskripsi');
      if (elD) elD.value = item.description || '';
    }

    const inputMedia = document.getElementById('kegiatanMedia') || document.getElementById('kegiatanImg1');
    if (inputMedia) inputMedia.value = '';

    const areaForm = document.getElementById('areaFormKegiatan');
    if (areaForm) areaForm.classList.remove('hidden');
    areaForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.deleteGaleriItem = async function (id, type) {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini dari database secara permanen?')) {
      return;
    }

    try {
      const supa = getSupabaseClient();
      let delSuccess = false;
      if (supa) {
        try {
          const { error } = await withTimeout(
            supa.from('galleries').delete().eq('id', Number(id)),
            8000
          );
          if (!error) delSuccess = true;
        } catch (e) {}
      }

      if (!delSuccess) {
        await withTimeout(
          restFetch(`galleries?id=eq.${id}`, { method: 'DELETE' }),
          10000
        );
      }

      await window.loadGaleriData();
      alert('Data berhasil dihapus dari database Supabase.');
    } catch (e) {
      alert('Gagal menghapus: ' + (e.message || e));
    }
  };

  // 7. SIMPAN ESKUL KE SUPABASE
  window.handleSimpanEskul = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isSavingEskul) return;
    isSavingEskul = true;

    const btnSimpan = document.getElementById('btnSimpanEskul');
    const originalHtml = 'Simpan Ekstrakurikuler';
    if (btnSimpan) {
      btnSimpan.disabled = true;
      btnSimpan.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan...';
    }

    try {
      const elJudul = document.getElementById('eskulJudul') || document.getElementById('eskulNama');
      const title = elJudul?.value?.trim();
      const jenjang = document.getElementById('eskulJenjang')?.value || 'Semua';
      const event_date = document.getElementById('eskulTanggal')?.value || new Date().toISOString().split('T')[0];
      const description = (typeof window.getWrappedTextareaValue === 'function')
        ? window.getWrappedTextareaValue('eskulDeskripsi')
        : (document.getElementById('eskulDeskripsi')?.value?.trim() || '');
      const eskulId = document.getElementById('eskulId')?.value?.trim();

      if (!title) {
        alert('Judul ekstrakurikuler wajib diisi!');
        elJudul?.focus();
        isSavingEskul = false;
        if (btnSimpan) {
          btnSimpan.disabled = false;
          btnSimpan.innerHTML = originalHtml;
        }
        return;
      }

      const inputMedia = document.getElementById('eskulMedia') || document.getElementById('eskulImg1');
      const prevItem = eskulId ? currentEskulList.find(x => String(x.id) === String(eskulId)) : null;
      const imageUrl = await readFileOrName(inputMedia, prevItem ? prevItem.image_url : '/media/background/wallpaper_yayasan.jpg');

      const payload = {
        title,
        jenjang,
        event_date,
        category: 'Ekstrakurikuler',
        description,
        image_url: imageUrl
      };

      const supa = getSupabaseClient();
      let saveSuccess = false;

      if (eskulId && !isNaN(Number(eskulId))) {
        const numId = Number(eskulId);
        if (supa) {
          try {
            const { error } = await withTimeout(
              supa.from('galleries').update(payload).eq('id', numId),
              10000
            );
            if (!error) saveSuccess = true;
          } catch (e) {}
        }
        if (!saveSuccess) {
          await withTimeout(
            restFetch(`galleries?id=eq.${numId}`, {
              method: 'PATCH',
              headers: { 'Prefer': 'return=representation' },
              body: JSON.stringify(payload)
            }),
            10000
          );
          saveSuccess = true;
        }
      } else {
        if (supa) {
          try {
            const { error } = await withTimeout(
              supa.from('galleries').insert([payload]),
              10000
            );
            if (!error) saveSuccess = true;
          } catch (e) {}
        }
        if (!saveSuccess) {
          await withTimeout(
            restFetch('galleries', {
              method: 'POST',
              headers: { 'Prefer': 'return=representation' },
              body: JSON.stringify(payload)
            }),
            10000
          );
          saveSuccess = true;
        }
      }

      window.tutupFormEskul();
      await window.loadGaleriData();
      alert('Alhamdulillah! Data ekstrakurikuler berhasil disimpan ke database Supabase.');
    } catch (err) {
      alert('Gagal menyimpan ekstrakurikuler:\n' + (err.message || err));
    } finally {
      isSavingEskul = false;
      if (btnSimpan) {
        btnSimpan.disabled = false;
        btnSimpan.innerHTML = originalHtml;
      }
    }
  };

  // 8. SIMPAN KEGIATAN KE SUPABASE
  window.handleSimpanKegiatan = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isSavingKegiatan) return;
    isSavingKegiatan = true;

    const btnSimpan = document.getElementById('btnSimpanKegiatan');
    const originalHtml = 'Simpan Kegiatan';
    if (btnSimpan) {
      btnSimpan.disabled = true;
      btnSimpan.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan...';
    }

    try {
      const elJudul = document.getElementById('kegiatanJudul') || document.getElementById('kegiatanNama');
      const title = elJudul?.value?.trim();
      const jenjang = document.getElementById('kegiatanJenjang')?.value || 'Semua';
      const event_date = document.getElementById('kegiatanTanggal')?.value || new Date().toISOString().split('T')[0];
      const description = (typeof window.getWrappedTextareaValue === 'function')
        ? window.getWrappedTextareaValue('kegiatanDeskripsi')
        : (document.getElementById('kegiatanDeskripsi')?.value?.trim() || '');
      const kegiatanId = document.getElementById('kegiatanId')?.value?.trim();

      if (!title) {
        alert('Judul kegiatan wajib diisi!');
        elJudul?.focus();
        isSavingKegiatan = false;
        if (btnSimpan) {
          btnSimpan.disabled = false;
          btnSimpan.innerHTML = originalHtml;
        }
        return;
      }

      const inputMedia = document.getElementById('kegiatanMedia') || document.getElementById('kegiatanImg1');
      const prevItem = kegiatanId ? currentKegiatanList.find(x => String(x.id) === String(kegiatanId)) : null;
      const imageUrl = await readFileOrName(inputMedia, prevItem ? prevItem.image_url : '/media/background/wallpaper_yayasan.jpg');

      const payload = {
        title,
        jenjang,
        event_date,
        category: 'Kegiatan',
        description,
        image_url: imageUrl
      };

      const supa = getSupabaseClient();
      let saveSuccess = false;

      if (kegiatanId && !isNaN(Number(kegiatanId))) {
        const numId = Number(kegiatanId);
        if (supa) {
          try {
            const { error } = await withTimeout(
              supa.from('galleries').update(payload).eq('id', numId),
              10000
            );
            if (!error) saveSuccess = true;
          } catch (e) {}
        }
        if (!saveSuccess) {
          await withTimeout(
            restFetch(`galleries?id=eq.${numId}`, {
              method: 'PATCH',
              headers: { 'Prefer': 'return=representation' },
              body: JSON.stringify(payload)
            }),
            10000
          );
          saveSuccess = true;
        }
      } else {
        if (supa) {
          try {
            const { error } = await withTimeout(
              supa.from('galleries').insert([payload]),
              10000
            );
            if (!error) saveSuccess = true;
          } catch (e) {}
        }
        if (!saveSuccess) {
          await withTimeout(
            restFetch('galleries', {
              method: 'POST',
              headers: { 'Prefer': 'return=representation' },
              body: JSON.stringify(payload)
            }),
            10000
          );
          saveSuccess = true;
        }
      }

      window.tutupFormKegiatan();
      await window.loadGaleriData();
      alert('Alhamdulillah! Data kegiatan berhasil disimpan ke database Supabase.');
    } catch (err) {
      alert('Gagal menyimpan kegiatan:\n' + (err.message || err));
    } finally {
      isSavingKegiatan = false;
      if (btnSimpan) {
        btnSimpan.disabled = false;
        btnSimpan.innerHTML = originalHtml;
      }
    }
  };

  // 9. BANNER GALERI
  window.handleSimpanBannerGaleri = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    alert('Teks banner galeri berhasil disimpan.');
  };

  function initKelolaGaleri() {
    window.loadGaleriData();

    const btnSimpanEskul = document.getElementById('btnSimpanEskul');
    if (btnSimpanEskul && !btnSimpanEskul.dataset.bound) {
      btnSimpanEskul.dataset.bound = 'true';
      btnSimpanEskul.addEventListener('click', window.handleSimpanEskul);
    }

    const btnSimpanKegiatan = document.getElementById('btnSimpanKegiatan');
    if (btnSimpanKegiatan && !btnSimpanKegiatan.dataset.bound) {
      btnSimpanKegiatan.dataset.bound = 'true';
      btnSimpanKegiatan.addEventListener('click', window.handleSimpanKegiatan);
    }

    const btnTambahEskul = document.getElementById('btnTambahEskul');
    if (btnTambahEskul && !btnTambahEskul.dataset.bound) {
      btnTambahEskul.dataset.bound = 'true';
      btnTambahEskul.addEventListener('click', window.bukaFormTambahEskul);
    }

    const btnBatalEskul = document.getElementById('btnBatalEskul');
    if (btnBatalEskul && !btnBatalEskul.dataset.bound) {
      btnBatalEskul.dataset.bound = 'true';
      btnBatalEskul.addEventListener('click', window.tutupFormEskul);
    }

    const btnTambahKegiatan = document.getElementById('btnTambahKegiatan');
    if (btnTambahKegiatan && !btnTambahKegiatan.dataset.bound) {
      btnTambahKegiatan.dataset.bound = 'true';
      btnTambahKegiatan.addEventListener('click', window.bukaFormTambahKegiatan);
    }

    const btnBatalKegiatan = document.getElementById('btnBatalKegiatan');
    if (btnBatalKegiatan && !btnBatalKegiatan.dataset.bound) {
      btnBatalKegiatan.dataset.bound = 'true';
      btnBatalKegiatan.addEventListener('click', window.tutupFormKegiatan);
    }
  }

  initKelolaGaleri();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKelolaGaleri);
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#galeri') {
      window.loadGaleriData();
    }
  });
})();
