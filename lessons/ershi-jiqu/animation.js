// 〈兒時記趣〉動畫故事:本課的資料與道具;播放器共用 shared/anim-player.js。
// 本課尚未產生 AI 配音音檔(音訊工作另行安排),旁白只用內建朗讀。
import { animMeta, roles, scenes } from './anim-data.js?v=3ccc89b';
import { mountAnimation } from '../../shared/anim-player.js?v=3ccc89b';

// ---------------------------------------------------------------- 道具(程式繪製 SVG)
const PROPS = {
  // 太陽(第 1 幕;畫面另有「⚠ 不要直視太陽」浮字)
  sun: () => `<svg viewBox="0 0 100 100" class="p-sun"><circle cx="50" cy="50" r="24"/><path class="p-ray" d="M50 6 V16 M50 84 V94 M6 50 H16 M84 50 H94 M19 19 L26 26 M74 74 L81 81 M19 81 L26 74 M74 26 L81 19"/></svg>`,
  // 圓形特寫框裡的葉子紋路(鏡頭效果,不是放大鏡道具)
  leaf: () => `<svg viewBox="0 0 120 120" class="p-leaf"><circle class="p-lens" cx="60" cy="60" r="56"/><path class="p-blade" d="M22 88 Q40 20 100 28 Q92 98 22 88Z"/><path class="p-vein" d="M24 86 L96 32 M44 72 L42 52 M60 60 L64 40 M76 48 L84 36 M44 72 L64 76 M60 60 L80 64"/></svg>`,
  // 蚊子群:一閃一閃地飛
  mosquitoes: () => `<svg viewBox="0 0 200 80" class="p-mosq">${[[20, 30], [48, 14], [76, 40], [104, 20], [132, 46], [160, 18], [184, 36], [62, 62], [118, 64]].map(([x, y], i) => `<g style="--i:${i}"><ellipse class="p-wing" cx="${x - 3}" cy="${y - 4}" rx="4" ry="2.4"/><ellipse class="p-wing" cx="${x + 3}" cy="${y - 4}" rx="4" ry="2.4"/><circle class="p-mbody" cx="${x}" cy="${y}" r="2"/></g>`).join('')}</svg>`,
  // 想像中的白鶴剪影
  cranes: () => `<svg viewBox="0 0 200 80" class="p-cranes">${[[26, 34], [70, 18], [112, 42], [150, 20], [182, 46]].map(([x, y]) => `<path d="M${x - 18} ${y + 6} Q${x - 8} ${y - 6} ${x} ${y + 2} Q${x + 8} ${y - 6} ${x + 18} ${y + 6} Q${x + 8} ${y} ${x} ${y + 6} Q${x - 8} ${y} ${x - 18} ${y + 6}Z"/>`).join('')}</svg>`,
  // 白色蚊帳
  net: () => `<svg viewBox="0 0 200 120" preserveAspectRatio="none" class="p-net"><path d="M4 4 H196 V116 H4Z"/><path class="p-fold" d="M44 4 V116 M92 4 V116 M140 4 V116 M172 4 V116"/></svg>`,
  // 慢慢噴進的煙
  smoke: () => `<svg viewBox="0 0 120 120" class="p-smoke"><path d="M30 116 Q20 86 44 70 T56 30 T80 4"/><path d="M70 118 Q58 90 82 76 T94 40 T112 10"/></svg>`,
  // 青雲
  cloud: () => `<svg viewBox="0 0 200 80" class="p-cloud"><path d="M20 50 Q20 28 44 30 Q52 8 78 16 Q98 2 116 22 Q142 20 142 42 Q142 60 120 60 H40 Q20 60 20 50Z"/><path d="M130 70 Q130 56 146 58 Q154 44 172 52 Q188 48 192 62 Q200 66 196 76 H138 Q130 76 130 70Z"/></svg>`,
  // 縮小視角:草叢是樹林、螞蟻是野獸、土塊是小山、凹處是山谷
  forest: () => `<svg viewBox="0 0 200 110" class="p-forest">
    <path class="p-ground" d="M0 92 H200 V110 H0Z"/>
    <path class="p-hill" d="M120 92 L150 50 L180 92Z"/><path class="p-pit" d="M60 92 Q80 106 100 92"/>
    ${[12, 26, 40, 112, 190].map((x, i) => `<g class="p-tree"><rect x="${x - 2}" y="${66 - (i % 2) * 8}" width="4" height="${26 + (i % 2) * 8}"/><path d="M${x - 12} ${70 - (i % 2) * 8} L${x} ${40 - (i % 2) * 10} L${x + 12} ${70 - (i % 2) * 8}Z"/></g>`).join('')}
    <g class="p-ant"><circle cx="70" cy="86" r="3"/><circle cx="76" cy="86" r="4"/><circle cx="84" cy="86" r="3"/></g>
  </svg>`,
  // 兩隻小蟲在打架
  bugs: () => `<svg viewBox="0 0 80 40" class="p-bugs"><ellipse class="p-bug p-bug-l" cx="26" cy="22" rx="10" ry="7"/><ellipse class="p-bug p-bug-r" cx="54" cy="22" rx="10" ry="7"/><path class="p-leg" d="M18 24 L12 30 M34 24 L40 30 M46 24 L40 30 M62 24 L68 30"/></svg>`,
};

mountAnimation({ animMeta, roles, scenes, PROPS });
