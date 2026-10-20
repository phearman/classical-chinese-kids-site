// 〈兒時記趣〉(第 7 課)隨堂測驗題庫(單一資料來源)。
// 人看的版本 lessons/ershi-jiqu/quiz.md 由 scripts/build-quiz-md.js 從這裡產生,⛔ 手改 quiz.md。
// 題目、解析、參考答案皆為本專案自行撰寫,⛔ 參考出版社課本題目;原文依維基文庫《浮生六記》(公有領域古籍)。
//
// category:content=學習內容 / extension=延伸提問 / inquiry=引導式查詢
// type:single 單選 / multi 多選 / truefalse 是非 / fill 漏字填充 / essay 問答 / set 素養題組
// level:elementary 小學 / junior 國中;goal:reading 閱讀 / understanding 理解 / inference 推論 / expression 表達
// 自動判分題(single/multi/truefalse/fill)要有 answer+explanation;不判分題(essay)要有 reference+checklist。
// 引導式查詢題=essay 加 hints(查詢方向與關鍵字,不給答案)。

export const quizMeta = {
  lessonId: 'ershi-jiqu',
  title: '隨堂測驗：兒時記趣',
  storageKey: 'cck:quiz:ershi-jiqu:v1',
};

export const categories = {
  content: { label: '學習內容', desc: '原文、字詞、句意' },
  extension: { label: '延伸提問', desc: '連結生活與想像' },
  inquiry: { label: '引導式查詢', desc: '先自己查，再回來作答' },
};

export const levels = { elementary: '小學', junior: '國中' };
export const goals = { reading: '閱讀', understanding: '理解', inference: '推論', expression: '表達' };
export const types = { single: '單選', multi: '多選', truefalse: '是非', fill: '漏字填充', essay: '問答', set: '素養題組' };

const SRC = '沈復《浮生六記‧卷二 閒情記趣》';

