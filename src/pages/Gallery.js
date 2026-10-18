export const renderGallery = (galleries) => {
    
    // Lightbox logic
    if (!window.openLightbox) {
        window.openLightbox = (url, title) => {
            const lb = document.getElementById('lightbox');
            const lbImg = document.getElementById('lightbox-img');
            const lbTitle = document.getElementById('lightbox-title');
            if(lb && lbImg && lbTitle) {
                lbImg.src = url;
                lbTitle.textContent = title || '';
                lb.classList.remove('hidden');
                document.body.classList.add('modal-open');
            }
        };
        window.closeLightbox = () => {
            const lb = document.getElementById('lightbox');
            if(lb) {
                lb.classList.add('hidden');
                document.body.classList.remove('modal-open');
                document.getElementById('lightbox-img').src = '';
            }
        };
    }

    return `
      <!-- Header Galeri -->
      <section class="bg-emerald-900 text-white py-20 relative overflow-hidden">
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-emerald-800 opacity-40 blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-950 opacity-50 blur-3xl pointer-events-none"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 class="text-4xl md:text-5xl font-playfair font-bold mb-4 text-gold-400">Galeri Dokumentasi</h1>
          <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-4"></div>
          <p class="text-white text-lg max-w-2xl mx-auto">Momen berharga dan potret kegiatan keseharian di lingkungan Yayasan Nahjul Huda.</p>
        </div>
      </section>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <!-- Filter buttons -->
        <div class="flex flex-wrap justify-center gap-3 mb-12">
            <button class="px-6 py-2 rounded-full bg-emerald-600 text-white font-medium shadow-md">Semua</button>
            <button class="px-6 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition">Kegiatan Belajar</button>
            <button class="px-6 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition">Ekstrakurikuler</button>
            <button class="px-6 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition">Fasilitas</button>
        </div>

        ${galleries && galleries.length > 0 ? `
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                ${galleries.map(g => `
                    <div class="relative group cursor-pointer rounded-xl overflow-hidden shadow-sm aspect-square bg-slate-100 border border-slate-100" onclick="openLightbox('${g.image_url}', '${g.title.replace(/'/g, "\\'")}')">
                        ${g.image_url ? `<img src="${g.image_url}" alt="${g.title}" class="w-full h-full object-cover transition duration-500 group-hover:scale-110">` : `<div class="w-full h-full flex items-center justify-center"><i class="fas fa-image text-3xl text-slate-300"></i></div>`}
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end">
                            <div class="p-4 w-full">
                                <h4 class="text-white font-bold truncate">${g.title}</h4>
                                <p class="text-emerald-300 text-xs mt-1"><i class="fas fa-search-plus mr-1"></i> Perbesar</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : `
            <div class="p-12 text-center bg-slate-50 rounded-2xl border border-slate-100">
                <i class="far fa-images text-4xl text-slate-300 mb-4"></i>
                <p class="text-slate-500">Belum ada foto galeri.</p>
            </div>
        `}
      </div>

      <!-- Lightbox Modal -->
      <div id="lightbox" class="hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md pt-5 pb-5">
        <button onclick="closeLightbox()" class="absolute top-4 right-4 z-10 text-white/70 hover:text-white p-2">
            <i class="fas fa-times text-3xl"></i>
        </button>
        <div class="max-w-5xl w-full mx-4 flex flex-col items-center">
            <img id="lightbox-img" src="" alt="" class="max-h-[80vh] object-contain rounded shadow-2xl">
            <h3 id="lightbox-title" class="text-white text-xl font-bold mt-4 text-center"></h3>
        </div>
      </div>
    `;
};
