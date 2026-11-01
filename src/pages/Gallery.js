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
            Momen berharga dan potret kegiatan keseharian siswa/siswi dan santri serta fasilitas di lingkungan Yayasan Nahjul Huda.
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
        <div id="gallery-content-mts">
          <!-- Grid 4 Kolom Galeri MTs -->
          <div class="max-h-[850px] overflow-y-auto pr-2 custom-scrollbar">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <!-- 1. Futsal (SLIDER) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <div class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar w-full h-48">
                    <img src="/media/galeri/mts/ekstrakurikuler_futsal_1.jpg" alt="Futsal 1" onclick="openModal(this.src)" class="w-full h-full object-cover shrink-0 snap-center cursor-pointer hover:brightness-90 transition">
                    <img src="/media/galeri/mts/ekstrakurikuler_futsal_2.jpg" alt="Futsal 2" onclick="openModal(this.src)" class="w-full h-full object-cover shrink-0 snap-center cursor-pointer hover:brightness-90 transition">
                    <video class="w-full h-full object-cover shrink-0 snap-center cursor-pointer hover:brightness-90 transition">
                      <source src="/media/galeri/mts/ekstrakurikuler_futsal_3.mp4" type="video/mp4">
                      Browser Anda tidak mendukung tag video.
                    </video>
                  </div>
                  <!-- Nav Buttons -->
                  <button type="button" aria-label="Media sebelumnya" onclick="this.parentElement.querySelector('.overflow-x-auto').scrollBy({left: -this.parentElement.offsetWidth, behavior: 'smooth'})" class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center text-sm shadow-md transition z-10 focus:outline-none">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <button type="button" aria-label="Media berikutnya" onclick="this.parentElement.querySelector('.overflow-x-auto').scrollBy({left: this.parentElement.offsetWidth, behavior: 'smooth'})" class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center text-sm shadow-md transition z-10 focus:outline-none">
                    <i class="fas fa-chevron-right"></i>
                  </button>
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
                  </div>
                </div>
              </div>

              <!-- 2. Drum Band (SINGLE) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <video class="w-full h-48 object-cover rounded-t-lg cursor-pointer hover:brightness-90 transition">
                    <source src="/media/galeri/mts/ekstrakurikuler_drum_band.mp4" type="video/mp4">
                    Browser Anda tidak mendukung tag video.
                  </video>
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span class="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center text-sm shadow">
                      <i class="fas fa-play ml-0.5"></i>
                    </span>
                  </div>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Drum Band
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Melatih kedisiplinan dan kreativitas seni bermusik siswa/siswi MTs.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> MTs Nahjul Huda</span>
                  </div>
                </div>
              </div>

              <!-- 3. Peringatan Isra Mi'raj (SLIDER) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <div class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar w-full h-48">
                    <img src="/media/galeri/mts/peringatan_isra_miraj_oleh_ustadz_maulana_1.jpg" alt="Peringatan Isra Mi'raj 1" onclick="openModal(this.src)" class="w-full h-full object-cover shrink-0 snap-center cursor-pointer hover:brightness-90 transition">
                    <img src="/media/galeri/mts/peringatan_isra_miraj_oleh_ustadz_maulana_2.jpg" alt="Peringatan Isra Mi'raj 2" onclick="openModal(this.src)" class="w-full h-full object-cover shrink-0 snap-center cursor-pointer hover:brightness-90 transition">
                  </div>
                  <!-- Nav Buttons -->
                  <button type="button" aria-label="Media sebelumnya" onclick="this.parentElement.querySelector('.overflow-x-auto').scrollBy({left: -this.parentElement.offsetWidth, behavior: 'smooth'})" class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center text-sm shadow-md transition z-10 focus:outline-none">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <button type="button" aria-label="Media berikutnya" onclick="this.parentElement.querySelector('.overflow-x-auto').scrollBy({left: this.parentElement.offsetWidth, behavior: 'smooth'})" class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center text-sm shadow-md transition z-10 focus:outline-none">
                    <i class="fas fa-chevron-right"></i>
                  </button>
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
                  </div>
                </div>
              </div>

              <!-- 4. Pembiasaan Sholat Dhuha (SINGLE) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <img src="/media/galeri/mts/sholat_dhuha_sebelum_KBM_di_mulai.jpg" alt="Pembiasaan Sholat Dhuha" onclick="openModal(this.src)" class="w-full h-48 object-cover rounded-t-lg cursor-pointer hover:brightness-90 transition">
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
                  </div>
                </div>
              </div>

              <!-- 5. Pemilihan OSIS 2026/2027 (SLIDER) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <div class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar w-full h-48">
                    <img src="/media/galeri/mts/pemilihan_ketua_osis_periode_2026-2027_1.jpg" alt="Pemilihan OSIS 1" onclick="openModal(this.src)" class="w-full h-full object-cover shrink-0 snap-center cursor-pointer hover:brightness-90 transition">
                    <img src="/media/galeri/mts/pemilihan_ketua_osis_periode_2026-2027_2.jpg" alt="Pemilihan OSIS 2" onclick="openModal(this.src)" class="w-full h-full object-cover shrink-0 snap-center cursor-pointer hover:brightness-90 transition">
                  </div>
                  <!-- Nav Buttons -->
                  <button type="button" aria-label="Media sebelumnya" onclick="this.parentElement.querySelector('.overflow-x-auto').scrollBy({left: -this.parentElement.offsetWidth, behavior: 'smooth'})" class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center text-sm shadow-md transition z-10 focus:outline-none">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <button type="button" aria-label="Media berikutnya" onclick="this.parentElement.querySelector('.overflow-x-auto').scrollBy({left: this.parentElement.offsetWidth, behavior: 'smooth'})" class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center text-sm shadow-md transition z-10 focus:outline-none">
                    <i class="fas fa-chevron-right"></i>
                  </button>
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
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- AREA KONTEN GALERI PONPES -->
        <div id="gallery-content-ponpes" class="hidden">
          <!-- Grid 4 Kolom Galeri Ponpes -->
          <div class="max-h-[850px] overflow-y-auto pr-2 custom-scrollbar">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <!-- 1. Lomba Cerdas Cermat (SLIDER) -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
                  <div class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar w-full h-48">
                    <!-- Foto 1 -->
                    <img src="/media/galeri/ponpes/juri_lomba.jpg" alt="Juri Lomba 1" onclick="openModal(this.src)" class="w-full h-full object-cover shrink-0 snap-center cursor-pointer hover:brightness-90 transition">
                    
                    <!-- Foto 2 -->
                    <img src="/media/galeri/ponpes/JURI.jpg" alt="Juri Lomba 2" onclick="openModal(this.src)" class="w-full h-full object-cover shrink-0 snap-center cursor-pointer hover:brightness-90 transition">
                    
                    <!-- Foto 3 -->
                    <img src="/media/galeri/ponpes/PESERTA.jpg" alt="Peserta Lomba" onclick="openModal(this.src)" class="w-full h-full object-cover shrink-0 snap-center cursor-pointer hover:brightness-90 transition">
                  </div>
                  <!-- Nav Buttons -->
                  <button type="button" aria-label="Media sebelumnya" onclick="this.parentElement.querySelector('.overflow-x-auto').scrollBy({left: -this.parentElement.offsetWidth, behavior: 'smooth'})" class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center text-sm shadow-md transition z-10 focus:outline-none">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <button type="button" aria-label="Media berikutnya" onclick="this.parentElement.querySelector('.overflow-x-auto').scrollBy({left: this.parentElement.offsetWidth, behavior: 'smooth'})" class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center text-sm shadow-md transition z-10 focus:outline-none">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Lomba Cerdas Cermat
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Dokumentasi suasana perlombaan dan dewan juri pada ajang Cerdas Cermat.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> Ponpes Assurur</span>
                  </div>
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
