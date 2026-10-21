// 〈古代神話與寓言選〉(翰林七上自學選文一)隨堂測驗題庫(單一資料來源)。
// 人看的版本 lessons/shenhua-yuyan/quiz.md 由 scripts/build-quiz-md.js 從這裡產生,⛔ 手改 quiz.md。
// 題目、解析、參考答案皆為本專案自行撰寫,⛔ 參考出版社課本題目;原文依維基文庫《山海經》《韓非子》(公有領域古籍)。
//
// category:content=學習內容 / extension=延伸提問 / inquiry=引導式查詢
// type:single 單選 / multi 多選 / truefalse 是非 / fill 漏字填充 / essay 問答 / set 素養題組
// level:elementary 小學 / junior 國中;goal:reading 閱讀 / understanding 理解 / inference 推論 / expression 表達
// 自動判分題(single/multi/truefalse/fill)要有 answer+explanation;不判分題(essay)要有 reference+checklist。
// 引導式查詢題=essay 加 hints(查詢方向與關鍵字,不給答案)。

export const quizMeta = {
  lessonId: 'shenhua-yuyan',
  title: '隨堂測驗：古代神話與寓言選',
  storageKey: 'cck:quiz:shenhua-yuyan:v1',
};

export const categories = {
  content: { label: '學習內容', desc: '原文、字詞、句意' },
  extension: { label: '延伸提問', desc: '連結生活與想像' },
  inquiry: { label: '引導式查詢', desc: '先自己查，再回來作答' },
};

export const levels = { elementary: '小學', junior: '國中' };
export const goals = { reading: '閱讀', understanding: '理解', inference: '推論', expression: '表達' };
export const types = { single: '單選', multi: '多選', truefalse: '是非', fill: '漏字填充', essay: '問答', set: '素養題組' };

const KUAFU = '《山海經‧海外北經》';
const YU = '《韓非子‧內儲說上》';
const DICT = '教育部《重編國語辭典修訂本》';

