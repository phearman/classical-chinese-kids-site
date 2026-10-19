// 翻頁式內容(WY13):一頁一張卡;上一頁/下一頁按鈕、←→ 鍵、手機左右滑;目前頁記在網址 #key(瀏覽器返回鍵可用)。
// 各頁自己畫卡片內容,這裡只管「現在是哪一頁」與翻頁操作。
import { escapeHTML } from './terms.js?v=17af6f9';
import { overlayOpen, onSwipe } from './page.js?v=17af6f9';

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

// 段落籤:sections = [{ label, key(該段第一頁), current }]
export function sectionsHTML(sections, label = '段落') {
  return `<nav class="deck-sections" aria-label="${escapeHTML(label)}">${sections.map((s) =>
    `<button type="button" data-goto="${escapeHTML(s.key)}"${s.current ? ' aria-current="true"' : ''}>${escapeHTML(s.label)}</button>`).join('')}</nav>`;
}
