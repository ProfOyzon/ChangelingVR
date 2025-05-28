import * as CANNON from 'cannon-es/dist/cannon-es.js';
import * as THREE from 'three';
import { PointerLockControlsCannon } from './PointerLockControlsCannon.js';
import * as ADVANCEDBODY from './advancedBody.js';
import { Checkpoint, Teleporter } from './checkpoint.js';
import { Collectable } from './collectable.js';
import { ImportSpriteStill } from './helpers.js';

//when the window loads, set up the menu items
window.onload = () => {
  let startBtn = document.body.querySelector('#start-btn');

  //make the start button close the start screen onclick, then lock the controls into the game
  startBtn.onclick = () => {
    document.body.querySelector('#start-screen').classList.add('hidden');
    controls.lock();
  };

  //wait 5 seconds to hide the loading zone and reveal the start button
  //this gives assets time to load
  setTimeout(() => {
    document.body.querySelector('#loading-zone').classList.add('hidden');
    startBtn.classList.remove('hidden');
  }, 5000);

  //clicking the continue button at the end of the game closes the end screen and locks the controls
  document.body.querySelector('#cont-btn').onclick = () => {
    document.body.querySelector('#end-screen').classList.add('hidden');
    controls.lock();
  };

  //clicking locks and unlocks the controls
  document.body.onclick = () => {
    //clicking unlocks the controls (pauses the game)
    if (controls.Locked) {
      controls.unlock();
    }
    //if the game is unlocked (paused) and both screens are off, lock the controls (unpause)
    else if (
      document.body.querySelector('#end-screen').classList.contains('hidden') &&
      document.body.querySelector('#start-screen').classList.contains('hidden')
    ) {
      controls.lock();
    }
  };
};

//#region Variables
/*----------Standard Variables----------*/
// Three.js Variables
var scene, renderer, camera, controls, playerColliderThree, playerMesh;
// Cannon.js variables
let world, playerColliderCannon, groundMaterial, ground_ground;

// Holds the previous "time" value (starts with a default value).
let lastCallTime = performance.now() / 1000;

// The number of collectables collected.
let totalPickups;
let numCollectablesGotten;

// Audio
var backgroundSound;
var collectableSounds = [];
var jumpSounds = [];

/*----------Constants----------*/
// Framerate
const timeStep = 1 / 60;

// Skybox (Background)
const sky = new THREE.CubeTextureLoader()
  .setPath('/assets/images')
  .load([
    '/experiences/kirsten/skyDoodle2.png',
    '/experiences/kirsten/skyDoodle2.png',
    '/experiences/kirsten/skyDoodle2.png',
    '/experiences/kirsten/skyDoodle2.png',
    '/experiences/kirsten/skyDoodle2.png',
    '/experiences/kirsten/skyDoodle2.png',
  ]);

// Lights
const hemiLight = new THREE.HemisphereLight();
const dirLight = new THREE.DirectionalLight();

// Object Arrays
const meshes = [];
//Platforms
const movingBodies = [];
//Collectables
const pickups = [];
//Advanced Bodies
const bodies = [];
//Checkpoints
const checkpoints = [];

// The bounds that 'props' can randomly spawn in.
const lowerPropBounds = new THREE.Vector3(-185.304, -62.872, -469.004);
const upperPropBounds = new THREE.Vector3(300.851, 123.987, 258.583);
// Holds all props.
const props = [];
// Number of each *type* of prop.
const numProps = 30;

/*----------Scripted-Variables----------*/
// Turn true when the first frame has ran.
let ranOnce = false;
//#endregion

//#region Main Script
// Initialize everything...
init();
// ...And run the main loop.
animate();
//#endregion

//#region Functions
/// Main Initializer
// Everything MUST happen in this order for things to work, as things initialized first will be referenced
// by things initialized further down.
function init() {
  // Initialize Cannon & Three.js objects.
  initCannon();
  initThree();

  // Initialize audio.
  loadAudio();

  // Initialize the controller.
  initPointerLock();

  // General variable instantiation.
  numCollectablesGotten = 0;

  // Resizes the playing field when you resize the window.
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Initializing level geometry/collectables.
  loadGeometry();

  // Initializing checkpoints/teleporters.
  loadCheckpoints();

  // Load in the sky props.
  loadProps();
}

