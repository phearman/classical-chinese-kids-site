// 〈賣油翁〉隨堂測驗題庫(單一資料來源)。
// 人看的版本 lessons/maiyouweng/quiz.md 由 scripts/build-quiz-md.js 從這裡產生,⛔ 手改 quiz.md。
// 題目、解析、參考答案皆為本專案自行撰寫,⛔ 參考出版社課本題目;原文依維基文庫〈賣油翁〉(歐陽修《歸田錄》,公有領域古籍)。
//
// category:content=學習內容 / extension=延伸提問 / inquiry=引導式查詢
// type:single 單選 / multi 多選 / truefalse 是非 / fill 漏字填充 / essay 問答 / set 素養題組
// level:elementary 小學 / junior 國中;goal:reading 閱讀 / understanding 理解 / inference 推論 / expression 表達
// 自動判分題(single/multi/truefalse/fill)要有 answer+explanation;不判分題(essay)要有 reference+checklist。
// 引導式查詢題=essay 加 hints(查詢方向與關鍵字,不給答案)。

export const quizMeta = {
  lessonId: 'maiyouweng',
  title: '隨堂測驗：賣油翁',
  storageKey: 'cck:quiz:maiyouweng:v1',
};

export const categories = {
  content: { label: '學習內容', desc: '原文、字詞、句意' },
  extension: { label: '延伸提問', desc: '連結生活與想像' },
  inquiry: { label: '引導式查詢', desc: '先自己查，再回來作答' },
};

export const levels = { elementary: '小學', junior: '國中' };
export const goals = { reading: '閱讀', understanding: '理解', inference: '推論', expression: '表達' };
export const types = { single: '單選', multi: '多選', truefalse: '是非', fill: '漏字填充', essay: '問答', set: '素養題組' };

const SRC = '歐陽修《歸田錄》〈賣油翁〉';
const MOE = '教育部《重編國語辭典修訂本》';

