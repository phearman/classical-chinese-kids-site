// 文言文地圖(WY42-B2):照定案稿(docs/mockups/wy42/d-final.html)做的正式頁。
// 資料:places.js(各則、地點、國別)、borders/(世界歷史疆界切片,Cliopatria CC BY 4.0)、world-base.js(Natural Earth 底圖)。
// 標記:「AI 推算」=原文沒寫、AI 推算的年代或地點(含原文只寫國別、點標在該國都城的);地點推算的點加虛線圈。
import { initPage } from '../shared/page.js?v=81c892b';
import { escapeHTML as esc } from '../shared/terms.js?v=81c892b';
import { ERAS, STATES, ITEMS, PLACE_BY_ID, placeOf, coordsOf, sliceFor, isGuessed } from './places.js?v=81c892b';
import { WORLD_BASE as B } from './world-base.js?v=81c892b';
import { twCards, checkOf } from './taiwan-world.js?v=81c892b';

initPage({ paged: true });
const app = document.getElementById('app');
const NS = 'http://www.w3.org/2000/svg';
const COS = Math.cos((B.lat0 * Math.PI) / 180), K = B.width / ((B.box.e - B.box.w) * COS);
const P = ([lon, lat]) => [(lon - B.box.w) * COS * K, (B.box.n - lat) * K];
const TYPE = { lesson: '課文', person: '人物', comic: '成語漫畫' };
const PIN = { lesson: 'var(--accent)', person: '#4f6b8a', comic: 'var(--moss)' };
const GO = { lesson: '讀課文', person: '看人物', comic: '看漫畫' };
// 頁腳來源連結(新分頁開)
const CCBY = 'https://creativecommons.org/licenses/by/4.0/';
const L = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
const FILLS = ['#c9a27e', '#9fb38a', '#a9b7c9', '#d1a7a0', '#c2b37a', '#b3a2c4', '#8fb3ad', '#d4b48c', '#a8b98f', '#c7a3b4'];
// 各年代一開始看的範圍 [西經, 南緯, 東經, 北緯]
// 本土在別處、在臺灣也有領土的政權:國名另外標在臺灣島上([經度, 緯度])
const LABEL_AT = { 'tw-hx': { 'Dutch Republic': [120.55, 23.3], 'Spanish Empire': [121.65, 25.0] }, 'tw-rz': { 'Empire of Japan': [120.9, 23.6] } };
const CN = [96, 18, 128, 46], TW = [116.5, 20.5, 124.5, 26.5];
const VIEW = { myth: [104, 30, 122, 40.5], xia: [104, 30, 122, 40.5], shang: [104, 28, 124, 42], xz: [100, 26, 126, 44], cq: [105, 28.5, 122.5, 41], zg: [104, 28.5, 122.5, 41.5], qin: [98, 20, 126, 44],
  xh: [96, 20, 126, 45], dh: [96, 20, 126, 45], sg: [96, 18, 126, 45], xj: [96, 18, 128, 46], dj: [92, 18, 128, 46], nbc: [100, 20, 125, 44], sui: [90, 16, 130, 48], tang: [70, 14, 130, 50],
  wd: [96, 18, 128, 46], bs: CN, ns: CN, yuan: [70, 12, 145, 62], ming: [90, 16, 130, 48], qing: [88, 16, 130, 52], roc: [80, 15, 140, 54], prc: [80, 15, 140, 54], roctw: [108, 16, 128, 30],
  out: [62, 5, 125, 45], 'tw-pre': TW, 'tw-hx': TW, 'tw-mz': TW, 'tw-ql': TW, 'tw-rz': TW, 'tw-zh': TW };
// 航線的視野:包住所有點,四周留一點空白(WY48)
const routeView = (r) => { const xs = r.map((q) => q[1]), ys = r.map((q) => q[2]); const pad = Math.max(5, (Math.max(...xs) - Math.min(...xs)) * 0.15);
  const [x1, y1] = P([Math.min(...xs) - pad, Math.max(...ys) + pad]), [x2, y2] = P([Math.max(...xs) + pad, Math.min(...ys) - pad]); return [x1, y1, x2 - x1, y2 - y1]; };
const viewOf = (era) => { const [w, s, e, n] = VIEW[era]; const [x1, y1] = P([w, n]), [x2, y2] = P([e, s]); return [x1, y1, x2 - x1, y2 - y1]; };

// 完整朝代序列(WY47):沒有故事的年代也列出(灰色、標「尚無故事」),點了照樣切換疆界;track 切換中國朝代/臺灣時期線
const trackOf = (e) => e.track || 'cn';
const erasOf = (t) => ERAS.filter((e) => trackOf(e) === t);
const statesOf = (era) => STATES[era] || [];
const stateOf = (it) => statesOf(it.era).find((s) => s.id === it.state);
const itemsOf = (era) => ITEMS.filter((i) => i.era === era);
const groupsOf = (era) => [...statesOf(era).map((s) => [s, itemsOf(era).filter((i) => i.state === s.id)]), [null, itemsOf(era).filter((i) => !i.state)]].filter(([, a]) => a.length);
const noState = (era) => (era === 'myth' ? '傳說' : era === 'out' ? '域外' : '沒有國別');

