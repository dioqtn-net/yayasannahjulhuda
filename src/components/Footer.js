export const renderFooter = (contact = null) => {
    const nama = contact?.foundation_name || 'Yayasan Nahjul Huda';
    const alamat = contact?.address || 'Jl. J No.67G / Jl. HH Gg. 1 No. 63, RT.008/RW.001, Kebon Jeruk, Jakarta Barat 11530';
    const telp = contact?.phone || contact?.whatsapp1 || '+6281234567890';
    const email = contact?.email || 'nahjulhuda74@gmail.com';

    return `
      <footer class="bg-emerald-900 text-emerald-100 pt-12 pb-8 border-t-4 border-gold-500">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <!-- Container Flex Horizontal untuk Logo dan Judul -->
              <div class="flex items-center gap-4 mb-4">
                <!-- Logo sangat kecil dengan kotak putih (Kembali ke desain awal) -->
                <div class="bg-white p-1.5 rounded-lg flex-shrink-0">
                  <img src="assets/images/logo.png" onerror="this.onerror=null;this.src='/logo.png';" alt="Logo ${nama}" class="w-10 h-10 object-contain">
                </div>
                <!-- Judul Yayasan -->
                <h2 class="text-2xl font-bold font-serif text-white m-0">${nama}</h2>
              </div>
              <p class="text-emerald-200 text-sm mb-4 max-w-md">Mencetak generasi unggul, berakhlak mulia, dan berwawasan global berlandaskan nilai-nilai Islam.</p>
              <div class="flex items-center">
                <a href="https://www.instagram.com/nahda_media?mdxt=cHRvN2dvNjUxNW05" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-emerald-200 hover:text-yellow-400 transition-colors">
                  <i class="fab fa-instagram text-lg"></i>
                  <span class="text-sm font-medium">@nahda_media</span>
                </a>
              </div>
            </div>
            
            <div>
              <h3 class="font-playfair font-bold text-lg text-white mb-4">Kontak Kami</h3>
              <ul class="space-y-3 text-sm">
                <li class="flex items-start">
                  <i class="fas fa-map-marker-alt mt-1 mr-3 text-gold-500"></i>
                  <span id="pubFooterAddress">${alamat}</span>
                </li>
                <li class="flex items-start">
                  <span class="mr-3 mt-1 text-orange-400">
                    <i class="fas fa-phone-alt"></i>
                  </span>
                  <div>
                    <p class="text-gray-300">Telepon: <span id="pubFooterPhone" class="font-semibold text-white">${telp}</span></p>
                  </div>
                </li>
                <li class="flex items-center">
                  <i class="fas fa-envelope mr-3 text-gold-500"></i>
                  <a id="pubFooterEmail" href="mailto:${email}" class="hover:text-gold-400 transition">${email}</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="border-t border-emerald-800 pt-8 mt-8 text-center text-sm text-emerald-400">
            <p>&copy; ${new Date().getFullYear()} ${nama}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
};