/// Initializes all of the Three.js variables.
function initThree() {
  // Initializing the renderer.
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  ddd.appendChild(renderer.domElement);

  // Initializing the scene.
  scene = new THREE.Scene();
  scene.background = sky;
  scene.fog = new THREE.Fog(0xeeeeee, 125, 200);

  // Initializing the camera.
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.rotation.order = 'ZYX';
  camera.position.y = 1;

  // Mesh that casts the player's shadow.
  const geometryS = new THREE.SphereGeometry(2, 32, 2);
  const materialS = new THREE.MeshStandardMaterial();
  playerMesh = new THREE.Mesh(geometryS, materialS);
  playerMesh.position.set(210, 3, -5);
  playerMesh.castShadow = true;
  // This will make the mesh invisible but still allow it to cast it's shadow.
  playerMesh.material.colorWrite = false;
  playerMesh.material.depthWrite = false;
  scene.add(playerMesh);

  // Initializing lights.
  hemiLight.intensity = 1.75;
  scene.add(hemiLight);

  dirLight.position.set(0, 10, 0);
  // This lights is always pointed at the player's shadowmesh so that it's always casting the player's shadow (the most important one!).
  dirLight.target = playerMesh;
  dirLight.castShadow = true;
  scene.add(dirLight);

  // Creating the player's Three.js collider.
  playerColliderThree = new THREE.Sphere(new THREE.Vector3(0, 2, 0), 2);
  playerColliderThree.castShadow = true;
}

/// Initializes all of the Cannon variables.
// Don't mess with any of the preset physics values (like the gravity, player jump strength, move speed, etc.), as it will ruin the platforming!
//It's supposed to be a bit floaty!
function initCannon() {
  // Initializes the physics world.
  world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -120, 0),
    friction: 0.9,
  });

  // Create the ground material.
  groundMaterial = new CANNON.Material('ground');
  // Adjust constraint equation parameters for ground/ground contact.
  ground_ground = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
    friction: 0.5,
    restitution: 0,
  });
  world.addContactMaterial(ground_ground);

  // Creating Cannon-es collider.
  playerColliderCannon = new CANNON.Body({
    mass: 5,
    shape: new CANNON.Sphere(2),
    position: new CANNON.Vec3(0, 2, 0),
    linearDamping: 0.9,
    angularDamping: 0.999,
    material: groundMaterial,
  });
  world.addBody(playerColliderCannon);
}

/// Initializes the player controller.
// Source: https://github.com/pmndrs/cannon-es/blob/master/examples/threejs_voxel_fps.html
function initPointerLock() {
  controls = new PointerLockControlsCannon(
    camera,
    playerColliderCannon,
    playerColliderThree,
    jumpSounds,
  );
  scene.add(controls.getObject());

  // Locks/unlocks the mouse when the player clicks on the game-screen.
  ddd.addEventListener('click', () => {
    controls.lock();
  });

  controls.addEventListener('lock', () => {
    controls.enabled = true;
  });

  controls.addEventListener('unlock', () => {
    controls.enabled = false;
  });
}

/// Pre-loads all of our audio in advanced so that we can just play it later.
function loadAudio() {
  // Creating a listener (acts as a microphone for the game).
  const listener = new THREE.AudioListener();
  // Adding the audio listener to the camera.
  camera.add(listener);

  // Loads every sound.
  const audioLoader = new THREE.AudioLoader();

  // Loading the background track.
  backgroundSound = new THREE.Audio(listener);
  audioLoader.load(`/assets/sounds/kirsten-bg-music.mp3`, function (buffer) {
    backgroundSound.setBuffer(buffer);
    backgroundSound.setLoop(true);
    backgroundSound.setVolume(0.3);
  });

  // Loading all collectable sounds.
  let trackNum = 1; // This is tied to the names of each collectable noise.
  for (let i = 0; i < 8; i++) {
    collectableSounds.push(new THREE.Audio(listener));
    audioLoader.load(`/assets/sounds/glass-tap-${trackNum}.mp3`, function (buffer) {
      collectableSounds[i].setBuffer(buffer);
      collectableSounds[i].setLoop(false);
      collectableSounds[i].setVolume(0.3);
    });
    trackNum++;
  }

  // Loading jump sounds.
  jumpSounds.push(new THREE.Audio(listener));
  audioLoader.load(`/assets/sounds/spring-1.mp3`, function (buffer) {
    jumpSounds[0].setBuffer(buffer);
    jumpSounds[0].setLoop(false);
    jumpSounds[0].setVolume(0.3);
  });
  jumpSounds.push(new THREE.Audio(listener));
  audioLoader.load(`/assets/sounds/spring-2.mp3`, function (buffer) {
    jumpSounds[1].setBuffer(buffer);
    jumpSounds[1].setLoop(false);
    jumpSounds[1].setVolume(0.3);
  });
}

