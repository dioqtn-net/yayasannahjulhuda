function formatContentHtml(str) {
  if (str === null || str === undefined) return '-';
  const trimmed = String(str).trim();
  if (trimmed === '' || trimmed === '-') return '-';
  if (/^<div[\s>]/i.test(trimmed) || /^<p[\s>]/i.test(trimmed)) {
    return trimmed;
  }
  return `<div class="text-justify">${trimmed}</div>`;
}

export const unitModalMetadata = {
  1: { key: 'sdi', name: 'SD Islam (SDI) AL KINDY', short: 'SDI', logo: '/media/logo/SDI.jpg', anchor: 'program-sdi' },
  2: { key: 'mi', name: 'Madrasah Ibtidaiyah (MI) Nahjul Huda', short: 'MI', logo: '/media/logo/MI.jpg', anchor: 'program-mi' },
  3: { key: 'mts', name: 'Madrasah Tsanawiyah (MTs) Nahjul Huda', short: 'MTs', logo: '/media/logo/MTs.jpg', anchor: 'program-mts' },
  4: { key: 'ma', name: 'Madrasah Aliyah (MA) Nahjul Huda', short: 'MA', logo: '/media/logo/MA.jpg', anchor: 'program-ma' },
  5: { key: 'ponpes', name: 'Pondok Pesantren Assurur', short: 'Ponpes', logo: '/media/logo/Ponpes.jpg', anchor: 'program-ponpes' }
};

