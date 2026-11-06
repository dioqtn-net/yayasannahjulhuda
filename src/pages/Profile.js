function formatContentHtml(str) {
  if (str === null || str === undefined) return '-';
  const trimmed = String(str).trim();
  if (trimmed === '' || trimmed === '-') return '-';
  if (/^<div[\s>]/i.test(trimmed) || /^<p[\s>]/i.test(trimmed)) {
    return trimmed;
  }
  return `<div class="text-justify">${trimmed}</div>`;
}

function parseAligned(str, isList = false, listType = 'number') {
  if (!str) return '';
  let cleanText = String(str);
  let alignClass = 'text-justify';
  if (cleanText.trim().startsWith('<div')) {
    const match = cleanText.match(/<div class="([^"]*)">([\s\S]*?)<\/div>/i);
    if (match) {
      alignClass = match[1].replace('whitespace-pre-wrap', '').trim() || 'text-justify';
      cleanText = match[2];
    }
  }
  if (!isList) {
    return `<div class="${alignClass}">${cleanText.replace(/\n/g, '<br>')}</div>`;
  }
  const lines = cleanText.replace(/<br\s*[\/]?>/gi, '\n')
    .split('\n')
    .map(b => b.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);

  if (listType === 'number') {
    return lines.map((line, idx) => {
      const textOnly = line.replace(/^\d+[\.\)]\s*/, '');
      return `
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">${idx + 1}</span>
          <span class="${alignClass}">${textOnly}</span>
        </li>
      `;
    }).join('');
  } else {
    return lines.map(line => {
      const textOnly = line.replace(/^\d+[\.\)]\s*/, '');
      return `
        <li class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-emerald-50/40 transition">
          <span class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold">
            <i class="fas fa-check-circle"></i>
          </span>
          <div class="text-sm text-slate-700 leading-relaxed ${alignClass}">
            ${textOnly}
          </div>
        </li>
      `;
    }).join('');
  }
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
    const rawVisi = cmsData?.teks_visi_profil || cmsData?.visi || '"Terwujudnya lembaga pendidikan yang profesional, peduli, dan kompetitif guna terwujudnya generasi qur\'ani, berakhlak mulia, cerdas, kreatif, aktif, berprestasi, dan berwawasan global."';
    const rawMisi = cmsData?.teks_misi_profil || cmsData?.misi || `Melaksanakan pendidikan berdasarkan Al Qur'an dan Hadits guna mewujudkan peserta didik beraqidah baik, berakhlak mulia, jujur, percaya diri, bertanggung jawab, mandiri, dan peduli.
Menumbuhkembangkan kecintaan terhadap Al Qur'an dengan kompetensi membaca Al Qur'an sesuai kaidah tajwid, menulis Al Qur'an dengan baik dan benar, menghafal Al Qur'an dalam kehidupan sehari-hari.
Membekali peserta didik dengan ketrampilan abad 21 dan berwawasan global (berfikir kritis, kreatif, kolaboratif, komunikatif, dan kemampuan literasi) untuk mengembangkan jiwa kepemimpinan sehingga mampu menjadi rahmatan lil 'alamin.
Memfasilitasi proses pembelajaran yang aktif, kreatif, efektif, menyenangkan dan membahagiakan.
Memfasilitasi peserta didik untuk mengembangkan potensi diri sesuai dengan bakat, minat dan kecerdasan (Multiple Intelegences).
Bekerjasama dengan berbagai pihak untuk mengembangkan kualitas SDM sehingga melahirkan pendidik yang kompeten, berdedikasi, istiqomah dan rendah hati.
Secara kelembagaan terus menerus melakukan inovasi agar mampu menjadi lembaga pendidikan yang memberikan inspirasi dalam pengembangan pendidikan di Indonesia.`;
    const rawTargetPengantar = cmsData?.pengantar_target_profil || cmsData?.targetPengantar || 'Yayasan Nahjul Huda berkomitmen melahirkan lulusan unggul dengan standar capaian karakter, keilmuan, dan kepribadian:';
    const rawTargetPoin = cmsData?.poin_target_profil || cmsData?.targetPoin || `Melahirkan generasi Qur'ani: mencintai Al Qur'an sebagai pedoman hidup, mampu membaca, menulis, dan menghafal Al Qur'an dengan baik dan benar.
Memiliki aqidah yang baik dan benar sesuai Al Qur'an dan Hadits.
Mampu beribadah baik dan benar sesuai Al Qur'an dan Hadits.
Membina jiwa mandiri dan cinta tanah air (Hubbul Wathon Minal Iman).`;

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

        <!-- Visi Misi & Target Lulusan -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-start">
          
          <!-- Card Visi & Misi -->
          <div class="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-sm">
            <h3 class="text-2xl font-playfair font-bold text-emerald-900 mb-6 flex items-center">
              <span class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mr-3 text-base shadow-2xs">
                <i class="fas fa-eye"></i>
              </span>
              Visi &amp; Misi Yayasan
            </h3>

            <!-- Visi -->
            <div class="mb-6 bg-emerald-50/70 p-5 rounded-xl border border-emerald-100">
              <span class="block font-bold text-emerald-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <i class="fas fa-quote-left text-gold-500"></i> Visi:
              </span>
              <div class="italic text-slate-700 text-sm sm:text-base leading-relaxed">
                ${parseAligned(rawVisi, false)}
              </div>
            </div>

            <!-- Misi -->
            <div>
              <span class="block font-bold text-emerald-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <i class="fas fa-list-ol text-gold-500"></i> Misi:
              </span>
              <ol class="space-y-3 text-sm text-slate-700 leading-relaxed list-none">
                ${parseAligned(rawMisi, true, 'number')}
              </ol>
            </div>
          </div>

          <!-- Card Target Lulusan -->
          <div class="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-sm">
            <h3 class="text-2xl font-playfair font-bold text-emerald-900 mb-6 flex items-center">
              <span class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mr-3 text-base shadow-2xs">
                <i class="fas fa-bullseye"></i>
              </span>
              Target Lulusan
            </h3>

            <div class="text-slate-600 text-sm mb-6 leading-relaxed">
              ${parseAligned(rawTargetPengantar, false)}
            </div>

            <ul class="space-y-4">
              ${parseAligned(rawTargetPoin, true, 'check')}
            </ul>
          </div>
        </div>

        <!-- Struktur Organisasi -->
        <div>
          <h2 class="text-3xl font-playfair font-bold text-emerald-800 mb-4 text-center">${strukturTitle}</h2>
          <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-12"></div>
          
          <div class="max-w-5xl mx-auto bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100">
            <div class="text-slate-600 italic mb-8">${strukturDesc}</div>
            
            <!-- Card Ketua Yayasan (Wide Box) -->
            <div class="w-full bg-white border border-slate-100 rounded-2xl p-8 sm:p-10 mb-10 text-center shadow-xs">
              <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 overflow-hidden bg-emerald-50/70 border-4 border-emerald-100 flex items-center justify-center shadow-xs relative">
                ${fotoKetua ? `<img src="${fotoKetua}" alt="Ketua Yayasan" class="w-full h-full object-cover">` : `
                <div class="w-full h-full flex items-center justify-center text-emerald-800 text-3xl sm:text-4xl">
                  <i class="fas fa-user"></i>
                </div>`}
              </div>
              <h4 class="font-playfair font-bold text-slate-800 text-lg sm:text-xl">Ketua Yayasan</h4>
              <p class="text-sm font-semibold text-emerald-800 mt-1">${namaKetua}</p>
            </div>
            
            <!-- Kepala Unit Pendidikan -->
            <div class="mt-8">
               <h4 class="font-playfair font-bold text-slate-800 mb-8 text-base sm:text-lg text-center">Kepala Unit Pendidikan</h4>
               
               <!-- 5 Item Sejajar Horisontal dalam 1 Baris (Single Row) -->
               <div class="grid grid-cols-5 gap-2 sm:gap-4 md:gap-6 max-w-4xl mx-auto justify-items-center items-start">
                  
                  <!-- Kepala SDI -->
                  <div class="flex flex-col items-center text-center">
                     <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-800 text-white shadow-sm flex items-center justify-center mb-2 overflow-hidden relative">
                        ${fotoSDI ? `<img src="${fotoSDI}" alt="Kepala SDI" class="w-full h-full object-cover">` : `
                        <div class="w-full h-full flex items-center justify-center text-white text-lg sm:text-xl">
                          <i class="fas fa-user-tie"></i>
                        </div>`}
                     </div>
                     <h5 class="font-playfair font-bold text-slate-800 text-xs sm:text-sm">Kepala SDI</h5>
                     <p class="text-xs text-slate-500 mt-0.5">${namaSDI}</p>
                  </div>

                  <!-- Kepala MI -->
                  <div class="flex flex-col items-center text-center">
                     <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-800 text-white shadow-sm flex items-center justify-center mb-2 overflow-hidden relative">
                        ${fotoMI ? `<img src="${fotoMI}" alt="Kepala MI" class="w-full h-full object-cover">` : `
                        <div class="w-full h-full flex items-center justify-center text-white text-lg sm:text-xl">
                          <i class="fas fa-user-tie"></i>
                        </div>`}
                     </div>
                     <h5 class="font-playfair font-bold text-slate-800 text-xs sm:text-sm">Kepala MI</h5>
                     <p class="text-xs text-slate-500 mt-0.5">${namaMI}</p>
                  </div>

                  <!-- Kepala MTs -->
                  <div class="flex flex-col items-center text-center">
                     <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-800 text-white shadow-sm flex items-center justify-center mb-2 overflow-hidden relative">
                        ${fotoMTs ? `<img src="${fotoMTs}" alt="Kepala MTs" class="w-full h-full object-cover">` : `
                        <div class="w-full h-full flex items-center justify-center text-white text-lg sm:text-xl">
                          <i class="fas fa-user-tie"></i>
                        </div>`}
                     </div>
                     <h5 class="font-playfair font-bold text-slate-800 text-xs sm:text-sm">Kepala MTs</h5>
                     <p class="text-xs text-slate-500 mt-0.5">${namaMTs}</p>
                  </div>

                  <!-- Kepala MA -->
                  <div class="flex flex-col items-center text-center">
                     <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-800 text-white shadow-sm flex items-center justify-center mb-2 overflow-hidden relative">
                        ${fotoMA ? `<img src="${fotoMA}" alt="Kepala MA" class="w-full h-full object-cover">` : `
                        <div class="w-full h-full flex items-center justify-center text-white text-lg sm:text-xl">
                          <i class="fas fa-user-tie"></i>
                        </div>`}
                     </div>
                     <h5 class="font-playfair font-bold text-slate-800 text-xs sm:text-sm">Kepala MA</h5>
                     <p class="text-xs text-slate-500 mt-0.5">${namaMA}</p>
                  </div>

                  <!-- Mudir Ponpes -->
                  <div class="flex flex-col items-center text-center">
                     <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-800 text-white shadow-sm flex items-center justify-center mb-2 overflow-hidden relative">
                        ${fotoMudir ? `<img src="${fotoMudir}" alt="Mudir Ponpes" class="w-full h-full object-cover">` : `
                        <div class="w-full h-full flex items-center justify-center text-white text-lg sm:text-xl">
                          <i class="fas fa-user-tie"></i>
                        </div>`}
                     </div>
                     <h5 class="font-playfair font-bold text-slate-800 text-xs sm:text-sm">Mudir Ponpes</h5>
                     <p class="text-xs text-slate-500 mt-0.5">${namaMudir}</p>
                  </div>

               </div>
            </div>

          </div>
        </div>
      </div>
    `;
};
