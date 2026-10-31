// 〈論語選〉動畫故事資料(單一資料來源)。依 lessons/lunyu-xuan/storyboard.md 七幕,三則各一小段,總長 120 秒。
// 角色圖沿用定稿(孔子、曾子)與孔子講堂的子游圖(shared/characters/*.webp);背景與道具為程式繪製。
// 旁白、字幕皆為本站自行撰寫,原文字卡依維基文庫《論語》。情節為教學改編。
//
// scene:bg 背景(paper/hall/night)、card 畫面字卡、lines 旁白(at=幕內第幾秒出現;role 決定朗讀聲調;
//        say=選填的朗讀用文字,用同音字避開多音字誤讀,字幕仍顯示 text)、
//        items 畫面元件:actor 角色 / text 浮字 / prop 道具(見 animation.js 的 PROPS)
// 位置一律用舞台百分比:x=水平中心、y=底部(角色)或中心(文字),h=角色高度。

import { TW, narrator, kongzi, zengzi } from '../../shared/roles.js?v=96152c1';

export const animMeta = {
  title: '動畫故事：論語選',
  note: '情節為教學改編；對話依《論語》原文改寫成白話。',
};

// 角色聲音(pitch/rate 給內建朗讀,tts 留給之後的 AI 配音,本課尚未產音檔):孔子、曾子、旁白各課共用,寫在 shared/roles.js(WY23)。
export const roles = {
  narrator,
  kongzi,
  ziyou: { label: '子游', pitch: 1.15, rate: 0.95, tts: { voice: 'echo', instructions: `${TW}你是二十多歲的學生,語氣認真、有禮貌。` } },
  zengzi,
};

