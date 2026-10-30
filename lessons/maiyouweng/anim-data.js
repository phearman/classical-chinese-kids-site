// 〈賣油翁〉動畫故事資料(單一資料來源)。依 lessons/maiyouweng/storyboard.md 六幕,總長 122 秒。
// 角色圖:使用者 2026-10-30 挑定陳堯咨 A、賣油翁 B、歐陽修 A,另有補姿勢(shared/characters/*.webp);背景與道具為程式繪製。
// 旁白、字幕皆為本站自行撰寫,原文字卡依維基文庫〈賣油翁〉revid 5978987。情節照原文,不另加虛構事件。
//
// scene:bg 背景、card 畫面字卡、lines 旁白(at=幕內第幾秒;role 決定朗讀聲調;say=選填朗讀用文字)、
//        items 畫面元件:actor 角色 / text 浮字 / prop 道具(見 animation.js 的 PROPS)
// 位置一律用舞台百分比:x=水平中心、y=底部(角色)或中心(文字與道具),h=角色高度。
// 安全處理(storyboard.md):箭只射草靶,賣油翁站在射手後方、不在射線上;「忿然」只畫鼓臉叉腰。

export const animMeta = {
  title: '動畫故事：賣油翁',
  note: '旁白依原文改寫成白話；情節照原文。',
};

const TW = '請用台灣華語(繁體中文、台灣口音)朗讀。';
export const roles = {
  narrator: { label: '旁白', pitch: 1, rate: 0.95, tts: { voice: 'ash', instructions: `${TW}語氣活潑、有精神,像在說故事給國中生聽。` } },
  chen: { label: '陳堯咨', pitch: 1.05, rate: 1.05, voice: 'male', tts: { voice: 'echo', instructions: `${TW}年輕、自信、有點得意的男性官員。` } },
  oil: { label: '賣油翁', pitch: 0.85, rate: 0.85, voice: 'male', tts: { voice: 'onyx', instructions: `${TW}平靜、和氣、慢慢說話的老人。` } },
};

