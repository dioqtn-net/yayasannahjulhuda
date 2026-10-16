export const renderPPDB = (ppdb) => {
    const isBuka = ppdb?.status === 'BUKA';

    return `
      <!-- Header PPDB -->
      <div class="bg-emerald-800 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span class="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4 ${isBuka ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-red-500 text-white shadow-lg shadow-red-500/30'}">
            STATUS PENDAFTARAN: ${ppdb?.status || 'TUTUP'}
          </span>
          <h1 class="text-4xl md:text-5xl font-playfair font-bold mb-4 text-gold-400">Penerimaan Peserta Didik Baru</h1>
          <p class="text-emerald-100 text-xl font-bold">Tahun Ajaran ${ppdb?.academic_year || '2024/2025'}</p>
        </div>
      </div>

      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-800">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <!-- Jadwal -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition">
                <div class="w-12 h-12 bg-gold-100 text-gold-600 rounded-xl flex items-center justify-center text-xl mb-4">
                    <i class="far fa-calendar-alt"></i>
                </div>
                <h3 class="text-2xl font-playfair font-bold text-emerald-800 mb-4">Jadwal Pendaftaran</h3>
                <div class="text-slate-600 whitespace-pre-line leading-relaxed">
                    ${ppdb?.schedule || '-'}
                </div>
            </div>

            <!-- Syarat -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition">
                <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-4">
                    <i class="fas fa-file-alt"></i>
                </div>
                <h3 class="text-2xl font-playfair font-bold text-emerald-800 mb-4">Persyaratan Dokumen</h3>
                <div class="text-slate-600 whitespace-pre-line leading-relaxed">
                    ${ppdb?.requirements || '-'}
                </div>
            </div>
            
            <!-- Alur -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition md:col-span-2">
                <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-4">
                    <i class="fas fa-route"></i>
                </div>
                <h3 class="text-2xl font-playfair font-bold text-emerald-800 mb-4">Alur Pendaftaran</h3>
                <div class="text-slate-600 whitespace-pre-line leading-relaxed">
                    ${ppdb?.flow || '-'}
                </div>
            </div>

            <!-- Biaya -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition md:col-span-2">
                <div class="w-12 h-12 bg-gold-100 text-gold-600 rounded-xl flex items-center justify-center text-xl mb-4">
                    <i class="fas fa-money-bill-wave"></i>
                </div>
                <h3 class="text-2xl font-playfair font-bold text-emerald-800 mb-4">Rincian Biaya Administrasi</h3>
                <div class="text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                    ${ppdb?.fees || 'Hubungi panitia untuk informasi rincian biaya.'}
                </div>
            </div>
        </div>
        
        <!-- Form Cepat -->
        <div class="bg-emerald-900 rounded-3xl overflow-hidden shadow-2xl relative border-4 border-gold-500/20">
            <!-- Background pattern -->
            <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#fbbf24 2px, transparent 2px); background-size: 30px 30px;"></div>
            
            <div class="p-8 md:p-12 relative z-10 text-center max-w-2xl mx-auto">
                <h2 class="text-3xl font-playfair font-bold text-white mb-4">Mulai Pendaftaran Sekarang</h2>
                <p class="text-emerald-100 mb-8">Pilih jenjang yang diminati dan Anda akan diarahkan ke WhatsApp resmi Panitia PPDB Yayasan Nahjul Huda untuk proses selanjutnya.</p>
                
                <form onsubmit="
                    event.preventDefault();
                    const nama = document.getElementById('nama_siswa').value;
                    const jenjang = document.getElementById('jenjang_pilihan').value;
                    if(!nama || !jenjang) return alert('Mohon isi nama dan pilih jenjang!');
                    const waNum = '${(ppdb?.wa_number || '+6281234567890').replace(/\D/g,'')}';
                    const text = encodeURIComponent('Assalamu\\'alaikum. Saya ingin mendaftar PPDB Yayasan Nahjul Huda.\\n\\nNama Siswa: ' + nama + '\\nJenjang Pilihan: ' + jenjang + '\\n\\nMohon informasi pendaftaran selengkapnya. Terima kasih.');
                    window.open('https://wa.me/' + waNum + '?text=' + text, '_blank');
                " class="space-y-4">
                    <input type="text" id="nama_siswa" placeholder="Nama Lengkap Calon Siswa/Santri" required class="w-full px-5 py-4 rounded-xl bg-white border-0 text-slate-800 focus:ring-2 focus:ring-gold-500 shadow-inner">
                    
                    <div class="relative">
                        <select id="jenjang_pilihan" required class="w-full px-5 py-4 rounded-xl bg-white border-0 text-slate-800 focus:ring-2 focus:ring-gold-500 shadow-inner appearance-none">
                            <option value="" disabled selected>-- Pilih Jenjang Pendidikan --</option>
                            <option value="SD Islam (SDI) AL KINDY">SD Islam (SDI) AL KINDY</option>
                            <option value="MI Nahjul Huda">MI Nahjul Huda</option>
                            <option value="MTs Nahjul Huda">MTs Nahjul Huda</option>
                            <option value="MA Nahjul Huda">MA Nahjul Huda</option>
                            <option value="Pondok Pesantren Assurur">Pondok Pesantren Assurur</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-500">
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                    
                    <button type="submit" class="w-full bg-gold-500 hover:bg-gold-400 text-slate-900 font-bold text-lg py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center mt-4">
                        <i class="fab fa-whatsapp text-2xl mr-3"></i> Daftar / Tanya Panitia via WA
                    </button>
                </form>
            </div>
        </div>

      </div>
    `;
};
