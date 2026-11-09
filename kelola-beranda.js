/**
 * kelola-beranda.js
 * Sistem Admin Kelola Beranda - 100% PURE SUPABASE (BEBAS LOCALSTORAGE / ANTI-FATAMORGANA)
 */

(function () {
  const SUPABASE_URL = "https://lrorriksjooxrpoihfge.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

  // Bersihkan sisa-sisa cache lama dari memori browser
  try {
    localStorage.removeItem('cmsData_beranda');
  } catch (e) {}

  function getSupabaseClient() {
    if (window.supabaseClient) return window.supabaseClient;
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return window.supabaseClient;
    }
    return null;
  }

  function getVal(id, fallback = '') {
    const el = document.getElementById(id);
    return el && typeof el.value === 'string' ? el.value.trim() : fallback;
  }

  function getSafeTextareaValue(id, fallback = '') {
    try {
      const el = document.getElementById(id);
      if (!el) return fallback;
      if (typeof window.getWrappedTextareaValue === 'function') {
        const wrapped = window.getWrappedTextareaValue(id);
        if (wrapped && wrapped.trim() !== '') return wrapped;
      }
      const val = el.value ? el.value.trim() : '';
      if (!val) return fallback;
      const align = el.dataset && el.dataset.align ? el.dataset.align : 'text-justify';
      return `<div class="${align}">${val}</div>`;
    } catch (err) {
      const el = document.getElementById(id);
      return el && el.value ? el.value.trim() : fallback;
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

  // 1. SELECT DARI SUPABASE (HANYA DARI ONLINE DATABASE)
  window.loadBerandaData = async function () {
    try {
      const supa = getSupabaseClient();
      if (!supa) return;

      const { data: home, error: errHome } = await supa
        .from('home_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (!errHome && home) {
        if (home.hero_title && document.getElementById('heroTitle')) document.getElementById('heroTitle').value = home.hero_title;
        if (home.hero_desc) setSafeTextareaValue('heroDesc', home.hero_desc);
        if (home.tagline_title && document.getElementById('taglineTitle')) document.getElementById('taglineTitle').value = home.tagline_title;
        if (home.tagline_desc) setSafeTextareaValue('taglineDesc', home.tagline_desc);
        if (home.stat1_num && document.getElementById('stat1Num')) document.getElementById('stat1Num').value = home.stat1_num;
        if (home.stat1_text && document.getElementById('stat1Text')) document.getElementById('stat1Text').value = home.stat1_text;
        if (home.stat2_num && document.getElementById('stat2Num')) document.getElementById('stat2Num').value = home.stat2_num;
        if (home.stat2_text && document.getElementById('stat2Text')) document.getElementById('stat2Text').value = home.stat2_text;
        if (home.stat3_num && document.getElementById('stat3Num')) document.getElementById('stat3Num').value = home.stat3_num;
        if (home.stat3_text && document.getElementById('stat3Text')) document.getElementById('stat3Text').value = home.stat3_text;
        if (home.stat4_num && document.getElementById('stat4Num')) document.getElementById('stat4Num').value = home.stat4_num;
        if (home.stat4_text && document.getElementById('stat4Text')) document.getElementById('stat4Text').value = home.stat4_text;
        if (home.social_prog1_title && document.getElementById('progSosial1Title')) document.getElementById('progSosial1Title').value = home.social_prog1_title;
        if (home.social_prog1_desc) setSafeTextareaValue('progSosial1Desc', home.social_prog1_desc);
        if (home.social_prog2_title && document.getElementById('progSosial2Title')) document.getElementById('progSosial2Title').value = home.social_prog2_title;
        if (home.social_prog2_desc) setSafeTextareaValue('progSosial2Desc', home.social_prog2_desc);
      }

      const { data: ppdb, error: errPpdb } = await supa
        .from('ppdb_info')
        .select('academic_year, status')
        .eq('id', 1)
        .maybeSingle();

      if (!errPpdb && ppdb) {
        if (ppdb.academic_year && document.getElementById('ppdbYear')) document.getElementById('ppdbYear').value = ppdb.academic_year;
        if (ppdb.status && document.getElementById('ppdbStatus')) document.getElementById('ppdbStatus').value = ppdb.status;
      }
    } catch (e) {
      console.warn("[Kelola Beranda] Gagal mengambil data Supabase:", e);
    }
  };

  // 2. UPSERT KE SUPABASE (HANYA KE ONLINE DATABASE)
  window.handleSimpanBeranda = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const targetBtn = (e && e.currentTarget) || document.getElementById('btnSimpanBeranda') || document.getElementById('btnSimpanTagline');
    const originalBtnHtml = targetBtn ? targetBtn.innerHTML : '';

    try {
      if (targetBtn) {
        targetBtn.disabled = true;
        targetBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan ke server...';
      }

      const supa = getSupabaseClient();
      if (!supa) {
        throw new Error("Koneksi Supabase belum siap.");
      }

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

      const { data: homeRes, error: errHome } = await supa
        .from('home_settings')
        .upsert(homePayload, { onConflict: 'id' })
        .select();

      if (errHome) throw errHome;

      const { data: ppdbRes, error: errPpdb } = await supa
        .from('ppdb_info')
        .upsert({
          id: 1,
          academic_year: ppdbYear,
          status: ppdbStatus,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })
        .select();

      if (errPpdb) throw errPpdb;

      // Pastikan tidak ada sisa cache di localStorage
      try {
        localStorage.removeItem('cmsData_beranda');
      } catch (e) {}

      alert("Data Beranda berhasil disimpan secara online ke database Supabase!");
    } catch (error) {
      console.error("[Kelola Beranda] Error simpan Supabase:", error);
      alert("Gagal menyimpan ke Supabase: " + (error.message || error));
    } finally {
      if (targetBtn) {
        targetBtn.disabled = false;
        targetBtn.innerHTML = originalBtnHtml;
      }
    }
  };

  function initKelolaBeranda() {
    window.loadBerandaData();

    const btnSaveTagline = document.getElementById('btnSimpanTagline');
    if (btnSaveTagline && !btnSaveTagline.dataset.bound) {
      btnSaveTagline.dataset.bound = 'true';
      btnSaveTagline.addEventListener('click', window.handleSimpanBeranda);
    }

    const btnSaveBeranda = document.getElementById('btnSimpanBeranda');
    if (btnSaveBeranda && !btnSaveBeranda.dataset.bound) {
      btnSaveBeranda.dataset.bound = 'true';
      btnSaveBeranda.addEventListener('click', window.handleSimpanBeranda);
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
})();

