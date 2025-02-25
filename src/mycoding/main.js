import "./style.css"
import * as THREE from "three";
import * as lil from "lil-gui";

const gui = new lil.GUI();
const canvas = document.querySelector(".webgl");
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  100,
);
camera.position.z = 6;
scene.add(camera);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(size.width, size.height);
// renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  renderer.setSize(size.width, size.height);
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
});

const ambiLight = new THREE.AmbientLight(
  0xffffff, 1
);
const dirLight = new THREE.DirectionalLight(
  0xffffff, 3
);
scene.add(ambiLight, dirLight);

const material = new THREE.MeshPhysicalMaterial({
  color: "#3c94d7",
  metalness: 0.86,
  roughness: 0.37,
  flatShading: true,
});

gui.addColor(material, "color");
gui.add(material, "metalness");
gui.add(material, "roughness");

const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  material
);
const mesh2 = new THREE.Mesh(
  new THREE.OctahedronGeometry(),
  material
);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
const mesh4 = new THREE.Mesh(
  new THREE.IcosahedronGeometry(),
  material
);

mesh1.position.set(2,0,0);
mesh2.position.set(-1,0,0);
mesh3.position.set(2,0,-6);
mesh4.position.set(5,0,3);
scene.add(mesh1, mesh2, mesh3, mesh4);
const meshes = [mesh1, mesh2, mesh3, mesh4];

const particleGeo = new THREE.BufferGeometry();
const particleCount = 1000;

const positionArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10;
}
particleGeo.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);
const particleMaterial = new THREE.PointsMaterial({
  size: 0.025,
  color: 0xffffff,
})

const particles = new THREE.Points(particleGeo, particleMaterial);
scene.add(particles);

let speed = 0;
let rotation = 0;
window.addEventListener("wheel", e => {
  speed += e.deltaY * 0.0002;
});

function rotate() {
  rotation += speed;
  speed *= 0.93;
  mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);
  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);
  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);
  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));
  requestAnimationFrame(rotate);
}
rotate();

const cursor = {};
cursor.x = 0;
cursor.y = 0;
window.addEventListener("mousemove", e => {
  cursor.x = e.clientX / size.width - 0.5;
  cursor.y = e.clientY / size.height - 0.5;
});
const clock = new THREE.Clock();
function animate() {
  renderer.render(scene, camera);

  let deltaTime = clock.getDelta();
  for (const mesh of meshes) {
    mesh.rotation.x += 0.2 * deltaTime;
    mesh.rotation.y += 0.2 * deltaTime;
  }
  camera.position.x += cursor.x * deltaTime * 1;
  if (camera.position.x > 1) {
    camera.position.x = 1;
  } else if (camera.position.x < -1) {
    camera.position.x = -1;
  }
  camera.position.y += -cursor.y * deltaTime * 1;
  if (camera.position.y > 1) {
    camera.position.y = 1;
  } else if (camera.position.y < -1) {
    camera.position.y = -1
  }
  requestAnimationFrame(animate);
}
animate();