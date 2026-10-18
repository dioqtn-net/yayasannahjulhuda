export const renderProfile = (profile) => {
    return `
      <!-- Header Profile -->
      <section class="relative bg-[url('/images/wallpaper_yayasan.jpg')] bg-cover bg-center bg-no-repeat text-white py-20 overflow-hidden">
        <!-- Dark Overlay Wrapper -->
        <div class="absolute inset-0 bg-black/70 z-0"></div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-4xl md:text-5xl font-playfair font-bold mb-4 text-gold-400 drop-shadow-md">Profil Yayasan</h1>
          <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-4"></div>
          <p class="text-white text-lg max-w-2xl mx-auto drop-shadow leading-relaxed">Mengenal lebih dekat sejarah, visi, misi, dan struktur kepengurusan Yayasan Nahjul Huda.</p>
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
              <p>${profile.history.replace(/\n/g, '<br>')}</p>
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
        <div class="text-center">
          <h2 class="text-3xl font-playfair font-bold text-emerald-800 mb-4">Struktur Organisasi</h2>
          <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-12"></div>
          
          <div class="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <p class="text-slate-600 italic mb-8">Struktur kepengurusan Yayasan Nahjul Huda berdedikasi tinggi untuk memajukan lembaga tercinta.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-6 border border-slate-100 rounded-xl bg-slate-50">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  <i class="fas fa-user-tie"></i>
                </div>
                <h4 class="font-bold text-slate-800">Ketua Yayasan</h4>
                <p class="text-sm text-slate-500">Pengurus Utama</p>
              </div>
              <div class="p-6 border border-slate-100 rounded-xl bg-slate-50">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  <i class="fas fa-user-tie"></i>
                </div>
                <h4 class="font-bold text-slate-800">Sekretaris Yayasan</h4>
                <p class="text-sm text-slate-500">Administrasi & Kesekretariatan</p>
              </div>
              <div class="p-6 border border-slate-100 rounded-xl bg-slate-50">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  <i class="fas fa-user-tie"></i>
                </div>
                <h4 class="font-bold text-slate-800">Bendahara Yayasan</h4>
                <p class="text-sm text-slate-500">Keuangan & Aset</p>
              </div>
            </div>
            
            <div class="mt-8 pt-8 border-t border-slate-100">
               <h4 class="font-bold text-slate-800 mb-4 text-lg">Kepala Unit Pendidikan</h4>
               <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div class="text-sm bg-white border border-slate-200 p-3 rounded-lg">Kepala SDI</div>
                  <div class="text-sm bg-white border border-slate-200 p-3 rounded-lg">Kepala MI</div>
                  <div class="text-sm bg-white border border-slate-200 p-3 rounded-lg">Kepala MTs</div>
                  <div class="text-sm bg-white border border-slate-200 p-3 rounded-lg">Kepala MA</div>
                  <div class="text-sm bg-white border border-slate-200 p-3 rounded-lg">Mudir Ponpes</div>
               </div>
            </div>

          </div>
        </div>
      </div>
    `;
};
