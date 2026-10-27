export const renderGallery = (galleries) => {
    
    // Image Modal / Lightbox logic
    if (!window.openModal) {
        window.openModal = (imageSrc) => {
            const modalImg = document.getElementById('modalImage');
            const modal = document.getElementById('imageModal');
            if (modalImg && modal) {
                modalImg.src = imageSrc;
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        };
        window.closeModal = () => {
            const modal = document.getElementById('imageModal');
            if (modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        };
        window.openLightbox = (url) => window.openModal(url);
        window.closeLightbox = () => window.closeModal();
    }

    // Switch Jenjang Tab Handler
    if (!window.switchJenjang) {
        window.switchJenjang = (jenjang) => {
            const tabs = document.querySelectorAll('.jenjang-tab-btn');
            tabs.forEach(btn => {
                const isSelected = btn.getAttribute('data-jenjang') === jenjang;
                if (isSelected) {
                    btn.className = "jenjang-tab-btn px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md bg-emerald-700 text-white ring-2 ring-emerald-500/30";
                } else {
                    btn.className = "jenjang-tab-btn px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700";
                }
            });

            const contentMTs = document.getElementById('gallery-content-mts');
            const contentPonpes = document.getElementById('gallery-content-ponpes');
            const contentEmpty = document.getElementById('gallery-content-empty');
            const emptyJenjangName = document.getElementById('empty-jenjang-name');
            const activeJenjangBadge = document.getElementById('active-jenjang-badge');

            if (activeJenjangBadge) {
                activeJenjangBadge.textContent = jenjang === 'Semua' ? 'Semua Jenjang' : jenjang;
            }

            if (contentMTs) contentMTs.classList.add('hidden');
            if (contentPonpes) contentPonpes.classList.add('hidden');
            if (contentEmpty) contentEmpty.classList.add('hidden');

            if (jenjang === 'Semua') {
                if (contentMTs) contentMTs.classList.remove('hidden');
                if (contentPonpes) contentPonpes.classList.remove('hidden');
            } else if (jenjang === 'MTs') {
                if (contentMTs) contentMTs.classList.remove('hidden');
            } else if (jenjang === 'Ponpes') {
                if (contentPonpes) contentPonpes.classList.remove('hidden');
            } else {
                if (contentEmpty) {
                    contentEmpty.classList.remove('hidden');
                    if (emptyJenjangName) emptyJenjangName.textContent = jenjang;
                }
            }
        };
    }

    return `
      <!-- Header Galeri -->
      <section class="relative bg-[url('/media/background/wallpaper_yayasan.jpg')] bg-cover bg-center bg-no-repeat text-white py-20 overflow-hidden">
        <!-- Dark Overlay Wrapper -->
        <div class="absolute inset-0 bg-black/75 z-0"></div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-900/80 border border-emerald-500/40 rounded-full text-xs font-semibold text-emerald-300 mb-3">
            <i class="fas fa-images text-emerald-400"></i>
            <span>Dokumentasi Resmi Yayasan</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-playfair font-bold mb-4 text-gold-400 drop-shadow-md">Galeri Dokumentasi</h1>
          <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-4"></div>
          <p class="text-slate-100 text-base sm:text-lg max-w-2xl mx-auto drop-shadow leading-relaxed">
            Momen berharga dan potret kegiatan keseharian santri serta fasilitas di lingkungan Yayasan Nahjul Huda.
          </p>
        </div>
      </section>

      <!-- Main Content Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <!-- Filter Jenjang Pendidikan (Tabs) -->
        <div class="mb-10 text-center">
          <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Pilih Jenjang Pendidikan</div>
          <div class="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button onclick="switchJenjang('Semua')" data-jenjang="Semua" class="jenjang-tab-btn px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700">
              Semua
            </button>
            <button onclick="switchJenjang('SDI')" data-jenjang="SDI" class="jenjang-tab-btn px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700">
              SDI
            </button>
            <button onclick="switchJenjang('MI')" data-jenjang="MI" class="jenjang-tab-btn px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700">
              MI
            </button>
            <!-- MTs Set as Active by Default -->
            <button onclick="switchJenjang('MTs')" data-jenjang="MTs" class="jenjang-tab-btn px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md bg-emerald-700 text-white ring-2 ring-emerald-500/30">
              MTs
            </button>
            <button onclick="switchJenjang('MA')" data-jenjang="MA" class="jenjang-tab-btn px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700">
              MA
            </button>
            <button onclick="switchJenjang('Ponpes')" data-jenjang="Ponpes" class="jenjang-tab-btn px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700">
              Ponpes
            </button>
          </div>

          <!-- Active Filter Indicator -->
          <div class="mt-4 text-xs text-slate-500">
            Menampilkan galeri: <span id="active-jenjang-badge" class="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">MTs</span>
          </div>
        </div>

        <!-- AREA KONTEN GALERI MTs (Aktif) -->
        <div id="gallery-content-mts" class="space-y-16">
          
          <!-- KATEGORI 1: EKSTRAKURIKULER -->
          <section>
            <div class="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
              <div>
                <h2 class="text-2xl sm:text-3xl font-playfair font-bold text-emerald-900 flex items-center">
                  <span class="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mr-3 text-base">
                    <i class="fas fa-medal"></i>
                  </span>
                  Ekstrakurikuler
                </h2>
                <p class="text-slate-500 text-xs sm:text-sm mt-1">Kegiatan pengembangan bakat, kedisiplinan, kemandirian, dan kreativitas santri MTs.</p>
              </div>
              <span class="hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
                2 Dokumentasi
              </span>
            </div>

            <!-- Grid 2 Kolom Ekstrakurikuler -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- 1. Futsal (SLIDER) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <div class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full space-x-4 pb-2">
                    <img src="/media/galeri/mts/ekstrakurikuler_futsal_1.jpg" alt="Futsal 1" onclick="openModal(this.src)" class="flex-shrink-0 w-[90%] md:w-full snap-center object-cover h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                    <img src="/media/galeri/mts/ekstrakurikuler_futsal_2.jpg" alt="Futsal 2" onclick="openModal(this.src)" class="flex-shrink-0 w-[90%] md:w-full snap-center object-cover h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                    <video controls class="flex-shrink-0 w-[90%] md:w-full snap-center object-cover h-48 rounded-lg">
                      <source src="/media/galeri/mts/ekstrakurikuler_futsal_3.mp4" type="video/mp4">
                      Browser Anda tidak mendukung tag video.
                    </video>
                  </div>
                  <div class="text-[10px] text-slate-500 py-1 px-3 bg-slate-100 text-center border-t border-slate-200 flex items-center justify-center gap-1 font-medium">
                    <i class="fas fa-arrows-left-right text-[10px] text-emerald-600"></i> Geser untuk melihat foto lain
                  </div>
                  <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                    Slider Media
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Futsal
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Wadah penyaluran bakat olahraga untuk membentuk karakter sportif.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> MTs Nahjul Huda</span>
                    <span class="text-sky-700 font-medium"><i class="fas fa-futbol mr-1"></i> Olahraga</span>
                  </div>
                </div>
              </div>

              <!-- 2. Drum Band (SINGLE) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <video controls class="w-full h-48 object-cover rounded-t-lg">
                    <source src="/media/galeri/mts/ekstrakurikuler_drum_band.mp4" type="video/mp4">
                    Browser Anda tidak mendukung tag video.
                  </video>
                  <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                    Video
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Drum Band
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Melatih kedisiplinan dan kreativitas seni bermusik santri MTs.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> MTs Nahjul Huda</span>
                    <span class="text-sky-700 font-medium"><i class="fas fa-drum mr-1"></i> Seni Musik</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          <!-- KATEGORI 2: KEGIATAN -->
          <section>
            <div class="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
              <div>
                <h2 class="text-2xl sm:text-3xl font-playfair font-bold text-emerald-900 flex items-center">
                  <span class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mr-3 text-base">
                    <i class="fas fa-book-reader"></i>
                  </span>
                  Kegiatan
                </h2>
                <p class="text-slate-500 text-xs sm:text-sm mt-1">Potret rutinitas pembelajaran formal, pembiasaan ibadah, dan agenda santri MTs.</p>
              </div>
              <span class="hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                4 Dokumentasi
              </span>
            </div>

            <!-- Grid 3 Kolom Kegiatan (4 Item) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <!-- 1. Peringatan Isra Mi'raj (SLIDER) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <div class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full space-x-4 pb-2">
                    <img src="/media/galeri/mts/peringatan_isra_miraj_oleh_ustadz_maulana_1.jpg" alt="Peringatan Isra Mi'raj 1" onclick="openModal(this.src)" class="flex-shrink-0 w-[90%] md:w-full snap-center object-cover h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                    <img src="/media/galeri/mts/peringatan_isra_miraj_oleh_ustadz_maulana_2.jpg" alt="Peringatan Isra Mi'raj 2" onclick="openModal(this.src)" class="flex-shrink-0 w-[90%] md:w-full snap-center object-cover h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                  </div>
                  <div class="text-[10px] text-slate-500 py-1 px-3 bg-slate-100 text-center border-t border-slate-200 flex items-center justify-center gap-1 font-medium">
                    <i class="fas fa-arrows-left-right text-[10px] text-emerald-600"></i> Geser untuk melihat foto lain
                  </div>
                  <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                    Slider Media
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Peringatan Isra Mi'raj
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Momen khidmat menghadirkan tausiyah dari Ustadz Maulana.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> MTs Nahjul Huda</span>
                    <span class="text-emerald-600 font-medium"><i class="fas fa-tag mr-1"></i> Keagamaan</span>
                  </div>
                </div>
              </div>

              <!-- 2. Pembiasaan Sholat Dhuha (SINGLE) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <img src="/media/galeri/mts/sholat_dhuha_sebelum_KBM_di_mulai.jpg" alt="Pembiasaan Sholat Dhuha" onclick="openModal(this.src)" class="w-full h-48 object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity">
                  <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                    Foto
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Pembiasaan Sholat Dhuha
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Rutinitas sholat Dhuha berjamaah sebelum KBM dimulai.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> Rutin Pagi</span>
                    <span class="text-emerald-600 font-medium"><i class="fas fa-tag mr-1"></i> Ibadah</span>
                  </div>
                </div>
              </div>

              <!-- 3. Pemilihan OSIS 2026/2027 (SLIDER) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <div class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full space-x-4 pb-2">
                    <img src="/media/galeri/mts/pemilihan_ketua_osis_periode_2026-2027_1.jpg" alt="Pemilihan OSIS 1" onclick="openModal(this.src)" class="flex-shrink-0 w-[90%] md:w-full snap-center object-cover h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                    <img src="/media/galeri/mts/pemilihan_ketua_osis_periode_2026-2027_2.jpg" alt="Pemilihan OSIS 2" onclick="openModal(this.src)" class="flex-shrink-0 w-[90%] md:w-full snap-center object-cover h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                  </div>
                  <div class="text-[10px] text-slate-500 py-1 px-3 bg-slate-100 text-center border-t border-slate-200 flex items-center justify-center gap-1 font-medium">
                    <i class="fas fa-arrows-left-right text-[10px] text-emerald-600"></i> Geser untuk melihat foto lain
                  </div>
                  <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                    Slider Media
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Pemilihan OSIS 2026/2027
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Mengajarkan nilai kepemimpinan dan demokrasi pelajar.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> Periode 2026/2027</span>
                    <span class="text-emerald-600 font-medium"><i class="fas fa-tag mr-1"></i> Kesiswaan</span>
                  </div>
                </div>
              </div>

              <!-- 4. Testimoni Yayasan (SINGLE VIDEO) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <video controls class="w-full h-48 object-cover rounded-t-lg">
                    <source src="/media/galeri/mts/testimoni_yayasan_nahjul_huda_ponpes_as-surur_oleh_ustadz_maulana.mp4" type="video/mp4">
                    Browser Anda tidak mendukung tag video.
                  </video>
                  <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                    Video
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Testimoni Yayasan & Ponpes As-Surur
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Testimoni inspiratif Ustadz Maulana tentang dedikasi Yayasan & Ponpes As-Surur.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> Ustadz Maulana</span>
                    <span class="text-emerald-600 font-medium"><i class="fas fa-tag mr-1"></i> Testimoni</span>
                  </div>
                </div>
              </div>

            </div>
          </section>


        </div>

        <!-- AREA KONTEN GALERI PONPES -->
        <div id="gallery-content-ponpes" class="hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Card Album: Hari Santri Nasional -->
            <div class="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden group hover:shadow-md transition-shadow">
              
              <!-- Bagian Slider Gambar -->
              <div class="relative w-full h-[220px] bg-gray-100 border-b border-gray-200">
                <div class="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory h-full w-full custom-scrollbar pb-2">
                  <!-- Foto 1 -->
                  <img src="/media/galeri/ponpes/Kegiatan_upacara_hari_santri_nasional_22_oktober_2026_di_kemenag.jpg" alt="Hari Santri 1" onclick="openModal(this.src)" class="h-full w-full object-cover shrink-0 snap-center cursor-pointer hover:opacity-90 transition-opacity">
                  <!-- Foto 2 -->
                  <img src="/media/galeri/ponpes/Kegiatan_upacara_hari_santri_nasional_22_oktober_2026_di_kemenag_2.jpg" alt="Hari Santri 2" onclick="openModal(this.src)" class="h-full w-full object-cover shrink-0 snap-center cursor-pointer hover:opacity-90 transition-opacity">
                  <!-- Foto 3 -->
                  <img src="/media/galeri/ponpes/Kegiatan_upacara_hari_santri_nasional_22_oktober_2026_di_kemenag_3.jpg" alt="Hari Santri 3" onclick="openModal(this.src)" class="h-full w-full object-cover shrink-0 snap-center cursor-pointer hover:opacity-90 transition-opacity">
                  <!-- Foto 4 -->
                  <img src="/media/galeri/ponpes/Kegiatan_upacara_hari_santri_nasional_22_oktober_2026_di_kemenag_4.jpg" alt="Hari Santri 4" onclick="openModal(this.src)" class="h-full w-full object-cover shrink-0 snap-center cursor-pointer hover:opacity-90 transition-opacity">
                </div>
                
                <!-- Indikator Slider & Label -->
                <div class="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                  4 Foto
                </div>
                <div class="absolute bottom-6 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded shadow pointer-events-none">
                  <i class="fas fa-arrows-alt-h"></i> Geser
                </div>
              </div>
              
              <!-- Teks Deskripsi Card -->
              <div class="p-5">
                <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">Upacara Hari Santri Nasional</h3>
                <p class="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                  Dokumentasi kegiatan Upacara Peringatan Hari Santri Nasional tanggal 22 Oktober 2026 yang diselenggarakan di Kemenag, diikuti oleh santri dan asatidz Pondok Pesantren Assurur.
                </p>
                <div class="flex items-center justify-between text-xs font-medium text-gray-500 border-t border-gray-100 pt-3">
                  <span class="flex items-center gap-1.5"><i class="far fa-building text-green-600"></i> Ponpes Assurur</span>
                  <span class="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 rounded-full"><i class="fas fa-tags"></i> Kegiatan Besar</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- EMPTY STATE UNTUK JENJANG LAIN (SDI, MI, MA) -->
        <div id="gallery-content-empty" class="hidden py-16 text-center">
          <div class="max-w-md mx-auto bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
              <i class="fas fa-folder-open"></i>
            </div>
            <h3 class="text-xl font-bold font-playfair text-slate-800 mb-2">
              Galeri <span id="empty-jenjang-name">Jenjang</span> Sedang Disiapkan
            </h3>
            <p class="text-slate-500 text-sm leading-relaxed mb-6">
              Dokumentasi foto dan video untuk jenjang ini sedang dalam proses inventarisasi dan akan segera diunggah.
            </p>
            <button onclick="switchJenjang('MTs')" class="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-semibold transition shadow-sm">
              <i class="fas fa-arrow-left mr-1.5"></i> Lihat Galeri MTs
            </button>
          </div>
        </div>

      </div>

      <!-- Image Modal / Lightbox -->
      <div id="imageModal" class="fixed inset-0 z-50 hidden bg-black bg-opacity-90 flex items-center justify-center p-4" onclick="if (event.target === this) closeModal()">
        <button onclick="closeModal()" class="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 z-50">&times;</button>
        <img id="modalImage" src="" class="max-w-full max-h-full object-contain rounded-lg">
      </div>
    `;
};
