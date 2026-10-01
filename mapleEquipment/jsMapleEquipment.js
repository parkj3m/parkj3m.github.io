/*=== Data ===*/
// Old 5-column slot layout
const OLD_SLOTS = [
    ['ring1','Ring 1'],		null,						['hat','Hat'],				null,						['emblem','Emblem'],
    ['ring2','Ring 2'],		['pendant1','Pendant 1'],	['face','Face Acc.'],		null, 						['badge','Badge'],
    ['ring3','Ring 3'],		['pendant2','Pendant 2'],	['eye','Eye Acc.'],			['earring','Earrings'],		['medal','Medal'],
    ['ring4','Ring 4'],		['weapon','Weapon'],		['top','Top / Overall'],	['shoulder','Shoulder'], 	['secondary','Secondary'],
    ['pocket','Pocket'],	['belt','Belt'],			['bottom','Bottom'],		['gloves','Gloves'],		['cape','Cape'],
    null,                   null,						['shoes','Shoes'],			['android','Android'],		['heart','Heart'],
].map(s => s && ({key:s[0], label:s[1]}));
const OLD_SLOT_MAP = Object.fromEntries(OLD_SLOTS.filter(Boolean).map(s => [s.key, s]));

// Equipment slot layout
const SLOTS = [
    ['ring1','Ring 1'],			['face','Face Acc.'],		null,							['seteff1','Set Effect 1'],		null,							['hat','Hat'],				['cape','Cape'],
    ['ring2','Ring 2'], 		['eye','Eye Acc.'],			null, 							['seteff2','Set Effect 2'],		null,							['top','Top / Overall'],	['gloves','Gloves'],
    ['ring3','Ring 3'],			['earring','Earrings'], 	null,							['seteff3','Set Effect 3'],		null,							['bottom','Bottom'],		['shoes','Shoes'],  
    ['ring4','Ring 4'], 		['pendant1','Pendant 1'], 	null,							['seteff4','Set Effect 4'],		null,							['shoulder','Shoulder'],	['medal','Medal'],   
    ['belt','Belt'],  			['pendant2','Pendant 2'],	['weapon','Weapon'], 			['secondary','Secondary'],		['emblem','Emblem'],			['android','Android'],		['heart','Heart'],
    ['pocket','Pocket'],		['familiar1', 'Familiar 1'], ['familiar2', 'Familiar 2'],	['familiar3', 'Familiar 3'], 	['familiarbadge', 'Familiar Badges'], null,					['badge','Badge'],
    ['title', 'Title'],			null, 						['totem1', 'Totem 1'],			['totem2', 'Totem 2'],			['totem3', 'Totem 3'],			['totemseteff', 'Totem Set Effect'],	null,
    ['arcane1', 'Arcane 1'],	['arcane2', 'Arcane 2'], 	['arcane3', 'Arcane 3'],		['arcane4', 'Arcane 4'],		['arcane5', 'Arcane 5'],		['arcane6', 'Arcane 6'],	null,
    ['sacred1', 'Sacred 1'],	['sacred2', 'Sacred 2'],	['sacred3', 'Sacred 3'], 		['sacred4', 'Sacred 4'],		['sacred5', 'Sacred 5'],		['sacred6', 'Sacred 6'],	null,
    ['pet1', 'Pet 1'],			['pet2', 'Pet 2'],			['pet3', 'Pet 3'],				['petseteff', 'Pet Set Effect'],null,							null,						['other','Other'],
].map(s => s && ({key:s[0], label:s[1]}));
const SLOT_MAP = Object.fromEntries(SLOTS.filter(Boolean).map(s => [s.key, s]));

// Stats shown in the editor table.
// k = key, l = label, p = whether percent or not
const STATS = [
    {k:'str', l:'STR'},	{k:'dex', l:'DEX'}, {k:'int', l:'INT'}, {k:'luk', l:'LUK'},
	{k:'allstat', l:'All Stats', p:true},
    {k:'hp', l:'Max HP'}, {k:'mp', l:'Max MP'},
    {k:'att', l:'ATT Power'}, {k:'matt', l:'Magic ATT'},
    {k:'def', l:'DEF'}, {k:'speed', l:'Speed'},	{k:'jump', l:'Jump'},
    {k:'dmg', l:'Damage', p:true},
    {k:'bossdmg', l:'Boss Damage', p:true}, {k:'ied', l:'Ignore Enemy DEF', p:true},
];
const STAT_MAP = Object.fromEntries(STATS.map(s => [s.k, s]));

