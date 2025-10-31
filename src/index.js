import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";

let scene, renderer;
let camera;
let info;
let grid;
let estrella,
  Planetas = [],
  Lunas = [];
let t0 = 0;
let accglobal = 0.001;
let timestamp;
let raycaster;
let mouse;
let sombra = false;
let flyControls;
let useFly = true;
let camcontrols;
let creationMode = false;
let planetData = {
  Mercurio: {
    radio: 2439.7,
    distancia: 0.39,
    diasTerrestres: 58.6,
    velocidad: 47.4,
    satelites: 0,
    descripcion: "Es el planeta más cercano al Sol. Día más largo que su año.",
  },
  Venus: {
    radio: 6051.8,
    distancia: 0.72,
    diasTerrestres: 243,
    velocidad: 35,
    satelites: 0,
    descripcion:
      "Tiene una densa atmósfera de CO₂; efecto invernadero extremo.",
  },
  Tierra: {
    radio: 6371,
    distancia: 1.0,
    diasTerrestres: 1,
    velocidad: 29.8,
    satelites: "1 (Luna)",
    descripcion: "Nuestro hogar, con agua líquida y vida.",
  },
  Marte: {
    radio: 3389.5,
    distancia: 1.52,
    diasTerrestres: 1.03,
    velocidad: 24.1,
    satelites: "2 (Fobos y Deimos)",
    descripcion: "Planeta rojo, montañas y cañones gigantes.",
  },
  Júpiter: {
    radio: 69911,
    distancia: 5.2,
    diasTerrestres: 0.41,
    velocidad: 13.1,
    satelites: "97 (Destacados: Europa, Ío, Ganímedes)",
    descripcion: "Gigante gaseoso con la Gran Mancha Roja.",
  },
  Saturno: {
    radio: 58232,
    distancia: 9.58,
    diasTerrestres: 0.44,
    velocidad: 9.7,
    satelites: "274 (Destacados: Titán, Rea)",
    descripcion: "Famoso por sus anillos de hielo y roca.",
  },
  Urano: {
    radio: 25362,
    distancia: 19.2,
    diasTerrestres: 0.72,
    velocidad: 6.8,
    satelites: "29 (Destacados: Titania, Oberón)",
    descripcion: "Gira de lado; color azul verdoso por metano.",
  },
  Neptuno: {
    radio: 24622,
    distancia: 30.1,
    diasTerrestres: 0.67,
    velocidad: 5.4,
    satelites: "16 (Destacados: Tritón, Halimede)",
    descripcion: "Planeta más lejano; vientos extremadamente rápidos.",
  },
};

init();
animationLoop();

