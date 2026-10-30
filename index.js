/* Background Palette v1.3.0 — CSS gradients; no external services or AI calls. */
const KEY = 'background_palette';
const PANEL_ID = 'stbp-panel';
const LAYER_ID = 'stbp-layer';
const MENU_ID = 'stbp-menu-entry';
const OPEN_COMMAND = 'bgpalette';
const MAX_PRESETS = 24;
const MAX_IMPORT_BYTES = 64 * 1024;
const SHARE_TYPE = 'sillytavern-background-palette';
const SHARE_VERSION = 1;
const DEFAULT = {
    enabled: false,
    mode: 'solid',
    colors: ['#181818', '#786685', '#E5CBD0', '#B7D6D3', '#C5D8F0'],
    threeColors: false,
    angle: 135,
    midpoint: 50,
    center: 'center',
    spread: 100,
    softness: 85,
    grain: 0,
    brightness: 100,
    saturation: 100,
    points: [[22, 25], [83, 18], [77, 87], [18, 80]],
};
const MODES = { solid: '단색', linear: '직선', radial: '원형', soft: '소프트', mesh: '메시', fog: '안개' };
const isMulti = mode => mode === 'mesh' || mode === 'fog';
const isAdvanced = mode => mode === 'soft' || isMulti(mode);
const CENTERS = {
    center: '가운데', top: '위', bottom: '아래', left: '왼쪽', right: '오른쪽',
    'top left': '왼쪽 위', 'top right': '오른쪽 위',
    'bottom left': '왼쪽 아래', 'bottom right': '오른쪽 아래',
};
const PRESETS = [
    { name: '차콜', mode: 'solid', colors: ['#181818', '#353535', '#707070'] },
    { name: '크림', mode: 'solid', colors: ['#EAE3D7', '#D8C4AD', '#AF9477'] },
    { name: '라벤더', mode: 'linear', colors: ['#343041', '#86768D', '#DCC8D1'], threeColors: true },
    { name: '가을빛', mode: 'linear', colors: ['#302521', '#735144', '#C89E70'], threeColors: true },
    { name: '새벽 바다', mode: 'linear', colors: ['#101B2C', '#344E68', '#7E9AA8'], threeColors: true },
    { name: '달무리', mode: 'radial', colors: ['#8D809F', '#242032', '#14141D'], threeColors: true },
    { name: '크림핑크', mode: 'radial', colors: ['#F2E1E3', '#DDD1C4', '#AD8C68', '#B7D6D3', '#C5D8F0'],
        threeColors: true, angle: 135, midpoint: 68, center: 'bottom',
        spread: 100, softness: 85, grain: 0, brightness: 100, saturation: 100,
        points: [[22, 25], [83, 18], [77, 87], [18, 80]] },
    { name: '한밤중 안개', mode: 'mesh', colors: ['#101B2C', '#344E68', '#7E9AA8', '#B7D6D3', '#C5D8F0'],
        threeColors: true, angle: 135, midpoint: 50, center: 'center',
        spread: 100, softness: 85, grain: 0, brightness: 100, saturation: 100,
        points: [[22, 25], [83, 18], [77, 87], [18, 80]] },
    { name: '로즈 베이지', mode: 'mesh', colors: ['#EAE6DC', '#C0A8A8', '#C2A9A9', '#F5F0D9', '#F2EADF'],
        threeColors: false, angle: 135, midpoint: 50, center: 'center',
        spread: 104, softness: 96, grain: 3, brightness: 100, saturation: 100,
        points: [[90, 3], [19, 93], [26, 6], [91, 92]] },
    { name: '할로윈 저녁', mode: 'mesh', colors: ['#DD933E', '#AE9FBA', '#AE9FBA', '#EBDDCD', '#F0C797'],
        threeColors: false, angle: 135, midpoint: 50, center: 'center',
        spread: 104, softness: 96, grain: 3, brightness: 100, saturation: 100,
        points: [[90, 3], [19, 93], [26, 6], [91, 92]] },
    { name: '잔상', mode: 'mesh', colors: ['#F5F3F0', '#CA96F3', '#BCF6EC', '#F8D7F3', '#F6F3F0'],
        threeColors: false, angle: 135, midpoint: 50, center: 'center',
        spread: 104, softness: 96, grain: 3, brightness: 100, saturation: 100,
        points: [[99, 5], [10, 100], [45, 55], [80, 68]] },
    { name: '잔상 저채도', mode: 'mesh', colors: ['#F5F3F0', '#CA96F3', '#BCF6EC', '#F8D7F3', '#F6F3F0'],
        threeColors: false, angle: 135, midpoint: 50, center: 'center',
        spread: 92, softness: 79, grain: 17, brightness: 100, saturation: 64,
        points: [[99, 5], [10, 100], [45, 55], [80, 68]] },
];
const ART_PRESETS = [
    { name: '블루 실크', mode: 'mesh', colors: ['#F2F3F6', '#A8BBDD', '#C2C3CF', '#AEC3E4', '#FAF7F1'],
        points: [[42, 27], [64, 58], [35, 94], [98, 65]], spread: 110, softness: 96, grain: 20 },
    { name: '숲 안개', mode: 'fog', colors: ['#040E15', '#8CA18B', '#667D66', '#284D4B', '#8CA385'],
        points: [[60, 100], [29, 52], [49, 3], [10, 100]], spread: 112, softness: 95, grain: 6 },
    { name: '크림 라일락', mode: 'mesh', colors: ['#EAE6DC', '#AFA8C0', '#B1A9C2', '#F5F0D9', '#F2EADF'],
        points: [[90, 3], [19, 93], [26, 6], [91, 92]], spread: 104, softness: 96, grain: 3 },
    { name: '오트 밀크', mode: 'fog', colors: ['#E8E3DC', '#AF977D', '#FEFFFF', '#D9CCBC', '#FCFCF5'],
        points: [[4, 83], [96, 91], [82, 4], [2, 0]], spread: 126, softness: 97, grain: 13 },
    { name: '민트 헤일로', mode: 'soft', colors: ['#D9F3EF', '#099FA6'], spread: 100, softness: 93, grain: 0 },
    { name: '레몬 소다', mode: 'soft', colors: ['#A7E1EB', '#FFFAD7'], spread: 88, softness: 94, grain: 20 },
];
let settings;
let root;
let syncDepth = 0;
let subscriptions = [];
let disposed = false;
let activePoint = 0;
let palettePopup = null;
let slashRegistration = null;
const context = () => globalThis.SillyTavern.getContext();
const $ = selector => root.querySelector(selector);

