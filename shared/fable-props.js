// 寓言篇(濫竽充數、驚弓之鳥)的程式繪製道具(WY26 PR-B2,CD3 版面修整)。
// 兩種道具:
//  ‧ 整幅(FULL):座標就是 160×90 舞台(地面 y=88),動畫鋪滿舞台、圖文故事直接畫。
//  ‧ 小件(SMALL):以自己的原點(底部中央)畫,BOX 是外框;動畫依資料的 x、y 放在舞台上,圖文故事用 place() 放到指定位置。
// 顏色由 style.css「寓言篇」一節處理(深淺色都看得清楚)。

const g = (cls, body) => `<g class="${cls}">${body}</g>`;

// ---------------------------------------------------------------- 樂工(背影剪影,手捧小竽)
function musician(x, y, s, tone) {
  return `<g class="f-musician f-tone-${tone}" transform="translate(${x} ${y}) scale(${s})">
    <path class="f-robe" d="M-6.5 0 L-4.5 -12 Q0 -14.5 4.5 -12 L6.5 0Z"/>
    <path class="f-sleeve" d="M-4.5 -11 Q-1 -8 2.5 -11.5 L4 -10 Q0 -6.5 -4.8 -9Z"/>
    <circle class="f-head" cx="0" cy="-16.5" r="3.6"/>
    <circle class="f-hair" cx="0" cy="-20.6" r="1.7"/>
    <path class="f-hair" d="M-3.6 -17 Q0 -21.5 3.6 -17 Q0 -19 -3.6 -17Z"/>
    <ellipse class="f-yu-body" cx="3.4" cy="-12.6" rx="2.3" ry="1.9"/>
    <path class="f-yu-pipe" d="M2.4 -13.6 V-21 M3.4 -14 V-22.5 M4.4 -13.6 V-20.5"/>
  </g>`;
}
// 三排樂工:後排小而淡、前排大,中間留給國王(左)與南郭(右)
export function musicians() {
  const rows = [
    { y: 60, s: 0.72, xs: [46, 56, 66, 76, 86, 96, 106, 116], cls: 'f-row-back' },
    { y: 71, s: 0.86, xs: [42, 54, 66, 78, 90, 102, 114], cls: 'f-row-mid' },
    { y: 83, s: 1, xs: [40, 54, 68, 82, 96, 110], cls: 'f-row-front' },
  ];
  return g('fable-art f-musicians', rows.map((r) => g(r.cls, r.xs.map((x, i) => musician(x, r.y, r.s, i % 4)).join(''))).join(''));
}

// ---------------------------------------------------------------- 京臺(高臺:石階、欄杆、亭子)
export function terrace() {
  const posts = [104, 112, 120, 128, 136, 144, 152].map((x) => `<path d="M${x} 50 V44"/>`).join('');
  const blocks = [58, 66, 74, 82].map((y) => `<path d="M100 ${y} H160"/>`).join('');
  return g('fable-art f-terrace', `
    <path class="f-stone" d="M98 88 L102 50 H160 V88Z"/>
    <g class="f-stone-line">${blocks}<path d="M118 50 V58 M136 58 V66 M118 66 V74 M144 74 V82 M126 82 V88"/></g>
    <path class="f-step" d="M76 88 H98 V84 H94 V80 H90 V76 H86 V72 H82 V68 H86"/>
    <path class="f-stair" d="M76 88 L100 56 L104 56 L82 88Z"/>
    <path class="f-rail" d="M102 44 H160"/><g class="f-rail">${posts}</g>
    <path class="f-pillar" d="M116 44 V28 M148 44 V28"/>
    <path class="f-roof" d="M106 29 Q132 20 158 29 L160 26 Q150 24 146 18 H118 Q114 24 104 26Z"/>
    <path class="f-roof-ridge" d="M118 18 H146"/>`);
}