/// Load in all geometries here.
// This is also where a majority of our level design happens.
// To get a better idea of of the layout of things and where you want everything positioned, try using <https://threejs.org/editor/> and the layout file in the drive <>.
function loadGeometry() {
  /* Hub Island */
  // Ground
  bodies['mainIsland'] = new ADVANCEDBODY.Cylinder(
    scene,
    meshes,
    world,
    groundMaterial,
    // Position of the Model                   // Position of the Collider              // Model Scale  // Collider Scale (changes based on type)   // Rotation
    new THREE.Vector3(-1.804, -4.346, 37.088),
    new CANNON.Vec3(-2.249, -0.471, 39.791),
    1,
    new CANNON.Vec3(60.828, 60.828, 3),
    new THREE.Vector3(0, 0, 0),
    'mainIsland',
    '/assets/models/bigIslandDoodle.glb',
  );

  /* North Path: Planes */
  // Islands
  bodies['planeIsland1'] = new ADVANCEDBODY.Cylinder(
    scene,
    meshes,
    world,
    groundMaterial,
    new THREE.Vector3(0, 0, -40.195),
    new CANNON.Vec3(0.986, -0.471, -39.978),
    2.743,
    new CANNON.Vec3(12.723, 12.723, 1),
    new THREE.Vector3(0, 0, 0),
    'planeIsland1',
    '/assets/models/smallIslandDoodle.glb',
  );
  bodies['planeIsland2'] = new ADVANCEDBODY.Cylinder(
    scene,
    meshes,
    world,
    groundMaterial,
    new THREE.Vector3(-32.375, 5.429, -39.167),
    new CANNON.Vec3(-32.31, 5.607, -39.35),
    1.81,
    new CANNON.Vec3(4.412, 4.412, 1),
    new THREE.Vector3(0, 0, 0),
    'planeIsland2',
    '/assets/models/miniIslandDoodle.glb',
  );
  bodies['planeIsland3'] = new ADVANCEDBODY.Cylinder(
    scene,
    meshes,
    world,
    groundMaterial,
    new THREE.Vector3(0, 0, -122.312),
    new CANNON.Vec3(0.187, -0.085, -122.495),
    1.748,
    new CANNON.Vec3(8.181, 8.181, 1),
    new THREE.Vector3(0, 79.32, 0),
    'planeIsland3',
    '/assets/models/smallIslandDoodle.glb',
  );
  bodies['planeIsland4'] = new ADVANCEDBODY.Cylinder(
    scene,
    meshes,
    world,
    groundMaterial,
    new THREE.Vector3(90, 0, -122.312),
    new CANNON.Vec3(90.187, -0.085, -122.495),
    1.748,
    new CANNON.Vec3(8.181, 8.181, 1),
    new THREE.Vector3(0, 79.32, 0),
    'planeIsland4',
    '/assets/models/smallIslandDoodle.glb',
  );
  bodies['planeIsland5'] = new ADVANCEDBODY.Cylinder(
    scene,
    meshes,
    world,
    groundMaterial,
    new THREE.Vector3(105, 5.5, -112.167),
    new CANNON.Vec3(105, 5.5, -112.35),
    1.81,
    new CANNON.Vec3(4.412, 4.412, 1),
    new THREE.Vector3(0, 0, 0),
    'planeIsland5',
    '/assets/models/miniIslandDoodle.glb',
  );
  bodies['planeIsland6'] = new ADVANCEDBODY.Cylinder(
    scene,
    meshes,
    world,
    groundMaterial,
    new THREE.Vector3(105, 11, -129.167),
    new CANNON.Vec3(105, 11, -129.35),
    1.81,
    new CANNON.Vec3(4.412, 4.412, 1),
    new THREE.Vector3(0, 0, 0),
    'planeIsland6',
    '/assets/models/miniIslandDoodle.glb',
  );
  bodies['planeIsland7'] = new ADVANCEDBODY.Cylinder(
    scene,
    meshes,
    world,
    groundMaterial,
    new THREE.Vector3(120, 16.5, -122.167),
    new CANNON.Vec3(120, 16.5, -122.35),
    1.81,
    new CANNON.Vec3(4.412, 4.412, 1),
    new THREE.Vector3(0, 0, 0),
    'planeIsland7',
    '/assets/models/miniIslandDoodle.glb',
  );
  bodies['planeIsland8'] = new ADVANCEDBODY.Cylinder(
    scene,
    meshes,
    world,
    groundMaterial,
    new THREE.Vector3(200, 16.5, -122),
    new CANNON.Vec3(200, 16.5, -122),
    1.748,
    new CANNON.Vec3(8.181, 8.181, 1),
    new THREE.Vector3(0, 45.79, 0),
    'planeIsland8',
    '/assets/models/smallIslandDoodle.glb',
  );
  bodies['planeIsland9'] = new ADVANCEDBODY.Cylinder(
    scene,
    meshes,
    world,
    groundMaterial,
    new THREE.Vector3(160, 21, -260),
    new CANNON.Vec3(160, 21, -260),
    1.748,
    new CANNON.Vec3(8.181, 8.181, 1),
    new THREE.Vector3(0, 45.79, 0),
    'planeIsland9',
    '/assets/models/smallIslandDoodle.glb',
  );
  bodies['planeIsland10'] = new ADVANCEDBODY.Cylinder(
    scene,
    meshes,
    world,
    groundMaterial,
    new THREE.Vector3(80, 11, -260),
    new CANNON.Vec3(80, 11, -260),
    1.81,
    new CANNON.Vec3(4.412, 4.412, 1),
    new THREE.Vector3(0, 0, 0),
    'planeIsland10',
    '/assets/models/miniIslandDoodle.glb',
  );
  bodies['planeIsland11'] = new ADVANCEDBODY.Cylinder(
    scene,
    meshes,
    world,
    groundMaterial,
    new THREE.Vector3(0, -3.638, -260),
    new CANNON.Vec3(0.187, -3.789, -260),
    1.748,
    new CANNON.Vec3(8.181, 8.181, 1),
    new THREE.Vector3(0, 45.79, 0),
    'planeIsland11',
    '/assets/models/smallIslandDoodle.glb',
  );
  bodies['planeIsland12'] = new ADVANCEDBODY.Cylinder(
    scene,
    meshes,
    world,
    groundMaterial,
    new THREE.Vector3(-13.303, -10.068, -270),
    new CANNON.Vec3(-13.36, -9.882, -270),
    1.81,
    new CANNON.Vec3(4.412, 4.412, 1),
    new THREE.Vector3(0, 69.28, 0),
    'planeIsland12',
    '/assets/models/miniIslandDoodle.glb',
  );
  bodies['planeIsland13'] = new ADVANCEDBODY.Cylinder(
    scene,
    meshes,
    world,
    groundMaterial,
    new THREE.Vector3(0.554, -10.644, -350),
    new CANNON.Vec3(0.215, -19.807, -350),
    0.24,
    new CANNON.Vec3(12.723, 12.723, 19.0),
    new THREE.Vector3(0, -4.99, 0),
    'planeIsland13',
    '/assets/models/bigIslandDoodle.glb',
  );
  bodies['planeIsland14'] = new ADVANCEDBODY.Cylinder(
    scene,
    meshes,
    world,
    groundMaterial,
    new THREE.Vector3(-0.203, -17.146, -383),
    new CANNON.Vec3(-0.28, -17.59, -383),
    0.912,
    new CANNON.Vec3(2.287, 2.287, 1.5),
    new THREE.Vector3(0, 69.28, 0),
    'planeIsland14',
    '/assets/models/miniIslandDoodle.glb',
  );

  // Still Plane Platforms
  bodies['Plane1'] = new ADVANCEDBODY.PlaneBody(
    scene,
    meshes,
    world,
    groundMaterial,
    'x',
    new THREE.Vector3(-10.381, -2.153, -70.029),
    4,
    new THREE.Vector3(0, 0, 0),
    'Plane1',
  );
  bodies['Plane2'] = new ADVANCEDBODY.PlaneBody(
    scene,
    meshes,
    world,
    groundMaterial,
    'x',
    new THREE.Vector3(9.627, -5.079, -83.969),
    4,
    new THREE.Vector3(0, 26.31, 0),
    'Plane2',
  );
  bodies['Plane3'] = new ADVANCEDBODY.PlaneBody(
    scene,
    meshes,
    world,
    groundMaterial,
    'x',
    new THREE.Vector3(-4.964, -4.558, -100.189),
    4,
    new THREE.Vector3(0, -31, 0),
    'Plane3',
  );
  bodies['Plane4'] = new ADVANCEDBODY.PlaneBody(
    scene,
    meshes,
    world,
    groundMaterial,
    'x',
    new THREE.Vector3(-20.0, 1.558, 20.312),
    4,
    new THREE.Vector3(0, 0, 0),
    'Plane4',
  );
  bodies['Plane5'] = new ADVANCEDBODY.PlaneBody(
    scene,
    meshes,
    world,
    groundMaterial,
    'z',
    new THREE.Vector3(230.0, 13, -192.5),
    4,
    new THREE.Vector3(0, 0, 0),
    'Plane5',
  );

  // Moving Plane Platforms
  //Set 1
  movingBodies.push(
    new ADVANCEDBODY.MovingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'z',
      new THREE.Vector3(20, -3, -150.015),
      4,
      new THREE.Vector3(0, 0, 0),
      'MovingPlane1',
      new THREE.Vector3(20, -3, -150.015),
      new THREE.Vector3(20, -3, -110.015),
      true,
      12,
    ),
  );
  movingBodies.push(
    new ADVANCEDBODY.MovingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'z',
      new THREE.Vector3(40, -3, -120.015),
      4,
      new THREE.Vector3(0, 0, 0),
      'MovingPlane2',
      new THREE.Vector3(40, -3, -150.015),
      new THREE.Vector3(40, -3, -110.015),
      true,
      13,
    ),
  );
  movingBodies.push(
    new ADVANCEDBODY.MovingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'z',
      new THREE.Vector3(60, -3, -130.015),
      4,
      new THREE.Vector3(0, 0, 0),
      'MovingPlane3',
      new THREE.Vector3(60, -3, -150.015),
      new THREE.Vector3(60, -3, -110.015),
      true,
      14,
    ),
  );
  //Set 2
  movingBodies.push(
    new ADVANCEDBODY.MovingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'z',
      new THREE.Vector3(140, 13, -130.015),
      4,
      new THREE.Vector3(0, 0, 0),
      'MovingPlane4',
      new THREE.Vector3(140, 13, -150.015),
      new THREE.Vector3(60, 13, -110.015),
      true,
      13,
    ),
  );
  movingBodies.push(
    new ADVANCEDBODY.MovingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'z',
      new THREE.Vector3(180, 13, -110.015),
      4,
      new THREE.Vector3(0, 0, 0),
      'MovingPlane5',
      new THREE.Vector3(180, 13, -150.015),
      new THREE.Vector3(60, 13, -110.015),
      true,
      15,
    ),
  );
  //Set 3 ("Kissing" Planes)
  movingBodies.push(
    new ADVANCEDBODY.MovingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'z',
      new THREE.Vector3(200, 13, -135.015),
      4,
      new THREE.Vector3(0, 0, 0),
      'MovingPlane6',
      new THREE.Vector3(200, 13, -190.015),
      new THREE.Vector3(200, 13, -135.015),
      true,
      30,
    ),
  );
  movingBodies.push(
    new ADVANCEDBODY.MovingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'z',
      new THREE.Vector3(200, 13, -250.015),
      4,
      new THREE.Vector3(0, 0, 0),
      'MovingPlane7',
      new THREE.Vector3(200, 13, -250.015),
      new THREE.Vector3(200, 13, -200.015),
      true,
      30,
    ),
  );
  movingBodies.push(
    new ADVANCEDBODY.MovingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'x',
      new THREE.Vector3(180, 18, -260.015),
      4,
      new THREE.Vector3(0, 0, 0),
      'MovingPlane8',
      new THREE.Vector3(175, 18, -260.015),
      new THREE.Vector3(230, 18, -265.015),
      true,
      15,
    ),
  );
  //Set 4
  movingBodies.push(
    new ADVANCEDBODY.MovingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'z',
      new THREE.Vector3(135, 13, -275),
      4,
      new THREE.Vector3(0, 0, 0),
      'MovingPlane9',
      new THREE.Vector3(135, 13, -275),
      new THREE.Vector3(135, 13, -230),
      true,
      13,
    ),
  );
  movingBodies.push(
    new ADVANCEDBODY.MovingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'z',
      new THREE.Vector3(105, 13, -230),
      4,
      new THREE.Vector3(0, 0, 0),
      'MovingPlane10',
      new THREE.Vector3(105, 13, -275),
      new THREE.Vector3(105, 13, -230),
      true,
      13,
    ),
  );
  movingBodies.push(
    new ADVANCEDBODY.MovingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'z',
      new THREE.Vector3(55, 0, -230),
      4,
      new THREE.Vector3(0, 0, 0),
      'MovingPlane11',
      new THREE.Vector3(55, 0, -275),
      new THREE.Vector3(55, 0, -230),
      true,
      13,
    ),
  );
  movingBodies.push(
    new ADVANCEDBODY.MovingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'z',
      new THREE.Vector3(25, 0, -275),
      4,
      new THREE.Vector3(0, 0, 0),
      'MovingPlane12',
      new THREE.Vector3(25, 0, -275),
      new THREE.Vector3(25, 0, -230),
      true,
      13,
    ),
  );

  // Rotating Plane Platforms
  //Set 1
  movingBodies.push(
    new ADVANCEDBODY.RotatingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'x',
      new THREE.Vector3(1.106, 8, -291),
      5,
      new THREE.Vector3(0, 0, 0),
      'RotatingPlane1',
      30,
      17,
      20,
    ),
  );
  movingBodies.push(
    new ADVANCEDBODY.RotatingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'x',
      new THREE.Vector3(1.106, 8, -291),
      5,
      new THREE.Vector3(0, 0, 240),
      'RotatingPlane2',
      30,
      17,
      20,
    ),
  );
  movingBodies.push(
    new ADVANCEDBODY.RotatingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'x',
      new THREE.Vector3(1.106, 8, -291),
      5,
      new THREE.Vector3(0, 0, 480),
      'RotatingPlane3',
      30,
      17,
      20,
    ),
  );
  //Set 2
  movingBodies.push(
    new ADVANCEDBODY.RotatingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'x',
      new THREE.Vector3(1.106, 4, -304),
      5,
      new THREE.Vector3(0, 0, 60),
      'RotatingPlane4',
      30,
      17,
      20,
    ),
  );
  movingBodies.push(
    new ADVANCEDBODY.RotatingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'x',
      new THREE.Vector3(1.106, 4, -304),
      5,
      new THREE.Vector3(0, 0, 300),
      'RotatingPlane5',
      30,
      17,
      20,
    ),
  );
  movingBodies.push(
    new ADVANCEDBODY.RotatingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'x',
      new THREE.Vector3(1.106, 4, -304),
      5,
      new THREE.Vector3(0, 0, 540),
      'RotatingPlane6',
      30,
      17,
      20,
    ),
  );
  //Set 3
  movingBodies.push(
    new ADVANCEDBODY.RotatingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'x',
      new THREE.Vector3(1.106, 0, -323),
      5,
      new THREE.Vector3(0, 0, 120),
      'RotatingPlane7',
      30,
      17,
      20,
    ),
  );
  movingBodies.push(
    new ADVANCEDBODY.RotatingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'x',
      new THREE.Vector3(1.106, 0, -323),
      5,
      new THREE.Vector3(0, 0, 360),
      'RotatingPlane8',
      30,
      17,
      20,
    ),
  );
  movingBodies.push(
    new ADVANCEDBODY.RotatingPlaneBody(
      scene,
      meshes,
      world,
      groundMaterial,
      'x',
      new THREE.Vector3(1.106, 0, -323),
      5,
      new THREE.Vector3(0, 0, 600),
      'RotatingPlane9',
      30,
      17,
      20,
    ),
  );

  // Pickups
  //beginning
  pickups.push(new Collectable(scene, 0.158, 1.336, 40.676));
  pickups.push(new Collectable(scene, -20.0, 4.336, 20.63));
  pickups.push(new Collectable(scene, -32.12, 6.948, -39.406));
  pickups.push(new Collectable(scene, 0.318, 1.333, -122.373));
  //Path-Right
  pickups.push(new Collectable(scene, 40.0, 1.0, -126.312));
  pickups.push(new Collectable(scene, 105.249, 12.046, -129.263));
  pickups.push(new Collectable(scene, 140, 16.046, -115.708));
  //Path-Back
  pickups.push(new Collectable(scene, 230, 17, -192.5));
  pickups.push(new Collectable(scene, 227, 20, -260));
  pickups.push(new Collectable(scene, 105, 16, -230));
  //Spinning Planes
  pickups.push(new Collectable(scene, -12.731, -8.555, -270));
  pickups.push(new Collectable(scene, 9.291, 3.091, -295));
  pickups.push(new Collectable(scene, -0.149, -8.328, -347));
  pickups.push(new Collectable(scene, -0.169, -15.963, -383));

  //tracking total pickups
  totalPickups = pickups.length;
  document.querySelector('#collAmt').innerHTML = `${numCollectablesGotten} / ${totalPickups}`;
}

