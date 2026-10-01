import './style.css';
import './community.css';
import { communityDemos } from './community-data.js';

const phone = '923099652168';
const message = encodeURIComponent('Hello Digital Twin, I would like a 3D walkthrough for my space.');
const whatsapp = `https://wa.me/${phone}?text=${message}`;
const app = document.querySelector('#app');
const communityCards = communityDemos.map(demo => `
  <a class="community-card" href="./community.html?scene=${demo.id}" aria-label="Explore ${demo.title} community 3D demo">
    <img src="${import.meta.env.BASE_URL}${demo.image}" alt="3D preview of ${demo.title}" loading="lazy" width="960" height="960" />
    <span class="community-card-body"><small>${demo.category} / ${demo.location}</small><h3>${demo.title}</h3><p>${demo.description}</p><span class="community-credit">Independent capture by ${demo.creator} · CC BY 4.0</span><span class="community-link">Explore licensed demo ↗</span></span>
  </a>`).join('');

app.innerHTML = `
  <header class="nav shell">
    <a class="brand" href="#top" aria-label="Digital Twin home"><span class="brand-mark"><i></i><i></i><i></i></span><span>DIGITAL<span class="brand-light">TWIN</span></span></a>
    <nav aria-label="Main navigation"><a href="#work">Our work</a><a href="#services">What we do</a><a href="#process">How it works</a><a href="#about">About</a></nav>
    <a class="nav-cta" href="${whatsapp}" target="_blank" rel="noopener">Start a project <span>↗</span></a>
  </header>
  <main id="top">
    <section class="hero shell">
      <div class="hero-copy"><p class="eyebrow"><span class="pulse"></span> REALITY, MADE INTERACTIVE</p>
        <h1>Let people <em>step inside</em> your space before they arrive.</h1>
        <p class="hero-lede">Photorealistic 3D walkthroughs for venues, properties and places. Captured in the real world. Ready to explore online.</p>
        <div class="hero-actions"><a class="button button-primary" href="#work">Explore a real project <span>↗</span></a><a class="text-link" href="${whatsapp}" target="_blank" rel="noopener">Discuss your space <span>↗</span></a></div>
        <div class="hero-foot"><span>BASED IN LAHORE, PAKISTAN</span><span>CAPTURE  /  CREATE  /  SHARE</span></div>
      </div>
      <div class="hero-art" aria-hidden="true"><div class="orb orb-one"></div><div class="orb orb-two"></div><div class="grid-floor"></div><div class="hero-art-label"><span>01 / 03</span><strong>SPACES, REIMAGINED</strong></div><div class="crosshair">+</div></div>
    </section>
    <section class="ticker" aria-label="Services"><div>REALITY CAPTURE <span>✳</span> 3D WALKTHROUGHS <span>✳</span> WEB EXPERIENCES <span>✳</span> DIGITAL SPACES <span>✳</span> REALITY CAPTURE <span>✳</span> 3D WALKTHROUGHS</div></section>
    <section id="work" class="work shell section-pad"><div class="section-head"><div><p class="eyebrow">SELECTED WORK / 001</p><h2>See the difference<br><em>for yourself.</em></h2></div><p>A real space, captured in Lahore and made explorable in your browser.</p></div>
      <article class="project-card"><div class="project-visual"><img class="project-photo" src="${import.meta.env.BASE_URL}maikada-poster.jpg" alt="Interior of Maikada Cafe captured for a 3D walkthrough" loading="lazy" /><button id="open-tour" class="play-button" type="button" aria-label="Open Maikada 3D walkthrough"><span>↗</span></button><span class="project-badge">LIVE 3D CAPTURE</span></div><div class="project-info"><div><p class="eyebrow">VENUE EXPERIENCE · LAHORE</p><h3>Maikada Cafe</h3><p>Step inside a real venue through a browser-based 3D scene.</p><a href="./maikada.html" style="display:inline-block;margin-top:14px;color:#c9f27b">Read the project story ↗</a></div><button id="open-tour-text" class="project-link" type="button">Enter 3D space <span>↗</span></button></div></article>
      <p class="portfolio-note">More real spaces are coming. Every project featured here is captured or published with permission.</p>
    </section>
    <section class="community-gallery" aria-labelledby="community-title"><div class="shell"><div class="section-head"><div><p class="eyebrow">EXPLORE MORE SPACES</p><h2 id="community-title">See where 3D<br><em>can take you.</em></h2></div><p>From cafes and homes to museums and heritage sites, real spaces are ready to explore online.</p></div><p class="community-disclosure">These are independent creators' captures, shared under CC BY 4.0 and credited on each page. They show possibilities for interactive 3D; Maikada Cafe is Digital Twin's own featured capture.</p><div class="community-grid">${communityCards}</div></div></section>
    <section id="services" class="services section-pad"><div class="shell"><div class="section-head"><div><p class="eyebrow">WHAT WE MAKE</p><h2>Real spaces.<br><em>New possibilities.</em></h2></div><p>Give people a better way to discover, understand and choose your space.</p></div><div class="service-grid"><div class="service-card"><span class="service-number">01</span><div class="service-icon">⌁</div><h3>Venue walkthroughs</h3><p>Let guests explore cafes, hotels and event venues before making a booking.</p><a href="${whatsapp}" target="_blank" rel="noopener">Ask about venues ↗</a></div><div class="service-card"><span class="service-number">02</span><div class="service-icon">⌂</div><h3>Property experiences</h3><p>Show buyers and tenants the feeling of a property beyond photos and video.</p><a href="${whatsapp}" target="_blank" rel="noopener">Ask about properties ↗</a></div><div class="service-card"><span class="service-number">03</span><div class="service-icon">▧</div><h3>Space documentation</h3><p>Capture an existing space for remote review, planning and future reference.</p><a href="${whatsapp}" target="_blank" rel="noopener">Ask about capture ↗</a></div></div></div></section>
    <section id="process" class="process shell section-pad"><div class="section-head"><div><p class="eyebrow">SIMPLE FROM START TO FINISH</p><h2>Your space,<br><em>one shareable link.</em></h2></div><p>We handle the capture and the web experience. You share the result with your audience.</p></div><div class="steps"><div><span>01 / CAPTURE</span><h3>We visit your space</h3><p>We plan and scan the areas that matter to your customers.</p></div><div><span>02 / CREATE</span><h3>We build the experience</h3><p>Your real space becomes an interactive 3D walkthrough.</p></div><div><span>03 / SHARE</span><h3>You put it to work</h3><p>Use the link in WhatsApp, your website and your sales conversations.</p></div></div></section>
    <section id="about" class="about-section"><div class="shell about-inner"><div><p class="eyebrow">ABOUT DIGITAL TWIN</p><h2>Made for places people need to <em>see and understand.</em></h2></div><div><p>Digital Twin is a Lahore-based reality capture and 3D web studio. We scan real spaces and turn them into interactive experiences that people can open through a link.</p><p>Our first featured capture is Maikada Cafe in Androon Lahore. We work with venues, property teams and businesses that want to present a space clearly online.</p><a href="${whatsapp}" target="_blank" rel="noopener">Talk to us about your space ↗</a></div></div></section>
    <section id="contact" class="cta-section"><div class="shell cta-inner"><p class="eyebrow">LET'S MAKE YOUR SPACE EXPLORABLE</p><h2>Show them the place.<br><em>Before the visit.</em></h2><p>Tell us what you want to capture. We’ll suggest a practical first project and quote.</p><a class="button button-dark" href="${whatsapp}" target="_blank" rel="noopener">Message us on WhatsApp <span>↗</span></a><span class="cta-phone">+92 309 9652168</span></div></section>
  </main>
  <footer class="footer shell"><a class="brand" href="#top"><span class="brand-mark"><i></i><i></i><i></i></span><span>DIGITAL<span class="brand-light">TWIN</span></span></a><span>Real places, ready to explore.</span><span>Lahore, Pakistan · © ${new Date().getFullYear()}</span></footer>
  <div class="tour-modal" id="tour-modal" role="dialog" aria-modal="true" aria-label="Maikada Cafe 3D walkthrough" hidden><div class="tour-toolbar"><div><strong>Maikada Cafe</strong><span>3D walkthrough · Lahore</span></div><div class="tour-toolbar-actions"><span id="tour-status">Preparing scene…</span><button id="close-tour" type="button" aria-label="Close 3D walkthrough">×</button></div></div><div id="tour-canvas"></div><div class="tour-hint">Drag to look around · Scroll or pinch to zoom</div><div class="tour-loading" id="tour-loading"><div class="loading-ring"></div><strong>Opening the space</strong><span>Loading the complete 3D capture. On mobile data, this may take a moment.</span></div></div>
`;

