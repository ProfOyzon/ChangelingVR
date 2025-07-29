import {
  Application,
  Assets,
  Container,
  Graphics,
  SCALE_MODES,
  Sprite,
  Text,
  Texture,
} from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';
import { sounds } from './assets.js';
import { Button, CustomButton, Finish, Interactable, Platform, Player, Word } from './classes.js';
import * as helpers from './helpers.js';

/*Author: Elliot Gong
Date: 1/2024 - 5/2024
Handle game logic using resources from external files.
*/
// loading in web font
window.WebFontConfig = {
  google: {
    families: ['Shadows Into Light'],
  },
  active() {
    init();
  },
};
(function () {
  const wf = document.createElement('script');
  wf.src = `${
    document.location.protocol === 'https:' ? 'https' : 'http'
  }://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
  wf.type = 'text/javascript';
  wf.async = 'true';
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();

// declare scene variables
let introScene, menuScene, instructScene, levelScene, endingScene;
let level1Button, level2Button, level3Button, level4Button, level5Button, level6Button, endButton;
let idleSprites, walkSprites, jumpSprites;

let gameState;

// game state enum
const STATE = {
  intro: 0,
  menu: 1,
  instruct: 2,
  level1: 3,
  level2: 4,
  level3: 5,
  level4: 6,
  level5: 7,
  level6: 8,
  ending: 9,
};

// pixi application and background
let app, background;

// variables/arrays for in-game graphics
let player, platforms, interactables, words, finish, finishFlag, playerReflect;

// key array to hold inputs
let keys;

// writes text to the canvas
const writeText = (scene, text, size, x, y, anchored = false, fill = 0x000000) => {
  const display = new Text(text, {
    fill: fill,
    fontFamily: 'Shadows Into Light',
    fontSize: size,
  });

  // sets anchor to center
  if (anchored) {
    display.anchor.set(0.5);
  }
  display.x = x;
  display.y = y;
  scene.addChild(display);
};

const beginLevel = (level) => {
  sounds.buttonSound.play();
  playLevelMusic();
  gameState = level;
  clearLevel(gameState, true);
};
// clears inputted level
// if reload is true, the level is reloaded
const clearLevel = (level, reload) => {
  switch (level) {
    case STATE.level1:
      levelScene.removeChildren();
      if (reload) loadLevel1();
      break;
    case STATE.level2:
      levelScene.removeChildren();
      if (reload) loadLevel2();
      break;
    case STATE.level3:
      levelScene.removeChildren();
      if (reload) loadLevel3();
      break;
    case STATE.level4:
      levelScene.removeChildren();
      if (reload) loadLevel4();
      break;
    case STATE.level5:
      levelScene.removeChildren();
      if (reload) loadLevel5();
      break;
    case STATE.level6:
      levelScene.removeChildren();
      if (reload) loadLevel6();
      break;
    default:
      break;
  }
};

// helpers method for current game scene
const setScene = (scene) => {
  introScene.visible = false;
  menuScene.visible = false;
  instructScene.visible = false;
  levelScene.visible = false;
  endingScene.visible = false;
  scene.visible = true;
};

// sets up various background assets for scene
const setupScene = (scene) => {
  // set up background
  scene.addChild(background);

  // draw lines
  helpers.drawLines(scene);

  // load buttons
  const restartButton = new CustomButton({
    stage: scene,
    baseTexture: Texture.from('/experiences/douglas/buttons/restart_alt_2.png'),
    clearHoverTexture: Texture.from('/experiences/douglas/buttons/restart_alt_hover_2.png'),
    x: 790,
    y: 25,
    unlocked: true,
    cleared: true,
  });
  restartButton.width = 30;
  restartButton.height = 30;
  restartButton.on('pointerdown', () => {
    sounds.buttonSound.play();
    clearLevel(gameState, true);
  });

  const backButton = new CustomButton({
    stage: scene,
    baseTexture: Texture.from('/experiences/douglas/buttons/back_alt_2.png'),
    clearHoverTexture: Texture.from('/experiences/douglas/buttons/back_alt_hover_2.png'),
    x: 830,
    y: 25,
    unlocked: true,
    cleared: true,
  });
  backButton.width = 30;
  backButton.height = 30;
  backButton.on('pointerdown', () => {
    sounds.buttonSound.play();
    sounds.levelMusic.stop();
    sounds.menuMusic.play();
    clearLevel(gameState);
    gameState = STATE.menu;
  });
  const leftButton = new Button(
    scene,
    Texture.from('/experiences/douglas/left.png'),
    150,
    625,
    true,
  );
  leftButton.on('pointerdown', () => {
    leftButton.tint = 0xaaaaaa;
    keys['a'] = true;
    keys['ArrowLeft'] = true;
  });
  leftButton.on('pointerup', () => {
    leftButton.tint = leftButton.color;
    keys['a'] = false;
    keys['ArrowLeft'] = false;
  });
  leftButton.on('pointerupoutside', () => {
    leftButton.tint = leftButton.color;
    keys['a'] = false;
    keys['ArrowLeft'] = false;
  });
  const rightButton = new Button(
    scene,
    Texture.from('/experiences/douglas/right.png'),
    700,
    625,
    true,
  );
  rightButton.on('pointerdown', () => {
    rightButton.tint = 0xaaaaaa;
    keys['d'] = true;
    keys['ArrowRight'] = true;
  });
  rightButton.on('pointerup', () => {
    rightButton.tint = rightButton.color;
    keys['d'] = false;
    keys['ArrowRight'] = false;
  });
  rightButton.on('pointerupoutside', () => {
    rightButton.tint = rightButton.color;
    keys['d'] = false;
    keys['ArrowRight'] = false;
  });
  const jumpButton = new Button(
    scene,
    Texture.from('/experiences/douglas/jump.png'),
    425,
    625,
    true,
  );
  jumpButton.on('pointerdown', () => {
    jumpButton.tint = 0xaaaaaa;
    player.jump();
    if (playerReflect) {
      playerReflect.jump();
    }
  });
  jumpButton.on('pointerup', () => {
    jumpButton.tint = jumpButton.color;
  });
  jumpButton.on('pointerupoutside', () => {
    jumpButton.tint = jumpButton.color;
  });
};

// handler for word dragging
const dragWord = (e) => {
  if (words) {
    for (let w of words) {
      w.dragMove(e.data.global.x, e.data.global.y);
    }
  }
};
/**
 * helpers method for completing the given level.
 * @param {*} level the level that is completed.
 */
const endLevel = (level) => {
  sounds.runSound.stop();
  sounds.levelMusic.stop();
  sounds.menuMusic.play();
  gameState = STATE.menu;
  level.clear();
};
/**
 * helpers method for unlocking the final reflection level.
 */
const unlockFinalLevel = () => {
  if (
    level2Button.cleared &&
    level3Button.cleared &&
    level4Button.cleared &&
    level5Button.cleared
  ) {
    level6Button.unlock();
  }
};
const playLevelMusic = () => {
  sounds.menuMusic.stop();
  if (!sounds.levelMusic.playing()) {
    sounds.levelMusic.play();
  }
};
// This function handles the game loop, runs every frame
const gameLoop = () => {
  // sets up scene based on game state
  switch (gameState) {
    case STATE.intro:
      setScene(introScene);
      break;
    case STATE.menu:
      setScene(menuScene);

      break;
    case STATE.instruct:
      setScene(instructScene);
      break;
    case STATE.level1:
      clearLevel(levelScene);
      setScene(levelScene);
      if (finish.landed) {
        endLevel(level1Button);
        level2Button.unlock();
        level3Button.unlock();
        level4Button.unlock();
        level5Button.unlock();
      }
      player.warp(850, 100, 62.5, 225, 12.5);
      player.warp(850, 225, 62.5, 350, 12.5);
      break;
    case STATE.level2:
      clearLevel(levelScene);
      setScene(levelScene);
      if (finish.landed) {
        endLevel(level2Button);
        unlockFinalLevel();
      }
      break;
    case STATE.level3:
      clearLevel(levelScene);
      setScene(levelScene);
      if (finish.landed) {
        endLevel(level3Button);
        level3Button.clear();
        unlockFinalLevel();
      }
      player.warp(850, 100, 62.5, 225, 12.5);
      player.warp(850, 225, 62.5, 400, 12.5);
      break;
    case STATE.level4:
      clearLevel(levelScene);
      setScene(levelScene);
      if (finish.landed) {
        endLevel(level4Button);
        unlockFinalLevel();
      }
      player.warp(850, 100, 50, 225, 12.5);
      player.warp(850, 225, 50, 400, 12.5);
      break;
    case STATE.level5:
      clearLevel(levelScene);
      setScene(levelScene);
      if (finish.landed) {
        endLevel(level5Button);
        unlockFinalLevel();
      }
      player.warp(850, 100, 50, 200, 12.5);
      player.warp(850, 200, 50, 300, 12.5);
      player.warp(850, 300, 50, 400, 12.5);
      break;
    case STATE.level6:
      clearLevel(levelScene);
      setScene(levelScene);
      if (
        player.x + player.width / 2 == playerReflect.x - playerReflect.width / 2 &&
        player.y == playerReflect.y
      ) {
        player.warp(450, 100, 62.5, 250, 12.5);
        playerReflect.warp(450, 100, 725, 224, 12.5);
        player.warp(450, 200, 62.5, 550, 12.5);
        playerReflect.warp(450, 200, 800, 550, 12.5);
        if (finish.landed) {
          endLevel(level6Button);
          endButton.unlock();
        }
      }
      break;
    case STATE.ending:
      setScene(endingScene);
      break;
    default:
      setScene(introScene);
      break;
  }

  // only while in a level
  if (
    gameState != STATE.intro &&
    gameState != STATE.menu &&
    gameState != STATE.instruct &&
    gameState != STATE.ending
  ) {
    if (gameState == STATE.level6) {
      // apply physics
      playerReflect.applyPhysics();

      // check all platform collision
      for (const p of platforms) {
        p.checkCollision(playerReflect);
      }

      // check interactable collision
      for (const i of interactables) {
        i.checkCollision(playerReflect);
      }

      // check finish collision
      finish.checkCollision(playerReflect);

      // walkControls movement based on player input
      if ((keys['a'] || keys['ArrowLeft']) && playerReflect.grounded) {
        playerReflect.xVelocity = 3;
      } else if ((keys['d'] || keys['ArrowRight']) && playerReflect.grounded) {
        playerReflect.xVelocity = -3;
      } else {
        if (playerReflect.grounded) {
          playerReflect.xVelocity = 0;
        }
      }
    }

    // apply physics
    player.applyPhysics();

    // check all platform collision
    for (const p of platforms) {
      p.checkCollision(player);
    }

    // check interactable collision and word logic
    for (const i of interactables) {
      i.checkCollision(player);
      for (const w of words) {
        if (w.released) {
          i.checkInteraction(w, player, platforms, levelScene);
        }
      }
    }

    // check word dragging
    for (const w of words) {
      if (!w.dragging) {
        w.reset();
      }
      w.released = false;
    }

    // check finish collision
    finish.checkCollision(player);

    // walkControls movement based on player input
    if ((keys['a'] || keys['ArrowLeft']) && player.grounded) {
      player.xVelocity = -3;
    } else if ((keys['d'] || keys['ArrowRight']) && player.grounded) {
      player.xVelocity = 3;
    } else {
      if (player.grounded) {
        player.xVelocity = 0;
      }
    }

    // returns to level select
    if (keys['Escape']) {
      clearLevel(gameState);
      gameState = STATE.menu;
    }

    // restarts the level
    if (keys['r']) {
      clearLevel(gameState, true);
    }
  }
};
/**
 * Load the game's main menu.
 */
const loadIntro = () => {
  // draw lines
  helpers.drawLines(introScene, 40);

  // add text
  writeText(introScene, "Douglas's Journal", 90, 450, 80, true);
  /*writeText(introScene,
	`It's been a while since I last read this journal.
I think I was really angry when I was writing this.
Now that I've calmed down, let's go over this again.
Maybe reading this with a clear mind will help me.`,
	35, 450, 250, true);
	*/
  const menuImage = new Sprite(Texture.from('/experiences/douglas/doodlev3.png'));
  menuImage.x = 450;
  menuImage.y = 275;
  menuImage.anchor.set(0.5);

  introScene.addChild(menuImage);

  // add buttons
  const startButton = new CustomButton({
    stage: introScene,
    baseTexture: Texture.from('/experiences/douglas/buttons/menu/start.png'),
    clearHoverTexture: Texture.from('/experiences/douglas/buttons/menu/start_hover.png'),
    x: 275,
    y: 525,
    unlocked: true,
    cleared: true,
  });
  const instructionsButton = new CustomButton({
    stage: introScene,
    baseTexture: Texture.from('/experiences/douglas/buttons/menu/instructions.png'),
    clearHoverTexture: Texture.from('/experiences/douglas/buttons/menu/instructions_hover.png'),
    x: 575,
    y: 525,
    unlocked: true,
    cleared: true,
  });
  startButton.on('pointerdown', () => {
    sounds.buttonSound.play();
    gameState = STATE.menu;
  });
  instructionsButton.on('pointerdown', () => {
    sounds.buttonSound.play();
    gameState = STATE.instruct;
  });
  //Play the background menuMusic
};
/**
 * Load the game's instructions page.
 */
const loadInstructions = () => {
  // draw lines
  helpers.drawLines(instructScene, 40);

  // add text
  writeText(instructScene, 'HOW TO PLAY', 90, 450, 100, true);
  // writeText(instructScene, "Press 'A' and 'D' to move left and right.", 25, 60, 140, false)
  // writeText(instructScene, "Press 'W' or 'Space' to jump.", 25, 60, 220, false);
  // writeText(instructScene, "Drag words from the word bank onto the red items for unique effects.", 25, 60, 300, false);
  // writeText(instructScene, 'Land on the green finish block to complete the level.', 25, 60, 380, false);
  // writeText(instructScene, "Press 'R' to restart the level.", 25, 60, 460, false);
  // writeText(instructScene, "Press 'Esc' to quit the level.", 25, 60, 540, false);
  let walkControls = new Sprite(
    Texture.from('/experiences/douglas/instructions/controls/horizontal_movement.png'),
  );
  walkControls.anchor.set(0.5);
  // walkControls.width = 400;
  // walkControls.height = 330;
  walkControls.x = 250;
  walkControls.y = 315;
  instructScene.addChild(walkControls);

  let jumpControls = new Sprite(
    Texture.from('/experiences/douglas/instructions/controls/jump.png'),
  );
  jumpControls.anchor.set(0.5);
  jumpControls.x = 650;
  jumpControls.y = 335;
  instructScene.addChild(jumpControls);

  // add button
  const backButton = new CustomButton({
    stage: instructScene,
    baseTexture: Texture.from('/experiences/douglas/buttons/back.png'),
    clearHoverTexture: Texture.from('/experiences/douglas/buttons/back_hover.png'),
    x: 425,
    y: 575,
    unlocked: true,
    cleared: true,
  });
  backButton.width = 100;
  backButton.height = 100;
  backButton.on('pointerdown', () => {
    sounds.buttonSound.play();
    gameState = STATE.intro;
  });
};
/**
 * Load the level select screen
 */
const loadMenu = () => {
  // draw lines and title
  helpers.drawLines(menuScene, 40);
  writeText(menuScene, 'Level Select', 90, 450, 100, true);

  // add buttons

  level1Button = new CustomButton({
    stage: menuScene,
    baseTexture: Texture.from('/experiences/douglas/buttons/levels/tutorial/base.png'),
    hoverTexture: Texture.from('/experiences/douglas/buttons/levels/tutorial/hover.png'),
    clearTexture: Texture.from('/experiences/douglas/buttons/levels/tutorial/cleared.png'),
    clearHoverTexture: Texture.from(
      '/experiences/douglas/buttons/levels/tutorial/cleared_hover.png',
    ),
    x: 450,
    y: 185,
    unlocked: true,
    color: 0xffffff,
  });
  level1Button.on('pointerdown', () => {
    beginLevel(STATE.level1);
  });
  level2Button = new CustomButton({
    stage: menuScene,
    baseTexture: Texture.from('/experiences/douglas/buttons/levels/baby/locked.png'),
    unlockedTexture: Texture.from('/experiences/douglas/buttons/levels/baby/unlocked.png'),
    hoverTexture: Texture.from('/experiences/douglas/buttons/levels/baby/unlocked_hover.png'),
    clearTexture: Texture.from('/experiences/douglas/buttons/levels/baby/cleared.png'),
    clearHoverTexture: Texture.from('/experiences/douglas/buttons/levels/baby/cleared_hover.png'),
    x: 125,
    y: 330,
  });
  level2Button.on('pointerdown', () => {
    beginLevel(STATE.level2);
  });
  level3Button = new CustomButton({
    stage: menuScene,
    baseTexture: Texture.from('/experiences/douglas/buttons/levels/dad/locked.png'),
    unlockedTexture: Texture.from('/experiences/douglas/buttons/levels/dad/unlocked.png'),
    hoverTexture: Texture.from('/experiences/douglas/buttons/levels/dad/unlocked_hover.png'),
    clearTexture: Texture.from('/experiences/douglas/buttons/levels/dad/cleared.png'),
    clearHoverTexture: Texture.from('/experiences/douglas/buttons/levels/dad/cleared_hover.png'),
    x: 325,
    y: 330,
  });

  level3Button.on('pointerdown', () => {
    beginLevel(STATE.level3);
  });

  level4Button = new CustomButton({
    stage: menuScene,
    baseTexture: Texture.from('/experiences/douglas/buttons/levels/mom/locked.png'),
    unlockedTexture: Texture.from('/experiences/douglas/buttons/levels/mom/unlocked.png'),
    hoverTexture: Texture.from('/experiences/douglas/buttons/levels/mom/unlocked_hover.png'),
    clearTexture: Texture.from('/experiences/douglas/buttons/levels/mom/cleared.png'),
    clearHoverTexture: Texture.from('/experiences/douglas/buttons/levels/mom/cleared_hover.png'),
    x: 525,
    y: 330,
  });
  level4Button.on('pointerdown', () => {
    beginLevel(STATE.level4);
  });
  level5Button = new CustomButton({
    stage: menuScene,
    baseTexture: Texture.from('/experiences/douglas/buttons/levels/daughter/locked.png'),
    unlockedTexture: Texture.from('/experiences/douglas/buttons/levels/daughter/unlocked.png'),
    hoverTexture: Texture.from('/experiences/douglas/buttons/levels/daughter/unlocked_hover.png'),
    clearTexture: Texture.from('/experiences/douglas/buttons/levels/daughter/cleared.png'),
    clearHoverTexture: Texture.from(
      '/experiences/douglas/buttons/levels/daughter/cleared_hover.png',
    ),
    x: 725,
    y: 330,
  });
  level5Button.on('pointerdown', () => {
    beginLevel(STATE.level5);
  });
  level6Button = new CustomButton({
    stage: menuScene,
    baseTexture: Texture.from('/experiences/douglas/buttons/levels/reflection/locked.png'),
    unlockedTexture: Texture.from('/experiences/douglas/buttons/levels/reflection/unlocked.png'),
    hoverTexture: Texture.from('/experiences/douglas/buttons/levels/reflection/unlocked_hover.png'),
    clearTexture: Texture.from('/experiences/douglas/buttons/levels/reflection/cleared.png'),
    clearHoverTexture: Texture.from(
      '/experiences/douglas/buttons/levels/reflection/cleared_hover.png',
    ),
    x: 450,
    y: 505,
  });
  level6Button.width = 312;
  level6Button.height = 117;
  level6Button.on('pointerdown', () => {
    beginLevel(STATE.level6);
  });
  endButton = new CustomButton({
    stage: menuScene,
    baseTexture: Texture.from('/experiences/douglas/buttons/levels/ending/locked.png'),
    unlockedTexture: Texture.from('/experiences/douglas/buttons/levels/ending/unlocked.png'),
    hoverTexture: Texture.from('/experiences/douglas/buttons/levels/ending/unlocked_hover.png'),
    x: 450,
    y: 600,
  });
  endButton.width = 200;
  endButton.height = 75;
  endButton.on('pointerdown', () => {
    sounds.buttonSound.play();
    gameState = STATE.ending;
  });

  const backButton = new CustomButton({
    stage: menuScene,
    baseTexture: Texture.from('/experiences/douglas/buttons/back.png'),
    clearHoverTexture: Texture.from('/experiences/douglas/buttons/back_hover.png'),
    x: 100,
    y: 75,
    unlocked: true,
    cleared: true,
  });
  backButton.width = 100;
  backButton.height = 100;
  backButton.on('pointerdown', () => {
    sounds.buttonSound.play();
    gameState = STATE.intro;
  });
};
/**
 * Load the game's tutorial level.
 */
const loadLevel1 = () => {
  // setup and add the necessary hints in the background.
  setupScene(levelScene);
  let signWidth = 75;
  let arrowSign = new Sprite(
    Texture.from('/experiences/douglas/instructions/gameplay/level-1/continue.png'),
  );
  arrowSign.anchor.set(0.5, 1);
  arrowSign.x = 700;
  arrowSign.y = 100;
  arrowSign.width = signWidth;
  arrowSign.height = signWidth;
  levelScene.addChild(arrowSign);
  // instruction text
  // writeText(levelScene, "The 'A' and 'D' keys move left and right. Reach the page's edge to progress.", 25,100, 50, false, 0xAAAAAA);
  // writeText(levelScene, "Use the 'W' or Space key to jump.", 25, 100, 175, false, 0xAAAAAA);
  // writeText(levelScene, 'Land on the finish block to progress.', 25, 100, 300, false, 0xAAAAAA);
  // writeText(levelScene, 'Drag and drop words onto red objects for unique effects.', 25, 100, 450, false, 0xAAAAAA);
  let jumpSign = new Sprite(
    Texture.from('/experiences/douglas/instructions/gameplay/level-1/jump_alt.png'),
  );
  jumpSign.anchor.set(0.5, 1);
  jumpSign.x = 250;
  jumpSign.y = 250;
  jumpSign.width = signWidth * 2;
  jumpSign.height = signWidth * 1.5;
  levelScene.addChild(jumpSign);

  let dragSign = new Sprite(
    Texture.from('/experiences/douglas/instructions/gameplay/level-1/word_drag.png'),
  );
  dragSign.anchor.set(0.5, 1);
  dragSign.x = 225;
  dragSign.y = 500;
  dragSign.width = 280;
  dragSign.height = 114;
  levelScene.addChild(dragSign);
  // load player
  player = new Player(
    levelScene,
    idleSprites.animations['idle'],
    walkSprites.animations['walk'],
    jumpSprites.animations['jump'],
    62.5,
    100,
    25,
    50,
    sounds.runSound,
    sounds.jumpSound,
  );

  // load platforms
  platforms = [
    new Platform(levelScene, 0, 500, 850, 100, sounds.landingSound),
    new Platform(
      levelScene,
      50,
      100,
      800,
      25,
      sounds.landingSound,
      'So apparently dad got me a journal today, but what am I supposed to do with this?',
    ),
    new Platform(levelScene, 50, 225, 150, 25, sounds.landingSound, 'My mind keeps'),
    new Platform(levelScene, 175, 250, 150, 25, sounds.landingSound, 'moving'),
    new Platform(
      levelScene,
      300,
      225,
      550,
      25,
      sounds.landingSound,
      'all over the place. I can barely keep track of anything!',
    ),
    new Platform(
      levelScene,
      50,
      350,
      350,
      25,
      sounds.landingSound,
      "Wait, maybe that's what this is for.",
    ),
    new Platform(
      levelScene,
      400,
      400,
      350,
      25,
      sounds.landingSound,
      'Dad keeps telling me to try new ',
    ),
  ];

  // load stage graphics
  writeText(levelScene, 'Word Bank', 30, 25, 510, false);

  // load finish
  finishFlag = new Sprite(Texture.from('/experiences/douglas/flag.png'));
  finishFlag.anchor.set(0.5, 1);
  finishFlag.x = 610;
  finishFlag.y = 300;
  levelScene.addChild(finishFlag);
  finish = new Finish(levelScene, 600, 300, 100, 25, sounds.landingSound);

  // load interactables
  interactables = [
    new Interactable({
      stage: levelScene,
      x: 750,
      y: 400,
      width: 100,
      height: 25,
      text: 'stuff.',
      correct: 'things.',
      landingSound: sounds.landingSound,
    }),
  ];

  // load words
  words = [new Word(levelScene, 140, 570, 150, 40, 'things.')];
};
/**
 * Load the game's second level, which focuses on Douglas's youngest sibling Tobi.
 */
const loadLevel2 = () => {
  // setup
  setupScene(levelScene);

  // instruction text
  // writeText(levelScene, 'You can interact with anything in the level that is red,', 25, 110, 50, false, 0xAAAAAA);
  // writeText(levelScene, 'not just the words.', 25, 400, 125, false, 0xAAAAAA);

  // load player
  player = new Player(
    levelScene,
    idleSprites.animations['idle'],
    walkSprites.animations['walk'],
    jumpSprites.animations['jump'],
    62.5,
    100,
    25,
    50,
    sounds.runSound,
    sounds.jumpSound,
  );
  player.rightWall = 750;

  // load platforms
  platforms = [
    new Platform(levelScene, 0, 500, 850, 100, sounds.landingSound),
    new Platform(levelScene, 50, 100, 125, 25, sounds.landingSound, 'Something is '),
    new Platform(levelScene, 250, 100, 100, 25, sounds.landingSound, 'with Tobi.'),
    new Platform(levelScene, 325, 75, 100, 25, sounds.landingSound, 'Mom still '),
    new Platform(
      levelScene,
      475,
      75,
      287.5,
      25,
      sounds.landingSound,
      " to hide it, but he's not himself.",
    ),
    new Platform(
      levelScene,
      50,
      200,
      450,
      25,
      sounds.landingSound,
      'She said she was going to call someone for help,',
    ),
    new Platform(levelScene, 500, 175, 50, 25, sounds.landingSound, 'I '),
    new Platform(levelScene, 600, 175, 162.5, 25, sounds.landingSound, ' they can fix it.'),
    new Platform(levelScene, 50, 325, 100, 25, sounds.landingSound, 'I feel so'),
    new Platform(levelScene, 250, 325, 100, 25, sounds.landingSound, 'right now.'),
    new Platform(
      levelScene,
      325,
      300,
      350,
      25,
      sounds.landingSound,
      'I wish everything will just go back to ',
    ),
    new Platform(
      levelScene,
      150,
      425,
      400,
      25,
      sounds.landingSound,
      "If there's anyone that's going to save Tobi,",
    ),
    new Platform(levelScene, 550, 400, 212.5, 25, sounds.landingSound, "it's going to be them."),
  ];

  // load stage graphics
  writeText(levelScene, 'Word Bank', 30, 25, 510, false);

  // load finish
  finishFlag = new Sprite(Texture.from('/experiences/douglas/flag.png'));
  finishFlag.anchor.set(0.5, 1);
  finishFlag.x = 60;
  finishFlag.y = 450;
  levelScene.addChild(finishFlag);
  finish = new Finish(levelScene, 50, 450, 100, 25, sounds.landingSound);

  // load interactables
  interactables = [
    new Interactable({
      stage: levelScene,
      x: 175,
      y: 100,
      width: 75,
      height: 25,
      text: 'wrong',
      correct: 'erase',
      landingSound: sounds.landingSound,
      eraseSound: sounds.eraseSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 425,
      y: 75,
      width: 50,
      height: 25,
      text: 'tries',
      correct: 'erase',
      landingSound: sounds.landingSound,
      eraseSound: sounds.eraseSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 550,
      y: 175,
      width: 50,
      height: 25,
      text: 'hope',
      correct: 'erase',
      landingSound: sounds.landingSound,
      eraseSound: sounds.eraseSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 150,
      y: 325,
      width: 100,
      height: 25,
      text: 'powerless',
      correct: 'erase',
      landingSound: sounds.landingSound,
      eraseSound: sounds.eraseSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 675,
      y: 300,
      width: 87.5,
      height: 25,
      text: 'normal.',
      correct: 'erase',
      landingSound: sounds.landingSound,
      eraseSound: sounds.eraseSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 360,
      y: 125,
      width: 25,
      height: 50,
      text: '',
      correct: 'erase',
      texture: '/experiences/douglas/rip2.png',
      eraseSound: sounds.eraseSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 500,
      Y: 225,
      width: 25,
      height: 50,
      text: '',
      correct: 'erase',
      texture: '/experiences/douglas/rip3.png',
      eraseSound: sounds.eraseSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 150,
      y: 375,
      width: 25,
      height: 50,
      text: '',
      correct: 'erase',
      texture: '/experiences/douglas/rip4.png',
      eraseSound: sounds.eraseSound,
    }),
  ];

  // cutoff
  const rip = Sprite.from('/experiences/douglas/rip1.png');
  rip.x = 762.5;
  rip.anchor.x = 0.5;
  levelScene.addChild(rip);

  // load words
  words = [
    new Word(levelScene, 140, 570, 150, 40, 'erase'),
    new Word(levelScene, 340, 570, 150, 40, 'erase'),
    new Word(levelScene, 540, 570, 150, 40, 'erase'),
    new Word(levelScene, 740, 570, 150, 40, 'erase'),
  ];
};
/**
 * Load the game's third level, which focuses on Douglas's dad Dyllan.
 */
const loadLevel3 = () => {
  // setup
  setupScene(levelScene);

  // instruction text

  let hint = new Sprite(
    Texture.from('/experiences/douglas/instructions/gameplay/level-3/hint.png'),
  );
  hint.anchor.set(0.5, 1);
  hint.x = 450;
  hint.y = 100;
  hint.width = 120;
  hint.height = 82;
  levelScene.addChild(hint);
  // writeText(levelScene, "Remember: opposites attract.", 25, 340, 50, false, 0xAAAAAA);
  // writeText(levelScene, "Press the 'R' key to retry.", 25, 60, 250, false, 0xAAAAAA);
  // writeText(levelScene, "Press the 'Esc' key to quit the level.", 25, 60, 350, false, 0xAAAAAA);

  // load player
  player = new Player(
    levelScene,
    idleSprites.animations['idle'],
    walkSprites.animations['walk'],
    jumpSprites.animations['jump'],
    62.5,
    100,
    25,
    50,
    sounds.runSound,
    sounds.jumpSound,
  );

  // load platforms
  platforms = [
    new Platform(levelScene, 0, 500, 850, 100, sounds.landingSound),
    new Platform(levelScene, 50, 100, 175, 25, sounds.landingSound, 'Dad is being'),
    new Platform(
      levelScene,
      325,
      100,
      350,
      25,
      sounds.landingSound,
      'lately. He acts like everything I do is',
    ),
    new Platform(levelScene, 750, 100, 100, 25, sounds.landingSound, 'for him.'),
    new Platform(levelScene, 50, 225, 150, 25, sounds.landingSound, 'But apparently,'),
    new Platform(
      levelScene,
      500,
      225,
      350,
      25,
      sounds.landingSound,
      'Kirsten can do whatever she wants.',
    ),
    new Platform(levelScene, 500, 250, 75, 75, sounds.landingSound),
    new Platform(
      levelScene,
      50,
      300,
      375,
      25,
      sounds.landingSound,
      "She's clearly the favorite!. This is so",
    ),

    new Platform(
      levelScene,
      50,
      400,
      550,
      25,
      sounds.landingSound,
      'How am I supposed to know what to do if all you ever do is',
    ),
    new Platform(levelScene, 700, 400, 50, 25, sounds.landingSound, 'me?'),
  ];

  // load stage graphics
  writeText(levelScene, 'Word Bank', 30, 25, 510, false);

  // load finish
  finishFlag = new Sprite(Texture.from('/experiences/douglas/flag.png'));
  finishFlag.anchor.set(0.5, 1);
  finishFlag.x = 760;
  finishFlag.y = 400;
  levelScene.addChild(finishFlag);
  finish = new Finish(levelScene, 750, 400, 100, 25, sounds.landingSound);

  // load interactables
  interactables = [
    new Interactable({
      stage: levelScene,
      x: 225,
      y: 25,
      width: 100,
      height: 175,
      text: 'annoying',
      correct: 'caring',
      landingSound: sounds.landingSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 675,
      y: 25,
      width: 75,
      height: 175,
      text: 'bad',
      correct: 'good',
      landingSound: sounds.landingSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 425,
      y: 275,
      width: 75,
      height: 73,
      text: 'unfair!',
      correct: 'equal!',
      landingSound: sounds.landingSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 600,
      y: 325,
      width: 100,
      height: 175,
      text: 'scold',
      correct: 'praise',
      landingSound: sounds.landingSound,
    }),
  ];

  // load words
  words = [
    new Word(levelScene, 140, 570, 150, 40, 'praise'),
    new Word(levelScene, 340, 570, 150, 40, 'caring'),
    new Word(levelScene, 540, 570, 150, 40, 'equal!'),
    new Word(levelScene, 740, 570, 150, 40, 'good'),
  ];
};
/**
 * Load the game's fourth level, which focuses on Douglas's mom Angela.
 */
const loadLevel4 = () => {
  // setup
  setupScene(levelScene);

  // load player
  player = new Player(
    levelScene,
    idleSprites.animations['idle'],
    walkSprites.animations['walk'],
    jumpSprites.animations['jump'],
    62.5,
    100,
    25,
    50,
    sounds.runSound,
    sounds.jumpSound,
  );

  // load platforms
  platforms = [
    new Platform(levelScene, 0, 450, 850, 150, sounds.landingSound),
    new Platform(
      levelScene,
      50,
      100,
      300,
      25,
      sounds.landingSound,
      "Mom keeps telling me that I'm",
    ),
    new Platform(levelScene, 200, 50, 100, 50, sounds.landingSound),
    new Platform(levelScene, 600, 0, 75, 72, sounds.landingSound),
    new Platform(
      levelScene,
      450,
      100,
      400,
      25,
      sounds.landingSound,
      "Doesn't she know I'm already 13 years old?",
    ),
    new Platform(levelScene, 50, 250, 200, 25, sounds.landingSound, "I'm not just going to"),
    new Platform(
      levelScene,
      350,
      225,
      500,
      25,
      sounds.landingSound,
      'the situation. I can definitely do something myself.',
    ),
    new Platform(levelScene, 550, 125, 75, 49, sounds.landingSound),
    new Platform(
      levelScene,
      50,
      405,
      325,
      25,
      sounds.landingSound,
      'Everyone can see something is',
    ),
    new Platform(levelScene, 375, 330, 75, 25, sounds.landingSound, 'If she'),
    new Platform(levelScene, 450, 305, 175, 25, sounds.landingSound, 'just said something,'),
    new Platform(levelScene, 625, 325, 125, 25, sounds.landingSound, 'I could help.'),
    new Platform(levelScene, 375, 355, 75, 50, sounds.landingSound),
  ];

  // load stage graphics
  writeText(levelScene, 'Word Bank', 30, 25, 460, false);

  // load finish
  finishFlag = new Sprite(Texture.from('/experiences/douglas/flag.png'));
  finishFlag.anchor.set(0.5, 1);
  finishFlag.x = 760;
  finishFlag.y = 325;
  levelScene.addChild(finishFlag);
  finish = new Finish(levelScene, 750, 325, 100, 25, sounds.landingSound);

  // load interactables
  interactables = [
    new Interactable({
      stage: levelScene,
      x: 350,
      y: 100,
      width: 100,
      height: 25,
      text: 'immature.',
      correct: 'childish.naive.',
      landingSound: sounds.landingSound,
      shrinkSound: sounds.shrinkSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 250,
      y: 225,
      width: 100,
      height: 25,
      text: 'ignore',
      correct: 'neglect.disregard',
      landingSound: sounds.landingSound,
      growSound: sounds.growSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 375,
      y: 405,
      width: 100,
      height: 25,
      text: 'weird.',
      correct: 'unusual.strange.',
      landingSound: sounds.landingSound,
      growToNormalSound: sounds.growToNormalSound,
      shrinkToNormalSound: sounds.shrinkToNormalSound,
    }),
  ];
  let shrinkHint = new Sprite(
    Texture.from('/experiences/douglas/instructions/gameplay/level-4/shrink.png'),
  );
  shrinkHint.anchor.set(0.5, 1);
  shrinkHint.x = 500;
  shrinkHint.y = 100;
  shrinkHint.width = 38;
  shrinkHint.height = 83;
  levelScene.addChild(shrinkHint);
  let growHint = new Sprite(
    Texture.from('/experiences/douglas/instructions/gameplay/level-4/grow.png'),
  );
  growHint.anchor.set(0.5, 1);
  growHint.x = 200;
  growHint.y = 250;
  growHint.width = 38;
  growHint.height = 83;
  levelScene.addChild(growHint);
  let normalHint = new Sprite(
    Texture.from('/experiences/douglas/instructions/gameplay/level-4/normal.png'),
  );
  normalHint.anchor.set(0.5, 1);
  normalHint.x = 325;
  normalHint.y = 405;
  normalHint.width = 38;
  normalHint.height = 83;
  levelScene.addChild(normalHint);

  words = [
    new Word(levelScene, 140, 520, 150, 40, 'neglect'),
    new Word(levelScene, 140, 570, 150, 40, 'disregard'),
    new Word(levelScene, 340, 520, 150, 40, 'childish.'),
    new Word(levelScene, 340, 570, 150, 40, 'naive.'),
    new Word(levelScene, 540, 520, 150, 40, 'unusual.'),
    new Word(levelScene, 540, 570, 150, 40, 'strange.'),
  ];
};
/**
 * Load the game's fourth level, which focuses on Douglas's younger sister Kirsten.
 */
const loadLevel5 = () => {
  // setup
  setupScene(levelScene);

  // instruction text
  writeText(
    levelScene,
    'Dragging words onto the paint will add that color to it.',
    25,
    60,
    150,
    false,
    0xaaaaaa,
  );
  writeText(levelScene, 'If the paint already contains that color,', 25, 60, 250, false, 0xaaaaaa);
  writeText(levelScene, 'that color will be removed.', 25, 600, 250, false, 0xaaaaaa);
  writeText(levelScene, 'Make the paints white to erase them.', 25, 250, 350, false, 0xaaaaaa);

  // load player
  player = new Player(
    levelScene,
    idleSprites.animations['idle'],
    walkSprites.animations['walk'],
    jumpSprites.animations['jump'],
    62.5,
    100,
    25,
    50,
    sounds.runSound,
    sounds.jumpSound,
  );

  // load platforms
  platforms = [
    new Platform(levelScene, 0, 450, 850, 150, sounds.landingSound),
    new Platform(
      levelScene,
      50,
      100,
      800,
      25,
      sounds.landingSound,
      "KIRSTEN! I can't believe she doodled all over my journal. Now I have to clean this up.",
    ),
    new Platform(
      levelScene,
      50,
      200,
      800,
      25,
      sounds.landingSound,
      "What's her problem, anyway? She's been walking around the house talking about magic.",
    ),
    new Platform(
      levelScene,
      50,
      300,
      800,
      25,
      sounds.landingSound,
      'As if something that convenient could possibly exist. Kirsten is just making stuff up.',
    ),
    new Platform(
      levelScene,
      50,
      400,
      700,
      25,
      sounds.landingSound,
      'If magic did exist, though, I bet I could use it to solve all of our problems.',
    ),
  ];

  // load stage graphics
  writeText(levelScene, 'Word Bank', 30, 25, 460, false);

  // load finish
  finishFlag = new Sprite(Texture.from('/experiences/douglas/flag.png'));
  finishFlag.anchor.set(0.5, 1);
  finishFlag.x = 760;
  finishFlag.y = 400;
  levelScene.addChild(finishFlag);
  finish = new Finish(levelScene, 750, 400, 100, 25, sounds.landingSound);

  // load interactables
  interactables = [
    new Interactable({
      stage: levelScene,
      x: 267.5,
      y: 25,
      width: 75,
      height: 75,
      correct: 'redbluegreen',
      texture: '/experiences/douglas/paint1_alt.png',
      green: '00',
      blue: '00',
      paintSound: sounds.paintSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 750,
      y: 125,
      width: 75,
      height: 75,
      correct: 'redbluegreen',
      texture: '/experiences/douglas/paint2_alt.png',
      red: '00',
      paintSound: sounds.paintSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 460,
      y: 225,
      width: 75,
      height: 75,
      correct: 'redbluegreen',
      texture: '/experiences/douglas/paint3_alt.png',
      green: '00',
      paintSound: sounds.paintSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 125,
      y: 325,
      width: 75,
      height: 75,
      correct: 'redbluegreen',
      texture: '/experiences/douglas/paint4.png',
      red: '00',
      paintSound: sounds.paintSound,
    }),
  ];

  // load words
  words = [
    new Word(levelScene, 140, 520, 150, 40, 'red', 0xff0000),
    new Word(levelScene, 140, 570, 150, 40, 'red', 0xff0000),
    new Word(levelScene, 340, 520, 150, 40, 'green', 0x00d000),
    new Word(levelScene, 340, 570, 150, 40, 'green', 0x00d000),
    new Word(levelScene, 540, 520, 150, 40, 'blue', 0x0000ff),
    new Word(levelScene, 540, 570, 150, 40, 'blue', 0x0000ff),
  ];

  // load helpers
  const helpers = new Sprite(
    Texture.from('/experiences/douglas/instructions/gameplay/level-5/color_wheel.png'),
  );
  helpers.x = 675;
  helpers.y = 460;
  levelScene.addChild(helpers);
};
/**
 * Load the game's sixth level, which serves as an overall reflection of his experiences.
 */
const loadLevel6 = () => {
  // setup
  setupScene(levelScene);

  // instruction text
  // writeText(levelScene, 'The player on the right mirrors your movement.', 25, 250, 25, false, 0xAAAAAA);
  // writeText(levelScene, 'Both players must reach the center to proceed.', 25, 175, 125, false, 0xAAAAAA);
  let seam = new Sprite(Texture.from('/experiences/douglas/seam.png'));
  seam.anchor.set(0.5, 0);
  seam.x = 450;
  seam.y = 0;
  seam.height = 550;
  levelScene.addChild(seam);

  let mirrorSign = new Sprite(
    Texture.from('/experiences/douglas/instructions/gameplay/level-6/instructions.png'),
  );
  mirrorSign.anchor.set(0.5, 1);
  mirrorSign.x = 450;
  mirrorSign.y = 100;
  mirrorSign.width = 120;
  mirrorSign.height = 82;
  levelScene.addChild(mirrorSign);

  // load player
  player = new Player(
    levelScene,
    idleSprites.animations['idle'],
    walkSprites.animations['walk'],
    jumpSprites.animations['jump'],
    62.5,
    100,
    25,
    50,
    sounds.runSound,
    sounds.jumpSound,
  );
  player.rightWall = 450;
  playerReflect = new Player(
    levelScene,
    idleSprites.animations['idle'],
    walkSprites.animations['walk'],
    jumpSprites.animations['jump'],
    837.5,
    100,
    25,
    50,
    sounds.runSound,
    sounds.jumpSound,
  );
  playerReflect.leftWall = 450;
  playerReflect.scale.x = -1;
  playerReflect.rightWall = 850;
  playerReflect.tint = 0x666666;

  // load platforms
  platforms = [
    // part 1
    new Platform(levelScene, 250, 50, 75, 50, sounds.landingSound),
    new Platform(
      levelScene,
      50,
      100,
      800,
      25,
      sounds.landingSound,
      "Now that I've had a chance to think through it, I'm okay. Everything is going to be okay.",
    ),
    // part 2
    new Platform(levelScene, 650, 125, 25, 124, sounds.landingSound),
    new Platform(levelScene, 200, 224, 25, 25, sounds.landingSound),
    new Platform(levelScene, 300, 224, 25, 25, sounds.landingSound),
    new Platform(levelScene, 400, 200, 125, 100, sounds.landingSound),
    new Platform(levelScene, 50, 250, 75, 75, sounds.landingSound),
    new Platform(levelScene, 500, 275, 50, 25, sounds.landingSound),
    new Platform(
      levelScene,
      50,
      300,
      800,
      25,
      sounds.landingSound,
      'The lady mom called is going to be coming over later. She probably knows what to do.',
    ),
    // part 3
    new Platform(levelScene, 500, 400, 25, 150, sounds.landingSound),
    new Platform(levelScene, 175, 423, 25, 77, sounds.landingSound),
    new Platform(levelScene, 675, 377, 75, 25, sounds.landingSound),
    new Platform(levelScene, 50, 450, 50, 25, sounds.landingSound),
    new Platform(levelScene, 800, 424, 50, 50, sounds.landingSound),
    new Platform(levelScene, 150, 500, 50, 50, sounds.landingSound),
    new Platform(levelScene, 525, 525, 50, 25, sounds.landingSound),
    new Platform(
      levelScene,
      50,
      550,
      350,
      25,
      sounds.landingSound,
      'This is definitely going to turn out fine.',
    ),
    new Platform(
      levelScene,
      500,
      550,
      350,
      25,
      sounds.landingSound,
      "There's nothing I need to worry about.",
    ),
  ];

  // load finish
  finishFlag = new Sprite(Texture.from('/experiences/douglas/flag.png'));
  finishFlag.anchor.set(0.5, 1);
  finishFlag.x = 410;
  finishFlag.y = 550;
  levelScene.addChild(finishFlag);
  finish = new Finish(levelScene, 400, 550, 100, 25, sounds.landingSound);

  // load interactables (not interactable in this level)
  interactables = [
    new Interactable({
      stage: levelScene,
      x: 600,
      y: 224,
      width: 200,
      height: 25,
      text: "But what if it's not?",
      correct: '',
      landingSound: sounds.landingSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 500,
      y: 399,
      width: 125,
      height: 25,
      text: 'Will it hurt?',
      correct: '',
      landingSound: sounds.landingSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 175,
      y: 398,
      width: 200,
      height: 25,
      text: 'Will this be safe?',
      correct: '',
      landingSound: sounds.landingSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 275,
      y: 474,
      width: 175,
      height: 25,
      text: 'What about Tobi?',
      correct: '',
      landingSound: sounds.landingSound,
    }),
    new Interactable({
      stage: levelScene,
      x: 625,
      y: 474,
      width: 225,
      height: 25,
      text: 'Can I trust this lady?',
      correct: '',
      landingSound: sounds.landingSound,
    }),
  ];

  // load words
  words = [];
};
/**
 * Load the game's ending 'cutscene'.
 */
const loadEnding = () => {
  // draw lines
  helpers.drawLines(endingScene, 40);

  // add text
  writeText(
    endingScene,
    `I'm still scared of what's going to happen to Tobi.
Someone is coming over soon, but I wish I could help.
If they still aren't able to help Tobi, what do we do?
Will Dad go back to normal if we don't get Tobi back?`,
    35,
    425,
    490,
    true,
  );

  // add ending picture
  const endPicture = new Sprite(Texture.from('/experiences/douglas/ending.png'));
  endPicture.anchor.set(0.5);
  endPicture.x = 425;
  endPicture.y = 200;
  endingScene.addChild(endPicture);

  // add button
  const backButton = new CustomButton({
    stage: endingScene,
    baseTexture: Texture.from('/experiences/douglas/buttons/back.png'),
    clearHoverTexture: Texture.from('/experiences/douglas/buttons/back_hover.png'),
    x: 425,
    y: 612.5,
    unlocked: true,
    cleared: true,
  });
  backButton.width = 75;
  backButton.height = 75;
  backButton.on('pointerdown', () => {
    sounds.buttonSound.play();
    gameState = STATE.menu;
  });
};

