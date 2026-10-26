export const PAGE_SIZE = 50;
export const idiomURL = (word) => `https://dict.idioms.moe.edu.tw/idiomList.jsp?webMd=2&la=0&idiom=${encodeURIComponent(word)}`;
export function filterWords(words, comics, query = '', filter = 'all') {
  // 只有已完成的漫畫才算「有漫畫」；其餘題目都仍在施工中。
  const comicWords = new Set(comics.filter((comic) => comic.ready === true).map((comic) => comic.word));
  return words.filter((word) => word.includes(query.trim()) && (filter === 'all' || (filter === 'comic' ? comicWords.has(word) : !comicWords.has(word))));
}
export const visibleWords = (words, shown) => words.slice(0, shown);
