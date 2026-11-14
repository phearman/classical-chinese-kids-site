import { escapeHTML } from '../shared/terms.js?v=edf6ae9';

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

// 漫畫內文(四格、說明、原文、意思等):漫畫頁與文言文地圖的彈出視窗共用(WY53)。
// base=圖片路徑前綴(地圖在 ../idioms/);page=true 時加上一則/下一則與「回成語集」(只在漫畫頁);headingId 給彈出視窗的 aria-labelledby。
export function comicBodyHTML(comic, { readings, readingNote = '', idiomHref = '', nav = null, base = '', page = true, headingId = '' } = {}) {
  const img = (src) => escapeHTML(`${base}${src}`);
  return `<h1 class="zhuyin-word"${headingId ? ` id="${headingId}"` : ''}>${zhuyinHTML(comic.word, readings)}</h1>${readingNote ? `<p class="zhuyin-note">讀音提醒：${escapeHTML(readingNote)}</p>` : ''}<p class="idiom-note">成語漫畫</p>
    ${page ? comicNavHTML(nav, '切換漫畫（頁首）') : ''}
    <ol class="comic-panels">${comic.panels.map((text, i) => `<li>${comic.images[i] ? `<img src="${img(comic.images[i])}" alt="第 ${i + 1} 格：${escapeHTML(text)}">` : `<div class="comic-placeholder" aria-label="第 ${i + 1} 格漫畫尚在製作"><b>${i + 1}</b><span>漫畫施工中</span></div>`}<p>${escapeHTML(text)}</p></li>`).join('')}</ol>
    <blockquote class="idiom-quote">${escapeHTML(comic.original)}<cite>${escapeHTML(comic.source)}</cite></blockquote>
    ${comic.note ? `<p class="idiom-note">${escapeHTML(comic.note)}</p>` : ''}
    <dl class="comic-details"><div><dt>出處</dt><dd>${escapeHTML(comic.book)}<br><span class="comic-era">${escapeHTML(comic.era)}</span></dd></div><div><dt>意思</dt><dd>${escapeHTML(comic.meaning)}</dd></div><div><dt>例句</dt><dd>${escapeHTML(comic.example)}</dd></div><div><dt>生活情境</dt><dd>${escapeHTML(comic.situation)}</dd></div></dl>
    ${idiomHref ? `<a class="idiom-more" href="${idiomHref}" target="_blank" rel="noopener">教育部《成語典》查「${escapeHTML(comic.word)}」↗</a>` : ''}${page ? `${comicNavHTML(nav, '切換漫畫（頁尾）')}<a class="comic-back" href="index.html?filter=comic">← 回成語集（有漫畫）</a>` : ''}
    <p class="idiom-license">漫畫與文字：本站依古籍原文自行改寫；原典屬公有領域。</p>`;
}
