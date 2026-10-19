// 課程目錄:目錄頁從這裡產生。路徑皆相對於 site/。
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
    id: 'classroom',
    title: '孔子講堂',
    subtitle: '《論語》裡最常出場的 14 位學生',
    pages: [
      { href: 'classroom/index.html', label: '走進講堂', desc: '點一位學生，看他的個性、名言和小故事' },
    ],
  },
];
