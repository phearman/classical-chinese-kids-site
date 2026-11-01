import { initPage } from '../shared/page.js?v=fb91b65';
import { COMICS, comicBySlug } from './comics.js?v=fb91b65';
import { idiomURL } from './list.js?v=fb91b65';
import { WORDS } from './words-data.js?v=fb91b65';
import { ZHUYIN, ZHUYIN_NOTES } from './zhuyin.js?v=fb91b65';
import { missingComicHTML, comicNeighbors, comicBodyHTML } from './comic-view.js?v=fb91b65';

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
