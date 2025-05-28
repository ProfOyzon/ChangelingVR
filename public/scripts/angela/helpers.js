// helper functions not a part of core gameplay
import { Sprite } from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';
import { checkMarkTxr, explosionTxr } from './images.js';

//import { failureSound, successSound } from './sounds.js';

// handle window resize
export function resizeCanvas(canvas, app, screenWidth, screenHeight, vignettesDiv, window) {
  canvas.width = window.innerWidth * 0.87;
  canvas.height = window.innerHeight - 60;

  app.view.style.width = canvas.width;
  app.view.style.height = canvas.height;

  screenWidth = canvas.width;
  screenHeight = canvas.height;

  // set vignettesDiv to be the same size as canvas
  vignettesDiv.style.width = canvas.width + 'px';
  vignettesDiv.style.height = canvas.height + 'px';
}

// changing button visibility
export function toggleButton(btn) {
  btn.classList.toggle('invisible');
}

// cursor changes to pointer on hovering on a task
export function hoverTask(task) {
  task.cursor = 'pointer';
}

// increase game speed as game proceeds (multiplier is used to control how much speed to increase)
export function increaseGameSpeed(multiplier, gameSpeed, maxGameSpeed) {
  // make sure the game doesn't go too fast (only increase it when it's not max speed yet)
  if (gameSpeed <= maxGameSpeed) {
    gameSpeed *= multiplier;
  }
  // if it's faster than max speed, set it equal to max speed
  if (gameSpeed >= maxGameSpeed) {
    gameSpeed = maxGameSpeed;
  }
}

// generate a green check mark at the passed in positions
export function generateCheckMark(xPos, yPos, checkMarkArray, playingContainer) {
  const check = new Sprite(checkMarkTxr);
  const checkMarkRatio = 1209 / 1199;
  // fixed height, responsive width
  check.tint = '0x66b54e';
  check.height = 60;
  check.width = check.height * checkMarkRatio;
  check.anchor.set(0.5, 1); // bottom center of the sprite
  check.position.set(xPos, yPos);
  check.initialY = yPos;
  check.moveDown = true; // we have this property for making a bouncing animation
  playingContainer.addChild(check);
  checkMarkArray.push(check);
  //successSound.play();
}

// generating an explosion at the passed positions
export function generateExplosion(xPos, yPos, explosionsArray, playingContainer) {
  const explosion = new Sprite(explosionTxr);
  explosion.position.set(xPos, yPos);
  explosion.anchor.set(0.5, 0.8);
  explosion.width = 280;
  explosion.height = 210;
  playingContainer.addChild(explosion);
  explosionsArray.push(explosion);
  explosion.tint = 0xffffff;
  //failureSound.play();
}
