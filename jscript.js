// Data of Groups
const GROUPS = [
    {id: 'games', label: 'Games'},
    {id: 'tests', label: 'Tests / Tools'},
    {id: 'info', label: 'Info'},
    {id: 'misc', label: 'Misc'}
];

// Data of pages
// g: group id
// t: title
// d: description
// h: href
// p: type of page display (page-block, page-dim, page-simple)
// c: array of child pages with t and h
// k: search keywords
const PAGES = [
    {
        g: 'games', t: 'PokeWordle?', d: 'A wordle type of quiz with pokemon!',
        h: 'pokemonquiz/htmlpokemonquiz.html',
        k: 'quiz pokemon wordle'
    },
    {
        g: 'tests', t: 'Controller Input Testing', d: 'A page to test out if your controller is \"working\" properly.',
        h: 'controller/html-controller-3.html',
        k: 'test controller gamepad button stick input'
    },
    {
        g: 'tests', t: 'Tests Related to Typing', d: 'A page to test keyboard input and try a typing test.',
        h: 'typingpage/htmltypingpage.html',
        k: 'test type typing keyboard input'
    },
    {
        g: 'tests', t: 'Maplestory Equipment Share', d: 'A page to share my maplestory equipment info. The actual data is not in this page, only on my personal website.',
        h: 'mapleEquipment/htmlMapleEquipment.html',
        k: 'test maple maplestory equipment share'
    },
    {
        g: 'tests', t: 'Audio Comparison Test', d: 'A page to see if you can tell which audio has a better bitrate compared to the other.', p: 'page-dim',
        h: 'audioTest/htmlAudioTest.html',
        k: 'test audio mp3 compare comparison'
    }
];

/*=== Pages ===*/
if(document.getElementById('list')) {
    const $ = id => document.getElementById(id);
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
    const DEFAULT_DISPLAY = 'page-block';

    const searchText = page => [page.t, page.k || '', ...(page.c || []).map(child => child.t)].join(' ').toLowerCase();

    function toggleHtml(page, n) {
        const divId = 'fold-' + n;
        const linkId = 'toggle-' + n;
        const children = page.c.map(child => `<a class="page-toggle-child" href="${esc(child.h)}">${esc(child.t)}</a>`).join('');

        return  `<div class="page ${page.p || DEFAULT_DISPLAY}" data-page data-toggle data-search="${esc(searchText(page))}">` +
                    `<button type="button" class="page-toggle" id="${linkId}" aria-expanded="false" aria-controls="${divId}">` +
                        `<span class="arrow">&#9654;</span><span class="page-title">${esc(page.t)}</span>` +
                        (page.d ? `<span class="page-description">${esc(page.d)}</span>` : '') +
                    `</button>` +
                    `<div id="${divId}" class="div-folded">${children}</div>` +
                `</div>`;
    }

    function linkHtml(page) {
        return  `<a class="page ${page.p || DEFAULT_DISPLAY}" href="${esc(page.h)}" data-page data-search="${esc(searchText(page))}">` +
                    `<span class="page-title">${esc(page.t)}</span>` +
                    (page.d ? `<span class="page-description">${esc(page.d)}</span>` : '') +
                `</a>`;
    }

    function renderPages() {
        let n = 0;

        PAGES.forEach(page => {
            if(!GROUPS.some(group => group.id === page.g)) {
                console.warn('Page "' + page.t + '" has unknown group "' + page.g + '" and is not shown.');
            }
        });

        $('list').innerHTML = GROUPS.map(group => {
            const pages = PAGES.filter(page => page.g === group.id);
            if(!pages.length) { return ''; }

            return  `<section class="group" data-group>` +
                        `<h4 class="group-label">${esc(group.label)}</h4>` +
                        `<div class="group-body">` +
                            pages.map(page => page.c ? toggleHtml(page, n++) : linkHtml(page)).join('') +
                        `</div>` +
                    `</section>`;
        }).join('');
    }

    function applyFilter() {
        const term = $('filter').value.trim().toLowerCase();
        const pages = [...document.querySelectorAll('[data-page]')];
        let shown = 0;

        pages.forEach(page => {
            const hit = !term || page.dataset.search.includes(term);
            page.hidden = !hit;
            if(hit) { shown++; }
        });

        document.querySelectorAll('[data-group]').forEach(group => {
            group.hidden = !group.querySelector('[data-page]:not([hidden])');
        });

        if(term) {
            pages.forEach(page => {
                if(page.hidden || !page.hasAttribute('data-toggle')) { return; }

                const btn = page.querySelector('.page-toggle');
                const div = page.querySelector('.div-folded');
                if(!div.classList.contains('open')) {
                    unfoldDiv(div.id, btn.id);
                }
            });
        }

        const count = $('count');
        if(count) {
            count.textContent = shown + (shown === 1 ? ' page' : ' pages');
        }
        $('empty').hidden = shown !== 0;
    }

    $('list').addEventListener('click', e => {
        const btn = e.target.closest('.page-toggle');
        if(!btn) { return; }
        unfoldDiv(btn.getAttribute('aria-controls'), btn.id);
    });

    renderPages();
    $('filter').addEventListener('input', applyFilter);
    applyFilter();
}


/**
 * Toggles a div to be shown or hidden
 * @param {*} divId The id of the div or span that will be hidden or shown
 * @param {*} linkId The id of the link that will be clicked to hide or show the div or span
 */
function unfoldDiv(divId, linkId) {
    var div = document.getElementById(divId);
    var link = document.getElementById(linkId);
    var arrow = link.querySelector('.arrow');

    if(div.classList.contains('open')) {
        div.style.maxHeight = '0';
        div.classList.remove('open');
        arrow.classList.remove('arrow-spin');
        link.setAttribute('aria-expanded', 'false');
    } else {
        div.classList.add('open');
        div.style.maxHeight = div.scrollHeight + 'px';
        arrow.classList.add('arrow-spin');
        link.setAttribute('aria-expanded', 'true');
    }
}

// Below is the older version of toggle div I used
/**
 * Toggles a div to be shown or hidden
 * @param {*} divID The id of the div or span that will be hidden or shown
 * @param {*} linkID The id of the link that will be clicked to hide or show the div or span
 * @param {*} linkName The name of the link that will be clicked on
 */
function toggleDiv(divID, linkID, linkName) {
    var div = document.getElementById(divID);
    var link = document.getElementById(linkID);

    if(div.style.display == 'none') {
        div.style.display = '';
        link.innerText = '▼ ' + linkName;
    } else {
        div.style.display = 'none';
        link.innerText = '▶ ' + linkName;
    }
}
