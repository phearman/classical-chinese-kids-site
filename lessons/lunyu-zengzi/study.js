// 課文學習版:原文逐句+白話、點詞看解釋、比喻、情境帶入、延伸章節。
// 一屏版(WY13):主文一句一頁;比喻、情境、討論、延伸各自成頁;上方段落籤可跳段。頁碼記在網址 #p1~#pN。
import { lesson, glossary, study } from './data.js?v=a0a4eef';
import { renderMarked, escapeHTML } from '../../shared/terms.js?v=a0a4eef';
import { setupGlossary } from '../../shared/sheet.js?v=a0a4eef';
import { initPage } from '../../shared/page.js?v=a0a4eef';
import { createPaging, pagerHTML, sectionsHTML } from '../../shared/deck.js?v=a0a4eef';

initPage({ paged: true });
const app = document.getElementById('app');
const { main, analogies, scene, extensions } = study;

const sentenceHTML = (s) => `
  <div class="sentence">
    <div class="classical">${renderMarked(s.text)}</div>
    <p class="plain"><span class="plain-tag">白話</span>${escapeHTML(s.plain)}</p>
  </div>`;
const title = (text) => `<h1 id="deck-title" tabindex="-1">${escapeHTML(text)}</h1>`;
const HINT = '<p class="hint">點畫底線的字，看讀音、意思和比喻。</p>';

// 每頁:section(段落籤)、eyebrow(小標)、body(卡片內容)
const pages = [
  ...main.sentences.map((s, i) => ({
    section: 'main', eyebrow: `主文・第 ${i + 1} / ${main.sentences.length} 句`,
    body: `${title(main.title)}${sentenceHTML(s)}${HINT}
      <p class="source">${escapeHTML(main.source)}</p>
      ${i === main.sentences.length - 1 ? `<p class="small">${escapeHTML(main.punctuationNote)}</p>` : ''}`,
  })),
  ...analogies.map((a, i) => ({
    section: 'analogy', eyebrow: `用生活例子想一想・${i + 1} / ${analogies.length}`,
    body: `${title(a.title)}<p class="deck-text">${escapeHTML(a.body)}</p>`,
  })),
  {
    section: 'scene', eyebrow: '情境帶入',
    body: `${title(scene.title)}${scene.paragraphs.map((p) => `<p>${escapeHTML(p)}</p>`).join('')}
      <p class="small">${escapeHTML(scene.disclaimer)}</p>`,
  },
  {
    section: 'scene', eyebrow: '情境帶入・討論',
    body: `${title('討論')}<ol class="deck-list">${scene.questions.map((q) => `<li>${escapeHTML(q)}</li>`).join('')}</ol>`,
  },
  ...extensions.map((x, i) => ({
    section: 'ext', eyebrow: `延伸閱讀・${i + 1} / ${extensions.length}`,
    body: `${title(x.title)}${x.sentences.map(sentenceHTML).join('')}
      <p class="source">${escapeHTML(x.source)}</p>
      <p class="hint">${escapeHTML(x.link)}</p>
      ${x.href ? `<p><a href="${escapeHTML(x.href)}">${escapeHTML(x.hrefLabel)}</a></p>` : ''}
      ${x.pending ? `<p class="small"><span class="tag todo">待查證</span> ${escapeHTML(x.pending)}</p>` : ''}
      ${i === extensions.length - 1 ? `<p class="next-step"><a class="btn-link" href="quiz.html">讀完了？來做隨堂測驗 →</a></p>
        <p class="story-note">${escapeHTML(lesson.sourceNote)}</p>` : ''}`,
  })),
];
const keys = pages.map((_, i) => `p${i + 1}`);
const SECTIONS = [['main', '主文'], ['analogy', '比喻'], ['scene', '情境'], ['ext', '延伸']];

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