/// Initializes checkpoints and teleporters.
function loadCheckpoints() {
  checkpoints.push(new Checkpoint(new THREE.Vector3(-2.25, 1.875, 39.867), 55.509));
  checkpoints.push(new Checkpoint(new THREE.Vector3(0.887, 1.746, -39.777), 11.952));
  checkpoints.push(new Checkpoint(new THREE.Vector3(0.278, 1.746, -122.566), -8.103));
  checkpoints.push(new Checkpoint(new THREE.Vector3(90.278, 1.746, -122.566), -8.103));
  checkpoints.push(new Checkpoint(new THREE.Vector3(200, 18, -122.566), -8.103));
  checkpoints.push(new Checkpoint(new THREE.Vector3(160, 22, -260), -8.103));
  checkpoints.push(new Checkpoint(new THREE.Vector3(0.278, -1.575, -260), -8.103));
  checkpoints.push(
    new Teleporter(scene, new THREE.Vector3(-0.048, -5.427, -355), new THREE.Vector3(0, 0, 0)),
  );
}

/// Initializing all props (any 2D sprite that's only purpose is a visual.).
function loadProps() {
  /* Magic Sky Props */
  // The number of the currently selected prop-type.
  let propIndex = 1;
  // If any more props are added, be sure to increase the number that'numProps' is multiplied by here.
  for (let i = 0; i < numProps * 7; i++) {
    // Randomizing where the prop can appear withing the preset bounds.
    //This *does* mean that props can sometimes appear in the ground, but it's fairly rare and not intrusive enough for me to consider this an issue.
    //If you feel it *is* though, then you can instead set them to appear outside the prop bounds by losely following the cloud-code below.
    let x = Math.random() * (upperPropBounds.x - lowerPropBounds.x) + lowerPropBounds.x;
    let y = Math.random() * (upperPropBounds.y - lowerPropBounds.y) + lowerPropBounds.y;
    let z = Math.random() * (upperPropBounds.z - lowerPropBounds.z) + lowerPropBounds.z;
    // Create a new prop and make it invisible.
    props.push(
      ImportSpriteStill(
        scene,
        x,
        y,
        z,
        '/assets/images/experiences/kirsten/sky_prop_' + propIndex + '.png',
        5,
        5,
      ),
    );
    props[i].visible = false;

    // If this isn't the first prop & i is a multiple of 'numProps' (AKA "every 30 props")...
    if (i > 0 && i % numProps == 0) {
      // Move on to the next prop type.
      propIndex++;
    }
  }

  /* Clouds */
  //Although we could have made the clouds just a normal part of the backgrounds, we found that the skybox *we* made always ended up looking to unconvincingly boxy.
  //It might be a good idea to ask the art team for a new skybox with a similar vibe and the clouds just baked in if you feel like the randomized clouds aren't good/use up too many resources.
  //Alternatively, you could try fixing up/simplifying the code instead; I made it really quickly and kind of jankily.
  //Clouds can only appear outside of the prop bounds so as not to cut into the ground (which *would* look weird).

  // Side Clouds
  for (let i = 0; i < 20; i++) {
    let x = 0;
    let y = 0;
    let z = 0;

    // The clouds on the sides of the world can have any height.
    y =
      Math.random() * (upperPropBounds.y + 500 - (lowerPropBounds.y - 500)) +
      (lowerPropBounds.y - 500);
    // As long as they can have any height though, we need to make sure that they do not appear within the x or z bounds or they'll spawn too close to the stage.
    while (x < upperPropBounds.x && x > lowerPropBounds.x)
      x =
        Math.random() * (upperPropBounds.x + 500 - (lowerPropBounds.x - 500)) +
        (lowerPropBounds.x - 500);
    while (z < upperPropBounds.z && z > lowerPropBounds.z)
      z =
        Math.random() * (upperPropBounds.z + 500 - (lowerPropBounds.z - 500)) +
        (lowerPropBounds.z - 500);

    // Import a new cloud.
    ImportSpriteStill(scene, x, y, z, '/assets/images/experiences/kirsten/skyCloud.png', 100, 100);
  }
  //Top/Bottom clouds.
  for (let i = 0; i < 20; i++) {
    let x = 0;
    let y = 0;
    let z = 0;

    // The clouds on top can have any x or y position.
    x =
      Math.random() * (upperPropBounds.x + 500 - (lowerPropBounds.x - 500)) +
      (lowerPropBounds.x - 500);
    z =
      Math.random() * (upperPropBounds.z + 500 - (lowerPropBounds.z - 500)) +
      (lowerPropBounds.z - 500);
    // As long as they be anywhere horizontally, we need to make sure that they don't appear within the y bounds or they'll spawn to close to the stage.
    while (y < upperPropBounds.y && y > lowerPropBounds.y)
      y =
        Math.random() * (upperPropBounds.y + 500 - (lowerPropBounds.y - 500)) +
        (lowerPropBounds.y - 500);

    // Import a new cloud.
    ImportSpriteStill(scene, x, y, z, '/assets/images/experiences/kirsten/skyCloud.png', 100, 100);
  }
}

