/**
 * =======================================================================
 * KELOLA BERANDA (PANEL ADMIN) - 100% PURE SUPABASE
 * Aturan Mutlak: NO localStorage.getItem / NO localStorage.setItem / NO localCache
 * Fitur: Single Save Button, Auto-Reset Finally, 10s Timeout & Native REST Fallback
 * =======================================================================
 */

(function () {
  console.log("[Kelola Beranda] Skrip kelola-beranda.js mulai dimuat...");

  const SUPABASE_URL = "https://lrorriksjooxrpoihfge.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

  // Flag guard agar tidak terjadi double-submit
  let isSaving = false;

  // Cache object contact_person dari ppdb_info agar tidak tertimpa
  let cachedContactPerson = null;

  // Variabel untuk modal pratinjau pop-up di admin
  let adminPrevIndex = 0;
  let adminPrevTimer = null;
  let adminPrevSlides = [];

  // Template HTML default tombol utama agar tidak pernah macet di teks 'Menyimpan...'
  const BTN_BERANDA_HTML = `<svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg> Simpan Perubahan Beranda`;

  // Bersihkan sisa-sisa cache lama dari memori browser
  try {
    localStorage.removeItem('cmsData_beranda');
  } catch (e) {}

  // 1. Inisialisasi Klien Supabase
  function getSupabaseClient() {
    if (window.supabaseClient) {
      return window.supabaseClient;
    }

    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
      try {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: { persistSession: true }
        });
        return window.supabaseClient;
      } catch (err) {
        console.warn("[Kelola Beranda] createClient warning:", err);
      }
    }
    return null;
  }

  // Helper untuk reset tampilan tombol kembali normal
  function resetButtonState() {
    const btnBeranda = document.getElementById('btnSimpanBeranda');
    if (btnBeranda) {
      btnBeranda.disabled = false;
      btnBeranda.innerHTML = BTN_BERANDA_HTML;
    }
  }

  // 2. Helper ambil nilai input form (Optional Chaining & Fallback)
  function getVal(id, fallback = '') {
    const el = document.getElementById(id);
    const val = el?.value;
    return (typeof val === 'string' && val.trim() !== '') ? val.trim() : fallback;
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

  // Helper Promise dengan batas waktu (Timeout)
  function withTimeout(promise, ms = 10000, errorMsg = "Batas waktu koneksi terlampaui.") {
    let timer = null;
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(errorMsg)), ms);
    });
    return Promise.race([
      Promise.resolve(promise).finally(() => clearTimeout(timer)),
      timeoutPromise
    ]);
  }

  // Helper Native REST Upsert langsung ke Supabase (Cadangan jika lib JS macet)
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

  // 3. SELECT DARI SUPABASE (LOAD FORM DATA)
  window.loadBerandaData = async function () {
    console.log("[Kelola Beranda] Memulai loadBerandaData()...");
    try {
      let home = null;
      let ppdb = null;

      const supa = getSupabaseClient();
      if (supa) {
        try {
          const { data, error } = await withTimeout(
            supa.from('home_settings').select('*').eq('id', 1).maybeSingle(),
            8000
          );
          if (!error && data) home = data;
        } catch (e) {
          console.warn("[Kelola Beranda] Supabase client SELECT home_settings timeout/error:", e);
        }

        try {
          const { data, error } = await withTimeout(
            supa.from('ppdb_info').select('*').eq('id', 1).maybeSingle(),
            8000
          );
          if (!error && data) ppdb = data;
        } catch (e) {
          console.warn("[Kelola Beranda] Supabase client SELECT ppdb_info timeout/error:", e);
        }
      }

      // Fallback via Native REST API jika supa belum menghasilkan data
      if (!home) {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/home_settings?id=eq.1&select=*`, {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          });
          if (res.ok) {
            const rows = await res.json();
            if (rows && rows[0]) home = rows[0];
          }
        } catch (e) {}
      }

      if (!ppdb) {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/ppdb_info?id=eq.1&select=*`, {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          });
          if (res.ok) {
            const rows = await res.json();
            if (rows && rows[0]) ppdb = rows[0];
          }
        } catch (e) {}
      }

      // Isi form input jika data berhasil didapatkan
      if (home) {
        console.log("[Kelola Beranda] Data home_settings berhasil diterima:", home);
        const heroTitleEl = document.getElementById('heroTitle');
        if (heroTitleEl && home.hero_title) heroTitleEl.value = home.hero_title;
        if (home.hero_desc) setSafeTextareaValue('heroDesc', home.hero_desc);

        const taglineTitleEl = document.getElementById('taglineTitle');
        if (taglineTitleEl && home.tagline_title) taglineTitleEl.value = home.tagline_title;
        if (home.tagline_desc) setSafeTextareaValue('taglineDesc', home.tagline_desc);

        const s1n = document.getElementById('stat1Num');
        if (s1n && home.stat1_num) s1n.value = home.stat1_num;
        const s1t = document.getElementById('stat1Text');
        if (s1t && home.stat1_text) s1t.value = home.stat1_text;

        const s2n = document.getElementById('stat2Num');
        if (s2n && home.stat2_num) s2n.value = home.stat2_num;
        const s2t = document.getElementById('stat2Text');
        if (s2t && home.stat2_text) s2t.value = home.stat2_text;

        const s3n = document.getElementById('stat3Num');
        if (s3n && home.stat3_num) s3n.value = home.stat3_num;
        const s3t = document.getElementById('stat3Text');
        if (s3t && home.stat3_text) s3t.value = home.stat3_text;

        const s4n = document.getElementById('stat4Num');
        if (s4n && home.stat4_num) s4n.value = home.stat4_num;
        const s4t = document.getElementById('stat4Text');
        if (s4t && home.stat4_text) s4t.value = home.stat4_text;

        const ps1Title = document.getElementById('progSosial1Title');
        if (ps1Title && home.social_prog1_title) ps1Title.value = home.social_prog1_title;
        if (home.social_prog1_desc) setSafeTextareaValue('progSosial1Desc', home.social_prog1_desc);

        const ps2Title = document.getElementById('progSosial2Title');
        if (ps2Title && home.social_prog2_title) ps2Title.value = home.social_prog2_title;
        if (home.social_prog2_desc) setSafeTextareaValue('progSosial2Desc', home.social_prog2_desc);
      }

      if (ppdb) {
        console.log("[Kelola Beranda] Data ppdb_info berhasil diterima:", ppdb);
        const ppdbYearEl = document.getElementById('ppdbYear');
        if (ppdbYearEl && ppdb.academic_year) ppdbYearEl.value = ppdb.academic_year;
        const ppdbStatusEl = document.getElementById('ppdbStatus');
        if (ppdbStatusEl && ppdb.status) ppdbStatusEl.value = ppdb.status;

        // Simpan contact_person agar data lainnya tidak hilang saat simpan
        if (ppdb.contact_person && typeof ppdb.contact_person === 'object') {
          cachedContactPerson = ppdb.contact_person;
        }

        // Isi form Pop-up Brosur PPDB (Bagian 6)
        const pb = (cachedContactPerson && cachedContactPerson.popup_banner) ? cachedContactPerson.popup_banner : {};
        const activeCheck = document.getElementById('popupBannerActive');
        if (activeCheck) {
          activeCheck.checked = pb.active !== false;
          const labelActive = document.getElementById('labelPopupBannerActive');
          if (labelActive) {
            labelActive.textContent = activeCheck.checked ? 'Aktif (Tampil di Beranda)' : 'Nonaktif (Disembunyikan)';
          }
        }

        const autoSlideCheck = document.getElementById('popupBannerAutoSlide');
        if (autoSlideCheck && pb.auto_slide !== undefined) {
          autoSlideCheck.checked = pb.auto_slide !== false;
        }

        const durSelect = document.getElementById('popupBannerDuration');
        if (durSelect && pb.slide_duration) {
          durSelect.value = String(pb.slide_duration);
        }

        const slides = Array.isArray(pb.slides) ? pb.slides : [];
        const jenjangList = ['sdi', 'mi', 'mts', 'ma', 'ponpes'];
        jenjangList.forEach(j => {
          const s = slides.find(item => item.jenjang === j) || {};
          const elBadge = document.getElementById('popupSlideBadge_' + j);
          if (elBadge && s.badge) elBadge.value = s.badge;
          const elTitle = document.getElementById('popupSlideTitle_' + j);
          if (elTitle && s.title) elTitle.value = s.title;
          const elSub = document.getElementById('popupSlideSubtitle_' + j);
          if (elSub && s.subtitle) elSub.value = s.subtitle;
          const elLink = document.getElementById('popupSlideLink_' + j);
          if (elLink && s.link_url) elLink.value = s.link_url;
          const elImg = document.getElementById('popupSlideImgUrl_' + j);
          if (elImg && s.image_url) elImg.value = s.image_url;
          const elPrev = document.getElementById('popupSlideImgPreview_' + j);
          if (elPrev && s.image_url) elPrev.src = s.image_url;
        });
      }
    } catch (e) {
      console.warn("[Kelola Beranda] Gagal mengambil data Supabase:", e);
    }
  };

  // 4. SATU-SATUNYA FUNGSI SIMPAN BERANDA KE SUPABASE (ANTI-MACET)
  window.handleSimpanBeranda = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isSaving) {
      console.warn("[Kelola Beranda] Proses simpan sedang berjalan, klik ganda diabaikan.");
      return;
    }
    isSaving = true;

    console.log("[Kelola Beranda] === MEMULAI PROSES SIMPAN BERANDA ===");

    const btnBeranda = document.getElementById('btnSimpanBeranda');
    if (btnBeranda) {
      btnBeranda.disabled = true;
      btnBeranda.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan ke server...';
    }

    try {
      // 1. Kumpulkan Nilai Form
      const heroTitle = getVal('heroTitle', 'Selamat Datang di Yayasan Nahjul Huda');
      const heroDesc = getSafeTextareaValue('heroDesc');
      const taglineTitle = getVal('taglineTitle', 'Mencetak Generasi Rabbani');
      const taglineDesc = getSafeTextareaValue('taglineDesc');

      const stat1Num = getVal('stat1Num', '5');
      const stat1Text = getVal('stat1Text', 'JENJANG PENDIDIKAN');
      const stat2Num = getVal('stat2Num', '100+');
      const stat2Text = getVal('stat2Text', 'TENAGA PENDIDIK');
      const stat3Num = getVal('stat3Num', '1000+');
      const stat3Text = getVal('stat3Text', 'SANTRI & SISWA');
      const stat4Num = getVal('stat4Num', '1980');
      const stat4Text = getVal('stat4Text', 'TAHUN BERDIRI');

      const ppdbYear = getVal('ppdbYear', '2024/2025');
      const ppdbStatus = getVal('ppdbStatus', 'BUKA');

      const progSosial1Title = getVal('progSosial1Title', "Majelis Ta'lim Nahjul Huda");
      const progSosial1Desc = getSafeTextareaValue('progSosial1Desc');
      const progSosial2Title = getVal('progSosial2Title', "Pengajian Rutin Bulanan");
      const progSosial2Desc = getSafeTextareaValue('progSosial2Desc');

      const homePayload = {
        id: 1,
        hero_title: heroTitle,
        hero_desc: heroDesc,
        tagline_title: taglineTitle,
        tagline_desc: taglineDesc,
        stat1_num: stat1Num,
        stat1_text: stat1Text,
        stat2_num: stat2Num,
        stat2_text: stat2Text,
        stat3_num: stat3Num,
        stat3_text: stat3Text,
        stat4_num: stat4Num,
        stat4_text: stat4Text,
        social_prog1_title: progSosial1Title,
        social_prog1_desc: progSosial1Desc,
        social_prog2_title: progSosial2Title,
        social_prog2_desc: progSosial2Desc,
        updated_at: new Date().toISOString()
      };

      // Kumpulkan pengaturan Pop-up Brosur PPDB (Bagian 6)
      const popupActive = document.getElementById('popupBannerActive') ? document.getElementById('popupBannerActive').checked : true;
      const popupAutoSlide = document.getElementById('popupBannerAutoSlide') ? document.getElementById('popupBannerAutoSlide').checked : true;
      const popupDuration = parseInt(getVal('popupBannerDuration', '5000'), 10) || 5000;

      const jenjangDef = [
        { id: 'sdi', defaultBadge: 'SDI AL KINDY', defaultTitle: 'Penerimaan Peserta Didik Baru (PPDB)', defaultSub: "Sekolah Dasar Berbasis Al-Qur'an & Karakter Islami", defaultLink: '/ppdb#sdi', defaultImg: '/media/logo/SDI.jpg' },
        { id: 'mi', defaultBadge: 'MI NAHJUL HUDA', defaultTitle: 'Penerimaan Peserta Didik Baru (PPDB)', defaultSub: 'Pendidikan Dasar Islam Terpadu & Berakhlak Mulia', defaultLink: '/ppdb#mi', defaultImg: '/media/logo/MI.jpg' },
        { id: 'mts', defaultBadge: 'MTS NAHJUL HUDA', defaultTitle: 'Penerimaan Murid Baru (SPMB)', defaultSub: 'Dapatkan Promo Spesial SPMB: GRATIS UANG PANGKAL!', defaultLink: '/ppdb#mts', defaultImg: '/media/logo/MTs.jpg' },
        { id: 'ma', defaultBadge: 'MA NAHJUL HUDA', defaultTitle: 'Penerimaan Murid Baru (SPMB)', defaultSub: 'Madrasah Aliyah Unggul Menuju Perguruan Tinggi Favorit', defaultLink: '/ppdb#ma', defaultImg: '/media/logo/MA.jpg' },
        { id: 'ponpes', defaultBadge: 'PONPES ASSURUR', defaultTitle: 'Penerimaan Santri Baru (PSB)', defaultSub: "Pondok Pesantren Tahfidz Qur'an & Pendalaman Kitab Kuning", defaultLink: '/ppdb#ponpes', defaultImg: '/media/logo/Ponpes.jpg' }
      ];

      const processedSlides = [];
      for (const item of jenjangDef) {
        const j = item.id;
        const prevUrl = document.getElementById('popupSlideImgUrl_' + j)?.value || item.defaultImg;
        let finalImageUrl = prevUrl;

        if (typeof window.processImageField === 'function') {
          try {
            finalImageUrl = await window.processImageField(
              'popupSlideFile_' + j,
              prevUrl,
              { maxWidth: 1200, maxHeight: 1600, quality: 0.85, pathPrefix: 'brosur_ppdb_' + j }
            );
          } catch (imgErr) {
            console.warn(`[Kelola Beranda] Gagal kompresi brosur ${j}, tetap gunakan file lama:`, imgErr);
            finalImageUrl = prevUrl;
          }
        }

        const badge = getVal('popupSlideBadge_' + j, item.defaultBadge);
        const title = getVal('popupSlideTitle_' + j, item.defaultTitle);
        const subtitle = getVal('popupSlideSubtitle_' + j, item.defaultSub);
        const link_url = getVal('popupSlideLink_' + j, item.defaultLink);

        processedSlides.push({
          jenjang: j,
          name: item.defaultBadge,
          badge,
          title,
          subtitle,
          image_url: finalImageUrl,
          link_url
        });
      }

      // Pastikan contact_person tidak terhapus (ambil dari cache atau fetch cepat jika null)
      let baseContactPerson = cachedContactPerson || {};
      if (!baseContactPerson || Object.keys(baseContactPerson).length === 0) {
        try {
          const resCp = await fetch(`${SUPABASE_URL}/rest/v1/ppdb_info?id=eq.1&select=contact_person`, {
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
          });
          if (resCp.ok) {
            const rowsCp = await resCp.json();
            if (rowsCp && rowsCp[0] && rowsCp[0].contact_person) {
              baseContactPerson = rowsCp[0].contact_person;
            }
          }
        } catch (e) {}
      }

      const updatedContactPerson = {
        ...baseContactPerson,
        popup_banner: {
          active: popupActive,
          auto_slide: popupAutoSlide,
          slide_duration: popupDuration,
          slides: processedSlides
        }
      };

      // Perbarui cachedContactPerson lokal
      cachedContactPerson = updatedContactPerson;

      const ppdbPayload = {
        id: 1,
        academic_year: ppdbYear,
        status: ppdbStatus,
        contact_person: updatedContactPerson,
        updated_at: new Date().toISOString()
      };

      console.log("[Kelola Beranda] Mengirim payload ke Supabase:", { homePayload, ppdbPayload });

      // 2. Eksekusi Simpan via Supabase Client atau REST Fallback
      let saveSuccess = false;
      const supa = getSupabaseClient();

      if (supa) {
        try {
          const { error: errHome } = await withTimeout(
            supa.from('home_settings').upsert(homePayload, { onConflict: 'id' }),
            10000,
            "Timeout saat menyimpan home_settings"
          );
          if (errHome) throw errHome;

          const { error: errPpdb } = await withTimeout(
            supa.from('ppdb_info').upsert(ppdbPayload, { onConflict: 'id' }),
            10000,
            "Timeout saat menyimpan ppdb_info"
          );
          if (errPpdb) throw errPpdb;

          saveSuccess = true;
        } catch (clientErr) {
          console.warn("[Kelola Beranda] Supabase client gagal, beralih ke Native REST fallback:", clientErr);
        }
      }

      // Jika client belum siap atau gagal, gunakan Native REST Upsert langsung
      if (!saveSuccess) {
        console.log("[Kelola Beranda] Menjalankan REST Upsert langsung...");
        await withTimeout(restUpsert('home_settings', homePayload), 10000, "REST timeout home_settings");
        await withTimeout(restUpsert('ppdb_info', ppdbPayload), 10000, "REST timeout ppdb_info");
        saveSuccess = true;
      }

      // Pastikan cache lokal bersih
      try {
        localStorage.removeItem('cmsData_beranda');
      } catch (e) {}

      console.log("[Kelola Beranda] === BERHASIL DISIMPAN KE SUPABASE ===");
      alert("Alhamdulillah! Data Beranda BERHASIL DISIMPAN secara online ke database Supabase.\nPerubahan sudah aktif di semua perangkat.");
    } catch (error) {
      console.error("[Kelola Beranda] GAGAL menyimpan ke Supabase:", error);
      let errMsg = error?.message || String(error);
      if (error?.code === '42501' || errMsg.toLowerCase().includes('row-level security') || errMsg.toLowerCase().includes('rls')) {
        errMsg += "\n\n(Akses ditolak oleh RLS di Supabase. Jalankan perintah: ALTER TABLE home_settings DISABLE ROW LEVEL SECURITY; ALTER TABLE ppdb_info DISABLE ROW LEVEL SECURITY;)";
      }
      alert("Gagal menyimpan ke database Supabase:\n" + errMsg);
    } finally {
      console.log("[Kelola Beranda] Mengembalikan state tombol (finally block)...");
      isSaving = false;
      resetButtonState();
    }
  };

  // 5. HELPER TAB SLIDE DAN PRATINJAU POP-UP BROSUR PPDB (ADMIN)
  window.switchPopupSlideTab = function (jenjang) {
    const jenjangList = ['sdi', 'mi', 'mts', 'ma', 'ponpes'];
    jenjangList.forEach(j => {
      const btn = document.getElementById('tabBtnPopup_' + j);
      const panel = document.getElementById('popupSlidePanel_' + j);
      if (j === jenjang) {
        if (btn) {
          btn.className = 'popup-slide-tab-btn px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-emerald-700 text-white shadow-xs';
        }
        if (panel) panel.classList.remove('hidden');
      } else {
        if (btn) {
          btn.className = 'popup-slide-tab-btn px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-100';
        }
        if (panel) panel.classList.add('hidden');
      }
    });
  };

  window.handlePopupFileChange = function (jenjang, input) {
    if (!input || !input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const prevImg = document.getElementById('popupSlideImgPreview_' + jenjang);
      if (prevImg) prevImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Preview Modal Slider di Admin
  function collectAdminPreviewSlides() {
    const jenjangList = [
      { id: 'sdi', defaultBadge: 'SDI AL KINDY', defaultTitle: 'Penerimaan Peserta Didik Baru (PPDB)', defaultSub: "Sekolah Dasar Berbasis Al-Qur'an & Karakter Islami", defaultLink: '/ppdb#sdi', defaultImg: '/media/logo/SDI.jpg' },
      { id: 'mi', defaultBadge: 'MI NAHJUL HUDA', defaultTitle: 'Penerimaan Peserta Didik Baru (PPDB)', defaultSub: 'Pendidikan Dasar Islam Terpadu & Berakhlak Mulia', defaultLink: '/ppdb#mi', defaultImg: '/media/logo/MI.jpg' },
      { id: 'mts', defaultBadge: 'MTS NAHJUL HUDA', defaultTitle: 'Penerimaan Murid Baru (SPMB)', defaultSub: 'Dapatkan Promo Spesial SPMB: GRATIS UANG PANGKAL!', defaultLink: '/ppdb#mts', defaultImg: '/media/logo/MTs.jpg' },
      { id: 'ma', defaultBadge: 'MA NAHJUL HUDA', defaultTitle: 'Penerimaan Murid Baru (SPMB)', defaultSub: 'Madrasah Aliyah Unggul Menuju Perguruan Tinggi Favorit', defaultLink: '/ppdb#ma', defaultImg: '/media/logo/MA.jpg' },
      { id: 'ponpes', defaultBadge: 'PONPES ASSURUR', defaultTitle: 'Penerimaan Santri Baru (PSB)', defaultSub: "Pondok Pesantren Tahfidz Qur'an & Pendalaman Kitab Kuning", defaultLink: '/ppdb#ponpes', defaultImg: '/media/logo/Ponpes.jpg' }
    ];

    return jenjangList.map(item => {
      const j = item.id;
      const previewEl = document.getElementById('popupSlideImgPreview_' + j);
      const imgSrc = (previewEl && previewEl.src) ? previewEl.src : (document.getElementById('popupSlideImgUrl_' + j)?.value || item.defaultImg);
      return {
        badge: getVal('popupSlideBadge_' + j, item.defaultBadge),
        title: getVal('popupSlideTitle_' + j, item.defaultTitle),
        subtitle: getVal('popupSlideSubtitle_' + j, item.defaultSub),
        link_url: getVal('popupSlideLink_' + j, item.defaultLink),
        image_url: imgSrc
      };
    });
  }

  function renderAdminPreviewSlide(index) {
    if (!adminPrevSlides || adminPrevSlides.length === 0) return;
    const total = adminPrevSlides.length;
    adminPrevIndex = ((index % total) + total) % total;
    const s = adminPrevSlides[adminPrevIndex];

    const elBadge = document.getElementById('adminPrevBadge');
    if (elBadge) elBadge.textContent = s.badge || 'PPDB';
    const elCounter = document.getElementById('adminPrevCounter');
    if (elCounter) elCounter.textContent = `${adminPrevIndex + 1} / ${total}`;
    const elTitle = document.getElementById('adminPrevTitle');
    if (elTitle) elTitle.textContent = s.title || '';
    const elSub = document.getElementById('adminPrevSubtitle');
    if (elSub) elSub.textContent = s.subtitle || '';
    const elImg = document.getElementById('adminPrevImage');
    if (elImg) {
      elImg.style.opacity = '0.3';
      setTimeout(() => {
        elImg.src = s.image_url || '/media/logo/SDI.jpg';
        elImg.style.opacity = '1';
      }, 80);
    }
    const elLink = document.getElementById('adminPrevLink');
    if (elLink) elLink.href = s.link_url || '/ppdb';

    // Dots
    const dotsContainer = document.getElementById('adminPrevDots');
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('button');
      dots.forEach((d, i) => {
        if (i === adminPrevIndex) {
          d.className = 'w-6 h-2 rounded-full bg-emerald-600 transition-all';
        } else {
          d.className = 'w-2 h-2 rounded-full bg-slate-300 hover:bg-slate-400 transition-all cursor-pointer';
        }
      });
    }
  }

  window.previewHomePopupFromAdmin = function () {
    adminPrevSlides = collectAdminPreviewSlides();
    adminPrevIndex = 0;
    renderAdminPreviewSlide(0);

    const modal = document.getElementById('adminPopupPreviewModal');
    if (modal) modal.classList.remove('hidden');

    const autoSlide = document.getElementById('popupBannerAutoSlide')?.checked ?? true;
    const duration = parseInt(getVal('popupBannerDuration', '5000'), 10) || 5000;

    if (adminPrevTimer) clearInterval(adminPrevTimer);
    if (autoSlide) {
      adminPrevTimer = setInterval(() => {
        renderAdminPreviewSlide(adminPrevIndex + 1);
      }, duration);
    }
  };

  window.closeAdminPopupPreview = function () {
    if (adminPrevTimer) {
      clearInterval(adminPrevTimer);
      adminPrevTimer = null;
    }
    const modal = document.getElementById('adminPopupPreviewModal');
    if (modal) modal.classList.add('hidden');
  };

  window.adminPrevStep = function (dir) {
    if (adminPrevTimer) {
      clearInterval(adminPrevTimer);
      adminPrevTimer = null;
    }
    renderAdminPreviewSlide(adminPrevIndex + dir);
  };

  window.adminPrevGoTo = function (index) {
    if (adminPrevTimer) {
      clearInterval(adminPrevTimer);
      adminPrevTimer = null;
    }
    renderAdminPreviewSlide(index);
  };

  // 6. Inisialisasi Listener
  function initKelolaBeranda() {
    console.log("[Kelola Beranda] Menjalankan initKelolaBeranda()...");
    window.loadBerandaData();

    // HANYA ada 1 tombol simpan untuk bagian Beranda
    const btnBeranda = document.getElementById('btnSimpanBeranda');
    if (btnBeranda && !btnBeranda.dataset.bound) {
      btnBeranda.dataset.bound = 'true';
      btnBeranda.addEventListener('click', window.handleSimpanBeranda);
    }

    const formBeranda = document.getElementById('formBeranda');
    if (formBeranda && !formBeranda.dataset.bound) {
      formBeranda.dataset.bound = 'true';
      formBeranda.addEventListener('submit', window.handleSimpanBeranda);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKelolaBeranda);
  } else {
    initKelolaBeranda();
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#beranda' || window.location.hash === '') {
      window.loadBerandaData();
    }
  });
})();
