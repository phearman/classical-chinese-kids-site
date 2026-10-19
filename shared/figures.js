// 情境插圖:定稿的 Q 版角色圖(shared/characters/*.webp)+程式繪製的背景與道具。
// 沒有定稿圖的角色才用程式繪製剪影(目前所有角色都有定稿圖)。
import { escapeHTML } from './terms.js?v=ab14e02';

// 角色 → 圖檔(定稿,見 assets/CREDITS.md)或剪影參數
// height:同框時的身高(SVG 單位)。孔子依《史記》「長九尺有六寸」約 190 公分以上,取學生的 1.2 倍。
export const ROLES = {
  'kongzi':       { label: '孔子', image: 'kongzi.webp', height: 168 },
  'kongzi-leave': { label: '孔子', image: 'kongzi.webp', height: 168, faded: true },
  'zengzi':       { label: '曾參', image: 'zengzi.webp', height: 140 },
  'menren-a':     { label: '門人', image: 'menren-a.webp', height: 140 },
  'menren-b':     { label: '門人', image: 'menren-b.webp', height: 140 },
  'menren-c':     { label: '門人', image: 'menren-c.webp', height: 140 },
};

// 以模組位置為基準組圖檔網址,哪一層的頁面引用都對
export { characterURL as imageURL } from './assets.js?v=ab14e02';
import { characterURL as imageURL } from './assets.js?v=ab14e02';

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
    ? `<image href="${imageURL(r.image)}" x="${x - 55}" y="${178 - r.height}" width="110" height="${r.height}" preserveAspectRatio="xMidYMax meet"/>`
    : silhouette(r, x);
  return `<g class="fig fig-${r.tone ?? 'art'}${r.faded ? ' is-faded' : ''}" role="img" aria-label="${r.label}">${body}`
    + `<text class="fig-label" x="${x}" y="194" text-anchor="middle">${r.label}</text></g>`;
}

const PROPS = {
  scrolls: () => '<g class="prop"><rect x="236" y="138" width="56" height="10" rx="5"/><rect x="242" y="126" width="46" height="10" rx="5"/><rect x="248" y="114" width="36" height="10" rx="5"/></g>',
  desk: () => '<rect class="prop" x="40" y="160" width="240" height="10" rx="4"/>',
  lamp: () => '<g class="prop"><rect x="258" y="140" width="16" height="36" rx="3"/><circle class="prop-glow" cx="266" cy="132" r="14"/></g>',
  slips: () => '<g class="prop"><rect x="40" y="120" width="8" height="52" rx="2"/><rect x="52" y="120" width="8" height="52" rx="2"/><rect x="64" y="120" width="8" height="52" rx="2"/></g>',
  thread: () => '<path class="prop-thread" d="M20 60 Q90 30 160 60 T300 60" fill="none"/>',
  door: () => '<rect class="prop" x="270" y="70" width="40" height="106" rx="4"/>',
  question: () => '<g class="prop-mark"><text x="34" y="52">?</text><text x="282" y="52">?</text><text x="152" y="32">?</text></g>',
  coin: () => '<g><circle class="prop-coin" cx="250" cy="70" r="26"/><text class="prop-coin-text" x="250" y="79" text-anchor="middle">忠</text></g>',
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
  const xs = art.figures.map((_, i) => Math.round(160 + (i - (n - 1) / 2) * 80));
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
