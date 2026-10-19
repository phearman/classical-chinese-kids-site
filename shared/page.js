// 每頁共用外框(WY13):固定一屏,上方工具列(☰ 選單/課名與目前頁/⚙ 設定),左側選單(手機為抽屜),
// 內容區放各頁的 #app。另含主題(存 ccc:theme,沒設跟隨系統;網址 ?theme= 給截圖與測試用)、設定、翻頁手勢。
import { escapeHTML } from './terms.js?v=3864b57';
import { version } from './version.js?v=3864b57';
import { catalog } from '../catalog.js?v=3864b57';

const SITE_ROOT = new URL('../', import.meta.url);
const siteURL = (path) => new URL(path, SITE_ROOT).href;

// ---------------------------------------------------------------- 偏好(本機儲存;讀寫失敗就當沒設)
export const PREF_KEYS = { theme: 'ccc:theme', narration: 'ccc:narration' };

export function getPref(name) {
  try { return localStorage.getItem(PREF_KEYS[name]); } catch { return null; }
}
export function setPref(name, value) {
  try { localStorage.setItem(PREF_KEYS[name], value); } catch { /* 無痕或封鎖時只在本頁有效 */ }
  document.dispatchEvent(new CustomEvent('ccc:pref', { detail: { name, value } }));
}
export const narrationOn = () => getPref('narration') !== 'off';

// ---------------------------------------------------------------- 主題
const systemDark = () => globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
export const isDark = () => (document.documentElement.dataset.theme
  ? document.documentElement.dataset.theme === 'dark' : systemDark());

export function applyThemeParam(loc = globalThis.location) {
  const t = new URLSearchParams(loc?.search ?? '').get('theme') ?? getPref('theme');
  if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t;
}

// ---------------------------------------------------------------- 版本
export const versionText = (v = version) => (v.commit ? `版本 ${v.date}・${v.commit}` : '版本 開發版');

// ---------------------------------------------------------------- 目前在哪一頁
const samePage = (a, b) => a.replace(/\/index\.html$/, '/') === b.replace(/\/index\.html$/, '/');

export function whereAmI(loc = globalThis.location) {
  const here = new URL(loc.href).pathname;
  for (const c of catalog) {
    for (const p of c.pages) {
      if (!samePage(new URL(siteURL(p.href)).pathname, here)) continue;
      return c.section === 'site' ? { title: c.title, sub: '', lesson: null } : { title: c.title, sub: p.label, lesson: c.id };
    }
  }
  return { title: '文言文小幫手', sub: '課程目錄', lesson: null };
}

// ---------------------------------------------------------------- 外框
function menuHTML(here) {
  const link = (href, label) => {
    const url = siteURL(href);
    const cur = samePage(new URL(url).pathname, new URL(globalThis.location.href).pathname);
    return `<a href="${escapeHTML(url)}"${cur ? ' aria-current="page"' : ''}>${escapeHTML(label)}</a>`;
  };
  const lessons = catalog.filter((c) => c.section !== 'site');
  const site = catalog.filter((c) => c.section === 'site');
  return `
    <button type="button" class="menu-close" id="menu-close" aria-label="關閉選單">✕ 關閉</button>
    ${lessons.map((c) => `<h2>${escapeHTML(c.title)}</h2>${c.pages.map((p) => link(p.href, p.label)).join('')}`).join('')}
    <h2>全站</h2>
    ${site.map((c) => link(c.pages[0].href, c.title)).join('')}
    ${link('index.html', '課程目錄')}
    <h2>其他課程</h2>
    <span class="soon" aria-disabled="true">下一課<small>即將推出</small></span>`;
}

const sw = (id, label, on, extra = '') =>
  `<button type="button" class="switch" role="switch" id="${id}" aria-checked="${on}" aria-label="${label}"${extra}></button>`;

function settingsHTML() {
  return `
    <form method="dialog" class="settings-card">
      <h2>設定</h2>
      <div class="set-row"><div>背景音樂<small>即將推出</small></div>${sw('set-music', '背景音樂', false, ' disabled')}</div>
      <div class="set-row"><div>旁白朗讀<small>動畫故事的旁白聲音</small></div>${sw('set-narration', '旁白朗讀', narrationOn())}</div>
      <div class="set-row"><div>深色模式<small>沒設定時跟著裝置</small></div>${sw('set-dark', '深色模式', isDark())}</div>
      <p class="site-version">${escapeHTML(versionText())}</p>
      <button class="done" value="done">完成</button>
    </form>`;
}

// 每頁開頭呼叫。paged:這頁用翻頁、整頁不捲動(內容區固定一屏);否則內容區自己捲動。
export function initPage({ paged = false } = {}) {
  applyThemeParam();
  if (document.querySelector('.shell')) return;
  const here = whereAmI();
  const app = document.getElementById('app');
  const shell = document.createElement('div');
  shell.className = 'shell';
  shell.innerHTML = `
    <header class="bar">
      <button type="button" class="icon-btn" id="menu-btn" aria-label="開啟選單" aria-expanded="false" aria-controls="menu">☰</button>
      <p class="bar-title">${escapeHTML(here.title)}${here.sub ? `<small>${escapeHTML(here.sub)}</small>` : ''}</p>
      <button type="button" class="icon-btn" id="set-btn" aria-label="設定" aria-haspopup="dialog">⚙</button>
    </header>
    <div class="shell-body">
      <nav class="menu" id="menu" aria-label="選單">${menuHTML(here)}</nav>
      <div class="scrim" id="scrim"></div>
    </div>`;
  app.before(shell);
  shell.querySelector('.shell-body').append(app);
  app.classList.add('content');
  app.classList.toggle('is-paged', paged);

  const settings = document.createElement('dialog');
  settings.className = 'settings';
  settings.setAttribute('aria-label', '設定');
  settings.innerHTML = settingsHTML();
  document.body.append(settings);

  setupMenu(shell);
  setupSettings(settings);
}

