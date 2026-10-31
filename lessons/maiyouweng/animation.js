// 〈賣油翁〉動畫故事:本課的資料與道具;播放器共用 shared/anim-player.js。
// 本課沒有 AI 配音音檔,旁白只用瀏覽器內建朗讀。
import { animMeta, roles, scenes } from './anim-data.js?v=7375d06';
import { mountAnimation } from '../../shared/anim-player.js?v=7375d06';

// ---------------------------------------------------------------- 道具(程式繪製 SVG)
// 箭一律只插在草靶上、箭尾朝左(射手在左邊);動畫時間從幕內起算(animation-delay 用 --d)。
const ARROWS = [[30, 30, 0], [33, 26, 1], [27, 34, 2], [34, 34, 3], [29, 25, 4]];
const PROPS = {
  // 草靶:木架+三圈草編靶,五支箭依序插上去
  target: () => `<svg viewBox="0 0 60 92" class="p-target"><path class="stand" d="M18 90 L30 44 L42 90 M23 72 H37"/>`
    + '<circle class="ring" cx="30" cy="30" r="24"/><circle class="ring2" cx="30" cy="30" r="15"/><circle class="eye" cx="30" cy="30" r="7"/>'
    + ARROWS.map(([x, y, i]) => `<path class="arrow p-arrow" style="--i:${i}" d="M${x} ${y} L${x - 26} ${y - 4} M${x - 26} ${y - 4} l-3 -3 M${x - 26} ${y - 4} l-3 3"/>`).join('')
    + '</svg>',
  // 十支箭的計數(不寫字):九支實心=射到靶上,一支虛線=沒射到;一支一支出現
  tally: () => `<svg viewBox="0 0 200 24" class="p-tally">${Array.from({ length: 10 }, (_, i) => {
    const x = 10 + i * 19;
    const cls = i === 6 ? 'miss' : 'hit';
    return `<g style="--i:${i}"><path class="${cls}" d="M${x - 6} 10 L${x + 6} 10 L${x + 6} 7 L${x + 10} 12 L${x + 6} 17 L${x + 6} 14 L${x - 6} 14 Z"/></g>`;
  }).join('')}</svg>`,
  // 銅錢特寫:圓形鏡頭裡,油線從上方慢慢流下、穿過方孔;最後亮出乾淨的錢面(綠色小勾)
  coinlens: () => '<svg viewBox="0 0 100 100" class="p-coinlens"><circle class="lens" cx="50" cy="50" r="46"/>'
    + '<circle class="coin" cx="50" cy="62" r="24"/><rect class="hole" x="43" y="55" width="14" height="14"/>'
    + '<path class="oil drip" d="M50 8 V69"/>'
    + '<path class="dry" d="M70 26 l5 6 l10 -12 l3 2 l-13 15 l-8 -9 Z"/></svg>',
};

mountAnimation({ animMeta, roles, scenes, PROPS });
