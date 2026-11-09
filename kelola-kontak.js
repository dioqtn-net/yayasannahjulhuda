/**
 * =======================================================================
 * KELOLA KONTAK & PENGATURAN (PANEL ADMIN) - 100% PURE SUPABASE
 * Aturan Mutlak: NO localStorage.getItem / NO localStorage.setItem
 * Fitur: Synchronized Contact & Profile Settings, 15s Timeout & Native REST Fallback
 * =======================================================================
 */

(function () {
  console.log("[Kelola Kontak] Skrip kelola-kontak.js dimuat...");

  const SUPABASE_URL = "https://lrorriksjooxrpoihfge.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

  let isSaving = false;

  // Bersihkan cache lokal lama
  try {
    localStorage.removeItem('cmsData_contact');
    localStorage.removeItem('cmsData_pengaturan');
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
        console.warn("[Kelola Kontak] createClient warning:", err);
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

  async function restPatch(table, id, payload) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
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
      throw new Error(`REST PATCH ${table} ID ${id} gagal (${res.status}): ${text}`);
    }
    return await res.json();
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) {
      el.value = val;
    }
  }

  function getVal(id, fallback = '') {
    const el = document.getElementById(id);
    const val = el?.value;
    return (typeof val === 'string' && val.trim() !== '') ? val.trim() : fallback;
  }

  // 1. MUAT DATA KONTAK DARI SUPABASE
  window.loadContactFields = async function () {
    console.log("[Kelola Kontak] Memuat data kontak dari Supabase...");
    try {
      let contData = null;
      const supa = getSupabaseClient();
      if (supa) {
        try {
          const { data, error } = await withTimeout(
            supa.from('contact_settings').select('*').eq('id', 1).maybeSingle(),
            8000
          );
          if (!error && data) contData = data;
        } catch (e) {
          console.warn("[Kelola Kontak] Supabase client SELECT error:", e);
        }
      }

      if (!contData) {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_settings?id=eq.1&select=*`, {
            cache: 'no-store',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          });
          if (res.ok) {
            const rows = await res.json();
            if (rows && rows[0]) contData = rows[0];
          }
        } catch (e) {}
      }

      if (contData) {
        setVal('contact_address', contData.address || '');
        setVal('contact_phone', contData.phone || '');
        setVal('contact_wa1', contData.whatsapp1 || '');
        setVal('contact_wa2', contData.whatsapp2 || '');
        setVal('contact_email', contData.email || '');
        setVal('contact_hours', contData.operational_hours || '');
        setVal('contact_maps_url', contData.maps_embed_url || '');

        // Sinkronisasi ke Section Pengaturan Yayasan
        setVal('setting_nama', contData.foundation_name || 'Yayasan Nahjul Huda Jakarta');
        setVal('setting_wa', contData.whatsapp1 || contData.phone || '');
        setVal('setting_email', contData.email || '');
        setVal('setting_alamat', contData.address || '');
      }
    } catch (e) {
      console.error("[Kelola Kontak] Gagal memuat data kontak:", e);
    }
  };

  // 2. SIMPAN INFORMASI KONTAK (SECTION KONTAK)
  window.saveContactData = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isSaving) return;
    isSaving = true;

    const btn = document.getElementById('btnSimpanKontak') || document.querySelector('#formAdminKontak button[type="submit"]');
    const originalBtnHtml = '<i class="fas fa-save mr-1"></i> Simpan Informasi Kontak';

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan ke server...';
    }

    try {
      const address = getVal('contact_address');
      const phone = getVal('contact_phone');
      const wa1 = getVal('contact_wa1');
      const wa2 = getVal('contact_wa2');
      const email = getVal('contact_email');
      const operational_hours = getVal('contact_hours');
      const maps_embed_url = getVal('contact_maps_url');

      const payload = {
        id: 1,
        address,
        phone,
        whatsapp1: wa1,
        whatsapp2: wa2,
        email,
        operational_hours,
        maps_embed_url,
        updated_at: new Date().toISOString()
      };

      console.log("[Kelola Kontak] Mengirim contact_settings ke Supabase...", payload);

      const supa = getSupabaseClient();
      let saveSuccess = false;

      if (supa) {
        try {
          const { error } = await withTimeout(
            supa.from('contact_settings').upsert(payload, { onConflict: 'id' }),
            10000
          );
          if (!error) saveSuccess = true;
        } catch (e) {
          console.warn("[Kelola Kontak] Supabase client upsert warning:", e);
        }
      }

      if (!saveSuccess) {
        await withTimeout(restPatch('contact_settings', 1, payload), 10000);
        saveSuccess = true;
      }

      // Sinkronisasi data kontak ke profile_settings
      try {
        const profileSyncPayload = {
          address,
          phone: phone + (wa1 ? ' | WA: ' + wa1 : ''),
          email,
          operational_hours,
          updated_at: new Date().toISOString()
        };
        if (supa) {
          await supa.from('profile_settings').update(profileSyncPayload).eq('id', 1);
        } else {
          await restPatch('profile_settings', 1, profileSyncPayload);
        }
      } catch (errSync) {
        console.warn("[Kelola Kontak] Sync ke profile_settings warning:", errSync);
      }

      // Bersihkan cache lokal
      try {
        localStorage.removeItem('cmsData_contact');
        localStorage.removeItem('cmsData_pengaturan');
      } catch (e) {}

      // Perbarui nilai di form pengaturan juga
      setVal('setting_alamat', address);
      setVal('setting_wa', wa1 || phone);
      setVal('setting_email', email);

      alert("Alhamdulillah! Informasi Kontak berhasil disimpan secara online ke database Supabase.\nPerubahan sudah aktif di semua perangkat.");
    } catch (error) {
      console.error("[Kelola Kontak] Gagal menyimpan:", error);
      alert("Gagal menyimpan kontak:\n" + (error.message || error));
    } finally {
      isSaving = false;
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnHtml;
      }
    }
  };

  // 3. SIMPAN PENGATURAN YAYASAN (SECTION PENGATURAN)
  window.savePengaturanYayasan = async function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isSaving) return;
    isSaving = true;

    const btn = document.getElementById('btnSimpanPengaturan');
    const originalBtnHtml = 'Simpan Perubahan';

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan ke server...';
    }

    try {
      const nama = getVal('setting_nama', 'Yayasan Nahjul Huda Jakarta');
      const wa = getVal('setting_wa');
      const email = getVal('setting_email');
      const alamat = getVal('setting_alamat');

      const payload = {
        foundation_name: nama,
        address: alamat,
        whatsapp1: wa,
        email: email,
        updated_at: new Date().toISOString()
      };

      console.log("[Kelola Pengaturan] Mengirim ke Supabase...", payload);

      const supa = getSupabaseClient();
      let saveSuccess = false;

      if (supa) {
        try {
          const { error } = await withTimeout(
            supa.from('contact_settings').update(payload).eq('id', 1),
            10000
          );
          if (!error) saveSuccess = true;
        } catch (e) {
          console.warn("[Kelola Pengaturan] Supabase client update warning:", e);
        }
      }

      if (!saveSuccess) {
        await withTimeout(restPatch('contact_settings', 1, payload), 10000);
        saveSuccess = true;
      }

      // Sinkronisasi ke profile_settings
      try {
        const profPayload = {
          address: alamat,
          phone: wa,
          email: email,
          updated_at: new Date().toISOString()
        };
        if (supa) {
          await supa.from('profile_settings').update(profPayload).eq('id', 1);
        } else {
          await restPatch('profile_settings', 1, profPayload);
        }
      } catch (e) {}

      // Perbarui juga form kontak
      setVal('contact_address', alamat);
      setVal('contact_wa1', wa);
      setVal('contact_email', email);

      try {
        localStorage.removeItem('cmsData_contact');
        localStorage.removeItem('cmsData_pengaturan');
      } catch (e) {}

      alert("Alhamdulillah! Pengaturan Yayasan berhasil disimpan ke database Supabase.");
    } catch (error) {
      console.error("[Kelola Pengaturan] Gagal menyimpan:", error);
      alert("Gagal menyimpan pengaturan:\n" + (error.message || error));
    } finally {
      isSaving = false;
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnHtml;
      }
    }
  };

  function initKelolaKontak() {
    window.loadContactFields();

    const formKontak = document.getElementById('formAdminKontak');
    if (formKontak && !formKontak.dataset.bound) {
      formKontak.dataset.bound = 'true';
      formKontak.addEventListener('submit', window.saveContactData);
    }

    const btnSimpanKontak = document.getElementById('btnSimpanKontak');
    if (btnSimpanKontak && !btnSimpanKontak.dataset.bound) {
      btnSimpanKontak.dataset.bound = 'true';
      btnSimpanKontak.addEventListener('click', window.saveContactData);
    }

    const btnSimpanPengaturan = document.getElementById('btnSimpanPengaturan');
    if (btnSimpanPengaturan && !btnSimpanPengaturan.dataset.bound) {
      btnSimpanPengaturan.dataset.bound = 'true';
      btnSimpanPengaturan.addEventListener('click', window.savePengaturanYayasan);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKelolaKontak);
  } else {
    initKelolaKontak();
  }
})();
