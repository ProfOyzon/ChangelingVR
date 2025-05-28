import * as CANNON from 'cannon-es/dist/cannon-es.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ImportGLTFModelStill } from './helpers.js';

/**
 * This file contains all of the "Advanced Bodies", which are just models with pre-set colliders.
 * Some are simple and should be used for more basic shape/collider combos, while others are for more detailed colliders.
 * Any new platforms should be made using one of these objects or a new advanced body that you hardcode (like the planes).
 * Use your own discretion for what should be simple vs complex.
 */

/// A class that represents the Three.js and Cannon.js for each important collidable body.
// This class is only for parenting other classes and instances should not be made of it directly.
class CollisionBody {
  /**
   * @param {THREE.Scene} scene - the Three.js scene imported from the main.js file.
   * @param {THREE.Object3D[]} meshes - the list of meshes that this body will be put into after being loaded.
   * @param {THREE.Vector3} modelPosition - the position that the *model* will be located at.
   * @param {Integer} modelScale - the scale of the model.
   * @param {THREE.Vector3} rotation - the rotation of the model.
   * @param {String} name - the name of the model; used to save the model after it has been loaded by the loader.
   * @param {String} path - the filepath to the actual model.
   * @param {Integer} offset - this is only really used by the rotating bodies and can be ignored for all other bodies.
   */
  constructor(scene, meshes, modelPosition, modelScale, rotation, name, path, offset = 0) {
    // Loading the Three.js model based on the input.
    //let impPromise = new Promise(function(myResolve, myReject){
    ImportGLTFModelStill(
      scene,
      meshes,
      modelPosition.x,
      modelPosition.y - offset,
      modelPosition.z,
      path,
      modelScale,
      rotation.x,
      rotation.y,
      rotation.z,
      name,
    );
    this.model;

    //a timeout needs to be set to allow the model to load before applying a shadow and pushing it
    //5000 milliseconds helps prevent even slower computers from breaking
    setTimeout(() => {
      //if there is an error loading the assets
      try {
        this.model = scene.getObjectByName(name);
        this.model.traverse((obj) => {
          if (obj.isMesh) {
            obj.receiveShadow = true;
          }
        });
        meshes.push(this.model);
        //change the button to prevent the game from being played
      } catch (error) {
        document.querySelector('#start-btn').disabled = true;
        document.querySelector('#start-btn').innerHTML = 'Assets Not Loaded; Please Refresh';
        document.querySelector('#start-btn').style.width = 'fit-content';
      }
    }, 5000);

    this._collider;
  }

  get Model() {
    return this.model;
  }

  get Collider() {
    return this._collider;
  }

  // Moves the model by the input vector amount.
  Translate(amount) {
    this._collider.position.x += amount.x;
    this._collider.position.y += amount.y;
    this._collider.position.z += amount.z;
    this.model.position.x += amount.x;
    this.model.position.y += amount.y;
    this.model.position.z += amount.z;
  }
}

/// Creates a collision body with a single cylinder as the hitbox.
class Cylinder extends CollisionBody {
  /**
   * @param {CANNON.World} world - the physics world imported from "main.js".
   * @param {CANNON.Material} groundMaterial - the physics material for this object's collider.
   * @param {CANNON.Vec3} colliderPosition - the position of the collider in the world; CANNON.Vec3 and THREE.Vector3 are totally compatible and can be used interchangeably.
   * @param {THREE.Vector3} colliderScale - for cylinders, this is a Vector3 that takes in ["Top Circle Radius", "Bottom Circle Radius", "Height"].
   */
  constructor(
    scene,
    meshes,
    world,
    groundMaterial,
    modelPosition,
    colliderPosition,
    modelScale,
    colliderScale,
    rotation,
    name,
    path,
  ) {
    super(scene, meshes, modelPosition, modelScale, rotation, name, path);
    this._collider = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Cylinder(colliderScale.x, colliderScale.y, colliderScale.z, 10),
      position: colliderPosition,
      material: groundMaterial,
    });
    this._collider.quaternion.setFromEuler(rotation.x, rotation.y, rotation.z);
    world.addBody(this._collider);
  }
}

