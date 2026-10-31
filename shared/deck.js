// 翻頁式內容(WY13):一頁一張卡;上一頁/下一頁按鈕、←→ 鍵、手機左右滑;目前頁記在網址 #key(瀏覽器返回鍵可用)。
// 各頁自己畫卡片內容,這裡只管「現在是哪一頁」與翻頁操作。
import { escapeHTML } from './terms.js?v=79dca84';
import { overlayOpen, onSwipe } from './page.js?v=79dca84';

// keys:頁的代號(網址 # 後面那段);onShow(key, index, total) 由各頁畫出目前頁
// aliases:舊網址的錨點對應到頁(如 people.html#zengzi → p2),外部舊連結仍可用
export function createPaging({ root, keys, onShow, focusSel = '#deck-title', aliases = {} }) {
  let list = keys;
  // 讀屏通知:翻頁後念出新頁標題
  const live = document.createElement('p');
  live.className = 'sr-only';
  live.setAttribute('aria-live', 'polite');
  document.body.append(live);

  const cur = () => {
    const raw = decodeURIComponent(location.hash.slice(1));
    const k = aliases[raw] ?? raw;
    return list.includes(k) ? k : list[0];
  };
  const index = () => list.indexOf(cur());
  function show({ focus = false } = {}) {
    onShow(cur(), index(), list.length);
    revealSection(root);
    if (!focus) return;
    const title = root.querySelector(focusSel);
    title?.focus();
    live.textContent = title?.textContent ?? '';
  }
  function go(k) {
    if (!list.includes(k)) return;
    if (k === cur()) { show({ focus: true }); return; }
    location.hash = k;
  }
  const step = (d) => {
    const i = index() + d;
    if (i >= 0 && i < list.length) go(list[i]);
  };

  addEventListener('hashchange', () => show({ focus: true }));
  root.addEventListener('click', (e) => {
    if (e.target.closest('.pager .prev')) step(-1);
    else if (e.target.closest('.pager .next')) step(1);
    else if (e.target.closest('[data-goto]')) go(e.target.closest('[data-goto]').dataset.goto);
  });
  document.addEventListener('keydown', (e) => {
    if (overlayOpen() || e.target.closest?.('input, textarea, select')) return;
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
  });
  onSwipe(root, step);
  // 段落籤橫向捲動時,更新左右兩端的淡出提示(還有沒看到的籤)
  root.addEventListener('scroll', (e) => { if (e.target.classList?.contains('deck-sections')) edgeHints(e.target); }, true);
  addEventListener('resize', () => root.querySelectorAll('.deck-sections').forEach(edgeHints));

  return {
    show, go, step, cur, index,
    get keys() { return list; },
    setKeys(k) { list = k; },
  };
}

// 翻頁列:← 上一頁/頁碼/下一頁 →
export function pagerHTML(i, total, { prev = '← 上一頁', next = '下一頁 →', label } = {}) {
  return `
    <nav class="pager" aria-label="翻頁">
      <button type="button" class="prev"${i <= 0 ? ' disabled' : ''}>${escapeHTML(prev)}</button>
      <p class="deck-count">${escapeHTML(label ?? `${i + 1} / ${total}`)}</p>
      <button type="button" class="next"${i >= total - 1 ? ' disabled' : ''}>${escapeHTML(next)}</button>
    </nav>`;
}

// 段落籤列可以左右滑(WY37,使用者 Android 實機:第 4 顆被切掉、滑不動):
// 目前這段的籤捲進看得到的地方(只捲籤列本身,整頁不動);兩端還有籤時顯示淡出提示
function edgeHints(nav) {
  nav.classList.toggle('more-left', nav.scrollLeft > 2);
  nav.classList.toggle('more-right', nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 2);
}
export function revealSection(root) {
  root.querySelectorAll('.deck-sections').forEach((nav) => {
    const b = nav.querySelector('[aria-current]');
    if (b) {
      const left = b.offsetLeft - nav.offsetLeft;
      if (left < nav.scrollLeft) nav.scrollLeft = left - 32;
      else if (left + b.offsetWidth > nav.scrollLeft + nav.clientWidth) nav.scrollLeft = left + b.offsetWidth - nav.clientWidth + 32;
    }
    edgeHints(nav);
  });
}

// 段落籤:sections = [{ label, key(該段第一頁), current }]
export function sectionsHTML(sections, label = '段落') {
  return `<nav class="deck-sections" aria-label="${escapeHTML(label)}">${sections.map((s) =>
    `<button type="button" data-goto="${escapeHTML(s.key)}"${s.current ? ' aria-current="true"' : ''}>${escapeHTML(s.label)}</button>`).join('')}</nav>`;
}
