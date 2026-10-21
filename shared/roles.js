// 動畫角色的聲音設定(共用,WY23):同一個人物在各課聽起來要一樣,所以只在這裡寫一份,各課 anim-data.js import。
// pitch/rate:瀏覽器內建朗讀用;voice:'male'/'female' 表示有多個華語語音時優先挑男聲/女聲(見 anim-player.js pickVoiceFrom)。
// tts:AI 配音(scripts/tts-build.js,OpenAI gpt-4o-mini-tts)用的聲音與語氣指示;改了 voice 或 instructions,
// 下次產音檔時那個角色的句子會全部重產。
export const TW = '請用台灣華語(繁體中文、台灣口音)朗讀。';

// 旁白(論語兩課共用的版本;〈兒時記趣〉的旁白語氣不同,在該課自己定義)
export const narrator = { label: '旁白', pitch: 1, rate: 0.95, tts: { voice: 'ash', instructions: `${TW}語氣活潑、有精神,像在說故事給國中生聽,句尾上揚,節奏輕快。` } };

// 孔子:使用者 2026-10-20 用三星手機聽「要再穩重,沉穩一點」(WY23)。
// 使用者 2026-10-21 三星手機聽「有點女聲而且聲音有點破」(待裁 57:C):手機只有女聲,pitch 0.6 壓太低造成失真,
// 改 0.8;測試鎖在 0.75~0.85。
export const kongzi = {
  label: '孔子', pitch: 0.8, rate: 0.75, voice: 'male',
  tts: { voice: 'onyx', instructions: `${TW}你是七十歲左右的老師,語氣穩重、沉穩、溫和,說話慢、句尾放緩。` },
};

export const zengzi = { label: '曾子', pitch: 1.1, rate: 0.9, tts: { voice: 'echo', instructions: `${TW}你是二十多歲的學生,語氣年輕、誠懇、篤定。` } };