let viewer;
let loading = false;
const modal = document.querySelector('#tour-modal');
async function openTour() {
  modal.hidden = false;
  document.body.classList.add('modal-open');
  if (viewer || loading) return;
  loading = true;
  try {
    const [THREE, { OrbitControls }, { SparkRenderer, SplatMesh }] = await Promise.all([
      import('three'),
      import('three/addons/controls/OrbitControls.js'),
      import('@sparkjsdev/spark')
    ]);
    const target = document.querySelector('#tour-canvas');
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setSize(target.clientWidth, target.clientHeight);
    target.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#101517');
    const camera = new THREE.PerspectiveCamera(70, target.clientWidth / target.clientHeight, 0.02, 200);
    camera.position.set(0, -3.5, 2);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(1, -3.5, 2);
    controls.enableDamping = true;
    controls.update();
    scene.add(new SparkRenderer({ renderer }));
    const mesh = new SplatMesh({
      url: `${import.meta.env.BASE_URL}maikada-full-upright.spz`,
      onProgress: event => {
        if (event.lengthComputable) {
          document.querySelector('#tour-status').textContent = `${Math.round(event.loaded / event.total * 100)}%`;
        }
      }
    });
    scene.add(mesh);
    renderer.setAnimationLoop(() => {
      if (modal.hidden) return;
      controls.update();
      renderer.render(scene, camera);
    });
    const resize = () => {
      camera.aspect = target.clientWidth / target.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(target.clientWidth, target.clientHeight);
    };
    window.addEventListener('resize', resize);
    viewer = { renderer, scene, camera, controls, mesh, resize };
    await mesh.initialized;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    document.querySelector('#tour-loading').hidden = true;
    document.querySelector('#tour-status').textContent = 'LIVE 3D';
  } catch (error) {
    console.error(error);
    viewer = undefined;
    document.querySelector('#tour-loading').innerHTML = '<strong>Could not open this scene</strong><span>Please try a modern browser with WebGL support, or contact us for a private demo.</span>';
    document.querySelector('#tour-status').textContent = 'UNAVAILABLE';
  } finally { loading = false; }
}
function closeTour() { modal.hidden = true; document.body.classList.remove('modal-open'); }
document.querySelector('#open-tour').addEventListener('click', openTour);
document.querySelector('#open-tour-text').addEventListener('click', openTour);
document.querySelector('#close-tour').addEventListener('click', closeTour);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeTour(); });
if (new URLSearchParams(location.search).get('tour') === 'maikada') openTour();