// Where a stat's value comes from
const SOURCES = ['base', 'starforce', 'scroll', 'flame'];

// Potential tiers
const TIERS = ['none', 'rare', 'epic', 'unique', 'legendary'];
// Display name for each tier
const TIER_LABEL = {none:'None', rare:'Rare', epic:'Epic', unique:'Unique', legendary:'Legendary'};

// Potential stats, and if it is percent or flat value
const POTENTIAL_STATS = [
    {k:'str',		l:'STR',				units:['%', 'flat']},
    {k:'dex',		l:'DEX',				units:['%', 'flat']},
    {k:'int',		l:'INT',				units:['%', 'flat']},
    {k:'luk',		l:'LUK',				units:['%', 'flat']},
    {k:'allstat', 	l:'All Stats',			units:['%', 'flat']},
    {k:'hp', 		l:'Max HP',				units:['%', 'flat']},
    {k:'mp',		l:'Max MP',				units:['%', 'flat']},
    {k:'att', 		l:'ATT Power',			units:['%', 'flat']},
    {k:'matt', 		l:'Magic ATT',			units:['%', 'flat']},
    {k:'def',		l:'DEF',				units:['%', 'flat']},
    {k:'bossdmg',	l:'Boss Damage',		units:['%']},
	{k:'ied',		l:'Ignore Enemy DEF',	units:['%']},
	{k:'dmg',		l:'Damage',				units:['%']},
	{k:'critdmg',	l:'Critical Damage',	units:['%']},
	{k:'critrate',	l:'Critical Rate',		units:['%']},
	{k:'drop',		l:'Item Drop Rate',		units:['%']},
	{k:'meso',		l:'Mesos Obtained',		units:['%']},
	{k:'other',		l:'Other',				units:[]},
];
const POTENTIAL_STAT_MAP = Object.fromEntries(POTENTIAL_STATS.map(s => [s.k, s]));

/*=== Helper Variables ===*/
// Easily get element using id
const $ = id => document.getElementById(id);
// Create random uid
const uid = () => Math.random().toString(36).slice(2, 10);
// Replaces specific characters due to issue with HTML
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;','"':'&quot;', "'":'&#39;'}[c]));
// If 0 or empty, just make it blank
const numValue = v => (v === 0 || v === '' || v == null) ? '' : v;

/*=== Helper Functions ===*/
function emptyPotentialLine() {
	return {stat:'', unit:'', value:'', text:''};
}
function newProfile(name) {
	return {id:uid(), name:name, job:'', level:'', items:{}};
}
function newItem() {
	return {
		name:'', reqLevel:'', starforce:0, stats:{},
		potential:{tier:'none', lines:[emptyPotentialLine(), emptyPotentialLine(), emptyPotentialLine()]},
		additional:{tier:'none', lines:[emptyPotentialLine(), emptyPotentialLine(), emptyPotentialLine()]},
		notes:'',
	};
}
function newState() {
	const profile = newProfile('Character 1');
	return {version:2, activeProfileId:profile.id, profiles:[profile]};
}



// Saved data
let state = newState();
// Key of selected slot
let selectedSlot = null;
// If changes were unsaved or not
let unsaved = false;

// Get current profile
const activeProfile = () => state.profiles.find(p => p.id === state.activeProfileId) || state.profiles[0];
// Get item of certain slot
const getItem = key => activeProfile().items[key];

// Add stats from all of sources
function statTotal(s, k) {
	const v = SOURCES.map(src => +s?.[src] || 0);

	if(k === 'ied') {
		return +((1 - v.reduce((a, x) => a * (1 - x / 100), 1)) * 100).toFixed(2);
	}

	return v.reduce((a, b) => a + b, 0);
}
// If percent, add percent
const formatStat = (k, v) => STAT_MAP[k].p ? v + '%' : String(v);