/// Preforms the collision checks for collectables.
// Checks if every uncollected collectable is colliding with the playerevery single frame. Definitely very expensive,
//and could be made less demanding if you have the time.
function collectableCollisionCheck() {
  // For every collectable spawned...
  for (let i = 0; i < pickups.length; i++) {
    // Don't check collision if nothing is there.
    if (pickups[i] != null && pickups[i].IsColliding(controls.ThreeBody)) {
      // If the player's hitbox touches the collectable's hitbox, remove it and increment the number of collectables the player has gotten.
      scene.remove(pickups[i].sprite);
      delete pickups[i];
      numCollectablesGotten++;
      document.querySelector('#collAmt').innerHTML = `${numCollectablesGotten} / ${totalPickups}`;

      // Play a sound!
      collectableSound();

      // Check if it's time for a prop event!
      propEvent();
    }
  }
}

/// Performs a collision check for the checkpoints
// Checks if every checkpoint is colliding with the player every single frame. Definitely very expensive,
//and could be made less demanding if you have the time and energy.
function checkpointCollision() {
  checkpoints.forEach((element) => {
    // First check if the player is colliding with the selected collider.
    if (element.IsColliding(controls.ThreeBody)) {
      // If the collider is a checkpoint...
      if (element instanceof Checkpoint) {
        // ...set it as the player's checkpoint.
        controls.Checkpoint = element.Position;
        return;
      }
      // Else if the collider is a teleporter...
      else if (element instanceof Teleporter) {
        // ...send the player back to spawn.
        controls.unlock();
        //display a different message and hide the "keep playing" button if the player got every spark
        if (numCollectablesGotten == totalPickups) {
          document.querySelector('#end-screen p').innerHTML +=
            '<br>With all these sparks, maybe Tobi will finally smile again!';
          document.querySelector('#cont-btn').classList.add('hidden');
        }
        document.querySelector('#end-screen').classList.remove('hidden');
        controls.teleportPlayerSpawn();
      }
    }
  });
}

