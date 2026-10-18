export const renderContact = (profile) => {
    return `
      <!-- Header Kontak -->
      <section class="relative bg-[url('/images/wallpaper_yayasan.jpg')] bg-cover bg-center bg-no-repeat text-white py-20 overflow-hidden">
        <!-- Dark Overlay Wrapper -->
        <div class="absolute inset-0 bg-black/70 z-0"></div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-4xl md:text-5xl font-playfair font-bold mb-4 text-gold-400 drop-shadow-md">Kontak & Lokasi</h1>
          <div class="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-4"></div>
          <p class="text-white text-lg max-w-2xl mx-auto drop-shadow leading-relaxed">Silakan hubungi kami atau kunjungi langsung kampus Yayasan Nahjul Huda.</p>
        </div>
      </section>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Info Kontak -->
            <div>
                <h2 class="text-3xl font-playfair font-bold text-emerald-800 mb-8">Informasi Kontak</h2>
                
                <div class="space-y-6">
                    <div class="flex items-start">
                        <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <i class="fas fa-map-marker-alt text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-bold text-slate-800">Alamat Lengkap</h4>
                            <p class="text-slate-600 leading-relaxed">${profile.address}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <i class="fas fa-phone-alt text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-bold text-slate-800 mb-2">Nomor Telepon & WhatsApp</h4>
                            <div class="space-y-2 text-slate-600">
                                <div>
                                    <span class="font-semibold text-slate-800">Telepon Yayasan:</span>
                                    <a href="tel:02153654830" class="hover:text-emerald-700 font-medium transition ml-1">(021) 53654830</a>
                                </div>
                                <div class="flex items-center">
                                    <i class="fab fa-whatsapp text-emerald-600 mr-2 text-lg"></i>
                                    <span class="font-semibold text-slate-800 mr-1.5">WhatsApp:</span>
                                    <a href="https://wa.me/6281234567890" target="_blank" class="hover:text-emerald-700 font-medium transition">+62 812 3456 7890</a>
                                </div>
                            </div>
                            <a href="https://wa.me/6281234567890" target="_blank" class="inline-flex items-center mt-3 text-emerald-600 font-medium hover:text-emerald-700 transition">
                                <i class="fab fa-whatsapp mr-1.5 text-lg"></i> Hubungi via WhatsApp
                            </a>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <i class="fas fa-envelope text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-bold text-slate-800 mb-1">Email Resmi</h4>
                            <p class="text-slate-600 leading-relaxed mt-1">
                                <a href="mailto:nahjulhuda74@gmail.com" class="hover:text-emerald-700 font-medium transition">nahjulhuda74@gmail.com</a>
                            </p>
                            <a href="mailto:nahjulhuda74@gmail.com" class="inline-block mt-2 text-emerald-600 font-medium hover:text-emerald-700 transition">
                                <i class="fas fa-paper-plane mr-1 text-sm"></i> Kirim Email
                            </a>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <i class="far fa-clock text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-bold text-slate-800">Jam Operasional</h4>
                            <p class="text-slate-600 leading-relaxed whitespace-pre-line">${profile.operational_hours}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Maps -->
            <div class="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 h-[400px] lg:h-auto">
                <iframe 
                    src="https://www.google.com/maps?q=Yayasan+Nahjul+Huda+Kebon+Jeruk&output=embed" 
                    width="100%" 
                    height="100%" 
                    style="border:0; border-radius: 12px;" 
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        </div>
      </div>
    `;
};
