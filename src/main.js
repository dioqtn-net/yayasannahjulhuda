import './style.css';
import Navigo from 'navigo';
import { api } from './api';
import { renderDynamicUnitModal } from './utils/modalRenderer';

// Layout Components
import { renderNavbar } from './components/Navbar';
import { renderFooter } from './components/Footer';

// Pages
import { renderHome } from './pages/Home';
import { renderProfile } from './pages/Profile';
import { renderPrograms } from './pages/Programs';
import { renderFacilities } from './pages/Facilities';
import { renderPPDB } from './pages/PPDB';
import { renderNews } from './pages/News';
import { renderGallery } from './pages/Gallery';
import { renderContact } from './pages/Contact';
import { renderAdmin } from './pages/Admin';

const router = new Navigo('/');
const appDiv = document.getElementById('app');

const renderLayout = (contentHTML, isPublic = true, activePage = '', contact = null) => {
    if (isPublic) {
        return `
            ${renderNavbar(activePage)}
            <main class="flex-grow">${contentHTML}</main>
            ${renderFooter(contact)}
        `;
    } else {
        return `<main class="flex-grow bg-slate-100 min-h-screen">${contentHTML}</main>`;
    }
};

const navigate = (path) => router.navigate(path);

const loadHome = async () => {
    appDiv.innerHTML = '<div class="p-8 text-center"><i class="fas fa-spinner fa-spin fa-2x text-emerald-700"></i></div>';
    const profile = await api.getProfile();
    const units = await api.getEducationUnits();
    const news = await api.getNews();
    const facilities = await api.getFacilities();
    const galleries = await api.getGalleries();
    const ppdb = await api.getPPDB();
    const homeSettings = await api.getHomeSettings();
    const contact = await api.getContactSettings();
    appDiv.innerHTML = '';
    appDiv.innerHTML = renderLayout(renderHome(profile, units, news, facilities, galleries, ppdb, homeSettings), true, 'beranda', contact);
    setupHomeEvents(homeSettings, contact);
};

// Setup Routing
router
  .on('/', loadHome)
  .on('/beranda', loadHome)
  .on('/beranda.html', loadHome)
  .on('/index.html', loadHome)
  .on('/profil', () => { window.location.href = '/profil'; })
  .on('/program', () => { window.location.href = '/program'; })
  .on('/fasilitas', () => { window.location.href = '/fasilitas'; })
  .on('/ppdb', () => { window.location.href = '/ppdb'; })
  .on('/berita', () => { window.location.href = '/berita'; })
  .on('/galeri', () => { window.location.href = '/galeri'; })
  .on('/kontak', () => { window.location.href = '/kontak'; })
  .on('/kelola', () => { window.location.href = '/kelola'; })
  .notFound(() => {
    appDiv.innerHTML = renderLayout(`
      <div class="text-center py-20">
        <h1 class="text-4xl font-bold text-emerald-800 mb-4">404</h1>
        <p class="text-slate-600 mb-8">Halaman tidak ditemukan.</p>
        <a href="/" class="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition">Kembali ke Beranda</a>
      </div>
    `);
  });

// Handle routing variations for /kelola fallback
const path = window.location.pathname;
const hash = window.location.hash;
if (path.startsWith('/kelola') || hash.includes('/kelola')) {
    window.location.href = '/kelola';
}
router.resolve();

// Matikan intercept navigasi SPA agar semua menu berpindah via native full page load (hard load)
// Event Setups
function setupHomeEvents(homeSettings = null, contact = null) {
    window.renderDynamicUnitModal = renderDynamicUnitModal;

    // Prioritaskan data Supabase yang baru saja di-load (100% Bebas LocalStorage)
    try {
        if (typeof localStorage !== 'undefined') localStorage.removeItem('cmsData_beranda');
    } catch(e) {}

    if (contact) {
        const fAddr = document.getElementById('pubFooterAddress') || document.getElementById('indexFooterAddress');
        if (fAddr && contact.address) fAddr.textContent = contact.address;
        const fPhone = document.getElementById('pubFooterPhone') || document.getElementById('indexFooterPhone');
        if (fPhone && (contact.phone || contact.whatsapp1)) fPhone.textContent = contact.phone || contact.whatsapp1;
        const fEmail = document.getElementById('pubFooterEmail') || document.getElementById('indexFooterEmail');
        if (fEmail && contact.email) {
            fEmail.textContent = contact.email;
            fEmail.href = 'mailto:' + contact.email;
        }
    }

    if (homeSettings) {
        const taglineEl = document.getElementById('taglineDescPublic');
        if (taglineEl && homeSettings.tagline_desc) taglineEl.innerHTML = homeSettings.tagline_desc;
        const heroDescEl = document.getElementById('heroDescPublic');
        if (heroDescEl && homeSettings.hero_desc) heroDescEl.innerHTML = homeSettings.hero_desc;
        const taglineTitleEl = document.getElementById('taglineTitlePublic');
        if (taglineTitleEl && homeSettings.tagline_title) taglineTitleEl.textContent = homeSettings.tagline_title;
        const ps1TitleEl = document.getElementById('progSosial1TitlePublic');
        if (ps1TitleEl && homeSettings.social_prog1_title) ps1TitleEl.textContent = homeSettings.social_prog1_title;
        const ps1DescEl = document.getElementById('progSosial1DescPublic');
        if (ps1DescEl && homeSettings.social_prog1_desc) ps1DescEl.innerHTML = homeSettings.social_prog1_desc;
        const ps2TitleEl = document.getElementById('progSosial2TitlePublic');
        if (ps2TitleEl && homeSettings.social_prog2_title) ps2TitleEl.textContent = homeSettings.social_prog2_title;
        const ps2DescEl = document.getElementById('progSosial2DescPublic');
        if (ps2DescEl && homeSettings.social_prog2_desc) ps2DescEl.innerHTML = homeSettings.social_prog2_desc;
    }
    window.openModal = async (id) => {
        // Handle lightbox images from gallery
        if (typeof id === 'string' && (id.startsWith('http') || id.startsWith('/') || id.includes('.'))) {
            const modal = document.getElementById('image-modal');
            const modalImg = document.getElementById('modal-image');
            if (modal && modalImg) {
                modalImg.src = id;
                modal.classList.remove('hidden');
                document.body.classList.add('modal-open');
            }
            return;
        }

        try {
            await renderDynamicUnitModal(id);
        } catch (e) {
            console.error('Error rendering dynamic modal:', e);
        }

        const modal = document.getElementById(`modal-${id}`);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.classList.add('modal-open');
        }
    };
    window.closeModal = (id) => {
        const modal = document.getElementById(`modal-${id}`);
        if (modal) {
            modal.classList.add('hidden');
            document.body.classList.remove('modal-open');
        }
    };
}
function setupProgramEvents() {
    setupHomeEvents();
}

// Global mobile menu toggle
window.toggleMobileMenu = () => {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
};

// Memaksa reload/render ulang jika halaman dimuat dari Back/Forward Cache
window.addEventListener('pageshow', function (event) {
    const perfNav = window.performance && window.performance.getEntriesByType && window.performance.getEntriesByType('navigation')[0];
    const isBackForward = perfNav && perfNav.type === 'back_forward';
    if (event.persisted || isBackForward) {
        window.location.reload(); 
    }
});

