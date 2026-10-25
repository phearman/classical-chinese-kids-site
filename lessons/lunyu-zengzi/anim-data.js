// 〈一聲「唯」〉動畫故事資料(單一資料來源)。依 lessons/lunyu-zengzi/storyboard.md 九幕,總長 160 秒。
// 角色圖沿用定稿(shared/characters/*.webp);背景與道具為程式繪製。旁白、字幕皆為本站自行撰寫,
// 原文字卡依維基文庫《論語》。情節為教學改編,門人為虛構角色。
//
// scene:bg 背景(paper/hall/night)、card 畫面字卡、lines 旁白(at=幕內第幾秒出現;role 決定朗讀聲調;
//        say=選填的朗讀用文字,用同音字避開多音字誤讀,字幕仍顯示 text)、
//        items 畫面元件:actor 角色 / text 浮字 / prop 道具(見 animation.js 的 PROPS)
// 位置一律用舞台百分比:x=水平中心、y=底部(角色)或中心(文字),h=角色高度。

import { TW, narrator, kongzi, zengzi } from '../../shared/roles.js?v=b1d73d1';

export const animMeta = {
  title: '動畫故事：一聲「唯」',
  note: '情節為教學改編；門人為虛構角色。',
};

// 角色聲音(pitch/rate 給內建朗讀,tts 給 AI 配音):孔子、曾子、旁白各課共用,寫在 shared/roles.js(WY23);門人只有本課有。
export const roles = {
  narrator,
  kongzi,
  zengzi,
  menren: { label: '門人', pitch: 1.35, rate: 1.05, tts: { voice: 'coral', instructions: `${TW}你是好奇又急性子的年輕學生,語氣活潑、帶點驚訝。` } },
};

