// 〈兒時記趣〉動畫故事資料(單一資料來源)。依 lessons/ershi-jiqu/storyboard.md 七幕,總長 120 秒。
// 角色圖:使用者 2026-10-20 挑定孩童沈復 B、癩蝦蟆 B(shared/characters/*.webp);成年沈復待第 3 批;背景與道具為程式繪製。
// 旁白、字幕皆為本站自行撰寫,原文字卡依維基文庫〈浮生六記/卷二 閑情記趣〉。情節為教學改編。
//
// scene:bg 背景(paper/night/garden)、card 畫面字卡、lines 旁白(at=幕內第幾秒出現;role 決定朗讀聲調;
//        say=選填的朗讀用文字)、items 畫面元件:actor 角色 / text 浮字 / prop 道具(見 animation.js 的 PROPS)
// 位置一律用舞台百分比:x=水平中心、y=底部(角色)或中心(文字),h=角色高度。
// 安全處理(CPM 核准):第 1 幕「⚠ 不要直視太陽」;第 7 幕只畫揮動細竹枝、不畫打到,收尾「觀察動物，不傷害牠」。

export const animMeta = {
  title: '動畫故事：兒時記趣',
  note: '情節為教學改編；旁白依原文改寫成白話。',
};

const TW = '請用台灣華語(繁體中文、台灣口音)朗讀。';
export const roles = {
  narrator: { label: '旁白', pitch: 1, rate: 0.95, tts: { voice: 'ash', instructions: `${TW}語氣活潑、有精神,像在說故事給國中生聽。` } },
  // 小沈復(WY28):使用者三星手機聽「應該用童聲,目前有點沙啞」。內建朗讀沒有童聲,pitch 拉太高會沙啞、有機器感,
  // 改挑女聲再小幅拉高(pitch ⛔ 超過 1.2,測試把關);AI 配音用較明亮的 nova。
  shenfu: { label: '小沈復', pitch: 1.15, rate: 1.05, voice: 'female', tts: { voice: 'nova', instructions: `${TW}七、八歲男孩的童聲,聲音清亮、天真、好奇,說話輕快。` } },
};

