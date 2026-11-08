export const renderNavbar = (active = '') => {
    const activeClass = 'text-green-800 font-bold border-b-2 border-green-600 pb-1';
    const inactiveClass = 'text-gray-600 font-medium hover:text-green-600 transition-colors border-b-2 border-transparent';

    const getLinkClass = (page) => active === page ? activeClass : inactiveClass;

    const getMobileLinkClass = (page) => active === page 
        ? 'block px-3 py-2 rounded-md text-base font-bold text-green-800 bg-green-50' 
        : 'block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-green-600 hover:bg-slate-50 transition-colors duration-300';

    const ppdbBtnClass = active === 'ppdb'
        ? 'bg-orange-600 ring-2 ring-orange-300 ring-offset-2 shadow-inner text-white px-5 py-2 rounded-full font-bold inline-block transform transition-all duration-300'
        : 'bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-300 text-white px-5 py-2 rounded-full font-semibold shadow-sm inline-block transform';

    const mobilePpdbBtnClass = active === 'ppdb'
        ? 'block px-3 py-2 rounded-md text-base font-bold text-white bg-orange-600 ring-2 ring-orange-300 ring-offset-2 shadow-inner text-center'
        : 'block px-3 py-2 rounded-md text-base font-bold text-white bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-300 text-center';

    return `
      <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-2 md:py-3">
            <div class="flex items-center">
              <a href="/" class="flex-shrink-0 flex items-center">
                <img class="h-16 md:h-24 w-auto mr-3 md:mr-4 object-contain flex-shrink-0" src="/logo.png" alt="Logo Yayasan Nahjul Huda">
                <span class="font-playfair font-bold text-lg sm:text-xl md:text-2xl text-emerald-800 leading-tight">Yayasan Nahjul Huda</span>
              </a>
            </div>
            <div class="hidden md:flex items-center space-x-4 lg:space-x-8">
              <a href="/" class="${getLinkClass('beranda')}">Beranda</a>
              <a href="/profil" class="${getLinkClass('profil')}">Profil</a>
              <a href="/program" class="${getLinkClass('program')}">Program</a>
              <a href="/fasilitas" class="${getLinkClass('fasilitas')}">Fasilitas</a>
              <a href="/berita" class="${getLinkClass('berita')}">Berita</a>
              <a href="/galeri" class="${getLinkClass('galeri')}">Galeri</a>
              <a href="/kontak" class="${getLinkClass('kontak')}">Kontak</a>
              <a href="/ppdb" class="${ppdbBtnClass}">Info PPDB</a>
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
            <a href="/" class="${getMobileLinkClass('beranda')}">Beranda</a>
            <a href="/profil" class="${getMobileLinkClass('profil')}">Profil</a>
            <a href="/program" class="${getMobileLinkClass('program')}">Program</a>
            <a href="/fasilitas" class="${getMobileLinkClass('fasilitas')}">Fasilitas</a>
            <a href="/berita" class="${getMobileLinkClass('berita')}">Berita</a>
            <a href="/galeri" class="${getMobileLinkClass('galeri')}">Galeri</a>
            <a href="/kontak" class="${getMobileLinkClass('kontak')}">Kontak</a>
            <a href="/ppdb" class="${mobilePpdbBtnClass}">Info PPDB</a>
          </div>
        </div>
      </nav>
    `;
};