/// Creates a collision body with a single sphere as the hitbox.
class Sphere extends CollisionBody {
  constructor(
    scene,
    meshes,
    world,
    groundMaterial,
    modelPosition,
    colliderPosition,
    modelScale,
    radius,
    rotation,
    name,
    path,
  ) {
    super(scene, meshes, modelPosition, modelScale, rotation, name, path);
    this._collider = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Sphere(radius),
      center: colliderPosition,
      material: groundMaterial,
    });
    world.addBody(this._collider);
  }
}

/// Creates a collision body with a single cube as the hitbox.
class Box extends CollisionBody {
  /**
   * @param {THREE.Vector3} colliderScale - for boxes, this is a Vector3 that takes in the bounds of the box.
   */
  constructor(
    scene,
    meshes,
    world,
    groundMaterial,
    modelPosition,
    colliderPosition,
    modelScale,
    colliderScale,
    rotation,
    name,
    path,
  ) {
    super(scene, meshes, modelPosition, modelScale, rotation, name, path);
    this._collider = new CANNON.Body({
      mass: 0, // Dividing the THREE.js input scale because Boxes take half-extents.
      shape: new CANNON.Box(colliderScale.x / 2, colliderScale.y / 2, colliderScale.z / 2),
      position: colliderPosition,
      material: groundMaterial,
    });
    this._collider.quaternion.setFromEuler(rotation.x, rotation.y, rotation.z);
    world.addBody(this._collider);
  }
}

// Creates an advanced collision body based on the "plane" model.
class PlaneBody extends CollisionBody {
  /**
   * @param {String} model - denotes what model should be used
   */
  constructor(
    scene,
    meshes,
    world,
    groundMaterial,
    model,
    modelPosition,
    modelScale,
    rotation,
    name,
    offset = 0,
  ) {
    //NOTE: for some reason, rotating the plane breaks the collider, making the player stand higher on rotated planes
    //and not get moved by the moving planes
    //to remedy this, a second model was added that is rotated the other direction
    //planes are marked in index.js by what direction they face, and that direction is used to determine model and collider

    //the collider variables
    var body, bodyPos, wings, wingPos;
    //if the plane faces the z-direction, use the z-facing model
    if (model == 'z') {
      super(
        scene,
        meshes,
        modelPosition,
        modelScale,
        rotation,
        name,
        '/assets/models/toyAirplaneDoodleZ.glb',
        offset,
      );
      //creating the bounds of the shape
      //lowering both shapes so that the plane is offset from it's local origin
      body = new CANNON.Box(
        new CANNON.Vec3((modelScale * 1.231) / 2, (modelScale * 0.617) / 2, (modelScale * 2) / 2),
      );
      bodyPos = new CANNON.Vec3(0, 0 - 0.056 - offset, 0);
      wings = new CANNON.Box(
        new CANNON.Vec3((modelScale * 2.777) / 2, (modelScale * 0.213) / 2, (modelScale * 1) / 2),
      );
      wingPos = new CANNON.Vec3(0, 0 - 0.202 - offset, 0);
    }
    //the only other model is the x-facing one, so use that one
    else {
      super(
        scene,
        meshes,
        modelPosition,
        modelScale,
        rotation,
        name,
        '/assets/models/toyAirplaneDoodle.glb',
        offset,
      );
      //creating the bounds of the shape
      //lowering both shapes so that the plane is offset from it's local origin
      body = new CANNON.Box(
        new CANNON.Vec3((modelScale * 2) / 2, (modelScale * 0.617) / 2, (modelScale * 1.231) / 2),
      );
      bodyPos = new CANNON.Vec3(0, 0 - 0.056 - offset, 0);
      wings = new CANNON.Box(
        new CANNON.Vec3((modelScale * 1) / 2, (modelScale * 0.213) / 2, (modelScale * 2.777) / 2),
      );
      wingPos = new CANNON.Vec3(0, 0 - 0.202 - offset, 0);
    }

    //add the body parts to the collider
    this._collider = new CANNON.Body({
      mass: 0,
      material: groundMaterial,
    });
    this._collider.addShape(body, bodyPos);
    this._collider.addShape(wings, wingPos);

    // Rotations must be converted to radians for cannon.
    rotation.x *= Math.PI / -180;
    rotation.y *= Math.PI / -180;
    rotation.z *= Math.PI / -180;
    this._collider.quaternion.x = rotation.x;
    this._collider.quaternion.y = rotation.y;
    this._collider.quaternion.z = rotation.z;

    this._collider.position = modelPosition;

    world.addBody(this._collider);

    //NOTE: uncomment these to see bounding boxes.
    //this.boundsVisual = new THREE.Group();
    //this.VisualizeBoundaries(modelScale, scene, offset, model);
  }