export const scenes = [
  {
    id: 's1', title: '回想', duration: 12, bg: 'paper',
    card: '余憶童稚時，能張目對日，明察秋毫。',
    lines: [
      { at: 1, role: 'narrator', text: '清朝有個叫沈復的人，長大後寫書，回想自己小時候。' },
      { at: 6, role: 'narrator', text: '他說小時候眼力超好，能對著太陽看。千萬不要學，會傷眼睛！' },
    ],
    items: [
      { kind: 'prop', name: 'sun', x: 72, y: 34 },
      { kind: 'actor', who: 'shenfu-adult', x: 32, y: 96, h: 60, anim: 'fade' }, // 長大後的沈復伏案寫書,回想小時候
      { kind: 'text', text: '⚠ 不要直視太陽', x: 72, y: 66, size: 5, anim: 'pop', delay: 6, cls: 'warn' },
    ],
  },
  {
    id: 's2', title: '細看', duration: 14, bg: 'garden',
    card: '見藐小微物，必細察其紋理，故時有物外之趣。',
    lines: [
      { at: 1, role: 'narrator', text: '他看到很小的東西，一定蹲下來，仔細看上面的紋路。' },
      { at: 7, role: 'shenfu', text: '原來葉子上，有這麼多細細的線！' },
    ],
    items: [
      { kind: 'actor', who: 'shenfu-crouch', x: 28, y: 96, h: 42 },
      { kind: 'prop', name: 'leaf', x: 66, y: 52 },
      { kind: 'text', text: '物外之趣', x: 66, y: 86, size: 6, anim: 'fade', delay: 10, cls: 'stamp' },
    ],
  },
  {
    id: 's3', title: '蚊成鶴', duration: 20, bg: 'night',
    card: '夏蚊成雷，私擬作群鶴舞空，心之所向，則或千或百，果然鶴也。昂首觀之，項為之強。',
    lines: [
      { at: 1, role: 'narrator', text: '夏天晚上，蚊子嗡嗡叫，吵得像打雷。' },
      { at: 6, role: 'shenfu', text: '我把牠們想成一群白鶴，在天上跳舞！' },
      { at: 13, role: 'narrator', text: '他抬頭看了好久，脖子都僵了。' },
    ],
    items: [
      { kind: 'prop', name: 'mosquitoes', x: 64, y: 56 },
      { kind: 'prop', name: 'cranes', x: 64, y: 52, anim: 'fade', delay: 6 },
      { kind: 'actor', who: 'shenfu', x: 24, y: 96, h: 58, anim: 'slowBob' },
    ],
  },
  {
    id: 's4', title: '帳中雲鶴', duration: 18, bg: 'night',
    card: '又留蚊於素帳中，徐噴以煙，使其沖煙飛鳴，作青雲白鶴觀，果如鶴唳雲端，為之怡然稱快。',
    lines: [
      { at: 1, role: 'narrator', text: '他把蚊子留在白色蚊帳裡，慢慢吹進一點煙。' },
      { at: 8, role: 'shenfu', text: '你看！白鶴飛在青雲裡，還會叫呢！' },
    ],
    items: [
      { kind: 'prop', name: 'net', x: 62, y: 64 },
      { kind: 'prop', name: 'smoke', x: 62, y: 68, anim: 'fade', delay: 2 },
      { kind: 'prop', name: 'cloud', x: 62, y: 52, anim: 'fade', delay: 5 },
      { kind: 'prop', name: 'cranes', x: 62, y: 50, anim: 'fade', delay: 8 },
      { kind: 'actor', who: 'shenfu', x: 16, y: 96, h: 52, anim: 'slowBob', delay: 8 },
    ],
  },
  {
    id: 's5', title: '草叢森林', duration: 20, bg: 'garden',
    card: '又常於土牆凹凸處、花臺小草叢雜處，蹲其身，使與臺齊。定神細視，以叢草為林，以蟲蟻為獸，以土礫凸者為丘，凹者為壑，神遊其中，怡然自得。',
    lines: [
      { at: 1, role: 'narrator', text: '他又蹲在花臺旁，讓眼睛跟花臺一樣高。' },
      { at: 7, role: 'shenfu', text: '草叢是森林，螞蟻是野獸，土塊是高山！' },
      { at: 14, role: 'narrator', text: '他想像自己在裡面遊玩，開心極了。' },
    ],
    items: [
      // WY33:先近看真實的小草叢、螞蟻、土粒,第 7、8、9 秒一樣一樣變成想像的森林、野獸、山丘(印章標在變身後的位置)
      { kind: 'prop', name: 'zoomGarden', x: 50, y: 50 },
      { kind: 'actor', who: 'shenfu-crouch', x: 18, y: 96, h: 40 },
      { kind: 'text', text: '林', x: 50, y: 93, size: 6, anim: 'pop', delay: 7.6, cls: 'stamp' },
      { kind: 'text', text: '獸', x: 74, y: 93, size: 6, anim: 'pop', delay: 8.6, cls: 'stamp' },
      { kind: 'text', text: '丘', x: 92, y: 93, size: 6, anim: 'pop', delay: 9.6, cls: 'stamp' },
    ],
  },
  {
    id: 's6', title: '怪獸登場', duration: 22, bg: 'garden',
    card: '一日，見二蟲鬥草間，觀之，興正濃，忽有龐然大物，拔山倒樹而來，蓋一癩蝦蟆也。舌一吐而二蟲盡為所吞。',
    lines: [
      { at: 1, role: 'narrator', text: '有一天，兩隻小蟲在草叢裡打架。' },
      { at: 6, role: 'narrator', text: '忽然地面一震，一個巨大的東西衝了過來！' },
      { at: 12, role: 'narrator', text: '原來是一隻大蟾蜍，舌頭一伸，兩隻蟲都不見了。' },
      { at: 18, role: 'shenfu', text: '呀！' },
    ],
    items: [
      // WY29:甲蟲打架、蝦蟆從右邊跳進來、伸舌吞蟲,整段畫在同一個鋪滿舞台的道具裡(和小沈復不重疊)
      { kind: 'prop', name: 'toadAttack', x: 50, y: 50 },
      { kind: 'actor', who: 'shenfu', x: 18, y: 96, h: 48, delay: 0 },
      { kind: 'text', text: '！', x: 30, y: 56, size: 10, anim: 'pop', delay: 18, cls: 'mark' },
    ],
  },
  {
    id: 's7', title: '驅之別院', duration: 22, bg: 'garden',
    card: '余年幼，方出神，不覺呀然驚恐，神定，捉蝦蟆，鞭數十，驅之別院。',
    lines: [
      { at: 1, role: 'narrator', text: '他嚇了一跳，回過神來，捉住蟾蜍，打了牠幾十下，再把牠趕到別的院子去。' },
      { at: 8, role: 'narrator', text: '這是古人小時候的做法。我們觀察動物，看就好，不要傷害牠。' },
      { at: 15, role: 'narrator', text: '用心觀察，再加上想像，平凡的小東西也能帶來物外之趣。' },
    ],
    items: [
      { kind: 'actor', who: 'shenfu-twig', x: 30, y: 96, h: 56, anim: 'nod', delay: 1 }, // 手拿細竹枝、驚訝後退;只做小幅晃動,不畫打到
      { kind: 'actor', who: 'toad', x: 76, y: 96, h: 40, anim: 'hopOut', delay: 4 },
      { kind: 'text', text: '觀察動物，不傷害牠', x: 70, y: 62, size: 5, anim: 'fade', delay: 8, cls: 'panel' },
    ],
  },
];

