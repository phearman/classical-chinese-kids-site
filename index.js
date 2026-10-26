// 課程目錄頁。一屏版(WY13):選單式首頁。WY19 起每課一列、可收合(<details>):
// 預設只顯示課名和一行說明,點開才出現各頁按鈕;一次只開一課;預設展開上次看過的課(ccc:lesson,由 page.js 記),
// 沒有紀錄就展開目錄最後一課。課再多也維持一屏。
import { catalog } from './catalog.js?v=ad37985';
import { escapeHTML } from './shared/terms.js?v=ad37985';
import { initPage, PREF_KEYS } from './shared/page.js?v=ad37985';

// 先讀上次看過的課,再呼叫 initPage(首頁本身不屬於任何一課,不會改寫紀錄)
let last = null;
try { last = localStorage.getItem(PREF_KEYS.lesson); } catch { /* 讀不到就用預設 */ }
initPage({ paged: true });

const lessons = catalog.filter((c) => c.section !== 'site');
// 全站專區(孔子講堂、成語集…)合成一列「全站專區」,課再多首頁也維持一屏(RS97)
const siteAreas = catalog.filter((c) => c.section === 'site');
// 課裡連到全站專區的入口(如神話寓言課的「成語集」)在首頁不重複列,已經在「全站專區」那一列
const siteHrefs = new Set(siteAreas.flatMap((c) => c.pages.map((p) => p.href)));
const rows = [
  ...lessons.map((c) => ({ ...c, pages: c.pages.filter((p) => !siteHrefs.has(p.href)) })),
  ...(siteAreas.length ? [{ id: 'site', title: '全站專區', subtitle: siteAreas.map((c) => c.title).join('・'), pages: siteAreas.flatMap((c) => c.pages) }] : []),
];
const openId = lessons.some((c) => c.id === last) ? last : lessons.at(-1)?.id;
const line = (c) => (c.book ? `${c.book}・${c.subtitle}` : c.subtitle); // 一行說明:課本課次+副標(太長以…收尾)

const app = document.getElementById('app');
app.innerHTML = `
  <main class="home-view">
    <header class="home-head">
      <h1>文言文小幫手</h1>
      <p class="lead">給國中生的文言文讀本：人物故事、白話翻譯、逐詞解釋。</p>
    </header>
    <div class="home-list">
    ${rows.map((c) => `
      <details class="home-group" name="home-lesson" data-lesson="${escapeHTML(c.id)}"${c.id === openId ? ' open' : ''}>
        <summary><span class="home-title">${escapeHTML(c.title)}</span><small>${escapeHTML(line(c))}</small></summary>
        <div class="home-tiles">${c.pages.map((p) =>
          `<a class="tile" href="${escapeHTML(p.href)}"><strong>${escapeHTML(p.label)}</strong><span>${escapeHTML(p.desc)}</span></a>`).join('')}</div>
      </details>`).join('')}
    </div>
    <p class="story-note">課文原文取自公有領域古籍；白話與解釋為本站自行撰寫；角色插圖由 AI 生成，背景與道具為程式繪製。</p>
  </main>`;

// 從上一頁「返回」時,瀏覽器可能直接從往返快取(bfcache)還原舊畫面:重讀上次看過的課,同步展開狀態
addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  let now = null;
  try { now = localStorage.getItem(PREF_KEYS.lesson); } catch { /* 讀不到就不動 */ }
  if (!lessons.some((c) => c.id === now)) return;
  app.querySelectorAll('details.home-group').forEach((d) => { d.open = d.dataset.lesson === now; });
});

// 一次只開一課:新版瀏覽器靠 <details name> 自動做到;舊瀏覽器由這裡補上
app.querySelectorAll('details.home-group').forEach((d) => d.addEventListener('toggle', () => {
  if (!d.open) return;
  app.querySelectorAll('details.home-group[open]').forEach((o) => { if (o !== d) o.open = false; });
}));
