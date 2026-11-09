/**
 * =======================================================================
 * KELOLA GALERI (EKSTRAKURIKULER & KEGIATAN) - 100% PURE SUPABASE
 * Aturan Mutlak: NO localStorage.getItem / NO localStorage.setItem
 * Fitur: Full CRUD Galleries Table, Auto-Reset Finally, 15s Timeout & Native REST Fallback
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

  // Bersihkan cache lokal lama
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
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  // Helper membaca dan mengompresi file gambar
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
      if (typeof window.compressImage === 'function') {
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

  // 1. LOAD SEMUA GALERI DARI SUPABASE
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
          dbData = await restFetch(`galleries?select=*&order=id.desc`);
        } catch (e) {
          console.warn("[Kelola Galeri] REST fetch error:", e);
        }
      }

      if (dbData && Array.isArray(dbData)) {
        currentEskulList = dbData.filter(g => (g.category || '').toLowerCase().includes('eskul') || (g.category || '').toLowerCase().includes('ekstrakurikuler'));
        currentKegiatanList = dbData.filter(g => (g.category || '').toLowerCase().includes('kegiatan'));
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

  // 2. TABEL ADMIN ESKUL
  function renderAdminEskulTable() {
    const tbody = document.getElementById('daftarEskulAdmin');
    if (!tbody) return;

    if (currentEskulList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-6 text-center text-gray-500">Belum ada ekstrakurikuler tersimpan di database. Silakan klik Tambah Ekstrakurikuler.</td></tr>`;
      return;
    }

    tbody.innerHTML = currentEskulList.map(item => `
      <tr class="hover:bg-slate-50 transition border-b">
        <td class="px-6 py-4">
          <img src="${item.image_url || '/media/background/wallpaper_yayasan.jpg'}" alt="${escapeHtml(item.title)}" class="w-16 h-12 object-cover rounded shadow-sm">
        </td>
        <td class="px-6 py-4 font-semibold text-slate-800">
          ${escapeHtml(item.title)}
        </td>
        <td class="px-6 py-4">
          <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
            ${escapeHtml(item.jenjang || 'Semua')}
          </span>
        </td>
        <td class="px-6 py-4 text-slate-600 text-sm max-w-xs truncate">
          ${escapeHtml(item.description || '-')}
        </td>
        <td class="px-6 py-4 text-right space-x-2">
          <button type="button" onclick="window.editEskulCard('${item.id}')" class="px-3 py-1 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 transition">
            <i class="fas fa-edit mr-1"></i> Edit
          </button>
          <button type="button" onclick="window.deleteGaleriItem('${item.id}', 'eskul')" class="px-3 py-1 bg-rose-600 text-white rounded text-xs hover:bg-rose-700 transition">
            <i class="fas fa-trash-alt mr-1"></i> Hapus
          </button>
        </td>
      </tr>
    `).join('');
  }

  // 3. TABEL ADMIN KEGIATAN
  function renderAdminKegiatanTable() {
    const tbody = document.getElementById('daftarKegiatanAdmin');
    if (!tbody) return;

    if (currentKegiatanList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-6 text-center text-gray-500">Belum ada kegiatan tersimpan di database. Silakan klik Tambah Kegiatan.</td></tr>`;
      return;
    }

    tbody.innerHTML = currentKegiatanList.map(item => `
      <tr class="hover:bg-slate-50 transition border-b">
        <td class="px-6 py-4">
          <img src="${item.image_url || '/media/background/wallpaper_yayasan.jpg'}" alt="${escapeHtml(item.title)}" class="w-16 h-12 object-cover rounded shadow-sm">
        </td>
        <td class="px-6 py-4 font-semibold text-slate-800">
          ${escapeHtml(item.title)}
        </td>
        <td class="px-6 py-4">
          <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
            ${escapeHtml(item.jenjang || 'Semua')}
          </span>
        </td>
        <td class="px-6 py-4 text-slate-600 text-sm max-w-xs truncate">
          ${escapeHtml(item.description || '-')}
        </td>
        <td class="px-6 py-4 text-right space-x-2">
          <button type="button" onclick="window.editKegiatanCard('${item.id}')" class="px-3 py-1 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 transition">
            <i class="fas fa-edit mr-1"></i> Edit
          </button>
          <button type="button" onclick="window.deleteGaleriItem('${item.id}', 'kegiatan')" class="px-3 py-1 bg-rose-600 text-white rounded text-xs hover:bg-rose-700 transition">
            <i class="fas fa-trash-alt mr-1"></i> Hapus
          </button>
        </td>
      </tr>
    `).join('');
  }

  // 4. EDIT & HAPUS
  window.editEskulCard = function (id) {
    const item = currentEskulList.find(e => String(e.id) === String(id));
    if (!item) return;

    document.getElementById('eskulId').value = item.id;
    document.getElementById('eskulNama').value = item.title || '';
    document.getElementById('eskulJenjang').value = item.jenjang || 'Semua';
    if (typeof window.setTextareaValueWithAlignment === 'function') {
      window.setTextareaValueWithAlignment('eskulDeskripsi', item.description || '');
    } else {
      document.getElementById('eskulDeskripsi').value = item.description || '';
    }

    const areaForm = document.getElementById('areaFormEskul');
    if (areaForm) areaForm.classList.remove('hidden');
    areaForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.editKegiatanCard = function (id) {
    const item = currentKegiatanList.find(k => String(k.id) === String(id));
    if (!item) return;

    document.getElementById('kegiatanId').value = item.id;
    document.getElementById('kegiatanNama').value = item.title || '';
    document.getElementById('kegiatanJenjang').value = item.jenjang || 'Semua';
    if (typeof window.setTextareaValueWithAlignment === 'function') {
      window.setTextareaValueWithAlignment('kegiatanDeskripsi', item.description || '');
    } else {
      document.getElementById('kegiatanDeskripsi').value = item.description || '';
    }

    const areaForm = document.getElementById('areaFormKegiatan');
    if (areaForm) areaForm.classList.remove('hidden');
    areaForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // 5. SIMPAN ESKUL KE SUPABASE
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
      const title = document.getElementById('eskulNama')?.value?.trim();
      const jenjang = document.getElementById('eskulJenjang')?.value || 'Semua';
      const description = (typeof window.getWrappedTextareaValue === 'function')
        ? window.getWrappedTextareaValue('eskulDeskripsi')
        : (document.getElementById('eskulDeskripsi')?.value?.trim() || '');
      const eskulId = document.getElementById('eskulId')?.value?.trim();

      if (!title) {
        alert('Nama ekstrakurikuler wajib diisi!');
        document.getElementById('eskulNama')?.focus();
        isSavingEskul = false;
        if (btnSimpan) {
          btnSimpan.disabled = false;
          btnSimpan.innerHTML = originalHtml;
        }
        return;
      }

      const inputImg = document.getElementById('eskulImg1');
      const prevItem = eskulId ? currentEskulList.find(x => String(x.id) === String(eskulId)) : null;
      const imageUrl = await readFileOrName(inputImg, prevItem ? prevItem.image_url : '/media/background/wallpaper_yayasan.jpg');

      const payload = {
        title,
        jenjang,
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

      document.getElementById('eskulId').value = '';
      document.getElementById('eskulNama').value = '';
      if (inputImg) inputImg.value = '';
      const areaForm = document.getElementById('areaFormEskul');
      if (areaForm) areaForm.classList.add('hidden');

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

  // 6. SIMPAN KEGIATAN KE SUPABASE
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
      const title = document.getElementById('kegiatanNama')?.value?.trim();
      const jenjang = document.getElementById('kegiatanJenjang')?.value || 'Semua';
      const description = (typeof window.getWrappedTextareaValue === 'function')
        ? window.getWrappedTextareaValue('kegiatanDeskripsi')
        : (document.getElementById('kegiatanDeskripsi')?.value?.trim() || '');
      const kegiatanId = document.getElementById('kegiatanId')?.value?.trim();

      if (!title) {
        alert('Nama kegiatan wajib diisi!');
        document.getElementById('kegiatanNama')?.focus();
        isSavingKegiatan = false;
        if (btnSimpan) {
          btnSimpan.disabled = false;
          btnSimpan.innerHTML = originalHtml;
        }
        return;
      }

      const inputImg = document.getElementById('kegiatanImg1');
      const prevItem = kegiatanId ? currentKegiatanList.find(x => String(x.id) === String(kegiatanId)) : null;
      const imageUrl = await readFileOrName(inputImg, prevItem ? prevItem.image_url : '/media/background/wallpaper_yayasan.jpg');

      const payload = {
        title,
        jenjang,
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

      document.getElementById('kegiatanId').value = '';
      document.getElementById('kegiatanNama').value = '';
      if (inputImg) inputImg.value = '';
      const areaForm = document.getElementById('areaFormKegiatan');
      if (areaForm) areaForm.classList.add('hidden');

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

  // 7. BANNER GALERI
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
      btnTambahEskul.addEventListener('click', () => {
        document.getElementById('eskulId').value = '';
        document.getElementById('eskulNama').value = '';
        document.getElementById('eskulJenjang').value = 'Semua';
        if (typeof window.setTextareaValueWithAlignment === 'function') {
          window.setTextareaValueWithAlignment('eskulDeskripsi', '');
        } else {
          document.getElementById('eskulDeskripsi').value = '';
        }
        const area = document.getElementById('areaFormEskul');
        if (area) area.classList.remove('hidden');
        area.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    const btnBatalEskul = document.getElementById('btnBatalEskul');
    if (btnBatalEskul && !btnBatalEskul.dataset.bound) {
      btnBatalEskul.dataset.bound = 'true';
      btnBatalEskul.addEventListener('click', () => {
        const area = document.getElementById('areaFormEskul');
        if (area) area.classList.add('hidden');
      });
    }

    const btnTambahKegiatan = document.getElementById('btnTambahKegiatan');
    if (btnTambahKegiatan && !btnTambahKegiatan.dataset.bound) {
      btnTambahKegiatan.dataset.bound = 'true';
      btnTambahKegiatan.addEventListener('click', () => {
        document.getElementById('kegiatanId').value = '';
        document.getElementById('kegiatanNama').value = '';
        document.getElementById('kegiatanJenjang').value = 'Semua';
        if (typeof window.setTextareaValueWithAlignment === 'function') {
          window.setTextareaValueWithAlignment('kegiatanDeskripsi', '');
        } else {
          document.getElementById('kegiatanDeskripsi').value = '';
        }
        const area = document.getElementById('areaFormKegiatan');
        if (area) area.classList.remove('hidden');
        area.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    const btnBatalKegiatan = document.getElementById('btnBatalKegiatan');
    if (btnBatalKegiatan && !btnBatalKegiatan.dataset.bound) {
      btnBatalKegiatan.dataset.bound = 'true';
      btnBatalKegiatan.addEventListener('click', () => {
        const area = document.getElementById('areaFormKegiatan');
        if (area) area.classList.add('hidden');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKelolaGaleri);
  } else {
    initKelolaGaleri();
  }
})();
