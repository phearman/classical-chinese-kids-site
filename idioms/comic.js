import { initPage } from '../shared/page.js?v=62dbb37';
import { escapeHTML } from '../shared/terms.js?v=62dbb37';
import { COMICS, comicBySlug } from './comics.js?v=62dbb37';
import { idiomURL } from './list.js?v=62dbb37';
import { missingComicHTML } from './comic-view.js?v=62dbb37';

export const getComic = (id, comics = COMICS) => comicBySlug(id, comics);
initPage();
const app = document.getElementById('app');
const comic = getComic(new URLSearchParams(location.search).get('id'));
if (!comic) {
  app.innerHTML = missingComicHTML();
} else {
  document.title = `${comic.word}｜成語漫畫｜文言文小幫手`;
  app.innerHTML = `<main class="comic-view"><h1>${escapeHTML(comic.word)}</h1><p class="idiom-note">成語漫畫</p>
    <ol class="comic-panels">${comic.panels.map((text, i) => `<li>${comic.images[i] ? `<img src="${escapeHTML(comic.images[i])}" alt="第 ${i + 1} 格：${escapeHTML(text)}">` : `<div class="comic-placeholder" aria-label="第 ${i + 1} 格漫畫尚在製作"><b>${i + 1}</b><span>漫畫施工中</span></div>`}<p>${escapeHTML(text)}</p></li>`).join('')}</ol>
    <blockquote class="idiom-quote">${escapeHTML(comic.original)}<cite>${escapeHTML(comic.source)}</cite></blockquote>
    ${comic.note ? `<p class="idiom-note">${escapeHTML(comic.note)}</p>` : ''}
    <dl class="comic-details"><div><dt>出處</dt><dd>${escapeHTML(comic.book)}<br><span class="comic-era">${escapeHTML(comic.era)}</span></dd></div><div><dt>意思</dt><dd>${escapeHTML(comic.meaning)}</dd></div><div><dt>例句</dt><dd>${escapeHTML(comic.example)}</dd></div><div><dt>生活情境</dt><dd>${escapeHTML(comic.situation)}</dd></div></dl>
    <a class="idiom-more" href="${idiomURL(comic.word)}" target="_blank" rel="noopener">教育部《成語典》查「${escapeHTML(comic.word)}」↗</a><a class="comic-back" href="index.html">← 回成語集</a>
    <p class="idiom-license">漫畫與文字：本站依古籍原文自行改寫；原典屬公有領域。</p></main>`;
}
