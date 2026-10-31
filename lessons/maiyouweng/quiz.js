// 隨堂測驗頁:題目由 quiz-data.js 產生;作答只存在這台裝置的瀏覽器(localStorage),不上傳、不需帳號。
// 一屏版(WY13):第一頁是說明與程度選擇,之後一題一頁(題組一頁);網址 #intro、#題號。
import { quizMeta, categories, levels, goals, types, questions, gradeItem, isAutoGraded, flatItems } from './quiz-data.js?v=64f7467';
import { escapeHTML } from '../../shared/terms.js?v=64f7467';
import { initPage } from '../../shared/page.js?v=64f7467';
import { createPaging, pagerHTML } from '../../shared/deck.js?v=64f7467';

initPage({ paged: true });
const app = document.getElementById('app');

// ---------------------------------------------------------------- 本機儲存(讀寫都包 try/catch,失敗就只在記憶體裡)
const emptyState = () => ({ answers: {}, submitted: {}, checks: {}, level: 'all' });
function load() {
  try {
    const raw = localStorage.getItem(quizMeta.storageKey);
    return raw ? { ...emptyState(), ...JSON.parse(raw) } : emptyState();
  } catch { return emptyState(); }
}
function save() {
  try { localStorage.setItem(quizMeta.storageKey, JSON.stringify(state)); } catch { /* 無法儲存時照常作答 */ }
}
function clearAll() {
  try { localStorage.removeItem(quizMeta.storageKey); } catch { /* 忽略 */ }
  state = emptyState();
}
let state = load();

// ---------------------------------------------------------------- 畫面
const tag = (text, cls = '') => `<span class="qtag ${cls}">${escapeHTML(text)}</span>`;

function inputsHTML(q) {
  const name = `q-${q.id}`;
  const saved = state.answers[q.id];
  const locked = state.submitted[q.id] ? ' disabled' : '';
  if (q.type === 'single' || q.type === 'truefalse') {
    const opts = q.type === 'truefalse' ? [['true', '是（對）'], ['false', '非（錯）']] : q.options.map((o, i) => [String(i), o]);
    return `<div class="choices" role="radiogroup" aria-labelledby="${name}-p">${opts.map(([v, label]) => `
      <label class="choice"><input type="radio" name="${name}" value="${v}"${String(saved) === v ? ' checked' : ''}${locked}> <span>${escapeHTML(label)}</span></label>`).join('')}</div>`;
  }
  if (q.type === 'multi') {
    return `<div class="choices" role="group" aria-labelledby="${name}-p">${q.options.map((o, i) => `
      <label class="choice"><input type="checkbox" name="${name}" value="${i}"${(saved ?? []).includes(i) ? ' checked' : ''}${locked}> <span>${escapeHTML(o)}</span></label>`).join('')}</div>`;
  }
  if (q.type === 'fill') {
    return `<input class="fill" type="text" name="${name}" aria-labelledby="${name}-p" autocomplete="off" value="${escapeHTML(saved ?? '')}"${locked}>`;
  }
  // 看過參考答案後改成唯讀(修改不會再存);要改就按「重做這題」
  const ro = state.submitted[q.id] ? ` readonly aria-describedby="${name}-ro"` : '';
  return `<textarea class="essay" name="${name}" rows="4" aria-labelledby="${name}-p" placeholder="寫下你的想法"${ro}>${escapeHTML(saved ?? '')}</textarea>${ro ? `<p class="small" id="${name}-ro">已看過參考答案；想修改答案，請按「重做這題」。</p>` : ''}`;
}

function feedbackHTML(q) {
  if (!state.submitted[q.id]) return '';
  if (isAutoGraded(q)) {
    const ok = gradeItem(q, state.answers[q.id]);
    const right = q.type === 'single' ? q.options[q.answer]
      : q.type === 'truefalse' ? (q.answer ? '是（對）' : '非（錯）')
        : q.type === 'multi' ? q.answer.map((i) => q.options[i]).join('、') : q.answer;
    return `<div class="feedback ${ok ? 'is-ok' : 'is-wrong'}">
      <strong tabindex="-1">${ok ? '答對了！' : '再想想'}</strong>${ok ? '' : `<p>正確答案：${escapeHTML(right)}</p>`}
      <p>${escapeHTML(q.explanation)}</p>
      ${q.source ? `<p class="source">出處：${escapeHTML(q.source)}</p>` : ''}</div>`;
  }
  const checks = state.checks[q.id] ?? [];
  return `<div class="feedback is-ref">
    <strong tabindex="-1">參考答案</strong><p>${escapeHTML(q.reference)}</p>
    <fieldset class="selfcheck"><legend>自我檢核：你的答案有做到嗎？</legend>
      ${q.checklist.map((c, i) => `<label class="choice"><input type="checkbox" data-check="${q.id}" value="${i}"${checks.includes(i) ? ' checked' : ''}> <span>${escapeHTML(c)}</span></label>`).join('')}
    </fieldset>
    ${q.source ? `<p class="source">出處：${escapeHTML(q.source)}</p>` : ''}</div>`;
}