export const scenes = [
  {
    id: 's1', title: '開場', duration: 15, bg: 'paper',
    card: '春秋時代・魯國',
    lines: [{ at: 1, role: 'narrator', text: '兩千五百年前，在魯國，有一位老師，學生多到數不清。', say: '兩千五百年前，在魯國，有一位老師，學生多到暑不清。' }],
    items: [
      { kind: 'prop', name: 'ink', x: 50, y: 50 },
      { kind: 'prop', name: 'luMap', x: 50, y: 36, delay: 2 }, // 春秋魯國地理圖(WY30):先看整張,再放大到曲阜
      { kind: 'text', text: '一聲「唯」', x: 50, y: 82, size: 9, anim: 'fade', delay: 5, cls: 'title' },
    ],
  },
  {
    id: 's2', title: '孔子登場', duration: 15, bg: 'paper',
    card: '孔子（約西元前 551～前 479）',
    lines: [
      { at: 1, role: 'narrator', text: '他叫孔丘，大家叫他孔子。' },
      { at: 5, role: 'narrator', text: '他教禮、教孝、教怎麼交朋友、怎麼當官——教的東西多到像一整片竹林。', say: '他交禮、交孝、交怎麼交朋友、怎麼當官——交的東西多到像一整片竹林。' },
    ],
    items: [
      { kind: 'prop', name: 'bamboo', x: 50, y: 100 },
      { kind: 'actor', who: 'kongzi', x: 50, y: 96, h: 84, anim: 'walkIn', delay: 0.5 },
    ],
  },
  {
    id: 's3', title: '曾子登場', duration: 20, bg: 'hall',
    card: '曾參（曾子），比孔子小 46 歲',
    lines: [
      { at: 1, role: 'narrator', text: '曾參是班上很年輕的學生。', say: '增深是班上很年輕的學生。' },
      { at: 5, role: 'narrator', text: '老師說他「魯」——反應慢。同學抄完三卷，他還在抄第一卷。' },
      { at: 13, role: 'narrator', text: '可是他有個習慣：每天晚上問自己三個問題。' },
    ],
    items: [
      { kind: 'actor', who: 'zengzi', x: 30, y: 96, h: 70, anim: 'slowBob' },
      { kind: 'actor', who: 'menren-c', x: 72, y: 96, h: 66, anim: 'bob', delay: 0.3 },
      { kind: 'prop', name: 'scrolls', x: 88, y: 92, delay: 2 },
      { kind: 'text', text: '參也魯', x: 52, y: 34, size: 7, anim: 'pop', delay: 6, cls: 'stamp' },
    ],
  },
  {
    id: 's4', title: '三省', duration: 15, bg: 'night',
    card: '吾日三省吾身',
    lines: [
      { at: 1, role: 'narrator', text: '替人做事，盡心了嗎？' },
      { at: 5, role: 'narrator', text: '對朋友，守信了嗎？' },
      { at: 9, role: 'narrator', text: '老師教的，複習了嗎？', say: '老師交的，複習了嗎？' },
    ],
    items: [
      { kind: 'prop', name: 'lamp', x: 90, y: 92 },
      { kind: 'actor', who: 'zengzi', x: 34, y: 96, h: 70, anim: 'slowBob' },
      { kind: 'text', text: '忠？', x: 58, y: 30, size: 7, anim: 'glow', delay: 1, cls: 'slip' },
      { kind: 'text', text: '信？', x: 70, y: 30, size: 7, anim: 'glow', delay: 5, cls: 'slip' },
      { kind: 'text', text: '習？', x: 82, y: 30, size: 7, anim: 'glow', delay: 9, cls: 'slip' },
    ],
  },
  {
    id: 's5', title: '老師出題', duration: 20, bg: 'hall',
    card: '子曰：「參乎！吾道一以貫之。」',
    lines: [
      { at: 1, role: 'narrator', text: '有一天上課，孔子放下竹簡，忽然轉頭。' },
      { at: 6, role: 'kongzi', text: '參啊！我的道理，是用一個東西串起來的。', say: '深啊！我的道理，是用一個東西串起來的。' },
    ],
    items: [
      { kind: 'actor', who: 'zengzi', x: 22, y: 96, h: 70 },
      { kind: 'actor', who: 'kongzi', x: 78, y: 96, h: 84, anim: 'nod', delay: 6 },
      { kind: 'prop', name: 'thread', x: 50, y: 30, delay: 10 },
      { kind: 'text', text: '禮', x: 32, y: 42, size: 6, anim: 'float', delay: 8 },
      { kind: 'text', text: '孝', x: 41, y: 34, size: 6, anim: 'float', delay: 8.3 },
      { kind: 'text', text: '友', x: 50, y: 44, size: 6, anim: 'float', delay: 8.6 },
      { kind: 'text', text: '學', x: 59, y: 34, size: 6, anim: 'float', delay: 8.9 },
      { kind: 'text', text: '政', x: 68, y: 42, size: 6, anim: 'float', delay: 9.2 },
    ],
  },
  {
    id: 's6', title: '一聲「唯」', duration: 15, bg: 'hall',
    card: '曾子曰：「唯。」子出。',
    lines: [
      { at: 1, role: 'zengzi', text: '是。' },
      { at: 4, role: 'narrator', text: '曾參幾乎沒有停頓。孔子微笑點點頭，什麼也沒多說，就走出了講堂。', say: '增深幾乎沒有停頓。孔子微笑點點頭，什麼也沒多說，就走出了講堂。' },
    ],
    items: [
      { kind: 'prop', name: 'door', x: 92, y: 96 },
      { kind: 'actor', who: 'zengzi', x: 26, y: 96, h: 70, anim: 'pop', delay: 0.5 },
      { kind: 'text', text: '唯！', x: 40, y: 36, size: 10, anim: 'pop', delay: 1, cls: 'speech' },
      { kind: 'actor', who: 'kongzi', x: 66, y: 96, h: 84, anim: 'exitRight', delay: 5 },
    ],
  },
  {
    id: 's7', title: '同學們炸鍋了', duration: 20, bg: 'hall',
    card: '門人問曰：「何謂也？」',
    lines: [
      { at: 1, role: 'menren', text: '就這樣？' },
      { at: 4, role: 'menren', text: '一個東西，是什麼？' },
      { at: 8, role: 'menren', text: '你都聽懂了喔？' },
      { at: 12, role: 'narrator', text: '老師只說「有一個」，沒說「是什麼」；曾參只回一個字。兩個人像在打啞謎。', say: '老師只說「有一個」，沒說「是什麼」；增深只回一個字。兩個人像在打啞謎。' },
    ],
    items: [
      { kind: 'actor', who: 'menren-a', x: 18, y: 96, h: 64, anim: 'bob' },
      { kind: 'actor', who: 'zengzi', x: 50, y: 96, h: 70 },
      { kind: 'actor', who: 'menren-b', x: 82, y: 96, h: 66, anim: 'bob', delay: 0.4 },
      { kind: 'text', text: '？', x: 30, y: 42, size: 12, anim: 'pop', delay: 1, cls: 'mark' },
      { kind: 'text', text: '？', x: 92, y: 26, size: 12, anim: 'pop', delay: 4, cls: 'mark' },
      { kind: 'text', text: '？', x: 64, y: 34, size: 10, anim: 'pop', delay: 8, cls: 'mark' },
    ],
  },
  {
    id: 's8', title: '答案揭曉', duration: 25, bg: 'hall',
    card: '曾子曰：「夫子之道，忠恕而已矣！」',
    lines: [
      { at: 1, role: 'zengzi', text: '老師的道理，就是忠和恕而已。' },
      { at: 7, role: 'narrator', text: '對自己，盡心——分組報告，做好自己那一頁。' },
      { at: 14, role: 'narrator', text: '對別人，將心比心——不想被已讀不回，就不要已讀不回別人。' },
    ],
    items: [
      { kind: 'actor', who: 'zengzi', x: 50, y: 96, h: 70, anim: 'pop' },
      { kind: 'prop', name: 'coin', x: 78, y: 28, delay: 2 },
      { kind: 'text', text: '忠：做好自己那一頁', x: 19, y: 66, size: 5, anim: 'slideL', delay: 7, cls: 'panel' },
      { kind: 'text', text: '恕：不想被已讀不回，就不要已讀不回別人', x: 81, y: 66, size: 5, anim: 'slideR', delay: 14, cls: 'panel' },
    ],
  },
  {
    id: 's9', title: '你的那條線', duration: 15, bg: 'paper',
    card: '想一想：你的「一以貫之」是什麼？',
    lines: [{ at: 1, role: 'narrator', text: '你的生活裡，有沒有一條可以把所有事情串起來的線？' }],
    items: [
      { kind: 'prop', name: 'bracelet', x: 50, y: 46, delay: 0.5 },
      { kind: 'text', text: '情節為教學改編；門人為虛構角色', x: 50, y: 92, size: 2.6, anim: 'fade', delay: 6, cls: 'fine' },
    ],
  },
];

