export const renderNews = (newsList) => {
    // Setup search listener after render
    setTimeout(() => {
        const searchInput = document.getElementById('searchNewsInput');
        const newsCards = document.querySelectorAll('.news-card');
        const noResultsMsg = document.getElementById('noResultsMsg');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                let visibleCount = 0;

                newsCards.forEach(card => {
                    const title = card.querySelector('.news-title')?.textContent.toLowerCase() || '';
                    const desc = card.querySelector('.news-desc')?.textContent.toLowerCase() || '';
                    
                    if (title.includes(query) || desc.includes(query)) {
                        card.classList.remove('hidden');
                        visibleCount++;
                    } else {
                        card.classList.add('hidden');
                    }
                });

                if (noResultsMsg) {
                    if (visibleCount === 0) {
                        noResultsMsg.classList.remove('hidden');
                    } else {
                        noResultsMsg.classList.add('hidden');
                    }
                }
            });
        }
    }, 100);

    return `
      <!-- Header Berita -->
      <section class="relative bg-[url('/images/wallpaper_yayasan.jpg')] bg-cover bg-center bg-no-repeat text-white py-20 overflow-hidden">
        <!-- Dark Overlay Wrapper -->
        <div class="absolute inset-0 bg-black/75 z-0"></div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-900/80 border border-emerald-500/40 rounded-full text-xs font-semibold text-emerald-300 mb-3">
            <i class="fas fa-newspaper text-emerald-400"></i>
            <span>Kabar Terkini & Kegiatan</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-playfair font-bold mb-4 text-gold-400 drop-shadow-md">Berita & Pengumuman</h1>
          <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-4"></div>
          <p class="text-slate-100 text-base sm:text-lg max-w-2xl mx-auto drop-shadow leading-relaxed">
            Informasi teranyar seputar kegiatan kesiswaan, prestasi, pembiasaan ibadah, dan pengumuman resmi MTs Nahjul Huda.
          </p>
        </div>
      </section>

      <!-- Main Content Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <!-- Search & Header Bar -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h2 class="text-2xl font-bold font-playfair text-slate-800">Daftar Kegiatan & Berita MTs</h2>
            <p class="text-slate-500 text-sm mt-1">Dokumentasi 11 kegiatan unggulan siswa-siswi MTs Nahjul Huda</p>
          </div>
          <div class="relative w-full md:w-80">
            <input type="text" id="searchNewsInput" placeholder="Cari kegiatan atau berita..." class="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm transition">
            <i class="fas fa-search absolute left-3.5 top-3.5 text-slate-400 text-sm"></i>
          </div>
        </div>

        <!-- Grid 11 Kartu Berita -->
        <div id="newsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <!-- 1. Ekstrakurikuler Futsal (SLIDER) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
              <div class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar">
                <img src="./images/images_video_MTs/ekstrakurikuler_futsal_1.jpg" alt="Ekstrakurikuler Futsal 1" class="flex-shrink-0 w-full snap-center object-cover h-56">
                <img src="./images/images_video_MTs/ekstrakurikuler_futsal_2.jpg" alt="Ekstrakurikuler Futsal 2" class="flex-shrink-0 w-full snap-center object-cover h-56">
                <video controls class="flex-shrink-0 w-full snap-center object-cover h-56">
                  <source src="./images/images_video_MTs/ekstrakurikuler_futsal_3.mp4" type="video/mp4">
                  Browser Anda tidak mendukung tag video.
                </video>
              </div>
              <div class="text-[11px] text-slate-500 py-1.5 px-3 bg-slate-100 text-center border-t border-slate-200 flex items-center justify-center gap-1.5 font-medium">
                <i class="fas fa-arrows-left-right text-xs text-emerald-600"></i> Geser untuk melihat foto lain
              </div>
              <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                Slider Media
              </span>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2 text-xs text-slate-400">
                  <span class="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Ekstrakurikuler
                  </span>
                  <span><i class="far fa-calendar-alt mr-1"></i> MTs Nahjul Huda</span>
                </div>
                <h3 class="news-title font-playfair font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2">
                  Semarak Ekstrakurikuler Futsal
                </h3>
                <p class="news-desc text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Wadah penyaluran bakat olahraga siswa MTs Nahjul Huda untuk membentuk karakter sportif, tangkas, dan kerja sama tim.
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span class="text-emerald-600 font-medium flex items-center">
                  <i class="fas fa-futbol mr-1.5"></i> Olahraga
                </span>
                <span class="text-slate-400">3 Media (Foto & Video)</span>
              </div>
            </div>
          </article>

          <!-- 2. Ekstrakurikuler Drum Band (SINGLE VIDEO) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
              <video controls class="w-full h-56 object-cover rounded-t-lg">
                <source src="./images/images_video_MTs/ekstrakurikuler_drum_band.mp4" type="video/mp4">
                Browser Anda tidak mendukung tag video.
              </video>
              <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                Video
              </span>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2 text-xs text-slate-400">
                  <span class="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Ekstrakurikuler
                  </span>
                  <span><i class="far fa-calendar-alt mr-1"></i> MTs Nahjul Huda</span>
                </div>
                <h3 class="news-title font-playfair font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2">
                  Penampilan Ekstrakurikuler Drum Band
                </h3>
                <p class="news-desc text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Siswa-siswi unjuk kebolehan dalam ekstrakurikuler drum band, melatih kedisiplinan dan kreativitas seni bermusik yang memukau.
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span class="text-emerald-600 font-medium flex items-center">
                  <i class="fas fa-drum mr-1.5"></i> Seni Musik
                </span>
                <span class="text-slate-400">Video Dokumentasi</span>
              </div>
            </div>
          </article>

          <!-- 3. Testimoni Yayasan (SINGLE VIDEO) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
              <video controls class="w-full h-56 object-cover rounded-t-lg">
                <source src="./images/images_video_MTs/testimoni_yayasan_nahjul_huda_ponpes_as-surur_oleh_ustadz_maulana.mp4" type="video/mp4">
                Browser Anda tidak mendukung tag video.
              </video>
              <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                Testimoni
              </span>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2 text-xs text-slate-400">
                  <span class="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Yayasan & Ponpes
                  </span>
                  <span><i class="far fa-calendar-alt mr-1"></i> Ustadz Maulana</span>
                </div>
                <h3 class="news-title font-playfair font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2">
                  Testimoni Yayasan & Ponpes As-Surur
                </h3>
                <p class="news-desc text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Dengarkan testimoni inspiratif dari Ustadz Maulana mengenai dedikasi Yayasan Nahjul Huda dalam mencetak generasi berakhlak mulia.
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span class="text-emerald-600 font-medium flex items-center">
                  <i class="fas fa-video mr-1.5"></i> Video Inspirasi
                </span>
                <span class="text-slate-400">Ponpes As-Surur</span>
              </div>
            </div>
          </article>

          <!-- 4. Peringatan Isra Mi'raj (SLIDER) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
              <div class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar">
                <img src="./images/images_video_MTs/peringatan_isra_miraj_oleh_ustadz_maulana_1.jpg" alt="Peringatan Isra Mi'raj 1" class="flex-shrink-0 w-full snap-center object-cover h-56">
                <img src="./images/images_video_MTs/peringatan_isra_miraj_oleh_ustadz_maulana_2.jpg" alt="Peringatan Isra Mi'raj 2" class="flex-shrink-0 w-full snap-center object-cover h-56">
              </div>
              <div class="text-[11px] text-slate-500 py-1.5 px-3 bg-slate-100 text-center border-t border-slate-200 flex items-center justify-center gap-1.5 font-medium">
                <i class="fas fa-arrows-left-right text-xs text-emerald-600"></i> Geser untuk melihat foto lain
              </div>
              <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                Slider Media
              </span>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2 text-xs text-slate-400">
                  <span class="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    PHBI
                  </span>
                  <span><i class="far fa-calendar-alt mr-1"></i> Tabligh Akbar</span>
                </div>
                <h3 class="news-title font-playfair font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2">
                  Peringatan Isra Mi'raj bersama Ustadz Maulana
                </h3>
                <p class="news-desc text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Momen khidmat dan penuh keberkahan pada peringatan Isra Mi'raj Nabi Muhammad SAW, menghadirkan tausiyah langsung dari Ustadz Maulana.
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span class="text-emerald-600 font-medium flex items-center">
                  <i class="fas fa-mosque mr-1.5"></i> Keagamaan
                </span>
                <span class="text-slate-400">2 Foto Kegiatan</span>
              </div>
            </div>
          </article>

          <!-- 5. Sholat Dhuha (SINGLE GAMBAR) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
              <img src="./images/images_video_MTs/sholat_dhuha_sebelum_KBM_di_mulai.jpg" alt="Pembiasaan Sholat Dhuha Sebelum KBM" class="w-full h-56 object-cover rounded-t-lg">
              <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                Foto
              </span>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2 text-xs text-slate-400">
                  <span class="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Pembiasaan Karakter
                  </span>
                  <span><i class="far fa-calendar-alt mr-1"></i> Rutin Pagi</span>
                </div>
                <h3 class="news-title font-playfair font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2">
                  Pembiasaan Sholat Dhuha Sebelum KBM
                </h3>
                <p class="news-desc text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Membangun fondasi spiritual siswa melalui rutinitas sholat Dhuha berjamaah setiap pagi sebelum Kegiatan Belajar Mengajar dimulai.
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span class="text-emerald-600 font-medium flex items-center">
                  <i class="fas fa-hands-praying mr-1.5"></i> Ibadah
                </span>
                <span class="text-slate-400">Dokumentasi KBM</span>
              </div>
            </div>
          </article>

          <!-- 6. Pemilihan Ketua OSIS (SLIDER) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
              <div class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar">
                <img src="./images/images_video_MTs/pemilihan_ketua_osis_periode_2026-2027_1.jpg" alt="Pemilihan Ketua OSIS 1" class="flex-shrink-0 w-full snap-center object-cover h-56">
                <img src="./images/images_video_MTs/pemilihan_ketua_osis_periode_2026-2027_2.jpg" alt="Pemilihan Ketua OSIS 2" class="flex-shrink-0 w-full snap-center object-cover h-56">
              </div>
              <div class="text-[11px] text-slate-500 py-1.5 px-3 bg-slate-100 text-center border-t border-slate-200 flex items-center justify-center gap-1.5 font-medium">
                <i class="fas fa-arrows-left-right text-xs text-emerald-600"></i> Geser untuk melihat foto lain
              </div>
              <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                Slider Media
              </span>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2 text-xs text-slate-400">
                  <span class="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Kesiswaan
                  </span>
                  <span><i class="far fa-calendar-alt mr-1"></i> Periode 2026/2027</span>
                </div>
                <h3 class="news-title font-playfair font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2">
                  Demokrasi Pelajar: Pemilihan OSIS 2026/2027
                </h3>
                <p class="news-desc text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Mengajarkan nilai-nilai kepemimpinan dan proses demokrasi secara langsung melalui ajang pemilihan Ketua OSIS.
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span class="text-emerald-600 font-medium flex items-center">
                  <i class="fas fa-check-to-slot mr-1.5"></i> Kepemimpinan
                </span>
                <span class="text-slate-400">2 Foto Kegiatan</span>
              </div>
            </div>
          </article>

          <!-- 7. Olimpiade Madrasah (SINGLE GAMBAR) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
              <img src="./images/images_video_MTs/olimpiade_madrasah_indonesia_(OMI)_MTs_Nahjul_Huda.jpg" alt="Partisipasi Olimpiade Madrasah Indonesia" class="w-full h-56 object-cover rounded-t-lg">
              <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                Foto
              </span>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2 text-xs text-slate-400">
                  <span class="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Prestasi & Akademik
                  </span>
                  <span><i class="far fa-calendar-alt mr-1"></i> Ajang Nasional</span>
                </div>
                <h3 class="news-title font-playfair font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2">
                  Partisipasi Olimpiade Madrasah Indonesia
                </h3>
                <p class="news-desc text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Siswa-siswi kebanggaan MTs Nahjul Huda turut berpartisipasi mengasah kemampuan akademik dalam ajang bergengsi OMI.
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span class="text-emerald-600 font-medium flex items-center">
                  <i class="fas fa-medal mr-1.5"></i> Kompetisi OMI
                </span>
                <span class="text-slate-400">Dokumentasi Delegasi</span>
              </div>
            </div>
          </article>

          <!-- 8. Sosialisasi Polsek (SINGLE GAMBAR) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
              <img src="./images/images_video_MTs/sosialisasi_pencegahan_kenakalan_remaja_oleh_polsek_kebun_jeruk.jpg" alt="Sosialisasi Pencegahan Kenakalan Remaja" class="w-full h-56 object-cover rounded-t-lg">
              <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                Foto
              </span>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2 text-xs text-slate-400">
                  <span class="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Penyuluhan
                  </span>
                  <span><i class="far fa-calendar-alt mr-1"></i> Polsek Kebon Jeruk</span>
                </div>
                <h3 class="news-title font-playfair font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2">
                  Sosialisasi Pencegahan Kenakalan Remaja
                </h3>
                <p class="news-desc text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Bekerja sama dengan Polsek Kebon Jeruk, sekolah mengadakan edukasi untuk menjaga keamanan dan ketertiban lingkungan pelajar.
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span class="text-emerald-600 font-medium flex items-center">
                  <i class="fas fa-shield-halved mr-1.5"></i> Kamtibmas
                </span>
                <span class="text-slate-400">Kerja Sama Instansi</span>
              </div>
            </div>
          </article>

          <!-- 9. Sosialisasi Puskesmas (SINGLE GAMBAR) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
              <img src="./images/images_video_MTs/sosialisasi_kewanitaan_oleh_tenaga_kesehatan_puskesmas_kebun_jeruk.jpg" alt="Edukasi Kesehatan oleh Puskesmas" class="w-full h-56 object-cover rounded-t-lg">
              <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                Foto
              </span>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2 text-xs text-slate-400">
                  <span class="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Kesehatan Remaja
                  </span>
                  <span><i class="far fa-calendar-alt mr-1"></i> Puskesmas Kebon Jeruk</span>
                </div>
                <h3 class="news-title font-playfair font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2">
                  Edukasi Kesehatan oleh Puskesmas
                </h3>
                <p class="news-desc text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Kegiatan edukasi kesehatan reproduksi remaja putri oleh tenaga kesehatan dari Puskesmas Kebon Jeruk.
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span class="text-emerald-600 font-medium flex items-center">
                  <i class="fas fa-heart-pulse mr-1.5"></i> Layanan Kesehatan
                </span>
                <span class="text-slate-400">Penyuluhan Siswi</span>
              </div>
            </div>
          </article>

          <!-- 10. Simulasi Damkar (SLIDER) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
              <div class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar">
                <img src="./images/images_video_MTs/sosialisasi_penanganan_kebakaran_1.jpg" alt="Simulasi Kebakaran 1" class="flex-shrink-0 w-full snap-center object-cover h-56">
                <img src="./images/images_video_MTs/sosialisasi_penanganan_kebakaran_2.jpg" alt="Simulasi Kebakaran 2" class="flex-shrink-0 w-full snap-center object-cover h-56">
                <img src="./images/images_video_MTs/sosialisasi_penanganan_kebakaran_3.jpg" alt="Simulasi Kebakaran 3" class="flex-shrink-0 w-full snap-center object-cover h-56">
              </div>
              <div class="text-[11px] text-slate-500 py-1.5 px-3 bg-slate-100 text-center border-t border-slate-200 flex items-center justify-center gap-1.5 font-medium">
                <i class="fas fa-arrows-left-right text-xs text-emerald-600"></i> Geser untuk melihat foto lain
              </div>
              <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                Slider Media
              </span>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2 text-xs text-slate-400">
                  <span class="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Kesiapsiagaan
                  </span>
                  <span><i class="far fa-calendar-alt mr-1"></i> Damkar Sektor 5</span>
                </div>
                <h3 class="news-title font-playfair font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2">
                  Simulasi Kebakaran bersama Damkar
                </h3>
                <p class="news-desc text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Pelatihan kesiapsiagaan bencana dan penanganan kebakaran oleh Tim Pemadam Kebakaran Sektor 5 Kebon Jeruk.
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span class="text-emerald-600 font-medium flex items-center">
                  <i class="fas fa-fire-extinguisher mr-1.5"></i> Tanggap Bencana
                </span>
                <span class="text-slate-400">3 Foto Simulasi</span>
              </div>
            </div>
          </article>

          <!-- 11. Kunjungan Perpusnas (SINGLE GAMBAR) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative overflow-hidden rounded-t-lg bg-slate-900">
              <img src="./images/images_video_MTs/kunjungan_kelas_9_ke_perpus_nasional_jakarta.jpg" alt="Kunjungan Edukatif ke Perpusnas" class="w-full h-56 object-cover rounded-t-lg">
              <span class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                Foto
              </span>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2 text-xs text-slate-400">
                  <span class="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Kunjungan Edukasi
                  </span>
                  <span><i class="far fa-calendar-alt mr-1"></i> Kelas 9 MTs</span>
                </div>
                <h3 class="news-title font-playfair font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2">
                  Kunjungan Edukatif ke Perpusnas
                </h3>
                <p class="news-desc text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Memperluas wawasan dan menumbuhkan minat baca melalui kunjungan belajar kelas 9 ke Perpustakaan Nasional Republik Indonesia.
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span class="text-emerald-600 font-medium flex items-center">
                  <i class="fas fa-book-open-reader mr-1.5"></i> Literasi
                </span>
                <span class="text-slate-400">Perpusnas Jakarta</span>
              </div>
            </div>
          </article>

        </div>

        <!-- Empty search result indicator -->
        <div id="noResultsMsg" class="hidden text-center py-16 bg-white rounded-2xl border border-slate-200 mt-6">
          <i class="fas fa-search text-slate-300 text-4xl mb-3"></i>
          <h4 class="text-lg font-bold text-slate-700">Kegiatan Tidak Ditemukan</h4>
          <p class="text-slate-500 text-sm mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
        </div>

      </div>
    `;
};
