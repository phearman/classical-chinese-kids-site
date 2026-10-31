// 課程目錄:目錄頁與全站選單從這裡產生。路徑皆相對於 site/。
// book(可省):課本課次,首頁收合列的一行說明優先用它,沒有就用 subtitle。
export const catalog = [
  {
    id: 'lunyu-zengzi',
    title: '一聲「唯」',
    subtitle: '《論語》孔子與曾子的對話',
    pages: [
      { href: 'lessons/lunyu-zengzi/animation.html', label: '動畫故事', desc: '約 2 分 40 秒，有字幕和朗讀旁白' },
      { href: 'lessons/lunyu-zengzi/story.html', label: '圖文故事', desc: '一頁一段情境，像看繪本' },
      { href: 'lessons/lunyu-zengzi/study.html', label: '課文學習', desc: '逐句白話、逐詞解釋、生活比喻' },
      { href: 'lessons/lunyu-zengzi/people.html', label: '人物介紹', desc: '孔子、曾子、門人和曾子的故事' },
      { href: 'lessons/lunyu-zengzi/quiz.html', label: '隨堂測驗', desc: '選擇、填充、問答和素養題，作答只存在這台裝置' },
    ],
  },
  {
    id: 'lunyu-xuan',
    title: '論語選',
    subtitle: '子游問孝、譬如為山、吾日三省吾身',
    book: '翰林七上第 4 課',
    pages: [
      { href: 'lessons/lunyu-xuan/animation.html', label: '動畫故事', desc: '約 2 分鐘，三則各一小段，有字幕和朗讀旁白' },
      { href: 'lessons/lunyu-xuan/story.html', label: '圖文故事', desc: '一頁一段情境，像看繪本' },
      { href: 'lessons/lunyu-xuan/study.html', label: '課文學習', desc: '三則原文逐句白話、逐詞解釋、生活比喻' },
      { href: 'lessons/lunyu-xuan/quiz.html', label: '隨堂測驗', desc: '選擇、填充、問答和素養題，作答只存在這台裝置' },
    ],
  },
  {
    id: 'ershi-jiqu',
    title: '兒時記趣',
    subtitle: '沈復《浮生六記》：把蚊子看成鶴、把草叢看成森林',
    book: '翰林七上第 7 課',
    pages: [
      { href: 'lessons/ershi-jiqu/animation.html', label: '動畫故事', desc: '約 2 分鐘，有字幕和朗讀旁白' },
      { href: 'lessons/ershi-jiqu/story.html', label: '圖文故事', desc: '一頁一段情境，像看繪本' },
      { href: 'lessons/ershi-jiqu/study.html', label: '課文學習', desc: '四段原文逐句白話、逐詞解釋、生活比喻、作者小檔案' },
      { href: 'lessons/ershi-jiqu/people.html', label: '人物介紹', desc: '沈復的一生、《浮生六記》四卷導覽、延伸人物推薦' },
      { href: 'lessons/ershi-jiqu/quiz.html', label: '隨堂測驗', desc: '選擇、填充、問答和素養題，作答只存在這台裝置' },
    ],
  },
  {
    id: 'shenhua-yuyan',
    title: '古代神話與寓言選',
    subtitle: '夸父逐日、濫竽充數，還有盤古、女媧、驚弓之鳥',
    book: '翰林七上自學選文一',
    pages: [
        { href: 'lessons/shenhua-yuyan/animation.html', label: '動畫故事', desc: '約 3 分鐘，盤古、女媧、共工、夸父四則神話，有字幕和朗讀旁白' },
        { href: 'lessons/shenhua-yuyan/story.html', label: '圖文故事', desc: '神話部分一頁一段，像看繪本' },
        { href: 'lessons/shenhua-yuyan/fable-story.html', label: '寓言故事', desc: '濫竽充數、驚弓之鳥，一頁一段像看繪本' },
        { href: 'lessons/shenhua-yuyan/fable-animation.html', label: '寓言動畫', desc: '約 2 分 14 秒，兩則寓言有字幕和朗讀旁白' },
        { href: 'lessons/shenhua-yuyan/study.html', label: '課文學習', desc: '兩則原文逐句白話、逐詞解釋，加上三張故事卡' },
      { href: 'lessons/shenhua-yuyan/quiz.html', label: '隨堂測驗', desc: '選擇、填充、問答和素養題，作答只存在這台裝置' },
      { href: 'idioms/index.html', label: '成語集', desc: '搜尋成語、查看四格漫畫與《成語典》連結' },
    ],
  },
  {
    id: 'maiyouweng',
    title: '賣油翁',
    subtitle: '歐陽修《歸田錄》：神射手遇上倒油的老人',
    pages: [
      { href: 'lessons/maiyouweng/animation.html', label: '動畫故事', desc: '約 2 分鐘，有字幕和朗讀旁白' },
      { href: 'lessons/maiyouweng/story.html', label: '圖文故事', desc: '一頁一段情境，像看繪本' },
      { href: 'lessons/maiyouweng/study.html', label: '課文學習', desc: '三段原文逐句白話、逐詞解釋、生活比喻、莊子延伸與人物小檔案' },
      { href: 'lessons/maiyouweng/quiz.html', label: '隨堂測驗', desc: '選擇、填充、問答和素養題，作答只存在這台裝置' },
    ],
  },
  {
    id: 'idioms',
    section: 'site',
    title: '成語集',
    subtitle: '依常用程度排序的成語填空題庫',
    pages: [
      { href: 'idioms/index.html', label: '成語集', desc: '搜尋成語、查看四格漫畫與《成語典》連結' },
    ],
  },
  {
    id: 'map',
    section: 'site',
    title: '文言文地圖',
    subtitle: '課文、人物、成語故事發生在哪個朝代、哪裡',
    pages: [
      { href: 'map/index.html', label: '文言文地圖', desc: '依朝代看故事發生的地方,地圖可拖曳看同時期的其他國家' },
    ],
  },
  {
    id: 'classroom',
    section: 'site', // 全站頁面(選單放在「全站」,不是一課)
    title: '孔子講堂',
    subtitle: '《論語》裡最常出場的 14 位學生',
    pages: [
      { href: 'classroom/index.html', label: '走進講堂', desc: '點一位學生，看他的個性、名言和小故事' },
    ],
  },
];
