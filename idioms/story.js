import { initPage } from '../shared/page.js?v=edf6ae9';
import { STORIES, storyBySlug } from './history.js?v=edf6ae9';
import { storyListHTML, storyBodyHTML, storyNeighbors, missingStoryHTML } from './story-view.js?v=edf6ae9';

initPage();
const app = document.getElementById('app');
const id = new URLSearchParams(location.search).get('id');
if (!id) {
  app.innerHTML = storyListHTML(STORIES);
} else {
  const story = storyBySlug(id);
  if (!story) {
    app.innerHTML = missingStoryHTML();
  } else {
    document.title = `${story.title}｜歷史故事｜文言文小幫手`;
    app.innerHTML = storyBodyHTML(story, { nav: storyNeighbors(story.slug, STORIES) });
  }
}
