// 〈兒時記趣〉動畫故事:本課的資料與道具;播放器共用 shared/anim-player.js。
// 本課尚未產生 AI 配音音檔(音訊工作另行安排),旁白只用內建朗讀。
import { animMeta, roles, scenes } from './anim-data.js?v=1c6b6ad';
import { mountAnimation } from '../../shared/anim-player.js?v=1c6b6ad';
import { characterURL } from '../../shared/assets.js?v=1c6b6ad';
import { beetle } from '../../shared/figures.js?v=1c6b6ad';

// 螞蟻(WY33):側面,頭、胸、腹三節,六隻腳(遠側三隻較淡)、彎折的觸角;原點在腳底中央、面向右,長約 9 單位;s=縮放,flip=面向左
function ant(x, y, { s = 1, flip = false } = {}) {
  const k = flip ? -s : s;
  return `<g class="ant" transform="translate(${x} ${y}) scale(${k} ${s})">`
    + '<path class="ant-far" d="M-0.9 -1.6 L-2.4 -0.8 L-3 0 M-0.2 -1.5 L-0.6 -0.6 L-0.5 0 M0.5 -1.6 L1.6 -0.8 L2.4 0"/>'
    + '<ellipse class="ant-body" cx="-2.7" cy="-1.9" rx="1.9" ry="1.4"/><ellipse class="ant-body" cx="-0.6" cy="-1.8" rx=".5" ry=".35"/>'
    + '<ellipse class="ant-body" cx="0.6" cy="-1.9" rx="1.2" ry=".7"/><circle class="ant-body" cx="2.7" cy="-2.3" r="1"/>'
    + '<path class="ant-feeler" d="M3.1 -3.1 L3.5 -4.6 L4.8 -5"/>'
    + '<path class="ant-leg" d="M0 -1.6 L-1.8 -0.7 L-2.6 0 M0.6 -1.5 L0.4 -0.6 L0.7 0 M1.1 -1.6 L2.3 -0.7 L3 0"/>'
    + '<circle class="ant-eye" cx="3.1" cy="-2.5" r=".3"/></g>';
}

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
  // 第 5 幕(WY33):鋪滿舞台的 SVG(單位=舞台 160×90),小沈復蹲在左邊(角色圖另放)。
  // 先近看真實大小的小草叢、兩隻螞蟻、凸起的土粒;第 7、8、9 秒一樣一樣「變身」成想像的森林、野獸(放大的螞蟻)、山丘,
  // 對應原文「以叢草為林,以蟲蟻為獸,以土礫凸者為丘」。實物和想像畫在同一個位置,看得出是誰變成誰。
  zoomGarden: () => {
    const blades = (x0, n, h) => Array.from({ length: n }, (_, i) => {
      const x = x0 + (i - (n - 1) / 2) * 2.2;
      const lean = (i % 2 ? 1 : -1) * (1 + (i % 3));
      return `<path class="p-blade" d="M${x} 85 Q${x + lean} ${85 - h * 0.6} ${x + lean * 1.8} ${85 - h + (i % 3) * 2}"/>`;
    }).join('');
    const tree = (x, h, r) => `<rect class="p-trunk" x="${x - 1.4}" y="${85 - h}" width="2.8" height="${h}"/>`
      + `<circle class="p-crown" cx="${x}" cy="${85 - h}" r="${r}"/><circle class="p-crown" cx="${x - r * 0.6}" cy="${85 - h + r * 0.5}" r="${r * 0.7}"/><circle class="p-crown" cx="${x + r * 0.6}" cy="${85 - h + r * 0.5}" r="${r * 0.7}"/>`;
    return `<svg viewBox="0 0 160 90" class="p-zoomGarden">
    <g class="p-dream p-dream-1">${tree(66, 22, 7)}${tree(80, 30, 8)}${tree(94, 24, 7)}</g>
    <g class="p-dream p-dream-2"><g class="p-stomp">${ant(118, 85, { s: 3 })}</g></g>
    <g class="p-dream p-dream-3"><path class="p-hill" d="M135 85 Q141 60 147 58 Q153 60 159 85Z"/><path class="p-ridge" d="M141 72 Q147 66 153 72"/></g>
    <g class="p-real p-real-1">${blades(80, 7, 14)}</g>
    <g class="p-real p-real-2"><g class="p-walk">${ant(112, 85, { s: 1.1 })}${ant(124, 85, { s: 1.1, flip: true })}</g></g>
    <g class="p-real p-real-3"><path class="p-soil" d="M141 85 Q144 78 147 77 Q150 78 153 85Z"/><path class="p-soil" d="M137 85 Q138.5 82 140 85Z"/><path class="p-soil" d="M154 85 Q155.5 81.5 157 85Z"/></g>
  </svg>`;
  },
  // 第 6 幕整段(WY29):鋪滿舞台的 SVG(單位=舞台 160×90),小沈復在左(角色圖另放)、兩隻甲蟲在中間偏右的草叢裡頂角打架、
  // 癩蝦蟆(定稿 B,鏡像面向左)第 6 秒從右邊跳著進場、撞倒草叢、地面震動;第 12.4 秒切成吐舌圖(AI,同一隻)、彈一下,
  // 兩隻甲蟲同時淡出縮小消失(舌頭和蟲不接觸),第 13.8 秒切回閉嘴,再吞嚥一下(WY33,使用者 10-23:「不用真的黏到昆蟲」)。三者不互相遮擋;嘴角座標依 toad.webp 量得(寬 495、高 440 的 (367, 95))。
  toadAttack: () => {
    const [tx, ty, th] = [114, 46.4, 40]; // 蝦蟆圖左上角與高度
    const tw = th * 495 / 440;
    // 吐舌圖(WY33,使用者挑 T2):和閉嘴圖同一隻、同高度、左上角對齊(兩張的腳底寬度量過一致),舌頭朝右,鏡像後朝向甲蟲
    const tw2 = th * 490 / 440;
    const blades = (xs, base) => xs.map((x, i) => `<path d="M${x} ${base} Q${x + (i % 2 ? 2 : -2)} ${base - 6 - (i % 3) * 2} ${x + (i % 2 ? 1 : -1)} ${base - 10 - (i % 3) * 3}"/>`).join('');
    return `<svg viewBox="0 0 160 90" class="p-toadAttack">
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
      <g class="p-toad-closed"><image href="${characterURL('toad.webp')}" x="${-(tx + tw)}" y="${ty}" width="${tw.toFixed(1)}" height="${th}" transform="scale(-1 1)"/></g>
      <g class="p-toad-tongue"><image href="${characterURL('toad-tongue.webp')}" x="${-(tx + tw)}" y="${ty}" width="${tw2.toFixed(1)}" height="${th}" transform="scale(-1 1)"/></g>
    </g></g></g>
  </svg>`;
  },
};

mountAnimation({ animMeta, roles, scenes, PROPS });
