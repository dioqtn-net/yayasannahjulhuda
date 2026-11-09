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

  function getCleanText(val) {
    if (!val) return '';
    if (typeof val === 'string' && (val.includes('<div') || val.includes('<p'))) {
      const temp = document.createElement('div');
      temp.innerHTML = val;
      return temp.textContent.trim();
    }
    return String(val).trim();
  }

  // 1. MUAT DATA KONTAK DARI SUPABASE
  window.loadContactFields = async function () {
    console.log("[Kelola Kontak] Memuat data kontak dari Supabase...");
    try {
      let rows = null;
      const supa = getSupabaseClient();
      if (supa) {
        try {
          const { data, error } = await withTimeout(
            supa.from('contact_settings').select('*'),
            8000
          );
          if (!error && Array.isArray(data)) rows = data;
        } catch (e) {
          console.warn("[Kelola Kontak] Supabase client SELECT error:", e);
        }
      }

      if (!rows) {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_settings?select=*`, {
            cache: 'no-store',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          });
          if (res.ok) {
            rows = await res.json();
          }
        } catch (e) {}
      }

      if (rows && rows.length > 0) {
        // 1. Banner Kontak (id: 0)
        const bannerRow = rows.find(r => Number(r.id) === 0);
        if (bannerRow) {
          setVal('kontakBannerTitle', bannerRow.foundation_name || 'Kontak & Lokasi');
          if (typeof window.setTextareaValueWithAlignment === 'function') {
            window.setTextareaValueWithAlignment('kontakBannerDesc', bannerRow.address || 'Silakan hubungi kami atau kunjungi langsung Yayasan Nahjul Huda.');
          } else {
            setVal('kontakBannerDesc', bannerRow.address || 'Silakan hubungi kami atau kunjungi langsung Yayasan Nahjul Huda.');
          }
        }

        // 2. Data Kontak Detail (id: 1)
        const contData = rows.find(r => Number(r.id) === 1);
        if (contData) {
          setVal('contact_address', contData.address || '');
          setVal('contact_phone', contData.phone || '');
          setVal('contact_wa1', contData.whatsapp1 || '');
          setVal('contact_wa2', contData.whatsapp2 || '');
          setVal('contact_email', contData.email || '');
          setVal('contact_hours', contData.operational_hours || '');
          setVal('contact_maps_url', contData.maps_embed_url || '');

          // Sinkronisasi ke Section Pengaturan Yayasan
          const namaYayasan = contData.foundation_name || 'Yayasan Nahjul Huda';
          setVal('setting_nama', namaYayasan);
          setVal('setting_wa', contData.whatsapp1 || contData.phone || '');
          setVal('setting_email', contData.email || '');
          setVal('setting_alamat', getCleanText(contData.address || ''));

          // Update header subtitle di Panel Admin
          const adminSub = document.getElementById('adminHeaderSubtitle') || document.querySelector('header p.text-xs.text-slate-500');
          if (adminSub && namaYayasan) {
            adminSub.innerHTML = `${namaYayasan} &bull; Sistem Informasi &amp; Kelola Konten`;
          }
        }
      }
    } catch (e) {
      console.error("[Kelola Kontak] Gagal memuat data kontak:", e);
    }
  };
  window.loadKontakData = window.loadContactFields;
  window.loadPengaturanData = window.loadContactFields;

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
      const supa = getSupabaseClient();

      // 1. Simpan Banner Kontak (id: 0)
      const bannerTitle = getVal('kontakBannerTitle', 'Kontak & Lokasi');
      const bannerDesc = (typeof window.getWrappedTextareaValue === 'function')
        ? window.getWrappedTextareaValue('kontakBannerDesc')
        : getVal('kontakBannerDesc', 'Silakan hubungi kami atau kunjungi langsung Yayasan Nahjul Huda.');

      const bannerPayload = {
        id: 0,
        foundation_name: bannerTitle,
        address: bannerDesc,
        updated_at: new Date().toISOString()
      };

      if (supa) {
        try {
          await withTimeout(
            supa.from('contact_settings').upsert(bannerPayload, { onConflict: 'id' }),
            10000
          );
        } catch (e) {
          console.warn("[Kelola Kontak] Upsert banner client error:", e);
        }
      } else {
        try {
          await withTimeout(restPatch('contact_settings', 0, bannerPayload), 10000);
        } catch(e) {}
      }

      // 2. Simpan Data Kontak Detail (id: 1)
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

      alert("Alhamdulillah! Banner dan Informasi Kontak berhasil disimpan secara online ke database Supabase.\nPerubahan sudah aktif di semua perangkat.");
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
      const nama = getVal('setting_nama', 'Yayasan Nahjul Huda');
      const wa = getVal('setting_wa');
      const email = getVal('setting_email');
      const alamat = getCleanText(getVal('setting_alamat'));

      const payload = {
        foundation_name: nama,
        address: alamat,
        phone: wa,
        whatsapp1: wa,
        email: email,
        updated_at: new Date().toISOString()
      };

      console.log("[Kelola Pengaturan] Mengirim contact_settings ke Supabase...", payload);

      const supa = getSupabaseClient();
      let saveSuccess = false;

      if (supa) {
        try {
          const { error } = await withTimeout(
            supa.from('contact_settings').upsert({ id: 1, ...payload }, { onConflict: 'id' }),
            10000
          );
          if (!error) saveSuccess = true;
        } catch (e) {
          console.warn("[Kelola Pengaturan] Supabase client upsert warning:", e);
        }
      }

      if (!saveSuccess) {
        await withTimeout(restPatch('contact_settings', 1, payload), 10000);
        saveSuccess = true;
      }

      // Sinkronisasi ke profile_settings (nama yayasan, alamat, telepon/wa, email)
      try {
        const profPayload = {
          name: nama,
          address: alamat,
          phone: wa,
          email: email,
          updated_at: new Date().toISOString()
        };
        if (supa) {
          await supa.from('profile_settings').upsert({ id: 1, ...profPayload }, { onConflict: 'id' });
        } else {
          await restPatch('profile_settings', 1, profPayload);
        }
      } catch (errProf) {
        console.warn("[Kelola Pengaturan] Sync ke profile_settings warning:", errProf);
      }

      // Sinkronisasi ke ppdb_info (sekretariat_alamat)
      try {
        let ppdbRow = null;
        if (supa) {
          const { data } = await supa.from('ppdb_info').select('id, contact_person').eq('id', 1).maybeSingle();
          ppdbRow = data;
        }
        if (!ppdbRow) {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/ppdb_info?id=eq.1&select=id,contact_person`, {
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
          });
          if (res.ok) {
            const arr = await res.json();
            if (arr && arr.length > 0) ppdbRow = arr[0];
          }
        }
        if (ppdbRow && ppdbRow.contact_person) {
          const cp = typeof ppdbRow.contact_person === 'string' ? JSON.parse(ppdbRow.contact_person) : { ...ppdbRow.contact_person };
          cp.sekretariat_alamat = alamat;
          if (supa) {
            await supa.from('ppdb_info').update({ contact_person: cp, updated_at: new Date().toISOString() }).eq('id', 1);
          } else {
            await restPatch('ppdb_info', 1, { contact_person: cp, updated_at: new Date().toISOString() });
          }
        }
      } catch (errPpdb) {
        console.warn("[Kelola Pengaturan] Sync ke ppdb_info warning:", errPpdb);
      }

      // Perbarui juga form kontak di panel admin
      setVal('contact_address', alamat);
      setVal('contact_wa1', wa);
      setVal('contact_phone', wa);
      setVal('contact_email', email);

      // Perbarui subtitle header panel admin secara real-time
      const adminSub = document.getElementById('adminHeaderSubtitle') || document.querySelector('header p.text-xs.text-slate-500');
      if (adminSub && nama) {
        adminSub.innerHTML = `${nama} &bull; Sistem Informasi &amp; Kelola Konten`;
      }

      try {
        localStorage.removeItem('cmsData_contact');
        localStorage.removeItem('cmsData_pengaturan');
      } catch (e) {}

      alert("Alhamdulillah! Profil dan Kontak Yayasan berhasil disimpan ke database Supabase.\nPerubahan sudah aktif di seluruh halaman website.");
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
