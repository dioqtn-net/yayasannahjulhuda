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

            if (jenjang === 'MTs' || jenjang === 'Semua') {
                if (newsGrid) newsGrid.classList.remove('hidden');
                if (otherJenjangMsg) otherJenjangMsg.classList.add('hidden');
                if (sectionTitle) {
                    sectionTitle.innerHTML = `<span class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm"><i class="fas fa-newspaper"></i></span> Berita Sorotan ${jenjang === 'Semua' ? 'Yayasan' : 'MTs'}`;
                }
            } else {
                if (newsGrid) newsGrid.classList.add('hidden');
                if (otherJenjangMsg) {
                    otherJenjangMsg.classList.remove('hidden');
                    if (emptyStateTitle) emptyStateTitle.textContent = `Belum Ada Berita Terbaru (${jenjang})`;
                    if (emptyStateDesc) emptyStateDesc.textContent = `Warta kegiatan untuk jenjang ${jenjang} sedang dalam proses kurasi. Silakan beralih ke tab MTs untuk melihat kabar kegiatan terbaru.`;
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
          <h1 class="text-4xl md:text-5xl font-playfair font-bold mb-4 text-gold-400 drop-shadow-md">Berita & Pengumuman</h1>
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

        <!-- Card Berita Sorotan MTs -->
        <div id="newsGrid" class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <!-- Card Baru: Visitasi Akreditasi MTs Nahjul Huda 2026/2027 -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <!-- Image Slider (Carousel) Sederhana dengan CSS -->
            <div class="relative w-full h-48 mb-4 overflow-hidden rounded-t-2xl group">
              <div class="flex overflow-x-auto snap-x snap-mandatory h-full w-full scroll-smooth" style="scrollbar-width: none;">
                <!-- Foto 1 -->
                <img src="/media/berita/mts/Akreditasi%20MTs%202026-2027.jpg" alt="Akreditasi MTs 1" class="w-full h-full object-cover shrink-0 snap-center">
                <!-- Foto 2 -->
                <img src="/media/berita/mts/Akreditasi%20MTs%202026-2027_2.jpg" alt="Akreditasi MTs 2" class="w-full h-full object-cover shrink-0 snap-center">
              </div>
              <!-- Indikator visual agar pengunjung tahu gambar bisa digeser -->
              <div class="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-sm pointer-events-none">
                <i class="fas fa-chevron-left text-[10px]"></i> Geser <i class="fas fa-chevron-right text-[10px]"></i>
              </div>
            </div>

            <div class="px-6 pb-6 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="font-semibold text-teal-800 bg-teal-100/90 px-2.5 py-0.5 rounded-full border border-teal-200 text-[11px]">
                    Akreditasi
                  </span>
                  <div class="flex items-center gap-2 text-slate-400">
                    <span class="font-medium text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      BAN-PDM
                    </span>
                    <span><i class="far fa-calendar-alt mr-1"></i> MTs Nahjul Huda</span>
                  </div>
                </div>
                <h3 class="news-title font-playfair font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2.5">
                  Visitasi Akreditasi MTs Nahjul Huda 2026/2027
                </h3>
                <p class="news-desc text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  MTs Nahjul Huda menerima kunjungan visitasi akreditasi dari Tim Asesor BAN-PDM Provinsi DKI Jakarta sebagai wujud komitmen peningkatan mutu dan kualitas pendidikan madrasah.
                </p>
              </div>
              <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-400 flex items-center">
                  <i class="far fa-user mr-1 text-emerald-600"></i> Humas MTs
                </span>
                <button onclick="openNewsModal('Visitasi Akreditasi MTs Nahjul Huda 2026/2027', 'MTs Nahjul Huda menerima kunjungan visitasi akreditasi dari Tim Asesor BAN-PDM Provinsi DKI Jakarta sebagai wujud komitmen peningkatan mutu dan kualitas pendidikan madrasah. Seluruh dewan guru, staf, serta santri menyambut baik proses asesmen komprehensif ini untuk terus menghadirkan ekosistem belajar yang unggul dan berdaya saing.', '/media/berita/mts/Akreditasi%20MTs%202026-2027.jpg', 'MTs Nahjul Huda', 'Akreditasi')" class="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-emerald-50 transition">
                  Baca Selengkapnya &rarr;
                </button>
              </div>
            </div>
          </article>

          <!-- Card 1: Prestasi Siswa MTs di Ajang OMI -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                    Prestasi
                  </span>
                  <div class="flex items-center gap-2 text-slate-400">
                    <span class="font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Akademik
                    </span>
                    <span><i class="far fa-calendar-alt mr-1"></i> MTs Nahjul Huda</span>
                  </div>
                </div>
                <h3 class="news-title font-playfair font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2.5">
                  Prestasi Siswa MTs di Ajang OMI
                </h3>
                <p class="news-desc text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Siswa-siswi MTs Nahjul Huda berhasil menorehkan prestasi membanggakan pada ajang Olimpiade Madrasah Indonesia (OMI) dalam mengasah dan membuktikan kemampuan akademik santri.
                </p>
              </div>
              <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-400 flex items-center">
                  <i class="far fa-user mr-1 text-emerald-600"></i> Humas MTs
                </span>
                <button onclick="openNewsModal('Prestasi Siswa MTs di Ajang OMI', 'Siswa-siswi MTs Nahjul Huda berhasil menorehkan capaian gemilang dalam ajang bergengsi Olimpiade Madrasah Indonesia (OMI). Keikutsertaan ini membuktikan kualitas pembinaan akademik madrasah yang konsisten melahirkan santri berprestasi dan berdaya saing tinggi.', '', 'MTs Nahjul Huda', 'Prestasi')" class="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-emerald-50 transition">
                  Baca Selengkapnya <i class="fas fa-arrow-right text-[11px]"></i>
                </button>
              </div>
            </div>
          </article>

          <!-- Card 2: Pelatihan Kesiapsiagaan Bencana bersama Damkar -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                    Pelatihan
                  </span>
                  <div class="flex items-center gap-2 text-slate-400">
                    <span class="font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Tanggap Bencana
                    </span>
                    <span><i class="far fa-calendar-alt mr-1"></i> Damkar Sektor 5</span>
                  </div>
                </div>
                <h3 class="news-title font-playfair font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2.5">
                  Pelatihan Kesiapsiagaan Bencana bersama Damkar
                </h3>
                <p class="news-desc text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Edukasi mitigasi kebakaran serta simulasi pemadaman api secara langsung bersama petugas Damkar untuk melatih kesiapsiagaan dan ketanggapan seluruh warga sekolah.
                </p>
              </div>
              <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-400 flex items-center">
                  <i class="far fa-user mr-1 text-emerald-600"></i> Kesiswaan MTs
                </span>
                <button onclick="openNewsModal('Pelatihan Kesiapsiagaan Bencana bersama Damkar', 'Pelatihan mitigasi risiko kebakaran diselenggarakan bersama jajaran Petugas Damkar. Santri MTs dan dewan guru dibekali teori serta praktik pemadaman api menggunakan APAR, cara evakuasi darurat, dan langkah tanggap bencana.', '', 'Damkar Sektor 5', 'Pelatihan')" class="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-emerald-50 transition">
                  Baca Selengkapnya <i class="fas fa-arrow-right text-[11px]"></i>
                </button>
              </div>
            </div>
          </article>

          <!-- Card 3: Edukasi Keamanan oleh Polsek Kebon Jeruk -->
          <article class="news-card bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 text-xs">
                  <span class="font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                    Penyuluhan
                  </span>
                  <div class="flex items-center gap-2 text-slate-400">
                    <span class="font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Kamtibmas
                    </span>
                    <span><i class="far fa-calendar-alt mr-1"></i> Polsek Kebon Jeruk</span>
                  </div>
                </div>
                <h3 class="news-title font-playfair font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2.5">
                  Edukasi Keamanan oleh Polsek Kebon Jeruk
                </h3>
                <p class="news-desc text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Sosialisasi pencegahan kenakalan remaja, bahaya obat terlarang, serta penanaman kesadaran tertib hukum dan etika bermasyarakat bersama aparat kepolisian.
                </p>
              </div>
              <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-400 flex items-center">
                  <i class="far fa-user mr-1 text-emerald-600"></i> Polsek & MTs
                </span>
                <button onclick="openNewsModal('Edukasi Keamanan oleh Polsek Kebon Jeruk', 'Kegiatan sosialisasi oleh Kepolisian Sektor Kebon Jeruk mengedukasi para pelajar tentang bahaya kenakalan remaja, pencegahan perundungan (bullying), serta pentingnya menjaga keamanan dan ketertiban di lingkungan sekolah.', '', 'Polsek Kebon Jeruk', 'Penyuluhan')" class="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-emerald-50 transition">
                  Baca Selengkapnya <i class="fas fa-arrow-right text-[11px]"></i>
                </button>
              </div>
            </div>
          </article>

        </div>

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
            <!-- Foto Berita di Modal jika ada -->
            <img id="modalNewsImg" src="" alt="Foto Berita" class="w-full h-56 sm:h-72 object-cover rounded-xl mb-4 hidden shadow-sm border border-slate-100">
            <p id="modalNewsBody" class="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6">
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
