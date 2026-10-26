// 有漫畫條目的唯一登記表。圖片完成後在 images 依四格順序填入相對路徑，並把 ready 改為 true。
export const COMICS = Object.freeze([
  {
    word: '守株待兔', slug: 'shouzhu-daitu', ready: true,
    images: [1, 2, 3, 4].map((n) => `img/shouzhu-daitu-${n}.webp`),
    panels: [
      '宋國有個農夫，田裡有一截樹樁。',
      '一隻兔子跑太快，撞上樹樁，農夫白撿了一隻兔子。',
      '他從此不種田，天天守著樹樁等兔子。',
      '兔子沒再來，田也荒了，大家都笑他。',
    ],
    original: '宋人有耕田者，田中有株，兔走觸株，折頸而死……',
    source: '《韓非子‧五蠹》',
    meaning: '死守過去偶然的經驗，不知變通；也指不努力、只想等好運。',
    example: '考試不能守株待兔，只背去年考過的題目。',
    situation: '小明上次在操場撿到零錢，之後每天放學都去操場「巡邏」……',
  },
]);

export const comicBySlug = (slug, comics = COMICS) => comics.find((comic) => comic.slug === slug) ?? null;
