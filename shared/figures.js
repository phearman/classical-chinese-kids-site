// 情境插圖:定稿的 Q 版角色圖(shared/characters/*.webp)+程式繪製的背景與道具。
// 沒有定稿圖的角色才用程式繪製剪影(目前所有角色都有定稿圖)。
import { escapeHTML } from './terms.js?v=c037c72';
import * as Myth from './myth-props.js?v=c037c72';

// 角色 → 圖檔(定稿,見 assets/CREDITS.md)或剪影參數
// height:同框時的身高(SVG 單位);width:畫框寬(可省,預設 110,橫向的圖才需要放寬)。孔子依《史記》「長九尺有六寸」約 190 公分以上,取學生的 1.2 倍。
export const ROLES = {
  'kongzi':       { label: '孔子', image: 'kongzi.webp', height: 168 },
  'kongzi-leave': { label: '孔子', image: 'kongzi.webp', height: 168, faded: true },
  'zengzi':       { label: '曾參', image: 'zengzi.webp', height: 140 },
  'ziyou':        { label: '子游', image: 'ziyou.webp', height: 140 }, // 沿用孔子講堂的子游圖(第 4 課)
  'menren-a':     { label: '門人', image: 'menren-a.webp', height: 140 },
  'menren-b':     { label: '門人', image: 'menren-b.webp', height: 140 },
  'menren-c':     { label: '門人', image: 'menren-c.webp', height: 140 },
  // 第 7 課〈兒時記趣〉(WY19 PR-B):使用者 2026-10-20 挑定孩童沈復 B、癩蝦蟆 B
  'shenfu':       { label: '小沈復', image: 'shenfu.webp', height: 104 }, // 七、八歲的孩子,約大人身高的四分之三
  'shenfu-adult': { label: '沈復', image: 'shenfu-adult.webp', height: 112, width: 120 }, // 長大後伏案寫書(使用者 2026-10-20 挑定成年 A)
  'shenfu-crouch': { label: '小沈復', image: 'shenfu-crouch.webp', height: 84 }, // 補姿勢:蹲下細看(與選中的 B 同一人)
  'shenfu-twig':  { label: '小沈復', image: 'shenfu-twig.webp', height: 104 }, // 補姿勢:驚訝後退、手拿細竹枝
  'toad':         { label: '癩蝦蟆', image: 'toad.webp', height: 96 },
  'ao':           { label: '大海龜', image: 'ao.webp', height: 60, width: 96 }, // 鼇(WY34,神話篇第 5 幕;動畫由 myth-props 直接引用)
  'toad-tongue':  { label: '癩蝦蟆', image: 'toad-tongue.webp', height: 96 }, // 吐舌(WY33,第 6 幕與閉嘴圖切換)
  // 第 4 課「犬馬」(WY20,使用者 2026-10-20 挑定狗 B、馬 B;圖中含食盆與食槽,呼應「皆能有養」)
  'dog':          { label: '狗', image: 'dog.webp', height: 78 },
  'horse':        { label: '馬', image: 'horse.webp', height: 116, width: 150 }, // 橫向的圖,畫框放寬
  // 自學選文一〈古代神話與寓言選〉神話(WY26 PR-B1):使用者 2026-10-22 待裁 61 挑定;夸父 A 暫定,換圖只換 kuafu.webp(寬度依原圖比例,換圖後可再調)
  'pangu':        { label: '盤古', image: 'pangu.webp', height: 168, width: 118 }, // 巨人,畫面裡最高
  'pangu-small':  { label: '盤古', image: 'pangu.webp', height: 100, width: 70 }, // 圖文故事第 1 段:剛在大雞蛋裡誕生
  'nuwa':         { label: '女媧', image: 'nuwa.webp', height: 150, width: 124 },
  'gonggong':     { label: '共工', image: 'gonggong.webp', height: 136, width: 122 },
  'zhurong':      { label: '祝融', image: 'zhurong.webp', height: 140, width: 140 }, // WY34 換成 D2(年輕、無鬍、騎兩龍),和共工區分
  'zhuanxu':      { label: '顓頊', image: 'zhuanxu.webp', height: 140, width: 82 },
  // 片尾四人正面像(WY34,神話篇第 12 幕與故事第 12 頁,由 myth-props 直接引用)
  'pangu-front':  { label: '盤古', image: 'pangu-front.webp', height: 100 },
  'nuwa-front':   { label: '女媧', image: 'nuwa-front.webp', height: 100 },
  'gonggong-front': { label: '共工', image: 'gonggong-front.webp', height: 100 },
  'kuafu-front':  { label: '夸父', image: 'kuafu-front.webp', height: 100 },
  'kuafu':        { label: '夸父', image: 'kuafu.webp', height: 156, width: 136 }, // 巨人(WY34 換成 K4 成年精壯版)
  // 自學選文一寓言篇(WY26 PR-B2):六張定稿圖，對照與授權見 assets/CREDITS.md
  'nanguo-n1':    { label: '南郭處士', image: 'nanguo-n1.webp', height: 136, width: 112 },
  'nanguo-n2':    { label: '南郭處士', image: 'nanguo-n2.webp', height: 136, width: 112 },
  'qi-xuan':      { label: '齊宣王', image: 'qi-xuan.webp', height: 134, width: 118 },
  'qi-min':       { label: '齊湣王', image: 'qi-min.webp', height: 134, width: 108 },
  'genglei':      { label: '更羸', image: 'genglei.webp', height: 142, width: 116 },
  'wei-wang':     { label: '魏王', image: 'wei-wang.webp', height: 136, width: 114 },
};

