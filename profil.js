// profil.js - Helper & Sinkronisasi Tampilan Publik Profil Yayasan
export function renderTextOrList(containerElement, rawData, isList = false, listType = 'number') {
    if (!containerElement || !rawData) return;
    
    let cleanText = rawData;
    let alignClass = 'text-justify';
    
    if (typeof rawData === 'string' && rawData.trim().startsWith('<div')) {
        const temp = document.createElement('div');
        temp.innerHTML = rawData;
        const wrapper = temp.firstElementChild;
        if (wrapper && wrapper.tagName === 'DIV') {
            alignClass = wrapper.className.replace('whitespace-pre-wrap', '').trim() || 'text-justify';
            cleanText = wrapper.innerHTML;
        }
    }
    
    containerElement.classList.remove('text-left', 'text-center', 'text-right', 'text-justify');
    if (alignClass) {
        const classesToAdd = alignClass.split(' ').filter(c => c);
        if (classesToAdd.length > 0) containerElement.classList.add(...classesToAdd);
    }
    
    if (isList) {
        const cleanLines = cleanText.replace(/<br\s*[\/]?>/gi, '\n')
            .replace(/<\/?p[^>]*>/gi, '\n')
            .split('\n')
            .map(b => b.replace(/<[^>]+>/g, '').trim())
            .filter(b => b !== '');
            
        containerElement.innerHTML = '';
        cleanLines.forEach((item, index) => {
            const textOnly = item.replace(/^\d+[\.\)]\s*/, '');
            if (listType === 'number') {
                containerElement.innerHTML += `
                <li class="flex items-start gap-3">
                  <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">${index + 1}</span>
                  <span class="${alignClass}">${textOnly}</span>
                </li>`;
            } else {
                containerElement.innerHTML += `
                <li class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-emerald-50/40 transition">
                  <span class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold">
                    <i class="fas fa-check-circle"></i>
                  </span>
                  <div class="text-sm text-slate-700 leading-relaxed ${alignClass}">
                    ${textOnly}
                  </div>
                </li>`;
            }
        });
    } else {
        containerElement.innerHTML = cleanText.replace(/<br\s*[\/]?>/gi, '<br>');
    }
}

if (typeof window !== 'undefined') {
    window.renderTextOrList = renderTextOrList;
}