export const questions = [
  // ---------------------------------------------------------------- 學習內容
  {
    id: 'c1', category: 'content', type: 'single', level: 'elementary', goal: 'reading',
    prompt: '「公亦以此自矜」的「自矜」是什麼意思？',
    options: ['自己誇耀、很得意', '自己可憐自己', '自己很害羞', '自己很謹慎'],
    answer: 0,
    explanation: '「自矜」=自己誇耀（矜讀 ㄐㄧㄣ）。陳堯咨很會射箭，自己也因此很得意。',
    source: MOE,
  },
  {
    id: 'c2', category: 'content', type: 'fill', level: 'elementary', goal: 'reading',
    prompt: '把原文填完整：見其發矢十中八九，但微＿之。（1 個字，意思是點頭）',
    answer: '頷', accept: ['頷'],
    explanation: '「微頷之」=微微點點頭（頷讀 ㄏㄢˋ）。賣油翁沒有叫好，只是輕輕點頭。',
    source: SRC,
  },
  {
    id: 'c3', category: 'content', type: 'truefalse', level: 'elementary', goal: 'reading',
    prompt: '「十中八九」的「中」，讀音和「中間」的「中」一樣，讀 ㄓㄨㄥ。',
    answer: false,
    explanation: '不一樣。這裡的「中」是射中，讀 ㄓㄨㄥˋ，和「百發百中」一樣。',
    source: MOE,
  },
  {
    id: 'c4', category: 'content', type: 'single', level: 'elementary', goal: 'understanding',
    prompt: '賣油翁「睨之，久而不去」，最接近下面哪一個意思？',
    options: ['斜著眼睛看，看了很久都沒離開', '瞪著眼睛罵他，罵完就走', '閉上眼睛睡著了', '看了一眼就走開了'],
    answer: 0,
    explanation: '睨=斜著眼睛看；去=離開。「久而不去」=很久都沒有離開。',
    source: SRC,
  },
  {
    id: 'c5', category: 'content', type: 'multi', level: 'junior', goal: 'understanding',
    prompt: '下面哪些句子的「爾」，意思是「罷了」？選出所有正確的。',
    options: ['無他，但手熟爾', '爾安敢輕吾射', '我亦無他，惟手熟爾', '汝亦知射乎'],
    answer: [0, 2],
    explanation: '「但手熟爾」「惟手熟爾」的「爾」在句末，是「罷了」；「爾安敢輕吾射」的「爾」是「你」。「汝亦知射乎」沒有「爾」字，「汝」才是「你」。',
    source: SRC,
  },
  {
    id: 'c6', category: 'content', type: 'fill', level: 'elementary', goal: 'reading',
    prompt: '把原文填完整：乃取一葫蘆置於地，以錢＿其口。（1 個字，意思是蓋住）',
    answer: '覆', accept: ['覆'],
    explanation: '「以錢覆其口」=用一枚銅錢蓋住葫蘆口。覆=遮蓋。',
    source: SRC,
  },
  {
    id: 'c7', category: 'content', type: 'single', level: 'junior', goal: 'inference',
    prompt: '陳堯咨在故事裡的心情，依照順序是哪一個？',
    options: ['得意 → 生氣 → 服氣地笑了', '生氣 → 得意 → 難過', '害怕 → 得意 → 生氣', '難過 → 生氣 → 得意'],
    answer: 0,
    explanation: '一開始「以此自矜」（得意），聽到「但手熟爾」就「忿然」（生氣），看完倒油示範「笑而遣之」（服氣）。',
    source: SRC,
  },
  {
    id: 'c8', category: 'content', type: 'truefalse', level: 'junior', goal: 'reading',
    prompt: '「久而不去」的「去」，意思和現在說的「去學校」一樣，是「前往」。',
    answer: false,
    explanation: '古文的「去」常常是「離開」。「久而不去」=很久都沒有離開。',
    source: SRC,
  },
  {
    id: 'c9', category: 'content', type: 'single', level: 'junior', goal: 'reading',
    prompt: '「自錢孔入而錢不濕」的「自」，意思和下面哪一個相同？',
    options: ['從', '自己', '自然', '自從以後'],
    answer: 0,
    explanation: '「自錢孔入」=從銅錢的孔流進去，「自」是「從」。',
    source: SRC,
  },

  {
    id: 's2', category: 'content', type: 'set', level: 'elementary', goal: 'reading',
    prompt: '閱讀短文，回答問題。',
    passage: [
      '早餐店的阿姨煎蛋餅，一手翻麵皮、一手打蛋，從來不看計時器，每一片都煎得金黃。',
      '小傑看呆了：「阿姨，你是不是有什麼秘訣？」阿姨笑著說：「哪有什麼秘訣，我煎了二十年啦！」',
    ],
    items: [
      {
        id: 's2a', type: 'single', goal: 'understanding',
        prompt: '阿姨的回答，最像原文的哪一句？',
        options: ['無他，但手熟爾', '爾安敢輕吾射', '吾射不亦精乎', '康肅笑而遣之'],
        answer: 0,
        explanation: '阿姨說沒有秘訣、只是煎了很久，就像賣油翁說「沒有別的，只是手法熟練罷了」。',
      },
      {
        id: 's2b', type: 'fill', goal: 'reading',
        prompt: '阿姨的本事可以用一個成語形容：熟能生＿。（1 個字）',
        answer: '巧', accept: ['巧'],
        explanation: '「熟能生巧」=熟練了自然就能找出竅門（教育部辭典），正是〈賣油翁〉的道理。',
      },
      {
        id: 's2c', type: 'truefalse', goal: 'inference',
        prompt: '從短文看，阿姨的本事主要是天生的，不用練習。',
        answer: false,
        explanation: '阿姨說「我煎了二十年」，本事是長時間練出來的，和賣油翁一樣。',
      },
    ],
  },

  // ---------------------------------------------------------------- 延伸提問
  {
    id: 'e1', category: 'extension', type: 'single', level: 'elementary', goal: 'understanding',
    prompt: '〈賣油翁〉的道理，最適合用哪一個成語來說？',
    options: ['熟能生巧', '畫蛇添足', '守株待兔', '杯弓蛇影'],
    answer: 0,
    explanation: '射箭和倒油的本事，都是因為練得很熟——熟能生巧。',
    source: SRC,
  },
  {
    id: 'e2', category: 'extension', type: 'essay', level: 'elementary', goal: 'expression',
    prompt: '你有沒有一件事，是一開始不會、練到「手熟」以後才變厲害的？寫一段 60 字左右的短文，說說你怎麼練。',
    reference: '（示例）我剛學跳繩時一下就絆到腳。後來每天放學跳一百下，跳了一個月，現在可以連跳兩百下不斷，還學會了交叉跳。原來厲害不是天生的，是一下一下練出來的。',
    checklist: [
      '寫出一件具體的事',
      '說出練習的方法或練了多久',
      '寫出練熟之前和之後的差別',
    ],
  },
  {
    id: 'e3', category: 'extension', type: 'multi', level: 'junior', goal: 'inference',
    prompt: '賣油翁沒有和陳堯咨吵架，而是當場倒油給他看。這樣做有哪些好處？選出所有合理的說法。',
    options: ['用事實說話，比爭辯更有說服力', '沒有讓衝突變大', '證明射箭一點也不難', '讓陳堯咨自己想通「熟能生巧」的道理'],
    answer: [0, 1, 3],
    explanation: '倒油示範讓陳堯咨親眼看到「熟練」的力量，衝突也就化解了。賣油翁沒有說射箭不難，只是說本事來自熟練。',
    source: SRC,
  },
  {
    id: 'e4', category: 'extension', type: 'essay', level: 'junior', goal: 'expression',
    prompt: '如果你是陳堯咨，努力練習多年，卻被人說「但手熟爾」，你會怎麼想？讀完整個故事以後，你的想法有沒有改變？',
    reference: '一開始會不服氣，覺得自己的努力被說得很簡單。可是看完賣油翁倒油，會明白他不是看不起人，而是說：任何本事都要靠長期練習。「手熟」其實就是努力的成果，所以也不必太驕傲。',
    checklist: [
      '說出一開始的感受',
      '說出讀完故事後的想法',
      '提到「熟練來自練習」或「不必驕傲」',
    ],
  },
  {
    id: 's1', category: 'extension', type: 'set', level: 'junior', goal: 'inference',
    prompt: '閱讀短文，回答問題。',
    passage: [
      '班際籃球賽前，小宇連投進五顆三分球，得意地說：「我天生就是投籃高手！」',
      '教練笑著說：「你每天早上自己來球場投一百球，我都看到了。這不是天生，是練出來的。」',
    ],
    items: [
      {
        id: 's1a', type: 'single', goal: 'understanding',
        prompt: '小宇「得意地說」，最像陳堯咨的哪一個表現？',
        options: ['以此自矜', '笑而遣之', '釋擔而立', '微頷之'],
        answer: 0,
        explanation: '「以此自矜」=因為這一點而自己誇耀，和小宇得意的樣子很像。',
      },
      {
        id: 's1b', type: 'truefalse', goal: 'inference',
        prompt: '教練說的話，和賣油翁的道理一樣：本事是靠反覆練習得來的。',
        answer: true,
        explanation: '教練說小宇每天投一百球，本事是練出來的——就是賣油翁說的「手熟」。',
      },
      {
        id: 's1c', type: 'essay', goal: 'expression',
        prompt: '如果你是小宇，聽完教練的話，你會怎麼回答？',
        reference: '我會說：「謝謝教練提醒！原來投得準是因為每天練，不是天生的。我會繼續練，也不要太得意。」',
        checklist: [
          '回應教練的話',
          '說出「練習」或「不驕傲」的想法',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- 引導式查詢
  {
    id: 'i1', category: 'inquiry', type: 'essay', level: 'junior', goal: 'understanding',
    prompt: '原文最後一句說：「此與莊生所謂『解牛』『斵輪』者何異。」查一查「庖丁解牛」的故事：庖丁是做什麼的？他的刀為什麼用了很久還很鋒利？',
    hints: {
      direction: '到維基文庫找《莊子》的〈養生主〉篇讀原文，也可以用教育部《成語典》查「庖丁解牛」。',
      keywords: ['庖丁解牛', '莊子', '養生主'],
    },
    reference: '庖丁是廚師，替文惠君分解牛。他熟悉牛的身體構造，刀子順著骨頭和筋肉之間的空隙走，不去硬砍骨頭，所以一把刀用了十九年、分解過幾千頭牛，刀刃還像剛磨過一樣。這和賣油翁一樣，都是練到非常熟練。',
    checklist: [
      '說出庖丁是廚師、在分解牛',
      '說出刀順著空隙走、不硬砍，所以不會鈍',
      '把庖丁和賣油翁的「熟練」連起來',
    ],
    source: '《莊子‧養生主》',
  },
  {
    id: 'i2', category: 'inquiry', type: 'essay', level: 'elementary', goal: 'reading',
    prompt: '歐陽修晚年自號「六一居士」。查一查：「六一」是哪六個「一」？',
    hints: {
      direction: '到維基文庫搜尋歐陽修自己寫的〈六一居士傳〉，看客人問「六一，何謂也」時他怎麼回答。',
      keywords: ['六一居士傳', '歐陽修', '六一'],
    },
    reference: '家裡藏書一萬卷、收集的古代金石文字一千卷、琴一張、棋一局、常常放著的酒一壺，這是五個「一」；再加上歐陽修自己這一個老翁，就是「六一」。',
    checklist: [
      '說出書、金石文字、琴、棋、酒五樣東西',
      '說出第六個「一」是歐陽修自己',
      '說出資料出處是〈六一居士傳〉',
    ],
    source: '歐陽修〈六一居士傳〉',
  },
  {
    id: 'i3', category: 'inquiry', type: 'essay', level: 'junior', goal: 'inference',
    prompt: '陳堯咨真的很會射箭嗎？查一查《宋史》怎麼記載他的射箭本事，再想一想：為什麼歐陽修要選他來說「熟能生巧」？',
    hints: {
      direction: '到維基文庫打開《宋史》，在他哥哥陳堯叟的傳記後面找「堯咨」那一段，看寫到射箭的句子。',
      keywords: ['宋史', '陳堯咨', '善射'],
    },
    reference: '《宋史》說他「善射，嘗以錢為的，一發貫其中」：曾經把銅錢當靶子，一箭射穿錢的中間。他是真正的神射手，所以連他的本事都被說成「手熟」，「熟能生巧」的道理就更有說服力。',
    checklist: [
      '找到《宋史》寫他善射的句子',
      '用自己的話說出那句的意思',
      '說明選一位真正的高手來講道理，更有說服力',
    ],
    source: '《宋史‧陳堯叟傳》附弟堯咨',
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
