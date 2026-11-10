/**
 * =======================================================================
 * KELOLA GALERI (PANEL ADMIN) - 100% PURE SUPABASE
 * Aturan: NO localStorage.getItem / NO localStorage.setItem
 * Fitur: Form Terpadu dengan Dropdown Kategori (Ekstrakurikuler vs Kegiatan),
 *        15s Timeout & Native REST Fallback, Filter & Live Search,
 *        Pencegahan Crosstalk/Duplikasi & Dukungan Responsif Mobile/Tablet.
 * =======================================================================
 */

(function () {
  console.log("[Kelola Galeri] Skrip kelola-galeri.js terpadu dimuat...");

  const SUPABASE_URL = "https://lrorriksjooxrpoihfge.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

  let isSavingGaleri = false;
  let currentGaleriList = [];
  let currentFilterKategori = 'all';
  let currentFilterJenjang = 'Semua';
  let currentSearchQuery = '';

  try {
    localStorage.removeItem('cmsData_listEskul');
    localStorage.removeItem('cmsData_listKegiatan');
    localStorage.removeItem('cmsData_galeriBanner');
    localStorage.removeItem('cmsData_galeri');
    sessionStorage.removeItem('cmsData_listEskul');
    sessionStorage.removeItem('cmsData_listKegiatan');
    sessionStorage.removeItem('cmsData_galeriBanner');
    sessionStorage.removeItem('cmsData_galeri');
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

  // Helper membaca file/media (Mendukung Gambar & Video MP4)
  async function readFileOrName(inputEl, fallback) {
    if (!inputEl) return fallback || '';
    const file = inputEl.files && inputEl.files[0];
    if (!file) return fallback || '';

    // Deteksi video MP4 -> upload langsung ke Supabase Storage (tanpa kompresi canvas)
    if (file.type.includes('video') || file.type.includes('mp4') || file.name.toLowerCase().endsWith('.mp4')) {
      try {
        const objectPath = `galeri_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.mp4`;
        const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/images/${objectPath}`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': file.type || 'video/mp4'
          },
          body: file
        });
        if (uploadRes.ok) {
          return `${SUPABASE_URL}/storage/v1/object/public/images/${objectPath}`;
        }
      } catch (err) {
        console.warn("[Kelola Galeri] Gagal upload video ke storage:", err);
      }
      return fallback || '';
    }

    // Jika gambar -> kompres dengan Canvas dan upload ke Supabase Storage
    if (typeof window.processImageField === 'function') {
      return await window.processImageField(inputEl, fallback, {
        maxWidth: 1600,
        maxHeight: 1200,
        quality: 0.85,
        pathPrefix: 'galeri'
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
          console.warn("[Kelola Galeri] Supabase client SELECT warning:", e);
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
        // Tampilkan Banner jika ada (row id: 0 atau category: 'banner')
        const banner = dbData.find(g => Number(g.id) === 0 || (g.category || '').toLowerCase() === 'banner');
        if (banner) {
          const tEl = document.getElementById('galeriBannerTitle');
          const dEl = document.getElementById('galeriBannerDesc');
          if (tEl && banner.title) tEl.value = banner.title;
          if (dEl && banner.description) {
            if (typeof window.setTextareaValueWithAlignment === 'function') {
              window.setTextareaValueWithAlignment('galeriBannerDesc', banner.description);
            } else {
              dEl.value = banner.description;
            }
          }
        }

        // Filter item galeri aktual (id > 0 dan bukan banner)
        const validItems = dbData.filter(g => Number(g.id) > 0 && (g.category || '').toLowerCase() !== 'banner');
        currentGaleriList = validItems;
      } else {
        currentGaleriList = [];
      }

      window.renderAdminGaleriTable();
    } catch (e) {
      console.error("[Kelola Galeri] Gagal memuat galeri:", e);
    }
  };

  // 2. RENDER TABEL ADMIN TERPADU
  window.renderAdminGaleriTable = function () {
    const tbody = document.getElementById('adminListGaleri') || document.getElementById('adminListEskul');
    if (!tbody) return;

    // Filter Kategori
    let filtered = currentGaleriList.filter(item => {
      const cat = (item.category || '').toLowerCase();
      const isEskul = cat.includes('ekstra') || cat.includes('eskul');
      if (currentFilterKategori === 'Ekstrakurikuler') return isEskul;
      if (currentFilterKategori === 'Kegiatan') return !isEskul;
      return true; // 'all'
    });

    // Filter Jenjang
    if (currentFilterJenjang && currentFilterJenjang !== 'Semua') {
      const targetJ = currentFilterJenjang.toLowerCase();
      filtered = filtered.filter(item => {
        const j = (item.jenjang || '').toLowerCase().trim();
        return j === targetJ || j.includes(targetJ) || j.includes('semua') || (targetJ === 'ponpes' && (j.includes('pesantren') || j.includes('assurur')));
      });
    }

    // Filter Pencarian
    if (currentSearchQuery) {
      const q = currentSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const title = (item.title || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        const jenjang = (item.jenjang || '').toLowerCase();
        return title.includes(q) || desc.includes(q) || jenjang.includes(q);
      });
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="px-6 py-10 text-center text-slate-500">
            <div class="w-12 h-12 mx-auto mb-2 text-slate-300 text-3xl"><i class="far fa-images"></i></div>
            <p class="font-medium text-slate-700">Belum ada dokumentasi galeri tersimpan di database.</p>
            <p class="text-xs text-slate-400 mt-1">Silakan klik tombol <button type="button" onclick="window.bukaFormTambahGaleri()" class="font-semibold text-emerald-700 underline cursor-pointer">+ Tambah Galeri Baru</button> di atas.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(item => {
      const cat = (item.category || '').toLowerCase();
      const isEskul = cat.includes('ekstra') || cat.includes('eskul');
      const isVideo = item.image_url && (item.image_url.toLowerCase().endsWith('.mp4') || item.image_url.includes('.mp4'));
      
      const mediaBadge = isVideo
        ? `<span class="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200"><i class="fas fa-video"></i> Video MP4</span>`
        : `<span class="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"><i class="far fa-image"></i> Foto</span>`;

      const categoryBadge = isEskul
        ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">Ekstrakurikuler</span>`
        : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Kegiatan</span>`;

      return `
        <tr class="hover:bg-slate-50 transition border-b border-gray-100">
          <td class="px-4 py-3 align-top">
            <div class="font-semibold text-gray-800 text-sm leading-snug">${escapeHtml(item.title)}</div>
            <div class="mt-1">${mediaBadge}</div>
          </td>
          <td class="px-3 py-3 align-top whitespace-nowrap">
            ${categoryBadge}
          </td>
          <td class="px-3 py-3 align-top whitespace-nowrap">
            <span class="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-medium border border-emerald-100 inline-block">
              ${escapeHtml(item.jenjang || 'Semua')}
            </span>
          </td>
          <td class="px-3 py-3 align-top text-xs text-slate-500 whitespace-nowrap">
            ${formatIndoDate(item.event_date || item.created_at)}
          </td>
          <td class="px-4 py-3 align-top text-center whitespace-nowrap">
            <div class="flex items-center justify-center gap-2">
              <button type="button" onclick="window.editGaleriCard('${item.id}')" aria-label="Edit Galeri" class="text-blue-600 hover:text-blue-800 p-2 transition rounded-lg hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 min-w-[36px] min-h-[36px] flex items-center justify-center" title="Edit Galeri">
                <i class="far fa-edit text-sm"></i>
              </button>
              <button type="button" onclick="window.deleteGaleriCard('${item.id}')" aria-label="Hapus Galeri" class="text-red-500 hover:text-red-700 p-2 transition rounded-lg hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 min-w-[36px] min-h-[36px] flex items-center justify-center" title="Hapus Galeri">
                <i class="far fa-trash-alt text-sm"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  };

  // 3. FILTER & SEARCH HANDLER
  window.filterAdminGaleri = function (kategori) {
    currentFilterKategori = kategori;
    const btnAll = document.getElementById('filterGaleriAll');
    const btnEskul = document.getElementById('filterGaleriEskul');
    const btnKegiatan = document.getElementById('filterGaleriKegiatan');

    [btnAll, btnEskul, btnKegiatan].forEach(btn => {
      if (btn) {
        btn.className = "filter-galeri-btn px-3 py-1.5 rounded-md font-medium text-slate-600 hover:text-emerald-800 transition";
      }
    });

    if (kategori === 'all' && btnAll) {
      btnAll.className = "filter-galeri-btn px-3 py-1.5 rounded-md font-semibold bg-white text-emerald-800 shadow-xs transition";
    } else if (kategori === 'Ekstrakurikuler' && btnEskul) {
      btnEskul.className = "filter-galeri-btn px-3 py-1.5 rounded-md font-semibold bg-white text-emerald-800 shadow-xs transition";
    } else if (kategori === 'Kegiatan' && btnKegiatan) {
      btnKegiatan.className = "filter-galeri-btn px-3 py-1.5 rounded-md font-semibold bg-white text-emerald-800 shadow-xs transition";
    }

    window.renderAdminGaleriTable();
  };

  window.handleSearchAdminGaleri = function (val) {
    currentSearchQuery = val || '';
    window.renderAdminGaleriTable();
  };

  window.handleFilterGaleriJenjang = function (val) {
    currentFilterJenjang = val || 'Semua';
    window.renderAdminGaleriTable();
  };

  // 4. BUKA & TUTUP FORM TERPADU
  window.bukaFormTambahGaleri = function (kategoriDefault = 'Ekstrakurikuler') {
    const elId = document.getElementById('galeriId');
    const elJudul = document.getElementById('galeriJudul');
    const elTanggal = document.getElementById('galeriTanggal');
    const elKategori = document.getElementById('galeriKategori');
    const elJenjang = document.getElementById('galeriJenjang');
    const formTitle = document.getElementById('formGaleriTitle');

    if (elId) elId.value = '';
    if (elJudul) elJudul.value = '';
    if (elTanggal) elTanggal.value = new Date().toISOString().split('T')[0];
    if (elKategori) elKategori.value = kategoriDefault;
    if (elJenjang) elJenjang.value = 'Semua';
    if (formTitle) formTitle.innerHTML = '<i class="fas fa-plus-circle text-emerald-600 mr-2"></i> Tambah Dokumentasi Galeri Baru';

    if (typeof window.setTextareaValueWithAlignment === 'function') {
      window.setTextareaValueWithAlignment('galeriDeskripsi', '');
    } else {
      const elD = document.getElementById('galeriDeskripsi');
      if (elD) elD.value = '';
    }

    const inputMedia = document.getElementById('galeriMedia');
    if (inputMedia) inputMedia.value = '';

    const area = document.getElementById('areaFormGaleri');
    if (area) area.classList.remove('hidden');
    area?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof window.initTextareaAlignmentTools === 'function') {
      window.initTextareaAlignmentTools();
    }
  };

  window.tutupFormGaleri = function () {
    const area = document.getElementById('areaFormGaleri');
    if (area) area.classList.add('hidden');
  };

  // 5. EDIT FORM TERPADU
  window.editGaleriCard = function (id) {
    const item = currentGaleriList.find(g => String(g.id) === String(id));
    if (!item) return;

    const elId = document.getElementById('galeriId');
    const elJudul = document.getElementById('galeriJudul');
    const elTanggal = document.getElementById('galeriTanggal');
    const elKategori = document.getElementById('galeriKategori');
    const elJenjang = document.getElementById('galeriJenjang');
    const formTitle = document.getElementById('formGaleriTitle');

    const cat = (item.category || '').toLowerCase();
    const isEskul = cat.includes('ekstra') || cat.includes('eskul');

    if (elId) elId.value = item.id;
    if (elJudul) elJudul.value = item.title || '';
    if (elTanggal) elTanggal.value = item.event_date || (item.created_at ? item.created_at.split('T')[0] : new Date().toISOString().split('T')[0]);
    if (elKategori) elKategori.value = isEskul ? 'Ekstrakurikuler' : 'Kegiatan';
    if (elJenjang) elJenjang.value = item.jenjang || 'Semua';
    if (formTitle) formTitle.innerHTML = '<i class="fas fa-edit text-emerald-600 mr-2"></i> Edit Dokumentasi Galeri';

    if (typeof window.setTextareaValueWithAlignment === 'function') {
      window.setTextareaValueWithAlignment('galeriDeskripsi', item.description || '');
    } else {
      const elD = document.getElementById('galeriDeskripsi');
      if (elD) elD.value = item.description || '';
    }

    const inputMedia = document.getElementById('galeriMedia');
    if (inputMedia) inputMedia.value = '';

    const areaForm = document.getElementById('areaFormGaleri');
    if (areaForm) areaForm.classList.remove('hidden');
    areaForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof window.initTextareaAlignmentTools === 'function') {
      window.initTextareaAlignmentTools();
    }
  };

  // 6. SIMPAN GALERI TERPADU (INSERT / UPDATE)
  window.handleSimpanGaleri = async function (e, silent = false) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isSavingGaleri) return false;
    isSavingGaleri = true;

    const btnSimpan = document.getElementById('btnSimpanCardGaleri');
    const originalHtml = btnSimpan ? btnSimpan.innerHTML : 'Simpan Galeri';
    if (btnSimpan) {
      btnSimpan.disabled = true;
      btnSimpan.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan...';
    }

    try {
      const elJudul = document.getElementById('galeriJudul');
      const title = elJudul?.value?.trim();
      const category = document.getElementById('galeriKategori')?.value || 'Ekstrakurikuler';
      const jenjang = document.getElementById('galeriJenjang')?.value || 'Semua';
      const event_date = document.getElementById('galeriTanggal')?.value || new Date().toISOString().split('T')[0];
      const description = (typeof window.getWrappedTextareaValue === 'function')
        ? window.getWrappedTextareaValue('galeriDeskripsi')
        : (document.getElementById('galeriDeskripsi')?.value?.trim() || '');
      const galeriId = document.getElementById('galeriId')?.value?.trim();

      if (!title) {
        alert('Judul dokumentasi wajib diisi!');
        elJudul?.focus();
        isSavingGaleri = false;
        if (btnSimpan) {
          btnSimpan.disabled = false;
          btnSimpan.innerHTML = originalHtml;
        }
        return false;
      }

      const inputMedia = document.getElementById('galeriMedia');
      const prevItem = galeriId ? currentGaleriList.find(x => String(x.id) === String(galeriId)) : null;
      const imageUrl = await readFileOrName(inputMedia, prevItem ? prevItem.image_url : '/media/background/wallpaper_yayasan.jpg');

      const payload = {
        title,
        jenjang,
        event_date,
        category,
        description,
        image_url: imageUrl
      };

      const supa = getSupabaseClient();
      let saveSuccess = false;

      if (galeriId && !isNaN(Number(galeriId))) {
        const numId = Number(galeriId);
        if (supa) {
          try {
            const { error } = await withTimeout(
              supa.from('galleries').update(payload).eq('id', numId),
              10000
            );
            if (!error) saveSuccess = true;
          } catch (e) {
            console.warn("[Kelola Galeri] Supabase client UPDATE error:", e);
          }
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
          } catch (e) {
            console.warn("[Kelola Galeri] Supabase client INSERT error:", e);
          }
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

      window.tutupFormGaleri();
      await window.loadGaleriData();
      if (!silent) {
        alert(`Alhamdulillah! Dokumentasi ${category} berhasil disimpan ke database Supabase.`);
      }
      return true;
    } catch (err) {
      console.error("[Kelola Galeri] Gagal menyimpan:", err);
      if (!silent) {
        alert('Gagal menyimpan galeri:\n' + (err.message || err));
      }
      throw err;
    } finally {
      isSavingGaleri = false;
      if (btnSimpan) {
        btnSimpan.disabled = false;
        btnSimpan.innerHTML = originalHtml;
      }
    }
  };

  // 7. HAPUS GALERI
  window.deleteGaleriCard = async function (id) {
    if (!confirm('Apakah Anda yakin ingin menghapus data dokumentasi ini dari database secara permanen?')) {
      return;
    }

    try {
      // 1. Eksekusi Native REST DELETE langsung dengan apikey & token untuk jaminan bypass cache / auth session
      await withTimeout(
        restFetch(`galleries?id=eq.${id}`, {
          method: 'DELETE',
          headers: { 'Prefer': 'return=representation' }
        }),
        10000
      );

      // 2. Redundansi ke Supabase client jika aktif
      const supa = getSupabaseClient();
      if (supa) {
        try {
          await supa.from('galleries').delete().eq('id', Number(id));
        } catch (e) {}
      }

      // 3. Langsung perbarui memori lokal dan render ulang tabel agar tidak menunggu
      currentGaleriList = currentGaleriList.filter(item => String(item.id) !== String(id));
      renderAdminGaleriTable();

      // 4. Verifikasi final dengan memuat ulang data dari database Supabase
      await window.loadGaleriData();
      alert('Alhamdulillah! Data dokumentasi galeri berhasil dihapus dari database Supabase secara permanen.');
    } catch (e) {
      console.error("[Kelola Galeri] Gagal menghapus:", e);
      alert('Gagal menghapus: ' + (e.message || e));
    }
  };

  // 8. SIMPAN BANNER GALERI
  window.handleSimpanBannerGaleri = async function (e, silent = false) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const btn = document.getElementById('btnSimpanBannerGaleri');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan...';
    }

    try {
      const title = document.getElementById('galeriBannerTitle')?.value?.trim() || 'Galeri Dokumentasi';
      const desc = (typeof window.getWrappedTextareaValue === 'function')
        ? window.getWrappedTextareaValue('galeriBannerDesc')
        : (document.getElementById('galeriBannerDesc')?.value?.trim() || '');

      const payload = {
        id: 0,
        title: title,
        description: desc,
        category: 'banner',
        jenjang: 'Semua',
        event_date: new Date().toISOString().split('T')[0]
      };

      const supa = getSupabaseClient();
      let ok = false;
      if (supa) {
        try {
          const { error } = await withTimeout(
            supa.from('galleries').upsert(payload, { onConflict: 'id' }),
            8000
          );
          if (!error) ok = true;
        } catch (err) {
          console.warn("[Kelola Galeri] Banner upsert client warning:", err);
        }
      }
      if (!ok) {
        await withTimeout(
          restFetch('galleries?on_conflict=id', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
            body: JSON.stringify(payload)
          }),
          10000
        );
      }

      if (!silent) {
        alert('Alhamdulillah! Banner galeri berhasil disimpan.');
      }
      return true;
    } catch (err) {
      console.error("[Kelola Galeri] Gagal simpan banner:", err);
      if (!silent) {
        alert('Gagal menyimpan banner galeri: ' + (err.message || err));
      }
      throw err;
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = 'Simpan Banner Galeri';
      }
    }
  };

  // 9. SIMPAN TOTAL PERUBAHAN GALERI
  window.handleSimpanGaleriTotal = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const btn = document.getElementById('btnSimpanGaleriTotal');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan perubahan...';
    }
    try {
      let cardSaved = false;
      const areaForm = document.getElementById('areaFormGaleri');
      const isFormOpen = areaForm && !areaForm.classList.contains('hidden');
      const title = document.getElementById('galeriJudul')?.value?.trim();

      if (isFormOpen && title) {
        const ok = await window.handleSimpanGaleri(null, true);
        if (ok) cardSaved = true;
      }

      await window.handleSimpanBannerGaleri(null, true);
      await window.loadGaleriData();

      if (cardSaved) {
        alert('Alhamdulillah! Dokumentasi galeri baru dan banner berhasil disimpan ke database Supabase.');
      } else {
        alert('Alhamdulillah! Perubahan kelola galeri berhasil disimpan.');
      }
    } catch (err) {
      console.error("[Kelola Galeri] Gagal simpan total:", err);
      alert('Gagal menyimpan perubahan galeri: ' + (err.message || err));
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save"></i> <span>Simpan Perubahan Galeri</span>';
      }
    }
  };

  // 10. BACKWARD-COMPATIBILITY ALIASES
  window.bukaFormTambahEskul = () => window.bukaFormTambahGaleri('Ekstrakurikuler');
  window.bukaFormTambahKegiatan = () => window.bukaFormTambahGaleri('Kegiatan');
  window.tutupFormEskul = window.tutupFormGaleri;
  window.tutupFormKegiatan = window.tutupFormGaleri;
  window.editEskulCard = (id) => window.editGaleriCard(id);
  window.editKegiatanCard = (id) => window.editGaleriCard(id);
  window.deleteGaleriItem = (id) => window.deleteGaleriCard(id);
  window.handleSimpanEskul = window.handleSimpanGaleri;
  window.handleSimpanKegiatan = window.handleSimpanGaleri;

  // 11. EVENT LISTENERS INITIALIZATION
  function initKelolaGaleri() {
    window.loadGaleriData();

    const btnTambahGaleri = document.getElementById('btnTambahGaleri');
    if (btnTambahGaleri && !btnTambahGaleri.dataset.bound) {
      btnTambahGaleri.dataset.bound = 'true';
      btnTambahGaleri.addEventListener('click', () => window.bukaFormTambahGaleri('Ekstrakurikuler'));
    }

    const btnBatalGaleri = document.getElementById('btnBatalGaleri');
    if (btnBatalGaleri && !btnBatalGaleri.dataset.bound) {
      btnBatalGaleri.dataset.bound = 'true';
      btnBatalGaleri.addEventListener('click', window.tutupFormGaleri);
    }

    const btnSimpanCardGaleri = document.getElementById('btnSimpanCardGaleri');
    if (btnSimpanCardGaleri && !btnSimpanCardGaleri.dataset.bound) {
      btnSimpanCardGaleri.dataset.bound = 'true';
      btnSimpanCardGaleri.addEventListener('click', (e) => window.handleSimpanGaleri(e, false));
    }

    const btnBannerGaleri = document.getElementById('btnSimpanBannerGaleri');
    if (btnBannerGaleri && !btnBannerGaleri.dataset.bound) {
      btnBannerGaleri.dataset.bound = 'true';
      btnBannerGaleri.addEventListener('click', (e) => window.handleSimpanBannerGaleri(e, false));
    }

    const btnTotalGaleri = document.getElementById('btnSimpanGaleriTotal');
    if (btnTotalGaleri && !btnTotalGaleri.dataset.bound) {
      btnTotalGaleri.dataset.bound = 'true';
      btnTotalGaleri.addEventListener('click', window.handleSimpanGaleriTotal);
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