// ---------------------------------------------------------------- 三條推理線索(一列一條:看到什麼 → 代表什麼)
export const CLUES = [['飛得慢', '舊傷痛'], ['叫聲悲', '離群久'], ['聽弦聲', '就驚慌']];
export function reasoning() {
  return g('fable-art f-reasoning', CLUES.map(([see, mean], i) => {
    const y = 30 + i * 17;
    return `<g class="fp-card" style="--i:${i}"><path d="M48 ${y} H110 q3 0 3 3 V${y + 11} q0 3 -3 3 H48 q-3 0 -3 -3 V${y + 3} q0 -3 3 -3Z"/>
      <text class="fp-see" x="61" y="${y + 9.6}">${see}</text><text class="fp-arrow" x="79" y="${y + 9.6}">→</text><text class="fp-mean" x="97" y="${y + 9.6}">${mean}</text></g>`;
  }).join(''));
}

// ---------------------------------------------------------------- 小件:竽、大雁、糧袋、放大鏡、空位子
// 竽:圓葫蘆形的音斗、彎吹嘴、一排竹管(《國語辭典簡編本》:形似笙而較大)
function yuShape() {
  const pipes = [-6, -4.5, -3, -1.5, 0, 1.5, 3, 4.5, 6].map((x, i) => {
    const top = -40 + Math.abs(i - 4) * 2.4;
    return `<path class="f-yu-pipe" d="M${x} -12 V${top}"/>`;
  }).join('');
  return `${pipes}<path class="f-yu-band" d="M-6.6 -22 H6.6 M-6.6 -30 H6.6"/>
    <ellipse class="f-yu-body" cx="0" cy="-8" rx="9" ry="7.6"/>
    <path class="f-yu-mouth" d="M-7 -10 Q-15 -12 -17.5 -21"/><circle class="f-yu-tip" cx="-17.5" cy="-21.5" r="1.3"/>`;
}
// 大雁:長脖子、尖嘴、張開的翅膀,往左飛(從東方飛來)
function gooseShape() {
  return `<path class="f-wing-far" d="M0 -1.5 Q2 -10 8 -14 Q7 -6 4 -1Z"/>
    <path class="f-goose-body" d="M-6 0 Q0 -3.5 8 -1.2 L12 -2.6 L10.5 0 L12 2 L8 1.4 Q0 3.5 -6 0Z"/>
    <path class="f-goose-neck" d="M-5 -0.6 Q-9.5 -2 -12.5 -3.2"/>
    <circle class="f-goose-head" cx="-13.2" cy="-3.4" r="1.7"/>
    <path class="f-goose-beak" d="M-14.6 -3.8 L-17.6 -3 L-14.6 -2.6Z"/>
    <path class="f-wing-near" d="M-1 -0.8 Q-3 -11 3 -17 Q6 -8 5 -0.4Z"/>`;
}
const SMALL = {
  yu: { box: [-20, -44, 34, 46], draw: () => g('fable-art f-yu', yuShape()) },
  goose: { box: [-19, -19, 33, 24], draw: () => g('fable-art f-goose', gooseShape()) },
  // 掉下來的雁:身體斜向下、翅膀收亂,上方有受驚的抖動線(不畫箭、不畫傷口)
  fallingGoose: { box: [-22, -24, 40, 40], draw: () => g('fable-art f-goose f-falling', `<g class="fp-fall"><g transform="rotate(38)">${gooseShape()}</g></g>
    <path class="f-shake" d="M-10 -20 q2 -2 4 0 t4 0 M2 -22 q2 -2 4 0 t4 0"/>`) },
  // 停在地上的雁:縮著脖子、一邊翅膀垂下(舊傷)
  gooseLeft: { box: [-16, -16, 30, 18], draw: () => g('fable-art f-goose f-resting', `
    <path class="f-goose-body" d="M-7 -4 Q0 -10 9 -6 L12 -7 L11 -4 Q6 0 -4 0 Q-8 -1 -7 -4Z"/>
    <path class="f-wing-near" d="M-2 -6 Q4 -9 10 -5 Q8 -1 4 1 Q1 -3 -2 -6Z"/>
    <path class="f-goose-neck" d="M-5 -6 Q-8 -10 -6.5 -13"/><circle class="f-goose-head" cx="-6.4" cy="-13.4" r="1.8"/>
    <path class="f-goose-beak" d="M-8 -13.8 L-11 -13 L-8 -12.6Z"/><path class="f-ground-line" d="M-14 0 H14"/>`) },
  // 糧袋:兩袋綁口的米糧,旁邊散出幾粒
  grain: { box: [-24, -28, 48, 30], draw: () => g('fable-art f-grain', `
    <path class="f-sack" d="M-18 0 Q-21 -14 -14 -20 L-15 -23 H-5 L-6 -20 Q1 -14 -2 0Z"/><path class="f-rope" d="M-15 -20 H-5"/>
    <path class="f-sack" d="M0 0 Q-3 -12 4 -17 L3 -20 H12 L11 -17 Q18 -12 15 0Z"/><path class="f-rope" d="M3 -17 H12"/>
    ${[[17, -1], [19, -2.5], [20.5, -0.8], [18.5, 0.2], [-20, -1]].map(([x, y]) => `<ellipse class="f-kernel" cx="${x}" cy="${y}" rx="1" ry="0.7"/>`).join('')}`) },
  // 放大鏡:木柄、鏡片反光
  magnifier: { box: [-13, -13, 26, 26], draw: () => g('fable-art f-magnifier', `
    <path class="f-handle" d="M4.5 4.5 L11 11"/><circle class="f-lens" cx="-2" cy="-2" r="8"/>
    <path class="f-glint" d="M-7 -4 Q-6 -7.5 -3 -8"/>`) },
  // 空出來的位子:坐墊+虛線人形輪廓(南郭離開後)
  emptySeat: { box: [-16, -26, 32, 28], draw: () => g('fable-art f-seat', `
    <path class="f-cushion" d="M-12 0 Q-12 -3.5 0 -3.5 Q12 -3.5 12 0Z"/>
    <path class="f-gone" d="M-6.5 -3.5 L-4.5 -15 Q0 -17.5 4.5 -15 L6.5 -3.5 M0 -23.6 m-3.6 0 a3.6 3.6 0 1 0 7.2 0 a3.6 3.6 0 1 0 -7.2 0"/>`) },
};
export const SMALL_NAMES = Object.keys(SMALL);
export const FULL = { musicians, terrace, reasoning };

