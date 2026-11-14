import { initPage } from '../shared/page.js?v=edf6ae9';
import { COMICS, comicBySlug } from './comics.js?v=edf6ae9';
import { idiomURL } from './list.js?v=edf6ae9';
import { WORDS } from './words-data.js?v=edf6ae9';
import { ZHUYIN, ZHUYIN_NOTES } from './zhuyin.js?v=edf6ae9';
import { missingComicHTML, comicNeighbors, comicBodyHTML } from './comic-view.js?v=edf6ae9';

export const getComic = (id, comics = COMICS) => comicBySlug(id, comics);
initPage();
const app = document.getElementById('app');
const comic = getComic(new URLSearchParams(location.search).get('id'));
if (!comic) {
  app.innerHTML = missingComicHTML();
} else {
  document.title = `${comic.word}｜成語漫畫｜文言文小幫手`;
  const nav = comicNeighbors(comic.slug, COMICS, WORDS);
  app.innerHTML = `<main class="comic-view">${comicBodyHTML(comic, { readings: ZHUYIN[comic.word], readingNote: ZHUYIN_NOTES[comic.word], idiomHref: idiomURL(comic.word), nav })}</main>`;
}
