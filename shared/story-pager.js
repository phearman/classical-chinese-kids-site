// 圖文故事共用翻頁：只接受完整的 #p整數，集中處理鍵盤、點擊與滑動導覽。
import { overlayOpen, onSwipe } from './page.js?v=7c26351';
export function mountStoryPager({ app, pages, render, focusTitle = 'story-title' }) {
  const pageFromHash = () => {
    const match = /^#p([1-9]\d*)$/.exec(location.hash);
    const n = match ? Number(match[1]) : 1;
    return n <= pages.length ? n : 1;
  };
  const go = (n) => { if (Number.isInteger(n) && n >= 1 && n <= pages.length) location.hash = `p${n}`; };
  const show = (focus = false) => {
    const n = pageFromHash();
    render(n, { focus });
    if (focus) document.getElementById(focusTitle)?.focus();
  };
  app.addEventListener('click', (e) => {
    const cur = pageFromHash();
    if (e.target.closest('.prev')) go(cur - 1);
    else if (e.target.closest('.next')) go(cur + 1);
    else if (e.target.closest('[data-go]')) go(Number(e.target.closest('[data-go]').dataset.go));
  });
  document.addEventListener('keydown', (e) => {
    if (overlayOpen()) return;
    if (e.key === 'ArrowRight') go(pageFromHash() + 1);
    if (e.key === 'ArrowLeft') go(pageFromHash() - 1);
  });
  onSwipe(app, (d) => go(pageFromHash() + d));
  addEventListener('hashchange', () => show(true));
  show();
  return { pageFromHash, go };
}
