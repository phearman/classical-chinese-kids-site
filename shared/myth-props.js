// 〈古代神話與寓言選〉神話部分的程式繪製道具(WY26 PR-B1):圖文故事與動畫共用同一份圖。
// 座標一律是 160×90(=動畫舞台),地面在 y=88;圖文故事插圖(320×200)用 scale(2) 放進去,地板線剛好對齊。
// 每個元件的「預設樣子」就是那一幕的最後畫面:圖文故事直接顯示它;動畫用 CSS 從開頭的樣子播到這裡
// (只在 .stage 裡播,見 style.css「神話道具」),所以減少動態時關掉動畫就直接看到結果。
// 安全(CPM 2026-10-22 核准):撞山只畫「砰」、震動、裂痕與暈頭小星星,不畫受傷;女媧只畫天柱立起、海龜游走(WY34 起海龜用 AI 生成圖,四肢完整、背上無物)。

import { characterURL, backgroundURL } from './assets.js?v=5f31c62';

const wrap = (cls, body) => `<g class="m-art ${cls}">${body}</g>`;

// 混沌雞蛋:裂成上下兩半(上半往上、下半往下),天地分開
export function egg() {
  const zig = 'M50 46 L58 41 L66 48 L74 41 L82 48 L90 41 L98 48 L104 41 L110 46';
  const swirls = [[24, 30], [136, 26], [30, 70], [134, 66], [80, 14]]
    .map(([x, y], i) => `<path class="m-swirl" style="--i:${i}" d="M${x - 6} ${y} q3 -5 6 0 t6 0"/>`).join('');
  return wrap('m-egg', `${swirls}
    <g class="m-egg-top"><path class="m-shell" d="${zig} A30 36 0 0 0 50 46Z"/></g>
    <g class="m-egg-bot"><path class="m-shell" d="${zig} A30 36 0 0 1 50 46Z"/></g>
    <path class="m-crack" pathLength="60" d="${zig}"/>`);
}

// 天往上升、地往下沉,右邊的尺每隔一下跳一格「一丈」
export function skyEarth() {
  const ticks = [0, 1, 2].map((i) => `<g class="m-tick" style="--i:${i}"><path d="M128 ${60 - i * 14} H138"/><text x="140" y="${62 - i * 14}">一丈</text></g>`).join('');
  return wrap('m-skyearth', `
    <path class="m-skyband" d="M0 0 H160 V12 Q80 18 0 12Z"/>
    <path class="m-earthband" d="M0 80 Q80 74 160 80 V90 H0Z"/>
    <path class="m-ruler" d="M133 18 V74"/>${ticks}`);
}

// 四角星(星星、暈頭小星星)
const star = (cx, cy, r, cls = 'm-ic-star') => `<path class="${cls}" d="M${cx} ${cy - r} L${cx + r * .3} ${cy - r * .3} L${cx + r} ${cy} L${cx + r * .3} ${cy + r * .3} L${cx} ${cy + r} L${cx - r * .3} ${cy + r * .3} L${cx - r} ${cy} L${cx - r * .3} ${cy - r * .3}Z"/>`;

// 盤古化身的對照圖:六格「身體部位 → 自然萬物」(依《五運歷年記》,見 sources.md S5)
const ICONS = {
  cloud: (x, y) => `<path class="m-ic-cloud" d="M${x - 8} ${y + 3} q0 -5 5 -4 q2 -5 7 -3 q5 -2 6 3 q3 1 2 4Z"/>`,
  bolt: (x, y) => `<path class="m-ic-bolt" d="M${x + 2} ${y - 6} L${x - 4} ${y + 1} H${x} L${x - 2} ${y + 7} L${x + 5} ${y - 1} H${x + 1}Z"/>`,
  sunmoon: (x, y) => `<circle class="m-ic-sun" cx="${x - 5}" cy="${y}" r="4.2"/><path class="m-ic-moon" d="M${x + 5} ${y - 5} a5 5 0 1 0 0 10 a3.6 3.6 0 1 1 0 -10Z"/>`,
  river: (x, y) => `<path class="m-ic-river" d="M${x - 9} ${y - 2} q3 -3 6 0 t6 0 t6 0 M${x - 9} ${y + 3} q3 -3 6 0 t6 0 t6 0"/>`,
  stars: (x, y) => [[-5, -1, 3], [3, -4, 2.2], [5, 3, 2.6]].map(([dx, dy, r]) => star(x + dx, y + dy, r)).join(''),
  grass: (x, y) => [-6, -2, 2, 6].map((dx, i) => `<path class="m-ic-grass" d="M${x + dx} ${y + 5} q${i % 2 ? 2 : -2} -5 ${i % 2 ? 1 : -1} -${8 + (i % 2) * 2}"/>`).join(''),
};
export const CHART = [
  ['氣', '風雲', 'cloud'], ['聲音', '雷', 'bolt'], ['眼睛', '日月', 'sunmoon'],
  ['血', '江河', 'river'], ['頭髮鬍子', '星星', 'stars'], ['皮膚和毛', '草木', 'grass'],
];
// 動畫裡每格出現的秒數,對齊旁白念到的時候
const CHART_AT = [3, 5.5, 9, 10.5, 12, 13.5];
export function chart() {
  const cells = CHART.map(([from, to, icon], i) => {
    const x = 52 + (i % 3) * 36, y = 42 + Math.floor(i / 3) * 24; // 上排避開左上角的字卡(含出處那一行)
    return `<g class="m-cell-g" style="--t:${CHART_AT[i]}s"><path class="m-cell" d="M${x + 3} ${y} H${x + 29} q3 0 3 3 V${y + 20} q0 3 -3 3 H${x + 3} q-3 0 -3 -3 V${y + 3} q0 -3 3 -3Z"/>
      ${ICONS[icon](x + 16, y + 5.5)}
      <text class="m-from" x="${x + 16}" y="${y + 16.2}">${from}</text>
      <text class="m-to" x="${x + 16}" y="${y + 21.8}">→ ${to}</text></g>`;
  }).join('');
  return wrap('m-chart', cells);
}