export const defaultUnitProgramData = {
  sdi: {
    akreditasi: 'Akreditasi -',
    desc: "Pendidikan dasar berciri khas Islam yang berfokus pada pembentukan karakter Qur'ani dan keunggulan akademik.",
    kurikulum: 'Kurikulum Merdeka & Kurikulum Kemenag',
    unggulan: "Qira'ati, Tahfidz Al-Qur'an (Juz 30), dan KTIQ.",
    ekskul: 'Pramuka, Futsal, Tari',
    fasilitas: 'Ruang AC, CCTV, Kantin, Lapangan Olahraga, Laboratorium Komputer',
    visi: "Terwujudnya Generasi Qur'ani yang Berakhlak Mulia, Berkarakter, Kreatif, Berprestasi, Mampu Berkompetisi, Serta Mandiri Melalui Pembelajaran Mendalam di Era Global.",
    misi: "Menanamkan nilai-nilai keimanan dan ketakwaan melalui pembiasaan ibadah dan penguatan karakter Islami dalam kehidupan sehari-hari.\nMengintegrasikan pembelajaran Al-Qur'an dalam kegiatan intrakurikuler dan kokurikuler.\nMenerapkan Kurikulum Merdeka yang berpusat pada peserta didik dengan pendekatan pembelajaran mendalam (deep learning).\nMengembangkan kemampuan berpikir kritis, kreatif, kolaboratif, dan komunikatif melalui kegiatan pembelajaran yang bermakna.\nMenciptakan lingkungan belajar yang aman, nyaman, inklusif, dan menyenangkan.\nMendorong peserta didik untuk selalu berakhlak baik, berprestasi, mandiri, bertanggung jawab, serta memiliki kepedulian sosial dan lingkungan."
  },
  mi: {
    akreditasi: 'Akreditasi -',
    desc: 'Mencetak siswa-siswi berprestasi dengan pemahaman agama yang mendalam.',
    kurikulum: 'Kedinasan : Kementerian Pendidikan / Kemenag',
    unggulan: "Qira'atul Qur'an Metode Qiroati, Keterampilan Kemandirian, Prestasi Akademik & Non Akademik",
    ekskul: 'Futsal, Menari, Pramuka',
    fasilitas: 'Lapangan Upacara, Lapangan Olahraga, Lab Komputer, Musholla, Toilet, Kantin, Perpustakaan',
    visi: 'Mewujudkan Generasi Muslim yang Berakhlakul Karimah, Unggul dalam Prestasi, dan Berwawasan Lingkungan.',
    misi: "Menyelenggarakan pendidikan dasar Islam terpadu yang berkualitas.\nMenumbuhkan penghayatan dan pengamalan ajaran Islam dalam kehidupan sehari-hari.\nMengembangkan potensi akademik dan non-akademik siswa secara optimal."
  },
  mts: {
    akreditasi: 'Akreditasi A',
    desc: 'Pendidikan menengah pertama dengan penekanan pada akhlak dan ilmu pengetahuan.',
    kurikulum: 'Kurikulum Merdeka & Kemenag',
    unggulan: "Tahfidz Al-Qur'an, Pembinaan Bahasa Arab & Inggris, Kajian Kitab Dasar",
    ekskul: 'Pramuka, Hadroh, Drumband, Tari Saman, Futsal, Muhadoroh',
    fasilitas: 'Ruang Kelas AC, Lapangan Olahraga, Lapangan Futsal, Laboratorium Komputer, Ruang Asrama, Mushola, Kantin, Kamar Mandi Bersih',
    visi: 'Terwujudnya Generasi yang Berilmu, Beriman, Berakhlak Mulia, dan Mandiri.',
    misi: "Terwujudnya Al-Qur'an, Ilmiah, Cerdas, Sehat, Mandiri, Berakhlak\nMembentuk generasi yang berilmu, beriman, dan berakhlak mulia\nMengembangkan kemampuan & budi pekerti\nBerwawasan Luas\nMencetak Generasi Global",
    email: 'mtsnahjulhuda@yahoo.co.id',
    telp: '(021) 53654830'
  },
  ma: {
    akreditasi: 'Akreditasi -',
    desc: 'Mempersiapkan generasi muda untuk pendidikan tinggi dan kehidupan bermasyarakat.',
    kurikulum: 'Kurikulum Kemenag & Nasional',
    unggulan: "Karya Ilmiah Remaja, Persiapan Masuk Perguruan Tinggi Negeri (PTN/PTKIN), Tahfidz Qur'an",
    ekskul: 'Pramuka, Hadroh, Drumband, Tari Saman, Futsal, Muhadoroh',
    fasilitas: 'Ruang Kelas AC, Lapangan Olahraga, Lapangan Futsal, Laboratorium Komputer, Ruang Asrama, Mushola, Kantin, Kamar Mandi Bersih',
    visi: 'Mencetak Generasi Pemimpin Masa Depan yang Berwawasan Luas, Berilmu Tinggi, dan Berintegritas Islami.',
    misi: "Terwujudnya Al-Qur'an, Ilmiah, Cerdas, Sehat, Mandiri, Berakhlak\nMembentuk generasi yang berilmu, beriman, dan berakhlak mulia\nMengembangkan kemampuan & budi pekerti\nBerwawasan Luas\nMencetak Generasi Global"
  },
  ponpes: {
    akreditasi: 'Akreditasi -',
    desc: 'Pendidikan asrama 24 jam dengan kajian kitab kuning, tahfidz, dan program unggulan.',
    kurikulum: 'Salafiyah & Modern',
    unggulan: "Bahasa Arab, Bahasa Inggris, Metode Qiroati, Tahfidzul Qur'an, Kitab Kuning, Multimedia, Leadership Kulliyatul Muallimin Al-Islamiyyah",
    ekskul: 'Muhadharah, Bahtsul Masail, Seni Hadroh, Olahraga Santri',
    fasilitas: 'Asrama Putra/Putri, Masjid As-Surur, Perpustakaan Kitab, Dapur Santri, Ruang Kajian',
    visi: '"Mendidik Santri Beriman, Bertaqwa, Berakhlak Mulia, Berilmu, Beribadah Bermanfaat Ahlus Sunah Wal Jama\'ah (ASWAJA)"',
    misi: "Penanaman Aqidah Sholihah\nBimbingan Ibadah Sesuai Al Qur'an & Hadits\nMembentuk Pribadi Berakhlak Mulia, Kreatif, Cerdas, Inovatif, Mandiri, Bertanggung Jawab, dan Ketrampilan Abad 21\nMengaplikasikan Ilmu Agama dengan diimbangi aplikasi Teknologi Informasi"
  }
};

