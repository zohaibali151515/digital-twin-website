import './style.css';
import './community.css';
import { communityDemos } from './community-data.js';
import { createTourNavigation } from './tour-navigation.js';
import { createTourPanorama } from './tour-panorama.js';
import { createTourDiagnostics } from './tour-diagnostics.js';

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
        <div class="hero-actions"><button id="hero-primary-tour" class="button button-primary" type="button">Explore a real project <span>↗</span></button><a class="text-link" href="${whatsapp}" target="_blank" rel="noopener">Discuss your space <span>↗</span></a></div>
        <div class="hero-foot"><span>BASED IN LAHORE, PAKISTAN</span><span>CAPTURE  /  CREATE  /  SHARE</span></div>
      </div>
      <div class="hero-art"><img class="hero-photo" src="${import.meta.env.BASE_URL}maikada-hero.webp" alt="Real 3D capture of Maikada Cafe's colourful lounge in Lahore" width="800" height="1000" fetchpriority="high" /><div class="hero-art-label"><span>LIVE CAPTURE</span><strong>MAIKADA CAFE · LAHORE</strong></div><button id="hero-open-tour" class="hero-entry" type="button">Enter the real 3D tour <span>↗</span></button></div>
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
  <div class="tour-modal" id="tour-modal" role="dialog" aria-modal="true" aria-label="Maikada Cafe 3D walkthrough" hidden><div class="tour-toolbar"><div><strong>Maikada Cafe</strong><span>3D walkthrough · Lahore</span></div><div class="tour-toolbar-actions"><span id="tour-status">Preparing scene…</span><button id="close-tour" type="button" aria-label="Close 3D walkthrough">×</button></div></div><div id="tour-canvas"></div><div class="tour-rooms" aria-label="Explore rooms"><button id="tour-brick" type="button" aria-pressed="true">Café room</button><button id="tour-lounge" type="button" aria-pressed="false" disabled title="Loading lounge">Lounge</button></div><div class="tour-hint">Drag to orbit / Scroll or pinch to zoom / Right drag or two fingers to pan</div><div class="tour-move" aria-label="Walkthrough movement controls"><button type="button" data-move="forward" aria-label="Move forward">&uarr;</button><button type="button" data-move="left" aria-label="Move left">&larr;</button><button type="button" data-move="back" aria-label="Move backward">&darr;</button><button type="button" data-move="right" aria-label="Move right">&rarr;</button><button type="button" data-move="up" aria-label="Fly up">Up</button><button type="button" data-move="down" aria-label="Fly down">Down</button></div><div class="tour-help" id="tour-help-panel" hidden><strong>Explore Maikada</strong><p><b>Orbit:</b> drag to turn, scroll or pinch to zoom, right drag or two fingers to pan.</p><p><b>Explore:</b> drag to look around. Use W A S D or arrow keys to move, Q / E for down / up, and Shift to move faster. On a phone, use the arrow buttons.</p><p><b>Fly:</b> move in the direction you look. W A S D or arrows move, Q / E descend / ascend, and Shift increases speed. On a phone, use the arrows and Up / Down.</p><p>Use Cafe room or Lounge to jump between spaces. Reset returns to the entrance.</p></div><div class="tour-controls" aria-label="Viewer controls"><button id="tour-orbit" type="button" aria-pressed="true" title="Orbit view">Orbit</button><button id="tour-explore" type="button" aria-pressed="false" title="Move through the space" disabled>Explore</button><button id="tour-fly" type="button" aria-pressed="false" title="Fly freely through the scan" disabled>Fly</button><button id="tour-reset" type="button" aria-label="Reset view">Reset</button><button id="tour-help" type="button" aria-expanded="false" aria-controls="tour-help-panel">Controls</button><button id="tour-fullscreen" type="button" aria-label="Toggle fullscreen">Fullscreen</button></div><div class="tour-loading" id="tour-loading" style="background-image:linear-gradient(#101517d9,#101517e8),url('${import.meta.env.BASE_URL}maikada-poster.jpg')"><div class="loading-ring"></div><strong>Opening the café room</strong><span>The full room and lounge will appear as the scan loads.</span><div class="tour-progress" aria-hidden="true"><span id="tour-progress-bar"></span></div></div></div>
