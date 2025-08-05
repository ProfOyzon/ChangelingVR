import {
  Application,
  Container,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Texture,
} from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';

//Task 2: Tricycle Repair
/**
 * Player must press 3 key prompts as they pop up to repair kirsten's tricycle
 * Key entered --> next key shown
 */
/**
 * Initializes a task that the play state will use to update it, reset it, and execute its event handlers accordingly
 * @param {Application} app
 * @param {*} stats
 * @returns
 */
function initTask2(app, stats) {
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

  //Put variables that will be used in the update loop here
  //string array of key names to pull from
  const keyList = [];
  //number of correct inputs
  let inputCounter = 0;
  //random first key to find--corresponds to array index
  let targetKey = Math.floor(Math.random() * 4);
  //name of pressed key
  let pressedKey = '';
  let isKeyPressed = false;
  //track how far the wrench has been turned
  let radiansTurned = 0;
  //checks screen size
  let mobileGame = false;
  if (
    (app.screen.height < 500 && app.screen.width < 950) ||
    app.screen.width - app.screen.height < 400
  ) {
    mobileGame = true;
  }

  //Initialize graphics here
  //Background
  const backgroundTexture = Texture.from('/media/experiences/dylan/task2bg.png');
  let bgSprite = new Sprite(backgroundTexture);
  task.container.addChild(bgSprite);
  bgSprite.width = app.screen.width;
  bgSprite.height = app.screen.height;
  bgSprite.position.set(-app.screen.width / 2, -app.screen.height / 2);

  //Wheel
  const wheelTexture = Texture.from('/media/experiences/dylan/wheel.png');
  let wheelSprite = new Sprite(wheelTexture);
  task.container.addChild(wheelSprite);
  wheelSprite.anchor.set(0.5, 0.5);
  wheelSprite.width = 530;
  wheelSprite.height = 530;
  wheelSprite.position.set(90, 75);

  //Wrench
  const wrenchTexture = Texture.from('/media/experiences/dylan/wrench.png');
  let wrenchSprite = new Sprite(wrenchTexture);
  task.container.addChild(wrenchSprite);
  wrenchSprite.x = 45;
  wrenchSprite.width = 487.5;
  wrenchSprite.height = 406;
  wrenchSprite.rotation = -0.15; //radians

  if (window.screen.height <= 600) {
    wheelSprite.width = 212;
    wheelSprite.height = 212;
    wrenchSprite.width = 195;
    wrenchSprite.height = 162.4;
    wheelSprite.position.set(90, 0);
    wrenchSprite.position.set(75, -32);
  }

  //Icons for each key prompt
  //Textures
  const fTexture = Texture.from('/media/experiences/dylan/fPrint.png');
  const aTexture = Texture.from('/media/experiences/dylan/aPrint.png');
  const sTexture = Texture.from('/media/experiences/dylan/sPrint.png');
  const dTexture = Texture.from('/media/experiences/dylan/dPrint.png');
  const incorrectTexture = Texture.from('/media/experiences/dylan/incorrect.png');

  //Sprites
  let fSprite = new Sprite(fTexture);
  let aSprite = new Sprite(aTexture);
  let sSprite = new Sprite(sTexture);
  let dSprite = new Sprite(dTexture);
  let incorrectSprite = new Sprite(incorrectTexture);

  //Add sprites to keyList
  keyList[0] = fSprite;
  keyList[1] = aSprite;
  keyList[2] = sSprite;
  keyList[3] = dSprite;

  //Assigning names to sprites
  fSprite.name = 'f';
  aSprite.name = 'a';
  sSprite.name = 's';
  dSprite.name = 'd';

  //Add sprites to stage + hide
  for (let i = 0; i < keyList.length; i++) {
    task.container.addChild(keyList[i]);
    keyList[i].visible = false;

    //random initial positions
    keyList[i].x = randomPosition();

    if (window.screen.height <= 540) {
      keyList[i].width = 100;
      keyList[i].height = 100;
    } else {
      keyList[i].width = 150;
      keyList[i].height = 150;
    }

    //Adding click detection if mobile is detected
    if (mobileGame) {
      keyList[i].eventMode = 'static';
      keyList[i].cursor = 'pointer';
      keyList[i].on('pointerdown', onClick);
    }
  }

  task.container.addChild(incorrectSprite);
  incorrectSprite.visible = false;
  incorrectSprite.x = 75;
  incorrectSprite.width = 150;
  incorrectSprite.height = 150;

  // This is the task's game loop
  function update() {
    //turns wrench sprite
    turnWrench();

    //display key prompt
    keyList[targetKey].visible = true;

    //incorrect input
    if (isKeyPressed && pressedKey != keyList[targetKey].name) {
      incorrectSprite.visible = true;

      //Hides incorrect sprite after a delay
      setTimeout(() => {
        incorrectSprite.visible = false;
      }, 500);
    }

    //correct input
    if (pressedKey == keyList[targetKey].name) {
      nextKey();
    }

    //if 3 correct keys have been pressed, game complete
    if (inputCounter == 3) {
      stats.score += 100;
    }

    //Resets key press detection
    pressedKey = '';
    isKeyPressed = false;
  }

  //randomly decides next target key
  function nextKey() {
    inputCounter++;
    keyList[targetKey].visible = false;

    //changes target key and position
    targetKey = Math.floor(Math.random() * 4);
    keyList[targetKey].x = randomPosition();
  }

  //display wrench turning
  function turnWrench() {
    //rotates depending on the number of correct inputs
    if (radiansTurned < inputCounter * 0.08) {
      wrenchSprite.rotation += 0.01;
      radiansTurned += 0.01;
    }
  }
  /**
   * The play state will call this function whenever a task is finished or failed
   * Make sure to return the task to its inital state here
   */
  function reset() {
    targetKey = Math.floor(Math.random() * 4);
    inputCounter = 0;
    for (let i = 0; i < keyList.length; i++) {
      keyList[i].visible = false;
    }

    pressedKey = '';
    radiansTurned = 0;
    wrenchSprite.rotation = -0.15;
  }

  function onClick() {
    nextKey();
  }

  //randomizes key position
  function randomPosition() {
    let xValue = -app.screen.width / 2 + 50 * Math.floor(Math.random() * 20);

    //ensures position is on the left of screen
    if (xValue > -350) {
      xValue = -app.screen.width / 2 + 50;
    }

    return xValue;
  }

  function handleMousedown() {}
  function handleMouseenter() {}
  function handleMouseleave() {}
  function handleMousemove() {}
  function handleMouseout() {}
  function handleMouseover() {}
  function handleMouseup() {}
  function handleKeydown() {}
  /**
   *
   * @param {KeyboardEvent} kbe
   */
  function handleKeyup(kbe) {
    isKeyPressed = true;

    //saves inputted key name in string
    if (kbe.key === 'f') pressedKey = 'f';
    else if (kbe.key === 'a') pressedKey = 'a';
    else if (kbe.key === 's') pressedKey = 's';
    else if (kbe.key === 'd') pressedKey = 'd';
  }
  return task;
}

export { initTask2 };
