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

    // 4. Muat Data Tersimpan (Hanya Banner, Sejarah, Struktur Organisasi)
    function loadProfilData() {
        initAlignmentToolbars();
        try {
            const raw = localStorage.getItem('cmsData_profil');
            const data = raw ? JSON.parse(raw) : {};

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
        try {
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

            localStorage.setItem('cmsData_profil', JSON.stringify(payload));

            // Reset atribut hapus foto
            ['fotoKetua', 'fotoSDI', 'fotoMI', 'fotoMTs', 'fotoMA', 'fotoMudir'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.setAttribute('data-hapus', 'false');
            });

            alert('Sukses! Perubahan Profil berhasil disimpan.');
        } catch (err) {
            console.error('Gagal menyimpan profil:', err);
            alert('Terjadi kesalahan saat menyimpan data profil: ' + err.message);
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