// init function that loads in all assets
const init = async () => {
  // create application
  app = new Application({ width: 850, height: 650, backgroundColor: 0xffffff });
  //Load in player animated sprites.
  idleSprites = await Assets.load('/experiences/douglas/player/idle/idle.json');
  walkSprites = await Assets.load('/experiences/douglas/player/walk/walk.json');
  jumpSprites = await Assets.load('/experiences/douglas/player/jump/jump.json');
  //Load in audio assets.

  sounds.menuMusic.play();

  // add background
  background = new Graphics();
  background.beginFill(0xffffff);
  background.drawRect(0, 0, 850, 600);

  // add scenes to application
  menuScene = new Container();
  app.stage.addChild(menuScene);
  levelScene = new Container();
  app.stage.addChild(levelScene);
  instructScene = new Container();
  app.stage.addChild(instructScene);
  introScene = new Container();
  app.stage.addChild(introScene);
  endingScene = new Container();
  app.stage.addChild(endingScene);

  // set up scene interactivity
  levelScene.eventMode = 'static';
  levelScene.on('pointermove', dragWord);
  levelScene.on('pointerup', () => {
    for (let w of words) {
      w.dragging = false;
      w.released = true;
    }
  });
  levelScene.on('pointerupoutside', () => {
    for (let w of words) {
      w.dragging = false;
      w.released = true;
    }
  });

  // load menus and set gamestate
  loadIntro();
  loadMenu();
  loadInstructions();
  loadEnding();
  gameState = STATE.intro;

  // add canvas to wrapper div
  document.querySelector('#wrapper').appendChild(app.view);

  // set up keyboard control handlers
  keys = [];
  window.addEventListener('keydown', (e) => {
    if (e.key == 'w' || e.key == 'ArrowUp' || e.key == ' ') {
      player.jump();
      if (playerReflect) {
        playerReflect.jump();
      }
    }
    keys[e.key] = true;
  });
  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });
  //Handle cursor events for window.
  window.addEventListener('pointerup', (e) => {
    e.preventDefault();

    // Reset the keys
    keys['a'] = false;
    keys['ArrowLeft'] = false;
    keys['d'] = false;
    keys['ArrowRight'] = false;
  });

  // resizes pixi window and centers in screen

  helpers.resize(app);
  window.addEventListener('resize', () => {
    helpers.resize(app);
  });

  // set up game loop every frame
  app.ticker.add(gameLoop);
};
