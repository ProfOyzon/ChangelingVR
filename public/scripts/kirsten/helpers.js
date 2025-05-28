import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * This file contains all of the important helper functions that will be used by multiple other scripts.
 * Technically, it only has loader functions and should be called "loader.js" but I don't really feel like changing all of the places it's referenced so...
 */

/**
 * Imports GLB models (3D assets).
 * GLB/GLTF models are used instead of .obj to save on space.
 * @param {THREE.Scene} scene - the Three.js scene imported from the main.js file.
 * @param {THREE.Object3D[]} meshes - the list of meshes that this body will be put into after being loaded.
 * @param {Integer} x - the x-value of the position.
 * @param {Integer} y - the y-value of the position.
 * @param {Integer} z - the z-value of the position.
 * @param {String} path - the filepath of the 3D model to be loaded.
 * @param {Integer} scale - the scale of the mesh; meshes can only be scaled omni-directionally when using this function.
 * @param {Integer} rx - the rotation along the x-axis of the mesh.
 * @param {Integer} ry - the rotation along the y-axis of the mesh.
 * @param {Integer} rz - the rotation along the z-axis of the mesh.
 * @param {String} name - the name of the mesh; used to recall it for later.
 */
function ImportGLTFModelStill(
  scene,
  meshes,
  x,
  y,
  z,
  path,
  scale = 1,
  rx = 0,
  ry = 0,
  rz = 0,
  name = '',
) {
  const loader = new GLTFLoader();
  // Converte rotation to radians.
  rx *= Math.PI / -180;
  ry *= Math.PI / -180;
  rz *= Math.PI / -180;
  // Loading the model.
  loader.load(
    path,
    function (object) {
      const model = object.scene;
      // Set it's scale.
      model.scale.x = scale;
      model.scale.y = scale;
      model.scale.z = scale;
      // Set it's rotation in radians.
      model.rotation.isEuler = false;
      model.rotation.order = 'YXZ';
      model.rotateY(ry);
      model.rotateX(rx);
      model.rotateZ(rz);
      // Set it's position.
      model.position.x = x;
      model.position.y = y;
      model.position.z = z;
      // Give it a name.
      model.name = name;
      // Add it to the scene.
      scene.add(model);
      // Handle errors.
    },
    undefined,
    function (error) {
      console.error(error);
    },
  );
}

/**
 * Imports sprites that just hangout.
 * @param {Integer} xs - the width of the sprite.
 * @param {Integer} ys - the height of the sprite.
 * @returns - returns the sprite to be kept track of in another file.
 */
function ImportSpriteStill(scene, x, y, z, path, xs = 1, ys = 1) {
  // Load Sprite
  const map = new THREE.TextureLoader().load(path);
  const material = new THREE.SpriteMaterial({ map: map });
  const sprite = new THREE.Sprite(material);
  // Set it's position.
  sprite.position.x = x;
  sprite.position.y = y;
  sprite.position.z = z;
  // Set it's scale.
  sprite.scale.x = xs;
  sprite.scale.y = ys;
  // Add it to the scene.
  scene.add(sprite);
  return sprite;
}

/**
 * Imports a flat plane.
 * This is similar to a sprite, with the only major difference being that it *DOESN'T* follow the camera and has a strict rotation.
 */
function ImportPlaneStill(scene, x, y, z, path, xs, ys, rx = 0, ry = 0, rz = 0) {
  // Create a material using the input sprite.
  const texture = new THREE.TextureLoader().load(path);
  let material = new THREE.MeshBasicMaterial({ map: texture });
  let plane = new THREE.Mesh(new THREE.PlaneGeometry(xs, ys), material);
  plane.material.side = THREE.DoubleSide;
  plane.material.transparent = true;
  plane.position.x = x;
  plane.position.y = y;
  plane.position.z = z;
  plane.rotateX(rx);
  plane.rotateY(ry);
  plane.rotateZ(rz);
  scene.add(plane);
}

export { ImportGLTFModelStill, ImportSpriteStill, ImportPlaneStill };
