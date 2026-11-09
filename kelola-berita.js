/**
 * =======================================================================
 * KELOLA BERITA (PANEL ADMIN) - 100% PURE SUPABASE
 * Aturan: NO localStorage.getItem / NO localStorage.setItem
 * Fitur: Full CRUD News, Auto-Reset Finally, 15s Timeout & Native REST Fallback
 * Kolom Tabel: 4 Kolom (Judul Berita, Jenjang, Tanggal, Aksi)
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
          dbData = await withTimeout(restFetch('news_posts?select=*&order=id.desc'), 8000);
        } catch (e) {
          console.warn("[Kelola Berita] REST fetch error:", e);
        }
      }

      if (dbData && Array.isArray(dbData)) {
        const banner = dbData.find(b => Number(b.id) === 0);
        if (banner) {
          const tEl = document.getElementById('beritaBannerTitle');
          const dEl = document.getElementById('beritaBannerDesc');
          if (tEl && banner.title) tEl.value = banner.title;
          if (dEl && (banner.content || banner.summary)) {
            if (typeof window.setTextareaValueWithAlignment === 'function') {
              window.setTextareaValueWithAlignment('beritaBannerDesc', banner.content || banner.summary);
            } else {
              dEl.value = banner.content || banner.summary;
            }
          }
        }
        currentBeritaList = dbData.filter(b => Number(b.id) > 0);
      } else {
        currentBeritaList = [];
      }
      renderAdminTable();
    } catch (e) {
      console.error("[Kelola Berita] Gagal memuat berita:", e);
    }
  };

  // Alias agar kelola.html dapat memanggil window.loadBeritaData() maupun window.loadBeritaList()
  window.loadBeritaData = window.loadBeritaList;

  function renderAdminTable() {
    const tbody = document.getElementById('adminListBerita') || document.getElementById('daftarBeritaAdmin');
    if (!tbody) {
      console.warn("[Kelola Berita] Elemen tbody adminListBerita tidak ditemukan!");
      return;
    }

    if (currentBeritaList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">Belum ada berita tersimpan di database. Silakan klik tombol <span class="font-semibold text-emerald-700">+ Tambah Berita Baru</span> di atas.</td></tr>`;
      return;
    }

    tbody.innerHTML = currentBeritaList.map(item => {
      const images = (Array.isArray(item.images) && item.images.length > 0)
        ? item.images
        : (item.image_url ? [item.image_url] : []);

      return `
        <tr class="hover:bg-slate-50 transition border-b border-gray-100">
          <td class="px-4 py-3 align-top">
            <div class="font-semibold text-gray-800 text-sm">${escapeHtml(item.title)}</div>
            <div class="text-[11px] text-gray-400 mt-0.5">Foto: ${images.length} file</div>
          </td>
          <td class="px-4 py-3 align-top">
            <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold inline-block whitespace-nowrap">
              ${escapeHtml((!item.jenjang || item.jenjang.toLowerCase().includes('semua')) ? 'Semua' : item.jenjang)}
            </span>
          </td>
          <td class="px-4 py-3 align-top text-xs text-slate-500">
            ${formatIndoDate(item.date)}
          </td>
          <td class="px-4 py-3 align-top text-center">
            <div class="flex items-center justify-center gap-3">
              <button type="button" onclick="window.editBeritaCard('${item.id}')" class="text-blue-600 hover:text-blue-800 p-1.5 transition rounded hover:bg-blue-50" title="Edit Berita">
                <i class="far fa-edit text-base"></i>
              </button>
              <button type="button" onclick="window.deleteBeritaCard('${item.id}')" class="text-red-500 hover:text-red-700 p-1.5 transition rounded hover:bg-red-50" title="Hapus Berita">
                <i class="far fa-trash-alt text-base"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 2. BUKA & TUTUP FORM BERITA
  window.bukaFormTambahBerita = function () {
    const elId = document.getElementById('beritaId');
    const elJudul = document.getElementById('beritaJudul');
    const elJenjang = document.getElementById('beritaJenjang');
    const elTanggal = document.getElementById('beritaTanggal');
    const formTitle = document.getElementById('formBeritaTitle');

    if (elId) elId.value = '';
    if (elJudul) elJudul.value = '';
    if (elJenjang) elJenjang.value = 'Semua';
    if (elTanggal) elTanggal.value = new Date().toISOString().split('T')[0];
    if (formTitle) formTitle.innerHTML = '<i class="fas fa-plus-circle text-emerald-600"></i> <span>Tambah Berita Baru</span>';

    if (typeof window.setTextareaValueWithAlignment === 'function') {
      window.setTextareaValueWithAlignment('beritaDeskripsiSingkat', '');
      window.setTextareaValueWithAlignment('beritaDeskripsiLengkap', '');
    } else {
      const elS = document.getElementById('beritaDeskripsiSingkat');
      const elL = document.getElementById('beritaDeskripsiLengkap');
      if (elS) elS.value = '';
      if (elL) elL.value = '';
    }

    ['beritaImg1', 'beritaImg2', 'beritaImg3'].forEach(id => {
      const inp = document.getElementById(id);
      if (inp) inp.value = '';
    });
    editingImages = [];

    const areaForm = document.getElementById('areaFormBerita');
    if (areaForm) areaForm.classList.remove('hidden');
    areaForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof window.initTextareaAlignmentTools === 'function') {
      window.initTextareaAlignmentTools();
    }
  };

  window.tutupFormBerita = function () {
    const areaForm = document.getElementById('areaFormBerita');
    if (areaForm) areaForm.classList.add('hidden');
  };

  // 3. EDIT BERITA
  window.editBeritaCard = function (id) {
    const item = currentBeritaList.find(b => String(b.id) === String(id));
    if (!item) return;

    const elId = document.getElementById('beritaId');
    const elJudul = document.getElementById('beritaJudul');
    const elJenjang = document.getElementById('beritaJenjang');
    const elTanggal = document.getElementById('beritaTanggal');
    const formTitle = document.getElementById('formBeritaTitle');

    if (elId) elId.value = item.id;
    if (elJudul) elJudul.value = item.title || '';
    if (elJenjang) elJenjang.value = (!item.jenjang || item.jenjang === 'Semua Jenjang' || item.jenjang === 'Semua') ? 'Semua' : item.jenjang;
    if (elTanggal) elTanggal.value = item.date || new Date().toISOString().split('T')[0];
    if (formTitle) formTitle.innerHTML = '<i class="fas fa-edit text-emerald-600"></i> <span>Edit Berita</span>';

    if (typeof window.setTextareaValueWithAlignment === 'function') {
      window.setTextareaValueWithAlignment('beritaDeskripsiSingkat', item.summary || '');
      window.setTextareaValueWithAlignment('beritaDeskripsiLengkap', item.content || '');
    } else {
      const elS = document.getElementById('beritaDeskripsiSingkat');
      const elL = document.getElementById('beritaDeskripsiLengkap');
      if (elS) elS.value = item.summary || '';
      if (elL) elL.value = item.content || '';
    }

    ['beritaImg1', 'beritaImg2', 'beritaImg3'].forEach(id => {
      const inp = document.getElementById(id);
      if (inp) inp.value = '';
    });

    editingImages = (Array.isArray(item.images) && item.images.length > 0)
      ? item.images
      : (item.image_url ? [item.image_url] : []);

    const areaForm = document.getElementById('areaFormBerita');
    if (areaForm) areaForm.classList.remove('hidden');
    areaForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof window.initTextareaAlignmentTools === 'function') {
      window.initTextareaAlignmentTools();
    }
  };

  // 4. HAPUS BERITA
  window.deleteBeritaCard = async function (id) {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini dari database secara permanen?')) {
      return;
    }

    try {
      // 1. Eksekusi Native REST DELETE langsung dengan apikey & token
      await withTimeout(
        restFetch(`news_posts?id=eq.${id}`, {
          method: 'DELETE',
          headers: { 'Prefer': 'return=representation' }
        }),
        10000
      );

      // 2. Redundansi ke Supabase client jika aktif
      const supa = getSupabaseClient();
      if (supa) {
        try {
          await supa.from('news_posts').delete().eq('id', Number(id));
        } catch (e) {
          console.warn("[Kelola Berita] Supabase client DELETE fallback warning:", e);
        }
      }

      // 3. Update state lokal dan re-render seketika
      currentBeritaList = currentBeritaList.filter(item => String(item.id) !== String(id));
      renderAdminTable();

      // 4. Verifikasi final dengan memuat ulang data dari database Supabase
      await window.loadBeritaList();
      alert('Alhamdulillah! Berita berhasil dihapus dari database Supabase secara permanen.');
    } catch (e) {
      console.error("[Kelola Berita] Gagal menghapus:", e);
      alert('Gagal menghapus berita: ' + (e.message || e));
    }
  };

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

  // 5. SIMPAN KARTU BERITA
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
      btnSimpan.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Mengompres gambar & menyimpan...';
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

      // Bersihkan dan tutup form
      window.tutupFormBerita();
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

  // Banner berita
  window.handleSimpanBannerBerita = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const btn = document.getElementById('btnSimpanBannerBerita');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan...';
    }

    try {
      const title = document.getElementById('beritaBannerTitle')?.value?.trim() || 'Berita & Pengumuman';
      const desc = (typeof window.getWrappedTextareaValue === 'function')
        ? window.getWrappedTextareaValue('beritaBannerDesc')
        : (document.getElementById('beritaBannerDesc')?.value?.trim() || '');

      const payload = {
        id: 0,
        title: title,
        summary: desc,
        content: desc,
        jenjang: 'banner',
        date: new Date().toISOString().split('T')[0]
      };

      const supa = getSupabaseClient();
      let ok = false;
      if (supa) {
        try {
          const { error } = await withTimeout(
            supa.from('news_posts').upsert(payload, { onConflict: 'id' }),
            8000
          );
          if (!error) ok = true;
        } catch (err) {
          console.warn("[Kelola Berita] Banner upsert client warning:", err);
        }
      }
      if (!ok) {
        await withTimeout(
          restFetch('news_posts?on_conflict=id', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
            body: JSON.stringify(payload)
          }),
          10000
        );
      }

      alert('Alhamdulillah! Banner berita berhasil disimpan.');
    } catch (err) {
      console.error("[Kelola Berita] Gagal simpan banner:", err);
      alert('Gagal menyimpan banner berita: ' + (err.message || err));
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = 'Simpan Banner Berita';
      }
    }
  };

  // Simpan perubahan berita terpadu
  window.handleSimpanBeritaTotal = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const btn = document.getElementById('btnSimpanBeritaTotal');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan perubahan...';
    }
    try {
      const title = document.getElementById('beritaBannerTitle')?.value?.trim();
      if (title) {
        await window.handleSimpanBannerBerita(null);
      }
      await window.loadBeritaList();
      alert('Alhamdulillah! Perubahan kelola berita berhasil disimpan.');
    } catch (err) {
      console.error("[Kelola Berita] Gagal simpan total:", err);
      alert('Gagal menyimpan perubahan berita: ' + (err.message || err));
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save"></i> <span>Simpan Perubahan Berita</span>';
      }
    }
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
      btnTambah.addEventListener('click', window.bukaFormTambahBerita);
    }

    const btnBatal = document.getElementById('btnBatalBerita');
    if (btnBatal && !btnBatal.dataset.bound) {
      btnBatal.dataset.bound = 'true';
      btnBatal.addEventListener('click', window.tutupFormBerita);
    }
  }

  initKelolaBerita();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKelolaBerita);
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#berita') {
      window.loadBeritaList();
    }
  });
})();