// 以模組位置為基準組圖檔網址,哪一層的頁面引用都對
export { characterURL as imageURL } from './assets.js?v=c037c72';
import { characterURL as imageURL } from './assets.js?v=c037c72';

// 甲蟲(程式繪製,WY29):側面看,分節(頭、胸、鞘翅)、六隻腳(遠側三隻較淡)、觸角、大顎。
// 原點在腳底中央、面向右,長約 22 單位;s=縮放,flip=面向左。圖文故事與動畫第 6 幕共用。
export function beetle(x, y, { s = 1, flip = false, color = '#b5532f', cls = '' } = {}) {
  const k = flip ? -s : s;
  return `<g class="beetle ${cls}" transform="translate(${x} ${y}) scale(${k} ${s})">`
    + '<path class="far" d="M-4 -2.5 L-7.5 -1 L-8.5 0 M0 -2.5 L-1 -0.6 L-1.8 0 M3.5 -3 L5.5 -1 L6.5 0"/>'
    + `<path class="body" fill="${color}" d="M-9.5 -4.5 Q-9.5 -10.5 -3 -10.5 Q2.2 -10.5 2.4 -5 Q2.4 -2 -3 -2 Q-9.5 -2 -9.5 -4.5Z"/>`
    + `<ellipse class="body" fill="${color}" cx="4.4" cy="-5.6" rx="2.6" ry="3"/>`
    + `<circle class="body" fill="${color}" cx="7.6" cy="-5.4" r="2"/>`
    + '<path class="seam" d="M-9.2 -5 Q-3.5 -3.6 2.2 -5.4 M-3 -10.4 Q-2.4 -7 -3.2 -2.2"/>'
    + '<path class="shine" d="M-7 -7.6 Q-4.5 -9.6 -1.5 -9.2"/>'
    + '<path class="jaw" d="M9.3 -6.3 Q11.6 -8.6 13.8 -8 M9.3 -4.5 Q11.6 -2.4 13.8 -3"/>'
    + '<path class="feeler" d="M7.6 -7.2 L8.8 -10 L11 -11"/>'
    + '<path class="near" d="M-5 -2.2 L-8 -0.8 L-9.6 0.2 M-0.8 -2 L-2.2 -0.4 L-2.8 0.4 M4 -2.8 L6.2 -0.8 L7.6 0.2"/>'
    + '<circle class="eye" cx="8.3" cy="-6" r=".55"/></g>';
}

function silhouette(r, x) {
  const head = 118;
  return [
    `<path class="fig-body" d="M${x - 26} 176 Q${x - 24} ${head + 22} ${x} ${head + 20} Q${x + 24} ${head + 22} ${x + 26} 176 Z"/>`,
    `<circle class="fig-head" cx="${x}" cy="${head}" r="24"/>`,
    `<path class="fig-hair" d="M${x - 24} ${head - 2} Q${x} ${head - 34} ${x + 24} ${head - 2} Q${x} ${head - 16} ${x - 24} ${head - 2} Z"/>`,
  ].join('');
}

