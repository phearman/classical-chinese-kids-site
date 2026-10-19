// 〈論語選〉(第 4 課)隨堂測驗題庫(單一資料來源)。
// 人看的版本 lessons/lunyu-xuan/quiz.md 由 scripts/build-quiz-md.js 從這裡產生,⛔ 手改 quiz.md。
// 題目、解析、參考答案皆為本專案自行撰寫,⛔ 參考出版社課本題目;原文依維基文庫《論語》等公有領域古籍。
//
// category:content=學習內容 / extension=延伸提問 / inquiry=引導式查詢
// type:single 單選 / multi 多選 / truefalse 是非 / fill 漏字填充 / essay 問答 / set 素養題組
// level:elementary 小學 / junior 國中;goal:reading 閱讀 / understanding 理解 / inference 推論 / expression 表達
// 自動判分題(single/multi/truefalse/fill)要有 answer+explanation;不判分題(essay)要有 reference+checklist。
// 引導式查詢題=essay 加 hints(查詢方向與關鍵字,不給答案)。

export const quizMeta = {
  lessonId: 'lunyu-xuan',
  title: '隨堂測驗：論語選',
  storageKey: 'cck:quiz:lunyu-xuan:v1',
};

export const categories = {
  content: { label: '學習內容', desc: '原文、字詞、句意' },
  extension: { label: '延伸提問', desc: '連結生活與人物' },
  inquiry: { label: '引導式查詢', desc: '先自己查，再回來作答' },
};

export const levels = { elementary: '小學', junior: '國中' };
export const goals = { reading: '閱讀', understanding: '理解', inference: '推論', expression: '表達' };
export const types = { single: '單選', multi: '多選', truefalse: '是非', fill: '漏字填充', essay: '問答', set: '素養題組' };

