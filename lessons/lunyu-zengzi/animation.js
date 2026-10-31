// 〈一聲「唯」〉動畫故事:本課的資料、道具與 AI 配音清單;播放器共用 shared/anim-player.js。
import { animMeta, roles, scenes } from './anim-data.js?v=81c892b';
import { audio as audioFiles, audioMeta } from './audio/manifest.js?v=81c892b';
import { mountAnimation } from '../../shared/anim-player.js?v=81c892b';
import { luMapHTML } from '../../shared/lu-map.js?v=81c892b';

// ---------------------------------------------------------------- 道具(程式繪製 SVG)
const PROPS = {
  ink: () => `<svg viewBox="0 0 200 120" class="p-ink"><circle cx="70" cy="60" r="40"/><circle cx="120" cy="50" r="32"/><circle cx="105" cy="78" r="26"/></svg>`,
  luMap: () => luMapHTML({ zoom: true }), // 春秋魯國地理圖(WY30,shared/lu-map.js)
  bamboo: () => `<svg viewBox="0 0 200 120" preserveAspectRatio="none" class="p-bamboo">${[12, 30, 48, 152, 170, 188].map((x, i) => `<rect x="${x}" y="${i % 2 ? 6 : 0}" width="7" height="120" rx="3"/><rect class="p-node" x="${x - 1}" y="${40 + (i % 3) * 8}" width="9" height="3"/>`).join('')}</svg>`,
  scrolls: () => `<svg viewBox="0 0 60 40" class="p-scrolls"><rect x="4" y="26" width="52" height="10" rx="5"/><rect x="9" y="14" width="42" height="10" rx="5"/><rect x="14" y="2" width="32" height="10" rx="5"/></svg>`,
  lamp: () => `<svg viewBox="0 0 40 60" class="p-lamp"><circle class="p-glow" cx="20" cy="16" r="14"/><path class="p-flame" d="M20 8 Q26 18 20 24 Q14 18 20 8Z"/><rect x="12" y="24" width="16" height="6" rx="2"/><rect x="17" y="30" width="6" height="26"/><rect x="9" y="54" width="22" height="5" rx="2"/></svg>`,
  thread: () => `<svg viewBox="0 0 200 40" class="p-thread"><path d="M10 26 Q40 4 70 20 T130 20 T190 26"/></svg>`,
  door: () => `<svg viewBox="0 0 40 80" preserveAspectRatio="none" class="p-door"><rect x="2" y="2" width="36" height="78" rx="3"/><rect class="p-light" x="6" y="6" width="28" height="70" rx="2"/></svg>`,
  coin: () => `<div class="p-coin"><div class="p-coin-in"><span class="face">忠</span><span class="face back">恕</span></div></div>`,
  bracelet: () => `<svg viewBox="0 0 120 120" class="p-bracelet"><circle class="ring" cx="60" cy="60" r="40"/>${Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return `<circle class="bead" style="--i:${i}" cx="${(60 + 40 * Math.cos(a)).toFixed(1)}" cy="${(60 + 40 * Math.sin(a)).toFixed(1)}" r="7"/>`;
  }).join('')}</svg>`,
};

mountAnimation({ animMeta, roles, scenes, PROPS, audioFiles, audioMeta, audioBase: new URL('./audio/', import.meta.url) });
