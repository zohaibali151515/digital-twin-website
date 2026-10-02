// Local, opt-in measurements for checking a tour on a physical phone.
// No readings are sent to a server.
export function createTourDiagnostics(modal) {
  if (new URLSearchParams(location.search).get('diagnostics') !== '1') {
    return { mark() {}, frame() {}, assetProgress() {} };
  }

  const started = performance.now();
  const marks = {};
  const assetBytes = new Map();
  let frames = 0;
  let lastFrameWindow = started;
  const panel = document.createElement('aside');
  panel.className = 'tour-diagnostics';
  panel.setAttribute('aria-label', 'Viewer diagnostics');
  panel.innerHTML = `
    <strong>Viewer diagnostics</strong>
    <dl>
      <div><dt>360 preview</dt><dd data-stat="preview">Waiting</dd></div>
      <div><dt>Lounge 360</dt><dd data-stat="lounge360">Not opened</dd></div>
      <div><dt>First 3D asset</dt><dd data-stat="core">Waiting</dd></div>
      <div><dt>3D shown</dt><dd data-stat="threeD">Waiting</dd></div>
      <div><dt>Café navigation</dt><dd data-stat="room">Waiting</dd></div>
      <div><dt>Café full detail</dt><dd data-stat="detail">Waiting</dd></div>
      <div><dt>Lounge 3D data</dt><dd data-stat="lounge">Waiting</dd></div>
      <div><dt>Scene data loaded</dt><dd data-stat="transfer">0.0 MB</dd></div>
      <div><dt>Page resources</dt><dd data-stat="network">0.0 MB</dd></div>
      <div><dt>Frame rate</dt><dd data-stat="fps">Waiting</dd></div>
      <div><dt>JS heap</dt><dd data-stat="heap">Unavailable</dd></div>
    </dl>
    <small>Elapsed from opening the tour. Scene data includes cached files. Page resources are browser transfer estimates for page files; they exclude 3D files loaded by the scene worker. JS heap excludes GPU memory. Nothing is uploaded.</small>
    <button class="diagnostics-copy" type="button">Copy results</button>`;
  modal.appendChild(panel);
  const set = (name, value) => { panel.querySelector(`[data-stat="${name}"]`).textContent = value; };
  const transfer = () => {
    const bytes = [...assetBytes.values()].reduce((total, value) => total + value, 0);
    set('transfer', `${(bytes / 1_000_000).toFixed(1)} MB`);
  };
  const network = () => {
    const entries = performance.getEntriesByType('resource');
    const bytes = entries.reduce((total, entry) => total + (entry.transferSize || 0), 0);
    set('network', `${(bytes / 1_000_000).toFixed(1)} MB`);
  };
  const copy = panel.querySelector('.diagnostics-copy');
  copy.addEventListener('click', async () => {
    transfer();
    network();
    const readings = [...panel.querySelectorAll('dl > div')].map(row =>
      `${row.querySelector('dt').textContent}: ${row.querySelector('dd').textContent}`
    );
    const report = ['Maikada viewer diagnostics', `Viewport: ${innerWidth} × ${innerHeight} at ${devicePixelRatio} DPR`, ...readings,
      'Connection: please add Wi-Fi or mobile data'].join('\n');
    try {
      await navigator.clipboard.writeText(report);
      copy.textContent = 'Copied — paste into chat';
    } catch {
      copy.textContent = 'Copy unavailable — send a screenshot';
    }
  });
  return {
    assetProgress(name, event) {
      if (!Number.isFinite(event.loaded)) return;
      assetBytes.set(name, Math.max(assetBytes.get(name) || 0, event.loaded));
      transfer();
      network();
    },
    mark(name) {
      if (marks[name]) return;
      marks[name] = performance.now() - started;
      set(name, `${(marks[name] / 1000).toFixed(1)} s`);
    },
    frame(idle = false) {
      frames++;
      const now = performance.now();
      if (now - lastFrameWindow < 2000) return;
      set('fps', `${Math.round(frames * 1000 / (now - lastFrameWindow))} fps${idle ? ' (idle)' : ''}`);
      network();
      if (performance.memory?.usedJSHeapSize) {
        set('heap', `${Math.round(performance.memory.usedJSHeapSize / 1048576)} MB`);
      }
      frames = 0;
      lastFrameWindow = now;
    }
  };
}
