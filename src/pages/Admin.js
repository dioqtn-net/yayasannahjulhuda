import { api } from '../api';

export const renderAdmin = async (appDiv, router) => {
    
    // Check session
    const session = await api.getSession();
    
    if (!session) {
        renderLogin(appDiv, router);
        return;
    }

    // Load data for dashboard
    const profile = await api.getProfile();
    const units = await api.getEducationUnits();
    const news = await api.getNews();
    const ppdb = await api.getPPDB();
    const galleries = await api.getGalleries();

    // Dashboard State
    let currentTab = 'ringkasan';

    const renderDashboard = () => {
        let content = '';
        if (currentTab === 'ringkasan') {
            content = `
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div class="text-slate-500 mb-1">Total Jenjang</div>
                        <div class="text-3xl font-bold text-emerald-700">${units.length}</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div class="text-slate-500 mb-1">Total Berita</div>
                        <div class="text-3xl font-bold text-emerald-700">${news.length}</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div class="text-slate-500 mb-1">Total Foto Galeri</div>
                        <div class="text-3xl font-bold text-emerald-700">${galleries.length}</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div class="text-slate-500 mb-1">Status PPDB</div>
                        <div class="flex items-center justify-between">
                            <span class="text-xl font-bold ${ppdb?.status === 'BUKA' ? 'text-green-600' : 'text-red-600'}">${ppdb?.status || 'TUTUP'}</span>
                            <button id="btnTogglePPDB" class="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded transition">Ubah Status</button>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center text-slate-500">
                    <img src="/logo.png" class="h-24 mx-auto mb-4 opacity-50 grayscale">
                    <h2 class="text-2xl font-playfair font-bold text-slate-700 mb-2">Selamat Datang di CMS Yayasan Nahjul Huda</h2>
                    <p>Pilih menu di samping untuk mengelola konten website.</p>
                    ${!api.isSupabaseConnected() ? '<div class="mt-4 p-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg inline-block"><i class="fas fa-exclamation-triangle mr-2"></i><strong>Mode Fallback Aktif:</strong> Perubahan data hanya disimpan sementara di browser (Local Storage) karena Supabase Anon Key belum diatur.</div>' : ''}
                </div>
            `;
        } else if (currentTab === 'profil') {
            content = `
                <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                    <h2 class="text-2xl font-playfair font-bold text-emerald-800 mb-6 border-b pb-4">Kelola Profil & Kontak Yayasan</h2>
                    <form id="formProfile" class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Sejarah Berdirinya</label>
                            <textarea id="prof_history" rows="4" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">${profile.history}</textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Visi & Misi (Gunakan baris baru untuk list)</label>
                            <textarea id="prof_vision" rows="6" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">${profile.vision_mission}</textarea>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
                                <textarea id="prof_address" rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">${profile.address}</textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Jam Operasional</label>
                                <textarea id="prof_hours" rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">${profile.operational_hours}</textarea>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Nomor Telepon/WA</label>
                                <input type="text" id="prof_phone" value="${profile.phone}" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Email Resmi</label>
                                <input type="email" id="prof_email" value="${profile.email}" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                            </div>
                        </div>
                        <div class="flex justify-end pt-4 border-t">
                            <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center">
                                <i class="fas fa-save mr-2"></i> Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            `;
        } else if (currentTab === 'galeri') {
            let galleryItemsHTML = galleries.map(g => `
                <div class="bg-white border rounded-lg overflow-hidden shadow-sm relative group">
                    <img src="${g.image_url}" class="w-full h-40 object-cover" alt="${g.title}">
                    <div class="p-3">
                        <p class="font-medium text-slate-800 text-sm truncate">${g.title}</p>
                    </div>
                    <button data-id="${g.id}" data-url="${g.image_url}" class="btn-delete-gallery absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600 shadow-lg">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');

            content = `
                <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100 mb-8">
                    <h2 class="text-2xl font-playfair font-bold text-emerald-800 mb-6 border-b pb-4">Tambah Foto Galeri</h2>
                    <form id="formGallery" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Judul Foto</label>
                            <input type="text" id="gal_title" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">File Foto (Akan dikompres otomatis)</label>
                            <input type="file" id="gal_file" accept="image/*" required class="w-full px-4 py-2 border rounded-lg">
                            <p id="compressionInfo" class="text-xs text-slate-500 mt-2 hidden"></p>
                        </div>
                        <div class="flex justify-end pt-4">
                            <button type="submit" id="btnUpload" class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center">
                                <i class="fas fa-upload mr-2"></i> Upload Foto
                            </button>
                        </div>
                    </form>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    ${galleryItemsHTML}
                </div>
            `;
        } else {
            content = `<div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center"><i class="fas fa-tools text-4xl text-slate-300 mb-4"></i><p class="text-slate-500">Fitur pengelolaan ${currentTab} belum diimplementasikan sepenuhnya pada demo ini. Anda dapat mengembangkannya dengan memanggil fungsi CRUD Supabase di api.js.</p></div>`;
        }

        const html = `
            <div class="min-h-screen flex flex-col md:flex-row bg-slate-50">
                <!-- Sidebar -->
                <aside class="w-full md:w-64 bg-emerald-900 text-emerald-100 flex flex-col shadow-xl z-10 md:min-h-screen">
                    <div class="p-6 border-b border-emerald-800 flex items-center justify-center md:justify-start">
                        <img src="/logo.png" class="h-8 w-8 mr-3 bg-white rounded p-0.5">
                        <span class="font-playfair font-bold text-white text-lg">CMS Admin</span>
                    </div>
                    <nav class="flex-1 p-4 space-y-2 overflow-y-auto flex md:block overflow-x-auto whitespace-nowrap">
                        <a href="#" data-tab="ringkasan" class="tab-link flex items-center px-4 py-3 rounded-lg transition ${currentTab==='ringkasan' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-emerald-800 hover:text-white'}">
                            <i class="fas fa-home w-6"></i> <span class="hidden md:inline">Ringkasan</span>
                        </a>
                        <a href="#" data-tab="profil" class="tab-link flex items-center px-4 py-3 rounded-lg transition ${currentTab==='profil' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-emerald-800 hover:text-white'}">
                            <i class="fas fa-building w-6"></i> <span class="hidden md:inline">Profil Yayasan</span>
                        </a>
                        <a href="#" data-tab="jenjang" class="tab-link flex items-center px-4 py-3 rounded-lg transition ${currentTab==='jenjang' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-emerald-800 hover:text-white'}">
                            <i class="fas fa-school w-6"></i> <span class="hidden md:inline">Jenjang Pendidikan</span>
                        </a>
                        <a href="#" data-tab="ppdb" class="tab-link flex items-center px-4 py-3 rounded-lg transition ${currentTab==='ppdb' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-emerald-800 hover:text-white'}">
                            <i class="fas fa-user-graduate w-6"></i> <span class="hidden md:inline">Info PPDB</span>
                        </a>
                        <a href="#" data-tab="berita" class="tab-link flex items-center px-4 py-3 rounded-lg transition ${currentTab==='berita' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-emerald-800 hover:text-white'}">
                            <i class="fas fa-newspaper w-6"></i> <span class="hidden md:inline">Berita</span>
                        </a>
                        <a href="#" data-tab="galeri" class="tab-link flex items-center px-4 py-3 rounded-lg transition ${currentTab==='galeri' ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-emerald-800 hover:text-white'}">
                            <i class="fas fa-images w-6"></i> <span class="hidden md:inline">Galeri</span>
                        </a>
                    </nav>
                    <div class="p-4 border-t border-emerald-800">
                        <button id="btnLogout" class="w-full flex items-center justify-center px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white rounded-lg transition">
                            <i class="fas fa-sign-out-alt mr-2"></i> Logout
                        </button>
                    </div>
                </aside>

                <!-- Main Content -->
                <div class="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div class="flex justify-between items-center mb-8">
                        <h1 class="text-3xl font-playfair font-bold text-emerald-900">Dashboard Admin</h1>
                        <a href="/" data-navigo class="text-sm font-medium text-slate-500 hover:text-emerald-600 transition flex items-center">
                            <i class="fas fa-external-link-alt mr-1"></i> Lihat Web
                        </a>
                    </div>
                    ${content}
                </div>
            </div>
        `;
        appDiv.innerHTML = html;

        // Attach events
        document.querySelectorAll('.tab-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentTab = e.currentTarget.dataset.tab;
                renderDashboard();
            });
        });

        document.getElementById('btnLogout').addEventListener('click', async () => {
            await api.logout();
            window.location.href = '/kelola';
        });

        const formProfile = document.getElementById('formProfile');
        if (formProfile) {
            formProfile.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = e.target.querySelector('button[type="submit"]');
                btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan...';
                try {
                    await api.updateProfile({
                        id: profile.id,
                        history: document.getElementById('prof_history').value,
                        vision_mission: document.getElementById('prof_vision').value,
                        address: document.getElementById('prof_address').value,
                        operational_hours: document.getElementById('prof_hours').value,
                        phone: document.getElementById('prof_phone').value,
                        email: document.getElementById('prof_email').value
                    });
                    alert('Profil berhasil disimpan!');
                } catch (error) {
                    alert('Gagal menyimpan: ' + error.message);
                } finally {
                    btn.innerHTML = '<i class="fas fa-save mr-2"></i> Simpan Perubahan';
                }
            });
        }

        // Image compression helper
        const compressImage = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        const MAX_WIDTH = 1280;

                        if (width > MAX_WIDTH) {
                            height = Math.round((height * MAX_WIDTH) / width);
                            width = MAX_WIDTH;
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        canvas.toBlob((blob) => {
                            if (!blob) return reject(new Error('Canvas is empty'));
                            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                                type: 'image/webp',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        }, 'image/webp', 0.80);
                    };
                    img.onerror = (err) => reject(err);
                };
                reader.onerror = (err) => reject(err);
            });
        };

        const formGallery = document.getElementById('formGallery');
        const fileInput = document.getElementById('gal_file');
        const compressionInfo = document.getElementById('compressionInfo');

        if (fileInput) {
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) {
                    compressionInfo.classList.add('hidden');
                    return;
                }
                
                compressionInfo.classList.remove('hidden');
                compressionInfo.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Sedang memproses gambar...';
                
                try {
                    const compressed = await compressImage(file);
                    fileInput.compressedFile = compressed;
                    const originalMB = (file.size / (1024*1024)).toFixed(2);
                    const compressedMB = (compressed.size / (1024*1024)).toFixed(2);
                    compressionInfo.innerHTML = `<i class="fas fa-check-circle text-emerald-500 mr-1"></i> Gambar dikompresi: <b>${originalMB} MB</b> &rarr; <b>${compressedMB} MB</b>`;
                } catch (err) {
                    console.error("Compression error:", err);
                    compressionInfo.innerHTML = `<i class="fas fa-exclamation-triangle text-red-500 mr-1"></i> Gagal kompresi. Akan menggunakan file asli.`;
                }
            });
        }

        if (formGallery) {
            formGallery.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = document.getElementById('btnUpload');
                const title = document.getElementById('gal_title').value;
                const file = fileInput.compressedFile || fileInput.files[0];

                if (!api.isSupabaseConnected()) {
                    alert('Supabase Anon Key belum diatur. Mode fallback tidak mendukung upload gambar.');
                    return;
                }

                btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Mengunggah...';
                btn.disabled = true;
                
                try {
                    await api.addGallery(title, file);
                    // Refresh data
                    galleries.length = 0;
                    const newGalleries = await api.getGalleries();
                    galleries.push(...newGalleries);
                    renderDashboard();
                } catch (error) {
                    alert('Gagal mengunggah foto: ' + error.message);
                    btn.innerHTML = '<i class="fas fa-upload mr-2"></i> Upload Foto';
                    btn.disabled = false;
                }
            });
        }

        document.querySelectorAll('.btn-delete-gallery').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.dataset.id;
                const url = e.currentTarget.dataset.url;
                if(confirm('Hapus foto ini?')) {
                    const icon = e.currentTarget.querySelector('i');
                    icon.className = 'fas fa-spinner fa-spin';
                    try {
                        await api.deleteGallery(id, url);
                        galleries.length = 0;
                        const newGalleries = await api.getGalleries();
                        galleries.push(...newGalleries);
                        renderDashboard();
                    } catch (error) {
                        alert('Gagal menghapus: ' + error.message);
                        icon.className = 'fas fa-trash';
                    }
                }
            });
        });
    };

    renderDashboard();
};