// 朗讀用同音字對照(本課沒有用 say;旁白已改寫避開難念的多音字)
export const sayReplacements = {};
export const sayApproved = [];

// ---------------------------------------------------------------- 讀音防呆(比照第 4 課)
// 以實際朗讀的句子為準:句子裡每個多音字都要登記讀音(依教育部《重編國語辭典修訂本》)。
export const polyphones = [
  '參', '曾', '教', '省', '樂', '行', '重', '長', '為', '少', '好', '看', '了', '得', '和',
  '數', '當', '還', '卷', '應', '轉', '幾', '沒', '分', '將', '都', '只',
  '要', '說', '強', '觀', '興', '處', '蓋', '覺', '呀', '會', '蛤', '蝦',
];

export const readingChecked = [];

// 還沒人聽過的(本課旁白全部待使用者試聽;讀音依教育部辭典)
export const pendingListen = [
  { id: 's1-1', spoken: '清朝有個叫沈復的人，長大後寫書，回想自己小時候。', char: '長', nth: 0, reading: 'ㄓㄤˇ' },
  { id: 's1-2', spoken: '他說小時候眼力超好，能對著太陽看。千萬不要學，會傷眼睛！', char: '說', nth: 0, reading: 'ㄕㄨㄛ' },
  { id: 's1-2', spoken: '他說小時候眼力超好，能對著太陽看。千萬不要學，會傷眼睛！', char: '好', nth: 0, reading: 'ㄏㄠˇ' },
  { id: 's1-2', spoken: '他說小時候眼力超好，能對著太陽看。千萬不要學，會傷眼睛！', char: '看', nth: 0, reading: 'ㄎㄢˋ' },
  { id: 's1-2', spoken: '他說小時候眼力超好，能對著太陽看。千萬不要學，會傷眼睛！', char: '要', nth: 0, reading: 'ㄧㄠˋ' },
  { id: 's1-2', spoken: '他說小時候眼力超好，能對著太陽看。千萬不要學，會傷眼睛！', char: '會', nth: 0, reading: 'ㄏㄨㄟˋ' },
  { id: 's2-1', spoken: '他看到很小的東西，一定蹲下來，仔細看上面的紋路。', char: '看', nth: 0, reading: 'ㄎㄢˋ' },
  { id: 's2-1', spoken: '他看到很小的東西，一定蹲下來，仔細看上面的紋路。', char: '看', nth: 1, reading: 'ㄎㄢˋ' },
  { id: 's3-1', spoken: '夏天晚上，蚊子嗡嗡叫，吵得像打雷。', char: '得', nth: 0, reading: 'ㄉㄜ˙' },
  { id: 's3-3', spoken: '他抬頭看了好久，脖子都僵了。', char: '看', nth: 0, reading: 'ㄎㄢˋ' },
  { id: 's3-3', spoken: '他抬頭看了好久，脖子都僵了。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's3-3', spoken: '他抬頭看了好久，脖子都僵了。', char: '好', nth: 0, reading: 'ㄏㄠˇ' },
  { id: 's3-3', spoken: '他抬頭看了好久，脖子都僵了。', char: '都', nth: 0, reading: 'ㄉㄡ' },
  { id: 's3-3', spoken: '他抬頭看了好久，脖子都僵了。', char: '了', nth: 1, reading: 'ㄌㄜ˙' },
  { id: 's4-2', spoken: '你看！白鶴飛在青雲裡，還會叫呢！', char: '看', nth: 0, reading: 'ㄎㄢˋ' },
  { id: 's4-2', spoken: '你看！白鶴飛在青雲裡，還會叫呢！', char: '還', nth: 0, reading: 'ㄏㄞˊ' },
  { id: 's4-2', spoken: '你看！白鶴飛在青雲裡，還會叫呢！', char: '會', nth: 0, reading: 'ㄏㄨㄟˋ' },
  { id: 's5-3', spoken: '他想像自己在裡面遊玩，開心極了。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's6-2', spoken: '忽然地面一震，一個巨大的東西衝了過來！', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's6-3', spoken: '原來是一隻大蟾蜍，舌頭一伸，兩隻蟲都不見了。', char: '都', nth: 0, reading: 'ㄉㄡ' },
  { id: 's6-3', spoken: '原來是一隻大蟾蜍，舌頭一伸，兩隻蟲都不見了。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's6-4', spoken: '呀！', char: '呀', nth: 0, reading: 'ㄧㄚ' },
  { id: 's7-1', spoken: '他嚇了一跳，回過神來，捉住蟾蜍，打了牠幾十下，再把牠趕到別的院子去。', char: '了', nth: 0, reading: 'ㄌㄜ˙' },
  { id: 's7-1', spoken: '他嚇了一跳，回過神來，捉住蟾蜍，打了牠幾十下，再把牠趕到別的院子去。', char: '了', nth: 1, reading: 'ㄌㄜ˙' },
  { id: 's7-1', spoken: '他嚇了一跳，回過神來，捉住蟾蜍，打了牠幾十下，再把牠趕到別的院子去。', char: '幾', nth: 0, reading: 'ㄐㄧˇ' },
  { id: 's7-2', spoken: '這是古人小時候的做法。我們觀察動物，看就好，不要傷害牠。', char: '觀', nth: 0, reading: 'ㄍㄨㄢ' },
  { id: 's7-2', spoken: '這是古人小時候的做法。我們觀察動物，看就好，不要傷害牠。', char: '看', nth: 0, reading: 'ㄎㄢˋ' },
  { id: 's7-2', spoken: '這是古人小時候的做法。我們觀察動物，看就好，不要傷害牠。', char: '好', nth: 0, reading: 'ㄏㄠˇ' },
  { id: 's7-2', spoken: '這是古人小時候的做法。我們觀察動物，看就好，不要傷害牠。', char: '要', nth: 0, reading: 'ㄧㄠˋ' },
  { id: 's7-3', spoken: '用心觀察，再加上想像，平凡的小東西也能帶來物外之趣。', char: '觀', nth: 0, reading: 'ㄍㄨㄢ' },
];
