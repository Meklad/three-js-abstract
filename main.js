import * as THREE from 'three'
import gsap from 'gsap';
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
  color: "#287AB8",
  roughness: 0.45
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Set Light
const light = new THREE.PointLight(0xffffff, 100, 1000);
light.position.set(1, 10, 10);
light.intensity = 150;
scene.add(light);


// Create camera
const camera = new THREE.PerspectiveCamera(45, canvasSize.width / canvasSize.height, 0.1, 100);
camera.position.z = 12;
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

// Timeline Animations
const timeline = gsap.timeline({
  defaults: {
    duration: 2
  }
});

timeline.fromTo(mesh.scale, {
  z:0,
  x:0,
  y:0
}, {
  z:1,
  x:1,
  y:1
});

timeline.fromTo("nav", {y: "-100%"}, {y:"0%"});
timeline.fromTo("h1", {opacity: 0}, {opacity: 1});

// Mouse Animation
let mouseDown = false;
let rgb = [];

window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));
window.addEventListener("mousemove", (e) => {
  if(mouseDown) {
    rgb = [
      Math.round((e.pageX / canvasSize.width) * 255),
      Math.round((e.pageY / canvasSize.height) * 255),
      150
    ];

    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);

    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b
    });
  }
});