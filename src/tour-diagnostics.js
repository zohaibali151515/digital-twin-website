// Local, opt-in measurements for checking a tour on a physical phone.
// No readings are sent to a server.
export function createTourDiagnostics(modal) {
  if (new URLSearchParams(location.search).get('diagnostics') !== '1') {
    return { mark() {}, frame() {} };
  }

  const started = performance.now();
  const marks = {};
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
      <div><dt>3D shown</dt><dd data-stat="threeD">Waiting</dd></div>
      <div><dt>Café 3D data</dt><dd data-stat="room">Waiting</dd></div>
      <div><dt>Lounge 3D data</dt><dd data-stat="lounge">Waiting</dd></div>
      <div><dt>Frame rate</dt><dd data-stat="fps">Waiting</dd></div>
      <div><dt>JS heap</dt><dd data-stat="heap">Unavailable</dd></div>
    </dl>
    <small>Elapsed from opening the tour. Frame rate is browser frame cadence; JS heap excludes GPU memory. No data is uploaded.</small>`;
  modal.appendChild(panel);
  const set = (name, value) => { panel.querySelector(`[data-stat="${name}"]`).textContent = value; };
  return {
    mark(name) {
      if (marks[name]) return;
      marks[name] = performance.now() - started;
      set(name, `${(marks[name] / 1000).toFixed(1)} s`);
    },
    frame() {
      frames++;
      const now = performance.now();
      if (now - lastFrameWindow < 2000) return;
      set('fps', `${Math.round(frames * 1000 / (now - lastFrameWindow))} fps`);
      if (performance.memory?.usedJSHeapSize) {
        set('heap', `${Math.round(performance.memory.usedJSHeapSize / 1048576)} MB`);
      }
      frames = 0;
      lastFrameWindow = now;
    }
  };
}