function restorePopup(session) {
    if (session.restored) return;
    session.restored = true;
    const { panel, marker } = session;
    syncDepth++;
    try {
        panel.classList.remove('stbp-in-popup');
        panel.open = session.wasOpen;
        if (!disposed && root === panel) {
            if (marker.isConnected) marker.replaceWith(panel);
            else {
                const target = document.getElementById('extensions_settings2') || document.getElementById('extensions_settings');
                if (target) target.append(panel);
                else panel.remove();
            }
        } else {
            marker.remove();
            panel.remove();
        }
    } finally {
        syncDepth--;
    }
    if (palettePopup === session) palettePopup = null;
    if (!disposed && root === panel && panel.isConnected) {
        update();
        const focus = session.returnFocus;
        if (focus?.isConnected && focus.getClientRects().length) focus.focus({ preventScroll: true });
    }
}

// Reuse the same editor so native pickers, saved combinations and control IDs stay in sync.
export async function openPalette() {
    if (disposed || !root) return '';
    if (palettePopup) {
        palettePopup.popup?.dlg?.focus({ preventScroll: true });
        return '';
    }
    const { Popup, POPUP_TYPE } = context();
    if (typeof Popup !== 'function' || !POPUP_TYPE) {
        globalThis.toastr?.info('이 버전에서는 확장 설정의 ‘배경 팔레트’를 이용해 주세요.');
        return '';
    }
    const focused = document.activeElement;
    const session = {
        panel: root,
        marker: document.createComment('Background Palette editor'),
        wasOpen: root.open,
        returnFocus: focused?.closest?.('#extensionsMenu') ? document.getElementById('extensionsMenuButton') : focused,
        popup: null,
        restored: false,
    };
    palettePopup = session;
    session.panel.before(session.marker);
    const content = document.createElement('div');
    content.className = 'stbp-popup-content';
    syncDepth++;
    try {
        session.panel.open = true;
        session.panel.classList.add('stbp-in-popup');
        content.append(session.panel);
    } finally {
        syncDepth--;
    }
    try {
        const popup = new Popup(content, POPUP_TYPE.TEXT, '', {
            okButton: '닫기',
            cancelButton: false,
            leftAlign: true,
            allowVerticalScrolling: true,
            onOpen: () => {
                if (!disposed && root === session.panel && !session.restored) update();
            },
            onClose: () => restorePopup(session),
        });
        session.popup = popup;
        popup.dlg.classList.add('stbp-dialog');
        popup.dlg.setAttribute('aria-label', '배경 팔레트 설정');
        await popup.show();
    } catch (error) {
        console.error('[Background Palette] Popup', error);
        globalThis.toastr?.error('설정창을 열지 못했어요. 확장 설정의 ‘배경 팔레트’를 이용해 주세요.');
    } finally {
        restorePopup(session);
    }
    return '';
}

function mountMenu() {
    const menu = document.getElementById('extensionsMenu');
    if (!menu || document.getElementById(MENU_ID)) return;
    const entry = document.createElement('div');
    entry.id = MENU_ID;
    entry.className = 'list-group-item flex-container flexGap5';
    entry.setAttribute('role', 'button');
    entry.setAttribute('aria-haspopup', 'dialog');
    entry.tabIndex = 0;
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-palette';
    icon.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.textContent = '배경 팔레트';
    entry.append(icon, label);
    // Let the normal wand-menu click handler close the menu after opening the editor.
    entry.addEventListener('click', () => { void openPalette(); });
    entry.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        entry.click();
    });
    menu.append(entry);
}

function registerShortcut() {
    if (slashRegistration) return;
    const { SlashCommandParser, SlashCommand } = context();
    if (!SlashCommandParser?.addCommandObject || !SlashCommand?.fromProps) return;
    if (SlashCommandParser.commands?.[OPEN_COMMAND]) {
        console.warn('[Background Palette] /bgpalette is already registered.');
        return;
    }
    const command = SlashCommand.fromProps({
        name: OPEN_COMMAND,
        callback: openPalette,
        helpString: '배경 팔레트 설정창을 엽니다. 빠른답장 버튼의 실행 내용으로 /bgpalette를 사용할 수 있어요.',
    });
    SlashCommandParser.addCommandObject(command);
    slashRegistration = { parser: SlashCommandParser, command };
}

function unregisterShortcut() {
    if (!slashRegistration) return;
    const { parser, command } = slashRegistration;
    for (const name of [command.name, ...(command.aliases || [])]) {
        if (parser.commands?.[name] === command) delete parser.commands[name];
    }
    slashRegistration = null;
}

function clamp(value, min, max, fallback) {
    const num = Number(value);
    return Number.isFinite(num) ? Math.min(max, Math.max(min, num)) : fallback;
}

