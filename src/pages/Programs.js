import { getUnitImage } from '../api';

export const renderPrograms = (units) => {
    
    const renderDetailedUnit = (unit, index) => {
        const isEven = index % 2 !== 0;
        const imageUrl = unit.image_url || getUnitImage(unit);
        const isSDI = unit.id === 1 || (unit.name && (unit.name.includes('SD Islam') || unit.name.includes('SDI') || unit.name.toLowerCase().includes('al kindy')));
        const isMTs = unit.id === 3 || (unit.name && (unit.name.includes('MTs') || unit.name.toLowerCase().includes('tsanawiyah')));
        const unitName = isSDI ? 'SD Islam (SDI) AL KINDY' : unit.name;
        return `
        <div class="flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''} gap-8 items-center bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-12 hover:shadow-md transition">
            <div class="w-full md:w-1/3">
                <div class="aspect-video md:aspect-square bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-4 sm:p-6 group">
                    <img src="${imageUrl}" alt="${unitName}" class="object-contain max-h-full w-auto group-hover:scale-105 transition duration-300">
                </div>
            </div>
            <div class="w-full md:w-2/3">
                <h2 class="text-3xl font-playfair font-bold text-emerald-800 mb-4">${unitName}</h2>
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

                ${isMTs ? `
                <!-- Wadah Sejarah & Profil MTs -->
                <div class="bg-emerald-50/60 rounded-xl p-6 border border-emerald-100/90 mb-8 shadow-sm">
                    <h4 class="font-playfair font-bold text-lg text-emerald-800 mb-3 flex items-center">
                        <i class="fas fa-landmark mr-2.5 text-emerald-600"></i> Sejarah & Profil MTs
                    </h4>
                    <p class="text-slate-600 text-sm leading-relaxed mb-3">
                        Awal pendirian MTs Nahjul Huda adalah kelanjutan dari proses penghimpunan anak-anak yatim dan dhuafa yang diselenggarakan oleh Yayasan Nahjul Huda Pondok Pesantren Yatim Piatu Assurur yang beralamat di Jl. HH No.63 Rt.08 Rw.01 Kebon Jeruk Jakarta Barat.
                    </p>
                    <p class="text-slate-600 text-sm leading-relaxed mb-3">
                        Pada perkembangannya tokoh masyarakat, ulama dan pemerintah daerah saling bergotong-royong untuk membangun gedung asrama dan madrasah bagi anak-anak yatim dan dhuafa selanjutnya memikirkan bagaimana memberikan bekal ilmu kepada mereka baik formal maupun non formal.
                    </p>
                    <p class="text-slate-600 text-sm leading-relaxed mb-3">
                        Dengan biaya swadaya murni dari masyarakat setempat maka dibangunlah gedung asrama dan madrasah. Untuk tahap awal Yayasan Nahjul Huda membangun gedung madrasah untuk tingkat Ibtidaiyah (MI sederajat dengan SD) sebanyak 6 lokal. Kemudian seiring dengan berkembangnya Yayasan Nahjul Huda didirikanlah lagi gedung tiga lantai dengan pembagian: lantai pertama untuk pelaksanaan pendidikan berupa madrasah untuk tingkat tsanawiyah (MTs sederajat dengan SMP), lantai dua untuk asrama puteri, dan lantai ketiga untuk asrama putera. Madrasah tersebut kemudian diberi nama "MTs Nahjul Huda" atas usulan dari segenap masyarakat yang tinggal di Kebon Jeruk pada tahun 1985. Mengapa namanya MTs Nahjul Huda? Karena mengikuti nama yayasan sebagai induk lembaga madrasah yakni Yayasan Nahjul Huda.
                    </p>
                    <p class="text-slate-600 text-sm leading-relaxed mb-3">
                        Sehubungan MTs Nahjul Huda bernaung di bawah Yayasan Nahjul Huda Pondok Pesantren Yatim Piatu Assurur, maka dalam proses penerimaan siswanya pun lebih mengupayakan kepada santri Pondok Pesantren yang diasramakan agar anak-anak yatim dan dhuafa bisa bersekolah dan mendapatkan ilmu serta STTB resmi dari pemerintah sehingga bisa melanjutkan pendidikan ke jenjang berikutnya yaitu SMA/MA kemudian Perguruan Tinggi.
                    </p>
                    <p class="text-slate-600 text-sm leading-relaxed mb-3">
                        MTs Nahjul Huda pada awal berdirinya tahun 1985 dipimpin oleh kepala madrasah Bapak Drs. H. Nurohim. Selanjutnya MTs Nahjul Huda sempat mengalami kefakuman pada tahun 1986 s.d 1998 sehingga kegiatan belajar mengajar dihentikan sementara waktu sambil merancang ke depan bagaimana untuk membangunkan kembali pendidikan di madrasah ini.
                    </p>
                    <p class="text-slate-600 text-sm leading-relaxed">
                        Maka pada tahun 1999 barulah MTs Nahjul Huda bangkit kembali dengan semangat dan tenaga baru untuk mulai mengembangkan pendidikan di wilayah Kebon Jeruk dan sekitarnya, sehingga sampai saat ini siswa di MTs Nahjul Huda mencapai lebih dari 70 siswa dari berbagai daerah.
                    </p>
                </div>
                ` : ''}
                
                <a href="https://wa.me/${(unit.wa_number||'').replace(/\D/g,'')}?text=Assalamu'alaikum,%20Saya%20ingin%20bertanya%20tentang%20pendaftaran%20${encodeURIComponent(unit.name)}" target="_blank" class="inline-flex items-center text-emerald-600 font-bold hover:text-emerald-700 transition group">
                    Tanya PPDB via WhatsApp <i class="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition"></i>
                </a>
            </div>
        </div>
        `;
    };

    return `
      <!-- Header Program -->
      <section class="bg-emerald-900 text-white py-20 relative overflow-hidden">
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-emerald-800 opacity-40 blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-950 opacity-50 blur-3xl pointer-events-none"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 class="text-4xl md:text-5xl font-playfair font-bold mb-4 text-gold-400">Program & Jenjang Pendidikan</h1>
          <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-4"></div>
          <p class="text-white text-lg max-w-2xl mx-auto">Kami menyelenggarakan pendidikan berkelanjutan dari jenjang dasar hingga menengah atas dan pendidikan kepesantrenan.</p>
        </div>
      </section>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        ${units.map((u, i) => renderDetailedUnit(u, i)).join('')}
      </div>
    `;
};