// Set unsaved flag
function setUnsaved(us) {
	unsaved = us;
	$('span-unsaved').textContent = us ? 'Unsaved Changes - export to keep them' : '';
}
// Gives warning if unsaved
window.addEventListener('beforeunload', e => {
	if(unsaved) {
		e.preventDefault();
		e.returnValue = '';
	}
});

// Makes button need two clicks
function clickTwice(btn, clickTwiceText, action) {
	if(btn.dataset.clickTwice) {
		delete btn.dataset.clickTwice;
		action();
		return;
	}

	const original = btn.textContent;
	btn.dataset.clickTwice = '1';
	btn.textContent = clickTwiceText;

	setTimeout(() => {
		if(btn.isConnected && btn.dataset.clickTwice) {
			delete btn.dataset.clickTwice;
			btn.textContent = original;
		}
	}, 3000);
}

// Renders/Updates profile
function renderProfileBar() {
	$('select-profile').innerHTML = state.profiles.map(profile => `<option value="${profile.id}" ${profile.id === state.activeProfileId ? 'selected' : ''}>${esc(profile.name || 'Unnamed')}</option>`).join('');

	const profile = activeProfile();
	$('input-name').value = profile.name;
	$('input-job').value = profile.job;
	$('input-level').value = profile.level;
}

// Switch profile
$('select-profile').addEventListener('change', e => {
	state.activeProfileId = e.target.value;
	selectedSlot = null;
	renderAll();
});

// Create new profile
$('btn-newProfile').addEventListener('click', () => {
	const profile = newProfile('Character ' + (state.profiles.length + 1));
	state.profiles.push(profile);
	state.activeProfileId = profile.id;
	selectedSlot = null;
	setUnsaved(true);
	renderAll();
	$('input-name').select();
});

// Delete profile
$('btn-deleteProfile').addEventListener('click', e => {
	clickTwice(e.currentTarget, 'Click Again to Delete', () => {
		state.profiles = state.profiles.filter(profile => profile.id !== state.activeProfileId);
		if(!state.profiles.length) {
			state.profiles.push(newProfile('Character 1'));
		}
		state.activeProfileId = state.profiles[0].id;
		selectedSlot = null;
		e.currentTarget.textContent = 'Delete Profile';
		setUnsaved(true);
		renderAll();
	});
});

// Save current profile
[['input-name', 'name'], ['input-job', 'job'], ['input-level', 'level']].forEach(pair => {
	$(pair[0]).addEventListener('input', e => {
		activeProfile()[pair[1]] = e.target.value;
		if(pair[1] === 'name') {
			$('select-profile').selectedOptions[0].textContent = e.target.value || 'Unnamed';
		}
		setUnsaved(true);
	});
});

/*=== Equipment ===*/
const grid = $('div-equipmentGrid');

// Renders equipment grid
function renderGrid() {
	grid.innerHTML = '';
	SLOTS.forEach(slot => {
		if(!slot) {
			const blank = document.createElement('div');
			blank.className = 'slot void';
			grid.appendChild(blank);
			return;
		}
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.dataset.slot = slot.key;
		grid.appendChild(btn);
		renderSlot(slot.key);
	});
}

// Renders one slot of items
function renderSlot(key) {
	const slotElement = grid.querySelector('[data-slot="' + key + '"]');
	if(!slotElement) { return; }

	const item = getItem(key);
	let classes = 'slot';

	if(item) {
		classes += ' added';
		if(item.potential.tier !== 'none') {
			classes += ' ' + item.potential.tier;
		}
	}
	if(key === selectedSlot) {
		classes += ' selected';
	}

	slotElement.className = classes;
	slotElement.innerHTML = item
		? `<span class="slot-name">${esc(item.name || 'Unnamed')}</span>`
		+ (item.starforce
			? `<span class="slot-star">*${item.starforce}</span>` : '')
		: `<span>${SLOT_MAP[key].label}</span>`;
	slotElement.setAttribute('aria-label', SLOT_MAP[key].label + (item ? ': ' + (item.name || 'Unnamed') : ', empty'));
}

