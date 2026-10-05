export const renderFacilities = (facilities) => {
    return `
      <!-- Header Fasilitas -->
      <div class="bg-emerald-800 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-4xl md:text-5xl font-playfair font-bold mb-4 text-gold-400">Fasilitas Yayasan</h1>
          <p class="text-emerald-100 text-lg max-w-2xl mx-auto">Sarana dan prasarana yang memadai untuk mendukung proses belajar mengajar dan pengembangan potensi santri/siswa.</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        ${facilities && facilities.length > 0 ? `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                ${facilities.map(f => `
                    <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition group">
                        <div class="h-48 bg-slate-200 relative overflow-hidden">
                            ${f.image_url ? 
                                `<img src="${f.image_url}" alt="${f.name}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">` : 
                                `<div class="absolute inset-0 bg-emerald-100 flex items-center justify-center"><i class="fas fa-building text-4xl text-emerald-300"></i></div>`
                            }
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-playfair font-bold text-emerald-800 mb-2">${f.name}</h3>
                            <p class="text-slate-600 text-sm">${f.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : `
            <div class="p-12 text-center bg-slate-50 rounded-2xl border border-slate-100">
                <i class="fas fa-tools text-4xl text-slate-300 mb-4"></i>
                <p class="text-slate-500">Belum ada data fasilitas.</p>
            </div>
        `}
      </div>
    `;
};