// 標記(使用者裁 CPM 待裁 41 B):年代或地點由 AI 推算的(isGuessed),清單、說明一律標「AI 推算」並寫出依據;
// 地點是推算的(原文沒寫地點、只寫國別而點在都城、或古今對照待查證),地圖點另加虛線圈,選中時名牌也寫「AI 推算」
const yearGuess = (it) => it.basis === 'speaker' || it.basis === 'book';
const pointGuess = (it) => Boolean(it.placeGuess) || placeOf(it)?.status === '待查證';
const badges = (it) => (isGuessed(it) ? '<span class="cmap-ai">AI 推算</span>' : '');

const sp = new URLSearchParams(location.search);
const st = { era: ERAS.some((e) => e.id === sp.get('era')) ? sp.get('era') : 'cq', region: null, item: null, view: null, tab: 'list', polity: null, twc: null, route: null };
const pre = ITEMS.find((i) => i.title === sp.get('item'));
if (pre) Object.assign(st, { era: pre.era, region: pre.state, item: pre });
const eras = () => erasOf(trackOf(ERAS.find((e) => e.id === st.era)));
const cnt = (e) => itemsOf(e.id).length;
const mobile = () => matchMedia('(max-width: 767px)').matches;

app.innerHTML = `
  <main class="cmap" data-tab="list">
    <div class="cmap-tabs" role="tablist"><button type="button" role="tab" id="t-list" aria-selected="true">年代清單</button><button type="button" role="tab" id="t-map" aria-selected="false">地圖</button></div>
    <nav class="cmap-list" id="m-list" aria-label="年代清單"></nav>
    <section class="cmap-cards" id="m-cards" aria-label="年代清單"></section>
    <section class="cmap-right">
      <div class="cmap-axis"><div class="cmap-trk" role="group" aria-label="時間線"><button type="button" data-track="cn">朝代</button><button type="button" data-track="tw">臺灣</button></div><button type="button" class="cmap-nav" id="m-prev" aria-label="上一個年代">‹</button><div class="cmap-track" id="m-track"></div><button type="button" class="cmap-nav" id="m-next" aria-label="下一個年代">›</button></div>
      <div class="cmap-box" id="m-box">
        <svg class="cmap-svg" id="m-svg" role="img" aria-label="地圖"></svg>
        <div class="cmap-legend" id="m-legend"></div>
        <div class="cmap-tools"><button type="button" id="m-in" aria-label="放大">＋</button><button type="button" id="m-out" aria-label="縮小">－</button><button type="button" id="m-home" aria-label="回到這個年代的範圍">⌂</button></div>
        <p class="cmap-credit"><span>疆界:${L('https://github.com/Seshat-Global-History-Databank/cliopatria', 'Cliopatria')}(Seshat,${L(CCBY, 'CC BY 4.0')},經本站簡化)・地點座標:${L('https://www.geonames.org/', 'GeoNames')}(${L(CCBY, 'CC BY 4.0')})・部分國名:${L('https://www.wikidata.org/', 'Wikidata')}(${L('https://creativecommons.org/publicdomain/zero/1.0/', 'CC0')})・底圖:${L('https://www.naturalearthdata.com/', 'Natural Earth')}(${L('https://www.naturalearthdata.com/about/terms-of-use/', '公有領域')})・示意,非精確疆界</span></p>
      </div>
      <div class="cmap-detail" id="m-detail" aria-live="polite"></div>
    </section>
  </main>`;
const $ = (id) => app.querySelector(`#${id}`);
const root = app.querySelector('.cmap'), svg = $('m-svg'), box = $('m-box');

