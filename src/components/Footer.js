export const renderFooter = () => {
    return `
      <footer class="bg-emerald-900 text-emerald-100 pt-12 pb-8 border-t-4 border-gold-500">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div class="flex items-center mb-4">
                <img src="/logo.png" alt="Logo" class="h-10 w-auto mr-3 bg-white p-1 rounded">
                <span class="font-playfair font-bold text-xl text-white">Yayasan Nahjul Huda</span>
              </div>
              <p class="text-emerald-200 text-sm mb-4">Mencetak generasi unggul, berakhlak mulia, dan berwawasan global berlandaskan nilai-nilai Islam.</p>
              <div class="flex items-center">
                <a href="https://www.instagram.com/nahda_media?mdxt=cHRvN2dvNjUxNW05" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-emerald-200 hover:text-yellow-400 transition-colors">
                  <i class="fab fa-instagram text-lg"></i>
                  <span class="text-sm font-medium">@nahda_media</span>
                </a>
              </div>
            </div>
            
            <div>
              <h3 class="font-playfair font-bold text-lg text-white mb-4">Tautan Cepat</h3>
              <ul class="space-y-2 text-sm">
                <li><a href="/profil" data-navigo class="hover:text-gold-400 transition">Profil Yayasan</a></li>
                <li><a href="/program" data-navigo class="hover:text-gold-400 transition">Program Pendidikan</a></li>
                <li><a href="/ppdb" data-navigo class="hover:text-gold-400 transition">Informasi PPDB</a></li>
                <li><a href="/berita" data-navigo class="hover:text-gold-400 transition">Berita & Pengumuman</a></li>
                <li><a href="/galeri" data-navigo class="hover:text-gold-400 transition">Galeri Kegiatan</a></li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-playfair font-bold text-lg text-white mb-4">Kontak Kami</h3>
              <ul class="space-y-3 text-sm">
                <li class="flex items-start">
                  <i class="fas fa-map-marker-alt mt-1 mr-3 text-gold-500"></i>
                  <span>Jl. J No.67G / Jl. HH Gg. 1 No. 63, RT.008/RW.001, Kebon Jeruk, Jakarta Barat 11530</span>
                </li>
                <li class="flex items-start">
                  <span class="mr-3 mt-1 text-orange-400">
                    <i class="fas fa-phone-alt"></i>
                  </span>
                  <div>
                    <p class="text-gray-300">Telepon: <span class="font-semibold text-white">(021) 53654830</span></p>
                  </div>
                </li>
                <li class="flex items-center">
                  <i class="fas fa-envelope mr-3 text-gold-500"></i>
                  <a href="mailto:nahjulhuda74@gmail.com" class="hover:text-gold-400 transition">nahjulhuda74@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="border-t border-emerald-800 pt-8 mt-8 text-center text-sm text-emerald-400">
            <p>&copy; ${new Date().getFullYear()} Yayasan Nahjul Huda. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
};
