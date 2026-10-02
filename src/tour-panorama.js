// Six views rendered from the Maikada scan at the entry camera position.
// The skybox follows the camera, so it offers rotation only until 3D is ready.
export async function createTourPanorama(THREE, baseUrl, prefix = 'pano') {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#101517');
  const group = new THREE.Group();
  scene.add(group);
  const loader = new THREE.TextureLoader();
  const faces = [
    ['px', [1, 0, 0], [0, 1, 0]],
    ['nx', [-1, 0, 0], [0, 1, 0]],
    ['pz', [0, 0, 1], [0, 1, 0]],
    ['nz', [0, 0, -1], [0, 1, 0]],
    ['py', [0, 1, 0], [0, 0, -1]],
    ['ny', [0, -1, 0], [0, 0, 1]]
  ];
  const geometry = new THREE.PlaneGeometry(2, 2);
  const textures = await Promise.all(faces.map(async ([name]) => {
    const texture = await loader.loadAsync(`${baseUrl}maikada/panorama/${prefix}-${name}.jpg`);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }));
  faces.forEach(([name, direction, vertical], index) => {
    const forward = new THREE.Vector3(...direction);
    const up = new THREE.Vector3(...vertical);
    const right = new THREE.Vector3().crossVectors(forward, up);
    const inward = new THREE.Vector3().crossVectors(right, up);
    const rotation = new THREE.Matrix4().makeBasis(right, up, inward);
    const material = new THREE.MeshBasicMaterial({ map: textures[index], side: THREE.FrontSide, depthWrite: false });
    const panel = new THREE.Mesh(geometry, material);
    panel.position.copy(forward);
    panel.quaternion.setFromRotationMatrix(rotation);
    group.add(panel);
  });
  return {
    scene,
    update(camera) { group.position.copy(camera.position); },
    dispose() {
      group.children.forEach(panel => panel.material.dispose());
      geometry.dispose();
      textures.forEach(texture => texture.dispose());
    }
  };
}
