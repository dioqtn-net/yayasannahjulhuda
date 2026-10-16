import { getUnitImage } from '../api';

export const renderHome = (profile, units, news, facilities, galleries, ppdb) => {

    const renderUnitCard = (unit) => {
        const imageUrl = unit.image_url || getUnitImage(unit);
        const isSDI = unit.id === 1 || (unit.name && (unit.name.includes('SD Islam') || unit.name.includes('SDI') || unit.name.toLowerCase().includes('al kindy')));
        const unitName = isSDI ? 'SD Islam (SDI) AL KINDY' : unit.name;
        return `
        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer border border-slate-100 transform hover:-translate-y-1 flex flex-col h-full group" onclick="openModal(${unit.id})">
            <div class="w-full h-48 flex-shrink-0 flex items-center justify-center bg-white p-4 border-b border-slate-100 overflow-hidden">
                <img src="${imageUrl}" alt="${unitName}" class="object-contain max-h-full w-auto group-hover:scale-105 transition duration-300">
            </div>
            <div class="p-5 text-center flex-grow flex flex-col justify-between bg-white">
                <div>
                    <h3 class="font-playfair font-bold text-xl text-emerald-800 mb-2 h-14 flex items-center justify-center">${unitName}</h3>
                    <p class="text-slate-600 text-sm line-clamp-2 mb-4">${unit.description}</p>
                </div>
                <div>
                    <span class="inline-block border border-gold-500 text-gold-600 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-gold-50 transition">Detail Lengkap</span>
                </div>
            </div>
        </div>
        
        <!-- Modal for ${unitName} -->
        <div id="modal-${unit.id}" class="hidden fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto pt-10 pb-10">
            <div class="fixed inset-0 bg-slate-900 bg-opacity-75 backdrop-blur-sm transition-opacity" onclick="closeModal(${unit.id})"></div>
            <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 relative z-10 shadow-2xl flex flex-col max-h-[90vh]">
                <div class="flex justify-between items-center p-6 border-b border-slate-100">
                    <h3 class="text-2xl font-playfair font-bold text-emerald-800">${unitName}</h3>
                    <button onclick="closeModal(${unit.id})" class="text-slate-400 hover:text-red-500 transition">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div class="p-6 overflow-y-auto">
                    <div class="w-full h-48 sm:h-64 mb-6 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-4 shadow-sm">
                        <img src="${imageUrl}" alt="${unitName}" class="object-contain max-h-full w-auto">
                    </div>
                    <p class="text-slate-700 mb-6 leading-relaxed">${unit.description}</p>
                    <div class="mb-4">
                        <h4 class="font-bold text-emerald-700 mb-2 flex items-center"><i class="fas fa-book-open mr-2 text-gold-500"></i> Kurikulum & Program Unggulan</h4>
                        <p class="text-slate-600">${unit.curriculum || '-'}</p>
                    </div>
                    <div class="mb-4">
                        <h4 class="font-bold text-emerald-700 mb-2 flex items-center"><i class="fas fa-running mr-2 text-gold-500"></i> Ekstrakurikuler</h4>
                        <p class="text-slate-600">${unit.extracurricular || '-'}</p>
                    </div>
                    <div class="mb-6">
                        <h4 class="font-bold text-emerald-700 mb-2 flex items-center"><i class="fas fa-building mr-2 text-gold-500"></i> Fasilitas</h4>
                        <p class="text-slate-600">${unit.facilities || '-'}</p>
                    </div>
                </div>
                <div class="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
                    <a href="https://wa.me/${(unit.wa_number||'').replace(/\D/g,'')}?text=Assalamu'alaikum,%20Saya%20ingin%20bertanya%20tentang%20pendaftaran%20${encodeURIComponent(unitName)}" target="_blank" class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition flex items-center shadow-sm">
                        <i class="fab fa-whatsapp text-lg mr-2"></i> Tanya PPDB via WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `;
    };

    return `
      <!-- Hero Section -->
      <section class="relative bg-slate-900 text-white min-h-[500px] flex items-center">
        <div class="absolute inset-0 z-0">
          <img src="/logo.png" alt="Hero Background" class="w-full h-full object-cover opacity-30 backdrop-blur-sm">
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-800/80"></div>
        </div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center md:text-left fade-in">
          <span class="inline-block py-1 px-3 rounded-full bg-gold-500/20 text-gold-400 font-semibold text-sm mb-4 border border-gold-500/30">Lembaga Pendidikan Islam</span>
          <h1 class="text-4xl md:text-6xl font-playfair font-bold leading-tight mb-6 text-white drop-shadow-md">
            Selamat Datang di <br><span class="text-gold-400">Yayasan Nahjul Huda</span>
          </h1>
          <p class="text-lg md:text-xl text-emerald-100 max-w-2xl mb-8 leading-relaxed drop-shadow">
            Membangun generasi emas yang beriman, berilmu, dan berakhlakul karimah melalui pendidikan berkualitas dan terpadu.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="/ppdb" data-navigo class="bg-gold-500 hover:bg-gold-400 text-slate-900 px-8 py-3 rounded-full font-bold transition shadow-lg flex items-center justify-center">
              <i class="fas fa-user-graduate mr-2"></i> Info PPDB
            </a>
            <a href="#jenjang" class="bg-emerald-700/50 hover:bg-emerald-600/80 border border-emerald-400/30 text-white px-8 py-3 rounded-full font-medium transition backdrop-blur flex items-center justify-center">
              Jelajahi Jenjang Pendidikan <i class="fas fa-arrow-down ml-2"></i>
            </a>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="py-12 bg-white border-b border-slate-100 relative z-20 -mt-10 mx-4 md:mx-auto max-w-5xl rounded-2xl shadow-xl">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-100">
          <div class="p-4">
            <div class="text-3xl font-bold text-emerald-600 mb-1">5</div>
            <div class="text-slate-500 text-sm font-medium uppercase tracking-wide">Jenjang Pendidikan</div>
          </div>
          <div class="p-4">
            <div class="text-3xl font-bold text-emerald-600 mb-1">100+</div>
            <div class="text-slate-500 text-sm font-medium uppercase tracking-wide">Tenaga Pendidik</div>
          </div>
          <div class="p-4">
            <div class="text-3xl font-bold text-emerald-600 mb-1">1000+</div>
            <div class="text-slate-500 text-sm font-medium uppercase tracking-wide">Santri & Siswa</div>
          </div>
          <div class="p-4">
            <div class="text-3xl font-bold text-emerald-600 mb-1">1980</div>
            <div class="text-slate-500 text-sm font-medium uppercase tracking-wide">Tahun Berdiri</div>
          </div>
        </div>
      </section>

      <!-- Sambutan -->
      <section class="py-20 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl md:text-4xl font-playfair font-bold text-emerald-900 mb-6">Mencetak Generasi Rabbani</h2>
          <div class="w-24 h-1 bg-gold-500 mx-auto mb-8 rounded-full"></div>
          <p class="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            "${profile.history}"
          </p>
        </div>
      </section>

      <!-- Jenjang Pendidikan (5 Units) -->
      <section id="jenjang" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-playfair font-bold text-emerald-900 mb-4">Jenjang Pendidikan</h2>
            <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full"></div>
            <p class="mt-4 text-slate-600 max-w-2xl mx-auto">Sistem pendidikan komprehensif mulai dari tingkat dasar hingga menengah atas dan kepesantrenan.</p>
          </div>
          
          <div class="grid-5-centered">
            ${units.map(renderUnitCard).join('')}
          </div>
        </div>
      </section>

      <!-- Program Sosial & Keagamaan -->
      <section class="py-20 bg-emerald-900 text-white relative overflow-hidden">
        <!-- Abstract shape -->
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-emerald-800 opacity-50 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-950 opacity-50 blur-3xl"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">Program Sosial & Keagamaan</h2>
            <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full"></div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div class="bg-emerald-800/50 backdrop-blur border border-emerald-700 p-8 rounded-2xl hover:bg-emerald-800 transition">
              <div class="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-gold-500/30">
                <i class="fas fa-users"></i>
              </div>
              <h3 class="text-2xl font-playfair font-bold mb-3 text-gold-400">Majelis Ta'lim Nahjul Huda</h3>
              <p class="text-emerald-100 leading-relaxed">Wadah pengajian rutin bagi masyarakat sekitar untuk memperdalam ilmu agama, kajian tafsir, fiqih, dan tasawuf yang diasuh langsung oleh para asatidz Yayasan.</p>
            </div>
            
            <div class="bg-emerald-800/50 backdrop-blur border border-emerald-700 p-8 rounded-2xl hover:bg-emerald-800 transition">
              <div class="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-gold-500/30">
                <i class="fas fa-calendar-alt"></i>
              </div>
              <h3 class="text-2xl font-playfair font-bold mb-3 text-gold-400">Pengajian Rutin Bulanan</h3>
              <p class="text-emerald-100 leading-relaxed">Kegiatan rutin bulanan yang diselenggarakan oleh yayasan sebagai wadah silaturahmi, doa bersama, serta kajian keislaman tematik untuk memperkuat ukhuwah dan wawasan spiritual para jamaah dan wali murid.</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- PPDB Call to Action -->
      <section class="py-16 bg-gold-500">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl md:text-4xl font-playfair font-bold text-emerald-900 mb-4">Penerimaan Peserta Didik Baru (PPDB)</h2>
          <p class="text-emerald-900/80 text-lg mb-8">Tahun Ajaran ${ppdb?.academic_year || '2024/2025'} - Status: <span class="font-bold bg-white px-3 py-1 rounded-full text-emerald-700 text-sm ml-2">${ppdb?.status || 'BUKA'}</span></p>
          <a href="/ppdb" data-navigo class="inline-block bg-emerald-800 hover:bg-emerald-900 text-white px-8 py-3.5 rounded-full font-bold text-lg transition shadow-xl hover:-translate-y-1 transform">
            Lihat Informasi Pendaftaran
          </a>
        </div>
      </section>
    `;
};
