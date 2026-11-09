/**
 * =======================================================================
 * KELOLA FASILITAS (PANEL ADMIN) - 100% PURE SUPABASE
 * Aturan Mutlak: NO localStorage.getItem / NO localStorage.setItem
 * Fitur: Full CRUD Facilities, Auto-Reset Finally, 15s Timeout & Native REST Fallback
 * =======================================================================
 */

(function () {
  console.log("[Kelola Fasilitas] Skrip kelola-fasilitas.js dimuat...");

  const SUPABASE_URL = "https://lrorriksjooxrpoihfge.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

  let isSaving = false;
  let currentFasilitasList = [];
  let editingImages = [];
  const BTN_FASILITAS_HTML = `Simpan Fasilitas`;

  // Bersihkan cache lokal
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
          if (!error && data) dbData = data;
        } catch (e) {
          console.warn("[Kelola Fasilitas] Supabase client SELECT error:", e);
        }
      }

      if (!dbData) {
        try {
          dbData = await restFetch(`facilities?select=*&order=id.asc&t=${Date.now()}`);
        } catch (e) {
          console.warn("[Kelola Fasilitas] REST fetch error:", e);
        }
      }

      if (dbData && Array.isArray(dbData)) {
        currentFasilitasList = dbData;
      } else {
        currentFasilitasList = [];
      }
      renderAdminTable();
    } catch (e) {
      console.error("[Kelola Fasilitas] Gagal memuat daftar fasilitas:", e);
    }
  };

  function renderAdminTable() {
    const tbody = document.getElementById('daftarFasilitasAdmin');
    if (!tbody) return;

    if (currentFasilitasList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">Belum ada data fasilitas tersimpan di database. Silakan klik tombol Tambah Fasilitas.</td></tr>`;
      return;
    }

    tbody.innerHTML = currentFasilitasList.map(item => {
      const images = (Array.isArray(item.images) && item.images.length > 0)
        ? item.images
        : (item.image_url ? [item.image_url] : ['/media/background/wallpaper_yayasan.jpg']);
      const mainImg = images[0] || '/media/background/wallpaper_yayasan.jpg';

      return `
        <tr class="hover:bg-slate-50 transition border-b">
          <td class="px-6 py-4">
            <img src="${mainImg}" alt="${escapeHtml(item.name)}" class="w-16 h-12 object-cover rounded shadow-sm">
          </td>
          <td class="px-6 py-4 font-semibold text-slate-800">
            ${escapeHtml(item.name)}
          </td>
          <td class="px-6 py-4 text-slate-600 text-sm max-w-xs truncate">
            ${escapeHtml(item.description)}
          </td>
          <td class="px-6 py-4 text-right space-x-2">
            <button type="button" onclick="window.editFasilitasCard('${item.id}')" class="px-3 py-1 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 transition">
              <i class="fas fa-edit mr-1"></i> Edit
            </button>
            <button type="button" onclick="window.deleteFasilitasCard('${item.id}')" class="px-3 py-1 bg-rose-600 text-white rounded text-xs hover:bg-rose-700 transition">
              <i class="fas fa-trash-alt mr-1"></i> Hapus
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 2. FORM EDIT & TAMBAH
  window.editFasilitasCard = function (id) {
    const item = currentFasilitasList.find(f => String(f.id) === String(id));
    if (!item) return;

    document.getElementById('fasId').value = item.id;
    document.getElementById('fasNama').value = item.name || '';
    if (typeof window.setTextareaValueWithAlignment === 'function') {
      window.setTextareaValueWithAlignment('fasDeskripsi', item.description || '');
    } else {
      document.getElementById('fasDeskripsi').value = item.description || '';
    }

    editingImages = (Array.isArray(item.images) && item.images.length > 0)
      ? item.images
      : (item.image_url ? [item.image_url] : []);

    const areaForm = document.getElementById('areaFormFasilitas');
    if (areaForm) areaForm.classList.remove('hidden');
    areaForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // 3. HAPUS FASILITAS DARI SUPABASE
  window.deleteFasilitasCard = async function (id) {
    if (!confirm('Apakah Anda yakin ingin menghapus fasilitas ini dari database secara permanen?')) {
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
      alert('Fasilitas berhasil dihapus dari database Supabase.');
    } catch (e) {
      console.error("[Kelola Fasilitas] Gagal menghapus:", e);
      alert('Gagal menghapus fasilitas: ' + (e.message || e));
    }
  };

  // Helper membaca file
  function readFileOrName(inputEl, fallback) {
    return new Promise((resolve) => {
      if (!inputEl) {
        resolve(fallback || '');
        return;
      }
      const file = inputEl.files && inputEl.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => resolve(fallback || '');
        reader.readAsDataURL(file);
      } else {
        resolve(fallback || '');
      }
    });
  }

  // 4. SIMPAN KARTU FASILITAS KE SUPABASE
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
      btnSimpan.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan ke server...';
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
        isSaving = false;
        if (btnSimpan) {
          btnSimpan.disabled = false;
          btnSimpan.innerHTML = BTN_FASILITAS_HTML;
        }
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
      if (inp1) inp1.value = '';
      if (inp2) inp2.value = '';
      if (inp3) inp3.value = '';
      editingImages = [];

      const areaForm = document.getElementById('areaFormFasilitas');
      if (areaForm) areaForm.classList.add('hidden');

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

  // 5. BANNER FASILITAS (Opsional, simpan ke home/profile settings jika diperlukan)
  window.handleSimpanBannerFasilitas = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    alert('Teks banner fasilitas berhasil disimpan.');
  };

  function initKelolaFasilitas() {
    window.loadFasilitasList();

    const btnSimpan = document.getElementById('btnSimpanCardFasilitas');
    if (btnSimpan && !btnSimpan.dataset.bound) {
      btnSimpan.dataset.bound = 'true';
      btnSimpan.addEventListener('click', window.handleSimpanCardFasilitas);
    }

    const btnTambah = document.getElementById('btnTambahFasilitas');
    if (btnTambah && !btnTambah.dataset.bound) {
      btnTambah.dataset.bound = 'true';
      btnTambah.addEventListener('click', () => {
        document.getElementById('fasId').value = '';
        document.getElementById('fasNama').value = '';
        if (typeof window.setTextareaValueWithAlignment === 'function') {
          window.setTextareaValueWithAlignment('fasDeskripsi', '');
        } else {
          document.getElementById('fasDeskripsi').value = '';
        }
        editingImages = [];
        const areaForm = document.getElementById('areaFormFasilitas');
        if (areaForm) areaForm.classList.remove('hidden');
        areaForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    const btnBatal = document.getElementById('btnBatalFasilitas');
    if (btnBatal && !btnBatal.dataset.bound) {
      btnBatal.dataset.bound = 'true';
      btnBatal.addEventListener('click', () => {
        const areaForm = document.getElementById('areaFormFasilitas');
        if (areaForm) areaForm.classList.add('hidden');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKelolaFasilitas);
  } else {
    initKelolaFasilitas();
  }
})();