`;

let viewer;
let loading = false;
const modal = document.querySelector('#tour-modal');
async function openTour() {
  modal.hidden = false;
  document.body.classList.add('modal-open');
  if (viewer || loading) return;
  loading = true;
  const diagnostics = createTourDiagnostics(modal);
  try {
    const [THREE, { OrbitControls }] = await Promise.all([
      import('three'),
      import('three/addons/controls/OrbitControls.js')
    ]);
    const target = document.querySelector('#tour-canvas');
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(target.clientWidth, target.clientHeight);
    target.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#101517');
    const camera = new THREE.PerspectiveCamera(target.clientWidth < 600 ? 95 : 70, target.clientWidth / target.clientHeight, 0.02, 200);
    camera.position.set(0, -3.5, 2);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(1, -3.5, 2);
    controls.enableDamping = true;
    controls.update();
    const navigation = createTourNavigation(camera, controls, renderer.domElement, modal);
    const heldPointers = new Set();
    let lastInteraction = 0;
    const touched = () => { lastInteraction = performance.now(); };
    renderer.domElement.addEventListener('pointerdown', event => { heldPointers.add(event.pointerId); touched(); });
    renderer.domElement.addEventListener('pointermove', event => { if (heldPointers.has(event.pointerId)) touched(); });
    window.addEventListener('pointerup', event => { heldPointers.delete(event.pointerId); touched(); });
    window.addEventListener('pointercancel', event => { heldPointers.delete(event.pointerId); touched(); });
    renderer.domElement.addEventListener('wheel', touched, { passive: true });
    let panorama;
    try {
      panorama = await createTourPanorama(THREE, import.meta.env.BASE_URL);
    } catch (error) {
      console.warn('Panorama unavailable; opening 3D scene directly:', error);
    }
    let panoramaActive = Boolean(panorama);
    let panoramaRoom = 'cafe';
    let panoramaLoading = false;
    let scanHasPixels = false;
    let loungeHasPixels = false;
    let loungeVisibleFrames = 0;
    let previewReady = false;
    let roomReady = false;
    let detailReady = false;
    let upperReady = false;
    const gl = renderer.getContext();
    const pixel = new Uint8Array(4);
    controls.enableZoom = false;
    controls.enablePan = false;
    if (panoramaActive) {
      diagnostics.mark('preview');
      document.querySelector('#tour-loading').hidden = true;
      document.querySelector('#tour-status').textContent = '360 preview · loading 3D';
      document.querySelector('.tour-hint').textContent = '360 preview · Drag to look around while the 3D walkthrough loads';
    }
    let qualityWindowStart = 0;
    let qualityFrames = 0;
    let qualityReady = false;
    let qualityCalibrated = false;
    let fullQualityWindowStarted = false;
    let smoothMotion = false;
    let lastScanProbe = 0;
    let lastRenderedAt = 0;
    const lastRenderedPosition = camera.position.clone();
    const lastRenderedRotation = camera.quaternion.clone();
    const viewDirection = new THREE.Vector3();
    const show3D = () => {
      if (!panoramaActive) return;
      if (panoramaRoom === 'cafe' && !scanHasPixels) return;
      if (panoramaRoom === 'lounge' && !loungeHasPixels) return;
      panoramaActive = false;
      panorama?.dispose();
      panorama = undefined;
      diagnostics.mark('threeD');
      qualityReady = true;
      if (!roomReady) {
        controls.minAzimuthAngle = -Math.PI / 2 - 0.17;
        controls.maxAzimuthAngle = -Math.PI / 2 + 0.17;
        controls.minPolarAngle = Math.PI / 2 - 0.07;
        controls.maxPolarAngle = Math.PI / 2 + 0.07;
        document.querySelector('#tour-status').textContent = 'Completing room…';
        document.querySelector('.tour-hint').textContent = 'Look around · Full navigation is loading';
      } else {
        document.querySelector('#tour-status').textContent = panoramaRoom === 'lounge' && upperReady
          ? 'Lounge 3D ready'
          : detailReady ? (upperReady ? 'LIVE 3D' : 'Café 3D ready') : 'Café 3D · refining detail';
        document.querySelector('.tour-hint').textContent = 'Drag to orbit / Scroll or pinch to zoom / Right drag or two fingers to pan';
      }
    };
    const showPanoramaRoom = async name => {
      if (panoramaLoading) return;
      if ((name === 'cafe' && roomReady && panoramaRoom === 'cafe' && scanHasPixels)
        || (name === 'lounge' && loungeHasPixels)) {
        panoramaRoom = name;
        const position = name === 'cafe' ? [0, -3.5, 2] : [1, 0, 2];
        const lookAt = name === 'cafe' ? [1, -3.5, 2] : [2, 0, 2];
        camera.position.set(...position);
        controls.target.set(...lookAt);
        controls.update();
        navigation.syncLook();
        show3D();
        roomButtons.forEach(button => button.setAttribute('aria-pressed', String(button === (name === 'cafe' ? roomButtons[0] : roomButtons[1]))));
        return;
      }
      if (!panoramaActive || panoramaRoom !== name) {
        panoramaLoading = true;
        document.querySelector('#tour-status').textContent = `Opening ${name === 'cafe' ? 'café' : 'lounge'} preview…`;
        try {
          const next = await createTourPanorama(THREE, import.meta.env.BASE_URL, name === 'cafe' ? 'pano' : 'lounge');
          panorama?.dispose();
          panorama = next;
          panoramaActive = true;
          if (name === 'cafe' && panoramaRoom !== 'cafe') scanHasPixels = false;
          panoramaRoom = name;
          if (name === 'lounge') diagnostics.mark('lounge360');
        } catch (error) {
          console.error('Could not open panorama room:', error);
          document.querySelector('#tour-status').textContent = 'Preview unavailable';
          return;
        } finally { panoramaLoading = false; }
      }
      navigation.setMode('orbit');
      camera.position.set(...(name === 'cafe' ? [0, -3.5, 2] : [1, 0, 2]));
      controls.target.set(...(name === 'cafe' ? [1, -3.5, 2] : [2, 0, 2]));
      controls.update();
      navigation.syncLook();
      roomButtons.forEach(button => button.setAttribute('aria-pressed', String(button === (name === 'cafe' ? roomButtons[0] : roomButtons[1]))));
      document.querySelector('#tour-status').textContent = `360 ${name === 'cafe' ? 'café' : 'lounge'} · loading 3D`;
      document.querySelector('.tour-hint').textContent = '360 preview · Drag to look around while the 3D walkthrough loads';
    };
    renderer.setAnimationLoop(() => {
      if (modal.hidden) return;
      navigation.update();
      const frameNow = performance.now();
      const cameraMoved = camera.position.distanceToSquared(lastRenderedPosition) > 0.000001
        || camera.quaternion.angleTo(lastRenderedRotation) > 0.0005;
      const idle = qualityCalibrated && detailReady && upperReady && !panoramaActive
        && heldPointers.size === 0 && !navigation.isMoving
        && frameNow - lastInteraction > 1000 && !cameraMoved;
      if (idle && frameNow - lastRenderedAt < 400) return;
      if (smoothMotion && detailReady && viewer?.previewTail) {
        viewer.previewTail.visible = heldPointers.size === 0 && !navigation.isMoving
          && performance.now() - lastInteraction > 500;
      }
      if (panoramaActive) {
        camera.getWorldDirection(viewDirection);
        const facingEntry = viewDirection.x > Math.cos(0.12);
        const now = performance.now();
        const probeEntry = previewReady && panoramaRoom === 'cafe' && facingEntry && !scanHasPixels;
        const probeLounge = upperReady && panoramaRoom === 'lounge' && !loungeHasPixels;
        if ((probeEntry || probeLounge) && now - lastScanProbe > 150) {
          lastScanProbe = now;
          renderer.render(scene, camera);
          if (probeEntry) {
            for (const [x, y] of [[0.5, 0.5], [0.35, 0.5], [0.65, 0.5]]) {
              gl.readPixels(Math.floor(renderer.domElement.width * x), Math.floor(renderer.domElement.height * y), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
              if (Math.abs(pixel[0] - 16) + Math.abs(pixel[1] - 21) + Math.abs(pixel[2] - 23) > 60) {
                scanHasPixels = true;
                break;
              }
            }
          }
          if (probeLounge) {
            gl.readPixels(Math.floor(renderer.domElement.width * 0.5), Math.floor(renderer.domElement.height * 0.75), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
            loungeVisibleFrames = Math.abs(pixel[0] - 16) + Math.abs(pixel[1] - 21) + Math.abs(pixel[2] - 23) > 90
              ? loungeVisibleFrames + 1 : 0;
            loungeHasPixels = loungeVisibleFrames >= 3;
          }
        }
        if (previewReady && facingEntry && scanHasPixels) show3D();
        if (loungeHasPixels && panoramaRoom === 'lounge') show3D();
        if (panoramaActive) {
          panorama.update(camera);
          renderer.render(panorama.scene, camera);
        }
      } else {
        renderer.render(scene, camera);
      }
      lastRenderedAt = frameNow;
      lastRenderedPosition.copy(camera.position);
      lastRenderedRotation.copy(camera.quaternion);
      diagnostics.frame(idle);
      if (qualityReady && !qualityCalibrated) {
        const now = frameNow;
        if (detailReady && upperReady && !fullQualityWindowStarted) {
          qualityWindowStart = 0;
          qualityFrames = 0;
          fullQualityWindowStarted = true;
        }
        if (!qualityWindowStart) qualityWindowStart = now;
        qualityFrames++;
        if (now - qualityWindowStart >= 5000) {
          const fps = qualityFrames * 1000 / (now - qualityWindowStart);
          if (fps < 35 && renderer.getPixelRatio() > 1.25) {
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
            renderer.setSize(target.clientWidth, target.clientHeight);
          }
          if (fps < 25) smoothMotion = true;
          if (fullQualityWindowStarted) qualityCalibrated = true;
          qualityWindowStart = now;
          qualityFrames = 0;
        }
      }
    });
    const resize = () => {
      camera.aspect = target.clientWidth / target.clientHeight;
      camera.fov = target.clientWidth < 600 ? 95 : 70;
      camera.updateProjectionMatrix();
      renderer.setSize(target.clientWidth, target.clientHeight);
    };
    window.addEventListener('resize', resize);
    viewer = { renderer, scene, camera, controls, navigation, resize, showPanoramaRoom,
      get panoramaActive() { return panoramaActive; },
      get roomReady() { return roomReady; },
      get upperReady() { return upperReady; },
      get smoothMotion() { return smoothMotion; },
      resetMotion() { heldPointers.clear(); lastInteraction = 0; if (viewer?.previewTail) viewer.previewTail.visible = true; } };
    if (panoramaActive) {
      roomButtons[1].disabled = false;
      roomButtons[1].textContent = 'Lounge (360)';
      roomButtons[1].title = 'Open fast 360 lounge preview';
    }
    const { SparkRenderer, SplatMesh } = await import('@sparkjsdev/spark');
    scene.add(new SparkRenderer({ renderer }));
    const preview = new SplatMesh({
      url: `${import.meta.env.BASE_URL}maikada-preview-core.spz`,
      onProgress: event => {
        diagnostics.assetProgress('core', event);
        if (event.lengthComputable) {
          const percent = Math.round(event.loaded / event.total * 100);
          document.querySelector('#tour-status').textContent = `3D loading ${percent}%`;
        }
      }
    });
    viewer.preview = preview;
    scene.add(preview);
    await preview.initialized;
    diagnostics.mark('core');
    previewReady = true;
    if (!panoramaActive) {
      document.querySelector('#tour-loading').hidden = true;
      qualityReady = true;
      diagnostics.mark('threeD');
    }
    document.querySelector('#tour-status').textContent = panoramaActive ? 'Finishing 3D room…' : 'Completing room…';
    const remainder = new SplatMesh({
      url: `${import.meta.env.BASE_URL}maikada-remainder.spz`,
      onProgress: event => diagnostics.assetProgress('room', event)
    });
    viewer.remainder = remainder;
    scene.add(remainder);
    await remainder.initialized;
    await new Promise(resolve => setTimeout(resolve, 1500));
    roomReady = true;
    show3D();
    diagnostics.mark('room');
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    controls.enablePan = true;
    controls.enableZoom = true;
    document.querySelector('#tour-explore').disabled = false;
    document.querySelector('#tour-fly').disabled = false;
    document.querySelector('.tour-hint').textContent = panoramaActive
      ? '360 preview · Drag to look around while the 3D walkthrough loads'
      : 'Drag to orbit / Scroll or pinch to zoom / Right drag or two fingers to pan';
    document.querySelector('#tour-status').textContent = panoramaActive && panoramaRoom === 'lounge'
      ? '360 lounge · full 3D loading'
      : 'Café 3D · refining detail';
    const loadTail = async () => {
      const previewTail = new SplatMesh({
        url: `${import.meta.env.BASE_URL}maikada-preview-tail.spz`,
        onProgress: event => diagnostics.assetProgress('detail', event)
      });
      viewer.previewTail = previewTail;
      scene.add(previewTail);
      try {
        await previewTail.initialized;
        detailReady = true;
        diagnostics.mark('detail');
        if (!panoramaActive && panoramaRoom === 'cafe') document.querySelector('#tour-status').textContent = 'Café 3D ready';
      } catch (error) {
        console.error('Could not load café detail:', error);
        scene.remove(previewTail);
        if (panoramaRoom === 'cafe') document.querySelector('#tour-status').textContent = 'Café 3D · detail unavailable';
      }
    };
    const loadUpper = async () => {
      const upper = new SplatMesh({
        url: `${import.meta.env.BASE_URL}maikada-upper.spz`,
        onProgress: event => diagnostics.assetProgress('lounge', event)
      });
      viewer.upper = upper;
      scene.add(upper);
      try {
        await upper.initialized;
        upperReady = true;
        diagnostics.mark('lounge');
        roomButtons[1].textContent = 'Lounge';
        document.querySelector('#tour-lounge').disabled = false;
        document.querySelector('#tour-lounge').title = 'Explore the lounge';
        document.querySelector('#tour-status').textContent = panoramaActive && panoramaRoom === 'lounge'
          ? 'Finishing lounge 3D…'
          : (detailReady ? 'LIVE 3D' : 'LIVE 3D · detail incomplete');
        show3D();
      } catch (error) {
        console.error('Could not load lounge:', error);
        scene.remove(upper);
        document.querySelector('#tour-status').textContent = panoramaRoom === 'lounge'
          ? 'Lounge 360 · 3D unavailable' : 'Café room ready';
        document.querySelector('#tour-lounge').title = 'Lounge unavailable';
      }
    };
    if (panoramaRoom === 'lounge') {
      await loadUpper();
      await loadTail();
    } else {
      await loadTail();
      await loadUpper();
    }
  } catch (error) {
    console.error(error);
    viewer = undefined;
    const overlay = document.querySelector('#tour-loading');
    overlay.hidden = false;
    overlay.innerHTML = '<strong>Could not finish this scene</strong><span>Check your connection and reload the page to try again.</span><button type="button" id="retry-tour">Reload tour</button>';
    document.querySelector('#retry-tour').addEventListener('click', () => location.reload());
    document.querySelector('#tour-status').textContent = 'UNAVAILABLE';
  } finally { loading = false; }
}
function closeTour() {
  if (document.fullscreenElement === modal) document.exitFullscreen().catch(() => {});
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  viewer?.navigation.resetInput();
  viewer?.resetMotion();
  document.querySelector('#tour-help-panel').hidden = true;
  document.querySelector('#tour-help').setAttribute('aria-expanded', 'false');
}
document.querySelector('#open-tour').addEventListener('click', openTour);
document.querySelector('#open-tour-text').addEventListener('click', openTour);
document.querySelector('#hero-open-tour').addEventListener('click', openTour);
document.querySelector('#hero-primary-tour').addEventListener('click', openTour);
document.querySelector('#close-tour').addEventListener('click', closeTour);
const roomButtons = [document.querySelector('#tour-brick'), document.querySelector('#tour-lounge')];
function goToRoom(position, target, activeButton) {
  if (!viewer) return;
  viewer.camera.position.set(...position);
  viewer.controls.target.set(...target);
  if (viewer.navigation.mode !== 'orbit') viewer.camera.lookAt(...target);
  viewer.controls.update();
  viewer.navigation.syncLook();
  viewer.navigation.setRoom(activeButton === roomButtons[1] ? 'lounge' : 'cafe');
  roomButtons.forEach(button => button.setAttribute('aria-pressed', String(button === activeButton)));
}
roomButtons[0].addEventListener('click', () => {
  if (viewer?.panoramaActive) viewer.showPanoramaRoom('cafe');
  else goToRoom([0, -3.5, 2], [1, -3.5, 2], roomButtons[0]);
});
roomButtons[1].addEventListener('click', () => {
  if (viewer?.upperReady) goToRoom([1, 0, 2], [2, 0, 2], roomButtons[1]);
  else viewer?.showPanoramaRoom('lounge');
});
document.querySelector('#tour-orbit').addEventListener('click', () => viewer?.navigation.setMode('orbit'));
document.querySelector('#tour-explore').addEventListener('click', () => viewer?.navigation.setMode('explore'));
document.querySelector('#tour-fly').addEventListener('click', () => viewer?.navigation.setMode('fly'));
document.querySelector('#tour-help').addEventListener('click', () => {
  const panel = document.querySelector('#tour-help-panel');
  panel.hidden = !panel.hidden;
  document.querySelector('#tour-help').setAttribute('aria-expanded', String(!panel.hidden));
});
document.querySelector('#tour-reset').addEventListener('click', () => {
  if (!viewer) return;
  goToRoom([0, -3.5, 2], [1, -3.5, 2], roomButtons[0]);
});
const fullscreenButton = document.querySelector('#tour-fullscreen');
fullscreenButton.hidden = !document.fullscreenEnabled;
fullscreenButton.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement === modal) await document.exitFullscreen();
    else await modal.requestFullscreen();
  } catch (error) { console.warn('Fullscreen unavailable:', error); }
});
document.addEventListener('fullscreenchange', () => {
  fullscreenButton.textContent = document.fullscreenElement === modal ? 'Exit fullscreen' : 'Fullscreen';
  viewer?.resize();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeTour(); });
if (new URLSearchParams(location.search).get('tour') === 'maikada') openTour();