// Slot selection
grid.addEventListener('click', e => {
	const slotElement = e.target.closest('[data-slot]');
	if(!slotElement) { return; }

	const previous = selectedSlot;
	selectedSlot = slotElement.dataset.slot;
	if(previous) {
		renderSlot(previous);
	}
	renderSlot(selectedSlot);
	renderEditor();
	renderSummary();
})

/* === Editor === */
const editor = $('div-editor');

// Create one potential line
function potentialLine(prefix, i, line, title) {
	const units = (POTENTIAL_STAT_MAP[line.stat] || {}).units || [];
	const label = title + ' line ' + (i + 1);
	const statSelect = 
		`<select data-f="${prefix}:stat:${i}" aria-label="${label} stat">
			<option value="">(empty)</option>
			${POTENTIAL_STATS.map(s => `<option value="${s.k}" ${s.k === line.stat ? 'selected' : ''}>${s.l}</option>`).join('')}
		</select>`;
	
	if(line.stat === 'other') {
		return 	`<div class="potential-line other">
					${statSelect}
					<input data-f="${prefix}:text:${i}" value="${esc(line.text)}" placeholder="Type the line" aria-label="${label} text">
				</div>`;
	}

	const off = units.length ? '' : 'disabled';
	return 	`<div class="potential-line">${statSelect}
				<input type="number" step="any" data-f="${prefix}:value:${i}" value="${numValue(line.value)}"
					placeholder="Value" ${off} aria-label="${label} value">
				<select data-f="${prefix}:unit:${i}" ${off} aria-label="${label} unit">
					${units.map(u => `<option value="${u}" ${u === line.unit ? 'selected' : ''}>${u}</option>`).join('')}
				</select>
			</div>`;
}

// Create potential section
function potentialBlock(prefix, title, group) {
	return 	`<div class="section-title">
				${title}
			</div>
			<div class="potential-grid">
				<label>
					Tier
					<select data-f="${prefix}:tier">
						${TIERS.map(t => `<option value="${t}" ${group.tier === t ? 'selected' : ''}>${TIER_LABEL[t]}</option>`).join('')}
					</select>
				</label>
				<div class="potential-lines">
					${group.lines.map((line, i) => potentialLine(prefix, i, line, title)).join('')}
				</div>
			</div>`;
}

// Renders editor
function renderEditor() {
	if(!selectedSlot) {
		editor.innerHTML = '<p class="editor-empty">Select a slot in the equipment window.</p>';
		return;
	}

	const slot = SLOT_MAP[selectedSlot];
	const item = getItem(selectedSlot);

	if(!item) {
		editor.innerHTML =
			`<div class="editor-title">
				<h3>${slot.label}</h3>
			</div>
			<p class="editor-empty">
				Nothing equipped here.<br>
				<br>
				<button id="btn-addItem">Add Item</button>
			</p>`;
		
		$('btn-addItem').addEventListener('click', () => {
			activeProfile().items[selectedSlot] = newItem();
			setUnsaved(true);
			renderSlot(selectedSlot);
			renderEditor();
			renderSummary();
			editor.querySelector('[data-f="name"]').focus();
		});
		return;
	}

	editor.innerHTML =
	`<div class="editor-title">
		<h3>${slot.label}</h3>
		<button id="btn-removeItem" class="btn-check">Remove Item</button>
	</div>
	<div class="row">
		<label>Item Name<input data-f="name" value="${esc(item.name)}"></label>
		<label>Req. Level<input type="number" min="0" data-f="reqLevel" value="${numValue(item.reqLevel)}"></label>
		<label>Star Force<input type="number" min="0" max="30" data-f="starforce" value="${numValue(item.starforce)}"></label>
	</div>
	<div class="section-title">Stats</div>
	<div class="table-wrap">
		<table class="stats">
			<thead>
				<tr>
					<th>Stat</th>
					<th>Base</th>
					<th class="color-starforce">Star Force</th>
					<th class="color-scroll">Scroll / Other</th>
					<th class="color-flame">Flame</th>
					<th class="total">Total</th>
				</tr>
			</thead>
			<tbody>
				${STATS.map(s => {
				const v = item.stats[s.k] || {};
				return 	`<tr>
							<td>${s.l}${s.p ? ' %' : ''}</td>
							${SOURCES.map(src => `<td><input type="number" step="any" data-f="stat:${s.k}:${src}" value="${numValue(v[src])}" aria-label="${s.l} ${src}"></td>`).join('')}
							<td class="total" id="total-${s.k}">${formatStat(s.k, statTotal(v, s.k))}</td>
						</tr>`;
				}).join('')}
			</tbody>
		</table>
	</div>
	${potentialBlock('pot', 'Potential', item.potential)}
	${potentialBlock('add', 'Additional Potential', item.additional)}
	<div class="section-title">Notes</div>
	<textarea data-f="notes" placeholder="Anything you wanna add">${esc(item.notes)}</textarea>`;

	$('btn-removeItem').addEventListener('click', e => {
		clickTwice(e.currentTarget, 'Click Again to Remove', () => {
			delete activeProfile().items[selectedSlot];
			setUnsaved(true);
			renderSlot(selectedSlot);
			renderEditor();
			renderSummary();
		});
	});
}

