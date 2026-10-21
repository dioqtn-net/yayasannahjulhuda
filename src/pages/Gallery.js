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
            const contentEmpty = document.getElementById('gallery-content-empty');
            const emptyJenjangName = document.getElementById('empty-jenjang-name');
            const activeJenjangBadge = document.getElementById('active-jenjang-badge');

            if (activeJenjangBadge) {
                activeJenjangBadge.textContent = jenjang === 'Semua' ? 'Semua Jenjang' : jenjang;
            }

            if (jenjang === 'MTs' || jenjang === 'Semua') {
                if (contentMTs) contentMTs.classList.remove('hidden');
                if (contentEmpty) contentEmpty.classList.add('hidden');
            } else {
                if (contentMTs) contentMTs.classList.add('hidden');
                if (contentEmpty) {
                    contentEmpty.classList.remove('hidden');
                    if (emptyJenjangName) emptyJenjangName.textContent = jenjang;
                }
            }
        };
    }

    return `
      <!-- Header Galeri -->
      <section class="relative bg-[url('/images/wallpaper_yayasan.jpg')] bg-cover bg-center bg-no-repeat text-white py-20 overflow-hidden">
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
                    <img src="./images/images_video_MTs/ekstrakurikuler_futsal_1.jpg" alt="Futsal 1" onclick="openModal(this.src)" class="flex-shrink-0 w-[90%] md:w-full snap-center object-cover h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                    <img src="./images/images_video_MTs/ekstrakurikuler_futsal_2.jpg" alt="Futsal 2" onclick="openModal(this.src)" class="flex-shrink-0 w-[90%] md:w-full snap-center object-cover h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                    <video controls class="flex-shrink-0 w-[90%] md:w-full snap-center object-cover h-48 rounded-lg">
                      <source src="./images/images_video_MTs/ekstrakurikuler_futsal_3.mp4" type="video/mp4">
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
                    <source src="./images/images_video_MTs/ekstrakurikuler_drum_band.mp4" type="video/mp4">
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
                9 Dokumentasi
              </span>
            </div>

            <!-- Grid 3 Kolom Kegiatan (9 Item) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <!-- 1. Peringatan Isra Mi'raj (SLIDER) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <div class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full space-x-4 pb-2">
                    <img src="./images/images_video_MTs/peringatan_isra_miraj_oleh_ustadz_maulana_1.jpg" alt="Peringatan Isra Mi'raj 1" onclick="openModal(this.src)" class="flex-shrink-0 w-[90%] md:w-full snap-center object-cover h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                    <img src="./images/images_video_MTs/peringatan_isra_miraj_oleh_ustadz_maulana_2.jpg" alt="Peringatan Isra Mi'raj 2" onclick="openModal(this.src)" class="flex-shrink-0 w-[90%] md:w-full snap-center object-cover h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
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
                  <img src="./images/images_video_MTs/sholat_dhuha_sebelum_KBM_di_mulai.jpg" alt="Pembiasaan Sholat Dhuha" onclick="openModal(this.src)" class="w-full h-48 object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity">
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
                    <img src="./images/images_video_MTs/pemilihan_ketua_osis_periode_2026-2027_1.jpg" alt="Pemilihan OSIS 1" onclick="openModal(this.src)" class="flex-shrink-0 w-[90%] md:w-full snap-center object-cover h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                    <img src="./images/images_video_MTs/pemilihan_ketua_osis_periode_2026-2027_2.jpg" alt="Pemilihan OSIS 2" onclick="openModal(this.src)" class="flex-shrink-0 w-[90%] md:w-full snap-center object-cover h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
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

              <!-- 4. Olimpiade Madrasah Indonesia (SINGLE) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <img src="./images/images_video_MTs/olimpiade_madrasah_indonesia_(OMI)_MTs_Nahjul_Huda.jpg" alt="Olimpiade Madrasah Indonesia" onclick="openModal(this.src)" class="w-full h-48 object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity">
                  <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                    Foto
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Olimpiade Madrasah Indonesia
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Partisipasi siswa MTs dalam mengasah kemampuan akademik.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> Ajang Nasional</span>
                    <span class="text-emerald-600 font-medium"><i class="fas fa-tag mr-1"></i> Prestasi</span>
                  </div>
                </div>
              </div>

              <!-- 5. Edukasi Polsek Kebon Jeruk (SINGLE) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <img src="./images/images_video_MTs/sosialisasi_pencegahan_kenakalan_remaja_oleh_polsek_kebun_jeruk.jpg" alt="Edukasi Polsek Kebon Jeruk" onclick="openModal(this.src)" class="w-full h-48 object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity">
                  <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                    Foto
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Edukasi Polsek Kebon Jeruk
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Sosialisasi pencegahan kenakalan remaja.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> Polsek Kebon Jeruk</span>
                    <span class="text-emerald-600 font-medium"><i class="fas fa-tag mr-1"></i> Penyuluhan</span>
                  </div>
                </div>
              </div>

              <!-- 6. Edukasi Kesehatan Puskesmas (SINGLE) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <img src="./images/images_video_MTs/sosialisasi_kewanitaan_oleh_tenaga_kesehatan_puskesmas_kebun_jeruk.jpg" alt="Edukasi Kesehatan Puskesmas" onclick="openModal(this.src)" class="w-full h-48 object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity">
                  <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                    Foto
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Edukasi Kesehatan Puskesmas
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Sosialisasi kesehatan reproduksi oleh nakes.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> Puskesmas Kebon Jeruk</span>
                    <span class="text-emerald-600 font-medium"><i class="fas fa-tag mr-1"></i> Kesehatan</span>
                  </div>
                </div>
              </div>

              <!-- 7. Simulasi Pemadam Kebakaran (SLIDER) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <div class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full">
                    <img src="./images/images_video_MTs/sosialisasi_penanganan_kebakaran_1.jpg" alt="Damkar 1" onclick="openModal(this.src)" class="w-full flex-shrink-0 snap-center object-cover h-48 cursor-pointer hover:opacity-90 transition-opacity">
                    <img src="./images/images_video_MTs/sosialisasi_penanganan_kebakaran_2.jpg" alt="Damkar 2" onclick="openModal(this.src)" class="w-full flex-shrink-0 snap-center object-cover h-48 cursor-pointer hover:opacity-90 transition-opacity">
                    <img src="./images/images_video_MTs/sosialisasi_penanganan_kebakaran_3.jpg" alt="Damkar 3" onclick="openModal(this.src)" class="w-full flex-shrink-0 snap-center object-cover h-48 cursor-pointer hover:opacity-90 transition-opacity">
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
                      Simulasi Pemadam Kebakaran
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Pelatihan kesiapsiagaan bencana bersama Damkar.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> Damkar Sektor 5</span>
                    <span class="text-emerald-600 font-medium"><i class="fas fa-tag mr-1"></i> Tanggap Bencana</span>
                  </div>
                </div>
              </div>

              <!-- 8. Kunjungan Perpusnas (SINGLE) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <img src="./images/images_video_MTs/kunjungan_kelas_9_ke_perpus_nasional_jakarta.jpg" alt="Kunjungan Perpusnas" onclick="openModal(this.src)" class="w-full h-48 object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity">
                  <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                    Foto
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Kunjungan Perpusnas
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Kunjungan belajar kelas 9 ke Perpustakaan Nasional.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> Kelas 9 MTs</span>
                    <span class="text-emerald-600 font-medium"><i class="fas fa-tag mr-1"></i> Literasi</span>
                  </div>
                </div>
              </div>

              <!-- 9. Testimoni Yayasan (SINGLE VIDEO) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <video controls class="w-full h-48 object-cover rounded-t-lg">
                    <source src="./images/images_video_MTs/testimoni_yayasan_nahjul_huda_ponpes_as-surur_oleh_ustadz_maulana.mp4" type="video/mp4">
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

          <!-- KATEGORI 3: FASILITAS -->
          <section>
            <div class="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
              <div>
                <h2 class="text-2xl sm:text-3xl font-playfair font-bold text-emerald-900 flex items-center">
                  <span class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mr-3 text-base">
                    <i class="fas fa-building"></i>
                  </span>
                  Fasilitas
                </h2>
                <p class="text-slate-500 text-xs sm:text-sm mt-1">Sarana dan prasarana penunjang kegiatan belajar mengajar santri MTs Nahjul Huda.</p>
              </div>
              <span class="hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                Dalam Proses
              </span>
            </div>

            <!-- Kotak Kosong / Placeholder: Dokumentasi Fasilitas Segera Hadir -->
            <div class="border-2 border-dashed border-slate-300 rounded-2xl p-10 sm:p-14 text-center bg-slate-50/70 hover:bg-slate-50 transition-colors">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-200/70 flex items-center justify-center text-slate-400 text-2xl">
                <i class="fas fa-camera-retro"></i>
              </div>
              <h3 class="text-lg sm:text-xl font-bold font-playfair text-slate-700 mb-2">
                Dokumentasi fasilitas segera hadir
              </h3>
              <p class="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Foto sarana ruang kelas, laboratorium komputer & IPA, perpustakaan madrasah, dan lapangan olahraga sedang dalam proses dokumentasi.
              </p>
            </div>
          </section>

        </div>

        <!-- EMPTY STATE UNTUK JENJANG LAIN (SDI, MI, MA, Ponpes) -->
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
