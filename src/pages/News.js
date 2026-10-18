export const renderNews = (newsList) => {
    
    // Add global functions for reading full news
    if (!window.readNews) {
        window.readNews = (id) => {
            const modal = document.getElementById(`news-modal-${id}`);
            if(modal) {
                modal.classList.remove('hidden');
                document.body.classList.add('modal-open');
            }
        };
        window.closeNews = (id) => {
            const modal = document.getElementById(`news-modal-${id}`);
            if(modal) {
                modal.classList.add('hidden');
                document.body.classList.remove('modal-open');
            }
        };
    }

    const renderNewsCard = (news) => {
        const date = new Date(news.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        
        return `
        <article class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition flex flex-col cursor-pointer group" onclick="readNews(${news.id})">
            <div class="h-48 bg-emerald-100 relative overflow-hidden">
                ${news.image_url ? 
                    `<img src="${news.image_url}" alt="${news.title}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">` : 
                    `<div class="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center opacity-80 group-hover:scale-110 transition duration-500"><i class="fas fa-newspaper text-5xl text-white opacity-50"></i></div>`
                }
                <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-800 shadow">
                    ${date}
                </div>
            </div>
            <div class="p-6 flex-grow flex flex-col">
                <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-emerald-600 transition line-clamp-2">${news.title}</h3>
                <p class="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">${news.content}</p>
                <div class="text-emerald-600 font-semibold text-sm flex items-center mt-auto">
                    Baca Selengkapnya <i class="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition"></i>
                </div>
            </div>
        </article>

        <!-- Modal -->
        <div id="news-modal-${news.id}" class="hidden fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto pt-10 pb-10">
            <div class="fixed inset-0 bg-slate-900 bg-opacity-75 backdrop-blur-sm transition-opacity" onclick="closeNews(${news.id})"></div>
            <div class="bg-white rounded-2xl max-w-3xl w-full mx-4 relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <button onclick="closeNews(${news.id})" class="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 text-white rounded-full hover:bg-red-500 transition flex items-center justify-center">
                    <i class="fas fa-times"></i>
                </button>
                <div class="overflow-y-auto w-full relative">
                    <div class="h-64 sm:h-80 w-full bg-emerald-100 relative">
                        ${news.image_url ? 
                            `<img src="${news.image_url}" alt="${news.title}" class="w-full h-full object-cover">` : 
                            `<div class="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center"><i class="fas fa-newspaper text-6xl text-white opacity-50"></i></div>`
                        }
                    </div>
                    <div class="p-8 md:p-12">
                        <div class="text-emerald-600 font-medium mb-3 flex items-center">
                            <i class="far fa-calendar-alt mr-2"></i> ${date}
                        </div>
                        <h2 class="text-3xl font-playfair font-bold text-slate-900 mb-8">${news.title}</h2>
                        <div class="prose prose-emerald max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                            ${news.content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    };

    return `
      <!-- Header Berita -->
      <section class="bg-emerald-900 text-white py-20 relative overflow-hidden">
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-emerald-800 opacity-40 blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-950 opacity-50 blur-3xl pointer-events-none"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 class="text-4xl md:text-5xl font-playfair font-bold mb-4 text-gold-400">Berita & Pengumuman</h1>
          <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-4"></div>
          <p class="text-white text-lg max-w-2xl mx-auto">Kabar terbaru seputar kegiatan pendidikan, prestasi, dan pengumuman resmi Yayasan Nahjul Huda.</p>
        </div>
      </section>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <h2 class="text-2xl font-bold text-slate-800">Artikel Terbaru</h2>
            <div class="relative w-full md:w-64">
                <input type="text" placeholder="Cari berita..." class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50">
                <i class="fas fa-search absolute left-4 top-3 text-slate-400"></i>
            </div>
        </div>

        ${newsList && newsList.length > 0 ? `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${newsList.map(n => renderNewsCard(n)).join('')}
            </div>
        ` : `
            <div class="p-12 text-center bg-slate-50 rounded-2xl border border-slate-100">
                <i class="far fa-newspaper text-4xl text-slate-300 mb-4"></i>
                <p class="text-slate-500">Belum ada berita yang dipublikasikan.</p>
            </div>
        `}
      </div>
    `;
};