// Save what is typed in the editor into the item's info
editor.addEventListener('input', e => {
	const f = e.target.dataset.f;
	if(!f || !selectedSlot) { return; }

	const item = getItem(selectedSlot);
	if(!item) { return; }

	const raw = e.target.value;
	const num = (raw === '' || isNaN(+raw)) ? 0 : +raw;
	const parts = f.split(':');

	if(parts[0] === 'stat') {
		const key = parts[1];
		const src = parts[2];
		item.stats[key] = item.stats[key] || {};
		item.stats[key][src] = num;
		$('total-' + key).textContent = formatStat(key, statTotal(item.stats[key], key));
	}
	else if(parts[0] === 'pot' || parts[0] === 'add') {
		const group = (parts[0] === 'pot') ? item.potential : item.additional;

		if(parts[1] === 'tier') {
			group.tier = raw;
		}
		else {
			const line = group.lines[+parts[2]];

			if(parts[1] === 'stat') {
				line.stat = raw;
				line.unit = ((POTENTIAL_STAT_MAP[raw] || {}).units || [])[0] || '';
				if(raw !== 'other') {
					line.text = '';
				}
				if(raw === '' || raw === 'other') {
					line.value = '';
				}

				setUnsaved(true);
				renderEditor();
				const back = editor.querySelector('[data-f="' + f + '"]');
				if(back) {
					back.focus();
				}
				renderSlot(selectedSlot);
				renderSummary();
				return;
			}

			if(parts[1] === 'unit') {
				line.unit = raw;
			}
			if(parts[1] === 'value') {
				line.value = (raw === '') ? '' : num;
			}
			if(parts[1] === 'text') {
				line.text = raw;
			}
		}
	}
	else if(f === 'starforce' || f === 'reqLevel') {
		item[f] = (raw === '') ? (f === 'starforce' ? 0 : '') : num;
	}
	else {
		item[f] = raw;
	}

	setUnsaved(true);
	renderSlot(selectedSlot);
	renderSummary();
});

/*=== Item Summary ===*/
const summary = $('summary');

// Renders starforce stars
function renderStars(n) {
	if(!n) { return ''; }

	const cap = Math.max(n, n <= 15 ? 15 : (n <= 25 ? 25 : 30));
	let html = '';
	for(let i = 1; i <= cap; i ++) {
		html += (i <= n) ? '★' : '<span class="off">★</span>';
		if(i % 15 === 0 && i < cap) {
			html += '<br>'
		}
		else if (i % 5 === 0 && i < cap) {
			html += '<span class="gap"></span>'
		}
	}

	return '<div class="stars">' + html + '</div>';
}

// Makes potential line into text
function potentialLineText(line) {
	if(!line || !line.stat) { return ''; }
	if(line.stat === 'other') {
		return line.text.trim();
	}

	const def = POTENTIAL_STAT_MAP[line.stat];
	if(!def || line.value === '' || line.value == null) { return '';}

	const v = +line.value;
	const suffix = (line.unit === '%') ? '%' : (line.unit === 'sec') ? ' sec': '';
	return def.l + ' ' + (v < 0 ? '' : '+') + v + suffix;
}

