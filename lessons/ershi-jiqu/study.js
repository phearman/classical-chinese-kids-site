// 〈兒時記趣〉課文學習版:四段原文一句一頁(原文、點詞詞卡、白話),比喻、想一想、延伸閱讀、作者小檔案各自成頁。
// 一屏版(比照第 4 課):上方段落籤可跳段;頁碼記在網址 #p1~#pN。
import { lesson, glossary, study } from './data.js?v=7c26351';
import { renderMarked, escapeHTML } from '../../shared/terms.js?v=7c26351';
import { setupGlossary } from '../../shared/sheet.js?v=7c26351';
import { initPage } from '../../shared/page.js?v=7c26351';
import { createPaging, pagerHTML, sectionsHTML } from '../../shared/deck.js?v=7c26351';
import { characterURL } from '../../shared/assets.js?v=7c26351';

initPage({ paged: true });
const app = document.getElementById('app');
const { parts, analogies, think, extension, author } = study;

const sentenceHTML = (s) => `
  <div class="sentence">
    <div class="classical">${renderMarked(s.text)}</div>
    <p class="plain"><span class="plain-tag">白話</span>${escapeHTML(s.plain)}</p>
  </div>`;
const title = (text) => `<h1 id="deck-title" tabindex="-1">${escapeHTML(text)}</h1>`;
const HINT = '<p class="hint">點畫底線的字，看讀音、意思和比喻。</p>';
const tag = (ok) => (ok ? '<span class="tag ok">已查證</span>' : '<span class="tag todo">待查證</span>');

// 每頁:section(段落籤)、eyebrow(小標)、body(卡片內容)
const pages = [
  ...parts.flatMap((p) => p.sentences.map((s, i) => ({
    section: p.id, eyebrow: `${p.title}・第 ${i + 1} / ${p.sentences.length} 句`,
    body: `${title(p.title)}${sentenceHTML(s)}${HINT}
      <p class="source">${escapeHTML(lesson.source)}</p>
      ${i === p.sentences.length - 1 ? `<p class="hint"><strong>重點：</strong>${escapeHTML(p.point)}</p>` : ''}`,
  }))),
  ...analogies.map((a, i) => ({
    section: 'analogy', eyebrow: `用生活例子想一想・${i + 1} / ${analogies.length}`,
    body: `${title(a.title)}<p class="deck-text">${escapeHTML(a.body)}</p>`,
  })),
  {
    section: 'ext', eyebrow: '想一想',
    body: `${title(think.title)}<ol class="deck-list">${think.questions.map((q) => `<li>${escapeHTML(q)}</li>`).join('')}</ol>`,
  },
  {
    section: 'more', eyebrow: '延伸閱讀・不在課本選文內',
    body: `${title(extension.title)}
      <p class="hint">${escapeHTML(extension.note)}</p>
      ${extension.sentences.map(sentenceHTML).join('')}${HINT}
      <p class="source">出處：${escapeHTML(extension.source)}；<a href="${escapeHTML(extension.url)}" target="_blank" rel="noopener">維基文庫原文</a>（${escapeHTML(extension.version)}）</p>
      <p class="hint"><strong>重點：</strong>${escapeHTML(extension.point)}</p>`,
  },
  {
    section: 'author', eyebrow: '作者',
    body: `${title(author.title)}
      <img class="author-portrait" src="${characterURL('shenfu-adult.webp')}" alt="長大後的沈復伏案寫書（AI 生成插圖）">
      <dl class="facts">${author.facts.map((f) => `
        <div class="fact"><dt>${escapeHTML(f.label)}</dt>
          <dd>${escapeHTML(f.value)}${tag(f.verified)}<div class="source">${escapeHTML(f.source)}</div></dd></div>`).join('')}
      </dl>
      <p class="hint">${escapeHTML(author.note)}</p>
      <p class="small">「已查證」是已核對所列來源（作者自述的原文，或編者說明）；「待查證」還要再查。</p>
      <p class="next-step"><a class="btn-link" href="people.html">看完整人物介紹 →</a> <a class="btn-link" href="quiz.html">讀完了？來做隨堂測驗 →</a></p>
      <p class="story-note">${escapeHTML(lesson.sourceNote)}</p>`,
  },
];
const keys = pages.map((_, i) => `p${i + 1}`);
const SECTIONS = [...parts.map((p) => [p.id, p.short]), ['analogy', '比喻'], ['ext', '想一想'], ['more', '延伸'], ['author', '作者']];

const paging = createPaging({
  root: app,
  keys,
  onShow(key, i, total) {
    const p = pages[i];
    const sections = SECTIONS.map(([id, label]) => ({ label, key: keys[pages.findIndex((x) => x.section === id)], current: p.section === id }));
    app.innerHTML = `
      <main class="deck-view">
        ${sectionsHTML(sections, '課文學習段落')}
        <article class="deck-card" aria-labelledby="deck-title">
          <p class="deck-eyebrow">${escapeHTML(p.eyebrow)}</p>
          <div class="deck-body" tabindex="0" role="region" aria-label="本頁內容">${p.body}</div>
        </article>
        ${pagerHTML(i, total)}
      </main>`;
  },
});

setupGlossary(glossary, app);
paging.show();
