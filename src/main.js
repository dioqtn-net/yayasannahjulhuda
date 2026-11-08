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

const renderLayout = (contentHTML, isPublic = true, activePage = '') => {
    if (isPublic) {
        return `
            ${renderNavbar(activePage)}
            <main class="flex-grow">${contentHTML}</main>
            ${renderFooter()}
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
    appDiv.innerHTML = '';
    appDiv.innerHTML = renderLayout(renderHome(profile, units, news, facilities, galleries, ppdb, homeSettings), true, 'beranda');
    setupHomeEvents();
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
function setupHomeEvents() {
    window.renderDynamicUnitModal = renderDynamicUnitModal;

    // Enforce live text alignment rendering via innerHTML from CMS / LocalStorage
    try {
        const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('cmsData_beranda') : null;
        if (saved) {
            const data = JSON.parse(saved);
            const taglineEl = document.getElementById('taglineDescPublic');
            if (taglineEl && data.taglineDesc) {
                taglineEl.innerHTML = data.taglineDesc;
            }
            const heroDescEl = document.getElementById('heroDescPublic');
            if (heroDescEl && data.heroDesc) {
                heroDescEl.innerHTML = data.heroDesc;
            }
            const taglineTitleEl = document.getElementById('taglineTitlePublic');
            if (taglineTitleEl && data.taglineTitle) {
                taglineTitleEl.textContent = data.taglineTitle;
            }
            const ps1TitleEl = document.getElementById('progSosial1TitlePublic');
            if (ps1TitleEl && data.progSosial1Title) {
                ps1TitleEl.textContent = data.progSosial1Title;
            }
            const ps1DescEl = document.getElementById('progSosial1DescPublic');
            if (ps1DescEl && data.progSosial1Desc) {
                ps1DescEl.innerHTML = data.progSosial1Desc;
            }
            const ps2TitleEl = document.getElementById('progSosial2TitlePublic');
            if (ps2TitleEl && data.progSosial2Title) {
                ps2TitleEl.textContent = data.progSosial2Title;
            }
            const ps2DescEl = document.getElementById('progSosial2DescPublic');
            if (ps2DescEl && data.progSosial2Desc) {
                ps2DescEl.innerHTML = data.progSosial2Desc;
            }
        }
    } catch (e) {
        console.error('Error synchronizing cmsData_beranda in setupHomeEvents:', e);
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