function figure(id, x) {
  const r = ROLES[id];
  if (!r) throw new Error(`未知角色：${id}`);
  const body = r.image
    // 角色圖:底部站在地板線(y=178)上,高度依 ROLES.height,寬度依原圖比例
    ? `<image href="${imageURL(r.image)}" x="${x - (r.width ?? 110) / 2}" y="${178 - r.height}" width="${r.width ?? 110}" height="${r.height}" preserveAspectRatio="xMidYMax meet"/>`
    : silhouette(r, x);
  return `<g class="fig fig-${r.tone ?? 'art'}${r.faded ? ' is-faded' : ''}" role="img" aria-label="${r.label}">${body}`
    + `<text class="fig-label" x="${x}" y="194" text-anchor="middle">${r.label}</text></g>`;
}

// 神話插圖:對照圖與收尾小圖示在故事插圖裡放大置中(字才夠大);其他照動畫的位置放大兩倍
const MYTH_FIT = {
  mythChart: 'translate(-131 -88) scale(2.8)', // 對照圖(x 52~156、y 43~88)放大置中
  mythIcons: 'translate(-12 6) scale(2.1)', // 四人正面像(x 9~154、y 12~66,WY34)放大置中
};

const PROPS = {
  // ---- 第 7 課〈兒時記趣〉(WY19 PR-B)程式繪製道具
  sun: () => '<g class="prop-sun2"><circle cx="262" cy="46" r="22"/><path class="ray" d="M262 12 V4 M262 88 V80 M228 46 H220 M304 46 H296 M238 22 L232 16 M286 22 L292 16 M238 70 L232 76 M286 70 L292 76"/><text class="warn" x="262" y="104" text-anchor="middle">⚠ 不要直視太陽</text></g>',
  leaf: () => '<g class="prop-leaf2"><circle class="lens" cx="230" cy="96" r="58"/><path class="blade" d="M190 120 Q214 52 276 62 Q262 128 190 120Z"/><path class="vein" d="M192 118 L270 66 M214 104 L214 84 M230 94 L236 74 M246 84 L256 70 M214 104 L232 108 M230 94 L250 98"/></g>',
  mosquitoes: () => `<g class="prop-mosq2">${[[60, 50], [96, 34], [130, 60], [170, 40], [210, 64], [246, 36], [84, 82], [150, 90], [196, 96]].map(([x, y]) => `<g><ellipse class="wing" cx="${x - 3}" cy="${y - 4}" rx="4" ry="2.4"/><ellipse class="wing" cx="${x + 3}" cy="${y - 4}" rx="4" ry="2.4"/><circle class="body" cx="${x}" cy="${y}" r="2"/></g>`).join('')}</g>`,
  cranes: () => `<g class="prop-cranes2">${[[70, 46], [120, 30], [168, 54], [214, 32], [258, 58]].map(([x, y]) => `<path d="M${x - 18} ${y + 6} Q${x - 8} ${y - 6} ${x} ${y + 2} Q${x + 8} ${y - 6} ${x + 18} ${y + 6} Q${x + 8} ${y} ${x} ${y + 6} Q${x - 8} ${y} ${x - 18} ${y + 6}Z"/>`).join('')}</g>`,
  net: () => '<g class="prop-net2"><path d="M40 20 H280 V170 H40Z"/><path class="fold" d="M90 20 V170 M150 20 V170 M210 20 V170 M250 20 V170"/></g>',
  smoke: () => '<g class="prop-smoke2"><path d="M70 150 Q60 120 84 104 T96 64 T120 30"/><path d="M110 156 Q98 126 122 112 T134 76 T156 44"/></g>',
  cloud: () => '<g class="prop-cloud2"><path d="M60 80 Q60 58 84 60 Q92 38 118 46 Q138 32 156 52 Q182 50 182 72 Q182 90 160 90 H80 Q60 90 60 80Z"/><path d="M190 110 Q190 94 208 96 Q216 80 236 88 Q254 82 260 100 Q276 102 272 116 H200 Q190 116 190 110Z"/></g>',
  wall: () => '<g class="prop-wall2"><path d="M0 92 Q20 84 40 92 T80 90 T120 94 T160 88 T200 92 T240 90 T280 94 T320 90 V176 H0Z"/><path class="bump" d="M36 120 q8 -8 16 0 M120 136 q10 -10 20 0 M232 118 q8 -8 16 0"/><rect class="bed" x="190" y="146" width="130" height="30"/></g>',
  grass: () => `<g class="prop-grass2">${[200, 214, 228, 242, 256, 270, 284, 298].map((x, i) => `<path d="M${x} 146 Q${x + (i % 2 ? 6 : -6)} ${118 - (i % 3) * 10} ${x + (i % 2 ? 2 : -2)} ${100 - (i % 3) * 12}"/>`).join('')}</g>`,
  ants: () => `<g class="prop-ants2">${[[214, 140], [236, 142], [260, 139]].map(([x, y]) => `<g><circle cx="${x}" cy="${y}" r="2"/><circle cx="${x + 4}" cy="${y}" r="2.6"/><circle cx="${x + 9}" cy="${y}" r="2"/></g>`).join('')}</g>`,
  clods: () => '<g class="prop-clods2"><path d="M196 146 q10 -14 20 0Z M262 146 q12 -18 24 0Z"/><path class="pit" d="M226 146 q12 10 24 0"/></g>',
  // 兩隻甲蟲在草叢裡頂角打架(WY29:放大、畫得像昆蟲,站在地面上,和蝦蟆不重疊)
  bugs: () => `<g class="prop-bugs2">${beetle(205, 177, { s: 2.2 })}${beetle(265, 177, { s: 2.2, flip: true, color: '#4f7a3a' })}</g>`,
  // 地面上的矮草叢(WY29,第 6 段;畫在甲蟲後面)
  lowgrass: () => `<g class="prop-grass2">${[192, 204, 216, 240, 252, 262, 288, 300, 312].map((x, i) => `<path d="M${x} 177 Q${x + (i % 2 ? 5 : -5)} ${160 - (i % 3) * 6} ${x + (i % 2 ? 2 : -2)} ${148 - (i % 3) * 8}"/>`).join('')}</g>`,
  scrolls: () => '<g class="prop"><rect x="236" y="138" width="56" height="10" rx="5"/><rect x="242" y="126" width="46" height="10" rx="5"/><rect x="248" y="114" width="36" height="10" rx="5"/></g>',
  desk: () => '<rect class="prop" x="40" y="160" width="240" height="10" rx="4"/>',
  lamp: () => '<g class="prop"><rect x="258" y="140" width="16" height="36" rx="3"/><circle class="prop-glow" cx="266" cy="132" r="14"/></g>',
  slips: () => '<g class="prop"><rect x="40" y="120" width="8" height="52" rx="2"/><rect x="52" y="120" width="8" height="52" rx="2"/><rect x="64" y="120" width="8" height="52" rx="2"/></g>',
  thread: () => '<path class="prop-thread" d="M20 60 Q90 30 160 60 T300 60" fill="none"/>',
  door: () => '<rect class="prop" x="270" y="70" width="40" height="106" rx="4"/>',
  question: () => '<g class="prop-mark"><text x="34" y="52">?</text><text x="282" y="52">?</text><text x="152" y="32">?</text></g>',
  coin: () => '<g><circle class="prop-coin" cx="250" cy="70" r="26"/><text class="prop-coin-text" x="250" y="79" text-anchor="middle">忠</text></g>',
  // 自學選文一〈古代神話與寓言選〉神話(WY26 PR-B1):和動畫共用 shared/myth-props.js(160×90 座標,放大兩倍剛好對齊地板線)
  ...Object.fromEntries([
    ['mythEgg', () => Myth.egg()], ['mythSkyEarth', () => Myth.skyEarth()], ['mythChart', () => Myth.chart()],
    ['mythBroken', () => Myth.brokenSky()], ['mythMend', () => Myth.mendSky()], ['mythBuzhou', () => Myth.buzhou()],
    ['mythTilt', () => Myth.tilt()], ['mythVersus', () => Myth.versus()], ['mythSunset', () => Myth.sunset()],
    ['mythRivers', () => Myth.rivers()], ['mythGrove', () => Myth.grove()], ['mythIcons', () => Myth.icons()],
  ].map(([k, fn]) => [k, () => `<g transform="${MYTH_FIT[k] ?? 'scale(2)'}">${fn()}</g>`])),
  // 第 4 課〈論語選〉
  mound: () => '<g class="prop-mound2"><path class="soil" d="M70 176 L140 66 L180 66 L250 176Z"/><path class="gap" d="M140 66 L160 40 L180 66"/></g>',
  basket: () => '<g class="prop-basket2"><path class="soil" d="M246 46 Q270 30 294 46Z"/><path class="weave" d="M244 46 H296 L288 80 H252Z"/><path class="weave-line" d="M249 56 H291 M251 66 H289 M262 46 L264 80 M270 46 V80 M278 46 L276 80"/></g>',
  pit: () => '<g class="prop-pit2"><path class="ground" d="M0 150 H60 Q160 226 260 150 H320 V200 H0Z"/><path class="soil" d="M142 178 Q160 160 178 178Z"/></g>',
  bracelet: () => {
    // 左:四顆散落的珠子(禮孝友學)→ 中:箭頭 → 右:同樣四顆珠子被紅線串成手鍊;紅線=一以貫之
    const words = ['禮', '孝', '友', '學'];
    const bead = (cls, t, x, y, r) => `<g class="${cls}"><circle cx="${x}" cy="${y}" r="${r}"/><text x="${x}" y="${y}">${t}</text></g>`;
    const loose = [[46, 64], [92, 90], [40, 126], [90, 146]].map(([x, y], i) => bead('bead-loose', words[i], x, y, 17)).join('');
    const cx = 250, cy = 90, r = 46;
    const at = (deg) => [(cx + r * Math.cos((deg * Math.PI) / 180)).toFixed(1), (cy + r * Math.sin((deg * Math.PI) / 180)).toFixed(1)];
    const strung = [-90, 0, 90, 180].map((d, i) => { const [x, y] = at(d); return bead('bead-strung', words[i], x, y, 15); }).join('');
    const small = [-45, 45, 135, 225].map((d) => { const [x, y] = at(d); return `<circle class="bead-small" cx="${x}" cy="${y}" r="6"/>`; }).join('');
    return `<g class="prop-bracelet2">${loose}`
      + '<path class="arrow" d="M126 104 H172 M160 92 L174 104 L160 116"/>'
      + `<circle class="thread-ring" cx="${cx}" cy="${cy}" r="${r}"/>${small}${strung}`
      + `<text class="label" x="${cx}" y="168">紅線＝一以貫之</text></g>`;
  },

};

