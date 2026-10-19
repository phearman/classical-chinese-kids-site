// 圖文故事版:一頁一段情境,上下頁導覽;頁碼記在網址 #p1~#pN。
import { lesson, glossary, storyPages } from './data.js?v=ab14e02';
import { renderMarked, escapeHTML } from '../../shared/terms.js?v=ab14e02';
import { setupGlossary } from '../../shared/sheet.js?v=ab14e02';
import { sceneSVG } from '../../shared/figures.js?v=ab14e02';
import { initPage, chromeHTML, lessonTabs } from '../../shared/page.js?v=ab14e02';

initPage();
const app = document.getElementById('app');
const chrome = chromeHTML({ homeHref: '../../index.html', here: lesson.title, tabs: lessonTabs('story') });
const total = storyPages.length;

function pageFromHash() {
  const n = Number(location.hash.replace('#p', ''));
  return Number.isInteger(n) && n >= 1 && n <= total ? n : 1;
}

// 讀屏通知:翻頁後念出「第 n / N 段:標題」
const live = document.createElement('p');
live.className = 'sr-only';
live.setAttribute('aria-live', 'polite');
document.body.append(live);

function render(n, { focus = false } = {}) {
  const p = storyPages[n - 1];
  app.innerHTML = `
    ${chrome.top}
    <main class="wrap">
      ${chrome.tabs}
      <article class="story-page" aria-labelledby="story-title">
        <p class="story-count">第 ${n} / ${total} 段</p>
        <h1 id="story-title" tabindex="-1">${escapeHTML(p.title)}</h1>
        ${sceneSVG(p.art)}
        <div class="story-text">${p.text.map((t) => `<p>${escapeHTML(t)}</p>`).join('')}</div>
        ${p.quote ? `
          <div class="quote">
            <div class="classical">${renderMarked(p.quote.text)}</div>
            <div class="source">${escapeHTML(p.quote.source)}</div>
          </div>
          <p class="hint">點畫底線的字，看讀音、意思和比喻。</p>` : ''}
        ${p.question ? `<div class="card"><strong>想一想：</strong>${escapeHTML(p.question)}</div>` : ''}
        ${n === total ? '<p>想把整段課文讀懂？到 <a href="study.html">課文學習</a>。</p>' : ''}
      </article>
      <nav class="pager" aria-label="翻頁">
        <button type="button" class="prev" ${n === 1 ? 'disabled' : ''}>← 上一段</button>
        <button type="button" class="next" ${n === total ? 'disabled' : ''}>下一段 →</button>
      </nav>
      <div class="dots">${storyPages.map((s, i) =>
        `<button type="button" data-go="${i + 1}" aria-label="第 ${i + 1} 段：${escapeHTML(s.title)}"${i + 1 === n ? ' aria-current="step"' : ''}></button>`).join('')}</div>
      <footer>${escapeHTML(lesson.sourceNote)} 故事情節為教學改編；門人為虛構角色。</footer>
    </main>`;
  if (focus) {
    // 翻頁後焦點移到新段標題,鍵盤與讀屏使用者不會迷路
    document.getElementById('story-title').focus();
    live.textContent = `第 ${n} / ${total} 段：${p.title}`;
  }
}

function go(n) {
  if (n < 1 || n > total) return;
  location.hash = `p${n}`;
}

app.addEventListener('click', (e) => {
  const cur = pageFromHash();
  if (e.target.closest('.prev')) go(cur - 1);
  else if (e.target.closest('.next')) go(cur + 1);
  else if (e.target.closest('[data-go]')) go(Number(e.target.closest('[data-go]').dataset.go));
});
document.addEventListener('keydown', (e) => {
  if (document.querySelector('dialog[open]')) return;
  if (e.key === 'ArrowRight') go(pageFromHash() + 1);
  if (e.key === 'ArrowLeft') go(pageFromHash() - 1);
});
addEventListener('hashchange', () => { render(pageFromHash(), { focus: true }); scrollTo(0, 0); });

setupGlossary(glossary, app);
render(pageFromHash());
