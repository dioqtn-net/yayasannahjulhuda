// kelola-profil.js - Logika Pengelolaan Konten Profil Yayasan, Sejarah, dan Struktur Organisasi
document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Toolbar Alignment untuk seluruh tombol .btn-align
    function initAlignmentToolbars() {
        document.querySelectorAll('.btn-align').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const parentToolbar = btn.closest('div');
                if (!parentToolbar) return;

                const parentBlock = btn.closest('.mb-4, .space-y-4, .p-4') || btn.parentElement.parentElement;
                const ta = parentBlock ? parentBlock.querySelector('textarea') : null;

                parentToolbar.querySelectorAll('.btn-align').forEach(b => {
                    b.classList.remove('bg-green-700', 'text-white');
                    b.classList.add('hover:bg-gray-200', 'text-gray-600');
                });
                btn.classList.remove('hover:bg-gray-200', 'text-gray-600');
                btn.classList.add('bg-green-700', 'text-white');

                const align = btn.getAttribute('data-align') || 'text-justify';
                if (ta) {
                    ta.dataset.align = align;
                    ta.style.textAlign = align.replace('text-', '');
                }
            });
        });
    }

    // 2. Helper bungkus payload ke format CMS <div class="...">
    function getWrappedValue(id) {
        const el = document.getElementById(id);
        if (!el) return '';
        const raw = el.value || '';
        if (raw.trim() === '') return '';
        const align = el.dataset.align || 'text-justify';
        return `<div class="${align}">${raw}</div>`;
    }

    // 3. Helper ekstrak dan set nilai dengan alignment
    function loadValueWithAlign(id, dbValue, fallback = '') {
        const el = document.getElementById(id);
        if (!el) return;
        const valToParse = dbValue || fallback || '';
        let cleanText = valToParse;
        let alignClass = 'text-justify';

        if (typeof valToParse === 'string' && valToParse.trim().startsWith('<div')) {
            const temp = document.createElement('div');
            temp.innerHTML = valToParse;
            const wrapper = temp.firstElementChild;
            if (wrapper && wrapper.tagName === 'DIV') {
                alignClass = wrapper.className.replace('whitespace-pre-wrap', '').trim() || 'text-justify';
                cleanText = wrapper.innerHTML.replace(/<br\s*[\/]?>/gi, '\n').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            }
        }

        el.value = cleanText;
        el.dataset.align = alignClass;
        el.style.textAlign = alignClass.replace('text-', '');

        // Aktifkan tombol alignment yang sesuai jika ada toolbar
        const parentBlock = el.closest('.mb-4, .space-y-4, .p-4') || el.parentElement;
        if (parentBlock) {
            const toolbar = parentBlock.querySelector('.btn-align')?.closest('div');
            if (toolbar) {
                const targetBtn = toolbar.querySelector(`.btn-align[data-align="${alignClass}"]`);
                if (targetBtn) {
                    toolbar.querySelectorAll('.btn-align').forEach(b => {
                        b.classList.remove('bg-green-700', 'text-white');
                        b.classList.add('hover:bg-gray-200', 'text-gray-600');
                    });
                    targetBtn.classList.remove('hover:bg-gray-200', 'text-gray-600');
                    targetBtn.classList.add('bg-green-700', 'text-white');
                }
            }
        }
    }

    // Helper resolve Supabase client
    const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL)
        ? import.meta.env.VITE_SUPABASE_URL
        : "https://lrorriksjooxrpoihfge.supabase.co";
    const SUPABASE_ANON_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY)
        ? import.meta.env.VITE_SUPABASE_ANON_KEY
        : "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

    function getSupabase() {
        if (window.supabaseClient) return window.supabaseClient;
        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                auth: { persistSession: true },
                global: {
                    fetch: (url, options = {}) => {
                        options.cache = 'no-store';
                        options.headers = options.headers || {};
                        options.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
                        options.headers['Pragma'] = 'no-cache';
                        return fetch(url, options);
                    }
                }
            });
            return window.supabaseClient;
        }
        return null;
    }

    // 4. Muat Data Tersimpan (Hanya Banner, Sejarah, Struktur Organisasi)
    async function loadProfilData() {
        initAlignmentToolbars();
        try {
            const raw = localStorage.getItem('cmsData_profil');
            let data = raw ? JSON.parse(raw) : {};

            // Muat dari Supabase jika koneksi aktif
            const supa = getSupabase();
            if (supa) {
                try {
                    const { data: dbData, error } = await supa
                        .from('profile_settings')
                        .select('*')
                        .eq('id', 1)
                        .maybeSingle();
                    if (!error && dbData) {
                        if (dbData.banner_title || dbData.name) data.profilTitle = dbData.banner_title || dbData.name;
                        if (dbData.banner_desc) data.profilDesc = dbData.banner_desc;
                        if (dbData.history) data.sejarahText = dbData.history;
                        if (dbData.struktur_title) data.strukturTitle = dbData.struktur_title;
                        if (dbData.struktur_desc) data.strukturDesc = dbData.struktur_desc;

                        if (dbData.pengurus && typeof dbData.pengurus === 'object') {
                            const p = dbData.pengurus;
                            if (p.namaKetua !== undefined) data.namaKetua = p.namaKetua;
                            if (p.fotoKetua !== undefined) data.fotoKetua = p.fotoKetua;
                            if (p.namaSDI !== undefined) data.namaSDI = p.namaSDI;
                            if (p.fotoSDI !== undefined) data.fotoSDI = p.fotoSDI;
                            if (p.namaMI !== undefined) data.namaMI = p.namaMI;
                            if (p.fotoMI !== undefined) data.fotoMI = p.fotoMI;
                            if (p.namaMTs !== undefined) data.namaMTs = p.namaMTs;
                            if (p.fotoMTs !== undefined) data.fotoMTs = p.fotoMTs;
                            if (p.namaMA !== undefined) data.namaMA = p.namaMA;
                            if (p.fotoMA !== undefined) data.fotoMA = p.fotoMA;
                            if (p.namaMudir !== undefined) data.namaMudir = p.namaMudir;
                            if (p.fotoMudir !== undefined) data.fotoMudir = p.fotoMudir;
                        }

                        localStorage.setItem('cmsData_profil', JSON.stringify(data));
                    }
                } catch (err) {
                    console.warn('Gagal memuat profil awal dari Supabase:', err);
                }
            }

            const setInput = (id, val, def = '') => {
                const el = document.getElementById(id);
                if (el) el.value = val !== undefined && val !== null ? val : def;
            };

            setInput('profilTitle', data.profilTitle, 'Profil Yayasan');
            loadValueWithAlign('profilDesc', data.profilDesc, 'Mengenal lebih dekat sejarah, visi, misi, target lulusan, dan struktur kepengurusan Yayasan Nahjul Huda.');
            loadValueWithAlign('sejarahText', data.sejarahText, '-');
            setInput('strukturTitle', data.strukturTitle, 'Struktur Organisasi');
            loadValueWithAlign('strukturDesc', data.strukturDesc, 'Struktur kepengurusan Yayasan Nahjul Huda berdedikasi tinggi untuk memajukan lembaga tercinta.');
            setInput('namaKetua', data.namaKetua, '-');
            setInput('namaSDI', data.namaSDI, '-');
            setInput('namaMI', data.namaMI, '-');
            setInput('namaMTs', data.namaMTs, '-');
            setInput('namaMA', data.namaMA, '-');
            setInput('namaMudir', data.namaMudir, '-');
        } catch (e) {
            console.error('Error loading profil data:', e);
        }
    }

    // 5. Simpan Data Profil
    async function saveProfilData(e) {
        if (e) e.preventDefault();

        const btnSave = document.getElementById('btnSimpanProfil') ||
            document.querySelector('button[type="submit"]') ||
            Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Simpan Perubahan Profil'));
        const originalBtnHtml = btnSave ? btnSave.innerHTML : '';

        try {
            if (btnSave) {
                btnSave.disabled = true;
                btnSave.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan ke server...';
            }

            const prevData = JSON.parse(localStorage.getItem('cmsData_profil') || '{}');

            const readFile = (inputId, prevVal) => {
                return new Promise((resolve) => {
                    const input = document.getElementById(inputId);
                    if (input && input.getAttribute('data-hapus') === 'true') {
                        resolve('');
                        return;
                    }
                    if (input && input.files && input.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (event) => resolve(event.target.result);
                        reader.onerror = () => resolve(prevVal || '');
                        reader.readAsDataURL(input.files[0]);
                    } else {
                        resolve(prevVal || '');
                    }
                });
            };

            const [fotoKetua, fotoSDI, fotoMI, fotoMTs, fotoMA, fotoMudir] = await Promise.all([
                readFile('fotoKetua', prevData.fotoKetua),
                readFile('fotoSDI', prevData.fotoSDI),
                readFile('fotoMI', prevData.fotoMI),
                readFile('fotoMTs', prevData.fotoMTs),
                readFile('fotoMA', prevData.fotoMA),
                readFile('fotoMudir', prevData.fotoMudir)
            ]);

            // Kumpulkan seluruh nilai input terbaru dari form ke dalam objek (payload)
            const payload = {
                profilTitle: document.getElementById('profilTitle')?.value || 'Profil Yayasan',
                profilDesc: getWrappedValue('profilDesc'),
                sejarahText: getWrappedValue('sejarahText'),
                strukturTitle: document.getElementById('strukturTitle')?.value || 'Struktur Organisasi',
                strukturDesc: getWrappedValue('strukturDesc'),
                namaKetua: document.getElementById('namaKetua')?.value || '-',
                fotoKetua: fotoKetua,
                namaSDI: document.getElementById('namaSDI')?.value || '-',
                fotoSDI: fotoSDI,
                namaMI: document.getElementById('namaMI')?.value || '-',
                fotoMI: fotoMI,
                namaMTs: document.getElementById('namaMTs')?.value || '-',
                fotoMTs: fotoMTs,
                namaMA: document.getElementById('namaMA')?.value || '-',
                fotoMA: fotoMA,
                namaMudir: document.getElementById('namaMudir')?.value || '-',
                fotoMudir: fotoMudir
            };

            // Inisialisasi Supabase
            const supa = getSupabase();
            if (!supa) {
                throw new Error("Koneksi Supabase belum siap atau client tidak termuat.");
            }

            // Eksekusi perintah update/upsert ke Supabase (tabel profile_settings, baris id: 1)
            const supabasePayload = {
                id: 1,
                name: payload.profilTitle || 'Yayasan Nahjul Huda',
                banner_title: payload.profilTitle || 'Profil Yayasan',
                banner_desc: payload.profilDesc || '',
                history: payload.sejarahText || '',
                struktur_title: payload.strukturTitle || 'Struktur Organisasi',
                struktur_desc: payload.strukturDesc || '',
                pengurus: {
                    namaKetua: payload.namaKetua, fotoKetua: payload.fotoKetua,
                    namaSDI: payload.namaSDI, fotoSDI: payload.fotoSDI,
                    namaMI: payload.namaMI, fotoMI: payload.fotoMI,
                    namaMTs: payload.namaMTs, fotoMTs: payload.fotoMTs,
                    namaMA: payload.namaMA, fotoMA: payload.fotoMA,
                    namaMudir: payload.namaMudir, fotoMudir: payload.fotoMudir
                },
                updated_at: new Date().toISOString()
            };

            let { data, error } = await supa
                .from('profile_settings')
                .update(supabasePayload)
                .eq('id', 1)
                .select();

            if (error || !data || data.length === 0) {
                const upsertRes = await supa
                    .from('profile_settings')
                    .upsert(supabasePayload, { onConflict: 'id' })
                    .select();
                error = upsertRes.error;
            }

            // Validasi error: Jika ada error dari respons Supabase, paksa lempar error
            if (error) throw error;

            // SINKRONISASI UI & STORAGE: HANYA dieksekusi setelah Supabase berhasil 100%
            localStorage.setItem('cmsData_profil', JSON.stringify(payload));

            // Reset atribut hapus foto
            ['fotoKetua', 'fotoSDI', 'fotoMI', 'fotoMTs', 'fotoMA', 'fotoMudir'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.setAttribute('data-hapus', 'false');
            });

            alert("Data profil berhasil diperbarui di database publik!");
            window.location.reload();
        } catch (error) {
            console.error("Supabase Error:", error);
            alert("Gagal menyimpan ke server: " + error.message);
            if (btnSave) {
                btnSave.disabled = false;
                btnSave.innerHTML = originalBtnHtml;
            }
        }
    }

    // Inisialisasi awal
    loadProfilData();

    // Event listener tombol simpan
    const btnSave = document.getElementById('btnSimpanProfil') ||
        document.querySelector('button[type="submit"]') ||
        Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Simpan Perubahan Profil'));

    if (btnSave) {
        btnSave.addEventListener('click', saveProfilData);
    }

    const formProfil = document.getElementById('formProfil');
    if (formProfil) {
        formProfil.addEventListener('submit', saveProfilData);
    }
});
