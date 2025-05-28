/**
 * @author mrdoob / http://mrdoob.com/
 * @author schteppe / https://github.com/schteppe
 * Script Page: https://github.com/pmndrs/cannon-es/blob/master/examples/js/PointerLockControlsCannon.js
 * Installation Page: https://github.com/pmndrs/cannon-es/blob/master/examples/threejs_voxel_fps.html
 * Imported in to help with Camera Movement/Player Movement of a CANNON body.
 * Some code has been altered/added to so that it could better suit the purposes of this experience.
 */
import * as CANNON from 'cannon-es/dist/cannon-es.js';
import * as THREE from 'three';

class PointerLockControlsCannon extends THREE.EventDispatcher {
  constructor(camera, cannonBody, threeBody, jumpSounds) {
    super();

    this.enabled = false;

    // Colliders
    this.cannonBody = cannonBody;
    /*Added for Changeling*/
    this._threeBody = threeBody;

    this.velocityFactor = 1;
    this.jumpVelocity = 75;

    this.pitchObject = new THREE.Object3D();
    this.pitchObject.add(camera);

    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 2;
    this.yawObject.add(this.pitchObject);

    this.quaternion = new THREE.Quaternion();

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.canJump = false;
    /*Added for Changeling*/
    this.canDoubleJump = false;
    this.onFloor = true;
    // SFX
    this.jumpSounds = jumpSounds;

    this.sprintMultiplyer = 1;

    const contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
    const upAxis = new CANNON.Vec3(0, 1, 0);
    this.cannonBody.addEventListener('collide', (event) => {
      const { contact } = event;

      // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
      // We do not yet know which one is which! Let's check.
      if (contact.bi.id === this.cannonBody.id) {
        // bi is the player body, flip the contact normal
        contact.ni.negate(contactNormal);
      } else {
        // bi is something else. Keep the normal as it is
        contactNormal.copy(contact.ni);
      }

      // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
      if (contactNormal.dot(upAxis) > 0.5) {
        // Use a "good" threshold value between 0 and 1 here!

        // Changing jump-states now that the player is on the ground.
        this.canJump = true;
        /*Added for Changeling*/
        this.canDoubleJump = false;
        this.onFloor = true;
        // Stops jump sound-effects early if the player is in the game and the sounds have been loaded.
        if (this.Locked && this.jumpSounds[0] != null) {
          this.jumpSounds[0].stop();
          this.jumpSounds[1].stop();
        }
      }
    });

    this.velocity = this.cannonBody.velocity;

    // Moves the camera to the cannon.js object position and adds velocity to the object if the run key is down
    this.inputVelocity = new THREE.Vector3();
    this.euler = new THREE.Euler();

    this.lockEvent = { type: 'lock' };
    this.unlockEvent = { type: 'unlock' };

    // Holds the position of the current checkpoint; uses the first checkpoint as
    this._checkpoint = new THREE.Vector3(-2.25, 1.875, 69.867);

    this.connect();

    this.cannonBody.position.copy(this._checkpoint);
    this._threeBody.center.copy(this._checkpoint);
  }

  get ThreeBody() {
    return this._threeBody;
  }

  set Checkpoint(checkpointPosition) {
    this._checkpoint = checkpointPosition;
  }

  get Locked() {
    return this.isLocked;
  }

  get Position() {
    return this.cannonBody.position;
  }

  addPosition(newPos) {
    this.cannonBody.position.x += newPos.x;
    this.cannonBody.position.y += newPos.y;
    this.cannonBody.position.z += newPos.z;
    this.yawObject.position.copy(this.cannonBody.position);
    this._threeBody.center.copy(this.cannonBody.position);
  }