/// Moves the player with alongside any moving platforms they're standing on.
function MovingPlatformsMovePlayer() {
  movingBodies.forEach((element) => {
    //if the element is a MovingPlaneBody
    if (element instanceof ADVANCEDBODY.MovingPlaneBody) {
      // ...add the amount the platform has moved this frame to the players position (only happens if they're colliding).
      controls.addPosition(element.ThreePlayerCollision(controls.ThreeBody));
    }
  });
}

/// Handles hardcoded "prop events".
// Currently makes props visible every x number of collectables gained.
function propEvent() {
  let lower = 0;
  let upper = 0;
  switch (numCollectablesGotten) {
    // The cases are totally arbitrary, and should be adjusted based on the
    // Change these cases based on the total number of collectables in the final release of the experience.
    case 1:
      upper = numProps;
      break;
    case 3:
      lower = numProps;
      upper = numProps * 2;
      break;
    case 5:
      lower = numProps * 2;
      upper = numProps * 3;
      break;
    case 7:
      lower = numProps * 3;
      upper = numProps * 4;
      break;
    case 9:
      lower = numProps * 4;
      upper = numProps * 5;
      break;
    case 11:
      lower = numProps * 5;
      upper = numProps * 6;
      break;
    case 13:
      lower = numProps * 6;
      upper = numProps * 7;
      break;
    // Add more cases here following the same pattern if more props are added...
  }

  // Cut this program short if none of the event cases were reached.
  if (upper == 0) return;

  // Make the new section of props visible.
  for (let i = lower; i < upper; i++) {
    props[i].visible = true;
  }
}

