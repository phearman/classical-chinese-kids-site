// 課程目錄頁。
import { catalog } from './catalog.js?v=ab14e02';
import { escapeHTML } from './shared/terms.js?v=ab14e02';
import { initPage } from './shared/page.js?v=ab14e02';

initPage();
document.getElementById('app').innerHTML = `
  <main class="wrap">
    <h1>文言文小幫手</h1>
    <p class="lead">給國中生的文言文讀本：人物故事、白話翻譯、逐詞解釋。</p>
    ${catalog.map((c) => `
      <section class="card lesson-card">
        <h2>${escapeHTML(c.title)}</h2>
        <p class="lead">${escapeHTML(c.subtitle)}</p>
        <div class="links">${c.pages.map((p) =>
          `<a href="${escapeHTML(p.href)}"><strong>${escapeHTML(p.label)}</strong><br><span class="small">${escapeHTML(p.desc)}</span></a>`).join('')}</div>
      </section>`).join('')}
    <footer>課文原文取自公有領域古籍；白話與解釋為本站自行撰寫；角色插圖由 AI 生成，背景與道具為程式繪製。</footer>
  </main>`;
