import * as THREE from 'three';
import { SparkRenderer, SplatMesh } from '@sparkjsdev/spark';

const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(1024, 1024);
document.querySelector('#scene').appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color('#101517');
scene.add(new SparkRenderer({ renderer }));
const camera = new THREE.PerspectiveCamera(90, 1, 0.02, 200);
const origin = new URLSearchParams(location.search).get('origin')?.split(',').map(Number) || [0, -3.5, 2];
if (origin.length !== 3 || origin.some(value => !Number.isFinite(value))) throw new Error('Invalid panorama origin');
camera.position.set(...origin);
const meshes = ['maikada-preview.spz', 'maikada-remainder.spz', 'maikada-upper.spz'].map(name => {
  const mesh = new SplatMesh({ url: `/${name}` });
  scene.add(mesh);
  return mesh;
});
renderer.setAnimationLoop(() => renderer.render(scene, camera));
window.setPanoramaDirection = (direction, up) => {
  camera.up.set(...up);
  camera.lookAt(camera.position.clone().add(new THREE.Vector3(...direction)));
};
Promise.all(meshes.map(mesh => mesh.initialized)).then(() => {
  window.panoramaCaptureReady = true;
}).catch(error => { window.panoramaCaptureError = String(error); });
