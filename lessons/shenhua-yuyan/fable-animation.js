// 寓言篇動畫故事(WY26 PR-B2):道具全部程式繪製(shared/fable-props.js)。
// 整幅道具(樂工、京臺、推理線索)鋪滿舞台;小件(竽、大雁、糧袋、放大鏡、空位子)依資料的 x、y 放,寬度由 CSS 決定。
import { animMeta, roles, scenes } from './fable-anim-data.js?v=b1d73d1';
import { mountAnimation } from '../../shared/anim-player.js?v=b1d73d1';
import { FULL, SMALL_NAMES, smallSVG } from '../../shared/fable-props.js?v=b1d73d1';

const PROPS = {
  ...Object.fromEntries(Object.entries(FULL).map(([name, draw]) => [name, () => `<svg viewBox="0 0 160 90" class="p-fable p-fable-full fable-${name}">${draw()}</svg>`])),
  ...Object.fromEntries(SMALL_NAMES.map((name) => [name, () => smallSVG(name)])),
};
mountAnimation({ animMeta, roles, scenes, PROPS });
