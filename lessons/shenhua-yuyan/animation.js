// 〈古代神話與寓言選〉「神話」動畫故事(WY26 PR-B1):本課的資料與道具;播放器共用 shared/anim-player.js。
// 道具全部是程式繪製,和圖文故事共用 shared/myth-props.js(座標 160×90=舞台,鋪滿整個舞台)。旁白只用內建朗讀。
import { animMeta, roles, scenes } from './anim-data.js?v=96152c1';
import { mountAnimation } from '../../shared/anim-player.js?v=96152c1';
import * as M from '../../shared/myth-props.js?v=96152c1';

const full = (name, body) => `<svg viewBox="0 0 160 90" class="p-myth p-${name}">${body}</svg>`;

// ---------------------------------------------------------------- 道具(程式繪製 SVG,鋪滿舞台)
const PROPS = {
  egg: () => full('egg', M.egg()),
  skyEarth: () => full('skyEarth', M.skyEarth()),
  chart: () => full('chart', M.chart()),
  broken: () => full('broken', M.brokenSky()),
  mend: () => full('mend', M.mendSky()),
  buzhou: () => full('buzhou', M.buzhou()),
  tilt: () => full('tilt', M.tilt()),
  sunset: () => full('sunset', M.sunset()),
  rivers: () => full('rivers', M.rivers()),
  grove: () => full('grove', M.grove()),
  icons: () => full('icons', M.icons()),
};

mountAnimation({ animMeta, roles, scenes, PROPS });
