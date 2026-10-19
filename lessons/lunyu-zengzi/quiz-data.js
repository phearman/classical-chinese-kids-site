// 〈論語:孔子與曾子〉隨堂測驗題庫(單一資料來源)。
// 人看的版本 lessons/lunyu-zengzi/quiz.md 由 scripts/build-quiz-md.js 從這裡產生,⛔ 手改 quiz.md。
// 題目、解析、參考答案皆為本專案自行撰寫;原文依維基文庫《論語》等公有領域古籍。
//
// category:content=學習內容 / extension=延伸提問 / inquiry=引導式查詢
// type:single 單選 / multi 多選 / truefalse 是非 / fill 漏字填充 / essay 問答 / set 素養題組
// level:elementary 小學 / junior 國中;goal:reading 閱讀 / understanding 理解 / inference 推論 / expression 表達
// 自動判分題(single/multi/truefalse/fill)要有 answer+explanation;不判分題(essay)要有 reference+checklist。
// 引導式查詢題=essay 加 hints(查詢方向與關鍵字,不給答案)。

export const quizMeta = {
  lessonId: 'lunyu-zengzi',
  title: '隨堂測驗：一聲「唯」',
  storageKey: 'cck:quiz:lunyu-zengzi:v1',
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
    prompt: '「子曰：『參乎！吾道一以貫之。』」孔子叫的「參」是誰？',
    options: ['孔子自己', '曾參（曾子）', '子貢', '門人'],
    answer: 1,
    explanation: '「參」是曾參的名。老師叫學生直接叫名字，所以孔子叫他「參」；「曾子」是後人對他的尊稱。',
    source: '《論語‧里仁》',
  },
  {
    id: 'c2', category: 'content', type: 'fill', level: 'elementary', goal: 'reading',
    prompt: '把原文填完整：子曰：「參乎！吾道＿＿＿＿。」（4 個字）',
    answer: '一以貫之', accept: ['一以貫之'],
    explanation: '「一以貫之」：用一個中心把全部貫穿起來。',
    source: '《論語‧里仁》',
  },
  {
    id: 'c3', category: 'content', type: 'fill', level: 'elementary', goal: 'reading',
    prompt: '把原文填完整：曾子曰：「夫子之道，＿＿而已矣！」（2 個字）',
    answer: '忠恕', accept: ['忠恕', '忠、恕', '忠和恕'],
    explanation: '曾子用「忠」和「恕」兩個字，說出老師貫穿一切的道理。',
    source: '《論語‧里仁》',
  },
  {
    id: 'c4', category: 'content', type: 'truefalse', level: 'junior', goal: 'understanding',
    prompt: '「吾道一以貫之」的「之」，指的是「吾道」（我的道理）。',
    answer: true,
    explanation: '「貫之」=貫穿它，「之」指前面的「吾道」；「一以」是「以一」倒過來，強調「一」。',
    source: '《論語‧里仁》',
  },
  {
    id: 'c5', category: 'content', type: 'single', level: 'junior', goal: 'inference',
    prompt: '曾子回答「唯」，為什麼可以看出他立刻聽懂了？',
    options: [
      '因為「唯」是最長、最仔細的回答',
      '因為「唯」是快速又恭敬的應答，老師一叫就應',
      '因為曾子不想回答，隨便應一聲',
      '因為「唯」的意思是「我不懂」',
    ],
    answer: 1,
    explanation: '《禮記‧曲禮上》說「父召無諾，先生召無諾，唯而起」：父親、老師叫你，要用「唯」快速應答並站起來。曾子毫不遲疑地應「唯」，表示他一聽就懂。',
    source: '《論語‧里仁》、《禮記‧曲禮上》',
  },
  {
    id: 'c6', category: 'content', type: 'truefalse', level: 'junior', goal: 'understanding',
    prompt: '這一章的「忠」，意思是「效忠君王」。',
    answer: false,
    explanation: '這裡的「忠」是對人對事盡心盡力，把自己該做的做到最好，不是專指效忠君王。',
    source: '《論語‧里仁》',
  },
  {
    id: 'c7', category: 'content', type: 'single', level: 'elementary', goal: 'reading',
    prompt: '「吾日三省吾身」的「省」，正確讀音是？',
    options: ['ㄕㄥˇ（省錢的省）', 'ㄒㄧㄥˇ（反省的省）', 'ㄕㄥ', 'ㄒㄧㄥ'],
    answer: 1,
    explanation: '「省」在這裡是檢查、反省，讀 ㄒㄧㄥˇ。',
    source: '《論語‧學而》',
  },
  {
    id: 'c8', category: 'content', type: 'multi', level: 'junior', goal: 'understanding',
    prompt: '曾子每天反省的三件事，有哪些？（選出全部正確的）',
    options: ['替別人辦事有沒有盡心', '和朋友來往有沒有守信', '老師教的有沒有複習', '今天有沒有賺到錢'],
    answer: [0, 1, 2],
    explanation: '原文：「為人謀而不忠乎？與朋友交而不信乎？傳不習乎？」三件事是盡心、守信、複習，沒有賺錢。',
    source: '《論語‧學而》',
  },
  {
    id: 'c9', category: 'content', type: 'single', level: 'junior', goal: 'understanding',
    prompt: '「門人問曰：『何謂也？』」門人想問的是什麼？',
    options: ['老師要去哪裡', '老師說的「一以貫之」是什麼意思', '曾子為什麼遲到', '今天要考什麼'],
    answer: 1,
    explanation: '「何謂」=說的是什麼。孔子只說「有一個」卻沒說是什麼，曾子又只回一個「唯」，門人聽不懂才問。',
    source: '《論語‧里仁》',
  },

  // ---------------------------------------------------------------- 延伸提問
  {
    id: 'e1', category: 'extension', type: 'multi', level: 'elementary', goal: 'understanding',
    prompt: '孔子說「恕」就是「己所不欲，勿施於人」。下面哪些做法符合「恕」？（選出全部正確的）',
    options: [
      '自己不喜歡被取綽號，所以也不幫同學亂取綽號',
      '自己討厭被插隊，但趕時間時就插隊',
      '被已讀不回很難過，所以自己會記得回朋友訊息',
      '自己不想做的打掃工作，偷偷推給別人',
    ],
    answer: [0, 2],
    explanation: '「恕」是將心比心：自己不想被怎麼對待，就不那樣對待別人。插隊、把工作推給別人，都是把自己不要的加在別人身上。',
    source: '《論語‧衛靈公》「其恕乎！己所不欲，勿施於人。」',
  },
  {
    id: 'e2', category: 'extension', type: 'single', level: 'elementary', goal: 'inference',
    prompt: '曾子的太太哄孩子說「回來殺豬給你吃」，曾子後來真的把豬殺了。曾子最想教孩子什麼？',
    options: ['豬肉很好吃', '大人說話要算數，不能騙小孩', '買豬很便宜', '太太說的話都不用聽'],
    answer: 1,
    explanation: '曾子說：小孩是跟著父母學的，父母騙他，就是教他騙人。所以答應的事就要做到。',
    source: '《韓非子‧外儲說左上》',
  },
  {
    id: 'e3', category: 'extension', type: 'essay', level: 'junior', goal: 'inference',
    prompt: '孔子說「參也魯」（曾參比較遲鈍），可是全班只有曾子馬上聽懂「一以貫之」。你覺得為什麼？請用課文或曾子的故事說明。',
    reference: '曾子雖然反應不快，但他每天「三省吾身」，反省自己有沒有盡心（忠）、守信。他一直在練習「忠」，所以老師一說「一以貫之」，他就知道那條線是什麼。慢，不代表想得淺。',
    checklist: [
      '有說出「慢」和「懂不懂」不一樣',
      '有引用證據（例如「三省吾身」或「殺豬」的故事）',
      '有把證據和「忠恕」連起來',
    ],
  },
  {
    id: 'e4', category: 'extension', type: 'essay', level: 'elementary', goal: 'expression',
    prompt: '「一以貫之」就像一條線把珠子串成手鍊。想想你自己：有沒有一個原則，可以貫穿你做很多事？舉一個例子說明。',
    reference: '例：我的原則是「答應的事就做到」。所以分組報告我會準時交、跟朋友約好會準時到、答應爸媽的家事也會做完。這一個原則，串起了學校、朋友、家裡的事。',
    checklist: [
      '有說出一個清楚的原則',
      '至少舉兩件不同的事，都能用這個原則說明',
      '句子通順、看得懂',
    ],
  },

  {
    id: 'e5', category: 'extension', type: 'essay', level: 'junior', goal: 'inference',
    prompt: '孟武伯問孔子：子路、冉求、公西華算不算「仁」？孔子說子路能管大國的軍賦、冉求能當大夫家的總管、公西華能在朝廷接待外賓，卻三次都說「不知其仁」（不知道他算不算仁）。孔子為什麼這樣回答？你覺得「能幹」和「仁」有什麼不同？',
    reference: '孔子肯定三個學生都很能幹，各有可以做的官；但「仁」是做人最核心的善，要長期在待人處事中做到，不是有才能就算。所以孔子不輕易說誰是仁人。能幹是「會做事」，仁是「心裡有別人、做對的事」；一個人可以很能幹，卻不一定仁。',
    checklist: [
      '說出孔子肯定了三人的才能',
      '說出「能幹」和「仁」不一樣',
      '用自己的話或例子說明兩者的差別',
    ],
    source: '《論語‧公冶長》「子路仁乎？」章',
  },

  // ---------------------------------------------------------------- 引導式查詢
  {
    id: 'i1', category: 'inquiry', type: 'essay', level: 'elementary', goal: 'reading',
    prompt: '「一以貫之」在《論語》裡出現兩次。除了對曾子，孔子還對哪一位學生說過？他們的對話有什麼不同？',
    hints: {
      direction: '到維基文庫或圖書館的《論語》全文，找〈衛靈公〉篇。',
      keywords: ['予一以貫之', '多學而識之', '衛靈公'],
    },
    reference: '孔子也對子貢說過「予一以貫之」。孔子先問子貢：「你以為我是多學、多記的人嗎？」子貢說「是啊」，孔子說「不是，我是用一個中心貫穿起來的」。對子貢，孔子沒有說「一」是什麼；對曾子，則是曾子自己說出「忠恕」。',
    checklist: [
      '找到另一位是子貢',
      '說出出處是〈衛靈公〉',
      '比較出一個不同點（例如：誰說出答案）',
    ],
    source: '《論語‧衛靈公》',
  },
  {
    id: 'i2', category: 'inquiry', type: 'essay', level: 'junior', goal: 'understanding',
    prompt: '查一查成語「易簀」是什麼意思、出自哪裡。曾子生命最後為什麼堅持要換蓆子？',
    hints: {
      direction: '查《禮記‧檀弓上》，或用教育部《成語典》搜尋「易簀」。',
      keywords: ['易簀', '曾子寢疾', '檀弓上'],
    },
    reference: '「易簀」出自《禮記‧檀弓上》，後來用來指人將死。曾子病重時，發現自己睡的是大夫才能用的華美蓆子（季孫氏送的），他不是大夫，覺得不合禮，堅持立刻換掉，換完不久就過世了。他到最後一刻都要求自己做對的事。',
    checklist: [
      '說出出處《禮記‧檀弓上》',
      '說出「易簀」後來比喻人將死',
      '說出換蓆子的原因（不合身分、不合禮）',
    ],
    source: '《禮記‧檀弓上》',
  },
  {
    id: 'i3', category: 'inquiry', type: 'essay', level: 'junior', goal: 'inference',
    prompt: '查「曾參殺人」的故事和成語「三人成虎」的故事，說說兩個故事有什麼共同點？這對我們在網路上看到傳言有什麼提醒？',
    hints: {
      direction: '「曾參殺人」查《戰國策‧秦策二》（甘茂對秦武王說的話）；「三人成虎」可查《戰國策‧魏策》或教育部《成語典》。',
      keywords: ['曾參殺人', '投杼', '三人成虎'],
    },
    reference: '共同點：一件不是真的事，只要說的人一多，大家（連最信任他的媽媽、國君）就會相信。曾子的媽媽聽到第三個人說，就丟下梭子翻牆逃走。提醒：看到網路傳言，不要因為轉傳的人多就相信，要查證來源。',
    checklist: [
      '說出兩個故事的共同點（說的人多就會相信）',
      '至少引用一個故事裡的細節',
      '有連結到現在的生活（網路、傳言）',
    ],
    source: '《戰國策‧秦策二》',
  },

  // ---------------------------------------------------------------- 素養題組
  {
    id: 's1', category: 'extension', type: 'set', level: 'junior', goal: 'inference',
    prompt: '閱讀下面的短文，回答問題。',
    passage: [
      '小安是班上的學藝股長。班會要選校慶海報的主題，小安心裡很想用「海洋」，但大多數同學投給「森林」。',
      '投票結束後，小安沒有抱怨，回家連夜把森林海報畫完。隔天，同學小杰因為生病沒交自己負責的那一格，小安想起自己上次生病時，大家幫他補作業，就主動幫小杰把那一格補上。',
      '老師說：「小安做事，好像有一條線串著。」',
    ],
    items: [
      {
        id: 's1a', type: 'single', goal: 'understanding',
        prompt: '小安「沒有抱怨，連夜把森林海報畫完」，最接近哪一個字？',
        options: ['忠：盡心做好自己該做的事', '恕：替別人著想', '勇：不怕危險', '魯：反應慢'],
        answer: 0,
        explanation: '雖然不是自己想要的主題，小安還是盡心把份內工作做到最好，這是「忠」。',
      },
      {
        id: 's1b', type: 'single', goal: 'inference',
        prompt: '小安想起「自己生病時，大家幫他補作業」，才幫小杰補上。這最接近哪一個字？',
        options: ['忠', '恕', '信', '孝'],
        answer: 1,
        explanation: '小安把自己被幫助的感受推到小杰身上，將心比心，這是「恕」。',
      },
      {
        id: 's1c', type: 'essay', goal: 'expression',
        prompt: '老師說小安做事「好像有一條線串著」。用這一課學到的詞，說說那條線是什麼，並各舉短文中的一個例子。',
        reference: '那條線就是「忠恕」，也就是「一以貫之」。忠：主題不是自己選的，還是盡心把海報畫完；恕：想起自己生病被幫忙，所以主動幫小杰補上。',
        checklist: [
          '說出「忠恕」或「一以貫之」',
          '忠、恕各舉一個短文中的例子',
          '例子和詞的意思配得起來',
        ],
      },
    ],
  },
  {
    id: 's2', category: 'content', type: 'set', level: 'elementary', goal: 'reading',
    prompt: '讀一讀這段改寫的故事，回答問題。',
    passage: [
      '孔子對曾參說：「我的道理，是用一個中心串起來的。」曾參馬上說：「是。」孔子就走出去了。',
      '其他學生你看我、我看你：「老師說的到底是什麼？」曾參說：「老師的道理，就是忠和恕而已。」',
    ],
    items: [
      {
        id: 's2a', type: 'truefalse', goal: 'reading',
        prompt: '孔子走出去之前，有把「一個中心」是什麼說清楚。',
        answer: false,
        explanation: '孔子只說「有一個中心」，沒有說是什麼，所以其他學生才聽不懂。',
      },
      {
        id: 's2b', type: 'single', goal: 'understanding',
        prompt: '故事中誰把答案說了出來？',
        options: ['孔子', '曾參', '其他學生', '沒有人'],
        answer: 1,
        explanation: '是曾參把「忠和恕」說給其他學生聽。',
      },
      {
        id: 's2c', type: 'fill', goal: 'reading',
        prompt: '故事裡「其他學生」在原文中叫做「＿＿」。（2 個字）',
        answer: '門人', accept: ['門人'],
        explanation: '原文「門人問曰」，門人就是學生。',
      },
    ],
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
