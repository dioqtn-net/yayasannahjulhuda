export const renderGallery = (galleries) => {
    
    // Lightbox logic
    if (!window.openLightbox) {
        window.openLightbox = (url, title) => {
            const lb = document.getElementById('lightbox');
            const lbImg = document.getElementById('lightbox-img');
            const lbTitle = document.getElementById('lightbox-title');
            if (lb && lbImg && lbTitle) {
                lbImg.src = url;
                lbTitle.textContent = title || '';
                lb.classList.remove('hidden');
                document.body.classList.add('modal-open');
            }
        };
        window.closeLightbox = () => {
            const lb = document.getElementById('lightbox');
            if (lb) {
                lb.classList.add('hidden');
                document.body.classList.remove('modal-open');
                document.getElementById('lightbox-img').src = '';
            }
        };
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
          
          <!-- KATEGORI 1: KEGIATAN -->
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
                3 Dokumentasi
              </span>
            </div>

            <!-- Grid 3 Kolom Kegiatan -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <!-- Card 1: Contoh Kegiatan MTs -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative aspect-video bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center overflow-hidden cursor-pointer" onclick="openLightbox('/images/MTs.jpg', 'Contoh Kegiatan MTs - Pembiasaan Shalat & Dzikir Bersama')">
                  <div class="text-center p-6 text-white group-hover:scale-105 transition-transform duration-300">
                    <div class="w-14 h-14 mx-auto mb-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <i class="fas fa-mosque text-2xl text-emerald-300"></i>
                    </div>
                    <span class="text-xs uppercase tracking-wider font-semibold text-emerald-300">Foto / Video</span>
                  </div>
                  <div class="absolute inset-0 bg-emerald-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span class="bg-white text-emerald-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center">
                      <i class="fas fa-search-plus mr-1.5"></i> Perbesar
                    </span>
                  </div>
                  <span class="absolute top-3 left-3 bg-emerald-900/80 backdrop-blur-sm text-emerald-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40">
                    MTs Nahjul Huda
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Contoh Kegiatan MTs
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Dokumentasi pembiasaan shalat dhuha berjamaah dan tadarus Al-Qur'an sebelum jam pembelajaran dimulai.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> Rutin Pagi</span>
                    <span class="text-emerald-600 font-medium"><i class="fas fa-tag mr-1"></i> Ibadah</span>
                  </div>
                </div>
              </div>

              <!-- Card 2: Contoh Kegiatan MTs -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative aspect-video bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center overflow-hidden cursor-pointer" onclick="openLightbox('/images/MTs.jpg', 'Contoh Kegiatan MTs - Pembelajaran Interaktif di Kelas')">
                  <div class="text-center p-6 text-white group-hover:scale-105 transition-transform duration-300">
                    <div class="w-14 h-14 mx-auto mb-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <i class="fas fa-chalkboard-teacher text-2xl text-emerald-300"></i>
                    </div>
                    <span class="text-xs uppercase tracking-wider font-semibold text-emerald-300">Foto / Video</span>
                  </div>
                  <div class="absolute inset-0 bg-emerald-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span class="bg-white text-emerald-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center">
                      <i class="fas fa-search-plus mr-1.5"></i> Perbesar
                    </span>
                  </div>
                  <span class="absolute top-3 left-3 bg-emerald-900/80 backdrop-blur-sm text-emerald-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40">
                    MTs Nahjul Huda
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Contoh Kegiatan MTs
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Suasana belajar mengajar interaktif berbasis kurikulum terpadu antara ilmu agama dan sains di kelas.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> Jam Akademik</span>
                    <span class="text-emerald-600 font-medium"><i class="fas fa-tag mr-1"></i> Akademik</span>
                  </div>
                </div>
              </div>

              <!-- Card 3: Contoh Kegiatan MTs -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative aspect-video bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center overflow-hidden cursor-pointer" onclick="openLightbox('/images/MTs.jpg', 'Contoh Kegiatan MTs - Bimbingan Tahfidz & Kitab Kuning')">
                  <div class="text-center p-6 text-white group-hover:scale-105 transition-transform duration-300">
                    <div class="w-14 h-14 mx-auto mb-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <i class="fas fa-quran text-2xl text-emerald-300"></i>
                    </div>
                    <span class="text-xs uppercase tracking-wider font-semibold text-emerald-300">Foto / Video</span>
                  </div>
                  <div class="absolute inset-0 bg-emerald-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span class="bg-white text-emerald-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center">
                      <i class="fas fa-search-plus mr-1.5"></i> Perbesar
                    </span>
                  </div>
                  <span class="absolute top-3 left-3 bg-emerald-900/80 backdrop-blur-sm text-emerald-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40">
                    MTs Nahjul Huda
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Contoh Kegiatan MTs
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Sesi setoran hafalan Al-Qur'an (tahfidz) serta halaqah pembacaan kitab salaf santri madrasah tsanawiyah.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-calendar-alt mr-1"></i> Sore Hari</span>
                    <span class="text-emerald-600 font-medium"><i class="fas fa-tag mr-1"></i> Tahfidz</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          <!-- KATEGORI 2: EKSTRAKURIKULER -->
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
                3 Dokumentasi
              </span>
            </div>

            <!-- Grid 3 Kolom Ekstrakurikuler -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <!-- Card 1: Latihan Paskibra -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center overflow-hidden cursor-pointer" onclick="openLightbox('/images/MTs.jpg', 'Ekstrakurikuler MTs - Latihan Paskibra')">
                  <div class="text-center p-6 text-white group-hover:scale-105 transition-transform duration-300">
                    <div class="w-14 h-14 mx-auto mb-2 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-400/30 flex items-center justify-center">
                      <i class="fas fa-flag text-2xl text-red-400"></i>
                    </div>
                    <span class="text-xs uppercase tracking-wider font-semibold text-slate-300">Foto / Video</span>
                  </div>
                  <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span class="bg-white text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center">
                      <i class="fas fa-search-plus mr-1.5"></i> Perbesar
                    </span>
                  </div>
                  <span class="absolute top-3 left-3 bg-red-900/80 backdrop-blur-sm text-red-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-red-600/40">
                    Paskibra
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Latihan Paskibra
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Pembinaan kedisiplinan baris-berbaris, formasi pengibaran bendera, dan penanaman rasa cinta tanah air santri MTs.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-clock mr-1"></i> Sabtu Sore</span>
                    <span class="text-sky-700 font-medium"><i class="fas fa-shield-alt mr-1"></i> Kedisiplinan</span>
                  </div>
                </div>
              </div>

              <!-- Card 2: Pramuka -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative aspect-video bg-gradient-to-br from-amber-900 to-amber-950 flex items-center justify-center overflow-hidden cursor-pointer" onclick="openLightbox('/images/MTs.jpg', 'Ekstrakurikuler MTs - Pramuka')">
                  <div class="text-center p-6 text-white group-hover:scale-105 transition-transform duration-300">
                    <div class="w-14 h-14 mx-auto mb-2 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 flex items-center justify-center">
                      <i class="fas fa-campground text-2xl text-amber-300"></i>
                    </div>
                    <span class="text-xs uppercase tracking-wider font-semibold text-amber-300">Foto / Video</span>
                  </div>
                  <div class="absolute inset-0 bg-amber-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span class="bg-white text-amber-950 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center">
                      <i class="fas fa-search-plus mr-1.5"></i> Perbesar
                    </span>
                  </div>
                  <span class="absolute top-3 left-3 bg-amber-900/80 backdrop-blur-sm text-amber-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-amber-600/40">
                    Pramuka
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Pramuka
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Latihan kepanduan, sandi, pioneering tali-temali, penjelajahan alam, dan kemandirian regu penggalang.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-clock mr-1"></i> Jumat Siang</span>
                    <span class="text-amber-700 font-medium"><i class="fas fa-compass mr-1"></i> Kepanduan</span>
                  </div>
                </div>
              </div>

              <!-- Card 3: Hadroh & Seni Musik Islami -->
              <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="relative aspect-video bg-gradient-to-br from-emerald-900 to-teal-950 flex items-center justify-center overflow-hidden cursor-pointer" onclick="openLightbox('/images/MTs.jpg', 'Ekstrakurikuler MTs - Hadroh & Seni Musik Islami')">
                  <div class="text-center p-6 text-white group-hover:scale-105 transition-transform duration-300">
                    <div class="w-14 h-14 mx-auto mb-2 rounded-full bg-teal-500/20 backdrop-blur-sm border border-teal-400/30 flex items-center justify-center">
                      <i class="fas fa-drum text-2xl text-teal-300"></i>
                    </div>
                    <span class="text-xs uppercase tracking-wider font-semibold text-teal-300">Foto / Video</span>
                  </div>
                  <div class="absolute inset-0 bg-teal-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span class="bg-white text-teal-950 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center">
                      <i class="fas fa-search-plus mr-1.5"></i> Perbesar
                    </span>
                  </div>
                  <span class="absolute top-3 left-3 bg-teal-900/80 backdrop-blur-sm text-teal-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-teal-600/40">
                    Hadroh
                  </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      Hadroh & Seni Musik Islami
                    </h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      Pelatihan tabuhan rebana, kasidah, vokal shalawat nabi, serta penampilan pada agenda perayaan hari besar Islam.
                    </p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span><i class="far fa-clock mr-1"></i> Ahad Pagi</span>
                    <span class="text-teal-700 font-medium"><i class="fas fa-music mr-1"></i> Kesenian</span>
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

      <!-- Lightbox Modal -->
      <div id="lightbox" class="hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
        <button onclick="closeLightbox()" class="absolute top-4 right-4 z-10 text-white/70 hover:text-white p-2">
            <i class="fas fa-times text-3xl"></i>
        </button>
        <div class="max-w-4xl w-full mx-auto flex flex-col items-center">
            <img id="lightbox-img" src="" alt="" class="max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/10">
            <h3 id="lightbox-title" class="text-white text-base sm:text-lg font-bold mt-4 text-center"></h3>
        </div>
      </div>
    `;
};
