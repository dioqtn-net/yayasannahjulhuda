export const renderPPDB = (ppdb) => {
    const isBuka = ppdb?.status !== 'TUTUP';

    // Global switcher function for PPDB tabs
    if (typeof window !== 'undefined') {
        window.switchPPDBTab = function(key) {
            const panels = document.querySelectorAll('.ppdb-panel');
            panels.forEach(p => p.classList.add('hidden'));

            const targetPanel = document.getElementById(`ppdb-panel-${key}`);
            if (targetPanel) {
                targetPanel.classList.remove('hidden');
            }

            const tabBtns = document.querySelectorAll('.ppdb-tab-btn');
            tabBtns.forEach(btn => {
                const btnKey = btn.getAttribute('data-ppdb-tab');
                const icon = btn.querySelector('i');
                if (btnKey === key) {
                    btn.className = 'ppdb-tab-btn px-5 py-3 rounded-xl font-bold text-sm md:text-base transition-all bg-emerald-800 text-white shadow-md border-2 border-emerald-800 flex items-center justify-center gap-2';
                    if (icon) {
                        icon.classList.remove('text-slate-400');
                        icon.classList.add('text-gold-400');
                    }
                } else {
                    btn.className = 'ppdb-tab-btn px-5 py-3 rounded-xl font-medium text-sm md:text-base transition-all bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-2';
                    if (icon) {
                        icon.classList.remove('text-gold-400');
                        icon.classList.add('text-slate-400');
                    }
                }
            });

            const select = document.getElementById('ppdb-select-jenjang');
            if (select && select.value !== key) {
                select.value = key;
            }
        };
    }

    return `
      <!-- Header PPDB -->
      <section class="relative bg-[url('/images/wallpaper_yayasan.jpg')] bg-cover bg-center bg-no-repeat text-white py-20 overflow-hidden">
        <!-- Dark Overlay Wrapper -->
        <div class="absolute inset-0 bg-black/70 z-0"></div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span class="inline-block px-5 py-1.5 rounded-full text-sm font-bold mb-4 shadow-lg ${isBuka ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-red-500 text-white shadow-red-500/30'}">
            STATUS PENDAFTARAN: ${ppdb?.status || 'BUKA'}
          </span>
          <h1 class="text-4xl md:text-5xl font-playfair font-bold mb-4 text-gold-400 drop-shadow-md">Penerimaan Peserta Didik Baru</h1>
          <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-4"></div>
          <p class="text-white text-lg md:text-xl font-medium drop-shadow max-w-2xl mx-auto leading-relaxed">
            Papan Informasi Resmi Pendaftaran Peserta Didik Baru Yayasan Nahjul Huda
          </p>
        </div>
      </section>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-slate-800">
        
        <!-- Navigation Tabs / Dropdown Pilihan Jenjang Pendidikan -->
        <div class="mb-10">
          <div class="text-center mb-6">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Papan Informasi Jenjang</span>
            <h2 class="text-2xl md:text-3xl font-playfair font-bold text-slate-900 mt-2">Pilih Jenjang Pendidikan</h2>
            <p class="text-slate-500 text-sm mt-1">Pilih jenjang untuk melihat informasi jadwal, berkas persyaratan, dan ketentuan pendaftaran.</p>
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

          <!-- Tabs untuk Layar Besar (Desktop / Tablet) -->
          <div class="hidden lg:flex flex-wrap justify-center gap-3">
            <button type="button" data-ppdb-tab="sdi" onclick="window.switchPPDBTab('sdi')" class="ppdb-tab-btn px-5 py-3 rounded-xl font-medium text-sm md:text-base transition-all bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-2">
              <i class="fas fa-school text-slate-400"></i>
              <span>SD Islam (SDI) AL KINDY</span>
            </button>
            <button type="button" data-ppdb-tab="mi" onclick="window.switchPPDBTab('mi')" class="ppdb-tab-btn px-5 py-3 rounded-xl font-medium text-sm md:text-base transition-all bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-2">
              <i class="fas fa-book-reader text-slate-400"></i>
              <span>Madrasah Ibtidaiyah (MI)</span>
            </button>
            <button type="button" data-ppdb-tab="mts" onclick="window.switchPPDBTab('mts')" class="ppdb-tab-btn px-5 py-3 rounded-xl font-bold text-sm md:text-base transition-all bg-emerald-800 text-white shadow-md border-2 border-emerald-800 flex items-center justify-center gap-2">
              <i class="fas fa-graduation-cap text-gold-400"></i>
              <span>Madrasah Tsanawiyah (MTs)</span>
            </button>
            <button type="button" data-ppdb-tab="ma" onclick="window.switchPPDBTab('ma')" class="ppdb-tab-btn px-5 py-3 rounded-xl font-medium text-sm md:text-base transition-all bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-2">
              <i class="fas fa-university text-slate-400"></i>
              <span>Madrasah Aliyah (MA)</span>
            </button>
            <button type="button" data-ppdb-tab="ponpes" onclick="window.switchPPDBTab('ponpes')" class="ppdb-tab-btn px-5 py-3 rounded-xl font-medium text-sm md:text-base transition-all bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-2">
              <i class="fas fa-mosque text-slate-400"></i>
              <span>Pondok Pesantren Assurur</span>
            </button>
          </div>
        </div>

        <!-- ================= PANEL MTs (ACTIVE DEFAULT) ================= -->
        <div id="ppdb-panel-mts" class="ppdb-panel space-y-8">
          
          <!-- Banner Pengantar MTs -->
          <div class="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-emerald-700">
            <div class="flex items-center gap-4">
              <img src="./images/MTs.jpg" onerror="this.onerror=null;this.src='/images/MTs.jpg';" alt="Logo MTs Nahjul Huda" class="w-16 h-16 object-cover rounded-full border-2 border-yellow-500 shadow-md flex-shrink-0 bg-white">
              <div>
                <span class="text-xs font-semibold uppercase tracking-wider text-gold-300">Papan Informasi PPDB</span>
                <h3 class="text-xl md:text-2xl font-playfair font-bold">Madrasah Tsanawiyah (MTs) Nahjul Huda</h3>
                <p class="text-emerald-100 text-sm">Akreditasi Resmi Kemenag & Kemendikbud - Kampus Kebon Jeruk, Jakarta Barat</p>
              </div>
            </div>
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-slate-900 font-bold text-sm shadow">
              <i class="fas fa-check-circle"></i> Pendaftaran Terbuka
            </div>
          </div>

          <!-- Grid Kartu Informasi MTs: KARTU 1 & KARTU 3 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- KARTU 1: JADWAL KEGIATAN PPDB MTs NAHJUL HUDA -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 md:p-8 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl shadow-sm border border-amber-100">
                    <i class="far fa-calendar-alt"></i>
                  </div>
                  <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Jadwal Kegiatan
                  </span>
                </div>
                
                <h3 class="text-xl md:text-2xl font-playfair font-bold text-emerald-900 mb-4">
                  Jadwal Kegiatan PPDB MTs Nahjul Huda
                </h3>

                <!-- Highlight Banner -->
                <div class="mb-6 p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3 shadow-sm">
                  <i class="fas fa-bullhorn text-red-600 text-lg flex-shrink-0"></i>
                  <span class="text-xs md:text-sm font-extrabold text-red-700 tracking-wide">
                    DAFTAR SECEPATNYA JANGAN SAMPAI TERLAMBAT!
                  </span>
                </div>

                <!-- Timeline / List Jadwal -->
                <div class="space-y-3.5">
                  <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <div class="text-xs font-semibold uppercase text-emerald-700">Pendaftaran Peserta Didik Baru</div>
                      <div class="text-base font-bold text-slate-800">01 Juni s.d 08 Juli 2026</div>
                      <div class="text-xs text-slate-500 mt-0.5">Pengambilan dan pengisian formulir pendaftaran</div>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <div class="text-xs font-semibold uppercase text-emerald-700">Pengembalian Formulir Pendaftaran</div>
                      <div class="text-base font-bold text-slate-800">09 Juli 2026</div>
                      <div class="text-xs text-slate-500 mt-0.5">Penyerahan formulir beserta kelengkapan berkas</div>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <div class="text-xs font-semibold uppercase text-emerald-700">MOPD (Masa Orientasi Peserta Didik)</div>
                      <div class="text-base font-bold text-slate-800">11 s.d 13 Juli 2026</div>
                      <div class="text-xs text-slate-500 mt-0.5">Pengenalan lingkungan madrasah, guru, dan santri</div>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      4
                    </div>
                    <div>
                      <div class="text-xs font-semibold uppercase text-emerald-700">Belajar Efektif</div>
                      <div class="text-base font-bold text-slate-800">14 Juli 2026</div>
                      <div class="text-xs text-slate-500 mt-0.5">Hari pertama dimulainya kegiatan belajar mengajar</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- KARTU 3: BIAYA PENDAFTARAN (GRATIS) -->
            <div class="bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 rounded-2xl shadow-sm border-2 border-emerald-200/80 p-6 md:p-8 flex flex-col justify-between hover:shadow-md transition relative overflow-hidden">
              <div class="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full pointer-events-none"></div>

              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl shadow-sm">
                    <i class="fas fa-hand-holding-heart"></i>
                  </div>
                  <span class="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                    100% BEBAS BIAYA
                  </span>
                </div>

                <h3 class="text-xl md:text-2xl font-playfair font-bold text-emerald-900 mb-2">
                  Biaya Pendaftaran (GRATIS)
                </h3>
                
                <p class="text-slate-600 text-sm mb-6 leading-relaxed">
                  Biaya pendaftaran <strong class="text-emerald-800 font-bold uppercase underline">GRATIS</strong>, sudah termasuk di dalamnya:
                </p>

                <div class="space-y-3.5">
                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-emerald-200/70 shadow-sm">
                    <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      <i class="fas fa-check"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-800 text-base">1. Formulir Pendaftaran</h4>
                      <p class="text-xs text-slate-500">Gratis tanpa dipungut biaya berkas pendaftaran</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-emerald-200/70 shadow-sm">
                    <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      <i class="fas fa-check"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-800 text-base">2. Uang Bangunan</h4>
                      <p class="text-xs text-slate-500">Bebas uang pembangunan gedung dan sarana madrasah</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-emerald-200/70 shadow-sm">
                    <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      <i class="fas fa-check"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-800 text-base">3. Biaya Pendidikan</h4>
                      <p class="text-xs text-slate-500">Dukungan pendidikan berkelanjutan untuk seluruh santri</p>
                    </div>
                  </div>
                </div>

                <!-- Catatan Tambahan -->
                <div class="mt-6 p-4 rounded-xl bg-emerald-800 text-white text-xs leading-relaxed flex items-start gap-3">
                  <i class="fas fa-info-circle text-gold-400 text-base mt-0.5 flex-shrink-0"></i>
                  <div>
                    Pendidikan di MTs Nahjul Huda berorientasi sosial dan dakwah untuk memastikan setiap anak, terutama santri yatim dan dhuafa, mendapatkan akses pendidikan yang layak dan bermutu.
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- KARTU 2: SYARAT PENDAFTARAN -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 md:p-8 hover:shadow-md transition">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl shadow-sm">
                  <i class="fas fa-clipboard-list"></i>
                </div>
                <div>
                  <h3 class="text-xl md:text-2xl font-playfair font-bold text-emerald-900">
                    Syarat Pendaftaran MTs Nahjul Huda
                  </h3>
                  <p class="text-slate-500 text-xs md:text-sm">Calon peserta didik wajib menyerahkan kelengkapan berkas administrasi berikut:</p>
                </div>
              </div>
              <span class="inline-flex items-center text-xs font-semibold px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 w-fit">
                <i class="fas fa-check-double text-emerald-600 mr-1.5"></i> 11 Persyaratan Berkas
              </span>
            </div>

            <!-- List 11 Syarat dalam 2 Kolom -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5">
              
              <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span class="text-slate-700 text-sm font-medium">Mengisi formulir pendaftaran</span>
              </div>

              <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span class="text-slate-700 text-sm font-medium">Menyerahkan foto ukuran 3x4 (4 lembar)</span>
              </div>

              <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <span class="text-slate-700 text-sm font-medium">Fotocopy ijazah dan SKHU (2 lembar)</span>
              </div>

              <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                <span class="text-slate-700 text-sm font-medium">Fotocopy Kartu Keluarga (2 lembar)</span>
              </div>

              <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
                <span class="text-slate-700 text-sm font-medium">Fotocopy akte kelahiran (2 lembar)</span>
              </div>

              <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">6</span>
                <span class="text-slate-700 text-sm font-medium">Fotocopy kartu peserta UN (2 lembar)</span>
              </div>

              <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">7</span>
                <span class="text-slate-700 text-sm font-medium">Fotocopy KTP orangtua/wali (2 lembar)</span>
              </div>

              <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">8</span>
                <span class="text-slate-700 text-sm font-medium">Fotocopy surat kematian bagi siswa yatim (2 lembar)</span>
              </div>

              <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">9</span>
                <span class="text-slate-700 text-sm font-medium">SKTM bagi siswa tidak mampu (2 lembar)</span>
              </div>

              <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">10</span>
                <span class="text-slate-700 text-sm font-medium">SKKB dari sekolah SD/MI (1 lembar)</span>
              </div>

              <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 md:col-span-2">
                <span class="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">11</span>
                <span class="text-slate-700 text-sm font-medium">Memiliki NISN (Nomor Induk Siswa Nasional)</span>
              </div>

            </div>
          </div>

        </div>

        <!-- ================= PANEL JENJANG LAIN (PLACEHOLDER) ================= -->
        
        <!-- Panel SDI AL KINDY -->
        <div id="ppdb-panel-sdi" class="ppdb-panel hidden space-y-8">
          <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
              <i class="fas fa-school"></i>
            </div>
            <h3 class="text-2xl font-playfair font-bold text-slate-800 mb-2">SD Islam (SDI) AL KINDY</h3>
            <span class="inline-block px-4 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-4">
              Informasi PPDB Segera Hadir
            </span>
            <p class="text-slate-600 text-sm leading-relaxed mb-6">
              Rincian jadwal, persyaratan, dan alur pendaftaran untuk SD Islam (SDI) AL KINDY sedang dalam tahap persiapan. Silakan hubungi Panitia PPDB kami via WhatsApp untuk mendapatkan informasi awal.
            </p>
            <a href="https://wa.me/6281234567890?text=Assalamu'alaikum,%20Saya%20ingin%20bertanya%20informasi%20PPDB%20untuk%20SD%20Islam%20(SDI)%20AL%20KINDY" target="_blank" class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-sm">
              <i class="fab fa-whatsapp text-lg"></i> Tanya PPDB SDI via WA
            </a>
          </div>
        </div>

        <!-- Panel MI -->
        <div id="ppdb-panel-mi" class="ppdb-panel hidden space-y-8">
          <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
              <i class="fas fa-book-reader"></i>
            </div>
            <h3 class="text-2xl font-playfair font-bold text-slate-800 mb-2">Madrasah Ibtidaiyah (MI) Nahjul Huda</h3>
            <span class="inline-block px-4 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-4">
              Informasi PPDB Segera Hadir
            </span>
            <p class="text-slate-600 text-sm leading-relaxed mb-6">
              Rincian jadwal, persyaratan, dan alur pendaftaran untuk Madrasah Ibtidaiyah (MI) sedang dalam tahap persiapan. Silakan hubungi Panitia PPDB kami via WhatsApp untuk mendapatkan informasi awal.
            </p>
            <a href="https://wa.me/6281234567890?text=Assalamu'alaikum,%20Saya%20ingin%20bertanya%20informasi%20PPDB%20untuk%20MI%20Nahjul%20Huda" target="_blank" class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-sm">
              <i class="fab fa-whatsapp text-lg"></i> Tanya PPDB MI via WA
            </a>
          </div>
        </div>

        <!-- Panel MA -->
        <div id="ppdb-panel-ma" class="ppdb-panel hidden space-y-8">
          <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
              <i class="fas fa-university"></i>
            </div>
            <h3 class="text-2xl font-playfair font-bold text-slate-800 mb-2">Madrasah Aliyah (MA) Nahjul Huda</h3>
            <span class="inline-block px-4 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-4">
              Informasi PPDB Segera Hadir
            </span>
            <p class="text-slate-600 text-sm leading-relaxed mb-6">
              Rincian jadwal, persyaratan, dan alur pendaftaran untuk Madrasah Aliyah (MA) sedang dalam tahap persiapan. Silakan hubungi Panitia PPDB kami via WhatsApp untuk mendapatkan informasi awal.
            </p>
            <a href="https://wa.me/6281234567890?text=Assalamu'alaikum,%20Saya%20ingin%20bertanya%20informasi%20PPDB%20untuk%20MA%20Nahjul%20Huda" target="_blank" class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-sm">
              <i class="fab fa-whatsapp text-lg"></i> Tanya PPDB MA via WA
            </a>
          </div>
        </div>

        <!-- Panel Ponpes -->
        <div id="ppdb-panel-ponpes" class="ppdb-panel hidden space-y-8">
          <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
              <i class="fas fa-mosque"></i>
            </div>
            <h3 class="text-2xl font-playfair font-bold text-slate-800 mb-2">Pondok Pesantren Assurur</h3>
            <span class="inline-block px-4 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-4">
              Informasi PPDB Segera Hadir
            </span>
            <p class="text-slate-600 text-sm leading-relaxed mb-6">
              Rincian jadwal, persyaratan, dan alur pendaftaran santri baru Pondok Pesantren Assurur sedang dalam tahap persiapan. Silakan hubungi Panitia PPDB kami via WhatsApp untuk mendapatkan informasi awal.
            </p>
            <a href="https://wa.me/6281234567890?text=Assalamu'alaikum,%20Saya%20ingin%20bertanya%20informasi%20penerimaan%20santri%20baru%20Pondok%20Pesantren%20Assurur" target="_blank" class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-sm">
              <i class="fab fa-whatsapp text-lg"></i> Tanya PPDB Ponpes via WA
            </a>
          </div>
        </div>

        <!-- ================= 3. CALL TO ACTION (CTA) DI BAWAH INFORMASI ================= -->
        <div class="mt-14 pt-10 border-t border-slate-200 text-center max-w-3xl mx-auto">
          <a href="https://wa.me/6281234567890" target="_blank" class="inline-flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg md:text-xl px-8 py-5 rounded-2xl shadow-xl hover:shadow-orange-500/30 transition transform hover:-translate-y-1 w-full sm:w-auto">
            <i class="fab fa-whatsapp text-2xl md:text-3xl"></i>
            <span>Tanya Panitia PPDB via WA</span>
          </a>
          
          <p class="mt-4 text-xs md:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            <i class="fas fa-map-marker-alt text-orange-500 mr-1.5"></i>
            <strong>Contact Center:</strong> (021) 53654830 - 53654931 atau datang langsung ke Jl. HH No.63 Kebon Jeruk, Jakarta Barat.
          </p>
        </div>

      </div>
    `;
};