function itemHTML(q, { sub = false } = {}) {
  const submitted = state.submitted[q.id];
  const btn = isAutoGraded(q) ? '送出答案' : '看參考答案';
  return `
    <div class="qitem${sub ? ' is-sub' : ''}" data-qid="${q.id}">
      <div class="qtags">${tag(types[q.type])}${sub ? '' : tag(levels[q.level], 'lv')}${tag(goals[q.goal], 'goal')}</div>
      <p class="qprompt" id="q-${q.id}-p">${escapeHTML(q.prompt)}</p>
      ${q.hints ? `<div class="hints"><strong>怎麼查</strong><p>${escapeHTML(q.hints.direction)}</p>
        <p>關鍵字：${q.hints.keywords.map((k) => `<code>${escapeHTML(k)}</code>`).join(' ')}</p></div>` : ''}
      ${inputsHTML(q)}
      <div class="qactions">
        ${submitted ? '<button type="button" class="redo">重做這題</button>' : `<button type="button" class="submit">${btn}</button>`}
      </div>
      <div class="qfeedback" aria-live="polite">${feedbackHTML(q)}</div>
    </div>`;
}

const levelHidden = (q) => state.level !== 'all' && q.level !== state.level;

function questionHTML(q, n) {
  const hidden = levelHidden(q) ? ' hidden' : '';
  const cat = `<p class="qcat">${escapeHTML(categories[q.category].label)}・${escapeHTML(categories[q.category].desc)}</p>`;
  if (q.type === 'set') {
    return `<section class="card qcard" id="card-${q.id}" data-page="${q.id}"${hidden}>${cat}
      <div class="qnum qhead" tabindex="-1">第 ${n} 題 ${tag(types.set)}${tag(levels[q.level], 'lv')}</div>
      <p class="qprompt">${escapeHTML(q.prompt)}</p>
      <div class="passage">${q.passage.map((p) => `<p>${escapeHTML(p)}</p>`).join('')}</div>
      ${q.items.map((it, i) => `<div class="subnum">(${i + 1})</div>${itemHTML({ ...it, level: q.level }, { sub: true })}`).join('')}
    </section>`;
  }
  return `<section class="card qcard" id="card-${q.id}" data-page="${q.id}"${hidden}>${cat}<div class="qnum qhead" tabindex="-1">第 ${n} 題</div>${itemHTML(q)}</section>`;
}

function summaryHTML() {
  const visible = flatItems().filter((q) => isAutoGraded(q) && (state.level === 'all' || q.level === state.level));
  const done = visible.filter((q) => state.submitted[q.id]);
  const right = done.filter((q) => gradeItem(q, state.answers[q.id]));
  return `選擇、是非、填充：已作答 ${done.length} / ${visible.length} 題，答對 ${right.length} 題`;
}

function render() {
  let n = 0;
  app.innerHTML = `
    <main class="deck-view quiz-view">
      <p class="summary" aria-live="polite">${summaryHTML()}</p>
      <div class="quiz-pages">
        <section class="card qcard quiz-intro" id="card-intro" data-page="intro">
          <h1 class="qhead" tabindex="-1">${escapeHTML(quizMeta.title)}</h1>
          <p class="lead">三類題目：學習內容、延伸提問、引導式查詢。選擇和填充會馬上告訴你對不對；問答題看參考答案後自己檢核。</p>
          <fieldset class="levelpick"><legend>程度</legend>
            ${[['all', '全部'], ['elementary', '小學'], ['junior', '國中']].map(([v, l]) => `
              <label class="pill"><input type="radio" name="level" value="${v}"${state.level === v ? ' checked' : ''}> <span>${l}</span></label>`).join('')}
          </fieldset>
          <p class="small">作答只存在這台裝置的瀏覽器，不會上傳。</p>
          <div class="intro-actions">
            <button type="button" class="start" data-goto="${keysNow()[1] ?? 'intro'}">開始作答 →</button>
            <button type="button" class="clear">清除全部作答</button>
          </div>
          <p class="story-note">題目、解析與參考答案為本站自行撰寫；原文依維基文庫〈賣油翁〉（歐陽修《歸田錄》，公有領域古籍）。</p>
        </section>
        ${questions.map((q) => questionHTML(q, ++n)).join('')}
      </div>
      <div class="pager-slot"></div>
    </main>`;
}

