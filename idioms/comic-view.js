import { escapeHTML } from '../shared/terms.js?v=985c7ed';

export const missingComicHTML = () => '<main class="idiom-view idiom-empty"><h1>找不到這則成語漫畫</h1><p>它可能還在準備中，或網址不正確。</p><a class="idiom-more" href="index.html">← 回成語集</a></main>';

// 上一則/下一則:只在已完成的漫畫之間跳,順序同成語集「有漫畫」清單(order 為該清單的成語順序),頭尾相接。
export function comicNeighbors(slug, comics, order = []) {
  const rank = new Map(order.map((word, i) => [word, i]));
  const ready = comics.filter((comic) => comic.ready === true)
    .map((comic, i) => [comic, rank.has(comic.word) ? rank.get(comic.word) : order.length + i])
    .sort((a, b) => a[1] - b[1]).map(([comic]) => comic);
  const i = ready.findIndex((comic) => comic.slug === slug);
  if (i < 0 || ready.length < 2) return null;
  const at = (k) => ready[(k + ready.length) % ready.length];
  return { index: i + 1, total: ready.length, prev: at(i - 1), next: at(i + 1) };
}

const comicHref = (comic) => `comic.html?id=${encodeURIComponent(comic.slug)}`;
export const comicNavHTML = (nav, label) => (nav ? `<nav class="comic-nav" aria-label="${escapeHTML(label)}">
  <a class="comic-nav-link" rel="prev" href="${comicHref(nav.prev)}"><span aria-hidden="true">←</span> 上一則<b>${escapeHTML(nav.prev.word)}</b></a>
  <span class="comic-nav-pos">第 ${nav.index} / ${nav.total} 則</span>
  <a class="comic-nav-link comic-nav-next" rel="next" href="${comicHref(nav.next)}">下一則 <span aria-hidden="true">→</span><b>${escapeHTML(nav.next.word)}</b></a>
</nav>` : '');

// 注音:每字一個 <ruby>,讀音來自 zhuyin.js(教育部《成語典》);沒有資料就只顯示字。
export function zhuyinHTML(word, readings) {
  const chars = [...word];
  if (!Array.isArray(readings) || readings.length !== chars.length) return escapeHTML(word);
  return chars.map((ch, i) => `<ruby>${escapeHTML(ch)}<rt>${escapeHTML(readings[i])}</rt></ruby>`).join('');
}
