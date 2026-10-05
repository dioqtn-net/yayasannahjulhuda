export const renderContact = (profile) => {
    return `
      <!-- Header Kontak -->
      <div class="bg-emerald-800 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-4xl md:text-5xl font-playfair font-bold mb-4 text-gold-400">Kontak & Lokasi</h1>
          <p class="text-emerald-100 text-lg max-w-2xl mx-auto">Silakan hubungi kami atau kunjungi langsung kampus Yayasan Nahjul Huda.</p>
        </div>
      </div>

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
                            <h4 class="text-lg font-bold text-slate-800">Nomor Telepon / WhatsApp</h4>
                            <p class="text-slate-600 leading-relaxed">${profile.phone}</p>
                            <a href="https://wa.me/${(profile.phone||'').replace(/\D/g,'')}" target="_blank" class="inline-block mt-2 text-emerald-600 font-medium hover:text-emerald-700 transition"><i class="fab fa-whatsapp mr-1"></i> Hubungi via WhatsApp</a>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <i class="fas fa-envelope text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-bold text-slate-800">Email Resmi</h4>
                            <p class="text-slate-600 leading-relaxed">${profile.email}</p>
                            <a href="mailto:${profile.email}" class="inline-block mt-2 text-emerald-600 font-medium hover:text-emerald-700 transition">Kirim Email</a>
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
