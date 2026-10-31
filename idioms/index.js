import { initPage } from '../shared/page.js?v=96152c1';
import { escapeHTML } from '../shared/terms.js?v=96152c1';
import { WORDS } from './words-data.js?v=96152c1';
import { COMICS } from './comics.js?v=96152c1';
import { TOPIC_LABELS } from './categories.js?v=96152c1';
import { ZHUYIN } from './zhuyin.js?v=96152c1';
import { zhuyinHTML } from './comic-view.js?v=96152c1';
import { PAGE_SIZE, eraOf, idiomURL, filterWords, visibleWords, readFilterParams, filterSearch } from './list.js?v=96152c1';

initPage();
const app = document.getElementById('app');
let query = '';
let filter = 'all';
let era = '';
let book = '';
let shown = PAGE_SIZE;
const byWord = new Map(COMICS.map((comic) => [comic.word, comic]));
const readyCount = COMICS.filter((comic) => comic.ready === true).length;
const readyComics = COMICS.filter((comic) => comic.ready === true);
// 時代依朝代先後排列(第 7 批起有「唐」),不照漫畫登記順序。
const ERA_ORDER = ['先秦', '西漢', '東漢', '三國', '魏晉', '南北朝', '唐', '宋', '元', '明', '清'];
const eraRank = (era) => { const i = ERA_ORDER.indexOf(era); return i < 0 ? ERA_ORDER.length : i; };
const eras = [...new Set(readyComics.map((comic) => eraOf(comic.era)))].sort((a, b) => eraRank(a) - eraRank(b) || a.localeCompare(b, 'zh-Hant'));
const books = [...new Set(readyComics.map((comic) => comic.book))];
const filterLabels = [
  ['all', '全部'], ['common', '最常用 100 條'], ...Object.entries(TOPIC_LABELS),
  ['comic', `有漫畫（${readyCount}）`], ['waiting', '施工中'],
];

// 控制項、搜尋框與 live region 只建立一次：中文輸入法組字與游標都不會被重繪打斷。
app.innerHTML = `<main class="idiom-view">
  <h1>成語集</h1><p class="idiom-note">依常用程度排序，收錄 ${WORDS.length.toLocaleString('zh-Hant')} 條成語。</p>
  <label class="sr-only" for="idiom-search">搜尋成語</label><input id="idiom-search" class="idiom-search" type="search" placeholder="搜尋成語，例如：守株" autocomplete="off">
  <p class="idiom-note">主題分類依字面，僅供參考。</p>
  <div class="idiom-filters" role="group" aria-label="成語分類篩選">
    ${filterLabels.map(([id, label]) => `<button type="button" class="idiom-chip" data-filter="${id}" aria-pressed="false">${label}</button>`).join('')}
  </div>
  <div class="idiom-source-filters" hidden aria-label="漫畫出處篩選">
    <label>時代<select class="idiom-select" data-source-filter="era"><option value="">全部時代</option>${eras.map((value) => `<option value="${escapeHTML(value)}">${escapeHTML(value)}</option>`).join('')}</select></label>
    <label>出處書名<select class="idiom-select" data-source-filter="book"><option value="">全部書名</option>${books.map((value) => `<option value="${escapeHTML(value)}">${escapeHTML(value)}</option>`).join('')}</select></label>
  </div><p class="idiom-count" aria-live="polite" aria-atomic="true"></p>
  <ul class="idiom-list"></ul><div class="idiom-more-wrap"></div>
  <footer class="idiom-license">題庫來源：THUOCL（MIT 授權，全文見 <a href="LICENSE-THUOCL.txt">授權</a>）與教育部《成語典》詞目交集；釋義請見《成語典》。</footer>
</main>`;

const search = app.querySelector('#idiom-search');
const count = app.querySelector('.idiom-count');
const list = app.querySelector('.idiom-list');
const moreWrap = app.querySelector('.idiom-more-wrap');
const chips = app.querySelectorAll('[data-filter]');
const sourceFilters = app.querySelector('.idiom-source-filters');
const sourceSelects = app.querySelectorAll('[data-source-filter]');

// 網址參數:?filter=comic&era=先秦&book=《韓非子》&q=守株;不認得的值一律忽略。
({ filter, era, book, query } = readFilterParams(new URLSearchParams(location.search), { filterIds: filterLabels.map(([id]) => id), eras, books }));
search.value = query;
sourceSelects.forEach((select) => { select.value = select.dataset.sourceFilter === 'era' ? era : book; });

function syncURL() {
  history.replaceState(null, '', filterSearch({ filter, era, book, query }) || location.pathname);
}

function renderResults({ keepMoreFocus = false } = {}) {
  const words = filterWords(WORDS, COMICS, query, filter, { era, book });
  const visible = visibleWords(words, shown);
  list.innerHTML = visible.map((word) => {
    const comic = byWord.get(word);
    const comicLink = comic?.ready === true ? `<a class="idiom-tag idiom-ready" href="comic.html?id=${encodeURIComponent(comic.slug)}">四格漫畫</a>` : '<span class="idiom-tag idiom-waiting">漫畫施工中</span>';
    return `<li><span class="idiom-word">${comic?.ready === true ? zhuyinHTML(word, ZHUYIN[word]) : escapeHTML(word)}</span><span class="idiom-actions">${comicLink}<a class="idiom-tag idiom-dict" href="${idiomURL(word)}" target="_blank" rel="noopener">成語典↗</a></span></li>`;
  }).join('');
  count.textContent = `找到 ${words.length.toLocaleString('zh-Hant')} 條，目前顯示 ${visible.length.toLocaleString('zh-Hant')} 條`;
  chips.forEach((button) => {
    const current = button.dataset.filter === filter;
    button.classList.toggle('is-current', current);
    button.setAttribute('aria-pressed', String(current));
  });
  sourceFilters.hidden = filter !== 'comic';
  syncURL();
  moreWrap.innerHTML = visible.length < words.length ? '<button type="button" class="idiom-more" id="idiom-more">再顯示 50 條</button>' : '';
  const more = moreWrap.querySelector('#idiom-more');
  more?.addEventListener('click', () => { shown += PAGE_SIZE; renderResults({ keepMoreFocus: true }); });
  // 載入更多後，按鈕仍存在就回到它，鍵盤操作位置不會消失。
  if (keepMoreFocus && more) more.focus();
}

search.addEventListener('input', (event) => {
  if (event.isComposing) return;
  query = event.currentTarget.value;
  shown = PAGE_SIZE;
  renderResults();
});
search.addEventListener('compositionend', (event) => {
  query = event.currentTarget.value;
  shown = PAGE_SIZE;
  renderResults();
});
chips.forEach((button) => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  if (filter !== 'comic') {
    era = '';
    book = '';
    sourceSelects.forEach((select) => { select.value = ''; });
  }
  shown = PAGE_SIZE;
  renderResults();
}));
sourceSelects.forEach((select) => select.addEventListener('change', () => {
  if (select.dataset.sourceFilter === 'era') era = select.value;
  else book = select.value;
  shown = PAGE_SIZE;
  renderResults();
}));
renderResults();
