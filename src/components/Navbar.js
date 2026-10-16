export const renderNavbar = () => {
    return `
      <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-2 md:py-3">
            <div class="flex items-center">
              <a href="/" data-navigo class="flex-shrink-0 flex items-center">
                <img class="h-16 md:h-24 w-auto mr-3 md:mr-4 object-contain" src="/logo.png" alt="Logo Yayasan Nahjul Huda">
                <span class="font-playfair font-bold text-lg sm:text-xl md:text-2xl text-emerald-800 leading-tight">Yayasan Nahjul Huda</span>
              </a>
            </div>
            <div class="hidden md:flex items-center space-x-4 lg:space-x-8">
              <a href="/" data-navigo class="text-slate-600 hover:text-green-700 font-medium transition-colors duration-300">Beranda</a>
              <a href="/profil" data-navigo class="text-slate-600 hover:text-green-700 font-medium transition-colors duration-300">Profil</a>
              <a href="/program" data-navigo class="text-slate-600 hover:text-green-700 font-medium transition-colors duration-300">Program</a>
              <a href="/fasilitas" data-navigo class="text-slate-600 hover:text-green-700 font-medium transition-colors duration-300">Fasilitas</a>
              <a href="/berita" data-navigo class="text-slate-600 hover:text-green-700 font-medium transition-colors duration-300">Berita</a>
              <a href="/galeri" data-navigo class="text-slate-600 hover:text-green-700 font-medium transition-colors duration-300">Galeri</a>
              <a href="/kontak" data-navigo class="text-slate-600 hover:text-green-700 font-medium transition-colors duration-300">Kontak</a>
              <a href="/ppdb" data-navigo class="bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-300 text-white px-5 py-2 rounded-full font-semibold shadow-sm inline-block transform">Info PPDB</a>
            </div>
            <div class="-mr-2 flex items-center md:hidden">
              <button onclick="toggleMobileMenu()" type="button" class="bg-white inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none">
                <i class="fas fa-bars text-2xl"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Mobile menu -->
        <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-slate-100 shadow-lg absolute w-full">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" data-navigo class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-green-700 hover:bg-slate-50 transition-colors duration-300">Beranda</a>
            <a href="/profil" data-navigo class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-green-700 hover:bg-slate-50 transition-colors duration-300">Profil</a>
            <a href="/program" data-navigo class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-green-700 hover:bg-slate-50 transition-colors duration-300">Program</a>
            <a href="/fasilitas" data-navigo class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-green-700 hover:bg-slate-50 transition-colors duration-300">Fasilitas</a>
            <a href="/berita" data-navigo class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-green-700 hover:bg-slate-50 transition-colors duration-300">Berita</a>
            <a href="/galeri" data-navigo class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-green-700 hover:bg-slate-50 transition-colors duration-300">Galeri</a>
            <a href="/kontak" data-navigo class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-green-700 hover:bg-slate-50 transition-colors duration-300">Kontak</a>
            <a href="/ppdb" data-navigo class="block px-3 py-2 rounded-md text-base font-bold text-white bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-300 text-center">Info PPDB</a>
          </div>
        </div>
      </nav>
    `;
};
