import * as THREE from 'https://unpkg.com/three@0.174.0/build/three.module.js';
import { ImportSpriteStill } from './helpers.js';

/**
 * This file contains the "Collectable" class, which handles and contains all information relating to the sparks of magic found in the game.
 */

class Collectable {
  constructor(scene, x, y, z) {
    // The position of the collectable is shifted up by 1 automatically so they're floating a little above the ground they're on.
    //This allows us to place them directly on the floor in the Three.js editor.
    this.position = new THREE.Vector3(x, y + 1, z);

    // The sprite that player's see; certain aspects are hardcoded.
    this._sprite = ImportSpriteStill(
      scene,
      x,
      y + 1,
      z,
      '/media/experiences/kirsten/spark_of_magic2.0.png',
      3,
      3,
    );

    // Acts as the circle hitbox for this collectable.
    this._hitbox = new THREE.Sphere(new THREE.Vector3(x, y, z), 1);
  }

  get sprite() {
    return this._sprite;
  }

  get collected() {
    return this._collected;
  }

  get hitbox() {
    return this._hitbox;
  }

  // Checks if the player's Three.js collider is colliding with this collectable.
  IsColliding(playerBounds) {
    return playerBounds.intersectsSphere(this._hitbox);
  }
}

export { Collectable };