// Renders item summary current selectedSlot
function renderSummary() {
	const item = selectedSlot && getItem(selectedSlot);
	if(!item) {
		summary.innerHTML
			= '<p class="item-empty">Item preview appears here when an equipped slot is selected.</p>';
		return;
	}

	const tier = item.potential.tier;
	let h = renderStars(item.starforce);
	h += `<div class="item-title color-${tier}">${esc(item.name || 'Unnamed item')}</div>`;
	if(tier !== 'none') {
		h += `<div class="item-rank color-${tier}">(${TIER_LABEL[tier]} Item)</div>`;
	}
	h += '<hr>';
	h += `<div class="item-line">Slot: ${SLOT_MAP[selectedSlot].label}</div>`;
	if(item.reqLevel !== '' && item.reqLevel != null) {
		h += `<div class="item-line">Req. Level: ${esc(item.reqLevel)}</div>`;
	}

	const statLines = STATS.map(s => {
		const v = item.stats[s.k];
		if(!v) { return ''; }

		const total = statTotal(v, s.k);
		if(!total) { return ''; }

		const prcnt = s.p ? '%' : '';
		const extras = [['starforce', 'item-starforce'],['scroll', 'item-scroll'], ['flame', 'item-flame']].filter(pair => +v[pair[0]]);
		const breakdown = extras.length
			? ' (' + (+v.base || 0) + prcnt + ' ' + extras.map(pair => `<span class="${pair[1]}">${+v[pair[0]] > 0 ? '+' : ''}${+v[pair[0]]}${prcnt}</span>`).join(' ') + ')'
			: '';

		return `<div class="item-line"><strong>${s.l}: ${total > 0 ? '+' : ''}${total}${prcnt}</strong>${breakdown}</div>`;
	}).join('');

	if(statLines) {
		h += '<hr>' + statLines;
	}

	[['Potential', item.potential], ['Additional Potential', item.additional]].forEach(pair => {
		const title = pair[0];
		const group = pair[1];
		const filled = group.lines.map(potentialLineText).filter(t => t);

		if(group.tier === 'none' && !filled.length) { return; }

		h += 	`<hr>
				<div class="item-potential">
					<div class="item-potential-title color-${group.tier}">
						${title}${group.tier !=='none' ? ' (' + TIER_LABEL[group.tier] + ')' : ''}
					</div>
					${filled.map(t => `<div class="item-line">${esc(t)}</div>`).join('')
						|| '<div class="item-line item-empty">No lines entered</div>'}
					</div>`;
	});

	if(item.notes.trim()) {
		h += 	`<hr>
				<div class="item-line item-empty" style="white-space: pre-wrap">${esc(item.notes)}</div>`
	}

	h += 	`<div class="item-color-info">
				<span>Base</span>
				<span class="item-starforce">Star Force</span>
				<span class="item-scroll">Scroll / Other</span>
				<span class="item-flame">Flame</span>
			</div>`;

	summary.innerHTML = h;
}

/*=== Import/Export ===*/
const popup = $('popup');
const popupText = $('popup-text');
const popupMessage = $('popup-message');

// Opens popup with a title, text, and buttons
function openPopup(title, topHtml, actions, text, readOnly) {
	$('popup-title').textContent = title;
	$('popup-top').innerHTML = topHtml;
	popupText.value = text;
	popupText.readOnly = readOnly;
	popupMessage.textContent = '';
	$('id-popup-action').innerHTML = '';

	actions.forEach(a => {
		const btn = document.createElement('button');
		btn.textContent = a[0];
		
		if(a[1]) {
			btn.className = a[1];
		}

		btn.addEventListener('click', () => a[2](btn));
		$('id-popup-action').appendChild(btn);
	});

	popup.hidden = false;
	popupText.focus();
}

// Close popup
const closePopup = () => {
	popup.hidden = true;
};

// Close popup when clicking outside
popup.addEventListener('click', e => {
	if(e.target === popup) {
		closePopup();
	}
});