export function sceneSVG(art) {
  const n = art.figures.length;
  // xs:可指定角色的水平位置(例如讓出插圖中央給道具);沒指定就置中排開
  const xs = art.xs ?? art.figures.map((_, i) => Math.round(160 + (i - (n - 1) / 2) * 80));
  // 問號、硬幣畫在角色前面,其餘道具在角色後面
  const FRONT = new Set(['question', 'coin']);
  const draw = (front) => (art.props ?? []).filter((p) => FRONT.has(p) === front).map((p) => {
    if (!PROPS[p]) throw new Error(`未知道具：${p}`);
    return PROPS[p]();
  }).join('');
  return `
    <figure class="art">
      <svg viewBox="0 0 320 200" class="art-svg bg-${escapeHTML(art.bg)}" aria-hidden="false" role="group" aria-label="${escapeHTML(art.caption)}">
        <rect class="art-bg" width="320" height="200"/>
        <rect class="art-floor" y="176" width="320" height="24"/>
        ${draw(false)}
        ${art.figures.map((f, i) => figure(f, xs[i])).join('')}
        ${draw(true)}
      </svg>
      ${art.hideCaption ? '' : `<figcaption>${escapeHTML(art.caption)}</figcaption>`}
    </figure>`;
}

export const roleIds = Object.keys(ROLES);
export const propIds = Object.keys(PROPS);
