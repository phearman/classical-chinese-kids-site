// 歷史故事(WY43)的畫面:清單與四格內文。資料在 history.js;版面沿用成語漫畫的 class(comic-panels、idiom-quote 等)。
import { escapeHTML } from '../shared/terms.js?v=97cfd27';

export const storyHref = (story) => `story.html?id=${encodeURIComponent(story.slug)}`;

export const missingStoryHTML = () => '<main class="idiom-view idiom-empty"><h1>找不到這則歷史故事</h1><p>它可能還在準備中，或網址不正確。</p><a class="idiom-more" href="story.html">← 回歷史故事</a></main>';

// 清單:每則一張卡片(第 1 格縮圖+題目+出處)。
export function storyListHTML(stories) {
  return `<main class="idiom-view">
  <h1>歷史故事</h1><p class="idiom-note">史書裡的真實事件，畫成四格漫畫。原文照史書，白話由本站改寫。</p>
  <ul class="story-list">${stories.map((s) => `<li><a class="story-card" href="${storyHref(s)}"><img src="${escapeHTML(s.images[0])}" alt="" loading="lazy"><span><b>${escapeHTML(s.title)}</b><small>${escapeHTML(s.book)}・${escapeHTML(s.era)}</small></span></a></li>`).join('')}</ul>
  <a class="comic-back" href="index.html">← 回成語集</a>
  <p class="idiom-license">漫畫與文字：本站依古籍原文自行改寫；原典屬公有領域。</p>
</main>`;
}

// 上一則/下一則:依清單順序,頭尾相接。
export function storyNeighbors(slug, stories) {
  const i = stories.findIndex((s) => s.slug === slug);
  if (i < 0 || stories.length < 2) return null;
  const at = (k) => stories[(k + stories.length) % stories.length];
  return { index: i + 1, total: stories.length, prev: at(i - 1), next: at(i + 1) };
}

const navHTML = (nav, label) => (nav ? `<nav class="comic-nav" aria-label="${escapeHTML(label)}">
  <a class="comic-nav-link" rel="prev" href="${storyHref(nav.prev)}"><span aria-hidden="true">←</span> 上一則<b>${escapeHTML(nav.prev.title)}</b></a>
  <span class="comic-nav-pos">第 ${nav.index} / ${nav.total} 則</span>
  <a class="comic-nav-link comic-nav-next" rel="next" href="${storyHref(nav.next)}">下一則 <span aria-hidden="true">→</span><b>${escapeHTML(nav.next.title)}</b></a>
</nav>` : '');

export function storyBodyHTML(story, { nav = null } = {}) {
  return `<main class="comic-view"><h1>${escapeHTML(story.title)}</h1><p class="idiom-note">歷史故事${story.aka ? `・${escapeHTML(story.aka)}` : ''}</p>
    ${navHTML(nav, '切換故事（頁首）')}
    <ol class="comic-panels">${story.panels.map((text, i) => `<li><img src="${escapeHTML(story.images[i])}" alt="第 ${i + 1} 格：${escapeHTML(text)}"><p>${escapeHTML(text)}</p></li>`).join('')}</ol>
    <blockquote class="idiom-quote">${escapeHTML(story.original)}<cite>${escapeHTML(story.source)}</cite></blockquote>
    ${story.note ? `<p class="idiom-note">${escapeHTML(story.note)}</p>` : ''}
    <dl class="comic-details"><div><dt>出處</dt><dd>${escapeHTML(story.book)}<br><span class="comic-era">${escapeHTML(story.era)}</span></dd></div></dl>
    ${navHTML(nav, '切換故事（頁尾）')}<a class="comic-back" href="story.html">← 回歷史故事</a>
    <p class="idiom-license">漫畫與文字：本站依古籍原文自行改寫；原典屬公有領域。</p></main>`;
}