export const questions = [
  // ---------------------------------------------------------------- 學習內容
  {
    id: 'c1', category: 'content', type: 'single', level: 'elementary', goal: 'reading',
    prompt: '「明察秋毫」的「秋毫」是指什麼？',
    options: ['秋天鳥獸新長出來的細毛', '秋天的天空', '一支毛筆', '秋天的落葉'],
    answer: 0,
    explanation: '秋毫是秋天鳥獸新長的細毛，用來比喻極細小的東西。「明察秋毫」=連很細小的東西都看得清清楚楚（教育部《重編國語辭典修訂本》）。',
    source: SRC,
  },
  {
    id: 'c2', category: 'content', type: 'fill', level: 'elementary', goal: 'reading',
    prompt: '把原文填完整：見藐小微物，必細察其紋理，故時有＿＿之趣。（2 個字）',
    answer: '物外', accept: ['物外'],
    explanation: '「物外之趣」=東西本身以外的樂趣，也就是靠觀察和想像得到的樂趣，是全文的主旨。',
    source: SRC,
  },
  {
    id: 'c3', category: 'content', type: 'single', level: 'junior', goal: 'understanding',
    prompt: '作者說的「物外之趣」，最接近下面哪一種樂趣？',
    options: ['買到很貴的玩具', '把蚊子想像成飛舞的白鶴', '考試考了一百分', '吃到好吃的點心'],
    answer: 1,
    explanation: '蚊子本身沒什麼好玩，好玩的是作者把牠們想成鶴——樂趣來自「東西以外」的想像。',
    source: SRC,
  },
  {
    id: 'c4', category: 'content', type: 'truefalse', level: 'elementary', goal: 'reading',
    prompt: '「昂首觀之，項為之強」的「強」，讀音和「強大」的「強」一樣，讀 ㄑㄧㄤˊ。',
    answer: false,
    explanation: '不一樣。這裡的「強」是僵硬，讀 ㄐㄧㄤˋ。「項為之強」=脖子因此變得僵硬。',
    source: '教育部《重編國語辭典修訂本》',
  },
  {
    id: 'c5', category: 'content', type: 'single', level: 'elementary', goal: 'understanding',
    prompt: '作者在蚊帳裡對蚊子噴煙，是想看到什麼景象？',
    options: ['蚊子被煙燻死', '白鶴飛在青雲裡', '下雨打雷', '螞蟻搬家'],
    answer: 1,
    explanation: '「作青雲白鶴觀」：煙像青雲，蚊子像白鶴，他把這當作白鶴在雲裡飛的景象來看。',
    source: SRC,
  },
  {
    id: 'c6', category: 'content', type: 'multi', level: 'junior', goal: 'understanding',
    prompt: '第三段裡，作者把哪些東西想像成什麼？選出所有正確的配對。',
    options: ['叢草 → 樹林', '蟲蟻 → 野獸', '凸起的土礫 → 小山', '凹下去的地方 → 大海', '花臺 → 城牆'],
    answer: [0, 1, 2],
    explanation: '原文：「以叢草為林，以蟲蟻為獸，以土礫凸者為丘，凹者為壑。」凹下去的地方是「壑」（山谷），不是海；原文沒有把花臺想成城牆。',
    source: SRC,
  },
  {
    id: 'c7', category: 'content', type: 'fill', level: 'elementary', goal: 'reading',
    prompt: '把原文填完整：舌一吐而二蟲盡＿所吞。（1 個字）',
    answer: '為', accept: ['為', '爲'],
    explanation: '「為……所……」表示被動，「盡為所吞」=全部被牠吞下去。這個「為」讀 ㄨㄟˊ。',
    source: SRC,
  },
  {
    id: 'c8', category: 'content', type: 'single', level: 'junior', goal: 'inference',
    prompt: '蛤蟆只是跳進草叢，作者卻寫「拔山倒樹而來」。這樣寫的原因是什麼？',
    options: ['蛤蟆真的把樹推倒了', '在作者的想像裡，草是樹、土塊是山，蛤蟆就像巨大的怪獸', '作者想說蛤蟆很可愛', '那天剛好發生地震'],
    answer: 1,
    explanation: '作者已經「以叢草為林」「以土礫凸者為丘」，所以從這個小世界看出去，蛤蟆就像拔山倒樹的龐然大物——這是誇大的寫法（誇飾）。',
    source: SRC,
  },
  {
    id: 'c9', category: 'content', type: 'truefalse', level: 'junior', goal: 'reading',
    prompt: '「鞭數十」的「數」讀 ㄕㄨˇ，意思是「數一數」。',
    answer: false,
    explanation: '「數」在這裡讀 ㄕㄨˋ，意思是「幾」。「鞭數十」=用鞭子打了幾十下。',
    source: '教育部《重編國語辭典修訂本》',
  },

  {
    id: 's2', category: 'content', type: 'set', level: 'elementary', goal: 'reading',
    prompt: '閱讀短文，回答問題。',
    passage: [
      '下課時，小安趴在操場邊的草地上，臉貼近地面。他說：「你看！這一排小草是熱帶雨林，那隻螞蟻是正在巡邏的大象。」',
      '同學笑他：「那不就是草和螞蟻嗎？」小安說：「是啊，可是這樣看比較好玩。」',
    ],
    items: [
      {
        id: 's2a', type: 'single', goal: 'understanding',
        prompt: '小安「臉貼近地面」，最像原文的哪一句？',
        options: ['蹲其身，使與臺齊', '昂首觀之', '徐噴以煙', '驅之別院'],
        answer: 0,
        explanation: '沈復蹲低身子，讓眼睛和花臺一樣高；小安把臉貼近地面，都是讓自己「變小」來看草叢。',
      },
      {
        id: 's2b', type: 'fill', goal: 'reading',
        prompt: '小安把小草看成雨林，就像原文「以叢草為＿」。（1 個字）',
        answer: '林', accept: ['林'],
        explanation: '「以叢草為林」=把草叢當作樹林。',
      },
      {
        id: 's2c', type: 'truefalse', goal: 'inference',
        prompt: '小安說「這樣看比較好玩」，他得到的就是作者說的「物外之趣」。',
        answer: true,
        explanation: '草和螞蟻本身很普通，好玩的是小安的想像——這正是「物外之趣」。',
      },
    ],
  },

  // ---------------------------------------------------------------- 延伸提問
  {
    id: 'e1', category: 'extension', type: 'single', level: 'elementary', goal: 'understanding',
    prompt: '下面哪一個人，最能體會沈復說的「物外之趣」？',
    options: ['只玩最新的電動，別的都覺得無聊', '看到天花板的水漬，想像成一張世界地圖', '覺得下雨天很煩，什麼都不想做', '只在意東西貴不貴'],
    answer: 1,
    explanation: '把平凡的水漬想像成地圖，和把蚊子想像成鶴一樣，是從平常東西裡找出想像的樂趣。',
    source: SRC,
  },
  {
    id: 'e2', category: 'extension', type: 'essay', level: 'junior', goal: 'expression',
    prompt: '學沈復的方法：挑一樣你每天都會看到、很普通的東西，把它想像成別的東西，寫一段 60 字左右的短文。',
    reference: '（示例）浴室地板的磁磚縫是一條條運河，肥皂泡是航行的小船。我把蓮蓬頭開小，就像下了一場雨，小船順著運河漂向排水孔的大海。',
    checklist: [
      '寫出一樣普通、常見的東西',
      '清楚寫出把它想像成什麼',
      '用了細節（顏色、動作、聲音）讓想像更生動',
    ],
  },
  {
    id: 'e3', category: 'extension', type: 'essay', level: 'elementary', goal: 'expression',
    prompt: '小沈復捉住蛤蟆，「鞭數十，驅之別院」。你覺得他這樣做對嗎？如果是你，會怎麼做？',
    reference: '可以理解小沈復替小蟲抱不平的心情，但蛤蟆吃蟲是牠的天性，不是故意欺負。用鞭子打牠會傷害牠，比較好的做法是在旁邊觀察，或者輕輕把牠移到別的地方，不要傷害動物。',
    checklist: [
      '說出自己同意或不同意，並說明理由',
      '想到蛤蟆吃蟲是天性',
      '提出不傷害動物的做法',
    ],
  },
  {
    id: 'e4', category: 'extension', type: 'multi', level: 'junior', goal: 'inference',
    prompt: '作者「蹲其身，使與臺齊」，再「定神細視」。這樣做有哪些作用？選出所有合理的說法。',
    options: ['讓眼睛跟小草一樣高，看起來就像身在森林裡', '集中精神，才看得到小蟲、螞蟻的動作', '為了躲起來不被大人發現', '讓想像更容易「走進」那個小世界'],
    answer: [0, 1, 3],
    explanation: '蹲低是為了改變觀看的高度，定神是為了看清細節，兩者都讓作者能「神遊其中」。原文沒有說是在躲大人。',
    source: SRC,
  },
  {
    id: 's1', category: 'extension', type: 'set', level: 'junior', goal: 'inference',
    prompt: '閱讀短文，回答問題。',
    passage: [
      '小寶讀完〈兒時記趣〉，興奮地說：「作者能『張目對日』，我也要試試看盯著太陽！」',
      '姊姊連忙阻止他：「不可以！直接看太陽會傷害眼睛。作者那句話是在說自己小時候眼力很好。」',
    ],
    items: [
      {
        id: 's1a', type: 'single', goal: 'understanding',
        prompt: '「能張目對日，明察秋毫」，作者主要想表達什麼？',
        options: ['小時候眼力很好，觀察得很仔細', '大家都應該練習看太陽', '太陽一點也不刺眼', '秋天的太陽比較小'],
        answer: 0,
        explanation: '這兩句是說作者小時候眼力好、看得仔細，為後面「細察其紋理」的觀察做鋪陳。',
      },
      {
        id: 's1b', type: 'truefalse', goal: 'inference',
        prompt: '姊姊阻止小寶是對的：讀古文時，要分清楚作者的誇張說法和真的可以照做的事。',
        answer: true,
        explanation: '「張目對日」是作者誇自己眼力好，不是要讀者模仿。直接看太陽會傷眼睛。',
      },
      {
        id: 's1c', type: 'essay', goal: 'expression',
        prompt: '如果小寶想練習「明察秋毫」的觀察力，你會建議他用什麼安全的方法？',
        reference: '可以用放大鏡觀察葉子的紋路、螞蟻搬東西的樣子，或者每天花幾分鐘仔細看窗外的同一棵樹，記下它的變化。這些方法安全，也能練出看見細節的眼力。',
        checklist: [
          '提出一個安全的觀察方法',
          '說出要觀察的對象或細節',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- 引導式查詢
  {
    id: 'i1', category: 'inquiry', type: 'essay', level: 'elementary', goal: 'reading',
    prompt: '成語「明察秋毫」最早出自哪一本書？原本的句子是什麼？',
    hints: {
      direction: '用教育部《重編國語辭典修訂本》或《成語典》搜尋這個成語，看它舉的出處；也可以到維基文庫找那本書的原文。',
      keywords: ['明察秋毫', '秋毫之末', '梁惠王'],
    },
    reference: '出自《孟子‧梁惠王上》：「明足以察秋毫之末，而不見輿薪。」意思是眼力好到能看清秋天鳥獸細毛的末端，卻看不見一車柴草。後來用「明察秋毫」形容觀察入微。',
    checklist: [
      '說出出處是《孟子》〈梁惠王上〉',
      '說出原句或原句的意思',
      '用自己的話說出成語的意思',
    ],
    source: '《孟子‧梁惠王上》',
  },
  {
    id: 'i2', category: 'inquiry', type: 'essay', level: 'junior', goal: 'understanding',
    prompt: '〈兒時記趣〉選自《浮生六記》。查一查：這本書原本有幾卷？現在留下來的有幾卷？列出至少兩卷的名稱，包含〈閒情記趣〉。',
    hints: {
      direction: '到維基文庫打開《浮生六記》的目錄頁，看各卷的名稱和頁面下方的說明。',
      keywords: ['浮生六記', '閒情記趣', '沈復'],
    },
    reference: '原本有六卷，現在只留下四卷：〈閨房記樂〉〈閒情記趣〉〈坎坷記愁〉〈浪遊記快〉。後兩卷〈中山記歷〉〈養生記道〉已經失傳，後來流傳的版本被學者考證是別人假託的。',
    checklist: [
      '說出原本六卷、現存四卷',
      '說出至少兩卷的名稱（含〈閒情記趣〉）',
      '說出後兩卷失傳或被認為是偽作',
    ],
    source: '維基文庫《浮生六記》目錄',
  },
  {
    id: 'i3', category: 'inquiry', type: 'essay', level: 'junior', goal: 'inference',
    prompt: '文中的「癩蝦蟆」就是我們說的「癩蛤蟆」。查一查：牠和「蟾蜍」是同一種動物嗎？牠吃什麼？',
    hints: {
      direction: '用教育部《重編國語辭典修訂本》查「癩蝦蟆」「蟾蜍」兩個詞，比較釋義；再用圖鑑或百科查牠的食物。',
      keywords: ['癩蝦蟆', '蟾蜍', '兩棲類'],
    },
    reference: '辭典裡「癩蝦蟆」就是蟾蜍的俗稱：皮膚上有很多疙瘩的兩棲動物。牠會用舌頭捕食昆蟲等小動物，所以文中牠一伸舌頭就吞掉了兩隻蟲——這是牠的天性。',
    checklist: [
      '說出癩蝦蟆就是蟾蜍',
      '說出牠吃昆蟲等小動物',
      '把查到的內容和課文「舌一吐而二蟲盡為所吞」連起來',
    ],
    source: '教育部《重編國語辭典修訂本》',
  },
];

// ---------------------------------------------------------------- 判分(純函式,頁面與測試共用)
const strip = (s) => String(s ?? '').replace(/[\s,，、。．.!！?？「」『』:：;；\-]/g, '');

export function gradeItem(q, response) {
  switch (q.type) {
    case 'single': return response === q.answer;
    case 'truefalse': return response === q.answer;
    case 'multi': {
      const a = [...(response ?? [])].sort().join(',');
      return a === [...q.answer].sort().join(',');
    }
    case 'fill': {
      const r = strip(response);
      return r !== '' && q.accept.some((x) => strip(x) === r);
    }
    default: return null; // 不自動判分
  }
}

export const isAutoGraded = (q) => ['single', 'multi', 'truefalse', 'fill'].includes(q.type);

// 攤平題組,方便計分與檢查
export function flatItems(list = questions) {
  return list.flatMap((q) => (q.type === 'set'
    ? q.items.map((it) => ({ ...it, category: q.category, level: q.level, parent: q.id }))
    : [q]));
}