export const scenes = [
  {
    id: 's1', title: '開場', duration: 10, bg: 'paper',
    card: '第 4 課・論語選',
    lines: [{ at: 1, role: 'narrator', text: '今天的《論語》有三段：一段問孝順，一段講堆山，一段講每天檢查自己。' }],
    items: [
      { kind: 'prop', name: 'ink', x: 50, y: 50 },
      { kind: 'text', text: '論語選', x: 50, y: 45, size: 12, anim: 'fade', delay: 1, cls: 'title' },
      { kind: 'text', text: '問孝・為山・三省', x: 50, y: 70, size: 5, anim: 'fade', delay: 3, cls: 'fine' },
    ],
  },
  {
    id: 's2', title: '子游問孝', duration: 20, bg: 'hall',
    card: '子游問孝。子曰：「今之孝者，是謂能養。',
    lines: [
      { at: 1, role: 'narrator', text: '學生子游來請教老師：怎樣才算孝順？' },
      { at: 7, role: 'kongzi', text: '現在的人以為，讓爸媽吃飽穿暖，就是孝。' },
    ],
    items: [
      { kind: 'actor', who: 'ziyou', x: 30, y: 96, h: 66, anim: 'walkIn' },
      { kind: 'actor', who: 'kongzi', x: 70, y: 96, h: 80, anim: 'slowBob', delay: 0.5 },
      { kind: 'text', text: '？', x: 44, y: 36, size: 12, anim: 'pop', delay: 2, cls: 'mark' },
    ],
  },
  {
    id: 's3', title: '狗和馬', duration: 20, bg: 'paper',
    card: '至於犬馬，皆能有養。不敬，何以別乎？」',
    lines: [
      { at: 1, role: 'kongzi', text: '可是狗和馬，也有人天天餵牠們吃東西。' },
      { at: 8, role: 'kongzi', text: '如果心裡沒有尊敬，這兩件事，要怎麼分別呢？' },
    ],
    items: [
      { kind: 'actor', who: 'dog', x: 30, y: 96, h: 42, anim: 'fade' },
      { kind: 'actor', who: 'horse', x: 68, y: 96, h: 66, anim: 'fade', delay: 1 },
      { kind: 'text', text: '敬', x: 38, y: 40, size: 10, anim: 'glow', delay: 9, cls: 'stamp' },
    ],
  },
  {
    id: 's4', title: '只差一筐', duration: 20, bg: 'paper',
    card: '子曰：「譬如為山，未成一簣，止，吾止也！',
    lines: [
      { at: 1, role: 'narrator', text: '孔子又打了個比方：堆一座山，只差最後一筐土。' },
      { at: 9, role: 'kongzi', text: '這時候停下來，是我自己停的。' },
    ],
    items: [
      { kind: 'prop', name: 'mound', x: 50, y: 60 },
      { kind: 'prop', name: 'basket', x: 80, y: 30, delay: 3 },
      { kind: 'text', text: '止', x: 16, y: 48, size: 12, anim: 'pop', delay: 10, cls: 'stamp' },
    ],
  },
  {
    id: 's5', title: '第一筐土', duration: 18, bg: 'paper',
    card: '譬如平地，雖覆一簣，進，吾往也！」',
    lines: [
      { at: 1, role: 'narrator', text: '要把一塊低地填平，現在才填進第一筐土。' },
      { at: 8, role: 'kongzi', text: '繼續往前走，也是我自己決定的。' },
    ],
    items: [
      { kind: 'prop', name: 'pit', x: 50, y: 70 },
      { kind: 'prop', name: 'basket', x: 40, y: 34, delay: 1 },
      { kind: 'text', text: '進', x: 82, y: 48, size: 12, anim: 'pop', delay: 9, cls: 'stamp' },
    ],
  },
  {
    id: 's6', title: '每天三個問題', duration: 22, bg: 'night',
    card: '曾子曰：「吾日三省吾身：為人謀而不忠乎？與朋友交而不信乎？傳不習乎？」',
    lines: [
      { at: 1, role: 'narrator', text: '曾子每天睡前，都問自己三個問題。', say: '增子每天睡前，都問自己三個問題。' },
      { at: 6, role: 'zengzi', text: '幫人做事，盡心了嗎？' },
      { at: 11, role: 'zengzi', text: '跟朋友說好的，做到了嗎？' },
      { at: 16, role: 'zengzi', text: '老師教的，複習了嗎？', say: '老師交的，複習了嗎？' },
    ],
    items: [
      { kind: 'actor', who: 'zengzi', x: 34, y: 96, h: 70, anim: 'slowBob' },
      { kind: 'prop', name: 'lamp', x: 58, y: 92 },
      { kind: 'text', text: '盡心', x: 72, y: 52, size: 6, anim: 'slideL', delay: 6, cls: 'slip' },
      { kind: 'text', text: '守信', x: 82, y: 52, size: 6, anim: 'slideL', delay: 11, cls: 'slip' },
      { kind: 'text', text: '複習', x: 92, y: 52, size: 6, anim: 'slideL', delay: 16, cls: 'slip' },
    ],
  },
  {
    id: 's7', title: '收尾', duration: 10, bg: 'paper',
    card: '敬・停或走自己決定・每天檢查',
    lines: [{ at: 1, role: 'narrator', text: '孝順要有敬；停下或繼續，由自己決定；每天檢查自己。你今天想問自己哪一題？' }],
    items: [
      { kind: 'text', text: '敬', x: 22, y: 45, size: 12, anim: 'pop', delay: 1, cls: 'stamp' },
      { kind: 'text', text: '吾往', x: 50, y: 45, size: 10, anim: 'pop', delay: 2.5, cls: 'stamp' },
      { kind: 'text', text: '三省', x: 78, y: 45, size: 10, anim: 'pop', delay: 4, cls: 'stamp' },
      { kind: 'text', text: '情節為教學改編', x: 50, y: 88, size: 3, anim: 'fade', delay: 5, cls: 'fine' },
    ],
  },
];

// 朗讀用同音字對照(say 只能做這些替換;沿用第一課使用者試聽確認過的「教→交」「曾→增」)
export const sayReplacements = { 教: '交', 曾: '增' };

