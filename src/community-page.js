import { communityDemos, sceneUrl, embedUrl } from './community-data.js';

const id = new URLSearchParams(location.search).get('scene');
const demo = communityDemos.find(item => item.id === id);
const root = document.querySelector('#community-page');

if (!demo) {
  root.innerHTML = '<section class="demo-head"><p class="eyebrow">DEMO UNAVAILABLE</p><h1>We could not find that scene.</h1><p><a href="./index.html#community-title">Explore the community gallery ↗</a></p></section>';
} else {
  document.title = `${demo.title} 3D Demo | Digital Twin`;
  root.innerHTML = `
    <section class="demo-head"><p class="eyebrow">COMMUNITY 3D EXAMPLE / ${demo.category.toUpperCase()}</p><h1>${demo.title}</h1><p>${demo.description} Explore the interactive scene below.</p></section>
    <div class="demo-frame"><iframe title="Interactive 3D scene: ${demo.title}" src="${embedUrl(demo.id)}" allow="fullscreen; xr-spatial-tracking" allowfullscreen loading="eager"></iframe></div>
    <section class="demo-meta"><div><p><strong>Created by <a href="${demo.creatorUrl}" target="_blank" rel="noopener">${demo.creator}</a></strong> · ${demo.location}</p><p>This is an independent creator's work, embedded from SuperSplat. Digital Twin did not capture or produce this scene.</p></div><div><p>Licensed <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>. View the <a href="${sceneUrl(demo.id)}" target="_blank" rel="noopener">original scene and credit</a>${demo.extraCredit ? ` and <a href="${demo.extraCredit}" target="_blank" rel="noopener">creator's additional credit link</a>` : ''}.</p><p>The original viewer hosts this scene. Its availability and controls are managed by its creator and SuperSplat.</p></div></section>
    <section class="demo-cta"><p class="eyebrow">MAKE YOUR OWN SPACE EXPLORABLE</p><h2>Ready to show customers your real space?</h2><a class="button button-primary" href="https://wa.me/923099652168?text=Hello%20Digital%20Twin%2C%20I%27d%20like%20a%203D%20walkthrough%20for%20my%20space." target="_blank" rel="noopener">Request a Digital Twin ↗</a></section>`;
}