// ---------------------------------------------------------------- 臺灣時期線「當時的世界」說明卡(WY48)
const curCard = () => { const cs = twCards(st.era); return cs.find((c) => c.id === st.twc) || cs[0]; };
// 示意圖(WY49 卡 2):南島語族的語言族譜樹。依 Blust(1999)的分法,第一層 10 根大枝裡 9 根只在臺灣(左邊九行),
// 其他一千多種語言都在第 10 根「馬來—玻里尼西亞語族」上(最下面那根再分出許多小枝)。程式繪製,不是比例圖。
const FIGS = {
  austronesian: () => {
    const TW = ['泰雅語群', '東臺灣語群(阿美、噶瑪蘭等)', '卑南語', '排灣語', '魯凱語', '鄒語群', '布農語', '西部平原語群', '西北臺灣語群'];
    const row = 19, top = 22, rx = 18, bx = 70, H = top + row * 10 + 84;
    const ys = [...TW.map((_, i) => top + i * row), top + 9 * row + 22];
    const branch = (y, cls) => `<path d="M${rx} ${H / 2 - 10}C${bx - 30} ${H / 2 - 10} ${bx - 34} ${y} ${bx} ${y}" class="${cls}"/>`;
    const fan = Array.from({ length: 14 }, (_, i) => { const y2 = ys[9] - 16 + i * 4.6; return `<path d="M${bx + 92} ${ys[9]}L${bx + 160} ${y2}" class="t-mp"/>`; }).join('');
    return `<figure class="cmap-fig"><svg viewBox="0 0 340 ${H}" role="img" aria-label="南島語族族譜樹:第一層十根大枝,九根只在臺灣,其他一千多種語言都在第十根上">
      <rect x="${bx - 6}" y="${top - 12}" width="${340 - bx}" height="${row * 9 + 4}" rx="6" class="t-box"/>
      ${ys.map((y, i) => branch(y, i < 9 ? 't-tw' : 't-mp')).join('')}
      <circle cx="${rx}" cy="${H / 2 - 10}" r="5" class="t-root"/>
      ${TW.map((t, i) => `<circle cx="${bx}" cy="${ys[i]}" r="3.2" class="t-twd"/><text x="${bx + 7}" y="${ys[i] + 4}" class="t-lab">${t}</text>`).join('')}
      <path d="M${bx} ${ys[9]}L${bx + 92} ${ys[9]}" class="t-mp"/>${fan}
      <text x="${bx + 4}" y="${ys[9] - 6}" class="t-lab b">馬來—玻里尼西亞語族</text>
      <text x="${bx + 4}" y="${ys[9] + 56}" class="t-lab s">其他一千多種語言:菲律賓、印尼、馬達加斯加、太平洋島嶼…</text>
      <text x="${340 - 4}" y="${top - 2}" class="t-lab s" text-anchor="end">只在臺灣</text>
    </svg><figcaption>示意圖:第一層 10 根大枝,有 9 根只在臺灣(Blust 1999 的分法,本站繪製)</figcaption></figure>`;
  },
};

// 說明卡內文的一段:字串=一段文字;{ h, p }=小標+一段;{ list }=條列;{ fig }=示意圖(WY49)
const block = (b) => typeof b === 'string' ? `<p>${esc(b)}</p>`
  : b.list ? `<ul class="cmap-tw-list">${b.list.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`
  : b.fig ? FIGS[b.fig]?.() || '' : `${b.h ? `<h3>${esc(b.h)}</h3>` : ''}<p>${esc(b.p)}</p>`;
function twCardHTML() {
  const cs = twCards(st.era), c = curCard(); if (!c) return '';
  const sec = (h, t) => (t ? `<h3>${h}</h3><p>${esc(t)}</p>` : '');
  const chk = checkOf(c);
  return `<div class="cmap-card cmap-tw">
    ${cs.length > 1 ? `<div class="cmap-tw-tabs" role="group" aria-label="說明卡">${cs.map((x) => `<button type="button" data-card="${x.id}" aria-pressed="${x === c}">${esc(x.tab || x.title.replace(/\(.*$/, ''))}</button>`).join('')}</div>` : ''}
    <h2>${c.who ? '當時的世界:' : ''}${esc(c.title)}<span class="${chk === '已查證' ? 'cmap-ok' : 'cmap-ai'}">${chk}</span></h2>
    ${c.intro ? c.intro.map(block).join('') : sec('誰來了、從哪裡來', c.who) + sec('那時的世界', c.world) + sec('為什麼是臺灣', c.why) + sec(c.endLabel || '怎麼結束', c.end)}
    ${sec('在地的人', c.people)}
    ${c.todo?.length ? `<p class="cmap-src"><span class="cmap-ai">待查證</span> ${c.todo.map(esc).join(';')}</p>` : ''}
    ${c.route.length ? `<button type="button" class="cmap-go" data-route="${c.id}">${st.route === c.id && !mobile() ? '收起航線' : '在地圖上看示意航線 →'}</button>` : ''}
    <details class="cmap-src"><summary>出處(${c.src.length})</summary><ul>${c.src.map((x) => `<li><a href="${x.u}" target="_blank" rel="noopener">${esc(x.t)}</a> ${x.ok ? '已查證' : '<span class="cmap-ai">待查證</span>'}</li>`).join('')}</ul>
      <p>內容由本站依上列資料自行撰寫;航線只是示意,不是真正的航路。</p></details>
  </div>`;
}

