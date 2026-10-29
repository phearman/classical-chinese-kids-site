// 春秋魯國與周邊諸國示意圖(WY30,共用元件):第一課第 1 幕使用,第 4 課等其他課可沿用。
// 底圖=Natural Earth 10m(公有領域)的陸地、海岸線、今黃河,見 lu-map-data.js;國都用「今地名」的位置示意。
// 諸國位置的出處見 lessons/lunyu-zengzi/sources.md「魯國地理圖」;verified=已查證(對照所列工具書)。
import { LU_MAP_BASE as B } from './lu-map-data.js?v=5c3538d';

const LAT0 = (B.box.s + B.box.n) / 2;
const K = B.width / ((B.box.e - B.box.w) * Math.cos((LAT0 * Math.PI) / 180));
export const project = (lon, lat) => [
  +((lon - B.box.w) * Math.cos((LAT0 * Math.PI) / 180) * K).toFixed(1),
  +((B.box.n - lat) * K).toFixed(1),
];

// state:國名;capital:國都(依《漢書‧地理志》,已查證);modern:今地;lon/lat:今地的大約經緯度(示意);dx/dy:文字位置微調
// pending:今地對照尚待查證的說明(網頁上「待查證」只能來自 pending)
const HAN = '《漢書‧地理志》(維基文庫〈漢書/卷028〉revid 2605705)';
export const LU_PLACES = [
  { id: 'lu', state: '魯', capital: '曲阜', modern: '今山東曲阜', lon: 117.0, lat: 35.6, main: true, dx: 0, dy: -11,
    source: `${HAN}「以少昊之虛曲阜封周公子伯禽為魯侯」;教育部《重編國語辭典》「魯國」:轄域包括今山東、江蘇、安徽各一部分,「以曲阜(今山東……)」` },
  { id: 'qi', state: '齊', capital: '臨淄（漢代作臨甾，又名營丘）', modern: '今山東淄博', lon: 118.3, lat: 36.8, dx: 0, dy: -9,
    source: `${HAN}「臨甾名營丘」;教育部《重編國語辭典》「齊國」:位於今山東省一帶`, pending: '臨甾對照今山東淄博,尚待以工具書查證。' },
  { id: 'wei', state: '衛', capital: '帝丘（漢代為濮陽）', modern: '今河南濮陽', lon: 115.0, lat: 35.8, dx: -2, dy: -9,
    source: `${HAN}記衛遷都帝丘,「今之濮陽是也」`, pending: '漢代濮陽對照今河南濮陽,尚待以工具書查證。' },
  { id: 'cao', state: '曹', capital: '定陶', modern: '今山東定陶', lon: 115.6, lat: 35.1, dx: -15, dy: 6,
    source: `${HAN}「濟陰定陶,詩風曹國也」`, pending: '定陶對照今山東菏澤定陶,尚待以工具書查證。' },
  { id: 'song', state: '宋', capital: '商丘（漢代稱睢陽）', modern: '今河南商丘', lon: 115.7, lat: 34.4, dx: 0, dy: 20,
    source: `${HAN}「周封微子於宋,今之睢陽是也」`, pending: '睢陽對照今河南商丘,尚待以工具書查證。' },
];
export const TAISHAN = { name: '泰山', lon: 117.1, lat: 36.25 };

export const LU_MAP_CAPTION = '海岸線、黃河都是今天的位置（春秋時代黃河河道與今日不同）；國都依今地名示意。';

// 同一頁可能放好幾張圖:每張的標題 id 都不同
let serial = 0;

// zoom:true 時,過一會兒從整張圖放大到曲阜一帶(第一課第 1 幕),周邊的國名與海名淡出(不會留下被切掉的半個字);
// 尊重 prefers-reduced-motion(CSS 處理)。caption:圖說放在 SVG 外(HTML 文字,手機上才夠大)
export function luMapSVG({ zoom = false } = {}) {
  const id = `lu-map-title-${++serial}`;
  const [lx, ly] = project(117.0, 35.6);
  const [tx, ty] = project(TAISHAN.lon, TAISHAN.lat);
  const sea = (text, lon, lat) => { const [x, y] = project(lon, lat); return `<text class="lu-sea lu-edge" x="${x}" y="${y}">${text}</text>`; };
  const places = LU_PLACES.map((p) => {
    const [x, y] = project(p.lon, p.lat);
    return `<g class="lu-place${p.main ? ' is-main' : ' lu-edge'}" data-place="${p.id}">
      <circle cx="${x}" cy="${y}" r="${p.main ? 4.5 : 3}"/>
      <text class="lu-state" x="${x + p.dx}" y="${y + p.dy}">${p.state}</text>
      ${p.main ? `<text class="lu-capital" x="${x}" y="${y + 18}">曲阜</text>` : ''}
    </g>`;
  }).join('');
  return `<svg viewBox="0 0 ${B.width} ${B.height}" class="lu-map${zoom ? ' is-zoom' : ''}" role="img" aria-labelledby="${id}">
    <title id="${id}">春秋時代魯國與周邊諸國示意圖：魯國在今山東，國都曲阜</title>
    <rect class="lu-water" width="${B.width}" height="${B.height}"/>
    <g class="lu-zoom" style="transform-origin:${lx}px ${ly}px">
      <path class="lu-land" d="${B.land}"/>
      <path class="lu-coast" d="${B.coast}"/>
      <path class="lu-river" d="${B.huang}"/>
      ${sea('渤海', 119.6, 38.2)}${sea('黃海', 121.6, 35.4)}
      <path class="lu-mount" d="M${tx} ${ty - 5}L${tx + 5} ${ty + 3}L${tx - 5} ${ty + 3}Z"/>
      <text class="lu-mount-name" x="${tx + 8}" y="${ty + 5}">泰山</text>
      ${places}
    </g>
  </svg>`;
}

// 地圖+圖說(HTML):動畫道具與其他課都用這個
export const luMapHTML = (opts) => `<figure class="lu-figure">${luMapSVG(opts)}<figcaption class="lu-caption">${LU_MAP_CAPTION}</figcaption></figure>`;
