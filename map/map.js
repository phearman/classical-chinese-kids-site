// 文言文地圖(WY42-B2):照定案稿(docs/mockups/wy42/d-final.html)做的正式頁。
// 資料:places.js(各則、地點、國別)、borders/(世界歷史疆界切片,Cliopatria CC BY 4.0)、world-base.js(Natural Earth 底圖)。
// 標記分兩種:「AI 推算」=原文沒寫、AI 推算的年代或地點;「都城示意」=原文只寫國別,點標在該國都城。
import { initPage } from '../shared/page.js?v=64f7467';
import { escapeHTML as esc } from '../shared/terms.js?v=64f7467';
import { ERAS, STATES, ITEMS, PLACE_BY_ID, placeOf, coordsOf, sliceFor } from './places.js?v=64f7467';
import { WORLD_BASE as B } from './world-base.js?v=64f7467';

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
const VIEW = { myth: [104, 30, 122, 40.5], cq: [105, 28.5, 122.5, 41], zg: [104, 28.5, 122.5, 41.5], xh: [96, 20, 126, 45], dh: [96, 20, 126, 45],
  njb: [100, 20, 125, 44], song: [96, 18, 128, 46], qing: [88, 16, 130, 52], out: [62, 5, 125, 45] };
const viewOf = (era) => { const [w, s, e, n] = VIEW[era]; const [x1, y1] = P([w, n]), [x2, y2] = P([e, s]); return [x1, y1, x2 - x1, y2 - y1]; };

const eras = ERAS.filter((e) => ITEMS.some((i) => i.era === e.id));
const statesOf = (era) => STATES[era] || [];
const stateOf = (it) => statesOf(it.era).find((s) => s.id === it.state);
const itemsOf = (era) => ITEMS.filter((i) => i.era === era);
const groupsOf = (era) => [...statesOf(era).map((s) => [s, itemsOf(era).filter((i) => i.state === s.id)]), [null, itemsOf(era).filter((i) => !i.state)]].filter(([, a]) => a.length);
const noState = (era) => (era === 'myth' ? '傳說' : era === 'out' ? '域外' : '沒有國別');

// 標記:年代/地點是否 AI 推算、地點是否「都城示意」
const yearGuess = (it) => it.basis === 'speaker' || it.basis === 'book';
const capitalOnly = (it) => /點標在.*都城/.test(it.placeGuess || '');
const placeGuess = (it) => (it.placeGuess && !capitalOnly(it)) || placeOf(it)?.status === '待查證';
const badges = (it) => (yearGuess(it) || placeGuess(it) ? '<span class="cmap-ai">AI 推算</span>' : '') + (capitalOnly(it) ? '<span class="cmap-cap">都城示意</span>' : '');

const sp = new URLSearchParams(location.search);
const st = { era: eras.some((e) => e.id === sp.get('era')) ? sp.get('era') : 'cq', region: null, item: null, view: null, tab: 'list', polity: null };
const pre = ITEMS.find((i) => i.title === sp.get('item'));
if (pre) Object.assign(st, { era: pre.era, region: pre.state, item: pre });
const mobile = () => matchMedia('(max-width: 767px)').matches;