// ---------------------------------------------------------------- 清單(桌機)、卡片(手機)、時間軸
function renderList() {
  $('m-list').innerHTML = eras().map((e) => `
    <div class="cmap-era${e.id === st.era ? ' open cur' : ''}${cnt(e) ? '' : ' none'}"><button type="button" data-era="${e.id}" aria-expanded="${e.id === st.era}"><b>${e.name}</b><small>${e.time}</small><span class="cmap-cnt">${cnt(e) || '尚無故事'}</span></button>
      <div class="cmap-era-body">${e.id !== st.era ? '' : groupsOf(e.id).map(([s, a]) => `
        <button type="button" class="cmap-st${s && st.region === s.id ? ' sel' : ''}" ${s ? `data-state="${s.id}"` : 'disabled'}>${s ? esc(s.name) : noState(e.id)}<span class="cmap-cnt">${a.length}</span></button>
        ${a.map((it) => `<button type="button" class="cmap-it${st.item === it ? ' sel' : ''}" data-i="${ITEMS.indexOf(it)}"><span class="cmap-ty ${it.t}">${TYPE[it.t]}</span>${esc(it.title)}${badges(it)}${coordsOf(it) ? '' : '<span class="cmap-nomap">無定點</span>'}</button>`).join('')}`).join('')}</div></div>`).join('');
}
function renderCards() {
  $('m-cards').innerHTML = `<div class="cmap-chips">${eras().map((e) => `<button type="button" data-era="${e.id}" aria-pressed="${e.id === st.era}"${cnt(e) ? '' : ' class="none"'}>${e.name} ${cnt(e) || '<small>尚無故事</small>'}</button>`).join('')}</div>` +
    (twCards(st.era).length ? twCardHTML() : cnt(ERAS.find((e) => e.id === st.era)) ? '' : '<p class="cmap-none-msg">這個年代尚無故事;切到「地圖」可以看當時的疆界。</p>') +
    groupsOf(st.era).map(([s, a]) => `<h3>${s ? esc(s.name) : noState(st.era)}<span class="cmap-cnt">${a.length}</span></h3><div class="cmap-grid">${a.map((it) => `
      <button type="button" class="cmap-cardbtn" data-i="${ITEMS.indexOf(it)}"><span><span class="cmap-ty ${it.t}">${TYPE[it.t]}</span> ${badges(it)}</span><b>${esc(it.title)}</b><small>${esc(it.text)}</small></button>`).join('')}</div>`).join('');
}
function renderAxis() {
  const t = trackOf(ERAS.find((e) => e.id === st.era));
  for (const b of app.querySelectorAll('.cmap-trk button')) b.setAttribute('aria-pressed', b.dataset.track === t);
  $('m-track').innerHTML = eras().map((e) => `<button type="button" class="cmap-stop${e.id === st.era ? ' cur' : ''}${cnt(e) ? '' : ' none'}" data-era="${e.id}" aria-pressed="${e.id === st.era}"><b>${e.name}</b><small>${cnt(e) ? `${cnt(e)} 則` : '尚無故事'}</small></button>`).join('');
  const tr = $('m-track'), cur = tr.querySelector('.cur'); // 目前的年代捲到中間、看得見(不用 scrollIntoView,免得整頁跟著捲)
  if (cur) tr.scrollLeft = cur.offsetLeft - tr.offsetLeft - (tr.clientWidth - cur.offsetWidth) / 2;
}
function renderDetail() {
  const it = st.item, d = $('m-detail');
  if (st.polity && !it) {
    const p = st.polity;
    d.innerHTML = `<div class="cmap-card"><h2>${esc(p.z)}${p.nt ? '<span class="cmap-ai">AI 判斷</span>' : ''}${p.zs === 'ai' ? '<span class="cmap-ai">國名 AI 整理</span>' : p.zs === 'wikidata' ? '' : '<span class="cmap-cap">中文名待補</span>'}</h2>
      <p>${esc(p.n)}・這份疆界資料記它存在於 ${yearText(p.y[0])}~${yearText(p.y[1])}</p>${p.nt ? `<p class="cmap-src">${esc(p.nt)}</p>` : ''}
      ${p.bn ? `<p class="cmap-src">${esc(p.bn)}</p>` : ''}<p class="cmap-src">中文名${p.zs === 'ai' ? '由 AI 整理、待校' : p.zs === 'wikidata' ? '取自 Wikidata' : '還沒有,先顯示英文'}。${BORDER_NOTE}</p></div>`;
    return;
  }
  if (!it && twCards(st.era).length) {
    const c = curCard();
    d.innerHTML = mobile() ? `<div class="cmap-card empty">${st.route ? `示意航線:${c.route.map((q) => esc(q[0])).join(' → ')}` : `「當時的世界」說明卡在「年代清單」分頁。`}</div>` : twCardHTML();
    return;
  }
  if (!it) {
    const keys = [sliceFor(st.era) ? '<i class="cmap-sw bare"></i>灰色斜線=當時沒有國家政權的地區(不代表無人居住)' : '', itemsOf(st.era).some(pointGuess) ? '<i class="cmap-sw guess"></i>點加虛線圈=地點 AI 推算' : ''].filter(Boolean);
    d.innerHTML = `<div class="cmap-card empty">${mobile() ? '點清單裡任一則,地圖會標出它發生的地方。' : '點左邊任一則,地圖會標出它發生的地方;拖曳地圖可以看同時期的其他國家。'}
      ${keys.length ? `<p class="cmap-keys">${keys.join('　')}</p>` : ''}${sliceFor(st.era) ? `<p class="cmap-src">${BORDER_NOTE}</p>` : ''}</div>`;
    return;
  }
  const era = ERAS.find((e) => e.id === it.era), s = stateOf(it), pl = placeOf(it);
  const when = it.basis === 'myth' ? `神話,不推算年代(${esc(it.when)})`
    : it.basis === 'text' ? `${era.name}(原文:${esc(it.when)})`
    : `${era.name} <span class="cmap-ai">AI 推算</span> 原文沒寫年代(${esc(it.when)}),依${it.basis === 'speaker' ? '說故事的人的時代' : '成書時代'}推算`;
  let where = `${s ? esc(s.name) + '・' : ''}${esc(it.text)}`;
  if (it.placeGuess) where += ` <span class="cmap-ai">AI 推算</span> ${esc(it.placeGuess)}`;
  if (pl) where += `<br><small class="cmap-src">今地:${esc(pl.modern)}${pl.status === '待查證' ? ' <span class="cmap-ai">AI 推算</span> 古今對照待查證' : `(${esc(pl.src)})`}</small>`;
  if (!coordsOf(it)) where += '<br><small class="cmap-src">這則沒有確定地點,地圖上不標點。</small>';
  d.innerHTML = `<div class="cmap-card"><h2><span class="cmap-ty ${it.t}">${TYPE[it.t]}</span>${esc(it.title)}</h2>
    <p>年代:${when}</p><p>地點:${where}</p><p class="cmap-src">出處:${esc(it.src)}${it.sub ? '　' + esc(it.sub) : ''}</p>
    <a class="cmap-go" href="../${it.href}">${GO[it.t]} →</a><button type="button" class="cmap-back" id="m-back">← 回清單</button></div>`;
  $('m-back')?.addEventListener('click', () => setTab('list'));
}
// 每張疆界切片都附的說明(CPM 2026-10-31):資料來源、示意、參考書目(只列書名,不抄任何圖)
const BORDER_NOTE = '疆界依 Cliopatria 學術資料庫,邊界經簡化,細部與史書有出入,僅供示意;正式考據可參考譚其驤《中國歷史地圖集》。';
const yearText = (y) => (y < 0 ? `前 ${-y} 年` : `${y} 年`);