// Close popup when pressing escape
document.addEventListener('keydown', e => {
	if(e.key === 'Escape' && !popup.hidden) {
		closePopup();
	}
});

// Exporting, showing created JSON data to download or copy
$('btn-export').addEventListener('click', () => {
	const text = JSON.stringify(state, null, 2);

	openPopup('Export JSON', '', [
		['Download File', '', () => {
			const blob = new Blob([text], {type:'application/json'});
			const a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = 'maple-equipment-' + new Date().toISOString().slice(0,10) + '.json';
			document.body.appendChild(a);
			a.click();
			a.remove();
			setTimeout(() => URL.revokeObjectURL(a.href), 1000);
			setUnsaved(false);
			popupMessage.textContent = 'Download started. If no file appeared, copy the text instead.';
		}],
		['Copy', '', () => {
			const done = () => {
				setUnsaved(false);
				popupMessage.textContent = 'Copied to clipboard.';
			};

			if(navigator.clipboard) {
				navigator.clipboard.writeText(text).then(done).catch(() => {
					popupMessage.textContent = 'Copy blocked. Select the text and copy it manually.';
				});
			}
			else {
				popupText.select();
				document.execCommand('copy') ? done () : (popupMessage.textContent = 'Copy blocked. Select the text and copy it manually.');
			}
		}],
		['Close', '', closePopup],
	], text, true)
});

// Checks imported JSON to check if all fields are correct
function normalize(obj) {
	if(!obj || !Array.isArray(obj.profiles) || !obj.profiles.length) {
		throw new Error('No "profiles" list found in this JSON.');
	}

	obj.profiles.forEach(profile => {
		profile.id = profile.id || uid();
		
		['name', 'job', 'level'].forEach(k => {
			if(profile[k] == null) {
				profile[k] = '';
			}
		});
		profile.items = (profile.items && typeof profile.items === 'object') ? profile.items : {};

		Object.keys(profile.items).forEach(key => {
			const item = profile.items[key];
			if(!SLOT_MAP[key] || !item) {
				delete profile.items[key];
				return;
			}

			const merged = Object.assign(newItem(), item);
			merged.stats = (item.stats && typeof item.stats === 'object') ? item.stats : {};

			['potential', 'additional'].forEach(gk => {
				const src = item[gk] || {};
				merged[gk] = {
					tier: TIERS.includes(src.tier) ? src.tier : 'none',
					lines: [0, 1, 2].map(i => {
						const v = src.lines ? src.lines[i] : null;
						if(v && typeof v === 'object') {
							return Object.assign(emptyPotentialLine(), v);
						}
						const s = String(v == null ? '' : v).trim();
						return s ? {stat:'other', unit:'', value:'', text: s} : emptyPotentialLine();
					}),
				};
			});

			profile.items[key] = merged;
		});
	});

	if(!obj.profiles.some(profile => profile.id === obj.activeProfileId)) {
		obj.activeProfileId = obj.profiles[0].id;
	}
	obj.version = 2;

	return obj
}

// Import JSON by importing or pasting
$('btn-import').addEventListener('click', () => {
	openPopup('Import JSON', '<label>Choose a file, or paste JSON below<input type="file" id="input-file" accept=".json,application/json"></label>', 
		[
			['Load and Replace All Profiles', '', btn => {
				let parsed;

				try {
					parsed = normalize(JSON.parse(popupText.value));
				}
				catch(err) {
					popupMessage.textContent = 'Import failed: ' + err.message;
					return;
				}

				clickTwice(btn, 'Click Again to Replace Current Data', () => {
					state = parsed;
					selectedSlot = null;
					setUnsaved(false);
					renderAll();
					closePopup();
				});
			}],
			['Close', '', closePopup],
		], '', false
	);

	$('input-file').addEventListener('change', e => {
		const file = e.target.files[0];
		if(!file) { return; }

		file.text().then(t => {
			popupText.value = t;
			popupMessage.textContent = 'Loaded ' + file.name + '. Click Load to apply.';
		});
	});
});


// Renders entire page
function renderAll() {
	renderProfileBar();
	renderGrid();
	renderEditor();
	renderSummary();
}

// Start
renderAll();