// Restrict stored colors to literal hex, not CSS expressions or URLs.
function hex(value) {
    if (typeof value !== 'string') return null;
    let v = value.trim().replace(/^#/, '');
    if (!/^(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(v)) return null;
    if (v.length < 5) v = [...v].map(c => c + c).join('');
    if (v.length === 8 && v.slice(-2).toUpperCase() === 'FF') v = v.slice(0, 6);
    return '#' + v.toUpperCase();
}

function normalize(value = {}) {
    const v = value && typeof value === 'object' ? value : {};
    return {
        enabled: typeof v.enabled === 'boolean' ? v.enabled : DEFAULT.enabled,
        mode: Object.hasOwn(MODES, v.mode) ? v.mode : DEFAULT.mode,
        colors: DEFAULT.colors.map((c, i) => hex(v.colors?.[i]) || c),
        threeColors: v.threeColors === true,
        angle: Math.round(clamp(v.angle ?? DEFAULT.angle, 0, 360, DEFAULT.angle)),
        midpoint: Math.round(clamp(v.midpoint ?? DEFAULT.midpoint, 5, 95, DEFAULT.midpoint)),
        center: Object.hasOwn(CENTERS, v.center) ? v.center : DEFAULT.center,
        spread: Math.round(clamp(v.spread ?? DEFAULT.spread, 40, 180, DEFAULT.spread)),
        softness: Math.round(clamp(v.softness ?? DEFAULT.softness, 0, 100, DEFAULT.softness)),
        grain: Math.round(clamp(v.grain ?? 0, 0, 40, 0)),
        brightness: Math.round(clamp(v.brightness ?? 100, 25, 175, 100)),
        saturation: Math.round(clamp(v.saturation ?? 100, 0, 200, 100)),
        points: DEFAULT.points.map((point, i) => point.map((n, axis) =>
            Math.round(clamp(v.points?.[i]?.[axis] ?? n, 0, 100, n)))),
    };
}

function fade(color, opacity) {
    const c = color.slice(1);
    const alpha = (c.length === 8 ? parseInt(c.slice(6, 8), 16) / 255 : 1) * opacity;
    return `rgba(${parseInt(c.slice(0, 2), 16)}, ${parseInt(c.slice(2, 4), 16)}, ${parseInt(c.slice(4, 6), 16)}, ${alpha.toFixed(4)})`;
}

// Several eased stops avoid a visible ring without a full-screen blur filter.
function glow(color, location, width, height, softness, opacity = 1) {
    const core = (100 - softness) * 0.34;
    const stop = ratio => (core + (100 - core) * ratio).toFixed(2);
    return `radial-gradient(ellipse ${width.toFixed(2)}% ${height.toFixed(2)}% at ${location}, `
        + `${fade(color, opacity)} 0%, ${fade(color, opacity * .97)} ${stop(.1)}%, `
        + `${fade(color, opacity * .68)} ${stop(.36)}%, ${fade(color, opacity * .29)} ${stop(.62)}%, `
        + `${fade(color, opacity * .065)} ${stop(.82)}%, ${fade(color, 0)} 100%)`;
}

function paint(v) {
    const base = `linear-gradient(${v.colors[0]}, ${v.colors[0]})`;
    const scale = v.spread / 100;
    if (v.mode === 'soft') {
        return `${glow(v.colors[1], v.center, 66 * scale, 105 * scale, v.softness)}, ${base}`;
    }
    if (isMulti(v.mode)) {
        const sizes = v.mode === 'fog' ? [[69, 58], [47, 94], [54, 74], [55, 89]]
            : [[74, 94], [78, 92], [83, 98], [73, 99]];
        return v.points.map((point, i) => glow(v.colors[i + 1], `${point[0]}% ${point[1]}%`,
            sizes[i][0] * scale, sizes[i][1] * scale, v.softness, v.mode === 'fog' ? .94 : .9))
            .concat(base).join(', ');
    }
    if (v.mode === 'solid') return `linear-gradient(${v.colors[0]}, ${v.colors[0]})`;
    const stops = v.threeColors
        ? `${v.colors[0]} 0%, ${v.colors[1]} ${v.midpoint}%, ${v.colors[2]} 100%`
        : `${v.colors[0]} 0%, ${v.colors[1]} 100%`;
    return v.mode === 'radial'
        ? `radial-gradient(ellipse at ${v.center}, ${stops})`
        : `linear-gradient(${v.angle}deg, ${stops})`;
}

function load() {
    const raw = context().extensionSettings[KEY];
    settings = {
        ...normalize(raw),
        presets: (Array.isArray(raw?.presets) ? raw.presets : []).slice(0, MAX_PRESETS)
            .filter(p => p && typeof p.name === 'string')
            .map(p => ({ name: p.name.slice(0, 40), value: normalize(p.value) })),
    };
    context().extensionSettings[KEY] = settings;
}

function save() {
    context().extensionSettings[KEY] = settings;
    context().saveSettingsDebounced();
}

function renderBackground() {
    let layer = document.getElementById(LAYER_ID);
    if (!settings.enabled || disposed) {
        layer?.remove();
        return;
    }
    const host = document.getElementById('bg1');
    if (!host) {
        layer?.remove();
        return;
    }
    if (!layer) {
        layer = document.createElement('div');
        layer.id = LAYER_ID;
        layer.setAttribute('aria-hidden', 'true');
    }
    // Keep ST's own background-image and saved background/lock settings intact.
    // A translucent color reveals the current image; removing this layer restores it.
    if (layer.parentElement !== host) host.append(layer);
    layer.style.setProperty('--stbp-paint', paint(settings));
    layer.style.setProperty('--stbp-grain', settings.grain / 100);
    layer.style.setProperty('--stbp-brightness', settings.brightness / 100);
    layer.style.setProperty('--stbp-saturation', settings.saturation / 100);
}

function notice(text) {
    $('#stbp-notice').textContent = text;
}

function update({ pickers = true } = {}) {
    const gradient = settings.mode !== 'solid';
    const advanced = isAdvanced(settings.mode);
    const multi = isMulti(settings.mode);
    syncDepth++;
    try {
        $('#stbp-enabled').checked = settings.enabled;
        $('#stbp-status').textContent = settings.enabled ? '적용 중' : '꺼짐';
        $('#stbp-status').classList.toggle('stbp-active', settings.enabled);
        root.querySelectorAll('[data-mode]').forEach(b => {
            b.setAttribute('aria-pressed', String(b.dataset.mode === settings.mode));
        });
        $('#stbp-preview-paint').style.backgroundImage = paint(settings);
        $('#stbp-preview-label').textContent = MODES[settings.mode];
        $('#stbp-preview').style.setProperty('--stbp-grain', settings.grain / 100);
        $('#stbp-preview').style.setProperty('--stbp-brightness', settings.brightness / 100);
        $('#stbp-preview').style.setProperty('--stbp-saturation', settings.saturation / 100);
        root.classList.toggle('stbp-advanced', advanced);
        $('#stbp-gradient-options').hidden = !gradient || advanced;
        $('#stbp-linear-options').hidden = settings.mode !== 'linear';
        $('#stbp-radial-options').hidden = !['radial', 'soft'].includes(settings.mode);
        $('#stbp-mid-options').hidden = !gradient || advanced || !settings.threeColors;
        $('#stbp-art-options').hidden = !advanced;
        $('#stbp-point-options').hidden = !multi;
        $('#stbp-point-hint').hidden = !multi;
        $('#stbp-alpha-note').textContent = advanced
            ? 'A는 색의 투명도예요. 바탕이 불투명하면 기존 이미지는 가려져요.'
            : '색상 칸을 누르면 선택기가 열려요. A(투명도)를 낮추면 기존 이미지가 비쳐요.';
        $('#stbp-three').checked = settings.threeColors;
        for (let i = 0; i < DEFAULT.colors.length; i++) {
            const count = multi ? 5 : settings.mode === 'solid' ? 1 : advanced ? 2 : settings.threeColors ? 3 : 2;
            $(`#stbp-color-row-${i}`).hidden = i >= count;
            $(`#stbp-color-row-${i}`).classList.toggle('stbp-selected-color', multi && i === activePoint + 1);
            $(`#stbp-hex-${i}`).value = settings.colors[i];
            $(`#stbp-hex-${i}`).setCustomValidity('');
            if (pickers) {
                const picker = $(`#stbp-picker-${i}`);
                if (hex(picker.hex8 || picker.getAttribute('color')) !== settings.colors[i]) {
                    picker.setAttribute('color', settings.colors[i]);
                }
            }
            $(`#stbp-color-label-${i}`).textContent = advanced ? i === 0 ? '바탕' : multi ? `빛 ${i}` : '번짐 색' : !gradient ? '배경색'
                : i === 0 ? '시작 색' : i === 1 && settings.threeColors ? '중간 색' : '끝 색';
        }
        root.querySelectorAll('[data-point]').forEach((handle, i) => {
            handle.hidden = !multi;
            handle.style.left = `clamp(13px, ${settings.points[i][0]}%, calc(100% - 13px))`;
            handle.style.top = `clamp(13px, ${settings.points[i][1]}%, calc(100% - 13px))`;
            handle.setAttribute('aria-pressed', String(i === activePoint));
        });
        $('#stbp-point-select').value = activePoint;
        $('#stbp-pos-x').value = settings.points[activePoint][0];
        $('#stbp-pos-y').value = settings.points[activePoint][1];
        for (const key of ['spread', 'softness', 'grain', 'brightness', 'saturation']) {
            $(`#stbp-${key}`).value = settings[key];
            $(`#stbp-${key}-value`).textContent = `${settings[key]}%`;
        }
        $('#stbp-angle').value = settings.angle;
        $('#stbp-angle-number').value = settings.angle;
        $('#stbp-midpoint').value = settings.midpoint;
        $('#stbp-midpoint-value').textContent = `${settings.midpoint}%`;
        $('#stbp-center').value = settings.center;
        $('#stbp-enabled-note').textContent = settings.enabled
            ? '색을 바꾸면 화면에 바로 반영돼요. 설정은 자동 저장됩니다.'
            : '위의 스위치를 켜면 이 색상이 화면 전체 배경에 적용돼요.';
    } finally {
        syncDepth--;
    }
    renderBackground();
}

function change(values, options) {
    Object.assign(settings, values);
    update(options);
    save();
    notice('');
}

function applyPreset(value) {
    activePoint = 0;
    change({ ...normalize(value), enabled: true });
}

function renderSaved(selected = $('#stbp-saved').value) {
    const select = $('#stbp-saved');
    select.replaceChildren(new Option('저장한 조합 선택', ''));
    settings.presets.forEach((p, i) => select.add(new Option(p.name, String(i))));
    select.value = settings.presets[Number(selected)] && selected !== '' ? selected : '';
    $('#stbp-load').disabled = select.value === '';
    $('#stbp-delete').disabled = select.value === '';
    const quick = $('#stbp-quick');
    quick.replaceChildren(new Option(settings.presets.length ? '저장한 조합 선택' : '저장한 조합이 없어요', ''));
    settings.presets.forEach((p, i) => quick.add(new Option(p.name, String(i))));
    quick.disabled = settings.presets.length === 0;
    $('#stbp-export-all').disabled = settings.presets.length === 0;
}

function colorRow(i) {
    return `<div class="stbp-color-row" id="stbp-color-row-${i}">
        <label id="stbp-color-label-${i}" for="stbp-hex-${i}"></label>
        <input id="stbp-hex-${i}" class="text_pole stbp-hex" type="text" maxlength="9"
            spellcheck="false" autocomplete="off" aria-label="색상 ${i + 1} HEX 코드" placeholder="#181818">
        <toolcool-color-picker id="stbp-picker-${i}" color="${settings.colors[i]}"
            popup-position="right" button-width="34px" button-height="30px"
            aria-label="색상 ${i + 1} 선택기"></toolcool-color-picker>
    </div>`;
}

function mount() {
    const target = document.getElementById('extensions_settings2') || document.getElementById('extensions_settings');
    if (!target) throw new Error('확장 설정 패널을 찾을 수 없습니다.');
    root = document.createElement('details');
    root.id = PANEL_ID;
    root.innerHTML = `
        <summary><span><i class="fa-solid fa-palette" aria-hidden="true"></i> 배경 팔레트</span>
            <small id="stbp-status"></small></summary>
        <div class="stbp-body">
            <label class="stbp-toggle" for="stbp-enabled"><span>색상 배경 사용</span>
                <input id="stbp-enabled" type="checkbox" role="switch"></label>
            <p id="stbp-enabled-note" class="stbp-note"></p>
            <button id="stbp-open-popup" type="button" class="menu_button stbp-popup-launch">별도 설정창으로 열기</button>
            <div class="stbp-quick-row">
                <label for="stbp-quick">내 조합 바로 적용</label>
                <select id="stbp-quick" class="text_pole" aria-label="내 조합 바로 적용"></select>
            </div>
            <div class="stbp-modes" role="group" aria-label="배경 종류">
                <button type="button" data-mode="solid">단색</button>
                <button type="button" data-mode="linear">직선</button>
                <button type="button" data-mode="radial">원형</button>
                <button type="button" data-mode="soft">소프트</button>
                <button type="button" data-mode="mesh">메시</button>
                <button type="button" data-mode="fog">안개</button>
            </div>
            <div class="stbp-preview" id="stbp-preview"><div id="stbp-preview-paint"></div><span id="stbp-preview-label"></span>
                ${DEFAULT.points.map((_, i) => `<button type="button" class="stbp-point" data-point="${i}" hidden
                    aria-label="빛 ${i + 1} 위치, 방향키로 이동">${i + 1}</button>`).join('')}
            </div>
            <p class="stbp-note" id="stbp-point-hint">숫자를 끌어 빛이 번지는 위치를 옮겨보세요.</p>
            <div id="stbp-point-options">
                <div class="stbp-point-row">
                    <select class="text_pole" id="stbp-point-select" aria-label="위치를 조절할 빛">
                        ${DEFAULT.points.map((_, i) => `<option value="${i}">빛 ${i + 1}</option>`).join('')}
                    </select>
                    <label>X <input id="stbp-pos-x" class="text_pole" type="number" min="0" max="100" aria-label="빛의 가로 위치 (%)"></label>
                    <label>Y <input id="stbp-pos-y" class="text_pole" type="number" min="0" max="100" aria-label="빛의 세로 위치 (%)"></label>
                    <button id="stbp-shuffle" class="menu_button" type="button">배치 섞기</button>
                </div>
            </div>
            <div class="stbp-colors">${DEFAULT.colors.map((_, i) => colorRow(i)).join('')}</div>
            <div id="stbp-gradient-options">
                <label class="stbp-check"><input id="stbp-three" type="checkbox"> 3색으로 만들기</label>
                <button id="stbp-reverse" type="button" class="menu_button">색 순서 뒤집기</button>
            </div>
            <div id="stbp-linear-options" class="stbp-control">
                <label for="stbp-angle">방향</label><input id="stbp-angle" type="range" min="0" max="360" step="1">
                <span class="stbp-number-wrap"><input id="stbp-angle-number" type="number" min="0" max="360" step="1" aria-label="방향 각도">°</span>
            </div>
            <div id="stbp-radial-options" class="stbp-control">
                <label for="stbp-center">중심</label><select id="stbp-center" class="text_pole"></select>
            </div>
            <div id="stbp-mid-options" class="stbp-control">
                <label for="stbp-midpoint">중간 색 위치</label>
                <input id="stbp-midpoint" type="range" min="5" max="95" step="1">
                <output id="stbp-midpoint-value" for="stbp-midpoint"></output>
            </div>
            <div id="stbp-art-options">
                <div class="stbp-control"><label for="stbp-spread">번짐 크기</label>
                    <input id="stbp-spread" type="range" min="40" max="180" step="1"><output id="stbp-spread-value" for="stbp-spread"></output></div>
                <div class="stbp-control"><label for="stbp-softness">부드러움</label>
                    <input id="stbp-softness" type="range" min="0" max="100" step="1"><output id="stbp-softness-value" for="stbp-softness"></output></div>
            </div>
            <div class="stbp-control"><label for="stbp-grain">입자감</label>
                <input id="stbp-grain" type="range" min="0" max="40" step="1"><output id="stbp-grain-value" for="stbp-grain"></output></div>
            <p class="stbp-note" id="stbp-alpha-note"></p>
            <div class="stbp-finish-heading"><span>전체 색감</span>
                <button type="button" id="stbp-finish-reset" class="menu_button">기본값</button></div>
            <div class="stbp-control"><label for="stbp-brightness">밝기</label>
                <input id="stbp-brightness" type="range" min="25" max="175" step="1"><output id="stbp-brightness-value" for="stbp-brightness"></output></div>
            <div class="stbp-control"><label for="stbp-saturation">채도</label>
                <input id="stbp-saturation" type="range" min="0" max="200" step="1"><output id="stbp-saturation-value" for="stbp-saturation"></output></div>
            <p class="stbp-note">밝기·채도도 조합에 함께 저장돼요. 기본값은 각각 100%예요.</p>
            <div class="stbp-section-label">빛과 안개 조합</div><div id="stbp-art-presets" class="stbp-presets"></div>
            <details class="stbp-basic-presets"><summary>기본 조합</summary><div id="stbp-presets" class="stbp-presets"></div></details>
            <div class="stbp-section-label">내 조합</div>
            <div class="stbp-save-row">
                <input id="stbp-name" type="text" class="text_pole" maxlength="40" placeholder="조합 이름" aria-label="저장할 조합 이름">
                <button id="stbp-save" type="button" class="menu_button">저장</button>
            </div>
            <div class="stbp-save-row">
                <select id="stbp-saved" class="text_pole" aria-label="저장한 조합"></select>
                <button id="stbp-load" type="button" class="menu_button">적용</button>
                <button id="stbp-delete" type="button" class="menu_button">삭제</button>
            </div>
            <details class="stbp-sharing">
                <summary>조합 공유 · 백업</summary>
                <label class="stbp-share-name-label" for="stbp-share-name">공유 조합 이름 (선택)</label>
                <input id="stbp-share-name" class="text_pole" type="text" maxlength="40" placeholder="예: 민트 라일락" autocomplete="off">
                <div class="stbp-share-buttons">
                    <button id="stbp-copy" type="button" class="menu_button">현재 조합 복사</button>
                    <button id="stbp-export" type="button" class="menu_button">현재 조합 파일</button>
                    <button id="stbp-export-all" type="button" class="menu_button">내 조합 전체 백업</button>
                </div>
                <label for="stbp-share-text" class="stbp-share-name-label">공유 코드 / JSON</label>
                <textarea id="stbp-share-text" class="text_pole" rows="4" maxlength="65536"
                    spellcheck="false" placeholder="받은 공유 코드나 JSON을 붙여 넣어주세요."></textarea>
                <div class="stbp-share-buttons">
                    <button id="stbp-import-code" type="button" class="menu_button">코드 가져오기</button>
                    <button id="stbp-import-file" type="button" class="menu_button">JSON 파일 가져오기</button>
                    <input id="stbp-import-input" type="file" accept=".json,application/json,text/plain" hidden aria-label="가져올 조합 파일">
                </div>
                <p class="stbp-note">한 조합은 저장 후 바로 적용돼요. 전체 백업은 현재 배경을 유지하며 조합 목록에 추가해요.</p>
            </details>
            <p id="stbp-notice" role="status" aria-live="polite"></p>
            <button id="stbp-restore" type="button" class="menu_button stbp-restore">기존 이미지 배경으로 돌아가기</button>
            <p class="stbp-footnote">Background Palette 1.3 · 모든 채팅에 공통 적용</p>
        </div>`;
    target.append(root);
    Object.entries(CENTERS).forEach(([key, label]) => $('#stbp-center').add(new Option(label, key)));
    [...ART_PRESETS, ...PRESETS].forEach(preset => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'stbp-preset';
        const swatch = document.createElement('span');
        swatch.className = 'stbp-preset-swatch';
        const value = normalize(preset);
        swatch.style.backgroundImage = paint(value);
        swatch.style.filter = `brightness(${value.brightness / 100}) saturate(${value.saturation / 100})`;
        swatch.setAttribute('aria-hidden', 'true');
        button.append(swatch, document.createTextNode(preset.name));
        button.addEventListener('click', () => applyPreset(preset));
        $(ART_PRESETS.includes(preset) ? '#stbp-art-presets' : '#stbp-presets').append(button);
    });
}

function bind() {
    $('#stbp-open-popup').addEventListener('click', () => { void openPalette(); });
    root.querySelector(':scope > summary').addEventListener('click', e => {
        if (root.classList.contains('stbp-in-popup')) e.preventDefault();
    });
    $('#stbp-quick').addEventListener('change', e => {
        const selected = e.target.value;
        const preset = selected === '' ? null : settings.presets[Number(selected)];
        if (!preset) return;
        applyPreset(preset.value);
        $('#stbp-saved').value = selected;
        $('#stbp-load').disabled = false;
        $('#stbp-delete').disabled = false;
        // A shortcut, not a current-preset indicator; choosing the same preset works again.
        e.target.value = '';
        notice(`“${preset.name}” 조합을 적용했어요.`);
    });
    $('#stbp-enabled').addEventListener('change', e => change({ enabled: e.target.checked }));
    root.querySelectorAll('[data-mode]').forEach(button => {
        button.addEventListener('click', () => change({ mode: button.dataset.mode }));
    });
    for (let i = 0; i < DEFAULT.colors.length; i++) {
        const input = $(`#stbp-hex-${i}`);
        const commitHex = () => {
            const value = hex(input.value);
            if (!value) {
                input.setCustomValidity('HEX 색상을 입력해 주세요. 예: #181818, #AABBCC80');
                input.reportValidity();
                return;
            }
            settings.colors[i] = value;
            change({});
        };
        input.addEventListener('input', () => input.setCustomValidity(''));
        input.addEventListener('change', commitHex);
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); commitHex(); }
        });
        $(`#stbp-picker-${i}`).addEventListener('change', e => {
            if (syncDepth) return;
            const value = hex(e.detail?.hex8 || e.detail?.hex);
            if (!value || value === settings.colors[i]) return;
            settings.colors[i] = value;
            change({}, { pickers: false });
        });
        const picker = $(`#stbp-picker-${i}`);
        picker.addEventListener('click', e => {
            if (!root.classList.contains('stbp-in-popup')) return;
            const isPickerButton = e.composedPath().some(node =>
                node instanceof HTMLButtonElement && node.getRootNode() === picker.shadowRoot);
            // Make room for the native picker's flyout inside the scrolling dialog.
            if (isPickerButton) picker.scrollIntoView({ block: 'center', inline: 'nearest' });
        }, true);
    }
    $('#stbp-three').addEventListener('change', e => change({ threeColors: e.target.checked }));
    $('#stbp-reverse').addEventListener('click', () => {
        const last = settings.threeColors ? 2 : 1;
        [settings.colors[0], settings.colors[last]] = [settings.colors[last], settings.colors[0]];
        change({});
    });
    $('#stbp-angle').addEventListener('input', e => change({ angle: Number(e.target.value) }, { pickers: false }));
    $('#stbp-angle-number').addEventListener('change', e => change({ angle: Math.round(clamp(e.target.value, 0, 360, 135)) }));
    $('#stbp-center').addEventListener('change', e => change({ center: e.target.value }));
    $('#stbp-midpoint').addEventListener('input', e => change({ midpoint: Number(e.target.value) }, { pickers: false }));
    for (const key of ['spread', 'softness', 'grain', 'brightness', 'saturation']) {
        $(`#stbp-${key}`).addEventListener('input', e => change({ [key]: Number(e.target.value) }, { pickers: false }));
    }
    $('#stbp-finish-reset').addEventListener('click', () => change({ brightness: 100, saturation: 100 }, { pickers: false }));
    bindPoints();
    bindSharing();
    $('#stbp-restore').addEventListener('click', () => change({ enabled: false }));
    $('#stbp-save').addEventListener('click', () => {
        const name = shortName($('#stbp-name').value, '');
        if (!name) { notice('저장할 이름을 입력해 주세요.'); $('#stbp-name').focus(); return; }
        if (settings.presets.length >= MAX_PRESETS) { notice('조합은 최대 24개까지 저장할 수 있어요.'); return; }
        const uniqueName = uniquePresetName(name, new Set(settings.presets.map(p => p.name)));
        settings.presets.push({ name: uniqueName, value: normalize(settings) });
        save();
        renderSaved();
        $('#stbp-saved').value = String(settings.presets.length - 1);
        $('#stbp-load').disabled = false;
        $('#stbp-delete').disabled = false;
        $('#stbp-name').value = '';
        notice(`“${uniqueName}” 조합을 저장했어요.`);
    });
    $('#stbp-name').addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); $('#stbp-save').click(); }
    });
    $('#stbp-saved').addEventListener('change', () => {
        $('#stbp-load').disabled = $('#stbp-saved').value === '';
        $('#stbp-delete').disabled = $('#stbp-saved').value === '';
    });
    $('#stbp-load').addEventListener('click', () => {
        if ($('#stbp-saved').value === '') return;
        const preset = settings.presets[Number($('#stbp-saved').value)];
        if (preset) { applyPreset(preset.value); notice(`“${preset.name}” 조합을 적용했어요.`); }
    });
    $('#stbp-delete').addEventListener('click', () => {
        if ($('#stbp-saved').value === '') return;
        const index = Number($('#stbp-saved').value);
        const preset = settings.presets[index];
        if (!preset || !window.confirm(`“${preset.name}” 저장 조합을 삭제할까요?`)) return;
        settings.presets.splice(index, 1);
        save(); renderSaved(''); notice('저장한 조합을 삭제했어요. 현재 배경은 유지됩니다.');
    });
}

