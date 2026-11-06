// kelola-profil.js - Logika Pengelolaan Konten Profil Yayasan, Visi, Misi, Target Lulusan, dan Struktur Organisasi
document.addEventListener('DOMContentLoaded', () => {
    // 1. Data Default Fallback
    const defaultVisi = '"Terwujudnya lembaga pendidikan yang profesional, peduli, dan kompetitif guna terwujudnya generasi qur\'ani, berakhlak mulia, cerdas, kreatif, aktif, berprestasi, dan berwawasan global."';
    const defaultMisi = `Melaksanakan pendidikan berdasarkan Al Qur'an dan Hadits guna mewujudkan peserta didik beraqidah baik, berakhlak mulia, jujur, percaya diri, bertanggung jawab, mandiri, dan peduli.
Menumbuhkembangkan kecintaan terhadap Al Qur'an dengan kompetensi membaca Al Qur'an sesuai kaidah tajwid, menulis Al Qur'an dengan baik dan benar, menghafal Al Qur'an dalam kehidupan sehari-hari.
Membekali peserta didik dengan ketrampilan abad 21 dan berwawasan global (berfikir kritis, kreatif, kolaboratif, komunikatif, dan kemampuan literasi) untuk mengembangkan jiwa kepemimpinan sehingga mampu menjadi rahmatan lil 'alamin.
Memfasilitasi proses pembelajaran yang aktif, kreatif, efektif, menyenangkan dan membahagiakan.
Memfasilitasi peserta didik untuk mengembangkan potensi diri sesuai dengan bakat, minat dan kecerdasan (Multiple Intelegences).
Bekerjasama dengan berbagai pihak untuk mengembangkan kualitas SDM sehingga melahirkan pendidik yang kompeten, berdedikasi, istiqomah dan rendah hati.
Secara kelembagaan terus menerus melakukan inovasi agar mampu menjadi lembaga pendidikan yang memberikan inspirasi dalam pengembangan pendidikan di Indonesia.`;
    const defaultTargetPengantar = 'Yayasan Nahjul Huda berkomitmen melahirkan lulusan unggul dengan standar capaian karakter, keilmuan, dan kepribadian:';
    const defaultTargetPoin = `Melahirkan generasi Qur'ani: mencintai Al Qur'an sebagai pedoman hidup, mampu membaca, menulis, dan menghafal Al Qur'an dengan baik dan benar.
Memiliki aqidah yang baik dan benar sesuai Al Qur'an dan Hadits.
Mampu beribadah baik dan benar sesuai Al Qur'an dan Hadits.
Membina jiwa mandiri dan cinta tanah air (Hubbul Wathon Minal Iman).`;

    // 2. Setup Toolbar Alignment untuk seluruh tombol .btn-align
    function initAlignmentToolbars() {
        document.querySelectorAll('.btn-align').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const parentToolbar = btn.closest('div');
                if (!parentToolbar) return;

                // Cari container wrapper atau textarea terdekat
                const parentBlock = btn.closest('.mb-4, .space-y-4, .p-4') || btn.parentElement.parentElement;
                const ta = parentBlock ? parentBlock.querySelector('textarea') : null;

                // Update class tombol di toolbar yang sama
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

    // 3. Helper bungkus payload ke format CMS <div class="...">
    function getWrappedValue(id) {
        const el = document.getElementById(id);
        if (!el) return '';
        const raw = el.value || '';
        if (raw.trim() === '') return '';
        const align = el.dataset.align || 'text-justify';
        return `<div class="${align}">${raw}</div>`;
    }

    // 4. Helper ekstrak dan set nilai dengan alignment
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

        // Aktifkan tombol alignment yang sesuai
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

    // 5. Muat Data Tersimpan
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
            loadValueWithAlign('teks_visi_profil', data.teks_visi_profil || data.visi, defaultVisi);
            loadValueWithAlign('teks_misi_profil', data.teks_misi_profil || data.misi, defaultMisi);
            loadValueWithAlign('pengantar_target_profil', data.pengantar_target_profil || data.targetPengantar, defaultTargetPengantar);
            loadValueWithAlign('poin_target_profil', data.poin_target_profil || data.targetPoin, defaultTargetPoin);
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

    // 6. Simpan Data Profil
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
                teks_visi_profil: getWrappedValue('teks_visi_profil'),
                teks_misi_profil: getWrappedValue('teks_misi_profil'),
                pengantar_target_profil: getWrappedValue('pengantar_target_profil'),
                poin_target_profil: getWrappedValue('poin_target_profil'),
                visi: getWrappedValue('teks_visi_profil'),
                misi: getWrappedValue('teks_misi_profil'),
                targetPengantar: getWrappedValue('pengantar_target_profil'),
                targetPoin: getWrappedValue('poin_target_profil'),
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

            alert('Sukses! Perubahan Profil, Visi, Misi, Target Lulusan, dan Struktur Organisasi berhasil disimpan.');
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
