// kelola-info-ppdb.js - Logika Tab & Form Info PPDB
document.addEventListener('DOMContentLoaded', () => {
    // 1. Logika Peralihan Tab Independen (SDI, MI, MTs, MA, Ponpes)
    document.querySelectorAll('.tab-jenjang').forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Hapus class aktif dari semua tab
            document.querySelectorAll('.tab-jenjang').forEach(t => {
                t.classList.remove('bg-green-800', 'bg-emerald-800', 'text-white');
                t.classList.add('text-slate-600', 'bg-white');
            });
            // Tambah class aktif ke tab yang diklik
            e.currentTarget.classList.remove('text-slate-600', 'bg-white');
            e.currentTarget.classList.add('bg-green-800', 'text-white');
            
            // Sembunyikan semua konten tab
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            // Tampilkan konten tab yang sesuai dengan data-target
            const targetId = e.currentTarget.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) targetEl.classList.remove('hidden');
        });
    });
});

