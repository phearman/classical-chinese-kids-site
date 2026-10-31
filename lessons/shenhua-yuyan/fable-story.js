import { fableStoryPages, fableStoryNote } from './fable-data.js?v=79dca84';
import { escapeHTML } from '../../shared/terms.js?v=79dca84';
import { initPage } from '../../shared/page.js?v=79dca84';
import { mountStoryPager } from '../../shared/story-pager.js?v=79dca84';
import { FULL, place, backdrop } from '../../shared/fable-props.js?v=79dca84';
import { ROLES, imageURL } from '../../shared/figures.js?v=79dca84';
initPage({ paged: true });
const app = document.querySelector('#app');
const total = fableStoryPages.length;
// 插圖:背景 → 道具 → 角色。角色站在地面(y=88),寬度依原圖比例;翻面以角色自己的中線為軸(不再整張鏡射,角色才不會疊在一起)
const AR = { 'nanguo-n1': 231 / 440, 'nanguo-n2': 270 / 440, 'qi-xuan': 391 / 440, 'qi-min': 356 / 440, genglei: 307 / 440, 'wei-wang': 375 / 440 };
const actorSVG = (a) => {
  const w = +(a.h * (AR[a.who] ?? ROLES[a.who].width / ROLES[a.who].height)).toFixed(1);
  const x = +(a.cx - w / 2).toFixed(1);
  const flip = a.flip ? ` transform="translate(${2 * a.cx} 0) scale(-1 1)"` : '';
  return `<image href="${imageURL(`${a.who}.webp`)}" x="${x}" y="${88 - a.h}" width="${w}" height="${a.h}"${flip} aria-hidden="true"/>`;
};
const propSVG = (x) => (Array.isArray(x) ? place(...x) : FULL[x]());
const art = (p, n) => {
  const label = `fable-art-${n}`;
  return `<svg viewBox="0 0 160 90" class="p-fable p-fable-story" role="img" aria-labelledby="${label}-title ${label}-desc"><title id="${label}-title">${escapeHTML(p.title)}插圖</title><desc id="${label}-desc">${escapeHTML(p.art.description)}</desc>${backdrop(p.art.bg)}${p.art.props.map(propSVG).join('')}${p.art.actors.map(actorSVG).join('')}</svg>`;
};
function render(n) {
  const p = fableStoryPages[n - 1];
  app.innerHTML = `<main class="story-view"><article class="story-page" aria-labelledby="story-title"><p class="story-count">第 ${n} / ${total} 段</p><h1 id="story-title" tabindex="-1">${escapeHTML(p.title)}</h1><div class="story-art">${art(p, n)}</div><div class="story-body" tabindex="0" role="region" aria-label="本段文字">${p.text.map((x) => `<p>${escapeHTML(x)}</p>`).join('')}${p.quote ? `<div class="quote"><div class="classical">${escapeHTML(p.quote.text)}</div><div class="source">${escapeHTML(p.quote.source)}</div></div>` : ''}${n === total ? '' : `<p class="story-note">${escapeHTML(fableStoryNote)}</p>`}</div></article><nav class="pager" aria-label="翻頁"><button type="button" class="prev" ${n === 1 ? 'disabled' : ''}>← 上一段</button><div class="dots">${fableStoryPages.map((s,i) => `<button type="button" data-go="${i + 1}" aria-label="第 ${i + 1} 段：${escapeHTML(s.title)}"${i + 1 === n ? ' aria-current="step"' : ''}></button>`).join('')}</div><button type="button" class="next" ${n === total ? 'disabled' : ''}>下一段 →</button></nav></main>`;
}
mountStoryPager({ app, pages: fableStoryPages, render });