function shortName(name, fallback = '공유 조합') {
    return Array.from(typeof name === 'string' ? name.trim() : '').slice(0, 40).join('') || fallback;
}

function uniquePresetName(name, taken) {
    const base = shortName(name);
    let result = base;
    let i = 2;
    while (taken.has(result)) {
        const suffix = ` (${i++})`;
        result = Array.from(base).slice(0, 40 - suffix.length).join('') + suffix;
    }
    taken.add(result);
    return result;
}

function paletteData(value) {
    const { enabled, ...palette } = normalize(value);
    return palette;
}

function sharePacket() {
    return {
        type: SHARE_TYPE,
        version: SHARE_VERSION,
        name: shortName($('#stbp-share-name').value),
        palette: paletteData(settings),
    };
}

function encodeShare(packet) {
    const bytes = new TextEncoder().encode(JSON.stringify(packet));
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return 'STBP1:' + btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function validatePalette(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || !Object.hasOwn(MODES, value.mode)) {
        throw new Error('배경 종류를 확인해 주세요.');
    }
    if (value.threeColors !== undefined && typeof value.threeColors !== 'boolean') throw new Error('3색 설정이 올바르지 않아요.');
    const required = isMulti(value.mode) ? 5 : value.mode === 'solid' ? 1 : value.threeColors ? 3 : 2;
    if (!Array.isArray(value.colors) || value.colors.length < required || value.colors.length > 5 || !value.colors.every(c => hex(c))) {
        throw new Error('HEX 색상 값을 확인해 주세요.');
    }
    const bounds = { angle: [0, 360], midpoint: [5, 95], spread: [40, 180], softness: [0, 100], grain: [0, 40], brightness: [25, 175], saturation: [0, 200] };
    for (const [key, [min, max]] of Object.entries(bounds)) {
        if (value[key] !== undefined && (typeof value[key] !== 'number' || !Number.isFinite(value[key]) || value[key] < min || value[key] > max)) {
            throw new Error('조절 값의 범위가 올바르지 않아요.');
        }
    }
    if (value.center !== undefined && !Object.hasOwn(CENTERS, value.center)) throw new Error('중심 위치를 확인해 주세요.');
    if (value.points !== undefined && (!Array.isArray(value.points) || value.points.length !== 4
        || !value.points.every(p => Array.isArray(p) && p.length === 2
            && p.every(n => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 100)))) {
        throw new Error('빛의 위치 값을 확인해 주세요.');
    }
    // Only named fields leave this function; no arbitrary imported keys enter settings.
    return paletteData(value);
}