  connect() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('pointerlockchange', this.onPointerlockChange);
    document.addEventListener('pointerlockerror', this.onPointerlockError);
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  disconnect() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('pointerlockchange', this.onPointerlockChange);
    document.removeEventListener('pointerlockerror', this.onPointerlockError);
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
  }

  dispose() {
    this.disconnect();
  }

  lock() {
    document.body.requestPointerLock();
  }

  unlock() {
    document.exitPointerLock();
  }

  onPointerlockChange = () => {
    if (document.pointerLockElement) {
      this.dispatchEvent(this.lockEvent);

      this.isLocked = true;
    } else {
      this.dispatchEvent(this.unlockEvent);

      this.isLocked = false;
    }
  };

  onPointerlockError = () => {
    console.error('PointerLockControlsCannon: Unable to use Pointer Lock API');
  };

  onMouseMove = (event) => {
    if (!this.enabled) {
      return;
    }

    const { movementX, movementY } = event;

    this.yawObject.rotation.y -= movementX * 0.002;
    this.pitchObject.rotation.x -= movementY * 0.002;

    this.pitchObject.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this.pitchObject.rotation.x),
    );
  };

  onKeyDown = (event) => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = true;
        break;

      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = true;
        break;

      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = true;
        break;

      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = true;
        break;
      /*Added for Changling*/
      // The player can jump and double jump when they hit space.
      case 'Space':
        // If the player can jump and is on the floor...
        if (this.canJump && this.onFloor) {
          this.velocity.y = this.jumpVelocity;
          this.onFloor = false;
          this.jumpSounds[0].play();
        }
        // Else if the player can double jump and has already jumped once...
        else if (this.canDoubleJump && !this.canJump) {
          this.velocity.y = this.jumpVelocity * 0.75;
          this.canDoubleJump = false;
          this.jumpSounds[1].play();
        }
        break;
      // Allows the player to sprint when holding shift.
      case 'ShiftLeft':
        this.sprintMultiplyer = 2;
        break;
    }
  };

  onKeyUp = (event) => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = false;
        break;

      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = false;
        break;

      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = false;
        break;

      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = false;
        break;
      /*Added for Changling*/
      // Important for the double jump to actually work right!
      case 'Space':
        // If they player can jump and are no longer on the floor after the space button is released...
        if (this.canJump && !this.onFloor) {
          // Say that they can't jump but can now double jump.
          this.canJump = false;
          this.canDoubleJump = true;
        }
        break;
      case 'ShiftLeft':
        this.sprintMultiplyer = 1;
        break;
    }
  };

  getObject() {
    return this.yawObject;
  }

  getDirection() {
    const vector = new CANNON.Vec3(0, 0, -1);
    vector.applyQuaternion(this.quaternion);
    return vector;
  }

  /*Added for Changeling*/
  // Teleports the player back to spawn if they fall out of bounds.
  teleportPlayerIfOutOfBounds() {
    // If the player falls below -50 (an arbitrary value; change it if necesary)...
    if (this.cannonBody.position.y <= -50) {
      // Teleport the player to the currently set checkpoint.
      this.cannonBody.position.copy(this._checkpoint);
      this.cannonBody.velocity.copy(new CANNON.Vec3(0, 0, 0));
      this._threeBody.center.copy(this._checkpoint);
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.velocity.z = 0;
    }
  }

  /*Added for Changeling*/
  // Returns the player to the preset spawn location.
  teleportPlayerSpawn() {
    this.cannonBody.position.copy(new THREE.Vector3(-2.25, 1.875, 69.867));
    this._threeBody.center.copy(new THREE.Vector3(-2.25, 1.875, 69.867));
  }

  update(delta) {
    if (this.enabled === false) {
      return;
    }

    delta *= 1000;
    delta *= 0.1;

    this.inputVelocity.set(0, 0, 0);

    /*Added for Changeling*/
    // Lowering your velocity gain while you're in the air; done for balancing and game feel.
    let cutVelocity = this.velocityFactor;
    if (!this.onFloor) {
      cutVelocity *= 0.5;
    }

    if (this.moveForward) {
      this.inputVelocity.z = -cutVelocity * delta * this.sprintMultiplyer;
    }
    if (this.moveBackward) {
      this.inputVelocity.z = cutVelocity * delta * this.sprintMultiplyer;
    }

    if (this.moveLeft) {
      this.inputVelocity.x = -cutVelocity * delta * this.sprintMultiplyer;
    }
    if (this.moveRight) {
      this.inputVelocity.x = cutVelocity * delta * this.sprintMultiplyer;
    }

    // Convert velocity to world coordinates
    this.euler.x = this.pitchObject.rotation.x;
    this.euler.y = this.yawObject.rotation.y;
    this.euler.order = 'XYZ';
    this.quaternion.setFromEuler(this.euler);
    this.inputVelocity.applyQuaternion(this.quaternion);

    // Add to the object
    this.velocity.x += this.inputVelocity.x;
    this.velocity.z += this.inputVelocity.z;

    this.yawObject.position.copy(this.cannonBody.position);

    this._threeBody.center.copy(this.cannonBody.position);

    /*Added for Changeling*/
    // Check if the player needs to be saved.
    this.teleportPlayerIfOutOfBounds();
  }
}

export { PointerLockControlsCannon };
