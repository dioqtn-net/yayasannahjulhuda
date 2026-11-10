import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://lrorriksjooxrpoihfge.supabase.co";
// Isi dengan anon key dari Supabase dashboard Anda.
// Jika kosong, sistem akan otomatis menggunakan mode fallback (data lokal).
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

let supabase = null;

if (SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== "") {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true },
        global: {
            fetch: (url, options = {}) => {
                const headers = new Headers(options.headers || {});
                headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
                headers.set('Pragma', 'no-cache');
                if (!headers.has('apikey')) headers.set('apikey', SUPABASE_ANON_KEY);
                if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${SUPABASE_ANON_KEY}`);
                return fetch(url, {
                    ...options,
                    cache: 'no-store',
                    headers
                });
            }
        }
    });
}

// Fallback Data (Seeder)
const fallbackData = {
    profile: {
        id: 1,
        name: "Yayasan Nahjul Huda",
        history: "Yayasan Nahjul Huda berdiri dengan semangat untuk memajukan pendidikan Islam di Kebon Jeruk, Jakarta Barat.",
        vision_mission: "Visi: Menjadi lembaga pendidikan Islam terdepan yang mencetak generasi unggul, berakhlak mulia, dan berwawasan global.\nMisi:\n1. Menyelenggarakan pendidikan berkualitas.\n2. Menanamkan nilai-nilai keislaman.\n3. Mengembangkan potensi peserta didik.",
        address: "Jl. J No.67G / Jl. HH Gg. 1 No. 63, RT.008/RW.001, Kebon Jeruk, Kec. Kebon Jeruk, Kota Jakarta Barat, DKI Jakarta 11530",
        phone: "+6281234567890",
        telephone: "(021) 53654830",
        email: "nahjulhuda74@gmail.com",
        operational_hours: "Senin - Jumat: 07:00 - 15:00 WIB"
    },
    education_units: [
        {
            id: 1,
            name: "SD Islam (SDI) AL KINDY",
            accreditation: "A",
            image_url: "/media/logo/SDI.jpg",
            description: "Pendidikan dasar dengan pondasi nilai-nilai keislaman yang kuat.",
            curriculum: "Kurikulum Merdeka Terintegrasi Kemenag",
            featured_programs: "Qira'ati, Tahfidz Al-Qur'an (Juz 30), dan KTIQ.",
            extracurricular: "Pramuka, Marawis, Tahfidz Qur'an",
            facilities: "Ruang Kelas Nyaman, Perpustakaan, Lapangan Olahraga",
            vision: "\"Terwujudnya Generasi Qur'ani yang Berakhlak Mulia, Berkarakter, Kreatif, Berprestasi, Mampu Berkompetisi, Serta Mandiri Melalui Pembelajaran Mendalam di Era Global.\"",
            mission: "Menanamkan nilai-nilai keimanan dan ketakwaan melalui pembiasaan ibadah dan penguatan karakter Islami dalam kehidupan sehari-hari.\nMengintegrasikan pembelajaran Al-Qur'an dalam kegiatan intrakurikuler dan kokurikuler.\nMenerapkan Kurikulum Merdeka yang berpusat pada peserta didik dengan pendekatan pembelajaran mendalam (deep learning).\nMengembangkan kemampuan berpikir kritis, kreatif, kolaboratif, dan komunikatif melalui kegiatan pembelajaran yang bermakna.\nMenciptakan lingkungan belajar yang aman, nyaman, inklusif, dan menyenangkan.\nMendorong peserta didik untuk selalu berakhlak baik, berprestasi, mandiri, bertanggung jawab, serta memiliki kepedulian sosial dan lingkungan.",
            wa_number: "+6281234567890"
        },
        { 
            id: 2, 
            name: "Madrasah Ibtidaiyah (MI) Nahjul Huda", 
            accreditation: "A",
            image_url: "/media/logo/MI.jpg", 
            description: "Mencetak siswa-siswi berprestasi dengan penekanan pada ilmu agama dasar.", 
            curriculum: "Kurikulum Kemenag", 
            featured_programs: "Qira'atul Qur'an Metode Qiroati, Keterampilan Kemandirian, Prestasi Akademik & Non Akademik",
            extracurricular: "Pramuka, Qiroah, Futsal", 
            facilities: "Lab Komputer, Mushola, Perpustakaan", 
            vision: "-",
            mission: "...",
            wa_number: "+628991168301" 
        },
        { 
            id: 3, 
            name: "Madrasah Tsanawiyah (MTs) Nahjul Huda", 
            accreditation: "A",
            image_url: "/media/logo/MTs.jpg", 
            description: "Pendidikan menengah pertama dengan lingkungan yang Islami dan disiplin.", 
            curriculum: "Kurikulum Merdeka & Kemenag", 
            featured_programs: "-",
            extracurricular: "Paskibra, PMR, Rohis, Hadroh", 
            facilities: "Lab IPA, Lab Bahasa, Sarana Olahraga", 
            vision: "-",
            mission: "Terwujudnya Al-Qur'an, Ilmiah, Cerdas, Sehat, Mandiri, Berakhlak\nMembentuk generasi yang berilmu, beriman, dan berakhlak mulia\nMengembangkan kemampuan & budi pekerti\nBerwawasan Luas\nMencetak Generasi Global",
            wa_number: "+6285880682115" 
        },
        { 
            id: 4, 
            name: "Madrasah Aliyah (MA) Nahjul Huda", 
            accreditation: "A",
            image_url: "/media/logo/MA.jpg", 
            description: "Mempersiapkan generasi unggul menuju jenjang pendidikan tinggi.", 
            curriculum: "Kurikulum Kemenag (IPA/IPS/Agama)", 
            featured_programs: "-",
            extracurricular: "Karya Ilmiah Remaja, Jurnalistik, Bahasa Arab & Inggris", 
            facilities: "Lab Terpadu, Perpustakaan Digital", 
            vision: "-",
            mission: "Terwujudnya Al-Qur'an, Ilmiah, Cerdas, Sehat, Mandiri, Berakhlak\nMembentuk generasi yang berilmu, beriman, dan berakhlak mulia\nMengembangkan kemampuan & budi pekerti\nBerwawasan Luas\nMencetak Generasi Global",
            wa_number: "+628158316436" 
        },
        { 
            id: 5, 
            name: "Pondok Pesantren Assurur", 
            accreditation: "A",
            image_url: "/media/logo/Ponpes.jpg", 
            description: "Pendidikan asrama 24 jam dengan kajian kitab kuning dan tahfidz.", 
            curriculum: "Salafiyah, Modern, & Tahfidz", 
            featured_programs: "Bahasa Arab, Bahasa Inggris, Metode Qiroati, Tahfidzul Qur'an, Kitab Kuning, Multimedia, Leadership Kulliyatul Muallimin Al-Islamiyyah", 
            extracurricular: "Muhadharah, Bahtsul Masail, Kaligrafi", 
            facilities: "Asrama Putra/Putri, Masjid As-Surur, Ruang Aula", 
            vision: "\"Mendidik Santri Beriman, Bertaqwa, Berakhlak Mulia, Berilmu, Beribadah Bermanfaat Ahlus Sunah Wal Jama'ah (ASWAJA)\"",
            mission: "Penanaman Aqidah Sholihah\nBimbingan Ibadah Sesuai Al Qur'an & Hadits\nMembentuk Pribadi Berakhlak Mulia, Kreatif, Cerdas, Inovatif, Mandiri, Bertanggung Jawab, dan Ketrampilan Abad 21\nMengaplikasikan Ilmu Agama dengan diimbangi aplikasi Teknologi Informasi",
            wa_number: "+628569010538" 
        }
    ],
    news: [
        { id: 1, title: "Penerimaan Santri Baru Telah Dibuka", content: "Segera daftarkan putra-putri Anda ke Yayasan Nahjul Huda...", date: "2023-10-01", image_url: null },
        { id: 2, title: "Prestasi Siswa MTs Nahjul Huda", content: "Siswa MTs Nahjul Huda berhasil meraih juara 1 MTQ...", date: "2023-11-15", image_url: null }
    ],
    facilities: [
        { id: 1, name: "Masjid As-Surur", description: "Pusat ibadah dan kegiatan keagamaan.", image_url: null },
        { id: 2, name: "Gedung 3 Lantai", description: "Ruang kelas yang representatif dan nyaman.", image_url: null }
    ],
    ppdb: {
        id: 1,
        academic_year: "2024/2025",
        status: "BUKA",
        schedule: "Gelombang 1: Jan-Mar, Gelombang 2: Apr-Jun",
        requirements: "- Fotokopi KK\n- Fotokopi Akta Kelahiran\n- Pas Foto 3x4",
        flow: "1. Mengisi Formulir\n2. Melengkapi Berkas\n3. Wawancara\n4. Daftar Ulang",
        fees: "Uang Pangkal: Rp. 2.000.000\nSPP: Rp. 200.000/bulan",
        wa_number: "+6281234567890"
    },
    galleries: [
        { id: 1, title: "Kegiatan Belajar", image_url: "https://via.placeholder.com/400x300?text=Kegiatan+Belajar" },
        { id: 2, title: "Masjid As-Surur", image_url: "https://via.placeholder.com/400x300?text=Masjid" }
    ]
};

// Helper function to simulate network delay for fallback
const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const getUnitImage = (unit) => {
    if (!unit) return '/media/logo/SDI.jpg';
    if (unit.image_url) return unit.image_url;
    const name = (unit.name || '').toLowerCase();
    if (name.includes('(sdi)') || name.includes('sd islam') || name.includes('al kindy') || /\bsdi\b/i.test(name) || /\bsd\b/i.test(name)) return '/media/logo/SDI.jpg';
    if (name.includes('(mi)') || name.includes('ibtidaiyah') || /\bmi\b/i.test(name)) return '/media/logo/MI.jpg';
    if (name.includes('(mts)') || name.includes('tsanawiyah') || /\bmts\b/i.test(name)) return '/media/logo/MTs.jpg';
    if (name.includes('(ma)') || name.includes('aliyah') || /\bma\b/i.test(name)) return '/media/logo/MA.jpg';
    if (name.includes('pesantren') || name.includes('ponpes') || name.includes('assurur')) return '/media/logo/Ponpes.jpg';
    
    if (unit.id === 1) return '/media/logo/SDI.jpg';
    if (unit.id === 2) return '/media/logo/MI.jpg';
    if (unit.id === 3) return '/media/logo/MTs.jpg';
    if (unit.id === 4) return '/media/logo/MA.jpg';
    if (unit.id === 5) return '/media/logo/Ponpes.jpg';
    
    return '/media/logo/SDI.jpg';
};

export const api = {
    isSupabaseConnected: () => supabase !== null,
    
    async getHomeSettings() {
        let h = {
            id: 1,
            hero_title: 'Selamat Datang di Yayasan Nahjul Huda',
            hero_desc: 'Membangun generasi emas yang beriman, berilmu, dan berakhlakul karimah melalui pendidikan berkualitas dan terpadu.',
            tagline_title: 'Mencetak Generasi Rabbani',
            tagline_desc: '"Yayasan Nahjul Huda berdiri dengan semangat untuk memajukan pendidikan Islam di Kebon Jeruk, Jakarta Barat. Sejak awal berdirinya, yayasan ini telah berkomitmen untuk mencetak generasi yang tidak hanya unggul secara akademik, namun juga memiliki akhlakul karimah dan pemahaman agama yang mendalam."',
            stat1_num: '5', stat1_text: 'JENJANG PENDIDIKAN',
            stat2_num: '100+', stat2_text: 'TENAGA PENDIDIK',
            stat3_num: '1000+', stat3_text: 'SANTRI & SISWA',
            stat4_num: '1980', stat4_text: 'TAHUN BERDIRI',
            social_prog1_title: "Majelis Ta'lim Nahjul Huda",
            social_prog1_desc: "Wadah pengajian rutin bagi masyarakat sekitar untuk memperdalam ilmu agama, kajian tafsir, fiqih, dan tasawuf yang diasuh langsung oleh para asatidz Yayasan.",
            social_prog2_title: "Pengajian Rutin Bulanan",
            social_prog2_desc: "Kegiatan rutin bulanan yang diselenggarakan oleh yayasan sebagai wadah silaturahmi, doa bersama, serta kajian keislaman tematik untuk memperkuat ukhuwah dan wawasan spiritual para jamaah dan wali murid."
        };
        try {
            const res = await fetch(SUPABASE_URL + '/rest/v1/home_settings?id=eq.1&select=*', {
                cache: 'no-store',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
                }
            });
            if (res.ok) {
                const rows = await res.json();
                if (rows && rows[0]) {
                    h = { ...h, ...rows[0] };
                    return h;
                }
            }
        } catch(e) {
            console.warn('[api.getHomeSettings] REST fallback error:', e);
        }

        if (supabase) {
            try {
                const { data, error } = await supabase.from('home_settings').select('*').eq('id', 1).maybeSingle();
                if (!error && data) {
                    h = { ...h, ...data };
                }
            } catch(err) {
                console.warn('[api.getHomeSettings] query error:', err);
            }
        }
        return h;
    },

    async getContactSettings() {
        let c = {
            id: 1,
            foundation_name: 'Yayasan Nahjul Huda',
            address: 'Jl. J No.67G / Jl. HH Gg. 1 No. 63, RT.008/RW.001, Kebon Jeruk, Jakarta Barat 11530',
            phone: '+6281234567890',
            whatsapp1: '+6281234567890',
            whatsapp2: '+628991168301',
            email: 'nahjulhuda74@gmail.com',
            operational_hours: 'Senin - Jumat: 07:00 - 15:00'
        };

        try {
            const res = await fetch(SUPABASE_URL + '/rest/v1/contact_settings?id=eq.1&select=*', {
                cache: 'no-store',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });
            if (res.ok) {
                const rows = await res.json();
                if (rows && rows[0]) {
                    c = { ...c, ...rows[0] };
                    return c;
                }
            }
        } catch(e) {
            console.warn('[api.getContactSettings] REST fallback error:', e);
        }

        if (supabase) {
            try {
                const { data, error } = await supabase.from('contact_settings').select('*').eq('id', 1).maybeSingle();
                if (!error && data) c = { ...c, ...data };
            } catch(err) {}
        }
        return c;
    },

    async getProfile() {
        let p = fallbackData.profile;

        try {
            const res = await fetch(SUPABASE_URL + '/rest/v1/profile_settings?id=eq.1&select=*', {
                cache: 'no-store',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
                }
            });
            if (res.ok) {
                const rows = await res.json();
                if (rows && rows[0]) {
                    p = { ...p, ...rows[0] };
                    return p;
                }
            }
        } catch(e) {
            console.warn('[api.getProfile] REST fallback error:', e);
        }

        if (supabase) {
            try {
                const { data, error } = await supabase.from('profile_settings').select('*').single();
                if (!error && data) p = { ...p, ...data };
            } catch(e) {}
        }

        return p;
    },

    async updateProfile(profile) {
        if (supabase) {
            const { error } = await supabase.from('profile_settings').upsert(profile);
            if (error) throw error;
            return true;
        }
        fallbackData.profile = { ...fallbackData.profile, ...profile };
        return true;
    },

    async getEducationUnits() {
        let list = null;

        try {
            const res = await fetch(SUPABASE_URL + '/rest/v1/education_units?select=*&order=id.asc', {
                cache: 'no-store',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    list = data.filter(n => Number(n.id) > 0);
                }
            }
        } catch (e) {
            console.warn('[api.getEducationUnits] REST fetch error:', e);
        }

        if (!list && supabase) {
            try {
                const { data, error } = await supabase.from('education_units').select('*').order('id');
                if (!error && data && data.length > 0) {
                    list = data.filter(n => Number(n.id) > 0);
                }
            } catch (err) {
                console.warn('[api.getEducationUnits] Supabase client error:', err);
            }
        }

        if (!list || list.length === 0) {
            list = fallbackData.education_units;
        }

        const mapped = list.filter(u => Number(u.id) > 0).map(u => {
            const isSDI = u.id === 1 || (u.name && (u.name.includes('SD Islam') || u.name.includes('SDI') || u.name.toLowerCase().includes('al kindy')));
            return {
                ...u,
                id: Number(u.id),
                name: isSDI ? 'SD Islam (SDI) AL KINDY' : (u.name || '-'),
                accreditation: u.accreditation || 'A',
                image_url: u.image_url || getUnitImage(u),
                description: u.description || '-',
                curriculum: u.curriculum || '-',
                featured_programs: u.featured_programs || u.featured_program || '-',
                featured_program: u.featured_programs || u.featured_program || '-',
                extracurricular: u.extracurricular || '-',
                facilities: u.facilities || '-',
                vision: u.vision || '-',
                mission: u.mission || '-',
                wa_number: u.wa_number || ''
            };
        });

        if (typeof window !== 'undefined') {
            window.__cachedEducationUnits = mapped;
        }
        return mapped;
    },

    async getProgramBanner() {
        if (supabase) {
            try {
                const { data, error } = await supabase.from('education_units').select('name,description').eq('id', 0).maybeSingle();
                if (!error && data) {
                    return {
                        progBannerTitle: data.name || 'Program & Jenjang Pendidikan',
                        progBannerDesc: data.description || 'Kami menyelenggarakan pendidikan berkelanjutan dari jenjang dasar hingga menengah atas dan pendidikan kepesantrenan.'
                    };
                }
            } catch(e) {}
        }
        return {
            progBannerTitle: 'Program & Jenjang Pendidikan',
            progBannerDesc: 'Kami menyelenggarakan pendidikan berkelanjutan dari jenjang dasar hingga menengah atas dan pendidikan kepesantrenan.'
        };
    },

    async getNews() {
        let list = fallbackData.news;
        if (supabase) {
            const { data, error } = await supabase.from('news_posts').select('*').order('date', { ascending: false });
            if (error) console.error(error);
            if (data && data.length > 0) list = data.filter(n => Number(n.id) > 0);
        } else {
            await delay(300);
        }
        return list.map(n => ({
            ...n,
            title: n.title || '-',
            content: n.content || '-',
            date: n.date || '-'
        }));
    },

    async getFacilities() {
        let list = fallbackData.facilities;
        if (supabase) {
            const { data, error } = await supabase.from('facilities').select('*');
            if (error) console.error(error);
            if (data && data.length > 0) list = data.filter(n => Number(n.id) > 0);
        } else {
            await delay(300);
        }
        return list.map(f => ({
            ...f,
            name: f.name || '-',
            description: f.description || '-'
        }));
    },

    async getPPDB() {
        let p = fallbackData.ppdb;
        if (supabase) {
            const { data, error } = await supabase.from('ppdb_info').select('*').single();
            if (error && error.code !== 'PGRST116') console.error(error);
            if (data) p = data;
        } else {
            await delay(300);
        }
        return {
            ...p,
            academic_year: p.academic_year || '-',
            status: p.status || 'BUKA',
            schedule: p.schedule || '-',
            requirements: p.requirements || '-',
            flow: p.flow || '-',
            fees: p.fees || '-',
            wa_number: p.wa_number || '-'
        };
    },

    async getGalleries() {
        let list = fallbackData.galleries;
        if (supabase) {
            const { data, error } = await supabase.from('galleries').select('*').order('created_at', { ascending: false });
            if (error) console.error(error);
            if (data && data.length > 0) list = data.filter(g => Number(g.id) > 0 && (g.category || '').toLowerCase() !== 'banner');
        } else {
            await delay(300);
        }
        return list.map(g => ({
            ...g,
            title: g.title || '-'
        }));
    },

    async uploadImage(file, pathName) {
        if (!supabase) return null;
        const fileName = `${Date.now()}_${pathName}.webp`;
        const { data, error } = await supabase.storage.from('media').upload(fileName, file, {
            contentType: 'image/webp'
        });
        if (error) throw error;
        const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
        return publicUrlData.publicUrl;
    },

    async addGallery(title, file) {
        if (supabase) {
            let image_url = '';
            if (file) {
                image_url = await this.uploadImage(file, 'gallery');
            }
            const { data, error } = await supabase.from('galleries').insert([{ title, image_url }]).select();
            if (error) throw error;
            return data[0];
        }
        throw new Error("Supabase not connected");
    },

    async deleteGallery(id, image_url) {
        if (supabase) {
            const { error } = await supabase.from('galleries').delete().eq('id', id);
            if (error) throw error;
            if (image_url) {
                const parts = image_url.split('/');
                const fileName = parts[parts.length - 1];
                if (fileName) await supabase.storage.from('media').remove([fileName]);
            }
            return true;
        }
        throw new Error("Supabase not connected");
    },

    // Auth
    async login(email, password) {
        const cleanEmail = (email || '').trim().toLowerCase();
        if (supabase) {
            try {
                const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
                if (!error && data?.session) {
                    sessionStorage.setItem('admin_session', JSON.stringify(data.session));
                    localStorage.setItem('admin_session', JSON.stringify(data.session));
                    return data.session;
                }
            } catch(e) {
                console.warn('Supabase auth attempt:', e);
            }
        }
        // Fallback login dengan kredensial resmi
        if (cleanEmail === 'admin@nahjulhuda.com' && password === 'NahjulHuda2026!') {
            const session = {
                access_token: 'token_nahjul_huda_' + Date.now(),
                user: { email: cleanEmail, role: 'admin' },
                created_at: new Date().toISOString()
            };
            sessionStorage.setItem('admin_session', JSON.stringify(session));
            localStorage.setItem('admin_session', JSON.stringify(session));
            return session;
        }
        // Fallback cadangan alternatif
        if (cleanEmail === 'admin@nahjulhuda.or.id' && password === 'admin123') {
            const session = { access_token: 'fake-token-local', user: { email: cleanEmail } };
            sessionStorage.setItem('admin_session', JSON.stringify(session));
            localStorage.setItem('admin_session', JSON.stringify(session));
            return session;
        }
        throw new Error("Email atau Password tidak valid");
    },

    async getSession() {
        if (supabase) {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) return session;
            } catch(e) {}
        }
        const raw = sessionStorage.getItem('admin_session') || localStorage.getItem('admin_session');
        return raw ? JSON.parse(raw) : null;
    },

    async logout() {
        if (supabase) {
            try {
                await supabase.auth.signOut();
            } catch(e) {}
        }
        sessionStorage.removeItem('admin_session');
        localStorage.removeItem('admin_session');
    }
};
