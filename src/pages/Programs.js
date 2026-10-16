import { getUnitImage } from '../api';

export const renderPrograms = (units) => {
    
    const renderDetailedUnit = (unit, index) => {
        const isEven = index % 2 !== 0;
        const imageUrl = unit.image_url || getUnitImage(unit);
        return `
        <div class="flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''} gap-8 items-center bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-12 hover:shadow-md transition">
            <div class="w-full md:w-1/3">
                <div class="aspect-video md:aspect-square bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-4 sm:p-6 group">
                    <img src="${imageUrl}" alt="${unit.name}" class="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-300">
                </div>
            </div>
            <div class="w-full md:w-2/3">
                <h2 class="text-3xl font-playfair font-bold text-emerald-800 mb-4">${unit.name}</h2>
                <p class="text-slate-600 text-lg mb-6 leading-relaxed">${unit.description}</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div class="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 class="font-bold text-emerald-700 mb-2 flex items-center"><i class="fas fa-book-reader mr-2 text-gold-500"></i> Kurikulum</h4>
                        <p class="text-sm text-slate-600">${unit.curriculum || '-'}</p>
                    </div>
                    <div class="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 class="font-bold text-emerald-700 mb-2 flex items-center"><i class="fas fa-running mr-2 text-gold-500"></i> Ekstrakurikuler</h4>
                        <p class="text-sm text-slate-600">${unit.extracurricular || '-'}</p>
                    </div>
                    <div class="bg-slate-50 p-4 rounded-lg border border-slate-100 md:col-span-2">
                        <h4 class="font-bold text-emerald-700 mb-2 flex items-center"><i class="fas fa-building mr-2 text-gold-500"></i> Fasilitas</h4>
                        <p class="text-sm text-slate-600">${unit.facilities || '-'}</p>
                    </div>
                </div>
                
                <a href="https://wa.me/${(unit.wa_number||'').replace(/\D/g,'')}?text=Assalamu'alaikum,%20Saya%20ingin%20bertanya%20tentang%20pendaftaran%20${encodeURIComponent(unit.name)}" target="_blank" class="inline-flex items-center text-emerald-600 font-bold hover:text-emerald-700 transition group">
                    Tanya PPDB via WhatsApp <i class="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition"></i>
                </a>
            </div>
        </div>
        `;
    };

    return `
      <!-- Header Program -->
      <div class="bg-emerald-800 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-4xl md:text-5xl font-playfair font-bold mb-4 text-gold-400">Program & Jenjang Pendidikan</h1>
          <p class="text-emerald-100 text-lg max-w-2xl mx-auto">Kami menyelenggarakan pendidikan berkelanjutan dari jenjang dasar hingga menengah atas dan pendidikan kepesantrenan.</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        ${units.map((u, i) => renderDetailedUnit(u, i)).join('')}
      </div>
    `;
};