function parseShare(text) {
    let raw = String(text).trim();
    if (!raw) throw new Error('가져올 코드를 붙여 넣거나 파일을 선택해 주세요.');
    if (new TextEncoder().encode(raw).length > MAX_IMPORT_BYTES) throw new Error('64KB 이하의 조합 파일만 가져올 수 있어요.');
    if (raw.startsWith('STBP1:')) {
        const encoded = raw.slice(6).replace(/\s/g, '');
        if (!/^[A-Za-z0-9_-]+$/.test(encoded)) throw new Error('공유 코드가 올바르지 않아요.');
        try {
            const binary = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
            raw = new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
        } catch {
            throw new Error('공유 코드를 읽지 못했어요. 전체를 복사했는지 확인해 주세요.');
        }
    }
    let packet;
    try { packet = JSON.parse(raw); } catch { throw new Error('배경 팔레트 공유 코드 또는 JSON인지 확인해 주세요.'); }
    if (!packet || packet.type !== SHARE_TYPE) throw new Error('배경 팔레트의 조합 파일이 아니에요.');
    if (packet.version !== SHARE_VERSION) throw new Error('지원하지 않는 공유 형식이에요. 확장 버전을 확인해 주세요.');
    const single = Object.hasOwn(packet, 'palette');
    const batch = Object.hasOwn(packet, 'palettes');
    if (single === batch) throw new Error('조합 파일의 형식이 올바르지 않아요.');
    const items = single ? [{ name: packet.name, palette: packet.palette }] : packet.palettes;
    if (!Array.isArray(items) || !items.length || items.length > MAX_PRESETS) throw new Error('가져올 조합은 1~24개여야 해요.');
    const presets = items.map((item, i) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)
            || (item.name !== undefined && typeof item.name !== 'string')) throw new Error('조합 이름을 확인해 주세요.');
        return { name: shortName(item.name, single ? '공유 조합' : `가져온 조합 ${i + 1}`), value: validatePalette(item.palette) };
    });
    return { single, presets };
}

