// 成語主題以字面中的單字判定；不推論字義，讓規則可預期且容易維護。
const TOPIC_CHARACTERS = Object.freeze({
  animal: '馬牛羊虎龍蛇鳥雞犬狗兔魚蛙狐狼豹象猴鼠鶴雁鷹鳳龜熊鹿蝶蜂蟲蠶貓豬驢鴨鵝獅豹猿鯨',
  number: '一二三四五六七八九十百千萬兩雙半零',
  body: '手足頭面目眼耳口鼻心骨血肝膽眉首齒舌腹背腳指臂掌拳肩胸腰膝髮鬚唇舌頸',
  color: '紅黃藍綠白黑青紫赤丹朱灰',
  nature: '天地山水火風雲雨雪日月星海江河石花草木林田土泉湖川谷霜露雷電',
});

export const TOPIC_LABELS = Object.freeze({
  animal: '動物', number: '數字', body: '身體部位', color: '顏色', nature: '自然',
});

/**
 * 回傳詞目以字面符合的主題名稱；同一字可屬多類，這是刻意保留的結果。
 */
export function topicsOf(word) {
  return Object.entries(TOPIC_CHARACTERS)
    .filter(([, characters]) => [...word].some((character) => characters.includes(character)))
    .map(([topic]) => TOPIC_LABELS[topic]);
}