function setupMenu(shell) {
  const btn = shell.querySelector('#menu-btn');
  const menu = shell.querySelector('#menu');
  const scrim = shell.querySelector('#scrim');
  const set = (open, { focus = true } = {}) => {
    menu.classList.toggle('open', open);
    scrim.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
    // 抽屜開著時,後面的內容與設定鈕不能被 Tab 到或點到
    document.getElementById('app').inert = open;
    shell.querySelector('#set-btn').inert = open;
    if (!focus) return;
    if (open) menu.querySelector('a')?.focus();
    else btn.focus();
  };
  btn.addEventListener('click', () => set(!menu.classList.contains('open')));
  scrim.addEventListener('click', () => set(false));
  menu.querySelector('#menu-close').addEventListener('click', () => set(false));
  document.addEventListener('keydown', (e) => {
    if (!menu.classList.contains('open')) return;
    if (e.key === 'Escape') { e.preventDefault(); set(false); return; }
    if (e.key !== 'Tab') return;
    // 抽屜開著時,Tab / Shift+Tab 只在抽屜內循環
    const items = [...menu.querySelectorAll('a[href], button:not([disabled])')];
    const first = items[0];
    const last = items.at(-1);
    const i = items.indexOf(document.activeElement);
    if (i === -1) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && i === 0) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); first.focus(); }
  });
  // 換到桌機寬度時收起抽屜狀態
  globalThis.matchMedia?.('(min-width: 761px)').addEventListener?.('change', () => set(false, { focus: false }));
}

function setupSettings(dialog) {
  const opener = document.getElementById('set-btn');
  opener.addEventListener('click', () => {
    dialog.querySelector('#set-dark').setAttribute('aria-checked', String(isDark()));
    dialog.showModal();
  });
  dialog.addEventListener('close', () => opener.focus());
  // 沒指定主題(跟隨系統)時,系統切換深淺色,開關跟著變
  globalThis.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
    if (!document.documentElement.dataset.theme) dialog.querySelector('#set-dark').setAttribute('aria-checked', String(isDark()));
  });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); }); // 點背景關閉
  dialog.querySelector('#set-narration').addEventListener('click', (e) => {
    const on = e.currentTarget.getAttribute('aria-checked') !== 'true';
    e.currentTarget.setAttribute('aria-checked', String(on));
    setPref('narration', on ? 'on' : 'off');
  });
  dialog.querySelector('#set-dark').addEventListener('click', (e) => {
    const on = e.currentTarget.getAttribute('aria-checked') !== 'true';
    e.currentTarget.setAttribute('aria-checked', String(on));
    document.documentElement.dataset.theme = on ? 'dark' : 'light';
    setPref('theme', on ? 'dark' : 'light');
  });
}

// 本頁不支援某項設定時(如瀏覽器不能朗讀)停用該開關並說明
export function disableSetting(id, why) {
  const s = document.getElementById(id);
  if (!s) return;
  s.disabled = true;
  s.setAttribute('aria-checked', 'false');
  const small = s.closest('.set-row')?.querySelector('small');
  if (small) small.textContent = why;
}

// 有對話框或選單抽屜開著時,翻頁鍵不作用
export const overlayOpen = () => !!document.querySelector('dialog[open], .menu.open');

// 手機左右滑翻頁:dir = +1 下一頁、-1 上一頁。
// 移動初期鎖定方向:先判定是上下捲動就整次不翻頁;離螢幕左右邊緣 edge px 內開始的不算(留給系統的返回手勢)。
export function onSwipe(el, cb, { edge = 20 } = {}) {
  let start = null;
  let axis = null;
  const reset = () => { start = null; axis = null; };
  el.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    if (e.touches.length !== 1 || e.target.closest('input, textarea, select')
      || t.clientX < edge || t.clientX > globalThis.innerWidth - edge) { reset(); return; }
    start = { x: t.clientX, y: t.clientY };
    axis = null;
  }, { passive: true });
  el.addEventListener('touchmove', (e) => {
    if (!start || axis) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - start.x);
    const dy = Math.abs(t.clientY - start.y);
    if (Math.max(dx, dy) < 10) return;
    axis = dx > dy * 1.5 ? 'x' : 'y';
    if (axis === 'y') reset();
  }, { passive: true });
  el.addEventListener('touchcancel', reset);
  el.addEventListener('touchend', (e) => {
    if (!start || axis !== 'x') { reset(); return; }
    const dx = e.changedTouches[0].clientX - start.x;
    reset();
    if (Math.abs(dx) > 50 && !overlayOpen()) cb(dx < 0 ? 1 : -1);
  });
}