function importShare(text) {
    try {
        const parsed = parseShare(text);
        if (settings.presets.length + parsed.presets.length > MAX_PRESETS) {
            throw new Error(`현재 ${settings.presets.length}개 + 가져올 ${parsed.presets.length}개예요. 조합은 최대 24개까지 저장할 수 있어요.`);
        }
        // Validate the whole file and capacity before changing any setting.
        const taken = new Set(settings.presets.map(p => p.name));
        const incoming = parsed.presets.map(p => ({ name: uniquePresetName(p.name, taken), value: normalize(p.value) }));
        const first = settings.presets.length;
        settings.presets.push(...incoming);
        renderSaved(String(first));
        if (parsed.single) {
            applyPreset(incoming[0].value);
            notice(`“${incoming[0].name}” 조합을 저장하고 적용했어요.`);
        } else {
            save();
            notice(`${incoming.length}개 조합을 추가했어요. 상단의 ‘내 조합 바로 적용’에서 골라보세요.`);
        }
    } catch (error) {
        notice(error instanceof Error ? error.message : '조합을 가져오지 못했어요.');
    }
}

function downloadJSON(packet, filename) {
    const blob = new Blob([JSON.stringify(packet, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
}

async function copyCurrent() {
    const code = encodeShare(sharePacket());
    const field = $('#stbp-share-text');
    field.value = code;
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(code);
            if (!disposed && root) notice('현재 조합 코드를 복사했어요. 그대로 공유해 주세요.');
            return;
        }
    } catch { /* Local HTTP and some mobile browsers need a selectable text fallback. */ }
    if (disposed || !root) return;
    field.focus({ preventScroll: true });
    field.select();
    field.setSelectionRange(0, field.value.length);
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Keep the selected code available. */ }
    notice(copied ? '현재 조합 코드를 복사했어요.' : '복사가 제한된 브라우저예요. 선택된 코드를 길게 누르거나 Ctrl+C로 복사해 주세요.');
}