// 小件:動畫用的獨立 SVG(依自己的外框,寬度由 CSS 決定)
export const smallSVG = (name) => {
  const [x, y, w, h] = SMALL[name].box;
  return `<svg viewBox="${x} ${y} ${w} ${h}" class="p-fable p-fable-small fable-${name}">${SMALL[name].draw()}</svg>`;
};
// 小件:放進 160×90 的插圖,原點(底部中央)放在 (x, y),縮放 s
export const place = (name, x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${SMALL[name].draw()}</g>`;

// 背景(圖文故事;動畫由舞台的 bg-* 處理):宮廷=牆+兩根朱紅柱+木地板;天空=天+草地;紙=只有地面線
export function backdrop(bg) {
  if (bg === 'court') return g('f-bg f-bg-court', '<path class="f-wall" d="M0 0 H160 V82 H0Z"/><path class="f-floor" d="M0 82 H160 V90 H0Z"/><path class="f-beam" d="M0 6 H160"/><path class="f-col" d="M3 6 H10 V82 H3Z M150 6 H157 V82 H150Z"/>');
  if (bg === 'sky') return g('f-bg f-bg-sky', '<path class="f-sky" d="M0 0 H160 V88 H0Z"/><path class="f-grass" d="M0 88 H160 V90 H0Z"/><path class="f-cloud" d="M14 18 q4 -6 10 -2 q5 -4 9 1 q4 0 3 4 H15 q-4 0 -1 -3Z"/>');
  return g('f-bg f-bg-paper', '<path class="f-paper" d="M0 0 H160 V90 H0Z"/><path class="f-floorline" d="M0 88 H160"/>');
}
