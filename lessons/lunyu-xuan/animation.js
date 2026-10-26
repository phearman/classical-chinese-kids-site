// 〈論語選〉動畫故事:本課的資料與道具;播放器共用 shared/anim-player.js。
// 本課尚未產生 AI 配音音檔(音訊工作延到使用者另行安排),旁白只用內建朗讀。
import { animMeta, roles, scenes } from './anim-data.js?v=9bb0ba7';
import { mountAnimation } from '../../shared/anim-player.js?v=9bb0ba7';

// ---------------------------------------------------------------- 道具(程式繪製 SVG)
const PROPS = {
  ink: () => `<svg viewBox="0 0 200 120" class="p-ink"><circle cx="70" cy="60" r="40"/><circle cx="120" cy="50" r="32"/><circle cx="105" cy="78" r="26"/></svg>`,
  lamp: () => `<svg viewBox="0 0 40 60" class="p-lamp"><circle class="p-glow" cx="20" cy="16" r="14"/><path class="p-flame" d="M20 8 Q26 18 20 24 Q14 18 20 8Z"/><rect x="12" y="24" width="16" height="6" rx="2"/><rect x="17" y="30" width="6" height="26"/><rect x="9" y="54" width="22" height="5" rx="2"/></svg>`,
  // 土山:只差最上面一筐(頂端虛線)
  mound: () => `<svg viewBox="0 0 200 120" class="p-mound"><path class="p-soil" d="M10 116 L86 30 L114 30 L190 116Z"/><path class="p-gap" d="M86 30 L100 12 L114 30"/></svg>`,
  // 竹筐(簣):裝著土
  basket: () => `<svg viewBox="0 0 60 50" class="p-basket"><path class="p-soil" d="M8 18 Q30 2 52 18Z"/><path class="p-weave" d="M6 18 H54 L48 46 H12Z"/><path class="p-weave-line" d="M10 26 H50 M12 34 H48 M14 42 H46 M22 18 L24 46 M30 18 V46 M38 18 L36 46"/></svg>`,
  // 低窪地:剛倒下第一筐土
  pit: () => `<svg viewBox="0 0 200 80" class="p-pit"><path class="p-ground" d="M0 20 H40 Q100 76 160 20 H200 V80 H0Z"/><path class="p-soil" d="M84 46 Q100 30 116 46Z"/></svg>`,
};

mountAnimation({ animMeta, roles, scenes, PROPS });