function bindSharing() {
    $('#stbp-copy').addEventListener('click', copyCurrent);
    $('#stbp-export').addEventListener('click', () => {
        downloadJSON(sharePacket(), 'background-palette.json');
        notice('현재 조합을 JSON 파일로 내보냈어요.');
    });
    $('#stbp-export-all').addEventListener('click', () => {
        if (!settings.presets.length) return;
        downloadJSON({ type: SHARE_TYPE, version: SHARE_VERSION,
            palettes: settings.presets.map(p => ({ name: p.name, palette: paletteData(p.value) })) }, 'background-palette-favorites.json');
        notice(`${settings.presets.length}개 저장 조합을 백업했어요.`);
    });
    $('#stbp-import-code').addEventListener('click', () => importShare($('#stbp-share-text').value));
    $('#stbp-import-file').addEventListener('click', () => $('#stbp-import-input').click());
    $('#stbp-import-input').addEventListener('change', async e => {
        const input = e.target;
        const file = input.files?.[0];
        if (!file) return;
        try {
            if (file.size > MAX_IMPORT_BYTES) throw new Error('64KB 이하의 조합 파일만 가져올 수 있어요.');
            const text = await file.text();
            if (!disposed && root) importShare(text);
        } catch (error) {
            if (!disposed && root) notice(error instanceof Error ? error.message : '파일을 읽지 못했어요.');
        } finally { input.value = ''; }
    });
}

