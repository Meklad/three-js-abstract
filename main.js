import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import './style.css'

// Create Canavas
const canvas = document.querySelector(".webgl");
var canvasSize = {
  width:  window.innerWidth,
  height: window.innerHeight
};

// Create Scene
const scene = new THREE.Scene();

// Create Geometry
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#287AB8"
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Set Light
const light = new THREE.PointLight(0xffffff, 100, 1000);
light.position.set(1, 10, 10);
scene.add(light);


// Create camera
const camera = new THREE.PerspectiveCamera(45, canvasSize.width / canvasSize.height, 0.1, 100);
camera.position.z = 10;
scene.add(camera);

// Add Object Control
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
control.enablePan = false;
control.enableZoom = false;
control.autoRotate = true;
control.autoRotateSpeed = 5;

// Create Renderer
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(canvasSize.width, canvasSize.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Resize Canavas When Window Resizeed
window.addEventListener("resize", () => {
  // Update Canavas Size
  canvasSize.width = window.innerWidth;
  canvasSize.height = window.innerHeight;

  // Update The Camera
  camera.aspect = canvasSize.width / canvasSize.height;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasSize.width, canvasSize.height);
});

// Create Animation Loop
const loop = () => {
  control.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

loop();