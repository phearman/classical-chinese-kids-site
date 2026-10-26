import { initPage } from '../shared/page.js?v=ad37985';
import { escapeHTML } from '../shared/terms.js?v=ad37985';
import { WORDS } from './words-data.js?v=ad37985';
import { COMICS } from './comics.js?v=ad37985';
import { PAGE_SIZE, idiomURL, filterWords, visibleWords } from './list.js?v=ad37985';

initPage();
const app = document.getElementById('app');
let query = '';
let filter = 'all';
let shown = PAGE_SIZE;
const byWord = new Map(COMICS.map((comic) => [comic.word, comic]));
const readyCount = COMICS.filter((comic) => comic.ready === true).length;

// 控制項、搜尋框與 live region 只建立一次：中文輸入法組字與游標都不會被重繪打斷。
app.innerHTML = `<main class="idiom-view">
  <h1>成語集</h1><p class="idiom-note">依常用程度排序，收錄 ${WORDS.length.toLocaleString('zh-Hant')} 條成語。</p>
  <label class="sr-only" for="idiom-search">搜尋成語</label><input id="idiom-search" class="idiom-search" type="search" placeholder="搜尋成語，例如：守株" autocomplete="off">
  <div class="idiom-filters" role="group" aria-label="漫畫篩選">
    ${[['all', '全部'], ['comic', `有漫畫（${readyCount}）`], ['waiting', '施工中']].map(([id, label]) => `<button type="button" class="idiom-chip" data-filter="${id}" aria-pressed="false">${label}</button>`).join('')}
  </div><p class="idiom-count" aria-live="polite" aria-atomic="true"></p>
  <ul class="idiom-list"></ul><div class="idiom-more-wrap"></div>
  <footer class="idiom-license">題庫來源：THUOCL（MIT 授權，全文見 <a href="LICENSE-THUOCL.txt">授權</a>）與教育部《成語典》詞目交集；釋義請見《成語典》。</footer>
</main>`;

const search = app.querySelector('#idiom-search');
const count = app.querySelector('.idiom-count');
const list = app.querySelector('.idiom-list');
const moreWrap = app.querySelector('.idiom-more-wrap');
const chips = app.querySelectorAll('[data-filter]');

function renderResults({ keepMoreFocus = false } = {}) {
  const words = filterWords(WORDS, COMICS, query, filter);
  const visible = visibleWords(words, shown);
  list.innerHTML = visible.map((word) => {
    const comic = byWord.get(word);
    const comicLink = comic?.ready === true ? `<a class="idiom-tag idiom-ready" href="comic.html?id=${encodeURIComponent(comic.slug)}">四格漫畫</a>` : '<span class="idiom-tag idiom-waiting">漫畫施工中</span>';
    return `<li><span class="idiom-word">${escapeHTML(word)}</span><span class="idiom-actions">${comicLink}<a class="idiom-tag idiom-dict" href="${idiomURL(word)}" target="_blank" rel="noopener">成語典↗</a></span></li>`;
  }).join('');
  count.textContent = `找到 ${words.length.toLocaleString('zh-Hant')} 條，目前顯示 ${visible.length.toLocaleString('zh-Hant')} 條`;
  chips.forEach((button) => {
    const current = button.dataset.filter === filter;
    button.classList.toggle('is-current', current);
    button.setAttribute('aria-pressed', String(current));
  });
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
  shown = PAGE_SIZE;
  renderResults();
}));
renderResults();