function movePoint(index, x, y, persist = true) {
    settings.points[index] = [Math.round(clamp(x, 0, 100, 50)), Math.round(clamp(y, 0, 100, 50))];
    activePoint = index;
    update({ pickers: false });
    if (persist) save();
}

function bindPoints() {
    $('#stbp-point-select').addEventListener('change', e => { activePoint = Number(e.target.value); update({ pickers: false }); });
    for (const axis of ['x', 'y']) {
        $(`#stbp-pos-${axis}`).addEventListener('change', () => movePoint(activePoint, $('#stbp-pos-x').value, $('#stbp-pos-y').value));
    }
    $('#stbp-shuffle').addEventListener('click', () => {
        // Keep one light in each quadrant so a shuffle stays visually balanced.
        const points = DEFAULT.points.map((_, i) => [
            Math.round((i === 0 || i === 3 ? 5 : 55) + Math.random() * 40),
            Math.round((i < 2 ? 5 : 55) + Math.random() * 40),
        ]);
        change({ points });
    });
    root.querySelectorAll('[data-point]').forEach(handle => {
        const index = Number(handle.dataset.point);
        let pointerId = null;
        handle.addEventListener('pointerdown', e => {
            if (e.button !== 0 || pointerId !== null) return;
            e.preventDefault();
            activePoint = index;
            pointerId = e.pointerId;
            handle.setPointerCapture(pointerId);
            handle.focus({ preventScroll: true });
            update({ pickers: false });
        });
        handle.addEventListener('pointermove', e => {
            if (e.pointerId !== pointerId) return;
            const rect = $('#stbp-preview').getBoundingClientRect();
            movePoint(index, (e.clientX - rect.left) / rect.width * 100, (e.clientY - rect.top) / rect.height * 100, false);
        });
        const finish = e => {
            if (e.pointerId !== pointerId) return;
            pointerId = null;
            if (handle.hasPointerCapture(e.pointerId)) handle.releasePointerCapture(e.pointerId);
            save();
        };
        handle.addEventListener('pointerup', finish);
        handle.addEventListener('pointercancel', finish);
        handle.addEventListener('lostpointercapture', finish);
        handle.addEventListener('keydown', e => {
            const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
            if (!delta) return;
            e.preventDefault();
            const step = e.shiftKey ? 10 : 1;
            movePoint(index, settings.points[index][0] + delta[0] * step, settings.points[index][1] + delta[1] * step);
        });
    });
}

function subscribe(type, handler) {
    const { eventSource } = context();
    if (type && eventSource?.on) {
        eventSource.on(type, handler);
        subscriptions.push([type, handler]);
    }
}

function init() {
    if (document.getElementById(PANEL_ID)) return;
    disposed = false;
    try {
        load(); mount(); bind(); renderSaved(); update(); mountMenu(); registerShortcut();
        const { eventTypes } = context();
        subscribe(eventTypes?.APP_READY, () => { mountMenu(); registerShortcut(); renderBackground(); });
        subscribe(eventTypes?.CHAT_CHANGED, renderBackground);
        subscribe(eventTypes?.SETTINGS_LOADED_AFTER, () => { load(); renderSaved(); update(); });
        if (!customElements.get('toolcool-color-picker')) {
            notice('색상 선택기가 아직 준비되지 않았어요. HEX 코드를 직접 입력할 수 있어요.');
            customElements.whenDefined('toolcool-color-picker').then(() => {
                if (!disposed) { update(); notice(''); }
            });
        }
    } catch (error) {
        console.error('[Background Palette]', error);
        onDisable();
        globalThis.toastr?.error('배경 팔레트를 불러오지 못했어요. 새로고침 후 다시 확인해 주세요.');
    }
}

export function onDisable() {
    disposed = true;
    const session = palettePopup;
    if (session) {
        restorePopup(session);
        if (session.popup?.dlg?.open && !session.popup.dlg.hasAttribute('closing')) {
            void session.popup.complete(context().POPUP_RESULT?.CANCELLED ?? null).catch(error => {
                console.error('[Background Palette] Closing popup', error);
            });
        }
    }
    document.getElementById(MENU_ID)?.remove();
    unregisterShortcut();
    document.getElementById(LAYER_ID)?.remove();
    document.getElementById(PANEL_ID)?.remove();
    const source = context().eventSource;
    for (const [type, handler] of subscriptions) source?.removeListener?.(type, handler);
    subscriptions = [];
    root = null;
}

export function onEnable() { init(); }

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
