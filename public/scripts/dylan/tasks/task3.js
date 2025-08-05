import {
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Texture,
} from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';
import { rng } from '../util.js';

/**
 * Initializes a task that the play state will use to update it, reset it, and execute its event handlers accordingly
 * @param {Application} app
 * @param {*} stats
 * @returns
 */
function initTask3(app, stats) {
  const task = {
    container: new Container(),
    update,
    reset,
    handleMousedown,
    handleMouseenter,
    handleMouseleave,
    handleMousemove,
    handleMouseout,
    handleMouseover,
    handleMouseup,
    handleKeydown,
    handleKeyup,
  };

  // Put variables that will be used in the update loop here
  // Variables for: ball speed, if caught or not, etc
  // Max app size is 1807. Max for looking nice is currently 1380
  // Win Count is set up in local storage as well
  localStorage.setItem('winCount', JSON.stringify(1));
  let initialSpeed = 6; //Max 18
  let ballSpeed =
    0.001 * app.screen.width +
    0.001 * app.screen.width * (0.25 * JSON.parse(localStorage.getItem('winCount')));
  let beenCaught = false;
  let speedUpdated = false;

  // Initialize graphics here
  // Sprites for Dylan, Douglas, Ball
  // The background and catching circle are made here as well
  // Background is created here
  const catchBackground = Texture.from('/media/experiences/dylan/catchBack.png');
  const catchSprite = new Sprite(catchBackground);
  catchSprite.width = app.screen.width;
  catchSprite.height = app.screen.height;
  catchSprite.position.set(-app.screen.width / 2, -app.screen.height / 2);
  task.container.addChild(catchSprite);

  // Douglas's texture and sprite are created and placed
  const douglas = Texture.from('/media/experiences/dylan/douglasCatch.png');
  const douglasSprite = new Sprite(douglas);
  douglasSprite.anchor.set(0.5);
  douglasSprite.position.set(app.screen.width / 2 - 250, 87);
  task.container.addChild(douglasSprite);

  // Dylan's texture and sprite are created and placed
  const dylanTexture = Texture.from('/media/experiences/dylan/dylanCatch.png');
  const dylanSprite = new Sprite(dylanTexture);
  dylanSprite.anchor.set(0.5);
  dylanSprite.position.set(-app.screen.width / 2 + 250, 0);
  task.container.addChild(dylanSprite);
  // These allow for touch controls for mobile use
  dylanSprite.eventMode = 'static';
  dylanSprite.cursor = 'pointer';
  dylanSprite.on('pointerdown', onclick);

  // The balls's texture and sprite are created and placed
  const ballTexture = Texture.from('/media/experiences/dylan/baseball.png');
  const ballSprite = new Sprite(ballTexture);
  ballSprite.position.set(app.screen.width / 2 - 350, -150);
  ballSprite.anchor.set(0.5);
  ballSprite.width = 50;
  ballSprite.height = 50;
  task.container.addChild(ballSprite);

  // catchCenter is the middle of the glove, used to detect if the player caught the ball
  let catchCenterX = -app.screen.width / 2 + 350;

  // If the user is on a mobile view, change the size of the assets
  if (window.screen.height <= 600) {
    mobileView();
  }

  // This is the task's game loop
  function update() {
    // The speed of the ball will be updated once per minigame to make sure the win count
    // from local storage is being utilized properly.
    // The speed caps at 18.
    if (speedUpdated == false) {
      ballSpeed =
        0.001 * app.screen.width +
        0.001 * app.screen.width * (0.25 * JSON.parse(localStorage.getItem('winCount')));
      if (ballSpeed > 18) {
        ballSpeed = 18;
      }
    }
    // The speed of the ball has been increased to 6 in the beginning and will remain as
    // 6 until the ballSpeed variable exceeds 6.
    if (initialSpeed > ballSpeed) {
      ballSprite.x = ballSprite.x - initialSpeed;
    } else {
      ballSprite.x = ballSprite.x - ballSpeed;
    }

    ballSprite.rotation -= 0.25;

    // If the ball is caught, then increase the score. Else, decrease the score
    if (beenCaught) {
      stats.score += 100;
    } else if (ballSprite.x <= -app.screen.width / 2) {
      stats.score -= 10;
    }
  }

  /**
   * The play state will call this function whenever a task is finished or failed
   * Make sure to return the task to its inital state here
   */
  function reset() {
    ballSpeed =
      0.001 * app.screen.width +
      0.001 * app.screen.width * (0.25 * JSON.parse(localStorage.getItem('winCount')));
    beenCaught = false;
    ballSprite.rotation = 0;
    if (app.screen.height >= 600) {
      ballSprite.position.set(300 * (app.screen.width / 1380), -150);
    } else {
      mobileView();
    }
  }

  function mobileView() {
    douglasSprite.height = 256;
    douglasSprite.width = 101;
    dylanSprite.height = 320;
    dylanSprite.width = 126;
    douglasSprite.position.set(app.screen.width / 2 - 150, 55);
    dylanSprite.position.set(-app.screen.width / 2 + 150, 25);
    catchCenterX = -app.screen.width / 2 + 200;

    ballSprite.position.set(app.screen.width / 2 - 185, -50);
    ballSprite.width = 25;
    ballSprite.height = 25;
    initialSpeed = 2.5;
  }

  function handleMousedown() {}
  function handleMouseenter() {}
  function handleMouseleave() {}
  function handleMousemove() {}
  function handleMouseout() {}
  function handleMouseover() {}
  function handleMouseup() {}
  function handleKeydown(kbe) {}

  function onclick() {
    if (app.screen.height >= 600) {
      if (ballSprite.x >= catchCenterX - 50 && ballSprite.x <= catchCenterX + 50) {
        beenCaught = true;
      }
    } else {
      if (ballSprite.x >= catchCenterX - 35 && ballSprite.x <= catchCenterX + 35) {
        beenCaught = true;
      }
    }
  }

  /**
   *
   * @param {KeyboardEvent} kbe
   */
  function handleKeyup(kbe) {
    /*if (kbe.key === "Enter") stats.score += 100; */
  }
  return task;
}

export { initTask3 };
