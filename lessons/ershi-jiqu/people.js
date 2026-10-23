// 人物介紹(WY22):沈復的基本資料與時間線、《浮生六記》四卷導覽、一輩子的物外之趣、延伸人物推薦。
// 一屏版(比照第一課 people.js):一張卡一頁;上一頁/下一頁、←→ 鍵、手機左右滑;頁碼記在網址 #p1~#pN。
import { study, people, recommends } from './data.js?v=f54ffc1';
import { escapeHTML } from '../../shared/terms.js?v=f54ffc1';
import { sceneSVG } from '../../shared/figures.js?v=f54ffc1';
import { initPage } from '../../shared/page.js?v=f54ffc1';
import { createPaging, pagerHTML, sectionsHTML } from '../../shared/deck.js?v=f54ffc1';

initPage({ paged: true });
const app = document.getElementById('app');

const tag = (ok) => (ok ? '<span class="tag ok">已查證</span>' : '<span class="tag todo">待查證</span>');
const JUAN = ['', '卷一 閨房記樂', '卷二 閒情記趣', '卷三 坎坷記愁', '卷四 浪遊記快'];
const cite = (x) => `《浮生六記‧${JUAN[x.juan]}》「${x.quote}」`;
const title = (text) => `<h1 id="deck-title" tabindex="-1">${escapeHTML(text)}</h1>`;
const VERIFY_NOTE = '<p class="small">「已查證」是對照過《浮生六記》原文或所列來源的；「待查證」還要再查。</p>';

// 一屏放得下(CPM 審查 #86:375×812 卡片內容不可內捲,測試把關):基本資料每頁 2 項、時間線每頁 3 筆、物外之趣分兩頁
const chunk = (list, n) => Array.from({ length: Math.ceil(list.length / n) }, (_, i) => list.slice(i * n, i * n + n));
const factParts = chunk(study.author.facts, 2);
const factsHTML = (facts, part) => `
  ${title(part === 1 ? '沈復' : `沈復（${part} / ${factParts.length}）`)}
  ${part === 1 ? `<p class="lead">${escapeHTML(people.tagline)}</p>` : ''}
  <dl class="facts">${facts.map((f) => `
    <div class="fact"><dt>${escapeHTML(f.label)}</dt>
      <dd>${escapeHTML(f.value)}${tag(f.verified)}<div class="source">${escapeHTML(f.source)}</div></dd></div>`).join('')}
  </dl>
  ${part === factParts.length ? VERIFY_NOTE : ''}`;

const tlParts = chunk(people.timeline, 3);
const timelineHTML = (items, part) => `
  ${title(`沈復的一生（${part} / ${tlParts.length}）`)}
  <ul class="timeline">${items.map((t) => `
    <li><span class="age">${escapeHTML(t.when)}</span>
      <span>${escapeHTML(t.event)}${tag(t.verified)}
        ${t.quote ? `<div class="source">${escapeHTML(cite(t))}</div>` : ''}
        ${t.pending ? `<div class="source">${escapeHTML(t.pending)}</div>` : ''}</span></li>`).join('')}
  </ul>
  ${part === tlParts.length ? '<p class="small">年紀是書中的虛歲；年分依中研院「兩千年中西曆轉換」換算。</p>' : ''}`;

const bookHTML = (b) => `
  ${title(`〈${b.title}〉`)}
  <p class="lead">${escapeHTML(b.about)}</p>
  <div class="sentence">
    <div class="classical">${escapeHTML(b.quote)}</div>
    <p class="plain"><span class="plain-tag">白話</span>${escapeHTML(b.plain)}</p>
  </div>
  <p class="source">出處：《浮生六記‧${escapeHTML(JUAN[b.juan])}》</p>`;

const lostHTML = () => `
  ${title(people.lostBooks.title)}
  ${people.lostBooks.text.map((t) => `<p class="deck-text">${escapeHTML(t)}</p>`).join('')}
  <p class="source">出處：${escapeHTML(people.lostBooks.source)}</p>`;

const hobbyParts = [people.hobbies.items.slice(0, 2), people.hobbies.items.slice(2)]; // 第一頁有插圖,只放兩項
const hobbiesHTML = (items, part) => {
  const h = people.hobbies;
  const last = part === hobbyParts.length;
  return `
  ${title(part === 1 ? h.title : `${h.title}（續）`)}
  ${part === 1 ? `<p class="lead">${escapeHTML(h.intro)}</p>` : ''}
  <ul class="deck-list">${items.map((x) => `
    <li><strong>${escapeHTML(x.what)}</strong>${tag(true)}<div class="source">${escapeHTML(cite(x))}</div></li>`).join('')}
  </ul>
  ${last ? `<p class="hint"><strong>重點：</strong>${escapeHTML(h.point)}</p>` : ''}`;
};

const recHTML = (r) => `
  ${title(r.name)}
  <p class="lead">${escapeHTML(r.era)}・${escapeHTML(r.years)}</p>
  <p><strong>和沈復的關係：</strong>${escapeHTML(r.relation)}</p>
  <div class="funfact"><strong>推薦閱讀</strong><span class="tag level">${escapeHTML(r.level)}</span>
    <p>${escapeHTML(r.piece)}</p>
    <p class="small">${escapeHTML(r.why)}</p>
    ${r.url ? `<p class="source"><a href="${escapeHTML(r.url)}" target="_blank" rel="noopener">到維基文庫讀原文</a>（公有領域）</p>` : ''}
  </div>
  <p class="small">年代、關係都查過教育部辭典或維基文庫的原文；出處列在本課的資料來源。</p>`;

const pages = [
  ...factParts.map((facts, i) => ({ section: 'person', eyebrow: '人物', ...(i === 0 ? { art: ['shenfu-adult'], name: '沈復' } : {}), body: factsHTML(facts, i + 1) })),
  ...tlParts.map((items, i) => ({ section: 'person', eyebrow: '時間線', body: timelineHTML(items, i + 1) })),
  ...people.books.map((b, i) => ({ section: 'books', eyebrow: `《浮生六記》四卷導覽・${i + 1} / 4`, body: bookHTML(b) })),
  { section: 'books', eyebrow: '《浮生六記》四卷導覽', body: lostHTML() },
  ...hobbyParts.map((items, i) => ({ section: 'hobby', eyebrow: '和課文的連結', ...(i === 0 ? { art: ['shenfu'], name: '小沈復' } : {}), body: hobbiesHTML(items, i + 1) })),
  ...recommends.map((r, i) => ({ section: 'more', eyebrow: `延伸人物推薦・${i + 1} / ${recommends.length}`, body: recHTML(r) })),
];
const keys = pages.map((_, i) => `p${i + 1}`);

const paging = createPaging({
  root: app,
  keys,
  onShow(key, i, total) {
    const p = pages[i];
    const sections = [['person', '沈復'], ['books', '四卷導覽'], ['hobby', '物外之趣'], ['more', '延伸人物']].map(([id, label]) =>
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
