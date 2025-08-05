import * as THREE from 'https://unpkg.com/three@0.174.0/build/three.module.js';
import { ImportPlaneStill } from './helpers.js';

/**
 * This file contains classes related to objects that teleport/respawn the player at a different location.
 * This file should only be imported by the main js file for the experience.
 */

/// A class that represents a checkpoint in the world for the player to respawn to when they fall out of bounds.
// Uses three.js colliders to check collision.
class Checkpoint {
  constructor(position, radius) {
    this._position = position;
    this.collider = new THREE.Sphere(position, radius);
  }

  get Position() {
    return this._position;
  }

  // Determines whether or not the player's Three.js collider is intersecting the checkpoint.
  IsColliding(playerBounds) {
    return playerBounds.intersectsSphere(this.collider);
  }
}

/// The "teleporter" found at the end of each level.
// It is hardcoded to send the player back to spawn in "main.js".
class Teleporter {
  constructor(scene, position, rotation) {
    this._position = position;
    this.collider = new THREE.Box3(
      new THREE.Vector3(position.x - 2.25, position.y - 3.9, position.z - 0.25),
      new THREE.Vector3(position.x + 2.25, position.y + 3.9, position.z + 0.25),
    );
    this.collider.rotation = rotation;

    // Importing the teleporter as a plane so it isn't always rotating to face the camera and is stuck in one spot (the collectables can be a sprite because their hitboxes are circles).
    ImportPlaneStill(
      scene,
      position.x,
      position.y,
      position.z,
      '/media/experiences/kirsten/portal.png',
      10,
      10,
      rotation.x,
      rotation.y,
      rotation.z,
    );
  }

  get Position() {
    return this._position;
  }

  // Determines whether or not the player's Three.js collider is intersecting the checkpoint.
  IsColliding(playerBounds) {
    return playerBounds.intersectsBox(this.collider);
  }
}

export { Checkpoint, Teleporter };