// 目前程度下的頁:說明頁+看得到的題目
const keysNow = () => ['intro', ...questions.filter((q) => !levelHidden(q)).map((q) => q.id)];

function findItem(id) {
  return flatItems().find((q) => q.id === id);
}

function readResponse(q, box) {
  const name = `q-${q.id}`;
  if (q.type === 'single') {
    const el = box.querySelector(`input[name="${name}"]:checked`);
    return el ? Number(el.value) : undefined;
  }
  if (q.type === 'truefalse') {
    const el = box.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value === 'true' : undefined;
  }
  if (q.type === 'multi') return [...box.querySelectorAll(`input[name="${name}"]:checked`)].map((el) => Number(el.value));
  return box.querySelector(`[name="${name}"]`).value;
}

function rerenderItem(box, q, focusSel) {
  box.outerHTML = itemHTML(q, { sub: box.classList.contains('is-sub') });
  const fresh = app.querySelector(`.qitem[data-qid="${q.id}"]`);
  app.querySelector('.summary').textContent = summaryHTML();
  fresh.querySelector(focusSel)?.focus();
}

app.addEventListener('click', (e) => {
  const box = e.target.closest('.qitem');
  if (e.target.closest('.submit') && box) {
    const q = findItem(box.dataset.qid);
    const r = readResponse(q, box);
    const empty = r === undefined || (Array.isArray(r) && r.length === 0) || (typeof r === 'string' && !r.trim() && isAutoGraded(q));
    if (empty) {
      box.querySelector('.qfeedback').innerHTML = '<div class="feedback is-wrong"><strong>先作答再送出喔</strong></div>';
      return;
    }
    state.answers[q.id] = r;
    state.submitted[q.id] = true;
    save();
    rerenderItem(box, { ...q, level: q.level }, '.feedback strong');
  } else if (e.target.closest('.redo') && box) {
    const q = findItem(box.dataset.qid);
    delete state.submitted[q.id];
    delete state.checks[q.id];
    save();
    rerenderItem(box, q, 'input, textarea');
  } else if (e.target.closest('.clear')) {
    const btn = e.target.closest('.clear');
    if (btn.dataset.confirm !== '1') {
      btn.dataset.confirm = '1';
      btn.textContent = '再按一次，確定清除';
      return;
    }
    clearAll();
    render();
    paging.setKeys(keysNow());
    paging.show();
    app.querySelector('.clear').focus();
  }
});

app.addEventListener('change', (e) => {
  if (e.target.name === 'level') {
    state.level = e.target.value;
    save();
    for (const q of questions) app.querySelector(`#card-${q.id}`).hidden = levelHidden(q);
    app.querySelector('.summary').textContent = summaryHTML();
    paging.setKeys(keysNow());
    app.querySelector('.start').dataset.goto = keysNow()[1] ?? 'intro';
    paging.show();
  } else if (e.target.dataset.check) {
    const id = e.target.dataset.check;
    state.checks[id] = [...app.querySelectorAll(`input[data-check="${id}"]:checked`)].map((el) => Number(el.value));
    save();
  }
});

// 寫到一半的問答也存起來(重新整理不會不見)
app.addEventListener('input', (e) => {
  const box = e.target.closest('.qitem');
  if (!box || !e.target.matches('textarea, input.fill')) return;
  if (state.submitted[box.dataset.qid]) return;
  state.answers[box.dataset.qid] = e.target.value;
  save();
});

render();
const paging = createPaging({
  root: app,
  keys: keysNow(),
  focusSel: '.qcard.is-current .qhead',
  onShow(key, i, total) {
    for (const card of app.querySelectorAll('.qcard')) card.classList.toggle('is-current', card.dataset.page === key);
    app.querySelector('.pager-slot').innerHTML = pagerHTML(i, total, { label: i === 0 ? '說明' : `第 ${i} / ${total - 1} 題` });
  },
});
paging.show();
