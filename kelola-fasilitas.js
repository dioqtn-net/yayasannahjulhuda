/**
 * =======================================================================
 * KELOLA FASILITAS (PANEL ADMIN) - 100% PURE SUPABASE
 * Aturan Mutlak: NO localStorage.getItem / NO localStorage.setItem
 * Fitur: Full CRUD Facilities, Auto-Reset Finally, 15s Timeout & Native REST Fallback
 * Layout: 3 Kolom Sesuai Desain Acuan (Nama Fasilitas, Deskripsi Singkat, Aksi)
 * =======================================================================
 */

(function () {
  console.log("[Kelola Fasilitas] Skrip kelola-fasilitas.js dimuat...");

  const SUPABASE_URL = "https://lrorriksjooxrpoihfge.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

  let isSaving = false;
  let isSavingBanner = false;
  let currentFasilitasList = [];
  let editingImages = [];
  const BTN_FASILITAS_HTML = `<i class="fas fa-save"></i> <span>Simpan Fasilitas</span>`;
  const BTN_BANNER_HTML = `Simpan Banner Fasilitas`;

  // Bersihkan cache lokal jika ada sisa
  try {
    localStorage.removeItem('cmsData_fasilitas_list');
    localStorage.removeItem('cmsData_fasBanner');
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
        console.warn("[Kelola Fasilitas] createClient warning:", err);
      }
    }
    return null;
  }

  // withTimeout aman untuk thenable (PostgrestFilterBuilder) menggunakan Promise.resolve
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

  // 1. LOAD DAFTAR FASILITAS DARI SUPABASE
  window.loadFasilitasList = async function () {
    console.log("[Kelola Fasilitas] Memuat daftar fasilitas dari Supabase...");
    try {
      let dbData = null;
      const supa = getSupabaseClient();
      if (supa) {
        try {
          const { data, error } = await withTimeout(
            supa.from('facilities').select('*').order('id', { ascending: true }),
            8000
          );
          if (!error && Array.isArray(data)) dbData = data;
        } catch (e) {
          console.warn("[Kelola Fasilitas] Supabase client SELECT warning:", e);
        }
      }

      // REST Fallback (tanpa query param acak agar tidak memicu PGRST100)
      if (!dbData) {
        try {
          dbData = await withTimeout(restFetch('facilities?select=*&order=id.asc'), 8000);
        } catch (e) {
          console.warn("[Kelola Fasilitas] REST fetch warning:", e);
        }
      }

      if (dbData && Array.isArray(dbData)) {
        currentFasilitasList = dbData;
      } else {
        currentFasilitasList = [];
      }

      // 1. Tampilkan data banner jika row id: 0 ada
      const banner = currentFasilitasList.find(f => Number(f.id) === 0);
      if (banner) {
        const bTitle = document.getElementById('fasBannerTitle');
        const bDesc = document.getElementById('fasBannerDesc');
        if (bTitle && banner.name) bTitle.value = banner.name;
        if (bDesc && banner.description) {
          if (typeof window.setTextareaValueWithAlignment === 'function') {
            window.setTextareaValueWithAlignment('fasBannerDesc', banner.description);
          } else {
            bDesc.value = banner.description;
          }
        }
      }

      renderAdminTable();
    } catch (e) {
      console.error("[Kelola Fasilitas] Gagal memuat daftar fasilitas:", e);
    }
  };

  function renderAdminTable() {
    const tbody = document.getElementById('adminListFasilitas') || document.getElementById('daftarFasilitasAdmin');
    if (!tbody) {
      console.warn("[Kelola Fasilitas] Elemen tbody adminListFasilitas tidak ditemukan di DOM!");
      return;
    }

    // Filter baris fasilitas aktual (id > 0), baris id: 0 adalah Banner Fasilitas
    const facilities = currentFasilitasList.filter(item => Number(item.id) > 0);

    if (facilities.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" class="px-6 py-8 text-center text-gray-500">
            Belum ada fasilitas tersimpan di database. Silakan klik tombol <span class="font-semibold text-green-700">+ Tambah Fasilitas Baru</span> di atas.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = facilities.map(item => {
      const images = (Array.isArray(item.images) && item.images.length > 0)
        ? item.images
        : (item.image_url ? [item.image_url] : []);

      return `
        <tr class="hover:bg-slate-50 transition border-b border-gray-100">
          <td class="px-4 py-3 align-top">
            <div class="font-semibold text-gray-800 text-sm">${escapeHtml(item.name)}</div>
            <div class="text-[11px] text-gray-400 mt-0.5">Foto: ${images.length} file</div>
          </td>
          <td class="px-4 py-3 align-top">
            <div class="text-xs text-gray-600 line-clamp-2 max-w-xl font-mono">${escapeHtml(item.description || '-')}</div>
          </td>
          <td class="px-4 py-3 align-top text-center">
            <div class="flex items-center justify-center gap-3">
              <button type="button" onclick="window.editFasilitasCard('${item.id}')" class="text-blue-600 hover:text-blue-800 p-1.5 transition rounded hover:bg-blue-50" title="Edit Fasilitas">
                <i class="far fa-edit text-base"></i>
              </button>
              <button type="button" onclick="window.deleteFasilitasCard('${item.id}')" class="text-red-500 hover:text-red-700 p-1.5 transition rounded hover:bg-red-50" title="Hapus Fasilitas">
                <i class="far fa-trash-alt text-base"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 2. BUKA & TUTUP FORM FASILITAS
  window.bukaFormTambahFasilitas = function () {
    const elId = document.getElementById('fasId');
    const elNama = document.getElementById('fasNama');
    const formTitle = document.getElementById('formFasTitle');

    if (elId) elId.value = '';
    if (elNama) elNama.value = '';
    if (formTitle) formTitle.innerHTML = '<i class="fas fa-plus-circle text-emerald-600"></i> <span>Tambah Fasilitas Baru</span>';

    if (typeof window.setTextareaValueWithAlignment === 'function') {
      window.setTextareaValueWithAlignment('fasDeskripsi', '');
    } else {
      const elDesc = document.getElementById('fasDeskripsi');
      if (elDesc) elDesc.value = '';
    }

    ['fasImg1', 'fasImg2', 'fasImg3'].forEach(inpId => {
      const el = document.getElementById(inpId);
      if (el) el.value = '';
    });

    editingImages = [];
    const areaForm = document.getElementById('areaFormFasilitas');
    if (areaForm) {
      areaForm.classList.remove('hidden');
      areaForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  window.tutupFormFasilitas = function () {
    const areaForm = document.getElementById('areaFormFasilitas');
    if (areaForm) areaForm.classList.add('hidden');
  };

  // 3. EDIT FASILITAS
  window.editFasilitasCard = function (id) {
    const item = currentFasilitasList.find(f => String(f.id) === String(id));
    if (!item) return;

    const elId = document.getElementById('fasId');
    const elNama = document.getElementById('fasNama');
    const formTitle = document.getElementById('formFasTitle');

    if (elId) elId.value = item.id;
    if (elNama) elNama.value = item.name || '';
    if (formTitle) formTitle.innerHTML = `<i class="fas fa-edit text-blue-600"></i> <span>Edit Fasilitas: ${escapeHtml(item.name || '')}</span>`;

    if (typeof window.setTextareaValueWithAlignment === 'function') {
      window.setTextareaValueWithAlignment('fasDeskripsi', item.description || '');
    } else {
      const elDesc = document.getElementById('fasDeskripsi');
      if (elDesc) elDesc.value = item.description || '';
    }

    ['fasImg1', 'fasImg2', 'fasImg3'].forEach(inpId => {
      const el = document.getElementById(inpId);
      if (el) el.value = '';
    });

    editingImages = (Array.isArray(item.images) && item.images.length > 0)
      ? item.images
      : (item.image_url ? [item.image_url] : []);

    const areaForm = document.getElementById('areaFormFasilitas');
    if (areaForm) {
      areaForm.classList.remove('hidden');
      areaForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Aliases untuk kompatibilitas
  window.cmsEditFasilitas = window.editFasilitasCard;
  window.cmsHapusFasilitas = window.deleteFasilitasCard;

  // 4. HAPUS FASILITAS DARI SUPABASE
  window.deleteFasilitasCard = async function (id) {
    const item = currentFasilitasList.find(f => String(f.id) === String(id));
    const nama = item ? item.name : 'fasilitas ini';
    if (!confirm(`Apakah Anda yakin ingin menghapus "${nama}" secara permanen dari database?`)) {
      return;
    }

    try {
      const supa = getSupabaseClient();
      let delSuccess = false;
      if (supa) {
        try {
          const { error } = await withTimeout(
            supa.from('facilities').delete().eq('id', Number(id)),
            8000
          );
          if (!error) delSuccess = true;
        } catch (e) {
          console.warn("[Kelola Fasilitas] Supabase client DELETE warning:", e);
        }
      }

      if (!delSuccess) {
        await withTimeout(
          restFetch(`facilities?id=eq.${id}`, { method: 'DELETE' }),
          10000
        );
      }

      await window.loadFasilitasList();
      alert(`Fasilitas "${nama}" berhasil dihapus dari database.`);
    } catch (e) {
      console.error("[Kelola Fasilitas] Gagal menghapus:", e);
      alert('Gagal menghapus fasilitas: ' + (e.message || e));
    }
  };

  // Helper membaca dan mengompresi file gambar
  async function readFileOrName(inputEl, fallback) {
    if (!inputEl) return fallback || '';
    if (typeof window.processImageField === 'function') {
      return await window.processImageField(inputEl, fallback, {
        maxWidth: 1600,
        maxHeight: 1200,
        quality: 0.85,
        pathPrefix: 'fasilitas'
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

  // 5. SIMPAN KARTU FASILITAS KE SUPABASE
  window.handleSimpanCardFasilitas = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isSaving) return;
    isSaving = true;

    const btnSimpan = document.getElementById('btnSimpanCardFasilitas');
    if (btnSimpan) {
      btnSimpan.disabled = true;
      btnSimpan.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Mengompres foto & menyimpan...';
    }

    try {
      const nama = document.getElementById('fasNama')?.value?.trim();
      const deskripsi = (typeof window.getWrappedTextareaValue === 'function')
        ? window.getWrappedTextareaValue('fasDeskripsi')
        : (document.getElementById('fasDeskripsi')?.value?.trim() || '');
      const fasId = document.getElementById('fasId')?.value?.trim();

      if (!nama) {
        alert('Nama fasilitas wajib diisi!');
        document.getElementById('fasNama')?.focus();
        return;
      }

      const inp1 = document.getElementById('fasImg1');
      const inp2 = document.getElementById('fasImg2');
      const inp3 = document.getElementById('fasImg3');

      const [img1, img2, img3] = await Promise.all([
        readFileOrName(inp1, editingImages[0]),
        readFileOrName(inp2, editingImages[1]),
        readFileOrName(inp3, editingImages[2])
      ]);

      const images = [img1, img2, img3].filter(img => img && img.trim() !== '');
      if (images.length === 0) {
        images.push('/media/background/wallpaper_yayasan.jpg');
      }

      const payload = {
        name: nama,
        description: deskripsi,
        image_url: images[0] || '',
        images: images
      };

      console.log('[Kelola Fasilitas] Menyimpan ke Supabase...', { fasId, payload });

      const supa = getSupabaseClient();
      let saveSuccess = false;

      if (fasId && !isNaN(Number(fasId))) {
        // UPDATE
        const numId = Number(fasId);
        if (supa) {
          try {
            const { error } = await withTimeout(
              supa.from('facilities').update(payload).eq('id', numId),
              10000
            );
            if (!error) saveSuccess = true;
          } catch (e) {
            console.warn("[Kelola Fasilitas] Supabase update warning:", e);
          }
        }
        if (!saveSuccess) {
          await withTimeout(
            restFetch(`facilities?id=eq.${numId}`, {
              method: 'PATCH',
              headers: { 'Prefer': 'return=representation' },
              body: JSON.stringify(payload)
            }),
            10000
          );
          saveSuccess = true;
        }
      } else {
        // CREATE
        if (supa) {
          try {
            const { error } = await withTimeout(
              supa.from('facilities').insert([payload]),
              10000
            );
            if (!error) saveSuccess = true;
          } catch (e) {
            console.warn("[Kelola Fasilitas] Supabase insert warning:", e);
          }
        }
        if (!saveSuccess) {
          await withTimeout(
            restFetch('facilities', {
              method: 'POST',
              headers: { 'Prefer': 'return=representation' },
              body: JSON.stringify(payload)
            }),
            10000
          );
          saveSuccess = true;
        }
      }

      // Bersihkan form
      document.getElementById('fasId').value = '';
      document.getElementById('fasNama').value = '';
      if (typeof window.setTextareaValueWithAlignment === 'function') {
        window.setTextareaValueWithAlignment('fasDeskripsi', '');
      } else {
        const elDesc = document.getElementById('fasDeskripsi');
        if (elDesc) elDesc.value = '';
      }
      if (inp1) inp1.value = '';
      if (inp2) inp2.value = '';
      if (inp3) inp3.value = '';
      editingImages = [];

      window.tutupFormFasilitas();

      await window.loadFasilitasList();
      alert('Alhamdulillah! Data fasilitas berhasil disimpan ke database Supabase.');
    } catch (error) {
      console.error('[Kelola Fasilitas] Gagal menyimpan:', error);
      alert('Gagal menyimpan fasilitas:\n' + (error.message || error));
    } finally {
      isSaving = false;
      if (btnSimpan) {
        btnSimpan.disabled = false;
        btnSimpan.innerHTML = BTN_FASILITAS_HTML;
      }
    }
  };

  // 6. BANNER FASILITAS (Disimpan ke row id: 0 tabel facilities)
  window.handleSimpanBannerFasilitas = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isSavingBanner) return;
    isSavingBanner = true;

    const btn = document.getElementById('btnSimpanBannerFasilitas');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan banner...';
    }

    try {
      const title = document.getElementById('fasBannerTitle')?.value?.trim() || 'Fasilitas Yayasan';
      const desc = (typeof window.getWrappedTextareaValue === 'function')
        ? window.getWrappedTextareaValue('fasBannerDesc')
        : (document.getElementById('fasBannerDesc')?.value?.trim() || '');

      const payload = {
        id: 0,
        name: title,
        description: desc,
        images: []
      };

      const supa = getSupabaseClient();
      let ok = false;
      if (supa) {
        try {
          const { error } = await withTimeout(
            supa.from('facilities').upsert(payload, { onConflict: 'id' }),
            8000
          );
          if (!error) ok = true;
        } catch (err) {
          console.warn("[Kelola Fasilitas] Banner upsert client warning:", err);
        }
      }
      if (!ok) {
        await withTimeout(
          restFetch('facilities?on_conflict=id', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
            body: JSON.stringify(payload)
          }),
          10000
        );
      }

      alert('Alhamdulillah! Banner fasilitas berhasil disimpan.');
    } catch (err) {
      console.error("[Kelola Fasilitas] Gagal menyimpan banner:", err);
      alert('Gagal menyimpan banner fasilitas:\n' + (err.message || err));
    } finally {
      isSavingBanner = false;
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = BTN_BANNER_HTML;
      }
    }
  };

  function initKelolaFasilitas() {
    window.loadFasilitasList();

    // 1. Tombol Simpan Fasilitas Form
    const btnSimpan = document.getElementById('btnSimpanCardFasilitas');
    if (btnSimpan && !btnSimpan.dataset.bound) {
      btnSimpan.dataset.bound = 'true';
      btnSimpan.addEventListener('click', window.handleSimpanCardFasilitas);
    }

    // 2. Tombol Simpan Banner Fasilitas
    const btnBanner = document.getElementById('btnSimpanBannerFasilitas');
    if (btnBanner && !btnBanner.dataset.bound) {
      btnBanner.dataset.bound = 'true';
      btnBanner.addEventListener('click', window.handleSimpanBannerFasilitas);
    }

    // 3. Tombol Tambah Fasilitas Baru
    const btnTambah = document.getElementById('btnTambahFasilitas');
    if (btnTambah && !btnTambah.dataset.bound) {
      btnTambah.dataset.bound = 'true';
      btnTambah.addEventListener('click', window.bukaFormTambahFasilitas);
    }

    // 4. Tombol Batal Fasilitas
    const btnBatal = document.getElementById('btnBatalFasilitas');
    if (btnBatal && !btnBatal.dataset.bound) {
      btnBatal.dataset.bound = 'true';
      btnBatal.addEventListener('click', window.tutupFormFasilitas);
    }
  }

  // Eksekusi langsung
  initKelolaFasilitas();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKelolaFasilitas);
  }

  // Reload saat navigasi hash berubah ke #fasilitas
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#fasilitas') {
      window.loadFasilitasList();
    }
  });
})();