function init() {
  //Defino cámara y los controles
  scene = new THREE.Scene();
  scene.background = new THREE.TextureLoader().load("textures/2k_stars.jpg");
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 45);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (sombra) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  document.body.appendChild(renderer.domElement);

  flyControls = new FlyControls(camera, renderer.domElement);
  flyControls.dragToLook = true;
  flyControls.movementSpeed = 0.001;
  flyControls.rollSpeed = 0.001;

  camcontrols = new OrbitControls(camera, renderer.domElement);
  camcontrols.enabled = false;

  // Definimos texturas
  const sun_tex = new THREE.TextureLoader().load("textures/2k_sun.jpg");

  const mercury_tex = new THREE.TextureLoader().load("textures/2k_mercury.jpg");
  const venus_tex = new THREE.TextureLoader().load(
    "textures/2k_venus_surface.jpg"
  );
  const venus_texat = new THREE.TextureLoader().load(
    "textures/2k_venus_atmosphere.jpg"
  );
  const earth_tex = new THREE.TextureLoader().load(
    "textures/2k_earth_daymap.jpg"
  );
  const earth_texat = new THREE.TextureLoader().load(
    "textures/2k_earth_clouds.jpg"
  );
  const mars_tex = new THREE.TextureLoader().load("textures/2k_mars.jpg");
  const jupiter_tex = new THREE.TextureLoader().load("textures/2k_jupiter.jpg");
  const saturn_tex = new THREE.TextureLoader().load("textures/2k_saturn.jpg");
  const uranus_tex = new THREE.TextureLoader().load("textures/2k_uranus.jpg");
  const neptune_tex = new THREE.TextureLoader().load("textures/2k_neptune.jpg");

  const moon_tex = new THREE.TextureLoader().load("textures/2k_moon.jpg");

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Definimos los objetos del sistema solar
  Estrella(1.8, 0xfffffff, sun_tex);

  Planeta("Mercurio", 0.1, 2.0, 1.8, 0xffffff, 1.25, 1.25, mercury_tex);
  Planeta(
    "Venus",
    0.3,
    3.4,
    1.5,
    0xffffff,
    0.9,
    0.9,
    venus_tex,
    undefined,
    undefined,
    venus_texat
  );
  Planeta(
    "Tierra",
    0.5,
    4.0,
    1.0,
    0xffffff,
    1.1,
    1.0,
    earth_tex,
    undefined,
    undefined,
    earth_texat
  );
  Planeta("Marte", 0.25, 5.8, 1.2, 0xffffff, 1.1, 1.0, mars_tex);
  Planeta("Júpiter", 1.5, 12.5, 0.3, 0xffffff, 1.1, 1.0, jupiter_tex);
  Planeta("Saturno", 1.25, 16.25, 0.4, 0xffffff, 1.1, 1.0, saturn_tex);
  Planeta("Urano", 1.0, 25, 0.2, 0xffffff, 1.1, 1.0, uranus_tex);
  Planeta("Neptuno", 1.1, 32.5, 0.07, 0xffffff, 1.1, 1.0, neptune_tex);

  Luna(Planetas[2], 0.15, 0.75, -3.5, 0xbbbbbb, 0.0, moon_tex);
  Luna(Planetas[3], 0.1, 0.5, 2.0, 0xaaaaaa, Math.PI / 2);
  Luna(Planetas[3], 0.075, 0.75, 2.0, 0xcccccc, 0.0);

  //Inicio tiempo
  t0 = Date.now();
}

function Estrella(rad, col, texture = undefined) {
  let geometry = new THREE.SphereGeometry(rad, 32, 32);
  let material = new THREE.MeshPhongMaterial({
    color: col,
    emissive: col,
    emissiveIntensity: 1.0,
  });
  geometry.rotateX(Math.PI / 2);

  if (texture != undefined) {
    material.emissiveMap = texture;
  }

  estrella = new THREE.Mesh(geometry, material);
  scene.add(estrella);

  // Luz direccional (el sol)
  const sunLight = new THREE.PointLight(0xffffff, 2, 0);

  sunLight.position.set(0, 0, 0);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.1;
  sunLight.shadow.camera.far = 2000;

  scene.add(sunLight);

  // Luz ambiental
  const ambientLight = new THREE.AmbientLight(0x444444);
  scene.add(ambientLight);
}

