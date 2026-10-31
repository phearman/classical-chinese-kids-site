// 共用素材網址:以本模組位置為基準(哪一層頁面引用都對),發佈版加上 ?v=版本 避開舊快取。
import { version } from './version.js?v=96152c1';

const v = version.commit ? `?v=${version.commit}` : '';
export const characterURL = (file) => new URL(`./characters/${file}${v}`, import.meta.url).href;
export const backgroundURL = (file) => new URL(`./backgrounds/${file}${v}`, import.meta.url).href; // 背景圖(WY34 桃林)
