export const renderNavbar = () => {
    return `
      <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-20">
            <div class="flex items-center">
              <a href="/" data-navigo class="flex-shrink-0 flex items-center">
                <img class="h-12 w-auto mr-3" src="/logo.png" alt="Logo Yayasan Nahjul Huda">
                <span class="font-playfair font-bold text-xl text-emerald-800">Yayasan Nahjul Huda</span>
              </a>
            </div>
            <div class="hidden md:flex items-center space-x-8">
              <a href="/" data-navigo class="text-slate-600 hover:text-emerald-600 font-medium transition">Beranda</a>
              <a href="/profil" data-navigo class="text-slate-600 hover:text-emerald-600 font-medium transition">Profil</a>
              <a href="/program" data-navigo class="text-slate-600 hover:text-emerald-600 font-medium transition">Program</a>
              <a href="/fasilitas" data-navigo class="text-slate-600 hover:text-emerald-600 font-medium transition">Fasilitas</a>
              <a href="/berita" data-navigo class="text-slate-600 hover:text-emerald-600 font-medium transition">Berita</a>
              <a href="/galeri" data-navigo class="text-slate-600 hover:text-emerald-600 font-medium transition">Galeri</a>
              <a href="/kontak" data-navigo class="text-slate-600 hover:text-emerald-600 font-medium transition">Kontak</a>
              <a href="/ppdb" data-navigo class="bg-gold-500 hover:bg-gold-600 text-white px-5 py-2 rounded-full font-semibold transition shadow-sm">Info PPDB</a>
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
            <a href="/" data-navigo class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50">Beranda</a>
            <a href="/profil" data-navigo class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50">Profil</a>
            <a href="/program" data-navigo class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50">Program</a>
            <a href="/fasilitas" data-navigo class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50">Fasilitas</a>
            <a href="/berita" data-navigo class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50">Berita</a>
            <a href="/galeri" data-navigo class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50">Galeri</a>
            <a href="/kontak" data-navigo class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50">Kontak</a>
            <a href="/ppdb" data-navigo class="block px-3 py-2 rounded-md text-base font-bold text-emerald-700 hover:text-emerald-800 hover:bg-slate-50">Info PPDB</a>
          </div>
        </div>
      </nav>
    `;
};
