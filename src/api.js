import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://lrorriksjooxrpoihfge.supabase.co";
// Isi dengan anon key dari Supabase dashboard Anda.
// Jika kosong, sistem akan otomatis menggunakan mode fallback (data lokal).
const SUPABASE_ANON_KEY = "sb_publishable_lh_h3wSEaX3dUsR1XzWeGw_5t18TWxT";

let supabase = null;

if (SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== "") {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
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
        email: "info@nahjulhuda.or.id",
        operational_hours: "Senin - Jumat: 07:00 - 15:00 WIB"
    },
    education_units: [
        { id: 1, name: "SD Islam (SDI) AL KINDY", image_url: "/images/SDI.jpg", description: "Pendidikan dasar dengan dasar-dasar keislaman yang kuat.", curriculum: "Kurikulum Merdeka & Kurikulum Kemenag", extracurricular: "Pramuka, Marawis, Pencak Silat", facilities: "Ruang Kelas Nyaman, Perpustakaan, Lapangan", wa_number: "+6281234567890" },
        { id: 2, name: "Madrasah Ibtidaiyah (MI) Nahjul Huda", image_url: "/images/MI.jpg", description: "Mencetak siswa-siswi berprestasi dengan pemahaman agama yang mendalam.", curriculum: "Kurikulum Kemenag", extracurricular: "Qiroah, Pramuka, Futsal", facilities: "Lab Komputer, Mushola", wa_number: "+6281234567890" },
        { id: 3, name: "Madrasah Tsanawiyah (MTs) Nahjul Huda", image_url: "/images/MTs.jpg", description: "Pendidikan menengah pertama dengan penekanan pada akhlak dan ilmu pengetahuan.", curriculum: "Kurikulum Merdeka & Kemenag", extracurricular: "Paskibra, PMR, Rohis", facilities: "Lab IPA, Lab Bahasa, Perpustakaan", wa_number: "+6281234567890" },
        { id: 4, name: "Madrasah Aliyah (MA) Nahjul Huda", image_url: "/images/MA.jpg", description: "Mempersiapkan generasi muda untuk pendidikan tinggi dan kehidupan bermasyarakat.", curriculum: "Kurikulum Kemenag", extracurricular: "Karya Ilmiah Remaja, Jurnalistik", facilities: "Lab Terpadu, Asrama (bagi yang mondok)", wa_number: "+6281234567890" },
        { id: 5, name: "Pondok Pesantren Assurur", image_url: "/images/Ponpes.jpg", description: "Mengkaji kitab kuning dan pembinaan karakter Islami selama 24 jam.", curriculum: "Salafiyah & Modern", extracurricular: "Muhadharah, Bahtsul Masail", facilities: "Asrama Putra/Putri, Masjid As-Surur", wa_number: "+6281234567890" }
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
    if (!unit) return '/images/SDI.jpg';
    if (unit.image_url) return unit.image_url;
    const name = (unit.name || '').toLowerCase();
    if (name.includes('(sdi)') || name.includes('sd islam') || name.includes('al kindy') || /\bsdi\b/i.test(name) || /\bsd\b/i.test(name)) return '/images/SDI.jpg';
    if (name.includes('(mi)') || name.includes('ibtidaiyah') || /\bmi\b/i.test(name)) return '/images/MI.jpg';
    if (name.includes('(mts)') || name.includes('tsanawiyah') || /\bmts\b/i.test(name)) return '/images/MTs.jpg';
    if (name.includes('(ma)') || name.includes('aliyah') || /\bma\b/i.test(name)) return '/images/MA.jpg';
    if (name.includes('pesantren') || name.includes('ponpes') || name.includes('assurur')) return '/images/Ponpes.jpg';
    
    if (unit.id === 1) return '/images/SDI.jpg';
    if (unit.id === 2) return '/images/MI.jpg';
    if (unit.id === 3) return '/images/MTs.jpg';
    if (unit.id === 4) return '/images/MA.jpg';
    if (unit.id === 5) return '/images/Ponpes.jpg';
    
    return '/images/SDI.jpg';
};

export const api = {
    isSupabaseConnected: () => supabase !== null,
    
    async getProfile() {
        if (supabase) {
            const { data, error } = await supabase.from('profile_settings').select('*').single();
            if (error && error.code !== 'PGRST116') console.error(error);
            return data || fallbackData.profile;
        }
        await delay(300);
        return fallbackData.profile;
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
        let list = fallbackData.education_units;
        if (supabase) {
            const { data, error } = await supabase.from('education_units').select('*').order('id');
            if (error) console.error(error);
            if (data && data.length > 0) list = data;
        } else {
            await delay(300);
        }
        return list.map(u => {
            const isSDI = u.id === 1 || (u.name && (u.name.includes('SD Islam') || u.name.includes('SDI') || u.name.toLowerCase().includes('al kindy')));
            return {
                ...u,
                name: isSDI ? 'SD Islam (SDI) AL KINDY' : u.name,
                image_url: u.image_url || getUnitImage(u)
            };
        });
    },

    async getNews() {
        if (supabase) {
            const { data, error } = await supabase.from('news_posts').select('*').order('date', { ascending: false });
            if (error) console.error(error);
            return data && data.length > 0 ? data : fallbackData.news;
        }
        await delay(300);
        return fallbackData.news;
    },

    async getFacilities() {
        if (supabase) {
            const { data, error } = await supabase.from('facilities').select('*');
            if (error) console.error(error);
            return data && data.length > 0 ? data : fallbackData.facilities;
        }
        await delay(300);
        return fallbackData.facilities;
    },

    async getPPDB() {
        if (supabase) {
            const { data, error } = await supabase.from('ppdb_info').select('*').single();
            if (error && error.code !== 'PGRST116') console.error(error);
            return data || fallbackData.ppdb;
        }
        await delay(300);
        return fallbackData.ppdb;
    },

    async getGalleries() {
        if (supabase) {
            const { data, error } = await supabase.from('galleries').select('*').order('created_at', { ascending: false });
            if (error) console.error(error);
            return data && data.length > 0 ? data : fallbackData.galleries;
        }
        await delay(300);
        return fallbackData.galleries;
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
        if (supabase) {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            return data.session;
        }
        // Fallback login
        if (email === 'admin@nahjulhuda.or.id' && password === 'admin123') {
            const session = { access_token: 'fake-token-local', user: { email } };
            localStorage.setItem('admin_session', JSON.stringify(session));
            return session;
        }
        throw new Error("Invalid credentials");
    },

    async getSession() {
        if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            return session;
        }
        return JSON.parse(localStorage.getItem('admin_session') || 'null');
    },

    async logout() {
        if (supabase) {
            await supabase.auth.signOut();
        } else {
            localStorage.removeItem('admin_session');
        }
    }
};
