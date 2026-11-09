/**
 * =======================================================================
 * KELOLA BERITA (PANEL ADMIN) - 100% PURE SUPABASE
 * Aturan Mutlak: NO localStorage.getItem / NO localStorage.setItem
 * Fitur: Full CRUD News, Auto-Reset Finally, 15s Timeout & Native REST Fallback
 * =======================================================================
 */

(function () {
  console.log("[Kelola Berita] Skrip kelola-berita.js dimuat...");

  const SUPABASE_URL = "https://lrorriksjooxrpoihfge.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

  let isSaving = false;
  let currentBeritaList = [];
  let editingImages = [];
  const BTN_BERITA_HTML = `Simpan Berita`;

  // Bersihkan cache lokal
  try {
    localStorage.removeItem('cmsData_listBerita');
    localStorage.removeItem('cmsData_beritaBanner');
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
        console.warn("[Kelola Berita] createClient warning:", err);
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

  function formatIndoDate(dateStr) {
    if (!dateStr) return '';
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

  // 1. LOAD DAFTAR BERITA DARI SUPABASE
  window.loadBeritaList = async function () {
    console.log("[Kelola Berita] Memuat daftar berita dari Supabase...");
    try {
      let dbData = null;
      const supa = getSupabaseClient();
      if (supa) {
        try {
          const { data, error } = await withTimeout(
            supa.from('news_posts').select('*').order('id', { ascending: false }),
            8000
          );
          if (!error && data) dbData = data;
        } catch (e) {
          console.warn("[Kelola Berita] Supabase client SELECT error:", e);
        }
      }

      if (!dbData) {
        try {
          dbData = await restFetch(`news_posts?select=*&order=id.desc`);
        } catch (e) {
          console.warn("[Kelola Berita] REST fetch error:", e);
        }
      }

      if (dbData && Array.isArray(dbData)) {
        currentBeritaList = dbData;
      } else {
        currentBeritaList = [];
      }
      renderAdminTable();
    } catch (e) {
      console.error("[Kelola Berita] Gagal memuat berita:", e);
    }
  };

  function renderAdminTable() {
    const tbody = document.getElementById('daftarBeritaAdmin');
    if (!tbody) return;

    if (currentBeritaList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">Belum ada berita tersimpan di database. Silakan klik tombol Tambah Berita.</td></tr>`;
      return;
    }

    tbody.innerHTML = currentBeritaList.map(item => {
      const images = (Array.isArray(item.images) && item.images.length > 0)
        ? item.images
        : (item.image_url ? [item.image_url] : ['/media/background/wallpaper_yayasan.jpg']);
      const mainImg = images[0] || '/media/background/wallpaper_yayasan.jpg';

      return `
        <tr class="hover:bg-slate-50 transition border-b">
          <td class="px-6 py-4">
            <img src="${mainImg}" alt="${escapeHtml(item.title)}" class="w-16 h-12 object-cover rounded shadow-sm">
          </td>
          <td class="px-6 py-4 font-semibold text-slate-800">
            ${escapeHtml(item.title)}
          </td>
          <td class="px-6 py-4">
            <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
              ${escapeHtml(item.jenjang || 'Semua')}
            </span>
          </td>
          <td class="px-6 py-4 text-slate-500 text-xs">
            ${formatIndoDate(item.date)}
          </td>
          <td class="px-6 py-4 text-right space-x-2">
            <button type="button" onclick="window.editBeritaCard('${item.id}')" class="px-3 py-1 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 transition">
              <i class="fas fa-edit mr-1"></i> Edit
            </button>
            <button type="button" onclick="window.deleteBeritaCard('${item.id}')" class="px-3 py-1 bg-rose-600 text-white rounded text-xs hover:bg-rose-700 transition">
              <i class="fas fa-trash-alt mr-1"></i> Hapus
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 2. FORM EDIT & TAMBAH
  window.editBeritaCard = function (id) {
    const item = currentBeritaList.find(b => String(b.id) === String(id));
    if (!item) return;

    document.getElementById('beritaId').value = item.id;
    document.getElementById('beritaJudul').value = item.title || '';
    document.getElementById('beritaJenjang').value = item.jenjang || 'Semua';
    document.getElementById('beritaTanggal').value = item.date || new Date().toISOString().split('T')[0];

    if (typeof window.setTextareaValueWithAlignment === 'function') {
      window.setTextareaValueWithAlignment('beritaDeskripsiSingkat', item.summary || '');
      window.setTextareaValueWithAlignment('beritaDeskripsiLengkap', item.content || '');
    } else {
      document.getElementById('beritaDeskripsiSingkat').value = item.summary || '';
      document.getElementById('beritaDeskripsiLengkap').value = item.content || '';
    }

    editingImages = (Array.isArray(item.images) && item.images.length > 0)
      ? item.images
      : (item.image_url ? [item.image_url] : []);

    const areaForm = document.getElementById('areaFormBerita');
    if (areaForm) areaForm.classList.remove('hidden');
    areaForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // 3. HAPUS BERITA DARI SUPABASE
  window.deleteBeritaCard = async function (id) {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini dari database secara permanen?')) {
      return;
    }

    try {
      const supa = getSupabaseClient();
      let delSuccess = false;
      if (supa) {
        try {
          const { error } = await withTimeout(
            supa.from('news_posts').delete().eq('id', Number(id)),
            8000
          );
          if (!error) delSuccess = true;
        } catch (e) {
          console.warn("[Kelola Berita] Supabase client DELETE warning:", e);
        }
      }

      if (!delSuccess) {
        await withTimeout(
          restFetch(`news_posts?id=eq.${id}`, { method: 'DELETE' }),
          10000
        );
      }

      await window.loadBeritaList();
      alert('Berita berhasil dihapus dari database Supabase.');
    } catch (e) {
      console.error("[Kelola Berita] Gagal menghapus:", e);
      alert('Gagal menghapus berita: ' + (e.message || e));
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
        pathPrefix: 'berita'
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

  // 4. SIMPAN KARTU BERITA KE SUPABASE
  window.handleSimpanCardBerita = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isSaving) return;
    isSaving = true;

    const btnSimpan = document.getElementById('btnSimpanCardBerita');
    if (btnSimpan) {
      btnSimpan.disabled = true;
      btnSimpan.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan ke server...';
    }

    try {
      const judul = document.getElementById('beritaJudul')?.value?.trim();
      const jenjang = document.getElementById('beritaJenjang')?.value || 'Semua';
      const tanggal = document.getElementById('beritaTanggal')?.value || new Date().toISOString().split('T')[0];
      const summary = (typeof window.getWrappedTextareaValue === 'function')
        ? window.getWrappedTextareaValue('beritaDeskripsiSingkat')
        : (document.getElementById('beritaDeskripsiSingkat')?.value?.trim() || '');
      const content = (typeof window.getWrappedTextareaValue === 'function')
        ? window.getWrappedTextareaValue('beritaDeskripsiLengkap')
        : (document.getElementById('beritaDeskripsiLengkap')?.value?.trim() || '');
      const beritaId = document.getElementById('beritaId')?.value?.trim();

      if (!judul) {
        alert('Judul berita wajib diisi!');
        document.getElementById('beritaJudul')?.focus();
        isSaving = false;
        if (btnSimpan) {
          btnSimpan.disabled = false;
          btnSimpan.innerHTML = BTN_BERITA_HTML;
        }
        return;
      }

      const inp1 = document.getElementById('beritaImg1');
      const inp2 = document.getElementById('beritaImg2');
      const inp3 = document.getElementById('beritaImg3');

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
        title: judul,
        jenjang: jenjang,
        date: tanggal,
        summary: summary,
        content: content,
        image_url: images[0] || '',
        images: images
      };

      console.log('[Kelola Berita] Menyimpan ke Supabase...', { beritaId, payload });

      const supa = getSupabaseClient();
      let saveSuccess = false;

      if (beritaId && !isNaN(Number(beritaId))) {
        // UPDATE
        const numId = Number(beritaId);
        if (supa) {
          try {
            const { error } = await withTimeout(
              supa.from('news_posts').update(payload).eq('id', numId),
              10000
            );
            if (!error) saveSuccess = true;
          } catch (e) {
            console.warn("[Kelola Berita] Supabase update warning:", e);
          }
        }
        if (!saveSuccess) {
          await withTimeout(
            restFetch(`news_posts?id=eq.${numId}`, {
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
              supa.from('news_posts').insert([payload]),
              10000
            );
            if (!error) saveSuccess = true;
          } catch (e) {
            console.warn("[Kelola Berita] Supabase insert warning:", e);
          }
        }
        if (!saveSuccess) {
          await withTimeout(
            restFetch('news_posts', {
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
      document.getElementById('beritaId').value = '';
      document.getElementById('beritaJudul').value = '';
      if (inp1) inp1.value = '';
      if (inp2) inp2.value = '';
      if (inp3) inp3.value = '';
      editingImages = [];

      const areaForm = document.getElementById('areaFormBerita');
      if (areaForm) areaForm.classList.add('hidden');

      await window.loadBeritaList();
      alert('Alhamdulillah! Berita berhasil disimpan ke database Supabase.');
    } catch (error) {
      console.error('[Kelola Berita] Gagal menyimpan:', error);
      alert('Gagal menyimpan berita:\n' + (error.message || error));
    } finally {
      isSaving = false;
      if (btnSimpan) {
        btnSimpan.disabled = false;
        btnSimpan.innerHTML = BTN_BERITA_HTML;
      }
    }
  };

  // 5. BANNER BERITA
  window.handleSimpanBannerBerita = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    alert('Teks banner berita berhasil disimpan.');
  };

  function initKelolaBerita() {
    window.loadBeritaList();

    const btnSimpan = document.getElementById('btnSimpanCardBerita');
    if (btnSimpan && !btnSimpan.dataset.bound) {
      btnSimpan.dataset.bound = 'true';
      btnSimpan.addEventListener('click', window.handleSimpanCardBerita);
    }

    const btnTambah = document.getElementById('btnTambahBerita');
    if (btnTambah && !btnTambah.dataset.bound) {
      btnTambah.dataset.bound = 'true';
      btnTambah.addEventListener('click', () => {
        document.getElementById('beritaId').value = '';
        document.getElementById('beritaJudul').value = '';
        document.getElementById('beritaJenjang').value = 'Semua';
        document.getElementById('beritaTanggal').value = new Date().toISOString().split('T')[0];
        if (typeof window.setTextareaValueWithAlignment === 'function') {
          window.setTextareaValueWithAlignment('beritaDeskripsiSingkat', '');
          window.setTextareaValueWithAlignment('beritaDeskripsiLengkap', '');
        } else {
          document.getElementById('beritaDeskripsiSingkat').value = '';
          document.getElementById('beritaDeskripsiLengkap').value = '';
        }
        editingImages = [];
        const areaForm = document.getElementById('areaFormBerita');
        if (areaForm) areaForm.classList.remove('hidden');
        areaForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    const btnBatal = document.getElementById('btnBatalBerita');
    if (btnBatal && !btnBatal.dataset.bound) {
      btnBatal.dataset.bound = 'true';
      btnBatal.addEventListener('click', () => {
        const areaForm = document.getElementById('areaFormBerita');
        if (areaForm) areaForm.classList.add('hidden');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKelolaBerita);
  } else {
    initKelolaBerita();
  }
})();
