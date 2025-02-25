import './style.css'
import * as THREE from "three";
import * as lil from "lil-gui";

const gui = new lil.GUI();
const canvas = document.querySelector(".webgl");
//必須3要素
const scene = new THREE.Scene();
//サイズ設定
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
//Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
); 
camera.position.z = 6;
scene.add(camera);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

//Material
const material = new THREE.MeshPhysicalMaterial({
  color: "#3c94d7",
  metalness: 0.86,
  roughness: 0.37,
  flatShading: true,
});

gui.addColor(material, "color");
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

//Mesh
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
  new THREE.IcosahedronGeometry,
  material
);
//回転
mesh1.position.set(2,0,0);
mesh2.position.set(-1,0,0);
mesh3.position.set(2,0,-6);
mesh4.position.set(5,0,3);
scene.add(mesh1, mesh2, mesh3, mesh4);
const meshes = [mesh1, mesh2, mesh3, mesh4];

//Particle
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 1000;
const positionArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++){
  positionArray[i] = (Math.random() - 0.5) * 10; 
}
particlesGeo.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.025,
  color: "#ffffff",
});
const particles = new THREE.Points(particlesGeo, particlesMaterial);
scene.add(particles);

//Light
const dirLight = new THREE.DirectionalLight("#ffffff", 4);
dirLight.position.set(0.5, 1, 0);
scene.add(dirLight);

//Resize
window.addEventListener("resize", (e) => {
  //size update
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //camera update
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  //renderer update
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

//Wheel Action
let speed = 0;
let rotation = 0;
window.addEventListener("wheel", e => {
  speed += e.deltaY * 0.0002;
});

function rot() {
  rotation += speed;
  speed *= 0.93;
  //All Geometry Rotating
  //x = r cosθ
  //y = r -sinθ
  //2は円の中心座標のx座標を2に設定
  //-3は円の中心座標のz座標を-3に設定
  //3.8は半径
  mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);
  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);
  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);
  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));
  requestAnimationFrame(rot);
} 
rot();

//カーソルの位置
const cursor = {};
cursor.x = 0;
cursor.y = 0;
window.addEventListener("mousemove", e => {
  //-0.5で中央揃え
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

//animation
const clock = new THREE.Clock();
const animate = () => {
  renderer.render(scene, camera);
  // 前回のフレームからの経過時間
  // 60FPSなら1フレームごとに約16ms
  // アニメーションの補正に使う（フレームレートが変動しても速度を一定に保つ）
  // getElapsedTimeはClockが作成されてからの累積時間（秒）を取得
  // 何秒経過したかを知りたいときに使う
  let deltaTime = clock.getDelta();
  //Rotating Mesh
  for (const mesh of meshes) {
    mesh.rotation.x += 0.2 * deltaTime;
    mesh.rotation.y += 0.2 * deltaTime;
  }
  //Camera control
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
  window.requestAnimationFrame(animate);
};

animate();