export const scenes = [
  {
    id: 's1', title: '神射手', duration: 18, bg: 'garden',
    card: '陳康肅公堯咨善射，當世無雙，公亦以此自矜。',
    lines: [
      { at: 1, role: 'narrator', text: '北宋有一位神射手，名叫陳堯咨。' },
      { at: 6, role: 'narrator', text: '他射箭的本事，那時候沒有人比得上。' },
      { at: 12, role: 'chen', text: '你們看，我又射到紅心！' },
    ],
    items: [
      { kind: 'text', text: '歐陽修《歸田錄》', x: 64, y: 38, size: 4.5, anim: 'fade', cls: 'title' },
      { kind: 'prop', name: 'target', x: 86, y: 58 },
      { kind: 'actor', who: 'chenyaozi-shoot', x: 40, y: 96, h: 62 },
    ],
  },
  {
    id: 's2', title: '路過的老人', duration: 18, bg: 'garden',
    card: '嘗射於家圃，有賣油翁釋擔而立，睨之，久而不去。',
    lines: [
      { at: 1, role: 'narrator', text: '有一天，他在自己家的園子裡練射箭。' },
      { at: 6, role: 'narrator', text: '一位賣油的老人經過，放下擔子，站在旁邊。' },
      { at: 12, role: 'narrator', text: '老人斜著眼睛看，看了很久，都不走。' },
    ],
    items: [
      { kind: 'prop', name: 'target', x: 86, y: 58 },
      { kind: 'actor', who: 'chenyaozi-shoot', x: 50, y: 96, h: 62 },
      { kind: 'actor', who: 'maiyouweng', x: 16, y: 96, h: 54, anim: 'fade', delay: 6 }, // 站在射手後方,不在射線上
    ],
  },
  {
    id: 's3', title: '只是點點頭', duration: 16, bg: 'garden',
    card: '見其發矢十中八九，但微頷之。',
    lines: [
      { at: 1, role: 'narrator', text: '十支箭裡，有八、九支射到靶上。' },
      { at: 8, role: 'narrator', text: '老人卻只是輕輕點一下頭。' },
    ],
    items: [
      { kind: 'prop', name: 'tally', x: 78, y: 30 }, // 十支箭:九支射到(實心)、一支沒射到(虛線)
      { kind: 'prop', name: 'target', x: 86, y: 58 },
      { kind: 'actor', who: 'chenyaozi', x: 52, y: 96, h: 62 },
      { kind: 'actor', who: 'maiyouweng-nod', x: 18, y: 96, h: 54, anim: 'nod', delay: 8 },
    ],
  },
  {
    id: 's4', title: '一問一答', duration: 22, bg: 'garden',
    card: '康肅問曰：「汝亦知射乎？吾射不亦精乎？」翁曰：「無他，但手熟爾。」康肅忿然曰：「爾安敢輕吾射！」',
    lines: [
      { at: 1, role: 'chen', text: '老人家，你也懂射箭嗎？我射箭的本事，難道不高明嗎？' },
      { at: 9, role: 'oil', text: '沒有什麼別的，只不過是手法熟練罷了。' },
      { at: 15, role: 'chen', text: '你怎麼敢看不起我射箭的本事！' },
    ],
    items: [
      { kind: 'actor', who: 'maiyouweng-nod', x: 26, y: 96, h: 54 },
      { kind: 'actor', who: 'chenyaozi', x: 66, y: 96, h: 62, anim: 'fadeOut', delay: 15 },
      { kind: 'actor', who: 'chenyaozi-pout', x: 66, y: 96, h: 62, anim: 'pop', delay: 15 }, // 鼓臉叉腰:短暫不高興,不拿弓指人
    ],
  },
  {
    id: 's5', title: '酌油', duration: 26, bg: 'garden',
    card: '翁曰：「以我酌油知之。」乃取一葫蘆置於地，以錢覆其口，徐以杓酌油瀝之，自錢孔入而錢不濕。',
    lines: [
      { at: 1, role: 'oil', text: '你看我倒油，就明白了。' },
      { at: 6, role: 'narrator', text: '老人把葫蘆放在地上，用一枚銅錢蓋住葫蘆口。' },
      { at: 13, role: 'narrator', text: '再用勺子慢慢舀油，細細的一條油線，全從錢中間的方孔流進葫蘆。' },
      { at: 21, role: 'narrator', text: '銅錢一點也沒有沾到油！' },
    ],
    items: [
      { kind: 'actor', who: 'maiyouweng-pour', x: 30, y: 96, h: 46 },
      { kind: 'actor', who: 'chenyaozi', x: 80, y: 96, h: 62 },
      { kind: 'prop', name: 'coinlens', x: 56, y: 60, anim: 'fade', delay: 12 }, // 圓形特寫:油線穿過方孔,錢面乾淨
    ],
  },
  {
    id: 's6', title: '手熟爾', duration: 22, bg: 'garden',
    card: '因曰：「我亦無他，惟手熟爾。」康肅笑而遣之。',
    lines: [
      { at: 1, role: 'oil', text: '我也沒有什麼別的，只不過是手法熟練罷了。' },
      { at: 7, role: 'narrator', text: '陳堯咨笑了，揮揮手，讓老人離開。' },
      { at: 12, role: 'narrator', text: '再厲害的本事，背後都是一次又一次的練習；有本事，也不必驕傲。' },
    ],
    items: [
      { kind: 'actor', who: 'maiyouweng', x: 18, y: 96, h: 54, anim: 'fadeOut', delay: 9 },
      { kind: 'actor', who: 'chenyaozi-wave', x: 44, y: 96, h: 62, anim: 'pop', delay: 7 },
      { kind: 'text', text: '熟能生巧', x: 18, y: 50, size: 6.5, anim: 'pop', delay: 12, cls: 'stamp' },
      { kind: 'actor', who: 'ouyangxiu', x: 88, y: 96, h: 34, anim: 'fade', delay: 16 },
      { kind: 'text', text: '歐陽修說：這和莊子的庖丁解牛、輪扁斲輪，是同一個道理。', x: 78, y: 46, size: 5, anim: 'fade', delay: 16, cls: 'panel' },
    ],
  },
];

// 朗讀用同音字對照(本課沒有用 say;旁白已改寫避開難念的多音字)
export const sayReplacements = {};
export const sayApproved = [];

// ---------------------------------------------------------------- 讀音防呆(比照前幾課)
// 以實際朗讀的句子為準:句子裡每個多音字都要登記讀音(依教育部《重編國語辭典修訂本》)。
export const polyphones = [
  '參', '曾', '教', '省', '樂', '行', '重', '長', '為', '少', '好', '看', '了', '得', '和',
  '數', '當', '還', '卷', '應', '轉', '幾', '沒', '分', '將', '都', '只',
  '要', '說', '會', '中', '射', '擔', '熟', '著', '倒', '難',
];

export const readingChecked = [];