// ---------------------------------------------------------------- 讀音防呆(比照第一課 WY10)
// 以「實際朗讀的句子」(say ?? text)為準:句子裡每個多音字都要登記讀音(依教育部《重編國語辭典修訂本》)。
// readingChecked=使用者已實際聽過、念得對;pendingListen=還沒人聽過(測試會要求兩份清單剛好涵蓋所有出現位置)。
export const polyphones = [
  '參', '曾', '教', '省', '樂', '行', '重', '長', '為', '少', '好', '看', '了', '得', '和',
  '數', '當', '還', '卷', '應', '轉', '幾', '沒', '分', '將', '都', '只',
  '養', '覆', '傳', '別', '差', '要', '倒', '說',
];

export const readingChecked = [];

// 還沒人聽過的(本課旁白全部待使用者試聽;讀音依教育部辭典)
export const pendingListen = [
  { id: 's2-1', spoken: '學生子游來請教老師：怎樣才算孝順？', char: '教', nth: 0, reading: 'ㄐㄧㄠˋ' },
  { id: 's2-2', spoken: '現在的人以為，讓爸媽吃飽穿暖，就是孝。', char: '為', nth: 0, reading: 'ㄨㄟˊ' },
  { id: 's3-1', spoken: '可是狗和馬，也有人天天餵牠們吃東西。', char: '和', nth: 0, reading: 'ㄏㄜˊ' },
  { id: 's3-2', spoken: '如果心裡沒有尊敬，這兩件事，要怎麼分別呢？', char: '沒', nth: 0, reading: 'ㄇㄟˊ' },
  { id: 's3-2', spoken: '如果心裡沒有尊敬，這兩件事，要怎麼分別呢？', char: '要', nth: 0, reading: 'ㄧㄠˋ' },
  { id: 's3-2', spoken: '如果心裡沒有尊敬，這兩件事，要怎麼分別呢？', char: '分', nth: 0, reading: 'ㄈㄣ' },
  { id: 's3-2', spoken: '如果心裡沒有尊敬，這兩件事，要怎麼分別呢？', char: '別', nth: 0, reading: 'ㄅㄧㄝˊ' },
  { id: 's4-1', spoken: '孔子又打了個比方：堆一座山，只差最後一筐土。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's4-1', spoken: '孔子又打了個比方：堆一座山，只差最後一筐土。', char: '只', nth: 0, reading: 'ㄓˇ' },
  { id: 's4-1', spoken: '孔子又打了個比方：堆一座山，只差最後一筐土。', char: '差', nth: 0, reading: 'ㄔㄚˋ' },
  { id: 's5-1', spoken: '要把一塊低地填平，現在才填進第一筐土。', char: '要', nth: 0, reading: 'ㄧㄠˋ' },
  { id: 's6-1', spoken: '增子每天睡前，都問自己三個問題。', char: '都', nth: 0, reading: 'ㄉㄡ' },
  { id: 's6-2', spoken: '幫人做事，盡心了嗎？', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's6-3', spoken: '跟朋友說好的，做到了嗎？', char: '說', nth: 0, reading: 'ㄕㄨㄛ' },
  { id: 's6-3', spoken: '跟朋友說好的，做到了嗎？', char: '好', nth: 0, reading: 'ㄏㄠˇ' },
  { id: 's6-3', spoken: '跟朋友說好的，做到了嗎？', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's6-4', spoken: '老師交的，複習了嗎？', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's7-1', spoken: '孝順要有敬；停下或繼續，由自己決定；每天檢查自己。你今天想問自己哪一題？', char: '要', nth: 0, reading: 'ㄧㄠˋ' },
];

// 核准使用 say 的句子:沿用第一課使用者試聽確認過的同音字;本課句子仍列在待試聽
export const sayApproved = [
  { id: 's6-1', why: '曾子→增子(第一課已確認「曾→增」)' },
  { id: 's6-4', why: '教→交(動詞教導,第一課已確認)' },
];