export const questions = [
  // ---------------------------------------------------------------- 學習內容
  {
    id: 'c1', category: 'content', type: 'single', level: 'elementary', goal: 'reading',
    prompt: '「夸父與日逐走」的「走」是什麼意思？',
    options: ['慢慢走路', '跑', '離開', '走路的聲音'],
    answer: 1,
    explanation: '古文的「走」是跑。「與日逐走」=和太陽賽跑、追著太陽跑。',
    source: KUAFU,
  },
  {
    id: 'c2', category: 'content', type: 'fill', level: 'elementary', goal: 'reading',
    prompt: '把原文填完整：渴，欲得飲，飲於河、渭，河、渭不足，北飲＿＿。（2 個字）',
    answer: '大澤', accept: ['大澤', '大泽'],
    explanation: '「大澤」是很大的湖泊。黃河、渭水的水不夠喝，夸父又往北去喝大湖的水。',
    source: KUAFU,
  },
  {
    id: 'c3', category: 'content', type: 'single', level: 'elementary', goal: 'understanding',
    prompt: '夸父死後，他丟下的手杖變成了什麼？',
    options: ['一條大河', '一座高山', '一片樹林', '一顆星星'],
    answer: 2,
    explanation: '原文「棄其杖，化為鄧林」：手杖變成了一片叫鄧林的樹林（教育部辭典說長成了一片桃林）。',
    source: KUAFU,
  },
  {
    id: 'c4', category: 'content', type: 'truefalse', level: 'junior', goal: 'reading',
    prompt: '「宣王說之」的「說」讀 ㄕㄨㄛ，意思是「說話」。',
    answer: false,
    explanation: '這裡的「說」同「悅」，讀 ㄩㄝˋ，意思是喜歡。「宣王說之」=宣王很喜歡他。',
    source: DICT,
  },
  {
    id: 'c5', category: 'content', type: 'single', level: 'elementary', goal: 'understanding',
    prompt: '南郭處士為什麼逃走？',
    options: ['他生病了', '新國王湣王喜歡一個一個地聽人吹竽', '他吹得太好被嫉妒', '宣王把他趕走'],
    answer: 1,
    explanation: '原文「湣王立，好一一聽之，處士逃」：要一個一個吹，不會吹竽的南郭處士就混不下去了。',
    source: YU,
  },
  {
    id: 'c6', category: 'content', type: 'multi', level: 'junior', goal: 'reading',
    prompt: '下面哪些字的讀音標對了？選出所有正確的。',
    options: ['請為王吹竽：為 ㄨㄟˋ', '好一一聽之：好 ㄏㄠˇ', '化為鄧林：為 ㄨㄟˊ', '南郭處士：處 ㄔㄨˇ', '廩食以數百人：數 ㄕㄨˇ'],
    answer: [0, 2, 3],
    explanation: '「為王吹竽」的為是「替」，讀 ㄨㄟˋ；「化為」是成為，讀 ㄨㄟˊ；「處士」讀 ㄔㄨˇ ㄕˋ。「好一一聽之」的好是喜歡，讀 ㄏㄠˋ；「數百人」的數是幾，讀 ㄕㄨˋ。',
    source: DICT,
  },
  {
    id: 'c7', category: 'content', type: 'fill', level: 'elementary', goal: 'reading',
    prompt: '把原文填完整：齊宣王使人吹＿，必三百人。（1 個字）',
    answer: '竽', accept: ['竽'],
    explanation: '「竽」是古代一種用嘴吹的樂器。成語「濫竽充數」的「竽」就是它。',
    source: YU,
  },
  {
    id: 'c8', category: 'content', type: 'single', level: 'junior', goal: 'understanding',
    prompt: '關於「女媧補天」和「共工撞不周山」，下面哪一個說法正確？',
    options: [
      '所有古書都說共工是和祝融打仗',
      '《淮南子‧天文訓》說共工和顓頊爭當天帝，一怒撞了不周山',
      '盤古煉五色石補天',
      '《山海經》記載了女媧補天',
    ],
    answer: 1,
    explanation: '《淮南子‧天文訓》寫的是共工和顓頊爭帝；說他和祝融交戰的，是唐代司馬貞的〈三皇本紀〉。煉石補天的是女媧，見《淮南子‧覽冥訓》。',
    source: '《淮南子》〈天文訓〉〈覽冥訓〉；司馬貞〈三皇本紀〉',
  },

  {
    id: 's1', category: 'content', type: 'set', level: 'junior', goal: 'inference',
    prompt: '閱讀短文，回答問題。',
    passage: [
      '學校合唱比賽前，阿哲從來不開口，只是跟著大家張嘴，反正四十個人一起唱，誰也聽不出來。',
      '比賽前一週，老師宣布：「今天每個人輪流唱一段給我聽。」阿哲突然說他肚子痛，要去保健室。',
    ],
    items: [
      {
        id: 's1a', type: 'single', goal: 'inference',
        prompt: '阿哲的情形，最像哪一個成語？',
        options: ['夸父逐日', '濫竽充數', '驚弓之鳥', '盤古開天'],
        answer: 1,
        explanation: '沒有真本事、混在大家裡面湊數，就像南郭處士混在三百人裡吹竽。',
      },
      {
        id: 's1b', type: 'single', goal: 'inference',
        prompt: '老師「每個人輪流唱」的做法，像原文裡誰的做法？',
        options: ['齊宣王', '齊湣王', '夸父', '更羸'],
        answer: 1,
        explanation: '湣王「好一一聽之」，一個一個聽，誰會誰不會就清楚了。',
      },
      {
        id: 's1c', type: 'truefalse', goal: 'understanding',
        prompt: '阿哲說肚子痛要去保健室，就像南郭處士的「逃」。',
        answer: true,
        explanation: '真本事要上場時，兩個人都選擇躲開。',
      },
    ],
  },

  // ---------------------------------------------------------------- 延伸提問
  {
    id: 'e1', category: 'extension', type: 'single', level: 'elementary', goal: 'understanding',
    prompt: '小美上次考試前一晚熬夜卻考壞了，這次一聽到「明天要考試」就緊張得睡不著。用哪個成語形容最恰當？',
    options: ['濫竽充數', '驚弓之鳥', '夸父逐日', '盤古開天'],
    answer: 1,
    explanation: '受過一次驚嚇，之後一點點動靜就害怕，就是「驚弓之鳥」（典出《戰國策‧楚策四》）。',
    source: DICT,
  },
  {
    id: 'e2', category: 'extension', type: 'essay', level: 'junior', goal: 'expression',
    prompt: '夸父追太陽，最後渴死在半路上。有人說他「不自量力」，有人說他「勇於追夢」。你同意哪一種看法？請說明理由。',
    reference: '兩種都可以，重點是理由。例如：同意「勇於追夢」——他真的追上了太陽，就算倒在找水的路上，手杖也化成樹林，留下了東西給後人；或同意「不自量力」——他沒有先想清楚水夠不夠，就拚命去追。',
    checklist: ['清楚說出自己同意哪一種', '用原文的情節當理由（例如喝乾河水、化為鄧林）', '理由合理、前後一致'],
    source: KUAFU,
  },
  {
    id: 'e3', category: 'extension', type: 'essay', level: 'elementary', goal: 'expression',
    prompt: '古人用盤古、女媧的故事解釋天地是怎麼來的。如果你也要編一個神話，解釋「為什麼會下雨」，你會怎麼說？（三到五句）',
    reference: '例如：天上住著一位很愛哭的雲朵巨人，每當看到人間有人難過，他就跟著掉眼淚，眼淚落到地上就成了雨。',
    checklist: ['有一個神或巨人之類的角色', '說得出「下雨」是怎麼來的', '故事有開頭和結果'],
  },
  {
    id: 'e4', category: 'extension', type: 'truefalse', level: 'junior', goal: 'inference',
    prompt: '寓言通常是把一個道理藏在短短的故事裡，〈濫竽充數〉就是一則寓言。',
    answer: true,
    explanation: '〈濫竽充數〉用南郭處士的故事，說明沒有真本事終究會露出馬腳。',
    source: YU,
  },

  // ---------------------------------------------------------------- 引導式查詢
  {
    id: 'i1', category: 'inquiry', type: 'essay', level: 'junior', goal: 'reading',
    prompt: '〈驚弓之鳥〉的故事裡，更羸說那隻大雁「飛得慢」「叫聲悲傷」。請查原典：這兩點分別顯示大雁處於什麼狀況？牠為什麼一聽見弦聲就掉下來？',
    hints: { direction: '到維基文庫找《戰國策》的〈楚策四〉，搜尋射箭高手的名字，讀他向魏王解釋的那幾句。', keywords: ['戰國策 楚策四', '更羸', '驚弓之鳥'] },
    reference: '更羸說：飛得慢，是因為舊傷還在痛；叫聲悲傷，是因為離開雁群很久了。牠傷口沒好、心裡還害怕，一聽到弦聲就往高處飛，傷口裂開就掉下來了。',
    checklist: ['說出「飛得慢」代表舊傷還痛', '說出「叫聲悲傷」代表離群很久', '說出大雁掉下來的原因（受驚往高飛、傷口裂開）'],
    source: '《戰國策‧楚策四》',
  },
  {
    id: 'i2', category: 'inquiry', type: 'essay', level: 'elementary', goal: 'reading',
    prompt: '《山海經》除了〈海外北經〉，還有一篇也寫到夸父追太陽。請查出是哪一篇，並說說和〈海外北經〉有什麼不一樣。',
    hints: { direction: '到維基文庫打開《山海經》的目錄，在「大荒」開頭的幾篇裡，用搜尋找「夸父」。', keywords: ['山海經 夸父', '維基文庫 山海經 目錄'] },
    reference: '〈大荒北經〉。它說夸父「不量力」想追太陽的影子，喝黃河的水不夠，要去大澤，還沒到就死了；另外還說應龍殺了夸父。沒有寫手杖化為樹林。',
    checklist: ['查出篇名〈大荒北經〉', '說出至少一個不同的地方（例如「不量力」、應龍殺夸父、沒有手杖化林）'],
    source: '《山海經‧大荒北經》',
  },
  {
    id: 'i3', category: 'inquiry', type: 'essay', level: 'junior', goal: 'understanding',
    prompt: '查一查成語「濫竽充數」除了說「沒有真本事的人混在裡面」，還有什麼用法？請舉一個例句。',
    hints: { direction: '到教育部《重編國語辭典修訂本》查「濫竽充數」，看「比喻」後面的幾種說法。', keywords: ['濫竽充數', '重編國語辭典'] },
    reference: '辭典說還可以比喻拿不好的東西充場面，也可以用來謙虛地說自己。例句：「我只是濫竽充數，請大家多指教。」',
    checklist: ['說出「謙虛地說自己」或「拿不好的東西充場面」的用法', '例句用法正確'],
    source: DICT,
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
