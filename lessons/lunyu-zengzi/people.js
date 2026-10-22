// 人物介紹:孔子、曾子、門人+曾子的代表故事。
// 一屏版(WY13):一人一頁、一個故事一頁;上一頁/下一頁、←→ 鍵、手機左右滑。頁碼記在網址 #p1~#pN。
import { people, stories } from './data.js?v=0e85906';
import { escapeHTML } from '../../shared/terms.js?v=0e85906';
import { sceneSVG } from '../../shared/figures.js?v=0e85906';
import { initPage } from '../../shared/page.js?v=0e85906';
import { createPaging, pagerHTML, sectionsHTML } from '../../shared/deck.js?v=0e85906';

initPage({ paged: true });
const app = document.getElementById('app');

const tag = (ok) => (ok ? '<span class="tag ok">已查證</span>' : '<span class="tag todo">待查證</span>');
const portrait = { kongzi: ['kongzi'], zengzi: ['zengzi'], menren: ['menren-a', 'menren-b', 'menren-c'] };
const VERIFY_NOTE = '<p class="small">「已查證」是對照過古書原文的；「待查證」還要再查。</p>';

const personHTML = (p) => `
  <h1 id="deck-title" tabindex="-1">${escapeHTML(p.name)}</h1>
  <p class="lead">${escapeHTML(p.tagline)}</p>
  <dl class="facts">${p.facts.map((f) => `
    <div class="fact"><dt>${escapeHTML(f.label)}</dt>
      <dd>${escapeHTML(f.value)}${tag(f.verified)}${f.source ? `<div class="source">${escapeHTML(f.source)}</div>` : ''}</dd></div>`).join('')}
  </dl>
  ${p.timeline.length ? `<h2>時間線</h2><ul class="timeline">${p.timeline.map((t) =>
    `<li><span class="age">${escapeHTML(t.age)}</span><span>${escapeHTML(t.event)}${tag(t.verified)}</span></li>`).join('')}</ul>` : ''}
  <div class="chips">${p.traits.map((t) => `<span>${escapeHTML(t)}</span>`).join('')}</div>
  <p><strong>在這段對話裡：</strong>${escapeHTML(p.role)}</p>
  ${p.funFact ? `<div class="funfact"><strong>外貌小知識</strong>${tag(p.funFact.verified)}<p>${escapeHTML(p.funFact.text)}</p>
    <div class="source">出處：${escapeHTML(p.funFact.source)}</div>
    ${p.funFact.pending ? `<p class="small"><span class="tag todo">待查證</span> ${escapeHTML(p.funFact.pending)}</p>` : ''}</div>` : ''}
  ${p.note ? `<p class="small">${escapeHTML(p.note)}</p>` : ''}
  ${VERIFY_NOTE}`;

const storyHTML = (s) => `
  <h1 id="deck-title" tabindex="-1">${escapeHTML(s.title)}${tag(s.verified)}</h1>
  <p class="deck-text">${escapeHTML(s.body)}</p>
  <p class="hint">${escapeHTML(s.point)}</p>
  <p class="source">出處：${escapeHTML(s.source)}</p>
  <p class="story-note">故事白話為本站自行撰寫。</p>`;

const pages = [
  ...people.map((p, i) => ({ section: 'people', eyebrow: `人物 ${i + 1} / ${people.length}`, art: portrait[p.id], name: p.name, body: personHTML(p) })),
  ...stories.map((s, i) => ({ section: 'stories', eyebrow: `曾子的故事 ${i + 1} / ${stories.length}`, body: storyHTML(s) })),
];
const keys = pages.map((_, i) => `p${i + 1}`);

const paging = createPaging({
  root: app,
  keys,
  // 舊連結 people.html#kongzi 等(講堂人物卡「看更完整的介紹」)對到該人那一頁
  aliases: Object.fromEntries(people.map((p, i) => [p.id, keys[i]])),
  onShow(key, i, total) {
    const p = pages[i];
    const sections = [['people', '人物'], ['stories', '曾子的故事']].map(([id, label]) =>
      ({ label, key: keys[pages.findIndex((x) => x.section === id)], current: p.section === id }));
    app.innerHTML = `
      <main class="deck-view">
        ${sectionsHTML(sections, '人物介紹段落')}
        <article class="deck-card${p.art ? ' has-art' : ''}" aria-labelledby="deck-title">
          <p class="deck-eyebrow">${escapeHTML(p.eyebrow)}</p>
          ${p.art ? `<div class="deck-art">${sceneSVG({ bg: 'paper', figures: p.art, props: [], caption: p.name, hideCaption: true })}</div>` : ''}
          <div class="deck-body" tabindex="0" role="region" aria-label="本頁內容">${p.body}</div>
        </article>
        ${pagerHTML(i, total)}
      </main>`;
  },
});

paging.show();
