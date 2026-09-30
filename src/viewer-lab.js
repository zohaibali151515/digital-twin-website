import { createViewer } from '@playcanvas/supersplat-viewer/viewer';
import { defaultSettings } from '@playcanvas/supersplat-viewer/settings';
import '@playcanvas/supersplat-viewer/viewer.css';

const status = document.querySelector('#status');
window.maikadaMetrics = { startedAt: performance.now(), firstFrameMs: null };
const settings = defaultSettings();
settings.background.color = [0.055, 0.078, 0.071];
settings.cameras = [{ initial: { position: [12, 5, 14], target: [2, -1, 1], fov: 75 } }];

try {
  const viewer = await createViewer({
    container: document.querySelector('#viewer'),
    settings,
    contentUrl: `${import.meta.env.BASE_URL}assets/maikada/web/lod-meta.json`,
    posterUrl: `${import.meta.env.BASE_URL}maikada-poster.jpg`,
    webgl: true
  });
  window.maikadaViewer = viewer;
  viewer.events.on('progress:changed', progress => { status.textContent = `Loading scene · ${Math.round(progress)}%`; });
  viewer.events.on('loaded:changed', loaded => {
    if (loaded) {
      window.maikadaMetrics.firstFrameMs = performance.now() - window.maikadaMetrics.startedAt;
      status.textContent = 'Scene ready · refining detail';
    }
  });
  viewer.events.on('error:changed', error => { if (error) status.textContent = `Scene error: ${error}`; });
} catch (error) {
  console.error(error);
  status.textContent = 'Could not start viewer';
}
