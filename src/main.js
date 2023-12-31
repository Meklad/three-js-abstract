import "./bootstrap"
import * as THREE from 'three'
import gsap from 'gsap';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import getStarfield from "./custom-shaders/getStarfield";
import {getFresnelMat} from "./custom-shaders/getFresnelMat";

// Create Canavas
const canvas = document.querySelector(".webgl");
var canvasSize = {
  width:  window.innerWidth,
  height: window.innerHeight
};


// Create Scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(75, canvasSize.width / canvasSize.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Add Object Control
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
control.enableZoom = true;

// Create Renderer
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setSize(canvasSize.width, canvasSize.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Create Local Group
const localGroup = new THREE.Group();
localGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(localGroup);

// Create Geometry
const detail = 12;
const geometry = new THREE.IcosahedronGeometry(1, detail);
const loader = new THREE.TextureLoader();
const material = new THREE.MeshStandardMaterial({
  map: loader.load("/assets/images/textures/earth_day.jpg")
});
const earthMesh = new THREE.Mesh(geometry, material);
localGroup.add(earthMesh);

// Create Earth Ligth
const earthLightMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("/assets/images/textures/earth_light.jpg"),
  blending: THREE.AdditiveBlending
});
const earthLightMesh = new THREE.Mesh(geometry, earthLightMaterial);
localGroup.add(earthLightMesh);

// Create Earth Cloude Mesh
const earthCloudeMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("/assets/images/textures/earth_clouds.jpg"),
  // transparent: true,
  opacity: 0.1,
  blending: THREE.AdditiveBlending
});
const earthCloudeMesh = new THREE.Mesh(geometry, earthCloudeMaterial);
earthCloudeMesh.scale.setScalar(1.009);
localGroup.add(earthCloudeMesh);

// Create Earth Glow
const earthFresnelMaterial = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, earthFresnelMaterial);
glowMesh.scale.setScalar(1.01);
localGroup.add(glowMesh);

// Create Starts Field
const starsfield = getStarfield({numStars: 2000});
scene.add(starsfield);

// Set Sun Light
const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

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
const animate = () => {
  requestAnimationFrame(animate);
  earthMesh.rotation.y += 0.002;
  earthLightMesh.rotation.y += 0.002;
  earthCloudeMesh.rotation.y += 0.0024;
  glowMesh.rotation.y += 0.002;
  control.update();
  renderer.render(scene, camera);

}

animate();

var spaceAudio = new Audio("/assets/audio/space.mp3")
var promise = spaceAudio.play();

if (promise !== undefined) {
  promise.then(_ => {
    spaceAudio.play();
  }).catch(error => {
    console.log(error);
  });
}

// Timeline Animations
const timeline = gsap.timeline({
  defaults: {
    duration: 2
  }
});

timeline.fromTo(localGroup.scale, {
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