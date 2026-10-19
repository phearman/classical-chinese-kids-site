// 每頁共用:主題切換(?theme=dark|light,給截圖與測試用)、頂部列、課內分頁籤。
import { escapeHTML } from './terms.js?v=ab14e02';
import { version } from './version.js?v=ab14e02';

// 每頁開頭呼叫:套用主題參數、在頁尾加上版本小字
export function initPage() {
  applyThemeParam();
  mountVersion();
}

export const versionText = (v = version) => (v.commit ? `版本 ${v.date}・${v.commit}` : '版本 開發版');

export function mountVersion(doc = document) {
  if (doc.querySelector('.site-version')) return;
  const p = doc.createElement('p');
  p.className = 'site-version';
  p.textContent = versionText();
  doc.body.append(p);
}

export function applyThemeParam(loc = globalThis.location) {
  const t = new URLSearchParams(loc?.search ?? '').get('theme');
  if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t;
}

// tabs:[{ href, label, current }],href 一律相對路徑
export function chromeHTML({ homeHref, here, tabs = [] }) {
  const tabHTML = tabs.length
    ? `<nav class="tabs" aria-label="本課內容">${tabs.map((t) =>
      `<a href="${escapeHTML(t.href)}"${t.current ? ' aria-current="page"' : ''}>${escapeHTML(t.label)}</a>`).join('')}</nav>`
    : '';
  return {
    top: `<header class="topbar"><div class="wrap"><a href="${escapeHTML(homeHref)}">← 課程目錄</a><span class="here">${escapeHTML(here)}</span></div></header>`,
    tabs: tabHTML,
  };
}

export const lessonTabs = (current) => [
  { href: 'animation.html', label: '動畫故事', current: current === 'animation' },
  { href: 'story.html', label: '圖文故事', current: current === 'story' },
  { href: 'study.html', label: '課文學習', current: current === 'study' },
  { href: 'people.html', label: '人物介紹', current: current === 'people' },
  { href: 'quiz.html', label: '隨堂測驗', current: current === 'quiz' },
];
