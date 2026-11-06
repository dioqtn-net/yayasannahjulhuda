export const renderNews = (newsList) => {
    // Setup listeners and global handlers after render
    setTimeout(() => {
        window.switchNewsJenjang = (jenjang) => {
            const tabs = document.querySelectorAll('.jenjang-tab-btn');
            const activeBadge = document.getElementById('active-jenjang-badge');
            const newsGrid = document.getElementById('newsGrid');
            const otherJenjangMsg = document.getElementById('otherJenjangMsg');
            const sectionTitle = document.getElementById('newsSectionTitle');
            const emptyStateTitle = document.getElementById('emptyStateTitle');
            const emptyStateDesc = document.getElementById('emptyStateDesc');
            const noResultsMsg = document.getElementById('noResultsMsg');

            if (noResultsMsg) noResultsMsg.classList.add('hidden');

            tabs.forEach(btn => {
                if (btn.getAttribute('data-jenjang') === jenjang) {
                    btn.className = 'jenjang-tab-btn px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md bg-emerald-800 text-white ring-2 ring-emerald-500/30';
                } else {
                    btn.className = 'jenjang-tab-btn px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700';
                }
            });

            if (activeBadge) activeBadge.textContent = jenjang;

            // Hide all jenjang grids first
            const allGrids = document.querySelectorAll('.news-jenjang-grid');
            allGrids.forEach(g => g.classList.add('hidden'));

            if (jenjang === 'MTs' || jenjang === 'Semua') {
                if (newsGrid) newsGrid.classList.remove('hidden');
                if (otherJenjangMsg) otherJenjangMsg.classList.add('hidden');
                if (sectionTitle) {
                    sectionTitle.innerHTML = `<span class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm"><i class="fas fa-newspaper"></i></span> Berita Sorotan ${jenjang === 'Semua' ? 'Yayasan' : 'MTs'}`;
                }
            } else {
                const targetGridId = 'newsGrid-' + jenjang.toLowerCase();
                const targetGrid = document.getElementById(targetGridId);
                const hasCards = targetGrid && targetGrid.querySelectorAll('.news-card').length > 0;

                if (hasCards) {
                    targetGrid.classList.remove('hidden');
                    if (otherJenjangMsg) otherJenjangMsg.classList.add('hidden');
                } else {
                    if (otherJenjangMsg) {
                        otherJenjangMsg.classList.remove('hidden');
                        if (emptyStateTitle) emptyStateTitle.textContent = `Belum Ada Berita Terbaru (${jenjang})`;
                        if (emptyStateDesc) emptyStateDesc.textContent = `Warta kegiatan untuk jenjang ${jenjang} sedang dalam proses kurasi. Silakan beralih ke tab MTs untuk melihat kabar kegiatan terbaru.`;
                    }
                }
                if (sectionTitle) {
                    sectionTitle.innerHTML = `<span class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm"><i class="fas fa-newspaper"></i></span> Berita Sorotan ${jenjang}`;
                }
            }
        };

        window.openNewsModal = (title, desc, imgSrc, date, badge) => {
            const modal = document.getElementById('newsDetailModal');
            if (!modal) return;
            document.getElementById('modalNewsTitle').textContent = title;
            document.getElementById('modalNewsBody').textContent = desc;
            const modalImg = document.getElementById('modalNewsImg');
            if (modalImg) {
                if (imgSrc) {
                    modalImg.src = imgSrc;
                    modalImg.classList.remove('hidden');
                } else {
                    modalImg.src = '';
                    modalImg.classList.add('hidden');
                }
            }
            document.getElementById('modalNewsDate').textContent = date;
            document.getElementById('modalNewsBadge').textContent = badge;
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        };

        window.closeNewsModal = () => {
            const modal = document.getElementById('newsDetailModal');
            if (!modal) return;
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        };

        // Live search filter
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
      <section class="relative bg-[url('/media/background/wallpaper_yayasan.jpg')] bg-cover bg-center bg-no-repeat text-white py-20 overflow-hidden">
        <div class="absolute inset-0 bg-black/75 z-0"></div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-900/80 border border-emerald-500/40 rounded-full text-xs font-semibold text-emerald-300 mb-3">
            <i class="fas fa-newspaper text-emerald-400"></i>
            <span>Kabar Terkini & Informasi</span>
          </div>
          <h1 class="text-2xl sm:text-3xl md:text-5xl font-playfair font-bold mb-4 text-gold-400 drop-shadow-md">Berita & Pengumuman</h1>
          <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-4"></div>
          <p class="text-slate-100 text-base sm:text-lg max-w-2xl mx-auto drop-shadow leading-relaxed">
            Informasi teranyar seputar kegiatan kesiswaan, prestasi, pembiasaan ibadah, dan pengumuman resmi Yayasan Nahjul Huda.
          </p>
        </div>
      </section>

      <!-- Main Content Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <!-- 1. Filter Jenjang Pendidikan (Tabs) -->
        <div class="mb-10 text-center">
          <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Pilih Jenjang Pendidikan</div>
          <div class="flex flex-wrap justify-center gap-2 sm:gap-3" id="jenjangTabs">
            <button onclick="switchNewsJenjang('Semua')" data-jenjang="Semua" class="jenjang-tab-btn px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700">
              Semua
            </button>
            <button onclick="switchNewsJenjang('SDI')" data-jenjang="SDI" class="jenjang-tab-btn px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700">
              SDI
            </button>
            <button onclick="switchNewsJenjang('MI')" data-jenjang="MI" class="jenjang-tab-btn px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700">
              MI
            </button>
            <!-- MTs Set as Active by Default -->
            <button onclick="switchNewsJenjang('MTs')" data-jenjang="MTs" class="jenjang-tab-btn px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md bg-emerald-800 text-white ring-2 ring-emerald-500/30">
              MTs
            </button>
            <button onclick="switchNewsJenjang('MA')" data-jenjang="MA" class="jenjang-tab-btn px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700">
              MA
            </button>
            <button onclick="switchNewsJenjang('Ponpes')" data-jenjang="Ponpes" class="jenjang-tab-btn px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700">
              Ponpes
            </button>
          </div>

          <!-- Active Filter Indicator -->
          <div class="mt-4 text-xs text-slate-500">
            Menampilkan berita: <span id="active-jenjang-badge" class="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">MTs</span>
          </div>
        </div>

        <!-- Section Title & Search Bar -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 id="newsSectionTitle" class="text-2xl font-bold font-playfair text-slate-800 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">
                <i class="fas fa-newspaper"></i>
              </span>
              Berita Sorotan MTs
            </h2>
            <p class="text-slate-500 text-xs sm:text-sm mt-1">Kabar prestasi, agenda pelatihan, dan kegiatan edukatif terkini.</p>
          </div>
          <div class="relative w-full md:w-72">
            <input type="text" id="searchNewsInput" placeholder="Cari judul berita..." class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm transition">
            <i class="fas fa-search absolute left-3 top-3 text-slate-400 text-xs"></i>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- 1. GRID BERITA SDI -->
        <!-- ========================================== -->
        <!-- [CMS_BERITA_START] Loop data berita dari database akan dirender di dalam grid ini -->
        <div id="newsGrid-sdi" class="news-jenjang-grid hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Data berita SDI akan dirender dinamis dari database di sini -->
        </div>
        <!-- [CMS_BERITA_END] -->

        <!-- ========================================== -->
        <!-- 2. GRID BERITA MI -->
        <!-- ========================================== -->
        <!-- [CMS_BERITA_START] Loop data berita dari database akan dirender di dalam grid ini -->
        <div id="newsGrid-mi" class="news-jenjang-grid hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Data berita MI akan dirender dinamis dari database di sini -->
        </div>
        <!-- [CMS_BERITA_END] -->

        <!-- ========================================== -->
        <!-- 3. GRID BERITA MTS -->
        <!-- ========================================== -->
        <!-- [CMS_BERITA_START] Loop data berita dari database akan dirender di dalam grid ini -->
        <div id="newsGrid" class="news-jenjang-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <!-- Card Berita 1: Visitasi Akreditasi MTs Nahjul Huda 2026/2027 (SLIDER) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <!-- Image Slider (Carousel) dengan Custom Scrollbar -->
            <div class="relative w-full h-[220px] mb-4 bg-gray-100 rounded-t-2xl border-b border-gray-200">
              <div class="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory h-full w-full custom-scrollbar pb-2">
                <img src="/media/berita/mts/Akreditasi%20MTs%202026-2027.jpg" alt="Akreditasi MTs 1" class="h-full w-full object-cover shrink-0 snap-center">
                <img src="/media/berita/mts/Akreditasi%20MTs%202026-2027_2.jpg" alt="Akreditasi MTs 2" class="h-full w-full object-cover shrink-0 snap-center">
              </div>
              <div class="absolute bottom-6 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded shadow pointer-events-none">
                <i class="fas fa-arrows-alt-h"></i> Geser Scroll
              </div>
            </div>

            <div class="px-5 pb-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="font-semibold text-teal-800 bg-teal-100/90 px-2.5 py-0.5 rounded-full border border-teal-200 text-[11px]">
                    Akreditasi
                  </span>
                  <div class="flex items-center gap-1.5 text-slate-400">
                    <span class="font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 text-[10px]">
                      BAN-PDM
                    </span>
                  </div>
                </div>
                <h3 class="news-title font-playfair font-bold text-base text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2 line-clamp-2">
                  Visitasi Akreditasi MTs Nahjul Huda 2026/2027
                </h3>
                <p class="news-desc text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3 text-justify">
                  MTs Nahjul Huda menerima kunjungan visitasi akreditasi dari Tim Asesor BAN-PDM Provinsi DKI Jakarta sebagai wujud komitmen peningkatan mutu dan kualitas pendidikan madrasah.
                </p>
              </div>
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-400 flex items-center truncate max-w-[110px]">
                  <i class="far fa-user mr-1 text-emerald-600"></i> Humas MTs
                </span>
                <button onclick="openNewsModal('Visitasi Akreditasi MTs Nahjul Huda 2026/2027', 'MTs Nahjul Huda menerima kunjungan visitasi akreditasi dari Tim Asesor BAN-PDM Provinsi DKI Jakarta sebagai wujud komitmen peningkatan mutu dan kualitas pendidikan madrasah. Seluruh dewan guru, staf, serta santri menyambut baik proses asesmen komprehensif ini untuk terus menghadirkan ekosistem belajar yang unggul dan berdaya saing.', '/media/berita/mts/Akreditasi%20MTs%202026-2027.jpg', 'MTs Nahjul Huda', 'Akreditasi')" class="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-emerald-50 transition shrink-0">
                  Baca Selengkapnya &rarr;
                </button>
              </div>
            </div>
          </article>

          <!-- Card Berita 2: Edukasi Polsek Kebon Jeruk (SINGLE) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative w-full h-[220px] mb-4 bg-gray-100 rounded-t-2xl border-b border-gray-200 overflow-hidden">
              <img src="/media/galeri/mts/sosialisasi_pencegahan_kenakalan_remaja_oleh_polsek_kebun_jeruk.jpg" alt="Edukasi Polsek Kebon Jeruk" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            </div>

            <div class="px-5 pb-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="font-semibold text-blue-800 bg-blue-100/90 px-2.5 py-0.5 rounded-full border border-blue-200 text-[11px]">
                    Penyuluhan
                  </span>
                  <div class="flex items-center gap-1.5 text-slate-400">
                    <span class="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 text-[10px]">
                      Polsek
                    </span>
                  </div>
                </div>
                <h3 class="news-title font-playfair font-bold text-base text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2 line-clamp-2">
                  Edukasi Polsek Kebon Jeruk
                </h3>
                <p class="news-desc text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3 text-justify">
                  Sosialisasi pencegahan kenakalan remaja, tata tertib hukum, dan pembinaan karakter generasi muda oleh jajaran Polsek Kebon Jeruk.
                </p>
              </div>
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-400 flex items-center truncate max-w-[110px]">
                  <i class="far fa-user mr-1 text-emerald-600"></i> Polsek Kebon Jeruk
                </span>
                <button onclick="openNewsModal('Edukasi Polsek Kebon Jeruk', 'Kegiatan sosialisasi dan edukasi pencegahan kenakalan remaja yang disampaikan langsung oleh jajaran kepolisian Polsek Kebon Jeruk kepada para santri MTs Nahjul Huda. Materi mencakup pemahaman hukum, bahaya perundungan (bullying), serta pembinaan disiplin dan karakter positif generasi muda.', '/media/galeri/mts/sosialisasi_pencegahan_kenakalan_remaja_oleh_polsek_kebun_jeruk.jpg', 'Polsek Kebon Jeruk', 'Penyuluhan')" class="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-emerald-50 transition shrink-0">
                  Baca Selengkapnya &rarr;
                </button>
              </div>
            </div>
          </article>

          <!-- Card Berita 3: Edukasi Kesehatan Puskesmas (SINGLE) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative w-full h-[220px] mb-4 bg-gray-100 rounded-t-2xl border-b border-gray-200 overflow-hidden">
              <img src="/media/galeri/mts/sosialisasi_kewanitaan_oleh_tenaga_kesehatan_puskesmas_kebun_jeruk.jpg" alt="Edukasi Kesehatan Puskesmas" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            </div>

            <div class="px-5 pb-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                    Kesehatan
                  </span>
                  <div class="flex items-center gap-1.5 text-slate-400">
                    <span class="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                      Puskesmas
                    </span>
                  </div>
                </div>
                <h3 class="news-title font-playfair font-bold text-base text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2 line-clamp-2">
                  Edukasi Kesehatan Puskesmas
                </h3>
                <p class="news-desc text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3 text-justify">
                  Sosialisasi edukasi kesehatan reproduksi dan pola hidup bersih sehat bagi santri putri oleh tenaga medis Puskesmas Kebon Jeruk.
                </p>
              </div>
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-400 flex items-center truncate max-w-[110px]">
                  <i class="far fa-user mr-1 text-emerald-600"></i> Puskesmas
                </span>
                <button onclick="openNewsModal('Edukasi Kesehatan Puskesmas', 'Penyuluhan kesehatan reproduksi remaja dan sosialisasi perilaku hidup bersih dan sehat (PHBS) bagi santri putri MTs Nahjul Huda. Menghadirkan dokter dan tenaga medis dari Puskesmas Kecamatan Kebon Jeruk guna memberikan pemahaman komprehensif mengenai kesehatan santri.', '/media/galeri/mts/sosialisasi_kewanitaan_oleh_tenaga_kesehatan_puskesmas_kebun_jeruk.jpg', 'Puskesmas Kebon Jeruk', 'Kesehatan')" class="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-emerald-50 transition shrink-0">
                  Baca Selengkapnya &rarr;
                </button>
              </div>
            </div>
          </article>

          <!-- Card Berita 4: Simulasi Pemadam Kebakaran (SLIDER) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <!-- Image Slider (Carousel) dengan Custom Scrollbar -->
            <div class="relative w-full h-[220px] mb-4 bg-gray-100 rounded-t-2xl border-b border-gray-200">
              <div class="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory h-full w-full custom-scrollbar pb-2">
                <img src="/media/galeri/mts/sosialisasi_penanganan_kebakaran_1.jpg" alt="Simulasi Damkar 1" class="h-full w-full object-cover shrink-0 snap-center">
                <img src="/media/galeri/mts/sosialisasi_penanganan_kebakaran_2.jpg" alt="Simulasi Damkar 2" class="h-full w-full object-cover shrink-0 snap-center">
                <img src="/media/galeri/mts/sosialisasi_penanganan_kebakaran_3.jpg" alt="Simulasi Damkar 3" class="h-full w-full object-cover shrink-0 snap-center">
              </div>
              <div class="absolute bottom-6 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded shadow pointer-events-none">
                <i class="fas fa-arrows-alt-h"></i> Geser Scroll
              </div>
            </div>

            <div class="px-5 pb-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="font-semibold text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-200 text-[11px]">
                    Tanggap Bencana
                  </span>
                  <div class="flex items-center gap-1.5 text-slate-400">
                    <span class="font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[10px]">
                      Damkar
                    </span>
                  </div>
                </div>
                <h3 class="news-title font-playfair font-bold text-base text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2 line-clamp-2">
                  Simulasi Pemadam Kebakaran
                </h3>
                <p class="news-desc text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3 text-justify">
                  Pelatihan kesiapsiagaan mitigasi bencana dan simulasi pemadaman kebakaran bersama petugas Damkar Sektor 5 Kebon Jeruk.
                </p>
              </div>
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-400 flex items-center truncate max-w-[110px]">
                  <i class="far fa-user mr-1 text-emerald-600"></i> Damkar Sektor 5
                </span>
                <button onclick="openNewsModal('Simulasi Pemadam Kebakaran', 'Pelatihan mitigasi tanggap darurat bencana kebakaran yang diselenggarakan bekerjasama dengan Suku Dinas Penanggulangan Kebakaran dan Penyelamatan (Damkar) Sektor 5 Kebon Jeruk. Seluruh santri dan dewan guru mempraktikkan langsung teknik pemadaman api menggunakan APAR dan karung basah secara sigap.', '/media/galeri/mts/sosialisasi_penanganan_kebakaran_1.jpg', 'Damkar Sektor 5', 'Tanggap Bencana')" class="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-emerald-50 transition shrink-0">
                  Baca Selengkapnya &rarr;
                </button>
              </div>
            </div>
          </article>

          <!-- Card Berita 5: Kunjungan Perpusnas (SINGLE) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative w-full h-[220px] mb-4 bg-gray-100 rounded-t-2xl border-b border-gray-200 overflow-hidden">
              <img src="/media/galeri/mts/kunjungan_kelas_9_ke_perpus_nasional_jakarta.jpg" alt="Kunjungan Perpusnas" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            </div>

            <div class="px-5 pb-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="font-semibold text-purple-800 bg-purple-100/90 px-2.5 py-0.5 rounded-full border border-purple-200 text-[11px]">
                    Literasi
                  </span>
                  <div class="flex items-center gap-1.5 text-slate-400">
                    <span class="font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 text-[10px]">
                      Edukasi
                    </span>
                  </div>
                </div>
                <h3 class="news-title font-playfair font-bold text-base text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2 line-clamp-2">
                  Kunjungan Perpusnas
                </h3>
                <p class="news-desc text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3 text-justify">
                  Kunjungan edukatif dan riset literasi santri kelas 9 MTs Nahjul Huda ke Perpustakaan Nasional Republik Indonesia.
                </p>
              </div>
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-400 flex items-center truncate max-w-[110px]">
                  <i class="far fa-user mr-1 text-emerald-600"></i> Humas MTs
                </span>
                <button onclick="openNewsModal('Kunjungan Perpusnas', 'Santri kelas 9 MTs Nahjul Huda mengadakan kunjungan edukatif ke Perpustakaan Nasional Republik Indonesia (Perpusnas) di Jalan Medan Merdeka Selatan. Kegiatan ini bertujuan memperluas wawasan literasi, mengenalkan fasilitas riset modern, serta meningkatkan minat baca para santri.', '/media/galeri/mts/kunjungan_kelas_9_ke_perpus_nasional_jakarta.jpg', 'Perpustakaan Nasional', 'Literasi')" class="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-emerald-50 transition shrink-0">
                  Baca Selengkapnya &rarr;
                </button>
              </div>
            </div>
          </article>

          <!-- Card Berita 6: Olimpiade Madrasah Indonesia (SINGLE) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative w-full h-[220px] mb-4 bg-gray-100 rounded-t-2xl border-b border-gray-200 overflow-hidden">
              <img src="/media/galeri/mts/olimpiade_madrasah_indonesia_(OMI)_MTs_Nahjul_Huda.jpg" alt="Olimpiade Madrasah Indonesia" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            </div>

            <div class="px-5 pb-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                    Prestasi
                  </span>
                  <div class="flex items-center gap-1.5 text-slate-400">
                    <span class="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                      Juara OMI
                    </span>
                  </div>
                </div>
                <h3 class="news-title font-playfair font-bold text-base text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2 line-clamp-2">
                  Olimpiade Madrasah Indonesia
                </h3>
                <p class="news-desc text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3 text-justify">
                  Siswa-siswi MTs Nahjul Huda berhasil menorehkan prestasi membanggakan dengan meraih juara pada ajang Olimpiade Madrasah Indonesia tingkat Kota Jakarta Barat.
                </p>
              </div>
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-400 flex items-center truncate max-w-[110px]">
                  <i class="far fa-user mr-1 text-emerald-600"></i> Tim Prestasi
                </span>
                <button onclick="openNewsModal('Olimpiade Madrasah Indonesia', 'Siswa-siswi MTs Nahjul Huda berhasil menorehkan prestasi membanggakan dengan meraih juara pada ajang Olimpiade Madrasah Indonesia tingkat Kota Jakarta Barat. Keberhasilan ini menjadi bukti dedikasi para santri dan bimbingan intensif dewan guru dalam mengasah kemampuan akademik di kancah kompetisi bergengsi.', '/media/galeri/mts/olimpiade_madrasah_indonesia_(OMI)_MTs_Nahjul_Huda.jpg', 'Jakarta Barat', 'Prestasi')" class="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-emerald-50 transition shrink-0">
                  Baca Selengkapnya &rarr;
                </button>
              </div>
            </div>
          </article>

          <!-- Card Berita 7: Testimoni Yayasan & Ponpes As-Surur (VIDEO) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative w-full h-[220px] mb-4 bg-slate-900 rounded-t-2xl border-b border-gray-200 overflow-hidden">
              <video controls class="w-full h-full object-cover">
                <source src="/media/galeri/mts/testimoni_yayasan_nahjul_huda_ponpes_as-surur_oleh_ustadz_maulana.mp4" type="video/mp4">
                Browser Anda tidak mendukung tag video.
              </video>
            </div>

            <div class="px-5 pb-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                    Testimoni
                  </span>
                  <div class="flex items-center gap-1.5 text-slate-400">
                    <span class="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                      Ustadz Maulana
                    </span>
                  </div>
                </div>
                <h3 class="news-title font-playfair font-bold text-base text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2 line-clamp-2">
                  Testimoni Yayasan & Ponpes As-Surur
                </h3>
                <p class="news-desc text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3 text-justify">
                  Untaian pesan inspiratif dan apresiasi dari Ustadz Maulana atas kiprah serta dedikasi Yayasan Nahjul Huda dan Pondok Pesantren As-Surur dalam membina generasi Qur'ani.
                </p>
              </div>
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-400 flex items-center truncate max-w-[110px]">
                  <i class="far fa-user mr-1 text-emerald-600"></i> Humas Yayasan
                </span>
                <button onclick="openNewsModal('Testimoni Yayasan & Ponpes As-Surur', 'Untaian pesan inspiratif dan apresiasi hangat dari Ustadz Maulana atas kiprah dan dedikasi Yayasan Nahjul Huda serta Pondok Pesantren As-Surur dalam mendidik santri berakhlak mulia dan berwawasan luas. Beliau menyampaikan dorongan semangat bagi seluruh santri, dewan guru, dan pengurus agar senantiasa istiqomah menebarkan syiar Islam.', '', 'Ustadz Maulana', 'Testimoni')" class="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-emerald-50 transition shrink-0">
                  Baca Selengkapnya &rarr;
                </button>
              </div>
            </div>
          </article>

        </div>
        <!-- [CMS_BERITA_END] -->

        <!-- ========================================== -->
        <!-- 4. GRID BERITA MA -->
        <!-- ========================================== -->
        <!-- [CMS_BERITA_START] Loop data berita dari database akan dirender di dalam grid ini -->
        <div id="newsGrid-ma" class="news-jenjang-grid hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Data berita MA akan dirender dinamis dari database di sini -->
        </div>
        <!-- [CMS_BERITA_END] -->

        <!-- ========================================== -->
        <!-- 5. GRID BERITA PONPES -->
        <!-- ========================================== -->
        <!-- [CMS_BERITA_PONPES_START] -->
        <div id="newsGrid-ponpes" class="news-jenjang-grid hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <!-- Card Berita 1: Upacara Hari Santri Nasional (SLIDER) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <!-- Image Slider (Carousel) dengan Custom Scrollbar -->
            <div class="relative w-full h-[220px] mb-4 bg-gray-100 rounded-t-2xl border-b border-gray-200">
              <div class="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory h-full w-full custom-scrollbar pb-2">
                <img src="/media/galeri/ponpes/Kegiatan_upacara_hari_santri_nasional_22_oktober_2026_di_kemenag.jpg" alt="Hari Santri 1" class="h-full w-full object-cover shrink-0 snap-center">
                <img src="/media/galeri/ponpes/Kegiatan_upacara_hari_santri_nasional_22_oktober_2026_di_kemenag_2.jpg" alt="Hari Santri 2" class="h-full w-full object-cover shrink-0 snap-center">
                <img src="/media/galeri/ponpes/Kegiatan_upacara_hari_santri_nasional_22_oktober_2026_di_kemenag_3.jpg" alt="Hari Santri 3" class="h-full w-full object-cover shrink-0 snap-center">
                <img src="/media/galeri/ponpes/Kegiatan_upacara_hari_santri_nasional_22_oktober_2026_di_kemenag_4.jpg" alt="Hari Santri 4" class="h-full w-full object-cover shrink-0 snap-center">
              </div>
              <!-- Indikator Slider & Label -->
              <div class="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/40 shadow">
                4 Foto
              </div>
              <div class="absolute bottom-6 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded shadow pointer-events-none">
                <i class="fas fa-arrows-alt-h"></i> Geser Scroll
              </div>
            </div>

            <div class="px-5 pb-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                    Hari Santri
                  </span>
                  <div class="flex items-center gap-1.5 text-slate-400">
                    <span class="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                      22 Okt 2026
                    </span>
                  </div>
                </div>
                <h3 class="news-title font-playfair font-bold text-base text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2 line-clamp-2">
                  Upacara Hari Santri Nasional
                </h3>
                <p class="news-desc text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3 text-justify">
                  Dokumentasi kegiatan Upacara Peringatan Hari Santri Nasional 2026 di Kemenag, diikuti oleh santri dan asatidz Pondok Pesantren Assurur dengan khidmat.
                </p>
              </div>
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-400 flex items-center truncate max-w-[110px]">
                  <i class="far fa-user mr-1 text-emerald-600"></i> Humas Ponpes
                </span>
                <button onclick="openNewsModal('Upacara Hari Santri Nasional', 'Dokumentasi kegiatan Upacara Peringatan Hari Santri Nasional tanggal 22 Oktober 2026 yang diselenggarakan di Kemenag, diikuti oleh santri dan asatidz Pondok Pesantren Assurur. Seluruh santri dan asatidz mengikuti rangkaian upacara dengan khidmat sebagai wujud penghormatan atas peran besar santri dalam perjuangan dan pembangunan bangsa.', '/media/galeri/ponpes/Kegiatan_upacara_hari_santri_nasional_22_oktober_2026_di_kemenag.jpg', '22 Oktober 2026', 'Hari Santri')" class="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-emerald-50 transition shrink-0">
                  Baca Selengkapnya &rarr;
                </button>
              </div>
            </div>
          </article>

          <!-- Card Berita 2: Testimoni Yayasan & Ponpes As-Surur (VIDEO) -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="relative w-full h-[220px] mb-4 bg-slate-900 rounded-t-2xl border-b border-gray-200 overflow-hidden">
              <video controls class="w-full h-full object-cover">
                <source src="/media/galeri/mts/testimoni_yayasan_nahjul_huda_ponpes_as-surur_oleh_ustadz_maulana.mp4" type="video/mp4">
                Browser Anda tidak mendukung tag video.
              </video>
            </div>

            <div class="px-5 pb-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                    Testimoni
                  </span>
                  <div class="flex items-center gap-1.5 text-slate-400">
                    <span class="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                      Ustadz Maulana
                    </span>
                  </div>
                </div>
                <h3 class="news-title font-playfair font-bold text-base text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2 line-clamp-2">
                  Testimoni Yayasan & Ponpes As-Surur
                </h3>
                <p class="news-desc text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3 text-justify">
                  Untaian pesan inspiratif dan apresiasi dari Ustadz Maulana atas kiprah serta dedikasi Yayasan Nahjul Huda dan Pondok Pesantren As-Surur dalam membina generasi Qur'ani.
                </p>
              </div>
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-400 flex items-center truncate max-w-[110px]">
                  <i class="far fa-user mr-1 text-emerald-600"></i> Humas Ponpes
                </span>
                <button onclick="openNewsModal('Testimoni Yayasan & Ponpes As-Surur', 'Untaian pesan inspiratif dan apresiasi hangat dari Ustadz Maulana atas kiprah dan dedikasi Yayasan Nahjul Huda serta Pondok Pesantren As-Surur dalam mendidik santri berakhlak mulia dan berwawasan luas. Beliau menyampaikan dorongan semangat bagi seluruh santri, dewan guru, dan pengurus agar senantiasa istiqomah menebarkan syiar Islam.', '', 'Ustadz Maulana', 'Testimoni')" class="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-emerald-50 transition shrink-0">
                  Baca Selengkapnya &rarr;
                </button>
              </div>
            </div>
          </article>

        </div>
        <!-- [CMS_BERITA_PONPES_END] -->

        <!-- Empty State (untuk jenjang selain MTs/Semua) -->
        <div id="otherJenjangMsg" class="hidden text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 max-w-xl mx-auto shadow-sm">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
            <i class="fas fa-info-circle"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-800 mb-1" id="emptyStateTitle">Belum Ada Berita Terbaru</h3>
          <p class="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed" id="emptyStateDesc">
            Warta kegiatan untuk jenjang ini sedang dalam proses kurasi. Silakan beralih ke tab MTs untuk melihat kabar kegiatan terbaru.
          </p>
          <button onclick="switchNewsJenjang('MTs')" class="px-5 py-2.5 rounded-full bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition shadow">
            Lihat Berita MTs
          </button>
        </div>

        <!-- Empty search result indicator -->
        <div id="noResultsMsg" class="hidden text-center py-12 px-4 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto shadow-sm mt-6">
          <i class="fas fa-search text-3xl text-slate-300 mb-3"></i>
          <h4 class="text-base font-bold text-slate-700">Berita tidak ditemukan</h4>
          <p class="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
        </div>

      </div>

      <!-- Modal Detail Berita -->
      <div id="newsDetailModal" class="fixed inset-0 z-50 hidden bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col relative">
          <!-- Header Bar Modal -->
          <div class="flex items-center justify-between p-6 pb-0">
            <span id="modalNewsBadge" class="bg-emerald-800 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              Kategori
            </span>
            <button onclick="closeNewsModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="p-6 sm:p-8 pt-4">
            <div class="flex items-center gap-2 text-xs text-slate-400 mb-3">
              <i class="far fa-calendar-alt text-emerald-600"></i>
              <span id="modalNewsDate">Tanggal Berita</span>
            </div>
            <h2 id="modalNewsTitle" class="text-2xl font-playfair font-bold text-slate-800 mb-3 leading-snug">
              Judul Berita
            </h2>
            <div class="w-16 h-1 bg-emerald-600 rounded-full mb-4"></div>
            <!-- Slider Foto di Modal Berita (Template Standar) -->
            <div class="relative w-full h-[300px] md:h-[400px] mb-6 bg-gray-100 rounded-xl border border-gray-200">
              <div class="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory h-full w-full custom-scrollbar pb-2">
                <!-- Foto 1 -->
                <img src="/media/berita/mts/Akreditasi%20MTs%202026-2027.jpg" alt="Akreditasi MTs 1" class="h-full w-full object-cover shrink-0 snap-center">
                <!-- Foto 2 -->
                <img src="/media/berita/mts/Akreditasi%20MTs%202026-2027_2.jpg" alt="Akreditasi MTs 2" class="h-full w-full object-cover shrink-0 snap-center">
              </div>
              <div class="absolute bottom-6 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded shadow pointer-events-none">
                <i class="fas fa-arrows-alt-h"></i> Geser Scroll
              </div>
            </div>
            <p id="modalNewsBody" class="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6 text-justify">
              Isi berita lengkap...
            </p>
            <div class="pt-4 border-t border-slate-100 flex justify-end">
              <button onclick="closeNewsModal()" class="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
};
