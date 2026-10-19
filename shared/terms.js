// 原文標記解析:{詞} 或 {詞=詞條id} → 可點的詞;其餘文字照原樣顯示。

const MARK = /\{([^{}=]+)(?:=([^{}]+))?\}/g;

export function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

// 回傳 [{ text, id? }]:有 id 的是可點的詞。
export function parseMarked(source) {
  const parts = [];
  let last = 0;
  for (const m of source.matchAll(MARK)) {
    if (m.index > last) parts.push({ text: source.slice(last, m.index) });
    parts.push({ text: m[1], id: m[2] ?? m[1] });
    last = m.index + m[0].length;
  }
  if (last < source.length) parts.push({ text: source.slice(last) });
  return parts;
}

// 去掉標記,只留文字。
export function plainText(source) {
  return parseMarked(source).map((p) => p.text).join('');
}

export function renderMarked(source) {
  return parseMarked(source)
    .map((p) => (p.id
      ? `<button type="button" class="term" data-term="${escapeHTML(p.id)}">${escapeHTML(p.text)}</button>`
      : escapeHTML(p.text)))
    .join('');
}