  // For testing purposes; allows you to visualize the hitboxes.
  VisualizeBoundaries(modelScale, scene, offset, model) {
    const boxMaterial = new THREE.MeshNormalMaterial();
    //arrange the geometry based on model
    let bodyGeometry;
    let wingGeometry;
    if (model == 'z') {
      bodyGeometry = new THREE.BoxGeometry(modelScale * 1.231, modelScale * 0.617, modelScale * 2);
      wingGeometry = new THREE.BoxGeometry(modelScale * 2.777, modelScale * 0.213, modelScale * 1);
    } else {
      bodyGeometry = new THREE.BoxGeometry(modelScale * 2, modelScale * 0.617, modelScale * 1.231);
      wingGeometry = new THREE.BoxGeometry(modelScale * 1, modelScale * 0.213, modelScale * 2.777);
    }
    // Body
    const bodyMesh = new THREE.Mesh(bodyGeometry, boxMaterial);
    bodyMesh.rotation.order = 'YXZ';
    bodyMesh.rotateY(this._collider.quaternion.y);
    bodyMesh.rotateX(this._collider.quaternion.x);
    bodyMesh.rotateZ(this._collider.quaternion.z);
    bodyMesh.position.y = -0.056 - offset;
    // Wings
    const wingMesh = new THREE.Mesh(wingGeometry, boxMaterial);
    wingMesh.rotation.order = 'YXZ';
    wingMesh.rotateY(this._collider.quaternion.y);
    wingMesh.rotateX(this._collider.quaternion.x);
    wingMesh.rotateZ(this._collider.quaternion.z);
    wingMesh.position.y = -0.202 - offset;

    // Visuals
    this.boundsVisual.add(bodyMesh);
    this.boundsVisual.add(wingMesh);
    this.boundsVisual.position.x = this._collider.position.x;
    this.boundsVisual.position.y = this._collider.position.y;
    this.boundsVisual.position.z = this._collider.position.z;
    //NOTE: uncomment this to see bounding boxes
    //scene.add(this.boundsVisual);
  }
}

// A moving plane that can move back and forth between any two points.
//This code can be copied and used for any other moving body.
class MovingPlaneBody extends PlaneBody {
  /**
   * @param {THREE.Vector3} startPoint - the "starting" point for the moving platform (the point with the lower values).
   * @param {THREE.Vector3} endPoint - the "ending" point for the moving platform (the point with the higher values).
   * @param {Boolean} movingToEnd - whether or not the platform is moving towards the "endPoint"; controls the direction it is facing.
   * @param {Integer} speed - the speed at which this platform moves along it's invisible track.
   */
  constructor(
    scene,
    meshes,
    world,
    groundMaterial,
    model,
    modelPosition,
    modelScale,
    rotation,
    name,
    startPoint,
    endPoint,
    movingToEnd,
    speed,
  ) {
    super(
      scene,
      meshes,
      world,
      groundMaterial,
      model,
      modelPosition,
      modelScale,
      rotation,
      name,
      0,
    );
    //initialize all the variables
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.movingToRight = movingToEnd;
    this.progress = 0;
    this.speed = speed;

    // Calculating the Plane's initial starting progress.
    let deltaTime = 0.165; // based on deltatime logged in the console; this value is somewhat arbitrary and only used for initialization.
    let increment = (deltaTime / 100) * 15;
    this.position = modelPosition;
    let distance = this.startPoint.distanceTo(modelPosition);
    this.progress = distance * increment;
    this.initialProgressCalculated = true;
    // The amount this platform moved this frame.
    this.amountMoved = new THREE.Vector3();

    this.threeBounds = new THREE.Box3();
  }

