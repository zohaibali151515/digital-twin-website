import './style.css';

const phone = '923099652168';
const message = encodeURIComponent('Hello Digital Twin, I would like a 3D walkthrough for my space.');
const whatsapp = `https://wa.me/${phone}?text=${message}`;
const app = document.querySelector('#app');

app.innerHTML = `
  <header class="nav shell">
    <a class="brand" href="#top" aria-label="Digital Twin home"><span class="brand-mark"><i></i><i></i><i></i></span><span>DIGITAL<span class="brand-light">TWIN</span></span></a>
    <nav aria-label="Main navigation"><a href="#work">Our work</a><a href="#services">What we do</a><a href="#process">How it works</a></nav>
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
      <article class="project-card"><div class="project-visual"><img class="project-photo" src="${import.meta.env.BASE_URL}maikada-poster.jpg" alt="Interior of Maikada Cafe captured for a 3D walkthrough" loading="lazy" /><button id="open-tour" class="play-button" type="button" aria-label="Open Maikada 3D walkthrough"><span>↗</span></button><span class="project-badge">LIVE 3D CAPTURE</span></div><div class="project-info"><div><p class="eyebrow">VENUE EXPERIENCE · LAHORE</p><h3>Maikada Cafe</h3><p>Step inside a real venue through a browser-based 3D preview.</p></div><button id="open-tour-text" class="project-link" type="button">Enter 3D space <span>↗</span></button></div></article>
      <p class="portfolio-note">More real spaces are coming. Every project featured here is captured or published with permission.</p>
    </section>
    <section id="services" class="services section-pad"><div class="shell"><div class="section-head"><div><p class="eyebrow">WHAT WE MAKE</p><h2>Real spaces.<br><em>New possibilities.</em></h2></div><p>Give people a better way to discover, understand and choose your space.</p></div><div class="service-grid"><div class="service-card"><span class="service-number">01</span><div class="service-icon">⌁</div><h3>Venue walkthroughs</h3><p>Let guests explore cafes, hotels and event venues before making a booking.</p><a href="${whatsapp}" target="_blank" rel="noopener">Ask about venues ↗</a></div><div class="service-card"><span class="service-number">02</span><div class="service-icon">⌂</div><h3>Property experiences</h3><p>Show buyers and tenants the feeling of a property beyond photos and video.</p><a href="${whatsapp}" target="_blank" rel="noopener">Ask about properties ↗</a></div><div class="service-card"><span class="service-number">03</span><div class="service-icon">▧</div><h3>Space documentation</h3><p>Capture an existing space for remote review, planning and future reference.</p><a href="${whatsapp}" target="_blank" rel="noopener">Ask about capture ↗</a></div></div></div></section>
    <section id="process" class="process shell section-pad"><div class="section-head"><div><p class="eyebrow">SIMPLE FROM START TO FINISH</p><h2>Your space,<br><em>one shareable link.</em></h2></div><p>We handle the capture and the web experience. You share the result with your audience.</p></div><div class="steps"><div><span>01 / CAPTURE</span><h3>We visit your space</h3><p>We plan and scan the areas that matter to your customers.</p></div><div><span>02 / CREATE</span><h3>We build the experience</h3><p>Your real space becomes an interactive 3D walkthrough.</p></div><div><span>03 / SHARE</span><h3>You put it to work</h3><p>Use the link in WhatsApp, your website and your sales conversations.</p></div></div></section>
    <section class="cta-section"><div class="shell cta-inner"><p class="eyebrow">LET'S MAKE YOUR SPACE EXPLORABLE</p><h2>Show them the place.<br><em>Before the visit.</em></h2><p>Tell us what you want to capture. We’ll suggest a practical first project and quote.</p><a class="button button-dark" href="${whatsapp}" target="_blank" rel="noopener">Message us on WhatsApp <span>↗</span></a><span class="cta-phone">+92 309 9652168</span></div></section>
  </main>
  <footer class="footer shell"><a class="brand" href="#top"><span class="brand-mark"><i></i><i></i><i></i></span><span>DIGITAL<span class="brand-light">TWIN</span></span></a><span>Real places, ready to explore.</span><span>Lahore, Pakistan · © ${new Date().getFullYear()}</span></footer>
  <div class="tour-modal" id="tour-modal" role="dialog" aria-modal="true" aria-label="Maikada Cafe 3D walkthrough" hidden><div class="tour-toolbar"><div><strong>Maikada Cafe</strong><span>3D walkthrough · Lahore</span></div><div class="tour-toolbar-actions"><span id="tour-status">Preparing scene…</span><button id="close-tour" type="button" aria-label="Close 3D walkthrough">×</button></div></div><div id="tour-canvas"></div><div class="tour-hint">Drag to look around · Scroll to zoom</div><div class="tour-loading" id="tour-loading"><div class="loading-ring"></div><strong>Opening the space</strong><span>The 3D scene is loading. This may take a moment on mobile data.</span></div></div>
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
    const GaussianSplats3D = await import('@mkkellogg/gaussian-splats-3d');
    const target = document.querySelector('#tour-canvas');
    viewer = new GaussianSplats3D.Viewer({
      rootElement: target,
      cameraUp: [0, 0, 1],
      initialCameraPosition: [12, -14, 5],
      initialCameraLookAt: [2, -1, -1],
      sharedMemoryForWorkers: false,
      gpuAcceleratedSort: false,
      showLoadingUI: false,
      dynamicScene: false
    });
    await viewer.addSplatScene(`${import.meta.env.BASE_URL}maikada-preview.splat`, {
      progressiveLoad: true,
      showLoadingUI: false
    });
    viewer.start();
    document.querySelector('#tour-loading').hidden = true;
    document.querySelector('#tour-status').textContent = 'LIVE VIEW';
  } catch (error) {
    console.error(error);
    document.querySelector('#tour-loading').innerHTML = '<strong>Could not open this scene</strong><span>Please try a modern browser with WebGL support, or contact us for a private demo.</span>';
    document.querySelector('#tour-status').textContent = 'UNAVAILABLE';
  } finally { loading = false; }
}
function closeTour() { modal.hidden = true; document.body.classList.remove('modal-open'); }
document.querySelector('#open-tour').addEventListener('click', openTour);
document.querySelector('#open-tour-text').addEventListener('click', openTour);
document.querySelector('#close-tour').addEventListener('click', closeTour);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeTour(); });