// ---------------------------------------------------------------- 地圖
const el = (tag, attrs = {}, text) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (text != null) e.textContent = text; return e; };
const cache = new Map();
async function slice(name, level) {
  const key = `${name}-${level}`;
  if (!cache.has(key)) cache.set(key, fetch(`borders/${key}.json`).then((r) => (r.ok ? r.json() : null)).then((j) => {
    if (j) for (const p of j.polities) { const n = p.d.match(/-?\d+/g).map(Number); let [x1, y1, x2, y2] = [Infinity, Infinity, -Infinity, -Infinity]; for (let i = 0; i < n.length; i += 2) { x1 = Math.min(x1, n[i]); x2 = Math.max(x2, n[i]); y1 = Math.min(y1, n[i + 1]); y2 = Math.max(y2, n[i + 1]); } p.w = x2 - x1; p.h = y2 - y1; }
    return j;
  }).catch(() => null));
  return cache.get(key);
}
const vb = () => svg.getAttribute('viewBox').split(' ').map(Number);
const unitsPerPx = (v = vb()) => 1 / Math.min(svg.clientWidth / v[2], svg.clientHeight / v[3]);
let drawSeq = 0;
async function drawMap() {
  const seq = ++drawSeq;
  const v = st.view || viewOf(st.era);
  svg.setAttribute('viewBox', v.join(' '));
  const u = unitsPerPx(v);
  const name = sliceFor(st.era, st.region || st.item?.state);
  const data = name ? await slice(name, v[2] > 3000 ? 'world' : 'detail') : null;
  if (seq !== drawSeq) return; // 已有更新的一次重畫
  const frag = document.createDocumentFragment();
  frag.append(el('path', { d: B.land, class: 'm-land' }));
  if (data) { // 當時沒有國家政權的陸地:灰色斜線(各政權底下先鋪一層不透明底色蓋掉斜線)
    const pat = el('pattern', { id: 'm-hatch', patternUnits: 'userSpaceOnUse', width: 8 * u, height: 8 * u, patternTransform: 'rotate(45)' });
    pat.append(el('rect', { width: 8 * u, height: 8 * u, class: 'm-hatch-bg' }), el('rect', { width: 3 * u, height: 8 * u, class: 'm-hatch-ln' }));
    const defs = el('defs'); defs.append(pat); frag.append(defs);
    frag.append(el('path', { d: B.land, class: 'm-bare', fill: 'url(#m-hatch)' }));
  }
  for (const k of ['huang', 'yangtze', 'han']) frag.append(el('path', { d: B[k], class: 'm-river' }));
  const selState = statesOf(st.era).find((s) => s.id === (st.region || st.item?.state));
  const counts = {}; for (const it of itemsOf(st.era)) if (it.state) counts[it.state] = (counts[it.state] || 0) + 1;
  if (data) {
    const base = el('g', { class: 'm-polbase' });
    for (const p of data.polities) base.append(el('path', { d: p.d }));
    frag.append(base);
    const g = el('g', { class: 'm-pols' + (selState?.clio || st.polity ? ' has-sel' : '') });
    data.polities.forEach((p, i) => {
      const path = el('path', { d: p.d, class: 'm-pol' + ((selState?.clio === p.n || st.polity?.n === p.n) ? ' sel' : ''), fill: FILLS[i % FILLS.length] });
      path.addEventListener('click', () => { if (dragged) return; st.polity = st.polity?.n === p.n ? null : p; st.item = null; st.region = statesOf(st.era).find((s) => s.clio === p.n)?.id || null; update(); });
      g.append(path);
    });
    frag.append(g);
    const fs = 13 * u;
    for (const p of data.polities) { // 國名:畫面上太小的國家不寫字,放大後才出現
      if (p.w / u < 40 || p.h / u < 14) continue;
      frag.append(el('text', { x: p.l[0], y: p.l[1] + fs * 0.35, class: 'm-pname' + (p.zs === 'ai' ? ' ai' : p.zs === 'wikidata' ? '' : ' en'), 'font-size': (p.w / u > 140 ? fs * 1.25 : fs).toFixed(1) }, p.nt ? `${p.z}?` : p.z));
    }
    for (const [n, at] of Object.entries(LABEL_AT[st.era] || {})) { // 本土在別處的政權,在臺灣島上再標一次國名
      const p = data.polities.find((q) => q.n === n); if (!p) continue;
      const [x, y] = P(at);
      frag.append(el('text', { x, y: y + fs * 0.35, class: 'm-pname' + (p.zs === 'ai' ? ' ai' : p.zs === 'wikidata' ? '' : ' en'), 'font-size': fs.toFixed(1) }, p.nt ? `${p.z}?` : p.z));
    }
  } else {
    const msg = { myth: '神話沒有國別,只標原文寫到的山川', out: '佛經故事,發生在古印度', xia: '夏:傳說/考古推定,疆界資料沒有夏', 'tw-pre': '疆界資料沒有這時期的臺灣政權' }[st.era] || '';
    const at = { out: [80, 22], 'tw-pre': [120.9, 23.6] }[st.era] || [113, 36];
    const [x, y] = P(at);
    frag.append(el('text', { x, y, class: 'm-none', 'font-size': (15 * u).toFixed(1) }, msg));
  }
  // 都城(★)與數量泡泡
  for (const s of statesOf(st.era)) {
    const cap = PLACE_BY_ID[s.capital]; if (!cap) continue;
    const [x, y] = P(cap.at); const r = 4 * u;
    frag.append(el('path', { d: star(x, y, r), class: 'm-cap' }));
    if (counts[s.id]) {
      const bx = x + 9 * u, by = y - 9 * u;
      frag.append(el('circle', { cx: bx, cy: by, r: 8 * u, class: 'm-bub' }));
      frag.append(el('text', { x: bx, y: by + 3.8 * u, class: 'm-bubt', 'font-size': (11 * u).toFixed(1) }, counts[s.id]));
    }
  }
  // 各則的點
  for (const it of itemsOf(st.era)) {
    const at = coordsOf(it); if (!at) continue;
    const [x, y] = P(at); const on = st.item === it;
    const g = el('g', { class: 'm-pin' + (pointGuess(it) ? ' guess' : '') + (st.region && it.state !== st.region && !on ? ' dim' : '') });
    if (on) g.append(el('circle', { cx: x, cy: y, r: 11 * u, class: 'm-pulse', stroke: PIN[it.t] }));
    if (pointGuess(it)) g.append(el('circle', { cx: x, cy: y, r: (on ? 9 : 7) * u, class: 'm-guess', stroke: PIN[it.t] }));
    g.append(el('circle', { cx: x, cy: y, r: (on ? 6 : 4) * u, fill: PIN[it.t] }));
    g.append(el('title', {}, pointGuess(it) ? `${it.title}(地點 AI 推算)` : it.title));
    g.addEventListener('click', (ev) => { ev.stopPropagation(); if (!dragged) pick(it); });
    frag.append(g);
  }
  // 選中的那一則:路線+名牌
  if (st.item && coordsOf(st.item)) {
    const [x, y] = P(coordsOf(st.item));
    if (st.item.to) {
      const [x2, y2] = P(PLACE_BY_ID[st.item.to].at); const mx = (x + x2) / 2 - (y2 - y) * 0.18, my = (y + y2) / 2 + (x2 - x) * 0.18;
      frag.append(el('path', { d: `M${x} ${y}Q${mx} ${my} ${x2} ${y2}`, class: 'm-route' }));
      const a = Math.atan2(y2 - my, x2 - mx), h = 10 * u;
      frag.append(el('path', { d: `M${x2} ${y2}L${x2 - h * Math.cos(a - 0.45)} ${y2 - h * Math.sin(a - 0.45)}L${x2 - h * Math.cos(a + 0.45)} ${y2 - h * Math.sin(a + 0.45)}Z`, class: 'm-routeHead' }));
    }
    const tag = pointGuess(st.item) ? `${st.item.title}・AI 推算` : st.item.title;
    const fs = 14 * u, w = (tag.length + 1) * fs;
    let lx = x + 9 * u; if (lx + w > v[0] + v[2] - 50 * u) lx = x - 9 * u - w;
    frag.append(el('rect', { x: lx, y: y - fs * 1.6, width: w, height: fs * 1.5, rx: 4 * u, class: 'm-tag' }));
    frag.append(el('text', { x: lx + fs * 0.5, y: y - fs * 0.45, class: 'm-tagt', 'font-size': fs.toFixed(1) }, tag));
  }
  // 臺灣時期說明卡的示意航線(WY48):依序連線,每段一個箭頭,站名標在點旁
  const rc = st.route && twCards(st.era).find((c) => c.id === st.route);
  if (rc) {
    const pts = rc.route.map((q) => P([q[1], q[2]])), fs = 13 * u;
    pts.slice(1).forEach(([x2, y2], i) => {
      const [x, y] = pts[i], mx = (x + x2) / 2 - (y2 - y) * 0.12, my = (y + y2) / 2 + (x2 - x) * 0.12;
      frag.append(el('path', { d: `M${x} ${y}Q${mx} ${my} ${x2} ${y2}`, class: 'm-route' }));
      const a = Math.atan2(y2 - my, x2 - mx), h = 10 * u;
      frag.append(el('path', { d: `M${x2} ${y2}L${x2 - h * Math.cos(a - 0.45)} ${y2 - h * Math.sin(a - 0.45)}L${x2 - h * Math.cos(a + 0.45)} ${y2 - h * Math.sin(a + 0.45)}Z`, class: 'm-routeHead' }));
    });
    rc.route.forEach((q, i) => {
      const [x, y] = pts[i], w = (q[0].length + 1) * fs;
      let lx = x + 8 * u; if (lx + w > v[0] + v[2] - 50 * u) lx = x - 8 * u - w; // 靠右邊的站名改放左邊,免得被裁掉或被縮放鈕蓋住
      frag.append(el('circle', { cx: x, cy: y, r: 5 * u, class: 'm-stop' }));
      frag.append(el('rect', { x: lx, y: y - fs * 1.3, width: w, height: fs * 1.5, rx: 4 * u, class: 'm-tag' }));
      frag.append(el('text', { x: lx + fs * 0.5, y: y - fs * 0.15, class: 'm-tagt', 'font-size': fs.toFixed(1) }, q[0]));
    });
  }
  svg.replaceChildren(frag);
  const era = ERAS.find((e) => e.id === st.era);
  $('m-legend').innerHTML = `<p><b>${era.name}</b> ${era.time}${name ? `・疆界是 ${yearText(+name.replace('bc', '-'))}左右的樣子` : ''}${era.note ? `・${era.note}` : ''}・國名加虛線=AI 整理・帶「?」=原資料有疑問,點國家看說明${name ? '・<i class="cmap-sw bare"></i>灰色斜線=當時沒有國家政權的地區(不代表無人居住)' : ''}${itemsOf(st.era).some(pointGuess) ? '・<i class="cmap-sw guess"></i>點加虛線圈=地點 AI 推算' : ''}</p>`;
}
function star(x, y, r) {
  let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; d += (i ? 'L' : 'M') + (x + Math.cos(a) * rr).toFixed(1) + ' ' + (y + Math.sin(a) * rr).toFixed(1); }
  return d + 'Z';
}

