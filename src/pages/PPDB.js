export const renderPPDB = (ppdb) => {
    const isBuka = ppdb?.status !== 'TUTUP';

    let cmsPPDB = null;
    try {
        const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('cmsData_ppdb') : null;
        if (raw) cmsPPDB = JSON.parse(raw);
    } catch(e) {}
    const headerTitle = cmsPPDB?.header_title || 'Penerimaan Peserta Didik Baru';
    const headerSubtitle = cmsPPDB?.header_subtitle || 'Papan Informasi Resmi Pendaftaran Peserta Didik Baru Yayasan Nahjul Huda';

    // Global switcher function for PPDB tabs
    if (typeof window !== 'undefined') {
        window.switchPPDBTab = function(key) {
            const panels = document.querySelectorAll('.ppdb-panel');
            panels.forEach(p => p.classList.add('hidden'));

            const targetPanel = document.getElementById(`ppdb-panel-${key}`);
            if (targetPanel) {
                targetPanel.classList.remove('hidden');
            }

            const tabBtns = document.querySelectorAll('.tab-btn-jenjang, .ppdb-tab-btn');
        tabBtns.forEach(btn => {
          const target = btn.getAttribute('data-target') || '';
          const btnKey = target.replace('tab-', '') || btn.getAttribute('data-ppdb-tab') || '';
          if (btnKey === key) {
            btn.classList.add('active');
            btn.style.backgroundColor = '#047857';
            btn.style.color = '#ffffff';
            btn.style.borderColor = '#047857';
          } else {
            btn.classList.remove('active');
            btn.style.backgroundColor = '#ffffff';
            btn.style.color = '#374151';
            btn.style.borderColor = '#e5e7eb';
          }
        });

            const select = document.getElementById('ppdb-select-jenjang');
            if (select && select.value !== key) {
                select.value = key;
            }
        };

        // Handle URL hash on load
        setTimeout(() => {
            const hash = window.location.hash.replace('#', '');
            if (hash && (hash === 'mi' || hash === 'mts' || hash === 'ma' || hash === 'ponpes' || hash === 'sdi')) {
                window.switchPPDBTab(hash);
            }
        }, 50);
    }

    return `
      <!-- Header PPDB -->
      <section class="relative bg-[url('/media/background/wallpaper_yayasan.jpg')] bg-cover bg-center bg-no-repeat text-white py-20 overflow-hidden">
        <!-- Dark Overlay Wrapper -->
        <div class="absolute inset-0 bg-black/75 z-0"></div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-center mb-4">
            <span class="inline-block px-5 py-1.5 rounded-full text-sm font-bold shadow-lg ${isBuka ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-red-500 text-white shadow-red-500/30'}">
              STATUS PENDAFTARAN: ${ppdb?.status || 'DIBUKA'}
            </span>
          </div>
          <h1 id="ppdb-header-title" class="text-2xl sm:text-3xl md:text-5xl font-playfair font-bold mb-4 text-gold-400 drop-shadow-md text-center">${headerTitle}</h1>
          <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-4"></div>
          <div id="ppdb-header-subtitle" class="text-white text-lg md:text-xl font-medium drop-shadow max-w-2xl mx-auto leading-relaxed">
            ${headerSubtitle}
          </div>
        </div>
      </section>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-slate-800">
        
        <!-- Navigation Tabs / Dropdown Pilihan Jenjang Pendidikan (5 Tab Terpisah) -->
        <div class="mb-10">
          <div class="text-center mb-6">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Papan Informasi Jenjang</span>
            <h2 class="text-2xl md:text-3xl font-playfair font-bold text-slate-900 mt-2">Pilih Jenjang Pendidikan</h2>
            <p class="text-slate-500 text-sm mt-1">Pilih jenjang untuk melihat informasi jadwal, berkas persyaratan, dan kontak pendaftaran.</p>
          </div>

          <!-- Dropdown untuk Layar Kecil (Mobile) -->
          <div class="block lg:hidden max-w-md mx-auto mb-4">
            <div class="relative">
              <select id="ppdb-select-jenjang" onchange="window.switchPPDBTab(this.value)" class="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 font-semibold text-slate-800 shadow-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none appearance-none">
                <option value="sdi">SD Islam (SDI) AL KINDY</option>
                <option value="mi">Madrasah Ibtidaiyah (MI)</option>
                <option value="mts" selected>Madrasah Tsanawiyah (MTs)</option>
                <option value="ma">Madrasah Aliyah (MA)</option>
                <option value="ponpes">Pondok Pesantren Assurur</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>

          <!-- KONTAINER TAB JENJANG (ANTI-KEPOTONG & BISA DI-SCROLL) -->
<div style="width: 100%; overflow-x: auto; padding-bottom: 16px; scrollbar-width: none; -ms-overflow-style: none;">
    <!-- Rahasianya ada di width: max-content dan margin: 0 auto -->
    <div style="display: flex; flex-wrap: nowrap; gap: 12px; width: max-content; margin: 0 auto; padding: 0 16px;">
        
        <!-- Tab 1: SDI -->
        <button type="button" class="tab-btn-jenjang" data-target="tab-sdi" onclick="window.switchPPDBTab('sdi')" style="white-space: nowrap; flex-shrink: 0; padding: 12px 24px; border-radius: 8px; border: 1px solid #e5e7eb; background-color: #ffffff; color: #374151; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease;">
            SD Islam (SDI) AL KINDY
        </button>
        
        <!-- Tab 2: MI -->
        <button type="button" class="tab-btn-jenjang" data-target="tab-mi" onclick="window.switchPPDBTab('mi')" style="white-space: nowrap; flex-shrink: 0; padding: 12px 24px; border-radius: 8px; border: 1px solid #e5e7eb; background-color: #ffffff; color: #374151; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease;">
            Madrasah Ibtidaiyah (MI)
        </button>
        
        <!-- Tab 3: MTs (Contoh Status Aktif) -->
        <button type="button" class="tab-btn-jenjang active" data-target="tab-mts" onclick="window.switchPPDBTab('mts')" style="white-space: nowrap; flex-shrink: 0; padding: 12px 24px; border-radius: 8px; border: 1px solid #047857; background-color: #047857; color: #ffffff; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease;">
            Madrasah Tsanawiyah (MTs)
        </button>
        
        <!-- Tab 4: MA -->
        <button type="button" class="tab-btn-jenjang" data-target="tab-ma" onclick="window.switchPPDBTab('ma')" style="white-space: nowrap; flex-shrink: 0; padding: 12px 24px; border-radius: 8px; border: 1px solid #e5e7eb; background-color: #ffffff; color: #374151; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease;">
            Madrasah Aliyah (MA)
        </button>
        
        <!-- Tab 5: Ponpes -->
        <button type="button" class="tab-btn-jenjang" data-target="tab-ponpes" onclick="window.switchPPDBTab('ponpes')" style="white-space: nowrap; flex-shrink: 0; padding: 12px 24px; border-radius: 8px; border: 1px solid #e5e7eb; background-color: #ffffff; color: #374151; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease;">
            Pondok Pesantren Assurur
        </button>

    </div>
</div>

        <!-- ================= 1. PANEL MTs (ACTIVE DEFAULT) ================= -->
        <div id="ppdb-panel-mts" class="ppdb-panel space-y-8">
          
          <!-- Banner Pengantar MTs -->
          <div class="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-emerald-700">
            <div class="flex items-center gap-4">
              <img src="/media/logo/MTs.jpg" onerror="this.onerror=null;this.src='./media/logo/MTs.jpg';" alt="Logo MTs Nahjul Huda" class="w-16 h-16 object-cover rounded-full border-2 border-yellow-400 shadow-md flex-shrink-0 bg-white">
              <div>
                <span class="text-xs font-semibold uppercase tracking-wider text-gold-300">Papan Informasi SPMB</span>
                <h3 class="text-xl md:text-2xl font-playfair font-bold">Madrasah Tsanawiyah (MTs) Nahjul Huda</h3>
                <p class="text-emerald-100 text-sm">Pendidikan Menengah Pertama Berkarakter Islami & Unggul. Dapatkan Promo SPMB <span class="font-bold text-yellow-400">GRATIS UANG PANGKAL!</span></p>
              </div>
            </div>
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-slate-900 font-bold text-sm shadow flex-shrink-0">
              <i class="fas fa-check-circle"></i> Pendaftaran Terbuka
            </div>
          </div>

          <!-- Grid 2 Kolom: Syarat Pendaftaran & Biaya MTs -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- KARTU SYARAT PENDAFTARAN MTs -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 md:p-8 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl shadow-sm">
                    <i class="fas fa-clipboard-check"></i>
                  </div>
                  <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    5 Persyaratan Berkas
                  </span>
                </div>

                <h3 class="text-xl md:text-2xl font-playfair font-bold text-emerald-900 mb-2">
                  Syarat Pendaftaran MTs Nahjul Huda
                </h3>
                <p class="text-slate-500 text-xs sm:text-sm mb-6">
                  Calon murid baru tingkat Madrasah Tsanawiyah (MTs) wajib menyerahkan kelengkapan berkas administrasi berikut:
                </p>

                <div class="space-y-3">
                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <span class="text-slate-700 text-sm font-medium">Mengisi formulir pendaftaran</span>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <span class="text-slate-700 text-sm font-medium">Fotokopi Kartu Keluarga & KTP Orang Tua/Wali</span>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <span class="text-slate-700 text-sm font-medium">Fotokopi Akta Kelahiran</span>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      4
                    </div>
                    <span class="text-slate-700 text-sm font-medium">Pas Foto 3x4 (4 lembar)</span>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      5
                    </div>
                    <span class="text-slate-700 text-sm font-medium">Fotokopi Ijazah (2 lembar)</span>
                  </div>
                </div>
              </div>

              <div class="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
                <i class="fas fa-info-circle text-emerald-700 text-base flex-shrink-0"></i>
                <span>Seluruh berkas diserahkan ke ruang sekretariat pendaftaran MTs Nahjul Huda.</span>
              </div>
            </div>

            <!-- KARTU BIAYA MTs (GRATIS UANG PANGKAL) -->
            <div class="bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 rounded-2xl shadow-sm border-2 border-emerald-200/80 p-6 md:p-8 flex flex-col justify-between hover:shadow-md transition relative overflow-hidden">
              <div class="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full pointer-events-none"></div>

                <div>
                  <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl shadow-sm">
                      <i class="fas fa-hand-holding-heart"></i>
                    </div>
                    <span class="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                      GRATIS UANG PANGKAL
                    </span>
                  </div>

                  <h3 class="text-xl md:text-2xl font-playfair font-bold text-emerald-900 mb-2">
                    Keringanan Biaya Pendidikan MTs
                  </h3>
                  
                  <p class="text-slate-600 text-sm mb-6 leading-relaxed">
                    Sistem Penerimaan Murid Baru (SPMB) Tingkat MTs memberikan kemudahan akses pendidikan berkualitas:
                  </p>

                  <div class="space-y-3.5">
                    <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-emerald-200/70 shadow-sm">
                      <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        <i class="fas fa-check"></i>
                      </div>
                      <div>
                        <h4 class="font-bold text-slate-800 text-base">Bebas Uang Pangkal</h4>
                        <p class="text-xs text-slate-500">Gratis uang pangkal masuk untuk seluruh calon murid baru MTs</p>
                      </div>
                    </div>

                    <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-emerald-200/70 shadow-sm">
                      <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        <i class="fas fa-check"></i>
                      </div>
                      <div>
                        <h4 class="font-bold text-slate-800 text-base">Formulir Pendaftaran</h4>
                        <p class="text-xs text-slate-500">Disediakan secara langsung oleh panitia pendaftaran</p>
                      </div>
                    </div>

                    <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-emerald-200/70 shadow-sm">
                      <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        <i class="fas fa-check"></i>
                      </div>
                      <div>
                        <h4 class="font-bold text-slate-800 text-base">Pendidikan Berorientasi Dakwah & Sosial</h4>
                        <p class="text-xs text-slate-500">Membantu santri yatim dan dhuafa mendapatkan akses pendidikan bermutu</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 p-4 rounded-xl bg-emerald-800 text-white text-xs leading-relaxed flex items-start gap-3">
                  <i class="fas fa-school text-gold-400 text-base mt-0.5 flex-shrink-0"></i>
                  <div>
                    Pendidikan di MTs Nahjul Huda berorientasi pada pembinaan karakter akhlakul karimah, penguasaan ilmu agama, serta kesiapan akademik lanjutan.
                  </div>
                </div>
            </div>

          </div>

          <!-- STRUKTUR FINAL: CSS GRID 2 KOLOM (KIRI: Teks & Kontak Berjajar, KANAN: Tombol WA Rata Kanan) -->
            <div id="ppdb-mts-konsultasi" class="ppdb-grid-konsultasi" style="background-color: #f0fdf4; border: 1px solid #d1fae5; border-radius: 12px; padding: 24px; margin-top: 32px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 32px; width: 100%; box-sizing: border-box;">
                
                <!-- KOLOM KIRI -->
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #16a34a; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg style="width: 20px; height: 20px; color: #ffffff;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <h4 style="font-weight: 700; color: #14532d; font-size: 1.125rem; margin: 0;">Pusat Layanan Konsultasi PPDB</h4>
                    </div>
                    
                    <p style="font-size: 0.875rem; color: #4b5563; margin: 0; line-height: 1.5;" class="text-justify">Masih bingung mengenai detail persyaratan, biaya, kurikulum, atau fasilitas madrasah? Jangan ragu untuk bertanya! Panitia kami siap membantu menjawab semua kebingungan Anda sebelum mendaftar.</p>
                    
                    <!-- Kotak Kontak Berjajar Horizontal -->
                    <div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 12px;">
                        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 12px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem; color: #374151; white-space: nowrap;">
                            <span style="font-weight: 500;" class="nama-panitia-1">Umi Hj. Dahlia</span>
                            <span style="color: #d1d5db;">|</span>
                            <span class="no-panitia-1">085880682115</span>
                        </div>
                        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 12px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem; color: #374151; white-space: nowrap;">
                            <span style="font-weight: 500;" class="nama-panitia-2">Abu Jalaluddin</span>
                            <span style="color: #d1d5db;">|</span>
                            <span class="no-panitia-2">08158316436</span>
                        </div>
                    </div>
                </div>

                <!-- KOLOM KANAN: Tombol WA Rata Kanan -->
                <div style="display: flex; flex-direction: row; gap: 12px; align-items: center; justify-self: end;">
                    <a href="https://wa.me/6285880682115?text=Halo%20Umi%20Hj.%20Dahlia,%20saya%20ingin%20bertanya-tanya%20seputar%20pendaftaran%20MTs." target="_blank" rel="noopener noreferrer" class="btn-wa-1" style="background-color: #16a34a; color: #ffffff; font-weight: 500; font-size: 0.875rem; padding: 10px 20px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; white-space: nowrap;">Hubungi Umi Dahlia</a>
                    <a href="https://wa.me/628158316436?text=Halo%20Abu%20Jalaluddin,%20saya%20ingin%20bertanya-tanya%20seputar%20pendaftaran%20MTs." target="_blank" rel="noopener noreferrer" class="btn-wa-2" style="background-color: #16a34a; color: #ffffff; font-weight: 500; font-size: 0.875rem; padding: 10px 20px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; white-space: nowrap;">Hubungi Abu Jalaluddin</a>
                </div>
            </div>

        </div>

        <!-- ================= 2. PANEL MA ================= -->
        <div id="ppdb-panel-ma" class="ppdb-panel hidden space-y-8">
          
          <!-- Banner Pengantar MA -->
          <div class="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-emerald-700">
            <div class="flex items-center gap-4">
              <img src="/media/logo/MA.jpg" onerror="this.onerror=null;this.src='./media/logo/MA.jpg';" alt="Logo MA Nahjul Huda" class="w-16 h-16 object-cover rounded-full border-2 border-emerald-400 shadow-md flex-shrink-0 bg-white">
              <div>
                <span class="text-xs font-semibold uppercase tracking-wider text-gold-300">Papan Informasi SPMB</span>
                <h3 class="text-xl md:text-2xl font-playfair font-bold">Madrasah Aliyah (MA) Nahjul Huda</h3>
                <p class="text-emerald-100 text-sm">Pendidikan Menengah Atas Berkarakter Islami & Unggul. Dapatkan Promo SPMB <span class="font-bold text-yellow-400">GRATIS UANG PANGKAL!</span></p>
              </div>
            </div>
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-slate-900 font-bold text-sm shadow flex-shrink-0">
              <i class="fas fa-check-circle"></i> Pendaftaran Terbuka
            </div>
          </div>

          <!-- Grid 2 Kolom: Syarat Pendaftaran & Biaya MA -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- KARTU SYARAT PENDAFTARAN MA (SAMA PERSIS DENGAN MTs) -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 md:p-8 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl shadow-sm">
                    <i class="fas fa-clipboard-check"></i>
                  </div>
                  <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    5 Persyaratan Berkas
                  </span>
                </div>

                <h3 class="text-xl md:text-2xl font-playfair font-bold text-emerald-900 mb-2">
                  Syarat Pendaftaran MA Nahjul Huda
                </h3>
                <p class="text-slate-500 text-xs sm:text-sm mb-6">
                  Calon murid baru tingkat Madrasah Aliyah (MA) wajib menyerahkan kelengkapan berkas administrasi berikut:
                </p>

                <div class="space-y-3">
                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <span class="text-slate-700 text-sm font-medium">Mengisi formulir pendaftaran</span>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <span class="text-slate-700 text-sm font-medium">Fotokopi Kartu Keluarga & KTP Orang Tua/Wali</span>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <span class="text-slate-700 text-sm font-medium">Fotokopi Akta Kelahiran</span>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      4
                    </div>
                    <span class="text-slate-700 text-sm font-medium">Pas Foto 3x4 (4 lembar)</span>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      5
                    </div>
                    <span class="text-slate-700 text-sm font-medium">Fotokopi Ijazah (2 lembar)</span>
                  </div>
                </div>
              </div>

              <div class="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
                <i class="fas fa-info-circle text-emerald-700 text-base flex-shrink-0"></i>
                <span>Seluruh berkas diserahkan ke ruang sekretariat pendaftaran MA Nahjul Huda.</span>
              </div>
            </div>

            <!-- KARTU BIAYA MA (GRATIS UANG PANGKAL) -->
            <div class="bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 rounded-2xl shadow-sm border-2 border-emerald-200/80 p-6 md:p-8 flex flex-col justify-between hover:shadow-md transition relative overflow-hidden">
              <div class="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full pointer-events-none"></div>

              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl shadow-sm">
                    <i class="fas fa-hand-holding-heart"></i>
                  </div>
                  <span class="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                    GRATIS UANG PANGKAL
                  </span>
                </div>

                <h3 class="text-xl md:text-2xl font-playfair font-bold text-emerald-900 mb-2">
                  Keringanan Biaya Pendidikan MA
                </h3>
                
                <p class="text-slate-600 text-sm mb-6 leading-relaxed">
                  Sistem Penerimaan Murid Baru (SPMB) Tingkat MA memberikan kemudahan akses pendidikan berkualitas:
                </p>

                <div class="space-y-3.5">
                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-emerald-200/70 shadow-sm">
                    <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      <i class="fas fa-check"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-800 text-base">Bebas Uang Pangkal</h4>
                      <p class="text-xs text-slate-500">Gratis uang pangkal masuk untuk seluruh calon murid baru MA</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-emerald-200/70 shadow-sm">
                    <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      <i class="fas fa-check"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-800 text-base">Formulir Pendaftaran</h4>
                      <p class="text-xs text-slate-500">Disediakan secara langsung oleh panitia pendaftaran</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-emerald-200/70 shadow-sm">
                    <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      <i class="fas fa-check"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-800 text-base">Pendidikan Berorientasi Dakwah & Sosial</h4>
                      <p class="text-xs text-slate-500">Membantu santri yatim dan dhuafa mendapatkan akses pendidikan bermutu</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 p-4 rounded-xl bg-emerald-800 text-white text-xs leading-relaxed flex items-start gap-3">
                <i class="fas fa-school text-gold-400 text-base mt-0.5 flex-shrink-0"></i>
                <div>
                  Pendidikan di MA Nahjul Huda berorientasi pada pembinaan keilmuan mendalam, persiapan perguruan tinggi, serta nilai akhlakul karimah.
                </div>
              </div>
            </div>

          </div>

          <!-- STRUKTUR FINAL: CSS GRID 2 KOLOM (KIRI: Teks & Kontak Berjajar, KANAN: Tombol WA Rata Kanan) -->
            <div id="ppdb-ma-konsultasi" class="ppdb-grid-konsultasi" style="background-color: #f0fdf4; border: 1px solid #d1fae5; border-radius: 12px; padding: 24px; margin-top: 32px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 32px; width: 100%; box-sizing: border-box;">
                
                <!-- KOLOM KIRI -->
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #16a34a; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg style="width: 20px; height: 20px; color: #ffffff;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <h4 style="font-weight: 700; color: #14532d; font-size: 1.125rem; margin: 0;">Pusat Layanan Konsultasi PPDB</h4>
                    </div>
                    
                    <p style="font-size: 0.875rem; color: #4b5563; margin: 0; line-height: 1.5;" class="text-justify">Masih bingung mengenai detail persyaratan, biaya, kurikulum, atau fasilitas madrasah? Jangan ragu untuk bertanya! Panitia kami siap membantu menjawab semua kebingungan Anda sebelum mendaftar.</p>
                    
                    <!-- Kotak Kontak Berjajar Horizontal -->
                    <div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 12px;">
                        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 12px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem; color: #374151; white-space: nowrap;">
                            <span style="font-weight: 500;" class="nama-panitia-1">Umi Hj. Dahlia</span>
                            <span style="color: #d1d5db;">|</span>
                            <span class="no-panitia-1">085880682115</span>
                        </div>
                        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 12px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem; color: #374151; white-space: nowrap;">
                            <span style="font-weight: 500;" class="nama-panitia-2">Abu Jalaluddin</span>
                            <span style="color: #d1d5db;">|</span>
                            <span class="no-panitia-2">08158316436</span>
                        </div>
                    </div>
                </div>

                <!-- KOLOM KANAN: Tombol WA Rata Kanan -->
                <div style="display: flex; flex-direction: row; gap: 12px; align-items: center; justify-self: end;">
                    <a href="https://wa.me/6285880682115?text=Halo%20Umi%20Hj.%20Dahlia,%20saya%20ingin%20bertanya-tanya%20seputar%20pendaftaran%20MA." target="_blank" rel="noopener noreferrer" class="btn-wa-1" style="background-color: #16a34a; color: #ffffff; font-weight: 500; font-size: 0.875rem; padding: 10px 20px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; white-space: nowrap;">Hubungi Umi Dahlia</a>
                    <a href="https://wa.me/628158316436?text=Halo%20Abu%20Jalaluddin,%20saya%20ingin%20bertanya-tanya%20seputar%20pendaftaran%20MA." target="_blank" rel="noopener noreferrer" class="btn-wa-2" style="background-color: #16a34a; color: #ffffff; font-weight: 500; font-size: 0.875rem; padding: 10px 20px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; white-space: nowrap;">Hubungi Abu Jalaluddin</a>
                </div>
            </div>

        </div>

        <!-- ================= 3. PANEL MI (MADRASAH IBTIDAIYAH) ================= -->
        <div id="ppdb-panel-mi" class="ppdb-panel hidden space-y-8">
          
          <!-- Banner Pengantar MI -->
          <div class="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-emerald-700">
            <div class="flex items-center gap-4">
              <img src="/media/logo/MI.jpg" onerror="this.onerror=null;this.src='./media/logo/MI.jpg';" alt="Logo MI Nahjul Huda" class="w-16 h-16 object-cover rounded-full border-2 border-yellow-400 shadow-md flex-shrink-0 bg-white">
              <div>
                <span class="text-xs font-semibold uppercase tracking-wider text-gold-300">Papan Informasi PPDB</span>
                <h3 class="text-xl md:text-2xl font-playfair font-bold">Madrasah Ibtidaiyah (MI) Nahjul Huda</h3>
                <p class="text-emerald-100 text-sm">Pendidikan Dasar Islam Berkualitas & Berakhlakul Karimah - Kebon Jeruk, Jakarta Barat</p>
              </div>
            </div>
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-slate-900 font-bold text-sm shadow flex-shrink-0">
              <i class="fas fa-check-circle"></i> Pendaftaran Terbuka
            </div>
          </div>

          <!-- Grid 2 Kolom: Waktu Pendaftaran & Syarat Pendaftaran MI -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- KARTU WAKTU PENDAFTARAN MI -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 md:p-8 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl shadow-sm border border-amber-100">
                    <i class="far fa-clock"></i>
                  </div>
                  <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    Jadwal Pelayanan
                  </span>
                </div>

                <h3 class="text-xl md:text-2xl font-playfair font-bold text-emerald-900 mb-3">
                  Waktu Pendaftaran
                </h3>
                <p class="text-slate-500 text-xs sm:text-sm mb-6 text-justify">
                  Pelayanan pendaftaran dan penerimaan berkas murid baru jenjang Madrasah Ibtidaiyah (MI) dibuka pada:
                </p>

                <!-- Highlight Waktu Pendaftaran MI -->
                <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 border-2 border-amber-200 shadow-sm space-y-4">
                  <div class="flex items-start gap-3.5">
                    <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                      <i class="far fa-calendar-check"></i>
                    </div>
                    <div>
                      <span class="text-xs font-bold uppercase text-amber-800 tracking-wider">Hari Pelayanan:</span>
                      <div class="text-base sm:text-lg font-bold text-slate-900">Hari Senin s/d Jumat</div>
                    </div>
                  </div>

                  <div class="flex items-start gap-3.5 pt-3 border-t border-amber-200/70">
                    <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                      <i class="far fa-clock"></i>
                    </div>
                    <div>
                      <span class="text-xs font-bold uppercase text-amber-800 tracking-wider">Jam Operasional:</span>
                      <div class="text-base sm:text-lg font-bold text-slate-900">Pukul 08.00 WIB s/d 12.00 WIB</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-center gap-3">
                <i class="fas fa-map-marker-alt text-emerald-600 text-base flex-shrink-0"></i>
                <span>Silakan datang ke ruang sekretariat MI Nahjul Huda pada jam operasional di atas untuk menyerahkan formulir dan berkas.</span>
              </div>
            </div>

            <!-- KARTU SYARAT PENDAFTARAN MI -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 md:p-8 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl shadow-sm">
                    <i class="fas fa-clipboard-list"></i>
                  </div>
                  <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    5 Persyaratan Berkas
                  </span>
                </div>

                <h3 class="text-xl md:text-2xl font-playfair font-bold text-emerald-900 mb-2">
                  Syarat Pendaftaran MI Nahjul Huda
                </h3>
                <p class="text-slate-500 text-xs sm:text-sm mb-6">
                  Calon murid baru Madrasah Ibtidaiyah wajib melengkapi berkas administrasi berikut:
                </p>

                <div class="space-y-3">
                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <span class="text-slate-700 text-sm font-medium">Formulir Pendaftaran</span>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <span class="text-slate-700 text-sm font-medium">Fotokopi Akta Kelahiran</span>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <span class="text-slate-700 text-sm font-medium">Fotokopi Kartu Keluarga</span>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      4
                    </div>
                    <span class="text-slate-700 text-sm font-medium">Pas Foto Terbaru</span>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      5
                    </div>
                    <span class="text-slate-700 text-sm font-medium">Surat Keterangan Sehat dari Dokter</span>
                  </div>
                </div>
              </div>

              <div class="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
                <i class="fas fa-check-circle text-emerald-700 text-base flex-shrink-0"></i>
                <span>Pastikan seluruh berkas dimasukkan ke dalam map rapi saat diserahkan ke loket pendaftaran.</span>
              </div>
            </div>

          </div>

          <!-- STRUKTUR FINAL: CSS GRID 2 KOLOM (KIRI: Teks & Kontak Berjajar, KANAN: Tombol WA Rata Kanan) -->
            <div id="ppdb-mi-konsultasi" class="ppdb-grid-konsultasi" style="background-color: #f0fdf4; border: 1px solid #d1fae5; border-radius: 12px; padding: 24px; margin-top: 32px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 32px; width: 100%; box-sizing: border-box;">
                
                <!-- KOLOM KIRI -->
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #16a34a; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg style="width: 20px; height: 20px; color: #ffffff;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <h4 style="font-weight: 700; color: #14532d; font-size: 1.125rem; margin: 0;">Pusat Layanan Konsultasi PPDB</h4>
                    </div>
                    
                    <p style="font-size: 0.875rem; color: #4b5563; margin: 0; line-height: 1.5;" class="text-justify">Masih bingung mengenai detail persyaratan, biaya, kurikulum, atau fasilitas madrasah? Jangan ragu untuk bertanya! Panitia kami siap membantu menjawab semua kebingungan Anda sebelum mendaftar.</p>
                    
                    <!-- Kotak Kontak Berjajar Horizontal -->
                    <div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 12px;">
                        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 12px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem; color: #374151; white-space: nowrap;">
                            <span style="font-weight: 500;" class="nama-panitia-1">Abi Subhan, SPd.</span>
                            <span style="color: #d1d5db;">|</span>
                            <span class="no-panitia-1">08991168301</span>
                        </div>
                        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 12px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem; color: #374151; white-space: nowrap;">
                            <span style="font-weight: 500;" class="nama-panitia-2">Abi Fahri, SPd.</span>
                            <span style="color: #d1d5db;">|</span>
                            <span class="no-panitia-2">085695426904</span>
                        </div>
                    </div>
                </div>

                <!-- KOLOM KANAN: Tombol WA Rata Kanan -->
                <div style="display: flex; flex-direction: row; gap: 12px; align-items: center; justify-self: end;">
                    <a href="https://wa.me/628991168301?text=Halo%20Abi%20Subhan,%20saya%20ingin%20bertanya-tanya%20seputar%20pendaftaran%20MI." target="_blank" rel="noopener noreferrer" class="btn-wa-1" style="background-color: #16a34a; color: #ffffff; font-weight: 500; font-size: 0.875rem; padding: 10px 20px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; white-space: nowrap;">Hubungi Abi Subhan</a>
                    <a href="https://wa.me/6285695426904?text=Halo%20Abi%20Fahri,%20saya%20ingin%20bertanya-tanya%20seputar%20pendaftaran%20MI." target="_blank" rel="noopener noreferrer" class="btn-wa-2" style="background-color: #16a34a; color: #ffffff; font-weight: 500; font-size: 0.875rem; padding: 10px 20px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; white-space: nowrap;">Hubungi Abi Fahri</a>
                </div>
            </div>

        </div>

        <!-- ================= 4. PANEL PONPES (PONDOK PESANTREN ASSURUR) ================= -->
        <div id="ppdb-panel-ponpes" class="ppdb-panel hidden space-y-8">
          
          <!-- Banner Pengantar Ponpes -->
          <div class="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-emerald-700">
            <div class="flex items-center gap-4">
              <img src="/media/logo/Ponpes.jpg" onerror="this.onerror=null;this.src='./media/logo/Ponpes.jpg';" alt="Logo Pondok Pesantren Assurur" class="w-16 h-16 object-cover rounded-full border-2 border-yellow-400 shadow-md flex-shrink-0 bg-white">
              <div>
                <span class="text-xs font-semibold uppercase tracking-wider text-gold-300">Penerimaan Santri Baru</span>
                <h3 class="text-xl md:text-2xl font-playfair font-bold">Pondok Pesantren Assurur</h3>
                <p class="text-emerald-100 text-sm">Membina Generasi Qur'ani, Berakhlak Mulia, dan Mandiri - Kebon Jeruk, Jakarta Barat</p>
              </div>
            </div>
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-slate-900 font-bold text-sm shadow flex-shrink-0">
              <i class="fas fa-check-circle"></i> Pendaftaran Santri Baru
            </div>
          </div>

          <!-- Grid 2 Kolom: Jadwal Pendaftaran & Syarat Pendaftaran Ponpes -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- KARTU JADWAL PENDAFTARAN PONPES -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 md:p-8 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl shadow-sm border border-amber-100">
                    <i class="far fa-calendar-alt"></i>
                  </div>
                  <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    Jadwal Pendaftaran
                  </span>
                </div>

                <h3 class="text-xl md:text-2xl font-playfair font-bold text-emerald-900 mb-3">
                  Jadwal Penerimaan Santri
                </h3>
                <p class="text-slate-500 text-xs sm:text-sm mb-6">
                  Informasi periode dan waktu pendaftaran santri baru Pondok Pesantren Assurur:
                </p>

                <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50/40 border-2 border-amber-200 shadow-sm space-y-4">
                  <div class="flex items-start gap-3.5">
                    <div class="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                      <i class="far fa-calendar-check"></i>
                    </div>
                    <div>
                      <span class="text-xs font-bold uppercase text-emerald-800 tracking-wider">Masa Pendaftaran:</span>
                      <div class="text-base sm:text-lg font-bold text-slate-900">Desember 2024 - Juni 2025</div>
                      <div class="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1.5">
                        <i class="fas fa-exclamation-circle"></i>
                        <span>Pendaftaran ditutup jika kuota terpenuhi</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-start gap-3.5 pt-3 border-t border-amber-200/70">
                    <div class="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                      <i class="far fa-clock"></i>
                    </div>
                    <div>
                      <span class="text-xs font-bold uppercase text-emerald-800 tracking-wider">Waktu Pelayanan:</span>
                      <div class="text-base sm:text-lg font-bold text-slate-900">Senin - Jum'at, 08.00 - 12.30</div>
                      <div class="text-xs text-slate-500 mt-0.5">Hari kerja sekretariat pondok pesantren</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
                <i class="fas fa-bullhorn text-amber-600 text-base flex-shrink-0"></i>
                <span>Mengingat kuota terbatas, calon santri disarankan untuk mendaftar lebih awal sebelum kuota terpenuhi.</span>
              </div>
            </div>

            <!-- KARTU SYARAT PENDAFTARAN PONPES -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 md:p-8 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl shadow-sm">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    Informasi Persyaratan
                  </span>
                </div>

                <h3 class="text-xl md:text-2xl font-playfair font-bold text-emerald-900 mb-3">
                  Syarat Pendaftaran Santri Baru
                </h3>
                <p class="text-slate-500 text-xs sm:text-sm mb-6">
                  Ketentuan dan rincian berkas persyaratan penerimaan santri baru Pondok Pesantren Assurur:
                </p>

                <div class="p-5 md:p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div>
                    <h4 class="text-base md:text-lg font-bold text-emerald-950 font-playfair mb-1 flex items-center gap-2">
                      <i class="fas fa-map-marker-alt text-emerald-600"></i>
                      <span>Kunjungan Langsung ke Lokasi</span>
                    </h4>
                    <p class="text-slate-700 text-sm font-semibold leading-relaxed">
                      Silakan datang langsung ke lokasi untuk informasi persyaratan lebih rinci.
                    </p>
                  </div>

                  <div class="w-full h-48 md:h-64 rounded-lg overflow-hidden relative shadow-sm border border-emerald-200">
                    <iframe 
                      src="https://maps.google.com/maps?q=Pondok%20Pesantren%20Assurur%2C%20Kebon%20Jeruk&t=&z=17&ie=UTF8&iwloc=&output=embed" 
                      width="100%" 
                      height="100%" 
                      style="border:0; position:absolute; top:0; left:0;" 
                      allowfullscreen="" 
                      loading="lazy" 
                      referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                  </div>

                  <div class="mt-3 text-center">
                    <a href="https://maps.app.goo.gl/TCHeSziQZrqFz8nYA" target="_blank" class="text-green-700 text-sm font-semibold hover:text-green-800 hover:underline inline-flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
                      Buka di Aplikasi Google Maps
                    </a>
                  </div>
                </div>
              </div>

              <div class="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs space-y-1">
                <div class="font-bold text-slate-800 flex items-center gap-2">
                  <i class="fas fa-location-dot text-emerald-600"></i>
                  <span>Alamat Sekretariat Pondok:</span>
                </div>
                <div class="pl-5 text-slate-600">
                  Pondok Pesantren Assurur / Yayasan Nahjul Huda, Jl. HH No.63, RT.008/RW.001, Kebon Jeruk, Jakarta Barat 11530.
                </div>
              </div>
            </div>

            <!-- STRUKTUR FINAL: CSS GRID 2 KOLOM (KIRI: Teks & Kontak Berjajar, KANAN: Tombol WA Rata Kanan) -->
            <div id="ppdb-ponpes-konsultasi" class="ppdb-grid-konsultasi" style="background-color: #f0fdf4; border: 1px solid #d1fae5; border-radius: 12px; padding: 24px; margin-top: 32px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 32px; width: 100%; box-sizing: border-box;">
                
                <!-- KOLOM KIRI -->
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #16a34a; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg style="width: 20px; height: 20px; color: #ffffff;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <h4 style="font-weight: 700; color: #14532d; font-size: 1.125rem; margin: 0;">Pusat Layanan Konsultasi PPDB</h4>
                    </div>
                    
                    <p style="font-size: 0.875rem; color: #4b5563; margin: 0; line-height: 1.5;" class="text-justify">Masih bingung mengenai detail persyaratan, biaya, kurikulum, atau fasilitas madrasah? Jangan ragu untuk bertanya! Panitia kami siap membantu menjawab semua kebingungan Anda sebelum mendaftar.</p>
                    
                    <!-- Kotak Kontak Berjajar Horizontal -->
                    <div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 12px;">
                        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 12px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem; color: #374151; white-space: nowrap;">
                            <span style="font-weight: 500;" class="nama-panitia-1">Bunda Dahlia</span>
                            <span style="color: #d1d5db;">|</span>
                            <span class="no-panitia-1">08589010538</span>
                        </div>
                        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 12px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem; color: #374151; white-space: nowrap;">
                            <span style="font-weight: 500;" class="nama-panitia-2">Abu Jalaluddin</span>
                            <span style="color: #d1d5db;">|</span>
                            <span class="no-panitia-2">08158316436</span>
                        </div>
                    </div>
                </div>

                <!-- KOLOM KANAN: Tombol WA Rata Kanan -->
                <div style="display: flex; flex-direction: row; gap: 12px; align-items: center; justify-self: end;">
                    <a href="https://wa.me/628589010538?text=Halo%20Bunda%20Dahlia,%20saya%20ingin%20bertanya-tanya%20seputar%20pendaftaran%20Ponpes." target="_blank" rel="noopener noreferrer" class="btn-wa-1" style="background-color: #16a34a; color: #ffffff; font-weight: 500; font-size: 0.875rem; padding: 10px 20px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; white-space: nowrap;">Hubungi Bunda Dahlia</a>
                    <a href="https://wa.me/628158316436?text=Halo%20Abu%20Jalaluddin,%20saya%20ingin%20bertanya-tanya%20seputar%20pendaftaran%20Ponpes." target="_blank" rel="noopener noreferrer" class="btn-wa-2" style="background-color: #16a34a; color: #ffffff; font-weight: 500; font-size: 0.875rem; padding: 10px 20px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; white-space: nowrap;">Hubungi Abu Jalaluddin</a>
                </div>
            </div>

        </div>

        <!-- ================= 5. PANEL SDI AL KINDY ================= -->
        <div id="ppdb-panel-sdi" class="ppdb-panel hidden space-y-8">
          <div class="bg-white rounded-2xl border border-slate-200 p-10 md:p-14 text-center max-w-2xl mx-auto shadow-sm">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
              <i class="fas fa-school"></i>
            </div>
            <h3 class="text-2xl font-playfair font-bold text-slate-800 mb-2">SD Islam (SDI) AL KINDY</h3>
            <span class="inline-block px-4 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-4 border border-amber-200">
              Informasi PPDB Segera Hadir
            </span>
            <p class="text-slate-600 text-sm leading-relaxed mb-6">
              Rincian jadwal, persyaratan, dan alur pendaftaran untuk SD Islam (SDI) AL KINDY sedang dalam tahap persiapan panitia. Silakan datang langsung ke kantor sekretariat Yayasan Nahjul Huda pada jam kerja untuk mendapatkan informasi awal.
            </p>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 inline-block text-left">
              <i class="fas fa-map-marker-alt text-emerald-600 mr-1.5"></i>
              <strong>Sekretariat:</strong> Jl. HH No.63 Kebon Jeruk, Jakarta Barat (Senin - Jumat 08.00 - 12.00 WIB)
            </div>
          </div>
        </div>

        <!-- Informasi Alamat Sekretariat Bersama di Bawah -->
        <div class="mt-14 pt-8 border-t border-slate-200 text-center max-w-3xl mx-auto">
          <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <h4 class="font-playfair font-bold text-lg text-emerald-950 mb-2">Sekretariat Pendaftaran Yayasan Nahjul Huda</h4>
            <p class="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
              <i class="fas fa-map-marker-alt text-emerald-600 mr-1.5"></i>
              Jl. J No.67G / Jl. HH Gg. 1 No. 63, RT.008/RW.001, Kebon Jeruk, Jakarta Barat 11530.
            </p>
            <p class="text-gray-500 text-sm mt-4 text-center">
              Untuk pertanyaan dan penyerahan berkas, silakan hubungi WhatsApp pada masing-masing tab jenjang di atas atau kunjungi kantor sekretariat pada jam kerja.
            </p>
          </div>
        </div>

      </div>
    `;
};
