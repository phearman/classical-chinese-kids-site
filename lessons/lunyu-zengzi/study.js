// 課文學習版:原文逐句+白話、點詞看解釋、比喻、情境帶入、延伸章節。
import { lesson, glossary, study } from './data.js?v=ab14e02';
import { renderMarked, escapeHTML } from '../../shared/terms.js?v=ab14e02';
import { setupGlossary } from '../../shared/sheet.js?v=ab14e02';
import { initPage, chromeHTML, lessonTabs } from '../../shared/page.js?v=ab14e02';

initPage();
const app = document.getElementById('app');
const chrome = chromeHTML({ homeHref: '../../index.html', here: lesson.title, tabs: lessonTabs('study') });

const sentencesHTML = (list) => list.map((s) => `
  <div class="sentence">
    <div class="classical">${renderMarked(s.text)}</div>
    <p class="plain">${escapeHTML(s.plain)}</p>
  </div>`).join('');

const { main, analogies, scene, extensions } = study;

app.innerHTML = `
  ${chrome.top}
  <main class="wrap">
    ${chrome.tabs}
    <h1>${escapeHTML(lesson.title)}</h1>
    <p class="lead">${escapeHTML(lesson.subtitle)}</p>

    <h2>${escapeHTML(main.title)}</h2>
    <p class="hint">點畫底線的字，看讀音、意思和比喻；每句下面是白話。</p>
    <section class="card" aria-label="原文與白話">
      ${sentencesHTML(main.sentences)}
      <p class="source">${escapeHTML(main.source)}</p>
    </section>
    <p class="small">${escapeHTML(main.punctuationNote)}</p>

    <h2>用生活例子想一想</h2>
    ${analogies.map((a) => `<section class="card"><h3>${escapeHTML(a.title)}</h3><p>${escapeHTML(a.body)}</p></section>`).join('')}

    <h2>${escapeHTML(scene.title)}</h2>
    <section class="card">
      ${scene.paragraphs.map((p) => `<p>${escapeHTML(p)}</p>`).join('')}
      <p class="small">${escapeHTML(scene.disclaimer)}</p>
    </section>
    <section class="card">
      <h3>討論</h3>
      <ol>${scene.questions.map((q) => `<li>${escapeHTML(q)}</li>`).join('')}</ol>
    </section>

    ${extensions.map((x) => `
      <h2>${escapeHTML(x.title)}</h2>
      <section class="card">
        ${sentencesHTML(x.sentences)}
        <p class="source">${escapeHTML(x.source)}</p>
      </section>
      <p class="hint">${escapeHTML(x.link)}</p>
      ${x.pending ? `<p class="small"><span class="tag todo">待查證</span> ${escapeHTML(x.pending)}</p>` : ''}`).join('')}

    <p class="next-step"><a class="btn-link" href="quiz.html">讀完了？來做隨堂測驗 →</a></p>

    <footer>${escapeHTML(lesson.sourceNote)}</footer>
  </main>`;

setupGlossary(glossary, app);
