// 〈兒時記趣〉動畫故事:本課的資料與道具;播放器共用 shared/anim-player.js。
// 本課尚未產生 AI 配音音檔(音訊工作另行安排),旁白只用內建朗讀。
import { animMeta, roles, scenes } from './anim-data.js?v=e1a1cfa';
import { mountAnimation } from '../../shared/anim-player.js?v=e1a1cfa';
import { characterURL } from '../../shared/assets.js?v=e1a1cfa';
import { beetle } from '../../shared/figures.js?v=e1a1cfa';

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
  // 第 6 幕整段(WY29):鋪滿舞台的 SVG(單位=舞台 160×90),小沈復在左(角色圖另放)、兩隻甲蟲在中間偏右的草叢裡頂角打架、
  // 癩蝦蟆(定稿 B,鏡像面向左)第 6 秒從右邊跳著進場、撞倒草叢、地面震動;第 12.4 秒程式畫的粉紅舌頭從嘴角伸到甲蟲、
  // 縮回時把兩隻甲蟲帶進嘴裡。三者不互相遮擋;嘴角座標依 toad.webp 量得(寬 495、高 440 的 (367, 95))。
  toadAttack: () => {
    const [tx, ty, th] = [114, 46.4, 40]; // 蝦蟆圖左上角與高度
    const tw = th * 495 / 440;
    const mouth = [tx + tw * (1 - 367 / 495), ty + th * 95 / 440];
    const target = [86, 79]; // 兩隻甲蟲頂角的地方
    const dx = target[0] - mouth[0];
    const dy = target[1] - mouth[1];
    const len = Math.hypot(dx, dy).toFixed(1);
    const deg = (Math.atan2(dy, dx) * 180 / Math.PI).toFixed(1);
    const blades = (xs, base) => xs.map((x, i) => `<path d="M${x} ${base} Q${x + (i % 2 ? 2 : -2)} ${base - 6 - (i % 3) * 2} ${x + (i % 2 ? 1 : -1)} ${base - 10 - (i % 3) * 3}"/>`).join('');
    return `<svg viewBox="0 0 160 90" class="p-toadAttack" style="--mx:${(-dx).toFixed(1)}px;--my:${(-dy).toFixed(1)}px">
    <g class="p-world">
      <g class="p-grass">${blades([58, 63, 80, 92, 104, 107], 86)}</g>
      <g class="p-fall p-fall-1">${blades([109, 111, 113], 86)}</g>
      <g class="p-fall p-fall-2">${blades([150, 152, 154, 156], 86)}</g>
      <g class="p-gone">
        <g class="p-fight p-fight-l">${beetle(72, 85.5, { s: 1.1 })}</g>
        <g class="p-fight p-fight-r">${beetle(100, 85.5, { s: 1.1, flip: true, color: '#4f7a3a' })}</g>
      </g>
    </g>
    <g class="p-toad-move"><g class="p-toad-hop"><g class="p-toad-gulp">
      <image href="${characterURL('toad.webp')}" x="${-(tx + tw)}" y="${ty}" width="${tw.toFixed(1)}" height="${th}" transform="scale(-1 1)"/>
    </g></g></g>
    <g transform="translate(${mouth[0].toFixed(1)} ${mouth[1].toFixed(1)}) rotate(${deg})"><g class="p-tongue">
      <path d="M0 0 H${len}" /><circle cx="${len}" cy="0" r="2.2"/>
    </g></g>
  </svg>`;
  },
};

mountAnimation({ animMeta, roles, scenes, PROPS });