// 天上的洞(五個)與五色石:紅、黃、青綠、白、黑(《淮南子‧覽冥訓》「煉五色石」)
const HOLES = [[26, 32], [56, 40], [84, 30], [112, 40], [140, 32]];
const hole = ([x, y]) => `M${x - 8} ${y} L${x - 4} ${y - 6} L${x + 2} ${y - 5} L${x + 8} ${y - 1} L${x + 5} ${y + 5} L${x - 3} ${y + 6}Z`;
const PILLARS = [6, 74, 100, 154]; // 錯開天上的洞(五色石),女媧站在前兩根中間
const pillar = (x) => `M${x - 2.5} 88 V36 H${x + 2.5} V88Z`;
const waves = (y) => `<path class="m-wave" d="M0 ${y} q5 -4 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0"/>`;
const flame = (x) => `<path class="m-flame" d="M${x} 88 q-5 -4 -1 -11 q1 4 3 4 q0 -6 4 -9 q-1 6 3 9 q3 4 -1 7Z"/>`;

// 天破了:洞出現、四根柱子倒下、遠處小火苗與波浪(低彩度,不嚇人)
export function brokenSky() {
  return wrap('m-broken', `
    ${HOLES.map((h, i) => `<path class="m-hole" style="--i:${i}" d="${hole(h)}"/>`).join('')}
    ${PILLARS.map((x, i) => `<path class="m-pillar m-fall m-fall-${i % 2 ? 'r' : 'l'}" style="--i:${i}" d="${pillar(x)}"/>`).join('')}
    <g class="m-trouble">${flame(36)}${flame(124)}${waves(84)}</g>`);
}

// 女媧補天:五色石一顆顆補進洞裡、四根天柱立起、大海龜(鼇,AI 生成定稿 A,WY34)往左游走、蘆葦灰撒下、大水退去
export function mendSky() {
  const stones = HOLES.map(([x, y], i) => `<ellipse class="m-stone m-stone-${i}" style="--i:${i}" cx="${x}" cy="${y}" rx="9.5" ry="7.5"/>`).join('');
  const ash = [70, 88, 106, 124, 142, 80, 116, 134].map((x, i) => `<circle class="m-ash" style="--i:${i}" cx="${x}" cy="${84 - (i % 3)}" r="1.1"/>`).join('');
  return wrap('m-mend', `
    ${PILLARS.map((x, i) => `<path class="m-pillar m-rise" style="--i:${i}" d="${pillar(x)}"/>`).join('')}
    ${HOLES.map((h) => `<path class="m-hole" d="${hole(h)}"/>`).join('')}${stones}
    <image class="m-turtle" href="${characterURL('ao.webp')}" x="120" y="68.3" width="30" height="19"/>
    <g class="m-flood">${waves(84)}</g>${ash}`);
}