app.innerHTML = `
  <main class="cmap" data-tab="list">
    <div class="cmap-tabs" role="tablist"><button type="button" role="tab" id="t-list" aria-selected="true">年代清單</button><button type="button" role="tab" id="t-map" aria-selected="false">地圖</button></div>
    <nav class="cmap-list" id="m-list" aria-label="年代清單"></nav>
    <section class="cmap-cards" id="m-cards" aria-label="年代清單"></section>
    <section class="cmap-right">
      <div class="cmap-axis"><button type="button" class="cmap-nav" id="m-prev" aria-label="上一個年代">‹</button><div class="cmap-track" id="m-track"></div><button type="button" class="cmap-nav" id="m-next" aria-label="下一個年代">›</button></div>
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

// ---------------------------------------------------------------- 清單(桌機)、卡片(手機)、時間軸
function renderList() {
  $('m-list').innerHTML = eras.map((e) => `
    <div class="cmap-era${e.id === st.era ? ' open cur' : ''}"><button type="button" data-era="${e.id}" aria-expanded="${e.id === st.era}"><b>${e.name}</b><small>${e.time}</small><span class="cmap-cnt">${itemsOf(e.id).length}</span></button>
      <div class="cmap-era-body">${e.id !== st.era ? '' : groupsOf(e.id).map(([s, a]) => `
        <button type="button" class="cmap-st${s && st.region === s.id ? ' sel' : ''}" ${s ? `data-state="${s.id}"` : 'disabled'}>${s ? esc(s.name) : noState(e.id)}<span class="cmap-cnt">${a.length}</span></button>
        ${a.map((it) => `<button type="button" class="cmap-it${st.item === it ? ' sel' : ''}" data-i="${ITEMS.indexOf(it)}"><span class="cmap-ty ${it.t}">${TYPE[it.t]}</span>${esc(it.title)}${badges(it)}${coordsOf(it) ? '' : '<span class="cmap-nomap">無定點</span>'}</button>`).join('')}`).join('')}</div></div>`).join('');
}
function renderCards() {
  $('m-cards').innerHTML = `<div class="cmap-chips">${eras.map((e) => `<button type="button" data-era="${e.id}" aria-pressed="${e.id === st.era}">${e.name} ${itemsOf(e.id).length}</button>`).join('')}</div>` +
    groupsOf(st.era).map(([s, a]) => `<h3>${s ? esc(s.name) : noState(st.era)}<span class="cmap-cnt">${a.length}</span></h3><div class="cmap-grid">${a.map((it) => `
      <button type="button" class="cmap-cardbtn" data-i="${ITEMS.indexOf(it)}"><span><span class="cmap-ty ${it.t}">${TYPE[it.t]}</span> ${badges(it)}</span><b>${esc(it.title)}</b><small>${esc(it.text)}</small></button>`).join('')}</div>`).join('');
}
function renderAxis() {
  $('m-track').innerHTML = eras.map((e) => `<button type="button" class="cmap-stop${e.id === st.era ? ' cur' : ''}" data-era="${e.id}" aria-pressed="${e.id === st.era}"><b>${e.name}</b><small>${itemsOf(e.id).length} 則</small></button>`).join('');
}
function renderDetail() {
  const it = st.item, d = $('m-detail');
  if (st.polity && !it) {
    const p = st.polity;
    d.innerHTML = `<div class="cmap-card"><h2>${esc(p.z)}${p.nt ? '<span class="cmap-ai">AI 判斷</span>' : ''}${p.zs === 'ai' ? '<span class="cmap-ai">國名 AI 整理</span>' : p.zs === 'wikidata' ? '' : '<span class="cmap-cap">中文名待補</span>'}</h2>
      <p>${esc(p.n)}・這份疆界資料記它存在於 ${yearText(p.y[0])}~${yearText(p.y[1])}</p>${p.nt ? `<p class="cmap-src">${esc(p.nt)}</p>` : ''}
      <p class="cmap-src">中文名${p.zs === 'ai' ? '由 AI 整理、待校' : p.zs === 'wikidata' ? '取自 Wikidata' : '還沒有,先顯示英文'};疆界取自 Cliopatria,只是示意。</p></div>`;
    return;
  }
  if (!it) { d.innerHTML = `<div class="cmap-card empty">${mobile() ? '點清單裡任一則,地圖會標出它發生的地方。' : '點左邊任一則,地圖會標出它發生的地方;拖曳地圖可以看同時期的其他國家。'}</div>`; return; }
  const era = ERAS.find((e) => e.id === it.era), s = stateOf(it), pl = placeOf(it);
  const when = it.basis === 'myth' ? `神話,不推算年代(${esc(it.when)})`
    : it.basis === 'text' ? `${era.name}(原文:${esc(it.when)})`
    : `${era.name} <span class="cmap-ai">AI 推算</span> 原文沒寫年代(${esc(it.when)}),依${it.basis === 'speaker' ? '說故事的人的時代' : '成書時代'}推算`;
  let where = `${s ? esc(s.name) + '・' : ''}${esc(it.text)}`;
  if (capitalOnly(it)) where += ` <span class="cmap-cap">都城示意</span> ${esc(it.placeGuess)}`;
  else if (it.placeGuess) where += ` <span class="cmap-ai">AI 推算</span> ${esc(it.placeGuess)}`;
  if (pl) where += `<br><small class="cmap-src">今地:${esc(pl.modern)}${pl.status === '待查證' ? ' <span class="cmap-ai">AI 推算</span> 古今對照待查證' : `(${esc(pl.src)})`}</small>`;
  if (!coordsOf(it)) where += '<br><small class="cmap-src">這則沒有確定地點,地圖上不標點。</small>';
  d.innerHTML = `<div class="cmap-card"><h2><span class="cmap-ty ${it.t}">${TYPE[it.t]}</span>${esc(it.title)}</h2>
    <p>年代:${when}</p><p>地點:${where}</p><p class="cmap-src">出處:${esc(it.src)}${it.sub ? '　' + esc(it.sub) : ''}</p>
    <a class="cmap-go" href="../${it.href}">${GO[it.t]} →</a><button type="button" class="cmap-back" id="m-back">← 回清單</button></div>`;
  $('m-back')?.addEventListener('click', () => setTab('list'));
}
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
  for (const k of ['huang', 'yangtze', 'han']) frag.append(el('path', { d: B[k], class: 'm-river' }));
  const selState = statesOf(st.era).find((s) => s.id === (st.region || st.item?.state));
  const counts = {}; for (const it of itemsOf(st.era)) if (it.state) counts[it.state] = (counts[it.state] || 0) + 1;
  if (data) {
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
  } else {
    const [x, y] = P(st.era === 'out' ? [80, 22] : [113, 36]);
    frag.append(el('text', { x, y, class: 'm-none', 'font-size': (15 * u).toFixed(1) }, st.era === 'myth' ? '神話沒有國別,只標原文寫到的山川' : '佛經故事,發生在古印度'));
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
    const g = el('g', { class: 'm-pin' + (st.region && it.state !== st.region && !on ? ' dim' : '') });
    if (on) g.append(el('circle', { cx: x, cy: y, r: 11 * u, class: 'm-pulse', stroke: PIN[it.t] }));
    g.append(el('circle', { cx: x, cy: y, r: (on ? 6 : 4) * u, fill: PIN[it.t] }));
    g.append(el('title', {}, it.title));
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
    const fs = 14 * u, w = (st.item.title.length + 1) * fs;
    let lx = x + 9 * u; if (lx + w > v[0] + v[2] - 50 * u) lx = x - 9 * u - w;
    frag.append(el('rect', { x: lx, y: y - fs * 1.6, width: w, height: fs * 1.5, rx: 4 * u, class: 'm-tag' }));
    frag.append(el('text', { x: lx + fs * 0.5, y: y - fs * 0.45, class: 'm-tagt', 'font-size': fs.toFixed(1) }, st.item.title));
  }
  svg.replaceChildren(frag);
  const era = ERAS.find((e) => e.id === st.era);
  $('m-legend').innerHTML = `<p><b>${era.name}</b> ${era.time}${name ? `・疆界是 ${yearText(+name.replace('bc', '-'))}左右的樣子` : ''}・國名加虛線=AI 整理・帶「?」=原資料有疑問,點國家看說明</p>`;
}
function star(x, y, r) {
  let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; d += (i ? 'L' : 'M') + (x + Math.cos(a) * rr).toFixed(1) + ' ' + (y + Math.sin(a) * rr).toFixed(1); }
  return d + 'Z';
}

// ---------------------------------------------------------------- 互動
function update() { renderList(); renderCards(); renderAxis(); renderDetail(); if (!mobile() || st.tab === 'map') drawMap(); }
function setEra(id) { Object.assign(st, { era: id, region: null, item: null, view: null, polity: null }); update(); }
function pick(it) { Object.assign(st, { item: it, region: it.state, view: null, polity: null }); if (mobile()) setTab('map'); else update(); }
function setTab(t) {
  st.tab = t; root.dataset.tab = t;
  $('t-list').setAttribute('aria-selected', t === 'list'); $('t-map').setAttribute('aria-selected', t === 'map');
  update(); app.scrollTop = 0;
}
$('t-list').addEventListener('click', () => setTab('list'));
$('t-map').addEventListener('click', () => setTab('map'));
const go = (d) => { const i = eras.findIndex((e) => e.id === st.era) + d; if (eras[i]) setEra(eras[i].id); };
$('m-prev').addEventListener('click', () => go(-1));
$('m-next').addEventListener('click', () => go(1));
app.addEventListener('click', (ev) => {
  const b = ev.target.closest('button'); if (!b || !app.contains(b)) return;
  if (b.dataset.era) setEra(b.dataset.era);
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
$('m-home').addEventListener('click', () => { st.view = null; drawMap(); });
new ResizeObserver(() => { if (!mobile() || st.tab === 'map') drawMap(); }).observe(box);

if (pre && mobile()) setTab('map'); else update();
