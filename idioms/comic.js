import { initPage } from '../shared/page.js?v=79dd71a';
import { COMICS, comicBySlug } from './comics.js?v=79dd71a';
import { idiomURL } from './list.js?v=79dd71a';
import { WORDS } from './words-data.js?v=79dd71a';
import { ZHUYIN, ZHUYIN_NOTES } from './zhuyin.js?v=79dd71a';
import { missingComicHTML, comicNeighbors, comicBodyHTML } from './comic-view.js?v=79dd71a';

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