function Planeta(
  nombre,
  radio,
  dist,
  vel,
  col,
  f1,
  f2,
  texture = undefined,
  texbump = undefined,
  texspec = undefined,
  texalpha = undefined,
  sombra = false
) {
  let geom = new THREE.SphereBufferGeometry(radio, 20, 20);
  geom.rotateX(Math.PI / 2); // Rotamos la textura

  let mat = new THREE.MeshPhongMaterial({ color: col });

  if (texture != undefined) {
    mat.map = texture;
  }

  if (texbump != undefined) {
    mat.bumpMap = texbump;
    mat.bumpScale = 0.1;
  }

  if (texspec != undefined) {
    mat.specularMap = texspec;
    mat.specular = new THREE.Color("orange");
  }

  let planeta = new THREE.Mesh(geom, mat);

  if (sombra) {
    planeta.castShadow = true;
    planeta.receiveShadow = true;
  }

  if (texalpha != undefined) {
    let geom2 = new THREE.SphereBufferGeometry(radio * 1.05, 20, 20);
    geom2.rotateX(Math.PI / 2); // Rotamos la textura

    let mat2 = new THREE.MeshPhongMaterial({ color: col });

    mat2.map = texalpha;
    mat2.transparent = true;
    mat2.side = THREE.DoubleSide;
    mat2.opacity = 0.5;
    mat2.depthWrite = false;

    const atmosphere = new THREE.Mesh(geom2, mat2);
    atmosphere.renderOrder = 1;
    planeta.add(atmosphere);
  }

  if (nombre === "Saturno") {
    const ringGeometry = new THREE.RingGeometry(1.5, 2.5, 64);
    const ringMaterial = new THREE.MeshPhongMaterial();

    ringMaterial.map = new THREE.TextureLoader().load(
      "textures/2k_saturn_ring_alpha.png"
    );
    ringMaterial.side = THREE.DoubleSide;
    ringMaterial.transparent = true;

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);

    ring.rotation.x = 0;
    ring.position.copy(planeta.position);
    ring.userData.follow = planeta;

    ring.onBeforeRender = function () {
      this.position.copy(this.userData.follow.position);
    };

    scene.add(ring);
  }

  planeta.userData.name = nombre;
  planeta.userData.dist = dist;
  planeta.userData.speed = vel;
  planeta.userData.f1 = f1;
  planeta.userData.f2 = f2;

  // Definimos una velocidad de rotación, para que cada planeta rote sobre sí mismo
  planeta.userData.rotationSpeed = 0.01 / (radio * 10);

  // Definimos el grado de inclinación del plano orbital de los planetas
  planeta.userData.orbitalTilt = THREE.MathUtils.degToRad(5);

  Planetas.push(planeta);
  scene.add(planeta);

  //Dibuja trayectoria, con
  let curve = new THREE.EllipseCurve(
    0,
    0, // centro
    dist * f1,
    dist * f2 // radios elipse
  );

  //Crea geometría
  let points = curve.getPoints(50);
  let geome = new THREE.BufferGeometry().setFromPoints(points);
  let mate = new THREE.LineBasicMaterial({ color: 0xffffff });

  // Objeto
  let orbita = new THREE.Line(geome, mate);
  scene.add(orbita);
}

function Luna(planeta, radio, dist, vel, col, angle, texture = undefined) {
  var pivote = new THREE.Object3D();
  pivote.rotation.x = angle;
  planeta.add(pivote);
  var geom = new THREE.SphereGeometry(radio, 20, 20);
  geom.rotateX(Math.PI / 2);
  var mat = new THREE.MeshPhongMaterial({ color: col });

  if (texture != undefined) {
    mat.map = texture;
  }

  var luna = new THREE.Mesh(geom, mat);
  if (sombra) {
    luna.castShadow = true;
    luna.receiveShadow = true;
  }

  luna.userData.dist = dist;
  luna.userData.speed = vel;

  Lunas.push(luna);
  pivote.add(luna);
}

//Bucle de animación
function animationLoop() {
  timestamp = (Date.now() - t0) * accglobal;

  requestAnimationFrame(animationLoop);

  //Modifica rotación de todos los objetos
  for (let object of Planetas) {
    object.position.x =
      Math.cos(timestamp * object.userData.speed) *
      object.userData.f1 *
      object.userData.dist;
    object.position.y =
      Math.sin(timestamp * object.userData.speed) *
      object.userData.f2 *
      object.userData.dist;

    object.rotation.y += object.userData.rotationSpeed;
    object.rotation.z += object.userData.orbitalTilt;

    if (object.children.length > 0) {
      object.children[0].rotation.y += 0.005;
    }
  }

  for (let object of Lunas) {
    object.position.x =
      Math.cos(timestamp * object.userData.speed) * object.userData.dist;
    object.position.y =
      Math.sin(timestamp * object.userData.speed) * object.userData.dist;
  }

  if (cameraTarget && useFly) {
    const desiredPos = cameraTarget.position
      .clone()
      .add(new THREE.Vector3(0, 5, 4));

    camera.position.lerp(desiredPos, zoomSpeed);

    camera.lookAt(cameraTarget.position);
  }

  if (useFly) flyControls.update(timestamp);
  else camcontrols.update();

  renderer.render(scene, camera);
}

// Panel de información
const infoPanel = document.createElement("div");
radio: 1.1, (infoPanel.id = "infoPanel");
infoPanel.innerHTML = `
  <div class="info-content">
    <span id="closeInfo">&times;</span>
    <h2 id="planetName">Planeta</h2>
    <p id=planetDetails"></p>
  </div>
`;
document.body.appendChild(infoPanel);

document.getElementById("closeInfo").onClick = () => {
  info.style.display = "none";
};

