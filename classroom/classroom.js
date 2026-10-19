// 孔子講堂:講堂場景+點(觸)人物看人物卡。資料來自 data.js。
import { teacher, students, rows } from './data.js?v=ab14e02';
import { escapeHTML } from '../shared/terms.js?v=ab14e02';
import { initPage, chromeHTML } from '../shared/page.js?v=ab14e02';

initPage();
const app = document.getElementById('app');
const chrome = chromeHTML({ homeHref: '../index.html', here: '孔子講堂' });
const byId = Object.fromEntries([teacher, ...students].map((p) => [p.id, p]));
import { characterURL as imageURL } from '../shared/assets.js?v=ab14e02';

const tag = (ok) => (ok ? '<span class="tag ok">已查證</span>' : '<span class="tag todo">待查證</span>');
const pending = (text) => (text ? `<p class="small"><span class="tag todo">待查證</span> ${escapeHTML(text)}</p>` : '');

function seatHTML(p, { isTeacher = false } = {}) {
  return `
    <button type="button" class="seat${isTeacher ? ' is-teacher' : ''}" data-person="${p.id}" aria-label="${escapeHTML(p.name)}：打開人物卡">
      <img src="${imageURL(p.image)}" alt="">
      <span class="seat-name">${escapeHTML(p.name)}</span>
    </button>`;
}

function cardHTML(p) {
  const facts = [
    ['名與字', p.courtesy],
    p.younger !== undefined ? ['年齡', p.younger ? `比孔子小 ${p.younger} 歲` : '《史記》沒有記載'] : null,
    p.chapters ? ['出場', `《論語》中 ${p.chapters} 章提到他`] : null,
  ].filter(Boolean);
  const block = (title, q) => (q ? `
    <section class="pc-block"><h3>${title}</h3>
      <p class="classical">${escapeHTML(q.text)}</p>
      ${q.plain ? `<p class="plain">${escapeHTML(q.plain)}</p>` : ''}
      <p class="source">${escapeHTML(q.source)}</p>${pending(q.pending)}</section>` : '');
  return `
    <div class="sheet-card person-card">
      <header class="sheet-head">
        <span class="sheet-word">${escapeHTML(p.name)}</span>
        <button type="button" class="sheet-close" data-close aria-label="關閉">✕</button>
        <span class="sheet-reading">${escapeHTML(p.oneLine)}</span>
      </header>
      <dl class="facts">${facts.map(([k, v]) => `<div class="fact"><dt>${k}</dt><dd>${escapeHTML(v)}</dd></div>`).join('')}</dl>
      ${block('代表章句', p.quote)}
      ${block('孔子怎麼說他', p.comment)}
      ${p.story ? `<section class="pc-block"><h3>小故事：${escapeHTML(p.story.title)}</h3><p>${escapeHTML(p.story.body)}</p><p class="source">${escapeHTML(p.story.source)}</p></section>` : ''}
      <section class="pc-block"><h3>外貌記載</h3>
        ${p.looks ? `<p>${escapeHTML(p.looks.text)}${tag(p.looks.verified)}</p><p class="source">${escapeHTML(p.looks.source)}</p>${pending(p.looks.pending)}` : '<p>史書沒有記載。圖中的長相是造型設計。</p>'}
      </section>
      <section class="pc-block"><h3>在講堂裡</h3><p>${escapeHTML(p.action)}</p></section>
      ${p.link ? `<p><a href="${escapeHTML(p.link)}">看更完整的介紹 →</a></p>` : ''}
    </div>`;
}

app.innerHTML = `
  ${chrome.top}
  <main class="wrap">
    <h1>孔子講堂</h1>
    <p class="lead">《論語》裡最常出場的 14 位學生都在這裡上課。點一位學生，看他的個性、名言和小故事。</p>
    <div class="hall" role="group" aria-label="講堂">
      <div class="hall-front">${seatHTML(teacher, { isTeacher: true })}</div>
      ${rows.map((r) => `<div class="hall-row">${r.map((id) => seatHTML(byId[id])).join('')}</div>`).join('')}
    </div>
    <p class="small">排序依《論語》中提到的章數；長相除了標「已查證」的記載外，都是造型設計。資料整理自本站「論語人物誌」。</p>
    <footer>人物圖由 AI 生成，講堂背景為程式繪製；古文引自公有領域古籍，白話為本站自行撰寫。</footer>
  </main>`;

// ---------------------------------------------------------------- 人物卡(<dialog>;Esc、✕、點背景都能關,關閉後焦點回到原來的人)
const dialog = document.createElement('dialog');
dialog.className = 'sheet person-sheet';
dialog.setAttribute('aria-label', '人物卡');
document.body.append(dialog);
let opener = null;
dialog.addEventListener('click', (e) => {
  if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
});
dialog.addEventListener('close', () => {
  if (opener?.isConnected) opener.focus();
  opener = null;
});
app.addEventListener('click', (e) => {
  const seat = e.target.closest('.seat');
  if (!seat) return;
  opener = seat;
  dialog.innerHTML = cardHTML(byId[seat.dataset.person]);
  dialog.showModal();
  dialog.querySelector('[data-close]').focus();
});