// ---------------------------------------------------------------- 互動
function update() { renderList(); renderCards(); renderAxis(); renderDetail(); if (!mobile() || st.tab === 'map') drawMap(); }
function setEra(id) { Object.assign(st, { era: id, region: null, item: null, view: null, polity: null, twc: null, route: null }); update(); }
function pick(it) { Object.assign(st, { item: it, region: it.state, view: null, polity: null }); if (mobile()) setTab('map'); else update(); }
function setTab(t) {
  st.tab = t; root.dataset.tab = t;
  $('t-list').setAttribute('aria-selected', t === 'list'); $('t-map').setAttribute('aria-selected', t === 'map');
  update(); app.scrollTop = 0;
}
$('t-list').addEventListener('click', () => setTab('list'));
$('t-map').addEventListener('click', () => setTab('map'));
const go = (d) => { const list = eras(), i = list.findIndex((e) => e.id === st.era) + d; if (list[i]) setEra(list[i].id); };
$('m-prev').addEventListener('click', () => go(-1));
$('m-next').addEventListener('click', () => go(1));
app.addEventListener('click', (ev) => {
  const b = ev.target.closest('button'); if (!b || !app.contains(b)) return;
  if (b.dataset.card) { st.twc = b.dataset.card; st.route = null; st.view = null; update(); return; }
  if (b.dataset.route) { // 看航線:地圖移到包住整條航線的範圍;桌機再按一次收起
    const c = twCards(st.era).find((x) => x.id === b.dataset.route);
    const off = st.route === c.id && !mobile();
    Object.assign(st, { twc: c.id, route: off ? null : c.id, view: off ? null : routeView(c.route), item: null, polity: null });
    if (mobile() && !off) setTab('map'); else update();
    return;
  }
  if (b.dataset.era) setEra(b.dataset.era);
  else if (b.dataset.track) setEra(b.dataset.track === 'tw' ? 'tw-hx' : 'cq');
  else if (b.dataset.state) { Object.assign(st, { region: st.region === b.dataset.state ? null : b.dataset.state, item: null, polity: null }); update(); }
  else if (b.dataset.i) pick(ITEMS[+b.dataset.i]);
});

