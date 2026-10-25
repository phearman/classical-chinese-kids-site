// 詞條小卡:點原文裡的詞,從下方滑出讀音、意思、作用、比喻。
import { escapeHTML } from './terms.js?v=b1d73d1';

export function setupGlossary(glossary, root = document) {
  const dialog = document.createElement('dialog');
  dialog.className = 'sheet';
  dialog.setAttribute('aria-label', '詞語解釋');
  document.body.append(dialog);

  let opener = null;
  const close = () => dialog.close();
  // 關閉後(✕、點背景、Esc)焦點回到剛才點的詞
  dialog.addEventListener('close', () => {
    if (opener?.isConnected) opener.focus();
    opener = null;
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('[data-close]')) close();
  });

  const open = (btn) => {
    const entry = glossary[btn.dataset.term];
    if (!entry) return;
    opener = btn;
    dialog.innerHTML = cardHTML(entry);
    dialog.showModal();
    dialog.querySelector('[data-close]')?.focus();
  };
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.term');
    if (btn) open(btn);
  });
  // 詞是 <span role="button">(見 terms.js):補上按鈕的鍵盤操作,Enter 或 Space 打開
  root.addEventListener('keydown', (e) => {
    const btn = e.target.closest?.('.term');
    if (!btn || (e.key !== 'Enter' && e.key !== ' ') || e.repeat) return;
    e.preventDefault(); // Space 不捲動頁面
    open(btn);
  });
}

export function cardHTML(e) {
  const row = (label, value, cls = '') => (value
    ? `<div class="sheet-row ${cls}"><dt>${label}</dt><dd>${escapeHTML(value)}</dd></div>` : '');
  return `
    <div class="sheet-card">
      <header class="sheet-head">
        <span class="sheet-word">${escapeHTML(e.word)}</span>
        <span class="sheet-reading">${escapeHTML(e.reading)}</span>
        <button type="button" class="sheet-close" data-close aria-label="關閉">✕</button>
      </header>
      <dl>
        ${row('意思', e.meaning)}
        ${row('作用', e.role)}
        ${row('比喻', e.analogy, 'is-analogy')}
        ${row('補充', e.note)}
        ${e.pending ? `<div class="sheet-row is-pending"><dt><span class="tag todo">待查證</span></dt><dd>${escapeHTML(e.pending)}</dd></div>` : ''}
      </dl>
    </div>`;
}