export async function renderDynamicUnitModal(id) {
  let numId = Number(id);
  let key = 'sdi';
  if (numId >= 1 && numId <= 5) {
    key = unitModalMetadata[numId].key;
  } else if (typeof id === 'string') {
    const found = Object.entries(unitModalMetadata).find(([k, v]) => v.key === id.toLowerCase());
    if (found) {
      numId = Number(found[0]);
      key = found[1].key;
    }
  }

  const meta = unitModalMetadata[numId] || unitModalMetadata[1];
  const defaults = defaultUnitProgramData[key] || defaultUnitProgramData.sdi;

  let cmsProg = {};
  let cmsPPDB = (typeof window !== 'undefined' && window.currentPPDBData) ? window.currentPPDBData : {};
  let cmsContact = (typeof window !== 'undefined' && window.currentContactData) ? window.currentContactData : {};

  const desc = cmsProg[key + 'Desc'] || defaults.desc || '-';
  const kurikulum = cmsProg[key + 'Kurikulum'] || defaults.kurikulum || '-';
  const unggulan = cmsProg[key + 'Unggulan'] || defaults.unggulan || '-';
  const ekskul = cmsProg[key + 'Ekskul'] || defaults.ekskul || '-';
  const fasilitas = cmsProg[key + 'Fasilitas'] || defaults.fasilitas || '-';
  const visi = cmsProg[key + 'Visi'] || defaults.visi || '-';
  const misi = cmsProg[key + 'Misi'] || defaults.misi || '-';
  let akreditasi = cmsProg[key + 'Akreditasi'] || defaults.akreditasi || '-';
  if (akreditasi && !akreditasi.toLowerCase().startsWith('akreditasi') && akreditasi !== '-') {
    akreditasi = 'Akreditasi ' + akreditasi;
  }

  // Update title & akreditasi badge if elements exist
  const elTitle = document.getElementById(`modal-title-${numId}`);
  if (elTitle) elTitle.textContent = meta.name;
  const elAkreditasi = document.getElementById(`modal-akreditasi-${numId}`);
  if (elAkreditasi) elAkreditasi.textContent = akreditasi;

  const modalBody = document.getElementById(`modal-body-${numId}`) || 
                    (document.getElementById(`modal-${numId}`) ? document.getElementById(`modal-${numId}`).querySelector('.overflow-y-auto') : null);

  if (modalBody) {
    modalBody.innerHTML = '';
    const escapeHtml = (str) => {
      if (!str) return '';
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    };

    let cleanMisi = misi || '';
    if (cleanMisi.trim().startsWith('<div')) {
      const temp = document.createElement('div');
      temp.innerHTML = cleanMisi;
      const wrapper = temp.firstElementChild;
      if (wrapper && wrapper.tagName === 'DIV') {
        cleanMisi = wrapper.innerHTML;
      }
    }

    const linesMisi = cleanMisi
      .split('\n')
      .map(l => l.trim().replace(/^[-*•\d.]+\s*/, ''))
      .filter(l => l.length > 0 && l !== '-');

    const misiHTML = linesMisi.length > 0
      ? `<ol class="list-decimal ml-5 space-y-1.5 text-sm text-slate-600 leading-relaxed">${linesMisi.map(m => `<li>${escapeHtml(m)}</li>`).join('')}</ol>`
      : '<p class="text-sm text-slate-500 italic">-</p>';

    modalBody.innerHTML = `
      <div class="w-full h-48 sm:h-64 mb-6 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-4 shadow-sm">
        <img src="${meta.logo}" alt="${escapeHtml(meta.name)}" class="object-contain max-h-full w-auto max-w-full h-auto">
      </div>

      <div class="text-slate-700 mb-6 leading-relaxed">${desc}</div>

      <div class="mb-4">
        <h4 class="font-bold text-emerald-700 mb-1.5 flex items-center"><i class="fas fa-book-reader mr-2 text-gold-500"></i> Kurikulum</h4>
        <div class="text-slate-600 text-sm leading-relaxed">${kurikulum}</div>
      </div>

      ${unggulan && unggulan !== '-' ? `
      <div class="mb-4">
        <h4 class="font-bold text-emerald-700 mb-1.5 flex items-center"><i class="fas fa-star mr-2 text-gold-500"></i> Program Unggulan</h4>
        <div class="text-slate-600 text-sm leading-relaxed">${unggulan}</div>
      </div>
      ` : ''}

      <div class="mb-4">
        <h4 class="font-bold text-emerald-700 mb-1.5 flex items-center"><i class="fas fa-running mr-2 text-gold-500"></i> Ekstrakurikuler</h4>
        <div class="text-slate-600 text-sm leading-relaxed">${ekskul}</div>
      </div>

      <div class="mb-4">
        <h4 class="font-bold text-emerald-700 mb-1.5 flex items-center"><i class="fas fa-building mr-2 text-gold-500"></i> Fasilitas</h4>
        <div class="text-slate-600 text-sm leading-relaxed">${fasilitas}</div>
      </div>

      <div class="mb-4 p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-200/80">
        <h4 class="font-bold text-emerald-800 mb-2 flex items-center"><i class="fas fa-bullseye mr-2 text-gold-500"></i> Visi &amp; Misi</h4>
        <div class="mb-3">
          <span class="font-semibold text-emerald-800 text-xs uppercase tracking-wider block mb-1">Visi:</span>
          <div class="italic text-slate-700 text-sm leading-relaxed">${visi}</div>
        </div>
        <div>
          <span class="font-semibold text-emerald-800 text-xs uppercase tracking-wider block mb-1">Misi:</span>
          ${misiHTML}
        </div>
      </div>
    `;
  }
}