// 拖曳、雙指縮放、滾輪縮放:移動中只改 viewBox,停下來再重畫(字的大小、要載入粗/細切片都重算)
const W = B.width, H = B.height;
const clamp = ([x, y, w, h]) => { const r = h / w; w = Math.min(Math.max(w, 150), W); h = w * r; return [Math.min(Math.max(x, -w * 0.3), W - w * 0.7), Math.min(Math.max(y, -h * 0.3), H - h * 0.7), w, h]; };
const ptrs = new Map(); let start = null, dragged = false, settle = 0;
const commit = () => { clearTimeout(settle); settle = setTimeout(() => { st.view = vb(); drawMap(); }, 140); };
box.addEventListener('pointerdown', (e) => { if (e.target.closest('.cmap-tools')) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]); start = { v: vb(), p: [...ptrs.values()].map((p) => [...p]), u: unitsPerPx() }; dragged = false; });
box.addEventListener('pointermove', (e) => {
  if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  const p = [...ptrs.values()], [x, y, w, h] = start.v;
  if (p.length === 1 && start.p.length === 1) {
    const dx = p[0][0] - start.p[0][0], dy = p[0][1] - start.p[0][1];
    if (!dragged && Math.hypot(dx, dy) > 6) { dragged = true; box.classList.add('drag'); box.setPointerCapture(e.pointerId); }
    if (dragged) svg.setAttribute('viewBox', clamp([x - dx * start.u, y - dy * start.u, w, h]).join(' '));
  } else if (p.length === 2 && start.p.length === 2) {
    dragged = true;
    const d0 = Math.hypot(start.p[0][0] - start.p[1][0], start.p[0][1] - start.p[1][1]), d1 = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]);
    const k = d0 / Math.max(d1, 1); svg.setAttribute('viewBox', clamp([x + (w - w * k) / 2, y + (h - h * k) / 2, w * k, h * k]).join(' '));
  }
});
const end = (e) => {
  if (!ptrs.delete(e.pointerId)) return;
  box.classList.remove('drag');
  if (ptrs.size) start = { v: vb(), p: [...ptrs.values()].map((p) => [...p]), u: unitsPerPx() };
  if (dragged) commit();
  setTimeout(() => { if (!ptrs.size) dragged = false; }, 0);
};
box.addEventListener('pointerup', end); box.addEventListener('pointercancel', end);
const zoom = (k, cx = 0.5, cy = 0.5) => { const [x, y, w, h] = vb(); svg.setAttribute('viewBox', clamp([x + w * cx * (1 - k), y + h * cy * (1 - k), w * k, h * k]).join(' ')); commit(); };
box.addEventListener('wheel', (e) => { e.preventDefault(); const r = svg.getBoundingClientRect(); zoom(e.deltaY > 0 ? 1.2 : 1 / 1.2, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); }, { passive: false });
$('m-in').addEventListener('click', () => zoom(1 / 1.5));
$('m-out').addEventListener('click', () => zoom(1.5));
$('m-home').addEventListener('click', () => { st.view = st.route ? routeView(curCard().route) : null; drawMap(); });
new ResizeObserver(() => { if (!mobile() || st.tab === 'map') drawMap(); }).observe(box);

if (pre && mobile()) setTab('map'); else update();
