// 課程目錄頁。一屏版(WY13):做成選單式首頁,每課一組大按鈕,一屏看完。
import { catalog } from './catalog.js?v=3864b57';
import { escapeHTML } from './shared/terms.js?v=3864b57';
import { initPage } from './shared/page.js?v=3864b57';

initPage({ paged: true });
document.getElementById('app').innerHTML = `
  <main class="home-view">
    <header class="home-head">
      <h1>文言文小幫手</h1>
      <p class="lead">給國中生的文言文讀本：人物故事、白話翻譯、逐詞解釋。</p>
    </header>
    ${catalog.map((c) => `
      <section class="home-group" aria-labelledby="home-${escapeHTML(c.id)}">
        <h2 id="home-${escapeHTML(c.id)}">${escapeHTML(c.title)}<small>${escapeHTML(c.subtitle)}</small></h2>
        <div class="home-tiles">${c.pages.map((p) =>
          `<a class="tile" href="${escapeHTML(p.href)}"><strong>${escapeHTML(p.label)}</strong><span>${escapeHTML(p.desc)}</span></a>`).join('')}</div>
      </section>`).join('')}
    <p class="story-note">課文原文取自公有領域古籍；白話與解釋為本站自行撰寫；角色插圖由 AI 生成，背景與道具為程式繪製。</p>
  </main>`;