// 不周山:山頂撐著天柱;撞山時「砰」、山搖、裂痕、天柱上半截歪掉;共工頭上冒暈頭小星星(只衝不傷)
export function buzhou() {
  return wrap('m-buzhou', `
    <g class="m-shake">
      <path class="m-mountain" d="M96 88 L116 46 L126 54 L140 34 L160 50 V88Z"/>
      <path class="m-pillar" d="M137.5 34 V18 H142.5 V34Z"/>
      <g class="m-snap"><path class="m-pillar" d="M137.5 18 V0 H142.5 V18Z"/></g>
      <path class="m-crackline" pathLength="60" d="M118 60 L124 54 L122 48 L130 42 L136 30 L139 22 L141 16"/>
    </g>
    <text class="m-bang" x="118" y="40">砰！</text>
    <g class="m-dizzy">${[[90, 34], [96, 30], [102, 34]].map(([x, y]) => star(x, y, 2.6)).join('')}</g>`);
}

// 天傾西北、地不滿東南:簡化示意圖(不是真實地形)
export function tilt() {
  const lights = `<circle class="m-ic-sun" cx="132" cy="14" r="4.5"/><path class="m-ic-moon" d="M146 9 a5 5 0 1 0 0 10 a3.6 3.6 0 1 1 0 -10Z"/>${ICONS.stars(122, 24)}`;
  return wrap('m-tilt', `
    <path class="m-land" d="M30 30 H118 V58 L96 84 H30Z"/>
    <path class="m-sea" d="M118 58 H150 V84 H96Z"/>
    <path class="m-flow" d="M40 40 Q70 46 80 60 T108 76"/>
    <path class="m-flow" d="M56 34 Q92 38 100 54 T114 68"/>
    <text class="m-dir" x="40" y="37">西北</text><text class="m-sealabel" x="134" y="81">東南</text><text class="m-sealabel" x="132" y="70">海</text>
    <g class="m-slide">${lights}</g>`);
}

// 兩種說法並列(圖文故事第 8 頁):中間一個大 VS;哪一本書的說法寫在頁面標題、插圖說明與故事文字裡
export function versus() {
  return wrap('m-versus', '<text class="m-vs-big" x="80" y="48">VS</text>');
}

// 夸父追日:太陽往地平線落下(地平線 y=63,和動畫背景「原野」的地面同高)
export function sunset() {
  return wrap('m-sunset', `
    <g class="m-sun-move"><circle class="m-sun" cx="146" cy="60" r="9"/></g>
    <path class="m-ground" d="M0 63 H160 V90 H0Z"/>`);
}

// 喝乾黃河和渭水:兩條河變細變淡;往北的箭頭指向大澤
export function rivers() {
  return wrap('m-rivers', `
    <path class="m-river" d="M58 72 Q88 66 118 72 T160 70"/><text class="m-rname" x="92" y="70">黃河</text>
    <path class="m-river" d="M66 82 Q96 78 126 84 T160 80"/><text class="m-rname" x="142" y="77">渭水</text>
    <g class="m-north"><path class="m-arrow" d="M140 58 V36 M135 42 L140 35 L145 42"/><text class="m-rname" x="150" y="50">北</text>
      <ellipse class="m-lake" cx="140" cy="26" rx="17" ry="6"/><text class="m-lakename" x="140" y="28">大澤</text></g>`);
}

// 手杖變桃林:手杖倒地,之後淡入 AI 生成的桃林背景(P1,WY34;舊杖冒芽長成第一棵桃樹),花瓣飄落。
// 最後畫面=桃林背景+花瓣(圖文故事直接看到);程式畫的手杖只在動畫裡、桃林出現前看得到。
export function grove() {
  const petals = [[66, 40], [92, 30], [118, 44], [140, 34], [78, 52], [132, 56]]
    .map(([x, y], i) => `<ellipse class="m-petal" style="--i:${i}" cx="${x}" cy="${y}" rx="1.6" ry="1"/>`).join('');
  return wrap('m-grove', `<image class="m-grove-bg" href="${backgroundURL('peach-grove.webp')}" x="0" y="0" width="160" height="90" preserveAspectRatio="xMidYMid slice"/>
    <g class="m-staff"><path d="M30 87 H58"/></g>${petals}`);
}

// 收尾:四位神話人物的正面像(WY34,使用者待裁 74 A;取代雞蛋、五色石、山、桃花圖示),名字在下方。
// 正面像以各自定稿圖為參照由 AI 生成;圖框 30×44,等比縮放置底對齊。
export function icons() {
  const items = [[26, '盤古', 'pangu'], [63, '女媧', 'nuwa'], [100, '共工', 'gonggong'], [137, '夸父', 'kuafu']];
  return wrap('m-icons', items.map(([x, name, key], i) => `<g class="m-icon" style="--i:${i}">`
    + `<image class="m-front" href="${characterURL(`${key}-front.webp`)}" x="${x - 17}" y="12" width="34" height="44" preserveAspectRatio="xMidYMax meet"/>`
    + `<text class="m-iname" x="${x}" y="64">${name}</text></g>`).join(''));
}
