// 〈古代神話與寓言選〉課文學習版:神話與寓言是什麼 → 兩則原典一句一頁(原文、點詞詞卡、白話)→ 故事卡(盤古、女媧與共工、驚弓之鳥)
// → 比喻、想一想、出處各自成頁。一屏版(比照第 7 課):上方段落籤可跳段;頁碼記在網址 #p1~#pN。
import { lesson, glossary, study } from './data.js?v=9bb0ba7';
import { renderMarked, escapeHTML } from '../../shared/terms.js?v=9bb0ba7';
import { setupGlossary } from '../../shared/sheet.js?v=9bb0ba7';
import { initPage } from '../../shared/page.js?v=9bb0ba7';
import { createPaging, pagerHTML, sectionsHTML } from '../../shared/deck.js?v=9bb0ba7';

initPage({ paged: true });
const app = document.getElementById('app');
const { intro, parts, stories, analogies, think, books, booksNote } = study;

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
  {
    section: 'intro', eyebrow: '先認識',
    body: `${title(intro.title)}
      <dl class="facts">${intro.items.map((x) => `<div class="fact"><dt>${escapeHTML(x.term)}</dt><dd>${escapeHTML(x.text)}</dd></div>`).join('')}</dl>
      <p class="hint">${escapeHTML(intro.note)}</p>`,
  },
  ...parts.flatMap((p) => p.sentences.map((s, i) => {
    const last = i === p.sentences.length - 1;
    return {
      section: p.id, eyebrow: `${p.title}・第 ${i + 1} / ${p.sentences.length} 句`,
      body: `${title(p.title)}${sentenceHTML(s)}${HINT}
        <p class="source">${escapeHTML(p.source)}</p>
        ${last ? `<p class="hint"><strong>重點：</strong>${escapeHTML(p.point)}</p>` : ''}
        ${last && p.idiom ? `<p class="hint">${escapeHTML(p.idiom)}</p>` : ''}`,
    };
  })),
  ...stories.map((s, i) => ({
    section: 'story', eyebrow: `故事卡・${i + 1} / ${stories.length}`,
    body: `${title(s.title)}
      ${s.body.map((t) => `<p class="deck-text">${escapeHTML(t)}</p>`).join('')}
      ${s.note ? `<p class="hint">${escapeHTML(s.note)}</p>` : ''}
      ${s.idiom ? `<p class="hint">${escapeHTML(s.idiom)}</p>` : ''}
      <ul class="deck-list story-sources">${s.sources.map((x) => `<li class="source">${escapeHTML(x.text)}：${escapeHTML(x.from)}${tag(x.verified)}</li>`).join('')}</ul>
      <p class="story-note">故事白話為本站自行撰寫。</p>`,
  })),
  ...analogies.map((a, i) => ({
    section: 'analogy', eyebrow: `用生活例子想一想・${i + 1} / ${analogies.length}`,
    body: `${title(a.title)}<p class="deck-text">${escapeHTML(a.body)}</p>`,
  })),
  {
    section: 'think', eyebrow: '想一想',
    body: `${title(think.title)}<ol class="deck-list">${think.questions.map((q) => `<li>${escapeHTML(q)}</li>`).join('')}</ol>`,
  },
  {
    section: 'books', eyebrow: '出處',
    body: `${title('故事出自哪些書')}
      <dl class="facts">${books.map((b) => `
        <div class="fact"><dt>${escapeHTML(b.name)}</dt>
          <dd>${escapeHTML(b.about)}${tag(b.verified)}<div class="source">${escapeHTML(b.source)}</div></dd></div>`).join('')}
      </dl>
      <p class="small"><span class="tag todo">待查證</span> ${escapeHTML(booksNote.pending)}</p>
      <p class="next-step"><a class="btn-link" href="quiz.html">讀完了？來做隨堂測驗 →</a></p>
      <p class="story-note">${escapeHTML(lesson.sourceNote)}</p>`,
  },
];
const keys = pages.map((_, i) => `p${i + 1}`);
const SECTIONS = [['intro', '神話與寓言'], ...parts.map((p) => [p.id, p.short]), ['story', '故事卡'], ['analogy', '比喻'], ['think', '想一想'], ['books', '出處']];

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