// 朗讀用同音字對照(say 只能做這些替換;2026-10-18 使用者試聽確認)
// 參(ㄕㄣ)常被念成 ㄘㄢ → 深;曾(姓,ㄗㄥ)常被念成 ㄘㄥˊ → 增;教(動詞,ㄐㄧㄠ)常被念成 ㄐㄧㄠˋ → 交(WY10);
// 數(數不清,ㄕㄨˇ)被念錯 → 暑(2026-10-19 使用者試聽第 1 句「錯」)
export const sayReplacements = { 參: '深', 曾: '增', 教: '交', 數: '暑' };

// ---------------------------------------------------------------- 讀音防呆(WY10)
// 以「實際朗讀的句子」(say ?? text)為準:句子裡每個多音字都要登記讀音(依教育部《重編國語辭典修訂本》)。
// readingChecked=使用者已實際聽過、念得對;pendingListen=還沒人聽過(測試會要求兩份清單剛好涵蓋所有出現位置)。
// 每筆記下整句 spoken、字 char、這個字在句中第幾次出現 nth(從 0 起);句子一改,舊紀錄就對不上,必須重新確認。
export const polyphones = [
  '參', '曾', '教', '省', '樂', '行', '重', '長', '為', '少', '好', '看', '了', '得', '和',
  '數', '當', '還', '卷', '應', '轉', '幾', '沒', '分', '將', '都', '只',
];

