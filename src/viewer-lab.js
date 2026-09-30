import { createViewer } from '@playcanvas/supersplat-viewer/viewer';
import { defaultSettings } from '@playcanvas/supersplat-viewer/settings';
import '@playcanvas/supersplat-viewer/viewer.css';

const status = document.querySelector('#status');
window.maikadaMetrics = { startedAt: performance.now(), firstFrameMs: null };
const settings = defaultSettings();
settings.background.color = [0.055, 0.078, 0.071];
const view = new URLSearchParams(location.search);
const contentUrl = `${import.meta.env.BASE_URL}assets/maikada/web-sh3-full/lod-meta.json`;
const vector = (key, fallback) => {
  const values = view.get(key)?.split(',').map(Number);
  return values?.length === 3 && values.every(Number.isFinite) ? values : fallback;
};
settings.cameras = [{ initial: { position: vector('position', [0.8, -2.2, 0.8]), target: vector('target', [0.8, -2.2, 3]), fov: 75 } }];

try {
  const viewer = await createViewer({
    container: document.querySelector('#viewer'),
    settings,
    contentUrl,
    posterUrl: `${import.meta.env.BASE_URL}maikada-poster.jpg`,
    renderer: 'webgl',
    noanim: true,
    fullload: view.has('fullload')
  });
  window.maikadaViewer = viewer;
  status.textContent = 'Loading environment…';
  viewer.events.on('progress:changed', progress => {
    status.textContent = progress >= 100 ? 'Building 3D scene…' : `Loading environment · ${Math.round(progress)}%`;
  });
  viewer.events.on('loaded:changed', loaded => {
    if (loaded) {
      viewer.state.animationPaused = true;
      viewer.state.cameraMode = 'orbit';
      viewer.resetCamera();
      window.maikadaMetrics.firstFrameMs = performance.now() - window.maikadaMetrics.startedAt;
      status.textContent = 'Digital Twin ready';
    }
  });
  viewer.events.on('error:changed', error => { if (error) status.textContent = 'Could not open 3D scene'; });
} catch (error) {
  console.error(error);
  status.textContent = 'Could not start viewer';
}