let cameraTarget = null;
let zoomSpeed = 0.05;
let cameraLocked = false;
window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(Planetas, false);
  if (intersects.length > 0) {
    const planet = intersects[0].object;
    showPlanetInfo(planet);
    cameraTarget = planet;
  } else {
    cameraTarget = null;
  }
});

document.getElementById("closeInfo").addEventListener("click", () => {
  document.getElementById("infoPanel").style.display = "none";
});

function showPlanetInfo(planet) {
  if (!planet) return;

  const name = planet.userData.name || "Planeta desconocido";

  const data = planetData[name] || {
    distancia: "N/A",
    diasTerrestres: "N/A",
    velocidad: "N/A",
    satelites: "N/A",
    descripcion: "Sin información.",
  };

  const nameEl = document.getElementById("planetName");
  const detailsEl = document.getElementById("planetDetails");
  const panel = document.getElementById("infoPanel");
  if (!nameEl || !detailsEl || !panel) return;

  nameEl.textContent = name;
  detailsEl.innerHTML = `
  <strong>Radio:</strong> ${data.radio} kms.<br>
    <strong>Distancia al Sol:</strong> ${data.distancia} AU<br>
    <strong>Duración del día:</strong> ${data.diasTerrestres} días terrestres<br>
    <strong>Velocidad orbital:</strong> ${data.velocidad} km/s<br>
    <strong>Número de satélites:</strong> ${data.satelites}<br><br>
    ${data.descripcion}
  `;

  panel.style.display = "flex";
}

// Panel de control
const controlList = document.getElementById("controlList");
const modes = {
  orbit: `
    <li>Click en planeta: Desplegar información</li>
    <li>Rueda: Zoom</li>
    <li>Arrastrar: Rotar vista</li>`,
  fly: `
    <li>Click en planeta: Desplegar información + Seguimiento del planeta</li>
    <li>W/A/S/D: Mover cámara</li>
    <li>Ratón / Flechas: Girar vista</li>`,
  create: `
    <li>Click en el sol: Crea un planeta de manera aleatoria (como máximo, se pueden crear 3 planetas)</li>
    <li>Click en planeta: Desplegar información</li>`,
};

function updateControls(mode) {
  controlList.innerHTML = modes[mode];

  useFly = mode === "fly";
  camcontrols.enabled = mode === "orbit";
  flyControls.enabled = mode === "fly";
  creationMode = mode === "create";
}

const checkedRadio = document.querySelector('input[name="mode"]:checked');
updateControls(checkedRadio ? checkedRadio.value : "orbit");

document.querySelectorAll('input[name="mode"]').forEach((radio) => {
  radio.addEventListener("change", (e) => updateControls(e.target.value));
});

updateControls("fly");

// Modo creación
let createdPlanets = 0;
const maxPlanets = 3;

window.addEventListener("click", (event) => {
  if (!creationMode) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(estrella);
  if (intersects.length > 0 && createdPlanets < maxPlanets) {
    const nombre = `Planeta${createdPlanets + 1}`;
    const radio = 0.2 + Math.random() * 0.3;
    const dist = 6 + Math.random() * 8;
    const vel = 0.5 + Math.random() * 0.5;
    const color = new THREE.Color(`hsl(${Math.random() * 360}, 70%, 60%)`);

    Planeta(nombre, radio, dist, vel, color, 1.1, 1.0);

    planetData[nombre] = {
      radio: (2000 + Math.random() * 10000).toFixed(1),
      distancia: (Math.random() * 5 + 1).toFixed(2),
      diasTerrestres: (Math.random() * 10).toFixed(2),
      velocidad: (5 + Math.random() * 30).toFixed(1),
      satelites: Math.floor(Math.random() * 5),
      descripcion: randomDescription(),
    };

    createdPlanets++;
  }
});

function randomDescription() {
  const frases = [
    "Un planeta recién formado con una atmósfera inestable.",
    "Misterioso mundo con mares de metano y vientos extremos.",
    "Planeta cubierto por un océano infinito de nubes densas.",
    "Mundo volcánico con actividad constante en su superficie.",
    "Planeta helado orbitando lejos de su estrella madre.",
  ];
  return frases[Math.floor(Math.random() * frases.length)];
}
