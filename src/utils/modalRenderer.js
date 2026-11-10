function formatContentHtml(str) {
  if (str === null || str === undefined) return '-';
  const trimmed = String(str).trim();
  if (trimmed === '' || trimmed === '-') return '-';
  if (/^<div[\s>]/i.test(trimmed) || /^<p[\s>]/i.test(trimmed)) {
    return trimmed;
  }
  return `<div class="text-justify">${trimmed}</div>`;
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function extractCleanText(str) {
  if (!str) return '';
  const trimmed = String(str).trim();
  if (trimmed === '' || trimmed === '-') return '';
  if (trimmed.startsWith('<div') || trimmed.startsWith('<p')) {
    const temp = document.createElement('div');
    temp.innerHTML = trimmed;
    const first = temp.firstElementChild;
    if (first && (first.tagName === 'DIV' || first.tagName === 'P')) {
      return first.innerHTML.trim();
    }
    return temp.textContent || temp.innerText || trimmed;
  }
  return trimmed;
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
    akreditasi: 'Akreditasi A',
    desc: 'Pendidikan dasar dengan pondasi nilai-nilai keislaman yang kuat.',
    kurikulum: 'Kurikulum Merdeka Terintegrasi Kemenag',
    unggulan: "Qira'ati, Tahfidz Al-Qur'an (Juz 30), dan KTIQ.",
    ekskul: 'Pramuka, Marawis, Tahfidz Qur\'an',
    fasilitas: 'Ruang Kelas Nyaman, Perpustakaan, Lapangan Olahraga',
    visi: '"Terwujudnya Generasi Qur\'ani yang Berakhlak Mulia, Berkarakter, Kreatif, Berprestasi, Mampu Berkompetisi, Serta Mandiri Melalui Pembelajaran Mendalam di Era Global."',
    misi: "Menanamkan nilai-nilai keimanan dan ketakwaan melalui pembiasaan ibadah dan penguatan karakter Islami dalam kehidupan sehari-hari.\nMengintegrasikan pembelajaran Al-Qur'an dalam kegiatan intrakurikuler dan kokurikuler.\nMenerapkan Kurikulum Merdeka yang berpusat pada peserta didik dengan pendekatan pembelajaran mendalam (deep learning).\nMengembangkan kemampuan berpikir kritis, kreatif, kolaboratif, dan komunikatif melalui kegiatan pembelajaran yang bermakna.\nMenciptakan lingkungan belajar yang aman, nyaman, inklusif, dan menyenangkan.\nMendorong peserta didik untuk selalu berakhlak baik, berprestasi, mandiri, bertanggung jawab, serta memiliki kepedulian sosial dan lingkungan."
  },
  mi: {
    akreditasi: 'Akreditasi A',
    desc: 'Mencetak siswa-siswi berprestasi dengan penekanan pada ilmu agama dasar.',
    kurikulum: 'Kurikulum Kemenag',
    unggulan: "Qira'atul Qur'an Metode Qiroati, Keterampilan Kemandirian, Prestasi Akademik & Non Akademik",
    ekskul: 'Pramuka, Qiroah, Futsal',
    fasilitas: 'Lab Komputer, Mushola, Perpustakaan',
    visi: '-',
    misi: '...'
  },
  mts: {
    akreditasi: 'Akreditasi A',
    desc: 'Pendidikan menengah pertama dengan lingkungan yang Islami dan disiplin.',
    kurikulum: 'Kurikulum Merdeka & Kemenag',
    unggulan: '-',
    ekskul: 'Paskibra, PMR, Rohis, Hadroh',
    fasilitas: 'Lab IPA, Lab Bahasa, Sarana Olahraga',
    visi: '-',
    misi: "Terwujudnya Al-Qur'an, Ilmiah, Cerdas, Sehat, Mandiri, Berakhlak\nMembentuk generasi yang berilmu, beriman, dan berakhlak mulia\nMengembangkan kemampuan & budi pekerti\nBerwawasan Luas\nMencetak Generasi Global"
  },
  ma: {
    akreditasi: 'Akreditasi A',
    desc: 'Mempersiapkan generasi unggul menuju jenjang pendidikan tinggi.',
    kurikulum: 'Kurikulum Kemenag (IPA/IPS/Agama)',
    unggulan: '-',
    ekskul: 'Karya Ilmiah Remaja, Jurnalistik, Bahasa Arab & Inggris',
    fasilitas: 'Lab Terpadu, Perpustakaan Digital',
    visi: '-',
    misi: "Terwujudnya Al-Qur'an, Ilmiah, Cerdas, Sehat, Mandiri, Berakhlak\nMembentuk generasi yang berilmu, beriman, dan berakhlak mulia\nMengembangkan kemampuan & budi pekerti\nBerwawasan Luas\nMencetak Generasi Global"
  },
  ponpes: {
    akreditasi: 'Akreditasi A',
    desc: 'Pendidikan asrama 24 jam dengan kajian kitab kuning dan tahfidz.',
    kurikulum: 'Salafiyah, Modern, & Tahfidz',
    unggulan: "Bahasa Arab, Bahasa Inggris, Metode Qiroati, Tahfidzul Qur'an, Kitab Kuning, Multimedia, Leadership Kulliyatul Muallimin Al-Islamiyyah",
    ekskul: 'Muhadharah, Bahtsul Masail, Kaligrafi',
    fasilitas: 'Asrama Putra/Putri, Masjid As-Surur, Ruang Aula',
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

  // 1. Dapatkan data live dari memory cache jika tersedia
  let unitData = null;
  if (typeof window !== 'undefined' && Array.isArray(window.__cachedEducationUnits)) {
    unitData = window.__cachedEducationUnits.find(u => Number(u.id) === numId);
  }

  // 2. Jika belum ada di memory cache, fetch dari Supabase REST API langsung
  if (!unitData) {
    try {
      const SUPABASE_URL = "https://lrorriksjooxrpoihfge.supabase.co";
      const SUPABASE_ANON_KEY = "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";
      const res = await fetch(`${SUPABASE_URL}/rest/v1/education_units?select=*&order=id.asc`, {
        cache: 'no-store',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      if (res.ok) {
        const rows = await res.json();
        if (rows && rows.length > 0) {
          if (typeof window !== 'undefined') window.__cachedEducationUnits = rows;
          unitData = rows.find(u => Number(u.id) === numId);
        }
      }
    } catch (e) {
      console.warn('[renderDynamicUnitModal] Gagal fetch Supabase REST:', e);
    }
  }

  const formatAkreditasi = (val) => {
    if (!val) return 'Akreditasi A';
    const clean = String(val).trim();
    if (clean.toLowerCase().startsWith('akreditasi')) return clean;
    if (clean === '-' || clean === '') return 'Akreditasi -';
    return 'Akreditasi ' + clean;
  };

  const isSDI = numId === 1;
  const name = isSDI ? 'SD Islam (SDI) AL KINDY' : (unitData?.name || meta.name);
  const rawAkreditasi = unitData?.accreditation || defaults.akreditasi;
  const akreditasi = formatAkreditasi(rawAkreditasi);
  const desc = unitData?.description || defaults.desc;
  const kurikulum = unitData?.curriculum || defaults.kurikulum || '-';
  const unggulan = unitData?.featured_programs || unitData?.featured_program || defaults.unggulan || '-';
  const ekskul = unitData?.extracurricular || defaults.ekskul || '-';
  const fasilitas = unitData?.facilities || defaults.fasilitas || '-';
  const visi = unitData?.vision || defaults.visi || '-';
  const misi = unitData?.mission || defaults.misi || '-';
  const logo = unitData?.image_url || unitData?.logo_url || meta.logo;

  // Update header elemen
  const elTitle = document.getElementById(`modal-title-${numId}`);
  if (elTitle) elTitle.textContent = name;
  const elAkreditasi = document.getElementById(`modal-akreditasi-${numId}`);
  if (elAkreditasi) {
    elAkreditasi.innerHTML = `<i class="fas fa-certificate text-emerald-600"></i> <span>${akreditasi}</span>`;
    elAkreditasi.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs";
  }

  // Parse Visi & Misi
  const cleanVisiText = extractCleanText(visi);
  const cleanMisiText = extractCleanText(misi);
  const linesMisi = cleanMisiText
    .split('\n')
    .map(l => l.trim().replace(/^[-*•\d.]+\s*/, ''))
    .filter(l => l.length > 0 && l !== '-');

  const misiHTML = linesMisi.length > 0
    ? `<ul class="list-disc ml-5 space-y-1 text-sm text-slate-600 leading-relaxed">${linesMisi.map(m => `<li class="mb-1">${escapeHtml(m)}</li>`).join('')}</ul>`
    : '<div class="text-sm text-slate-500 italic">-</div>';

  const visiMisiSection = (cleanVisiText || linesMisi.length > 0) ? `
    <div class="mb-6 p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-200/80">
      <h4 class="font-bold text-emerald-800 mb-3 flex items-center text-sm sm:text-base">
        <i class="fas fa-bullseye mr-2 text-gold-500"></i> Visi &amp; Misi
      </h4>
      ${cleanVisiText ? `
      <div class="mb-3">
        <span class="block font-bold text-emerald-800 text-xs uppercase tracking-wider mb-1">Visi:</span>
        <div class="italic text-slate-700 text-sm leading-relaxed">${cleanVisiText}</div>
      </div>
      ` : ''}
      ${linesMisi.length > 0 ? `
      <div>
        <span class="block font-bold text-emerald-800 text-xs uppercase tracking-wider mb-1">Misi:</span>
        ${misiHTML}
      </div>
      ` : ''}
    </div>
  ` : '';

  const modalBody = document.getElementById(`modal-body-${numId}`) || 
                    (document.getElementById(`modal-${numId}`) ? document.getElementById(`modal-${numId}`).querySelector('.overflow-y-auto') : null);

  if (modalBody) {
    modalBody.innerHTML = `
      <div class="w-full h-44 sm:h-56 mb-6 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-4 shadow-sm">
        <img src="${logo}" alt="${escapeHtml(name)}" class="object-contain max-h-full w-auto max-w-full h-auto">
      </div>

      <div class="text-slate-600 text-base mb-6 leading-relaxed">${formatContentHtml(desc)}</div>

      ${visiMisiSection}

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Kurikulum -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-emerald-700 mb-2 flex items-center text-sm">
              <i class="fas fa-book-reader mr-2 text-gold-500"></i> Kurikulum
            </h4>
            <div class="text-sm text-slate-600 leading-relaxed">${formatContentHtml(kurikulum)}</div>
          </div>
        </div>

        <!-- Program Unggulan -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-emerald-700 mb-2 flex items-center text-sm">
              <i class="fas fa-star mr-2 text-gold-500"></i> Program Unggulan
            </h4>
            <div class="text-sm text-slate-600 leading-relaxed">${formatContentHtml(unggulan)}</div>
          </div>
        </div>

        <!-- Ekstrakurikuler -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-emerald-700 mb-2 flex items-center text-sm">
              <i class="fas fa-running mr-2 text-gold-500"></i> Ekstrakurikuler
            </h4>
            <div class="text-sm text-slate-600 leading-relaxed">${formatContentHtml(ekskul)}</div>
          </div>
        </div>

        <!-- Fasilitas -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-emerald-700 mb-2 flex items-center text-sm">
              <i class="fas fa-building mr-2 text-gold-500"></i> Fasilitas
            </h4>
            <div class="text-sm text-slate-600 leading-relaxed">${formatContentHtml(fasilitas)}</div>
          </div>
        </div>
      </div>
    `;
  }
}