// 還沒人聽過的(本課旁白全部待使用者試聽;讀音依教育部辭典)— 由 scripts 外的一次性產生器依 lines 產生,句子一改就要重產
export const pendingListen = [
  { id: 's1-1', spoken: '北宋有一位神射手，名叫陳堯咨。', char: '射', nth: 0, reading: 'ㄕㄜˋ' },
  { id: 's1-2', spoken: '他射箭的本事，那時候沒有人比得上。', char: '射', nth: 0, reading: 'ㄕㄜˋ' },
  { id: 's1-2', spoken: '他射箭的本事，那時候沒有人比得上。', char: '沒', nth: 0, reading: 'ㄇㄟˊ' },
  { id: 's1-2', spoken: '他射箭的本事，那時候沒有人比得上。', char: '得', nth: 0, reading: 'ㄉㄜ˙' },
  { id: 's1-3', spoken: '你們看，我又射到紅心！', char: '看', nth: 0, reading: 'ㄎㄢˋ' },
  { id: 's1-3', spoken: '你們看，我又射到紅心！', char: '射', nth: 0, reading: 'ㄕㄜˋ' },
  { id: 's2-1', spoken: '有一天，他在自己家的園子裡練射箭。', char: '射', nth: 0, reading: 'ㄕㄜˋ' },
  { id: 's2-2', spoken: '一位賣油的老人經過，放下擔子，站在旁邊。', char: '擔', nth: 0, reading: 'ㄉㄢˋ' },
  { id: 's2-3', spoken: '老人斜著眼睛看，看了很久，都不走。', char: '著', nth: 0, reading: 'ㄓㄜ˙' },
  { id: 's2-3', spoken: '老人斜著眼睛看，看了很久，都不走。', char: '看', nth: 0, reading: 'ㄎㄢˋ' },
  { id: 's2-3', spoken: '老人斜著眼睛看，看了很久，都不走。', char: '看', nth: 1, reading: 'ㄎㄢˋ' },
  { id: 's2-3', spoken: '老人斜著眼睛看，看了很久，都不走。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's2-3', spoken: '老人斜著眼睛看，看了很久，都不走。', char: '都', nth: 0, reading: 'ㄉㄡ' },
  { id: 's3-1', spoken: '十支箭裡，有八、九支射到靶上。', char: '射', nth: 0, reading: 'ㄕㄜˋ' },
  { id: 's3-2', spoken: '老人卻只是輕輕點一下頭。', char: '只', nth: 0, reading: 'ㄓˇ' },
  { id: 's4-1', spoken: '老人家，你也懂射箭嗎？我射箭的本事，難道不高明嗎？', char: '射', nth: 0, reading: 'ㄕㄜˋ' },
  { id: 's4-1', spoken: '老人家，你也懂射箭嗎？我射箭的本事，難道不高明嗎？', char: '射', nth: 1, reading: 'ㄕㄜˋ' },
  { id: 's4-1', spoken: '老人家，你也懂射箭嗎？我射箭的本事，難道不高明嗎？', char: '難', nth: 0, reading: 'ㄋㄢˊ' },
  { id: 's4-2', spoken: '沒有什麼別的，只不過是手法熟練罷了。', char: '沒', nth: 0, reading: 'ㄇㄟˊ' },
  { id: 's4-2', spoken: '沒有什麼別的，只不過是手法熟練罷了。', char: '只', nth: 0, reading: 'ㄓˇ' },
  { id: 's4-2', spoken: '沒有什麼別的，只不過是手法熟練罷了。', char: '熟', nth: 0, reading: 'ㄕㄨˊ' },
  { id: 's4-2', spoken: '沒有什麼別的，只不過是手法熟練罷了。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's4-3', spoken: '你怎麼敢看不起我射箭的本事！', char: '看', nth: 0, reading: 'ㄎㄢˋ' },
  { id: 's4-3', spoken: '你怎麼敢看不起我射箭的本事！', char: '射', nth: 0, reading: 'ㄕㄜˋ' },
  { id: 's5-1', spoken: '你看我倒油，就明白了。', char: '看', nth: 0, reading: 'ㄎㄢˋ' },
  { id: 's5-1', spoken: '你看我倒油，就明白了。', char: '倒', nth: 0, reading: 'ㄉㄠˋ' },
  { id: 's5-1', spoken: '你看我倒油，就明白了。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's5-3', spoken: '再用勺子慢慢舀油，細細的一條油線，全從錢中間的方孔流進葫蘆。', char: '中', nth: 0, reading: 'ㄓㄨㄥ' },
  { id: 's5-4', spoken: '銅錢一點也沒有沾到油！', char: '沒', nth: 0, reading: 'ㄇㄟˊ' },
  { id: 's6-1', spoken: '我也沒有什麼別的，只不過是手法熟練罷了。', char: '沒', nth: 0, reading: 'ㄇㄟˊ' },
  { id: 's6-1', spoken: '我也沒有什麼別的，只不過是手法熟練罷了。', char: '只', nth: 0, reading: 'ㄓˇ' },
  { id: 's6-1', spoken: '我也沒有什麼別的，只不過是手法熟練罷了。', char: '熟', nth: 0, reading: 'ㄕㄨˊ' },
  { id: 's6-1', spoken: '我也沒有什麼別的，只不過是手法熟練罷了。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's6-2', spoken: '陳堯咨笑了，揮揮手，讓老人離開。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's6-3', spoken: '再厲害的本事，背後都是一次又一次的練習；有本事，也不必驕傲。', char: '都', nth: 0, reading: 'ㄉㄡ' },
];
