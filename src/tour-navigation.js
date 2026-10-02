// Navigation for a Y-up scanned space. Orbit is useful for a quick look;
// Explore keeps the camera in the room and moves it like a walkthrough.
export function createTourNavigation(camera, orbit, canvas, modal) {
  const keys = new Set();
  const movement = new Set();
  const look = { yaw: 0, pitch: 0, dragging: false, x: 0, y: 0, pointerId: null };
  let mode = 'orbit';
  let room = 'cafe';
  let lastFrame = performance.now();
  const direction = () => ({
    x: Math.cos(look.pitch) * Math.cos(look.yaw),
    y: Math.sin(look.pitch),
    z: Math.cos(look.pitch) * Math.sin(look.yaw)
  });
  const syncLook = () => {
    const forward = orbit.target.clone().sub(camera.position).normalize();
    look.yaw = Math.atan2(forward.z, forward.x);
    look.pitch = Math.asin(Math.max(-1, Math.min(1, forward.y)));
  };
  const pointCamera = () => {
    const forward = direction();
    camera.lookAt(camera.position.x + forward.x, camera.position.y + forward.y, camera.position.z + forward.z);
  };
  const setMode = next => {
    if (next === mode) return;
    if (next === 'explore' || next === 'fly') {
      if (mode === 'orbit') syncLook();
      orbit.enabled = false;
      canvas.style.cursor = 'grab';
    } else {
      const forward = direction();
      orbit.target.set(camera.position.x + forward.x, camera.position.y + forward.y, camera.position.z + forward.z);
      orbit.enabled = true;
      orbit.update();
      canvas.style.cursor = '';
      keys.clear();
      movement.clear();
    }
    mode = next;
    modal.dataset.navMode = next;
    modal.querySelector('#tour-orbit').setAttribute('aria-pressed', String(next === 'orbit'));
    modal.querySelector('#tour-explore').setAttribute('aria-pressed', String(next === 'explore'));
    modal.querySelector('#tour-fly').setAttribute('aria-pressed', String(next === 'fly'));
    modal.querySelector('.tour-hint').textContent = next === 'orbit'
      ? 'Drag to orbit · Scroll or pinch to zoom · Right drag or two fingers to pan'
      : next === 'fly'
        ? 'Drag to look · W A S D to fly · Q / E down / up · Shift for speed'
        : 'Drag to look · W A S D or arrows to move · Shift to move faster';
  };
  const onPointerDown = event => {
    if (mode === 'orbit' || event.button !== 0 || modal.hidden) return;
    look.dragging = true;
    look.pointerId = event.pointerId;
    look.x = event.clientX;
    look.y = event.clientY;
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = 'grabbing';
    event.preventDefault();
  };
  const onPointerMove = event => {
    if (!look.dragging || event.pointerId !== look.pointerId) return;
    look.yaw -= (event.clientX - look.x) * 0.004;
    look.pitch = Math.max(-1.35, Math.min(1.35, look.pitch + (event.clientY - look.y) * 0.004));
    look.x = event.clientX;
    look.y = event.clientY;
    pointCamera();
  };
  const onPointerUp = event => {
    if (event.pointerId !== look.pointerId) return;
    look.dragging = false;
    look.pointerId = null;
    canvas.style.cursor = 'grab';
  };
  const onKeyDown = event => {
    if (modal.hidden || mode === 'orbit' || event.altKey || event.ctrlKey || event.metaKey) return;
    if (/^(Key[WASDQE]|Arrow(Up|Down|Left|Right)|Shift(Left|Right))$/.test(event.code)) {
      keys.add(event.code);
      event.preventDefault();
    }
  };
  const onKeyUp = event => keys.delete(event.code);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', () => { keys.clear(); movement.clear(); });
  modal.querySelectorAll('[data-move]').forEach(button => {
    const action = button.dataset.move;
    button.addEventListener('pointerdown', event => {
      if (mode === 'orbit') return;
      movement.add(action);
      button.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      button.addEventListener(name, () => movement.delete(action));
    }
  });
  syncLook();
  modal.dataset.navMode = mode;
  return {
    get mode() { return mode; },
    setRoom(next) { room = next; },
    setMode,
    resetInput() { keys.clear(); movement.clear(); look.dragging = false; },
    syncLook,
    update() {
      if (mode === 'orbit') { orbit.update(); return; }
      const now = performance.now();
      const dt = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      const forward = (keys.has('KeyW') || keys.has('ArrowUp') || movement.has('forward') ? 1 : 0)
        - (keys.has('KeyS') || keys.has('ArrowDown') || movement.has('back') ? 1 : 0);
      const side = (keys.has('KeyD') || keys.has('ArrowRight') || movement.has('right') ? 1 : 0)
        - (keys.has('KeyA') || keys.has('ArrowLeft') || movement.has('left') ? 1 : 0);
      const vertical = (keys.has('KeyE') || movement.has('up') ? 1 : 0)
        - (keys.has('KeyQ') || movement.has('down') ? 1 : 0);
      if (!forward && !side && !vertical) return;
      const speed = (keys.has('ShiftLeft') || keys.has('ShiftRight') ? (mode === 'fly' ? 4.5 : 2.3) : (mode === 'fly' ? 2.1 : 1.15)) * dt / Math.max(1, Math.hypot(forward, side, vertical));
      const forwardVector = direction();
      camera.position.x += (forwardVector.x * forward - Math.sin(look.yaw) * side) * speed;
      camera.position.z += (forwardVector.z * forward + Math.cos(look.yaw) * side) * speed;
      camera.position.y += (mode === 'fly' ? forwardVector.y * forward : 0) * speed + vertical * speed * (mode === 'fly' ? 0.35 : 1);
      if (mode === 'fly') { pointCamera(); return; }
      const area = room === 'lounge'
        ? { minX: -0.5, maxX: 2.2, minY: -0.6, maxY: 0.6, minZ: 0.4, maxZ: 3.6 }
        : { minX: -1.3, maxX: 1.2, minY: -4.1, maxY: -2.9, minZ: 0.4, maxZ: 3.6 };
      camera.position.x = Math.max(area.minX, Math.min(area.maxX, camera.position.x));
      camera.position.y = Math.max(area.minY, Math.min(area.maxY, camera.position.y));
      camera.position.z = Math.max(area.minZ, Math.min(area.maxZ, camera.position.z));
      pointCamera();
    }
  };
}
