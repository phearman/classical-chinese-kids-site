export const PAGE_SIZE = 50;
export const idiomURL = (word) => `https://dict.idioms.moe.edu.tw/idiomList.jsp?webMd=2&la=0&idiom=${encodeURIComponent(word)}`;
import { TOPIC_LABELS, topicsOf } from './categories.js?v=79dca84';

export const eraOf = (era) => era.split('(')[0];

// filter 保留原有字串介面；額外條件讓主題、常用度、漫畫出處可彼此與搜尋合用。
export function filterWords(words, comics, query = '', filter = 'all', { era = '', book = '' } = {}) {
  // 只有已完成的漫畫才算「有漫畫」；其餘題目都仍在施工中。
  const readyComics = comics.filter((comic) => comic.ready === true);
  const comicByWord = new Map(readyComics.map((comic) => [comic.word, comic]));
  return words.filter((word, index) => {
    const comic = comicByWord.get(word);
    const mainMatches = filter === 'all'
      || (filter === 'comic' ? Boolean(comic) : filter === 'waiting' ? !comic : filter === 'common' ? index < 100 : topicsOf(word).includes(TOPIC_LABELS[filter]));
    return word.includes(query.trim()) && mainMatches
      && (!era || (comic && eraOf(comic.era) === era))
      && (!book || (comic && comic.book === book));
  });
}
export const visibleWords = (words, shown) => words.slice(0, shown);

// 網址參數 ↔ 篩選狀態:?filter=comic&era=先秦&book=《韓非子》&q=守株;不認得的值一律忽略,era/book 只在「有漫畫」時有效。
export function readFilterParams(params, { filterIds = [], eras = [], books = [] } = {}) {
  const filter = filterIds.includes(params.get('filter')) ? params.get('filter') : 'all';
  const era = filter === 'comic' && eras.includes(params.get('era')) ? params.get('era') : '';
  const book = filter === 'comic' && books.includes(params.get('book')) ? params.get('book') : '';
  const query = (params.get('q') || '').slice(0, 20);
  return { filter, era, book, query };
}

export function filterSearch({ filter = 'all', era = '', book = '', query = '' } = {}) {
  const next = new URLSearchParams();
  if (filter !== 'all') next.set('filter', filter);
  if (filter === 'comic' && era) next.set('era', era);
  if (filter === 'comic' && book) next.set('book', book);
  if (query.trim()) next.set('q', query.trim());
  const qs = next.toString();
  return qs ? `?${qs}` : '';
}
