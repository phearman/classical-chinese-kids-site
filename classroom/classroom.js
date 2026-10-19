// 孔子講堂:講堂場景+點(觸)人物看人物卡。資料來自 data.js。
// 一屏版(WY13,使用者裁定「小圖加彈框」):孔子+14 位學生的小圖依座位排進一屏(依可用高度縮放);
// 點小圖在畫面正中央跳出彈框(上半大圖、下半人物卡),彈框內可上一位/下一位(依座位順序循環)。
// 空間真的不夠(小圖點擊區不到 44px)時改成一排一頁、左右滑。
import { teacher, students, rows } from './data.js?v=b2c26e6';
import { escapeHTML } from '../shared/terms.js?v=b2c26e6';
import { initPage, onSwipe, overlayOpen } from '../shared/page.js?v=b2c26e6';
import { characterURL as imageURL } from '../shared/assets.js?v=b2c26e6';

initPage({ paged: true });
const app = document.getElementById('app');
const byId = Object.fromEntries([teacher, ...students].map((p) => [p.id, p]));
const ORDER = [teacher.id, ...rows.flat()]; // 上一位/下一位的順序:孔子,再依座位由前到後、由左到右

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
        <h2 class="sheet-word" id="pc-name">${escapeHTML(p.name)}</h2>
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

const ROW_COUNT = rows.length + 1; // 孔子那一排+學生各排
app.innerHTML = `
  <main class="hall-view">
    <h1 class="sr-only">孔子講堂</h1>
    <div class="hall" id="hall" role="group" aria-label="講堂座位">
      <div class="hall-front" data-row="0">${seatHTML(teacher, { isTeacher: true })}</div>
      ${rows.map((r, i) => `<div class="hall-row" data-row="${i + 1}">${r.map((id) => seatHTML(byId[id])).join('')}</div>`).join('')}
    </div>
    <nav class="pager row-pager" aria-label="換排" hidden>
      <button type="button" class="prev">← 上一排</button>
      <p class="deck-count" id="row-count"></p>
      <button type="button" class="next">下一排 →</button>
    </nav>
    <div class="hall-foot">
      <p class="hint">點一位學生，看他的個性、名言和小故事。</p>
      <button type="button" class="info-btn" id="info" aria-label="關於孔子講堂" aria-haspopup="dialog">ⓘ</button>
    </div>
    <dialog class="note-dialog" id="info-dialog" aria-labelledby="info-title">
      <form method="dialog" class="note-card">
        <h2 id="info-title">關於孔子講堂</h2>
        <p>《論語》裡最常出場的 14 位學生都在這裡上課。</p>
        <p class="small">排序依《論語》中提到的章數；長相除了標「已查證」的記載外，都是造型設計。資料整理自本站「論語人物誌」。</p>
        <p class="small">人物圖由 AI 生成，講堂背景為程式繪製；古文引自公有領域古籍，白話為本站自行撰寫。</p>
        <button value="close">關閉</button>
      </form>
    </dialog>
  </main>`;

const $ = (id) => document.getElementById(id);
const hall = $('hall');

// ---------------------------------------------------------------- 一排一頁(空間不夠時)
let rowPage = 0;
function layoutRows() {
  // 一屏排不下(每格寬或高不到 44px)才改成一排一頁
  hall.classList.remove('is-rowpaged');
  // 量座位格(不是按鈕本身:按鈕有 44px 最小值,會撐出格外)
  const tooSmall = [...hall.querySelectorAll('.hall-row')].some((row) => {
    const r = row.getBoundingClientRect();
    return (r.width - 3 * 2) / 4 < 44 || r.height < 44; // 每排 4 格、格距 2px
  });
  hall.classList.toggle('is-rowpaged', tooSmall);
  document.querySelector('.row-pager').hidden = !tooSmall;
  showRow(rowPage);
}
function showRow(i) {
  rowPage = (i + ROW_COUNT) % ROW_COUNT;
  for (const r of hall.children) r.classList.toggle('is-current', Number(r.dataset.row) === rowPage);
  $('row-count').textContent = `第 ${rowPage + 1} / ${ROW_COUNT} 排`;
}
document.querySelector('.row-pager').addEventListener('click', (e) => {
  if (e.target.closest('.prev')) showRow(rowPage - 1);
  else if (e.target.closest('.next')) showRow(rowPage + 1);
});
onSwipe(hall, (d) => { if (hall.classList.contains('is-rowpaged')) showRow(rowPage + d); });
new ResizeObserver(layoutRows).observe(app);

// ---------------------------------------------------------------- 說明(ⓘ)
$('info').addEventListener('click', () => $('info-dialog').showModal());
$('info-dialog').addEventListener('click', (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });
$('info-dialog').addEventListener('close', () => $('info').focus());

// ---------------------------------------------------------------- 人物彈框(<dialog>;正中央、上半大圖、下半人物卡)
// Esc、✕、點彈框外都能關;關閉後焦點回到目前這位的小圖;←→ 或按鈕換人(循環)
const dialog = document.createElement('dialog');
dialog.className = 'person-sheet';
dialog.setAttribute('aria-labelledby', 'pc-name');
dialog.innerHTML = `
  <div class="pc-frame">
    <div class="pc-top"><img class="pc-img" alt=""></div>
    <div class="pc-body"></div>
    <nav class="pc-nav" aria-label="換人">
      <button type="button" class="pc-prev">← 上一位</button>
      <span class="pc-count" aria-hidden="true"></span>
      <button type="button" class="pc-next">下一位 →</button>
    </nav>
    <p class="sr-only" aria-live="polite" id="pc-live"></p>
  </div>`;
document.body.append(dialog);
let currentId = null;

function showPerson(id, { announce = false } = {}) {
  currentId = id;
  const p = byId[id];
  const body = dialog.querySelector('.pc-body');
  const refocus = body.contains(document.activeElement); // 換人會重畫人物卡,焦點在卡內就移到新卡的關閉鈕
  dialog.querySelector('.pc-img').src = imageURL(p.image);
  body.innerHTML = cardHTML(p);
  if (refocus) body.querySelector('[data-close]').focus();
  dialog.querySelector('.pc-body').scrollTop = 0;
  dialog.querySelector('.pc-count').textContent = `${ORDER.indexOf(id) + 1} / ${ORDER.length}`;
  if (announce) $('pc-live').textContent = `${p.name}，第 ${ORDER.indexOf(id) + 1} / ${ORDER.length} 位`;
}
function stepPerson(d) {
  const i = (ORDER.indexOf(currentId) + d + ORDER.length) % ORDER.length;
  showPerson(ORDER[i], { announce: true });
}

dialog.addEventListener('click', (e) => {
  if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
  else if (e.target.closest('.pc-prev')) stepPerson(-1);
  else if (e.target.closest('.pc-next')) stepPerson(1);
});
document.addEventListener('keydown', (e) => {
  if (!dialog.open) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); stepPerson(1); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); stepPerson(-1); }
});
dialog.addEventListener('close', () => {
  const seat = hall.querySelector(`.seat[data-person="${currentId}"]`);
  if (hall.classList.contains('is-rowpaged')) showRow(Number(seat.parentElement.dataset.row));
  seat?.focus();
});
hall.addEventListener('click', (e) => {
  const seat = e.target.closest('.seat');
  if (!seat || overlayOpen()) return;
  showPerson(seat.dataset.person);
  dialog.showModal();
  dialog.querySelector('[data-close]').focus();
});
