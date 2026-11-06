function formatContentHtml(str) {
        if (str === null || str === undefined) return '-';
        const trimmed = String(str).trim();
        if (trimmed === '' || trimmed === '-') return '-';
        if (/^<div[\s>]/i.test(trimmed) || /^<p[\s>]/i.test(trimmed)) {
          return trimmed;
        }
        return `<div class="whitespace-pre-wrap">${trimmed}</div>`;
      }

export const renderProfile = (profile) => {
    let cmsData = null;
    try {
        const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('cmsData_profil') : null;
        if (stored) cmsData = JSON.parse(stored);
    } catch (e) {
        console.error('Error reading cmsData_profil in renderProfile:', e);
    }

    const profilTitle = cmsData?.profilTitle || 'Profil Yayasan';
    const profilDesc = cmsData?.profilDesc || 'Mengenal lebih dekat sejarah, visi, misi, target lulusan, dan struktur kepengurusan Yayasan Nahjul Huda.';
    const sejarahText = cmsData?.sejarahText || (profile?.history ? profile.history.replace(/\n/g, '<br>') : '-');
    const strukturTitle = cmsData?.strukturTitle || 'Struktur Organisasi';
    const strukturDesc = cmsData?.strukturDesc || 'Struktur kepengurusan Yayasan Nahjul Huda berdedikasi tinggi untuk memajukan lembaga tercinta.';
    const namaKetua = cmsData?.namaKetua || '-';
    const fotoKetua = cmsData?.fotoKetua || '';
    const namaSDI = cmsData?.namaSDI || '-';
    const fotoSDI = cmsData?.fotoSDI || '';
    const namaMI = cmsData?.namaMI || '-';
    const fotoMI = cmsData?.fotoMI || '';
    const namaMTs = cmsData?.namaMTs || '-';
    const fotoMTs = cmsData?.fotoMTs || '';
    const namaMA = cmsData?.namaMA || '-';
    const fotoMA = cmsData?.fotoMA || '';
    const namaMudir = cmsData?.namaMudir || '-';
    const fotoMudir = cmsData?.fotoMudir || '';

    return `
      <!-- Header Profile -->
      <section class="relative bg-[url('/media/background/wallpaper_yayasan.jpg')] bg-cover bg-center bg-no-repeat text-white py-20 overflow-hidden">
        <!-- Dark Overlay Wrapper -->
        <div class="absolute inset-0 bg-black/70 z-0"></div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-2xl sm:text-3xl md:text-5xl font-playfair font-bold mb-4 text-gold-400 drop-shadow-md text-center">${profilTitle}</h1>
          <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-4"></div>
          <div class="text-white text-lg max-w-2xl mx-auto drop-shadow leading-relaxed">${profilDesc}</div>
        </div>
      </section>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <!-- Sejarah -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 mb-12 flex flex-col md:flex-row gap-12 items-center">
          <div class="w-full md:w-1/3">
            <div class="aspect-square bg-slate-100 rounded-2xl overflow-hidden shadow-inner relative">
                <img src="/logo.png" alt="Sejarah" class="w-full h-full object-contain p-8 mix-blend-multiply opacity-80">
            </div>
          </div>
          <div class="w-full md:w-2/3">
            <h2 class="text-3xl font-playfair font-bold text-emerald-800 mb-6 flex items-center">
              <i class="fas fa-history text-gold-500 mr-4"></i> Sejarah Berdirinya
            </h2>
            <div class="prose prose-emerald max-w-none text-slate-600 leading-relaxed">
              <div class="whitespace-pre-line">${sejarahText}</div>
            </div>
          </div>
        </div>

        <!-- Visi Misi -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div class="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
            <h3 class="text-2xl font-playfair font-bold text-emerald-800 mb-6 flex items-center">
              <i class="fas fa-eye text-gold-500 mr-4"></i> Visi & Misi
            </h3>
            <div class="text-slate-700 leading-relaxed whitespace-pre-line">
              ${profile.vision_mission}
            </div>
          </div>
          
          <div class="bg-gold-50 rounded-2xl p-8 border border-gold-100">
            <h3 class="text-2xl font-playfair font-bold text-gold-700 mb-6 flex items-center">
              <i class="fas fa-star text-gold-500 mr-4"></i> Nilai-Nilai Utama
            </h3>
            <ul class="space-y-4 text-slate-700">
              <li class="flex items-start">
                <i class="fas fa-check-circle text-emerald-600 mt-1 mr-3"></i>
                <div>
                  <span class="font-bold block">Keislaman (Religiusitas)</span>
                  <span class="text-sm">Menanamkan nilai tauhid dan syariat dalam setiap aspek pembelajaran.</span>
                </div>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check-circle text-emerald-600 mt-1 mr-3"></i>
                <div>
                  <span class="font-bold block">Akhlakul Karimah</span>
                  <span class="text-sm">Membentuk karakter santun, peduli, dan beradab.</span>
                </div>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check-circle text-emerald-600 mt-1 mr-3"></i>
                <div>
                  <span class="font-bold block">Keunggulan Akademik & Keterampilan</span>
                  <span class="text-sm">Berprestasi di bidang IPTEK dan tanggap terhadap perubahan zaman.</span>
                </div>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check-circle text-emerald-600 mt-1 mr-3"></i>
                <div>
                  <span class="font-bold block">Kemandirian & Kebangsaan</span>
                  <span class="text-sm">Membina jiwa mandiri dan cinta tanah air (Hubbul Wathon Minal Iman).</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Struktur Organisasi -->
        <div>
          <h2 class="text-3xl font-playfair font-bold text-emerald-800 mb-4 text-center">${strukturTitle}</h2>
          <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-12"></div>
          
          <div class="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div class="text-slate-600 italic mb-8">${strukturDesc}</div>
            
            <div class="max-w-xs mx-auto mb-8 p-6 border border-slate-100 rounded-2xl bg-white shadow-sm text-center">
              <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 overflow-hidden bg-slate-100 border-4 border-emerald-100 flex items-center justify-center shadow-md">
                ${fotoKetua ? `<img src="${fotoKetua}" alt="Ketua Yayasan" class="w-full h-full object-cover">` : `<i class="fas fa-user-tie text-emerald-800 text-4xl sm:text-5xl"></i>`}
              </div>
              <h4 class="font-bold text-slate-800 text-lg">Ketua Yayasan</h4>
              <p class="text-sm font-semibold text-emerald-800 mt-1">${namaKetua}</p>
              <p class="text-xs text-slate-400 mt-0.5">Pengurus Utama</p>
            </div>
            
            <div class="mt-8 pt-8 border-t border-slate-100">
               <h4 class="font-bold text-slate-800 mb-6 text-lg text-center">Kepala Unit Pendidikan</h4>
               <div class="flex flex-row flex-wrap justify-center gap-4 sm:gap-6 max-w-5xl mx-auto">
                  
                  <!-- Kepala SDI -->
                  <div class="flex flex-col items-center text-center w-36 sm:w-44 p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
                     <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-100 shadow-md flex items-center justify-center mb-3 border-4 border-emerald-50 overflow-hidden">
                        ${fotoSDI ? `<img src="${fotoSDI}" alt="Kepala SDI" class="w-full h-full object-cover">` : `<i class="fas fa-user-graduate text-emerald-700 text-3xl"></i>`}
                     </div>
                     <h5 class="font-bold text-slate-800 text-sm">Kepala SDI</h5>
                     <p class="text-xs text-slate-600 font-medium mt-1">${namaSDI}</p>
                  </div>

                  <!-- Kepala MI -->
                  <div class="flex flex-col items-center text-center w-36 sm:w-44 p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
                     <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-100 shadow-md flex items-center justify-center mb-3 border-4 border-emerald-50 overflow-hidden">
                        ${fotoMI ? `<img src="${fotoMI}" alt="Kepala MI" class="w-full h-full object-cover">` : `<i class="fas fa-user-graduate text-emerald-700 text-3xl"></i>`}
                     </div>
                     <h5 class="font-bold text-slate-800 text-sm">Kepala MI</h5>
                     <p class="text-xs text-slate-600 font-medium mt-1">${namaMI}</p>
                  </div>

                  <!-- Kepala MTs -->
                  <div class="flex flex-col items-center text-center w-36 sm:w-44 p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
                     <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-100 shadow-md flex items-center justify-center mb-3 border-4 border-emerald-50 overflow-hidden">
                        ${fotoMTs ? `<img src="${fotoMTs}" alt="Kepala MTs" class="w-full h-full object-cover">` : `<i class="fas fa-user-graduate text-emerald-700 text-3xl"></i>`}
                     </div>
                     <h5 class="font-bold text-slate-800 text-sm">Kepala MTs</h5>
                     <p class="text-xs text-slate-600 font-medium mt-1">${namaMTs}</p>
                  </div>

                  <!-- Kepala MA -->
                  <div class="flex flex-col items-center text-center w-36 sm:w-44 p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
                     <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-100 shadow-md flex items-center justify-center mb-3 border-4 border-emerald-50 overflow-hidden">
                        ${fotoMA ? `<img src="${fotoMA}" alt="Kepala MA" class="w-full h-full object-cover">` : `<i class="fas fa-user-graduate text-emerald-700 text-3xl"></i>`}
                     </div>
                     <h5 class="font-bold text-slate-800 text-sm">Kepala MA</h5>
                     <p class="text-xs text-slate-600 font-medium mt-1">${namaMA}</p>
                  </div>

                  <!-- Mudir Ponpes -->
                  <div class="flex flex-col items-center text-center w-36 sm:w-44 p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
                     <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-100 shadow-md flex items-center justify-center mb-3 border-4 border-emerald-50 overflow-hidden">
                        ${fotoMudir ? `<img src="${fotoMudir}" alt="Mudir Ponpes" class="w-full h-full object-cover">` : `<i class="fas fa-user-tie text-emerald-700 text-3xl"></i>`}
                     </div>
                     <h5 class="font-bold text-slate-800 text-sm">Mudir Ponpes</h5>
                     <p class="text-xs text-slate-600 font-medium mt-1">${namaMudir}</p>
                  </div>

               </div>
            </div>

          </div>
        </div>
      </div>
    `;
};
