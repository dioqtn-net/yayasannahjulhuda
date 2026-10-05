import './style.css';
import Navigo from 'navigo';
import { api } from './api';

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

const renderLayout = (contentHTML, isPublic = true) => {
    if (isPublic) {
        return `
            ${renderNavbar()}
            <main class="flex-grow">${contentHTML}</main>
            ${renderFooter()}
        `;
    } else {
        return `<main class="flex-grow bg-slate-100 min-h-screen">${contentHTML}</main>`;
    }
};

const navigate = (path) => router.navigate(path);

// Setup Routing
router
  .on('/', async () => {
    appDiv.innerHTML = '<div class="p-8 text-center"><i class="fas fa-spinner fa-spin fa-2x text-emerald-700"></i></div>';
    const profile = await api.getProfile();
    const units = await api.getEducationUnits();
    const news = await api.getNews();
    const facilities = await api.getFacilities();
    const galleries = await api.getGalleries();
    const ppdb = await api.getPPDB();
    appDiv.innerHTML = renderLayout(renderHome(profile, units, news, facilities, galleries, ppdb));
    setupHomeEvents();
  })
  .on('/profil', async () => {
    appDiv.innerHTML = '<div class="p-8 text-center"><i class="fas fa-spinner fa-spin fa-2x text-emerald-700"></i></div>';
    const profile = await api.getProfile();
    appDiv.innerHTML = renderLayout(renderProfile(profile));
  })
  .on('/program', async () => {
    appDiv.innerHTML = '<div class="p-8 text-center"><i class="fas fa-spinner fa-spin fa-2x text-emerald-700"></i></div>';
    const units = await api.getEducationUnits();
    appDiv.innerHTML = renderLayout(renderPrograms(units));
    setupProgramEvents();
  })
  .on('/fasilitas', async () => {
    appDiv.innerHTML = '<div class="p-8 text-center"><i class="fas fa-spinner fa-spin fa-2x text-emerald-700"></i></div>';
    const facilities = await api.getFacilities();
    appDiv.innerHTML = renderLayout(renderFacilities(facilities));
  })
  .on('/ppdb', async () => {
    appDiv.innerHTML = '<div class="p-8 text-center"><i class="fas fa-spinner fa-spin fa-2x text-emerald-700"></i></div>';
    const ppdb = await api.getPPDB();
    appDiv.innerHTML = renderLayout(renderPPDB(ppdb));
  })
  .on('/berita', async () => {
    appDiv.innerHTML = '<div class="p-8 text-center"><i class="fas fa-spinner fa-spin fa-2x text-emerald-700"></i></div>';
    const news = await api.getNews();
    appDiv.innerHTML = renderLayout(renderNews(news));
  })
  .on('/galeri', async () => {
    appDiv.innerHTML = '<div class="p-8 text-center"><i class="fas fa-spinner fa-spin fa-2x text-emerald-700"></i></div>';
    const galleries = await api.getGalleries();
    appDiv.innerHTML = renderLayout(renderGallery(galleries));
  })
  .on('/kontak', async () => {
    appDiv.innerHTML = '<div class="p-8 text-center"><i class="fas fa-spinner fa-spin fa-2x text-emerald-700"></i></div>';
    const profile = await api.getProfile();
    appDiv.innerHTML = renderLayout(renderContact(profile));
  })
  .on('/kelola', async () => {
    appDiv.innerHTML = '<div class="p-8 text-center"><i class="fas fa-spinner fa-spin fa-2x text-emerald-700"></i></div>';
    await renderAdmin(appDiv, router);
  })
  .notFound(() => {
    appDiv.innerHTML = renderLayout(`
      <div class="text-center py-20">
        <h1 class="text-4xl font-bold text-emerald-800 mb-4">404</h1>
        <p class="text-slate-600 mb-8">Halaman tidak ditemukan.</p>
        <a href="/" data-navigo class="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition">Kembali ke Beranda</a>
      </div>
    `);
  });

// Handle routing variations for /kelola fallback
const path = window.location.pathname;
const hash = window.location.hash;
if (path.startsWith('/kelola') || hash.includes('/kelola')) {
    if (path !== '/kelola' || hash !== '') {
        window.history.replaceState(null, null, '/kelola');
    }
}
router.resolve();

// Global handler for data-navigo links
document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-navigo]');
    if (link) {
        e.preventDefault();
        router.navigate(link.getAttribute('href'));
        // close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }
});

// Event Setups
function setupHomeEvents() {
    window.openModal = (id) => {
        const modal = document.getElementById(`modal-${id}`);
        if(modal) {
            modal.classList.remove('hidden');
            document.body.classList.add('modal-open');
        }
    };
    window.closeModal = (id) => {
        const modal = document.getElementById(`modal-${id}`);
        if(modal) {
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