  //move the plane every frame
  Move(deltaTime) {
    // Only runs if the model has finished loading.
    if (this.model == null) return;

    // Reset the Bounding Box
    this.threeBounds.setFromObject(this.model, true);

    // Calculate the amount that we're incrementing the platforms by
    let increment = (deltaTime / 100) * this.speed;

    // Add or subtract the increment based on the direction the platform is moving.
    if (this.movingToRight) this.progress += increment;
    else this.progress -= increment;

    // Copy the previous position.
    this.amountMoved.copy(this.position);

    // Move the position based on the progress made along it's predefined track.
    this.position.lerpVectors(this.startPoint, this.endPoint, this.progress);

    // Clamp all values.
    this.position.clamp(this.startPoint, this.endPoint);

    // Get the amount this position has changed this frame.
    this.amountMoved.sub(this.position);
    this.amountMoved.negate();

    this.progress = THREE.MathUtils.clamp(this.progress, 0, 1);

    // If the platform reaches either end of the track, turn it around.
    if (this.progress >= 1) {
      this.movingToRight = false;
      this.Flip();
    } else if (this.progress <= 0) {
      this.movingToRight = true;
      this.Flip();
    }
    this._collider.position.copy(this.position);
    this.model.position.copy(this.position);

    //NOTE: comment out to hide bounding boxes
    //this.boundsVisual.position.copy(this.position);
  }

  // Flips the planes model but not it's collider, which is already symmetrical.
  //A different "flip" method should be used if you make a new moving platform, or you should make a platform that doesn't need to be fixed.
  Flip() {
    this.model.scale.x *= -1;
    this.model.scale.z *= -1;
  }

  // Checks if the player's three-body is colliding and returns the amount this platform has moved this frame to offset the player.
  //NOTE: this still has to be called manually in index.js for it to do anything
  ThreePlayerCollision(playerBounds) {
    // If the player is intersecting this model's three.js bounds...
    if (playerBounds.intersectsBox(this.threeBounds)) {
      // ...return the amount it's moved this frame.
      return this.amountMoved;
    }

    // Otherwise return zero (since the player is always moving by whatever this returns).
    return new THREE.Vector3();
  }
}

// A rotating plane that spins around an invisible point in the air (like one of those viking-ship amusement park rides or a ferris wheel).
// This could also be copied for a platform that spins around it's own center, just ignore the "offset".
class RotatingPlaneBody extends PlaneBody {
  /**
   * @param {Integer} rotationSpeed - the speed at which the platform rotates.
   * @param {Integer} offset - the distance between the model and it's origin; allows it to rotate around a point in space.
   */
  constructor(
    scene,
    meshes,
    world,
    groundMaterial,
    model,
    modelPosition,
    modelScale,
    rotation,
    name,
    rotationSpeed,
    offset,
  ) {
    super(
      scene,
      meshes,
      world,
      groundMaterial,
      model,
      modelPosition,
      modelScale,
      new THREE.Vector3(0, 0, 0),
      name,
      offset,
    );
    this.rotationSpeed = rotationSpeed;
    let newOrigin = new THREE.Group();
    this.rotation = rotation;

    // Offsetting the Three.js Model
    //the timeout is needed for the models to go to the right place
    setTimeout(() => {
      //if there is an error loading the assets
      try {
        this.model.position.x = 0;
        this.model.position.y = -offset;
        this.model.position.z = 0;
        newOrigin.add(this.model);
        newOrigin.position.x = modelPosition.x;
        newOrigin.position.y = modelPosition.y;
        newOrigin.position.z = modelPosition.z;
        this.model = newOrigin;
        scene.add(this.model);
        this._collider.quaternion.setFromAxisAngle(
          new CANNON.Vec3(0, 0, 1),
          this.rotation.z * (Math.PI / 180),
        );
        //NOTE: uncomment this to see bounding boxes
        //this.boundsVisual.quaternion.copy(this._collider.quaternion);
        this.model.quaternion.copy(this._collider.quaternion);
        //change the button to prevent the game from being played
      } catch (error) {
        document.querySelector('#start-btn').disabled = true;
        document.querySelector('#start-btn').innerHTML = 'Assets Not Loaded; Please Refresh';
        document.querySelector('#start-btn').style.width = 'fit-content';
      }
    }, 5000);
  }

  // Rotates the plane (only works on the z-axis but could be adjusted)
  Move(delta) {
    //only move the plane if the model has loaded
    if (this.model == null) return;

    let increment = delta * this.rotationSpeed;
    this.rotation.z += increment;
    this._collider.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 0, 1),
      this.rotation.z * (Math.PI / 180),
    );
    //NOTE: uncomment this to see bounding boxes
    //this.boundsVisual.quaternion.copy(this._collider.quaternion);
    this.model.quaternion.copy(this._collider.quaternion);
  }
}

export { Cylinder, Sphere, Box, PlaneBody, MovingPlaneBody, RotatingPlaneBody };