export const questions = [
  // ---------------------------------------------------------------- 學習內容
  {
    id: 'c1', category: 'content', type: 'single', level: 'elementary', goal: 'reading',
    prompt: '「子游問孝」的「子游」是誰？',
    options: ['孔子自己', '孔子的學生言偃', '曾參（曾子）', '子游是地名'],
    answer: 1,
    explanation: '子游姓言，名偃，字子游，是孔子的學生，比孔子小 45 歲（《史記‧仲尼弟子列傳》）。',
    source: '《論語‧為政》',
  },
  {
    id: 'c2', category: 'content', type: 'fill', level: 'elementary', goal: 'reading',
    prompt: '把原文填完整：不敬，何以＿乎？（1 個字）',
    answer: '別', accept: ['別'],
    explanation: '「何以別乎」=要用什麼來分別呢？別（ㄅㄧㄝˊ）是分別、區別。',
    source: '《論語‧為政》',
  },
  {
    id: 'c3', category: 'content', type: 'single', level: 'junior', goal: 'understanding',
    prompt: '孔子說「至於犬馬，皆能有養」，是想說明什麼？',
    options: ['狗和馬比人還要孝順', '如果只給吃穿、沒有尊敬，就和養狗養馬分不出差別', '家裡應該多養動物', '狗和馬也需要人尊敬'],
    answer: 1,
    explanation: '狗和馬也都有人餵養。只做到「養」，少了「敬」，奉養父母就和養動物沒有分別——所以孔子最後問「不敬，何以別乎？」',
    source: '《論語‧為政》',
  },
  {
    id: 'c4', category: 'content', type: 'truefalse', level: 'elementary', goal: 'reading',
    prompt: '「譬如為山」的「為」和「為人謀」的「為」，讀音相同。',
    answer: false,
    explanation: '不同。「為山」是堆山，「為」讀 ㄨㄟˊ（做）；「為人謀」是替別人辦事，「為」讀 ㄨㄟˋ（替）。',
    source: '教育部《重編國語辭典修訂本》',
  },
  {
    id: 'c5', category: 'content', type: 'single', level: 'elementary', goal: 'reading',
    prompt: '「未成一簣」的「簣」（ㄎㄨㄟˋ）是什麼？',
    options: ['裝土用的竹筐', '一座小山', '一塊大石頭', '一天的時間'],
    answer: 0,
    explanation: '簣是裝土的竹筐。「未成一簣」=只差一筐土就完成了。',
    source: '《論語‧子罕》',
  },
  {
    id: 'c6', category: 'content', type: 'single', level: 'junior', goal: 'inference',
    prompt: '「止，吾止也」「進，吾往也」，孔子最想強調的是什麼？',
    options: ['堆山是很辛苦的工作', '停下來或繼續往前，都是自己決定的', '別人叫你停就要停', '填平地比堆山容易'],
    answer: 1,
    explanation: '兩句都用「吾」（我自己）：停下來是自己停的，往前走也是自己走的：停下或繼續，由自己決定。',
    source: '《論語‧子罕》',
  },
  {
    id: 'c7', category: 'content', type: 'multi', level: 'junior', goal: 'understanding',
    prompt: '曾子每天從哪三方面反省自己？（多選）',
    options: ['替別人辦事有沒有盡心', '和朋友來往有沒有守信用', '老師教的有沒有複習', '今天有沒有吃飽', '考試有沒有考第一'],
    answer: [0, 1, 2],
    explanation: '「為人謀而不忠乎？與朋友交而不信乎？傳不習乎？」三問分別是盡心、守信、複習。',
    source: '《論語‧學而》',
  },
  {
    id: 'c8', category: 'content', type: 'fill', level: 'elementary', goal: 'reading',
    prompt: '把原文填完整：曾子曰：「吾日三＿吾身。」（1 個字）',
    answer: '省', accept: ['省'],
    explanation: '「三省」的「省」讀 ㄒㄧㄥˇ，是檢查、反省；不是省錢的 ㄕㄥˇ。',
    source: '《論語‧學而》',
  },
  {
    id: 'c9', category: 'content', type: 'truefalse', level: 'junior', goal: 'reading',
    prompt: '「是謂能養」的「養」讀 ㄧㄤˋ，意思是晚輩供養長輩。',
    answer: true,
    explanation: '教育部辭典「養（ㄧㄤˋ）」：晚輩供養長輩，例如「奉養父母」。而「犬馬皆能有養」的「養」是飼養，讀 ㄧㄤˇ。',
    source: '教育部《重編國語辭典修訂本》',
  },
  {
    id: 'c10', category: 'content', type: 'single', level: 'elementary', goal: 'reading',
    prompt: '「傳不習乎」的「習」是什麼意思？',
    options: ['複習、練習', '習慣', '學新的東西', '熱鬧'],
    answer: 0,
    explanation: '「傳不習乎」=老師教的學問，有沒有複習呢？習是複習、練習。',
    source: '《論語‧學而》',
  },

  {
    id: 's2', category: 'content', type: 'set', level: 'elementary', goal: 'reading',
    prompt: '閱讀短文，回答問題。',
    passage: [
      '小宇拼一千片的拼圖，只剩最後一片。他說：「好無聊喔，不拼了。」就把拼圖丟在桌上，跑去看電視。',
      '同班的小晴從來沒拼過拼圖，今天打開新的一盒，在空桌上放下了第一片。',
    ],
    items: [
      {
        id: 's2a', type: 'single', goal: 'understanding',
        prompt: '小宇最像第二則裡的哪一句？',
        options: ['未成一簣，止，吾止也', '雖覆一簣，進，吾往也', '傳不習乎', '至於犬馬，皆能有養'],
        answer: 0,
        explanation: '只差最後一片就不拼了，就像堆山只差一筐土就停下來——是「自己停的」。',
      },
      {
        id: 's2b', type: 'fill', goal: 'reading',
        prompt: '小晴放下第一片，就像原文「譬如平地，雖覆一簣，＿，吾往也」。（1 個字）',
        answer: '進', accept: ['進'],
        explanation: '「進，吾往也」=繼續往前做，是我自己往前走的。',
      },
      {
        id: 's2c', type: 'truefalse', goal: 'inference',
        prompt: '照孔子的說法，小宇沒有拼完，是拼圖決定的，不是他自己決定的。',
        answer: false,
        explanation: '小宇是覺得無聊才不拼的。「止，吾止也」：要不要繼續，是自己決定的。',
      },
    ],
  },

  // ---------------------------------------------------------------- 延伸提問
  {
    id: 'e1', category: 'extension', type: 'single', level: 'elementary', goal: 'understanding',
    prompt: '下面哪一個做法，最符合孔子說的「敬」？',
    options: ['每個月給爸媽零用錢，但從來不聊天', '爸媽說話時，放下手機好好聽', '只在意禮物價格，完全不問爸媽需要什麼', '幫爸媽多養一隻狗'],
    answer: 1,
    explanation: '「敬」是心裡尊重、態度上表現出來。只有物質供給，還不足以表現「敬」；放下手機好好聽，才是把爸媽放在心上。',
  },
  {
    id: 'e2', category: 'extension', type: 'essay', level: 'junior', goal: 'expression',
    prompt: '你有沒有做過「只差一簣」就停下來的事？用「止，吾止也」說說當時為什麼停，現在會怎麼做。',
    reference: '例：我練鋼琴檢定曲，只剩最後一頁就放棄了。當時覺得太難、也沒人逼我。現在想想，停下來是「我自己停的」，不能怪曲子太難。下次我會把最後一頁拆成每天練四小節，把剩下的那一筐土倒完。',
    checklist: [
      '說出一件真實的「差一點完成」的事',
      '有用到「是自己停的」這個想法',
      '提出下次具體的做法',
    ],
  },
  {
    id: 'e3', category: 'extension', type: 'essay', level: 'elementary', goal: 'expression',
    prompt: '仿照曾子，幫自己設計每天睡前的三個問題，並說說為什麼選這三個。',
    reference: '例：①今天答應別人的事做到了嗎？②今天有沒有對家人說一句謝謝？③今天學的有沒有複習？選第一個是因為我常忘記答應同學的事；第二個是想對家人有禮貌；第三個是想讓考試前不用熬夜。',
    checklist: [
      '寫出三個問題',
      '問題是可以每天檢查的具體事情',
      '說明選這些問題的理由',
    ],
  },
  {
    id: 'e4', category: 'extension', type: 'multi', level: 'junior', goal: 'inference',
    prompt: '這一課的三則，有哪些共同的精神？（多選）',
    options: ['都強調從自己做起', '都只在講要對父母好', '都要求自己要有真心，也要做到', '三則都是孔子說的話'],
    answer: [0, 2],
    explanation: '問孝講「敬」是自己的心意；為山講「吾止」「吾往」是自己決定；三省是自己檢查自己——都從自己做起，也要真心做到。只有第一則講父母；第三則是曾子說的，不是孔子。',
  },

  {
    id: 's1', category: 'extension', type: 'set', level: 'junior', goal: 'inference',
    prompt: '閱讀短文，回答問題。',
    passage: [
      '小安每天放學都幫奶奶倒水、端飯，從沒漏過一天。可是他總是一邊滑手機，一邊把碗放下就回房間。',
      '有一天奶奶說：「飯好吃，可是我更想你陪我說說話。」小安愣住了：「我每天都有端飯啊？」',
    ],
    items: [
      {
        id: 's1a', type: 'single', goal: 'understanding',
        prompt: '用孔子的話來看，小安做到了什麼、少了什麼？',
        options: ['做到了「敬」，少了「養」', '做到了「養」，少了「敬」', '兩個都做到了', '兩個都沒做到'],
        answer: 1,
        explanation: '倒水端飯是「養」；邊滑手機、放下就走，少了尊重和陪伴，就是少了「敬」。',
      },
      {
        id: 's1b', type: 'truefalse', goal: 'inference',
        prompt: '照孔子的說法，小安只要每天端飯，就已經算是完整的孝了。',
        answer: false,
        explanation: '孔子說「不敬，何以別乎」：只養不敬，和養狗養馬分不出差別，所以還不完整。',
      },
      {
        id: 's1c', type: 'essay', goal: 'expression',
        prompt: '如果你是小安，明天開始你會怎麼做？',
        reference: '例：端飯時放下手機，坐下來陪奶奶吃，問她今天做了什麼；吃完再幫她收碗。',
        checklist: ['說出一個具體的做法', '做法能表現出尊重或陪伴'],
      },
    ],
  },

  // ---------------------------------------------------------------- 引導式查詢
  {
    id: 'i1', category: 'inquiry', type: 'essay', level: 'elementary', goal: 'reading',
    prompt: '成語「功虧一簣」和第二則的「一簣」有關。查一查這個成語最早出自哪一本書？是什麼意思？',
    hints: {
      direction: '用教育部《成語典》搜尋這個成語，看「典源」那一欄；也可以到維基文庫找那本書的原文。',
      keywords: ['功虧一簣', '為山九仞', '旅獒'],
    },
    reference: '出自《尚書‧旅獒》：「為山九仞，功虧一簣。」意思是堆一座九仞高的山，只差最後一筐土沒堆上去，整座山就沒完成。比喻事情只差最後一點點而失敗。',
    checklist: [
      '說出出處是《尚書》〈旅獒〉',
      '說出原句「為山九仞，功虧一簣」',
      '用自己的話說出成語的意思',
    ],
    source: '《尚書‧旅獒》',
  },
  {
    id: 'i2', category: 'inquiry', type: 'essay', level: 'junior', goal: 'understanding',
    prompt: '〈為政〉這一篇裡，除了子游，還有哪些人也問過孔子「什麼是孝」？孔子的回答都一樣嗎？',
    hints: {
      direction: '到維基文庫打開《論語‧為政》全文，找有「問孝」兩個字的段落。',
      keywords: ['問孝', '孟懿子', '子夏'],
    },
    reference: '同一篇裡還有孟懿子、孟武伯、子夏問孝。孔子回答孟懿子「無違」（照禮去做）；回答孟武伯「父母唯其疾之憂」；回答子夏「色難」（和顏悅色最難）；回答子游的是「敬」。同樣問孝，孔子依每個人的情況給不同的答案。',
    checklist: [
      '至少找到另外兩位問孝的人',
      '說出孔子給他們的不同回答',
      '說出「回答不一樣」的原因或想法',
    ],
    source: '《論語‧為政》',
  },
  {
    id: 'i3', category: 'inquiry', type: 'essay', level: 'junior', goal: 'inference',
    prompt: '子游後來當了武城的地方官。查一查「割雞焉用牛刀」的故事，說說子游怎麼把老師教的道理用在工作上。',
    hints: {
      direction: '查《論語‧陽貨》，找孔子到武城時說的話；也可以到本站「孔子講堂」點子游的人物卡。',
      keywords: ['割雞焉用牛刀', '弦歌之聲', '武城'],
    },
    reference: '孔子到武城，聽到彈琴唱歌的聲音，笑說：「殺雞哪用得著宰牛的刀？」意思是小地方何必用禮樂教化。子游回答，老師說過在上位的人學了道就會愛護百姓。孔子馬上說子游說得對，剛才是開玩笑。子游把老師教的禮樂，真的用在治理小城上。',
    checklist: [
      '說出出處〈陽貨〉',
      '說出「弦歌之聲」或「割雞焉用牛刀」的意思',
      '說出子游怎麼回答、孔子最後怎麼說',
    ],
    source: '《論語‧陽貨》',
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