const renderLogin = (appDiv, router) => {
    appDiv.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div class="bg-emerald-800 p-8 text-center">
                    <img src="/logo.png" alt="Logo" class="h-16 mx-auto mb-4 bg-white p-1 rounded-lg shadow">
                    <h2 class="text-2xl font-playfair font-bold text-white">Login Pengurus</h2>
                    <p class="text-emerald-200 mt-2 text-sm">CMS Yayasan Nahjul Huda</p>
                </div>
                <div class="p-8">
                    <div id="loginError" class="hidden mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 text-center"></div>
                    <form id="loginForm" class="space-y-6">
                        <div>
                            <label for="email" class="sr-only">Email address</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i class="fas fa-envelope text-slate-400"></i>
                                </div>
                                <input id="email" name="email" type="email" required class="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm bg-slate-50" placeholder="Email Address">
                            </div>
                        </div>
                        <div>
                            <label for="password" class="sr-only">Password</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i class="fas fa-lock text-slate-400"></i>
                                </div>
                                <input id="password" name="password" type="password" required class="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm bg-slate-50" placeholder="Password">
                            </div>
                        </div>
                        <div>
                            <button type="submit" id="loginBtn" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition shadow-md">
                                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <i class="fas fa-sign-in-alt text-emerald-500 group-hover:text-emerald-400"></i>
                                </span>
                                MASUK
                            </button>
                        </div>
                    </form>
                    <div class="mt-6 text-center">
                        <a href="/" data-navigo class="text-sm font-medium text-emerald-600 hover:text-emerald-500"><i class="fas fa-arrow-left mr-1"></i> Kembali ke Beranda Publik</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Rate limiting logic
    let attempts = parseInt(localStorage.getItem('login_attempts') || '0');
    let lockUntil = parseInt(localStorage.getItem('login_lock_until') || '0');

    const updateFormState = () => {
        const now = Date.now();
        const btn = document.getElementById('loginBtn');
        const err = document.getElementById('loginError');
        const form = document.getElementById('loginForm');

        if (lockUntil > now) {
            const minutesLeft = Math.ceil((lockUntil - now) / 60000);
            err.innerHTML = `<i class="fas fa-ban mr-1"></i> Form dikunci karena terlalu banyak percobaan. Coba lagi dalam ${minutesLeft} menit.`;
            err.classList.remove('hidden');
            Array.from(form.elements).forEach(el => el.disabled = true);
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            setTimeout(updateFormState, 60000); // Check again in 1 min
            return false;
        } else if (lockUntil > 0) {
            // Lock expired
            attempts = 0;
            lockUntil = 0;
            localStorage.setItem('login_attempts', '0');
            localStorage.setItem('login_lock_until', '0');
            err.classList.add('hidden');
            Array.from(form.elements).forEach(el => el.disabled = false);
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        return true;
    };

    updateFormState();

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!updateFormState()) return;

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = document.getElementById('loginBtn');
        const err = document.getElementById('loginError');

        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Memproses...';
        btn.disabled = true;

        try {
            await api.login(email, password);
            // Success
            attempts = 0;
            localStorage.setItem('login_attempts', '0');
            window.location.reload(); // reload to render dashboard
        } catch (error) {
            attempts++;
            localStorage.setItem('login_attempts', attempts.toString());
            
            if (attempts >= 5) {
                const lockTime = Date.now() + 15 * 60000; // 15 mins
                lockUntil = lockTime;
                localStorage.setItem('login_lock_until', lockTime.toString());
                updateFormState();
            } else {
                err.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i> Email atau password salah! (Sisa percobaan: ${5 - attempts})`;
                err.classList.remove('hidden');
                btn.innerHTML = 'MASUK';
                btn.disabled = false;
            }
        }
    });
};
