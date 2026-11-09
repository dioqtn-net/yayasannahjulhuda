function formatContentHtml(str) {
  if (str === null || str === undefined) return '-';
  const trimmed = String(str).trim();
  if (trimmed === '' || trimmed === '-') return '-';
  if (/^<div[\s>]/i.test(trimmed) || /^<p[\s>]/i.test(trimmed)) {
    return trimmed;
  }
  return `<div class="text-justify">${trimmed}</div>`;
}

export const renderProfile = (profile) => {
    try {
        if (typeof localStorage !== 'undefined') localStorage.removeItem('cmsData_profil');
    } catch (e) {}

    const pengurus = (profile && typeof profile.pengurus === 'object' && profile.pengurus !== null) ? profile.pengurus : {};

    const profilTitle = profile?.banner_title || profile?.name || 'Profil Yayasan';
    const profilDesc = profile?.banner_desc || 'Mengenal lebih dekat sejarah, visi, misi, target lulusan, dan struktur kepengurusan Yayasan Nahjul Huda.';
    const sejarahText = profile?.history ? profile.history.replace(/\n/g, '<br>') : '-';

    const strukturTitle = profile?.struktur_title || 'Struktur Organisasi';
    const strukturDesc = profile?.struktur_desc || 'Struktur kepengurusan Yayasan Nahjul Huda berdedikasi tinggi untuk memajukan lembaga tercinta.';

    const namaKetua = pengurus.namaKetua || '-';
    const fotoKetua = pengurus.fotoKetua || '';
    const namaSDI = pengurus.namaSDI || '-';
    const fotoSDI = pengurus.fotoSDI || '';
    const namaMI = pengurus.namaMI || '-';
    const fotoMI = pengurus.fotoMI || '';
    const namaMTs = pengurus.namaMTs || '-';
    const fotoMTs = pengurus.fotoMTs || '';
    const namaMA = pengurus.namaMA || '-';
    const fotoMA = pengurus.fotoMA || '';
    const namaMudir = pengurus.namaMudir || '-';
    const fotoMudir = pengurus.fotoMudir || '';

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

        <!-- HARDCODE VISI MISI & TARGET LULUSAN -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <!-- Bagian Kiri: Visi & Misi -->
            <div class="bg-green-50/30 rounded-2xl p-8 border border-green-100">
                <h3 class="text-2xl font-bold text-green-900 font-serif mb-6 flex items-center">
                    <span class="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-3 shadow-sm">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
                    </span>
                    Visi &amp; Misi Yayasan
                </h3>
                
                <div class="mb-6">
                    <h4 class="text-sm font-bold text-green-800 mb-2 flex items-center">
                        <span class="text-yellow-500 mr-2 text-lg">❝</span> VISI:
                    </h4>
                    <p class="text-gray-700 text-justify italic pl-6 pr-2 leading-relaxed">
                        "Terwujudnya lembaga pendidikan yang profesional, peduli, dan kompetitif guna terwujudnya generasi qur'ani, berakhlak mulia, cerdas, kreatif, aktif, berprestasi, dan berwawasan global."
                    </p>
                </div>

                <div>
                    <h4 class="text-sm font-bold text-green-800 mb-4 flex items-center">
                        <svg class="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/></svg>
                        MISI:
                    </h4>
                    <ul class="space-y-4 text-gray-700 text-justify pr-2">
                        <li class="flex items-start"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span> <span>Melaksanakan pendidikan berdasarkan Al Qur'an dan Hadits guna mewujudkan peserta didik beraqidah baik, berakhlak mulia, jujur, percaya diri, bertanggung jawab, mandiri, dan peduli.</span></li>
                        <li class="flex items-start"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span> <span>Menumbuhkembangkan kecintaan terhadap Al Qur'an dengan kompetensi membaca Al Qur'an sesuai kaidah tajwid, menulis Al Qur'an dengan baik dan benar, menghafal Al Qur'an dalam kehidupan sehari-hari.</span></li>
                        <li class="flex items-start"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span> <span>Membekali peserta didik dengan ketrampilan abad 21 dan berwawasan global (berfikir kritis, kreatif, kolaboratif, komunikatif, dan kemampuan literasi) untuk mengembangkan jiwa kepemimpinan sehingga mampu menjadi rahmatan lil 'alamin.</span></li>
                        <li class="flex items-start"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span> <span>Memfasilitasi proses pembelajaran yang aktif, kreatif, efektif, menyenangkan dan membahagiakan.</span></li>
                        <li class="flex items-start"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">5</span> <span>Memfasilitasi peserta didik untuk mengembangkan potensi diri sesuai dengan bakat, minat dan kecerdasan (Multiple Intelegences).</span></li>
                        <li class="flex items-start"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">6</span> <span>Bekerjasama dengan berbagai pihak untuk mengembangkan kualitas SDM sehingga melahirkan pendidik yang kompeten, berdedikasi, istiqomah dan rendah hati.</span></li>
                        <li class="flex items-start"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">7</span> <span>Secara kelembagaan terus menerus melakukan inovasi agar mampu menjadi lembaga pendidikan yang memberikan inspirasi dalam pengembangan pendidikan di Indonesia.</span></li>
                    </ul>
                </div>
            </div>

            <!-- Bagian Kanan: Target Lulusan -->
            <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h3 class="text-2xl font-bold text-green-900 font-serif mb-6 flex items-center">
                    <span class="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center mr-3 shadow-sm">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                    </span>
                    Target Lulusan
                </h3>
                
                <p class="text-gray-700 text-justify mb-6 leading-relaxed">
                    Yayasan Nahjul Huda berkomitmen melahirkan lulusan unggul dengan standar capaian karakter, keilmuan, dan kepribadian:
                </p>
                
                <div class="space-y-4">
                    <div class="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                        <p class="text-gray-700 text-justify text-sm leading-relaxed"><span class="font-bold text-gray-900">Melahirkan generasi Qur'ani:</span> mencintai Al Qur'an sebagai pedoman hidup, mampu membaca, menulis, dan menghafal Al Qur'an dengan baik dan benar.</p>
                    </div>
                    <div class="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                        <p class="text-gray-700 text-justify text-sm leading-relaxed">Memiliki aqidah yang baik dan benar sesuai Al Qur'an dan Hadits.</p>
                    </div>
                    <div class="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                        <p class="text-gray-700 text-justify text-sm leading-relaxed">Mampu beribadah baik dan benar sesuai Al Qur'an dan Hadits.</p>
                    </div>
                    <div class="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                        <p class="text-gray-700 text-justify text-sm leading-relaxed">Memiliki akhlak mulia dan kepribadian yang baik sesuai Al Qur'an dan Hadits.</p>
                    </div>
                    <div class="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                        <p class="text-gray-700 text-justify text-sm leading-relaxed">Memiliki keterampilan abad 21, bertanggung jawab, mandiri, kreatif, dan aktif dalam mengembangkan diri sesuai dengan potensi yang dimiliki.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Struktur Organisasi -->
        <div>
          <h2 class="text-3xl font-playfair font-bold text-emerald-800 mb-4 text-center">${strukturTitle}</h2>
          <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-12"></div>
          
          <div class="max-w-5xl mx-auto">
            <div class="text-slate-600 italic mb-10 text-center">${strukturDesc}</div>
            
            <!-- Ketua Yayasan -->
            <div class="flex flex-col items-center justify-center mb-12 text-center">
              <div class="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mx-auto mb-4 text-green-700 overflow-hidden relative">
                ${fotoKetua ? `<img src="${fotoKetua}" alt="Ketua Yayasan" class="w-full h-full object-cover">` : `
                <div class="w-full h-full flex items-center justify-center text-green-700">
                  <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>`}
              </div>
              <h4 class="font-playfair font-bold text-slate-800 text-base sm:text-lg">Ketua Yayasan</h4>
              <p class="text-sm font-semibold text-emerald-800 mt-1">${namaKetua}</p>
            </div>
            
            <!-- Kepala Unit Pendidikan -->
            <div class="mt-8">
               <h4 class="font-playfair font-bold text-slate-800 mb-8 text-base sm:text-lg text-center">Kepala Unit Pendidikan</h4>
               
               <!-- Kelima Item Sejajar Horisontal -->
               <div class="flex flex-wrap justify-center gap-8 md:gap-12 mt-8">
                  
                  <!-- Kepala SDI -->
                  <div class="flex flex-col items-center text-center">
                     <div class="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mx-auto mb-4 text-green-700 overflow-hidden relative">
                        ${fotoSDI ? `<img src="${fotoSDI}" alt="Kepala SDI" class="w-full h-full object-cover">` : `
                        <div class="w-full h-full flex items-center justify-center text-green-700">
                          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>`}
                     </div>
                     <h5 class="font-playfair font-bold text-slate-800 text-sm sm:text-base">Kepala SDI</h5>
                     <p class="text-xs sm:text-sm text-slate-500 mt-1">${namaSDI}</p>
                  </div>

                  <!-- Kepala MI -->
                  <div class="flex flex-col items-center text-center">
                     <div class="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mx-auto mb-4 text-green-700 overflow-hidden relative">
                        ${fotoMI ? `<img src="${fotoMI}" alt="Kepala MI" class="w-full h-full object-cover">` : `
                        <div class="w-full h-full flex items-center justify-center text-green-700">
                          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>`}
                     </div>
                     <h5 class="font-playfair font-bold text-slate-800 text-sm sm:text-base">Kepala MI</h5>
                     <p class="text-xs sm:text-sm text-slate-500 mt-1">${namaMI}</p>
                  </div>

                  <!-- Kepala MTs -->
                  <div class="flex flex-col items-center text-center">
                     <div class="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mx-auto mb-4 text-green-700 overflow-hidden relative">
                        ${fotoMTs ? `<img src="${fotoMTs}" alt="Kepala MTs" class="w-full h-full object-cover">` : `
                        <div class="w-full h-full flex items-center justify-center text-green-700">
                          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>`}
                     </div>
                     <h5 class="font-playfair font-bold text-slate-800 text-sm sm:text-base">Kepala MTs</h5>
                     <p class="text-xs sm:text-sm text-slate-500 mt-1">${namaMTs}</p>
                  </div>

                  <!-- Kepala MA -->
                  <div class="flex flex-col items-center text-center">
                     <div class="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mx-auto mb-4 text-green-700 overflow-hidden relative">
                        ${fotoMA ? `<img src="${fotoMA}" alt="Kepala MA" class="w-full h-full object-cover">` : `
                        <div class="w-full h-full flex items-center justify-center text-green-700">
                          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>`}
                     </div>
                     <h5 class="font-playfair font-bold text-slate-800 text-sm sm:text-base">Kepala MA</h5>
                     <p class="text-xs sm:text-sm text-slate-500 mt-1">${namaMA}</p>
                  </div>

                  <!-- Mudir Ponpes -->
                  <div class="flex flex-col items-center text-center">
                     <div class="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mx-auto mb-4 text-green-700 overflow-hidden relative">
                        ${fotoMudir ? `<img src="${fotoMudir}" alt="Mudir Ponpes" class="w-full h-full object-cover">` : `
                        <div class="w-full h-full flex items-center justify-center text-green-700">
                          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>`}
                     </div>
                     <h5 class="font-playfair font-bold text-slate-800 text-sm sm:text-base">Mudir Ponpes</h5>
                     <p class="text-xs sm:text-sm text-slate-500 mt-1">${namaMudir}</p>
                  </div>

               </div>
            </div>

          </div>
        </div>
      </div>
    `;
};
