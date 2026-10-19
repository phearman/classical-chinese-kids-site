// 人物介紹:孔子、曾子、門人+曾子的代表故事。
import { lesson, people, stories } from './data.js?v=ab14e02';
import { escapeHTML } from '../../shared/terms.js?v=ab14e02';
import { sceneSVG } from '../../shared/figures.js?v=ab14e02';
import { initPage, chromeHTML, lessonTabs } from '../../shared/page.js?v=ab14e02';

initPage();
const app = document.getElementById('app');
const chrome = chromeHTML({ homeHref: '../../index.html', here: lesson.title, tabs: lessonTabs('people') });

const tag = (ok) => (ok ? '<span class="tag ok">已查證</span>' : '<span class="tag todo">待查證</span>');
const portrait = { kongzi: ['kongzi'], zengzi: ['zengzi'], menren: ['menren-a', 'menren-b', 'menren-c'] };

const personHTML = (p) => `
  <section class="card" id="${escapeHTML(p.id)}">
    <h2>${escapeHTML(p.name)}</h2>
    <p class="lead">${escapeHTML(p.tagline)}</p>
    ${sceneSVG({ bg: 'paper', figures: portrait[p.id], props: [], caption: p.name, hideCaption: true })}
    <dl class="facts">${p.facts.map((f) => `
      <div class="fact"><dt>${escapeHTML(f.label)}</dt>
        <dd>${escapeHTML(f.value)}${tag(f.verified)}${f.source ? `<div class="source">${escapeHTML(f.source)}</div>` : ''}</dd></div>`).join('')}
    </dl>
    ${p.timeline.length ? `<h3>時間線</h3><ul class="timeline">${p.timeline.map((t) =>
      `<li><span class="age">${escapeHTML(t.age)}</span><span>${escapeHTML(t.event)}${tag(t.verified)}</span></li>`).join('')}</ul>` : ''}
    <div class="chips">${p.traits.map((t) => `<span>${escapeHTML(t)}</span>`).join('')}</div>
    <p><strong>在這段對話裡：</strong>${escapeHTML(p.role)}</p>
    ${p.funFact ? `<div class="funfact"><strong>外貌小知識</strong>${tag(p.funFact.verified)}<p>${escapeHTML(p.funFact.text)}</p>
      <div class="source">出處：${escapeHTML(p.funFact.source)}</div>
      ${p.funFact.pending ? `<p class="small"><span class="tag todo">待查證</span> ${escapeHTML(p.funFact.pending)}</p>` : ''}</div>` : ''}
    ${p.note ? `<p class="small">${escapeHTML(p.note)}</p>` : ''}
  </section>`;

app.innerHTML = `
  ${chrome.top}
  <main class="wrap">
    ${chrome.tabs}
    <h1>人物介紹</h1>
    <p class="lead">「已查證」是對照過古書原文的；「待查證」還要再查。</p>
    ${people.map(personHTML).join('')}
    <h2>曾子的故事</h2>
    ${stories.map((s) => `
      <section class="card">
        <h3>${escapeHTML(s.title)}${tag(s.verified)}</h3>
        <p>${escapeHTML(s.body)}</p>
        <p class="hint">${escapeHTML(s.point)}</p>
        <p class="source">出處：${escapeHTML(s.source)}</p>
      </section>`).join('')}
    <footer>故事白話為本站自行撰寫。</footer>
  </main>`;