/// A helper-method that plays a random sound from the available collecatble SFX.
function collectableSound() {
  // Get a random sound from the list.
  let num = Math.trunc(Math.random() * 8);
  collectableSounds[num].play();
}

/// The main game loop; naturally runs every tick.
function animate() {
  // Runs the loop.
  requestAnimationFrame(animate);

  // Update TIME itself.
  const time = performance.now() / 1000;
  const delta = time - lastCallTime;
  // Save the current time for use next tick.
  lastCallTime = time;

  // If the controls are locked (the player is clicked into the experience and playing it) and the first frame of the program has already happened...
  if (controls.Locked || !ranOnce) {
    // Update the player.
    controls.update(delta);

    // Make sure the player moves alongside any moving platforms.
    MovingPlatformsMovePlayer();

    // Check if the player is colliding with pickups.
    collectableCollisionCheck();

    // Update the moving platforms.
    movingBodies.forEach((element) => {
      element.Move(delta);
    });

    // Check if the player is colliding with any checkpoints.
    checkpointCollision();

    // Move the player's shadow by moving the shadow-mesh and the directional light.
    playerMesh.position.set(controls.Position.x, controls.Position.y + 2, controls.Position.z);
    dirLight.position.set(controls.Position.x, controls.Position.y + 10, controls.Position.z);

    // This allows us to make sure the experience has ran for one tick before the player actually clicks into the experience.
    ranOnce = true;
  }

  // If the controls are locked and there is no background music playing yet...
  if (controls.Locked && !backgroundSound.isPlaying) {
    // ...play the background music.
    backgroundSound.play();
  }
  // If the controls are unlocked and the background music *is* playing...
  else if (!controls.Locked && backgroundSound.isPlaying) {
    // ...*pause* the background music.
    backgroundSound.pause();
  }

  if (controls.Locked) {
    document.querySelector('#paused').classList.add('hidden');
    //document.querySelector("#end-screen").classList.add("hidden");
  } else {
    document.querySelector('#paused').classList.remove('hidden');
  }

  // The following should always happen at the end of this loop:
  //Steps the physics world based on deltaTime.
  world.step(timeStep, delta);
  //Render's all of the three.js graphics.
  renderer.render(scene, camera);
}
//#endregion