// 2026-10-18 使用者試聽 7 句,回覆「都對」
export const readingChecked = [
  { id: 's4-1', spoken: '替人做事，盡心了嗎？', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's4-2', spoken: '對朋友，守信了嗎？', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's4-3', spoken: '老師交的，複習了嗎？', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's6-2', spoken: '增深幾乎沒有停頓。孔子微笑點點頭，什麼也沒多說，就走出了講堂。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's7-3', spoken: '你都聽懂了喔？', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's8-1', spoken: '老師的道理，就是忠和恕而已。', char: '和', nth: 0, reading: 'ㄏㄜˊ' },
  { id: 's8-2', spoken: '對自己，盡心——分組報告，做好自己那一頁。', char: '好', nth: 0, reading: 'ㄏㄠˇ' },
  // 2026-10-19 使用者試聽第二批 10 句:第 1 句錯(已改用 say),其餘「都對」
  { id: 's2-2', spoken: '他交禮、交孝、交怎麼交朋友、怎麼當官——交的東西多到像一整片竹林。', char: '當', nth: 0, reading: 'ㄉㄤ' },
  { id: 's3-2', spoken: '老師說他「魯」——反應慢。同學抄完三卷，他還在抄第一卷。', char: '應', nth: 0, reading: 'ㄧㄥˋ' },
  { id: 's3-2', spoken: '老師說他「魯」——反應慢。同學抄完三卷，他還在抄第一卷。', char: '卷', nth: 0, reading: 'ㄐㄩㄢˋ' },
  { id: 's3-2', spoken: '老師說他「魯」——反應慢。同學抄完三卷，他還在抄第一卷。', char: '卷', nth: 1, reading: 'ㄐㄩㄢˋ' },
  { id: 's3-2', spoken: '老師說他「魯」——反應慢。同學抄完三卷，他還在抄第一卷。', char: '還', nth: 0, reading: 'ㄏㄞˊ' },
  { id: 's5-1', spoken: '有一天上課，孔子放下竹簡，忽然轉頭。', char: '轉', nth: 0, reading: 'ㄓㄨㄢˇ' },
  { id: 's6-2', spoken: '增深幾乎沒有停頓。孔子微笑點點頭，什麼也沒多說，就走出了講堂。', char: '幾', nth: 0, reading: 'ㄐㄧ' },
  { id: 's6-2', spoken: '增深幾乎沒有停頓。孔子微笑點點頭，什麼也沒多說，就走出了講堂。', char: '沒', nth: 0, reading: 'ㄇㄟˊ' },
  { id: 's6-2', spoken: '增深幾乎沒有停頓。孔子微笑點點頭，什麼也沒多說，就走出了講堂。', char: '沒', nth: 1, reading: 'ㄇㄟˊ' },
  { id: 's7-3', spoken: '你都聽懂了喔？', char: '都', nth: 0, reading: 'ㄉㄡ' },
  { id: 's7-4', spoken: '老師只說「有一個」，沒說「是什麼」；增深只回一個字。兩個人像在打啞謎。', char: '只', nth: 0, reading: 'ㄓˇ' },
  { id: 's7-4', spoken: '老師只說「有一個」，沒說「是什麼」；增深只回一個字。兩個人像在打啞謎。', char: '沒', nth: 0, reading: 'ㄇㄟˊ' },
  { id: 's7-4', spoken: '老師只說「有一個」，沒說「是什麼」；增深只回一個字。兩個人像在打啞謎。', char: '只', nth: 1, reading: 'ㄓˇ' },
  { id: 's8-2', spoken: '對自己，盡心——分組報告，做好自己那一頁。', char: '分', nth: 0, reading: 'ㄈㄣ' },
  { id: 's8-3', spoken: '對別人，將心比心——不想被已讀不回，就不要已讀不回別人。', char: '將', nth: 0, reading: 'ㄐㄧㄤ' },
  { id: 's9-1', spoken: '你的生活裡，有沒有一條可以把所有事情串起來的線？', char: '沒', nth: 0, reading: 'ㄇㄟˊ' },
];

// 還沒人聽過的(目前沒有)
export const pendingListen = [
];

// 核准使用 say 的句子(每句都經使用者試聽確認);新增 say 必須先登記在這裡
export const sayApproved = [
  { id: 's1-1', why: '數→暑(數不清,ㄕㄨˇ)' },
  { id: 's2-2', why: '教→交(動詞教導,ㄐㄧㄠ)' },
  { id: 's3-1', why: '曾參→增深' },
  { id: 's4-3', why: '教→交(動詞教導,ㄐㄧㄠ)' },
  { id: 's5-2', why: '參→深' },
  { id: 's6-2', why: '曾參→增深' },
  { id: 's7-4', why: '曾參→增深' },
];
