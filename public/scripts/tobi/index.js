import {
  Application,
  Container,
  Sprite,
  Texture,
} from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

if (windowWidth > 1920) {
  windowWidth = 1920;
}
if (windowHeight > 1080) {
  windowHeight = 1080;
}

//initializing window
const app = new Application({
  width: windowWidth / 1.0625,
  height: windowHeight - 128,
  antialias: true,
});
app.renderer.background.color = 0x282828;
app.stage.addChild(
  new Container(),
  new Container(),
  new Container(),
  new Container(),
  new Container(),
  new Container(),
);
app.stage.x = app.renderer.width * 0.5;
app.stage.y = app.renderer.height * 0.5;

//hides all except the first container
for (let i = 1; i < app.stage.children.length; i++) {
  app.stage.children[i].visible = false;
}
document.querySelector('#wrapper').appendChild(app.view);

//initialize variables
let currentStage = 0; //increment up as player progresses
let stages = []; //array for stages
let objects = []; //array for items
let colorObjects = []; //array for color sprites of objects
let itemHints = []; //text boxes for item hints
let backgrounds = []; //stage backgrounds
let foundTexts = []; //found objects texts
let isMobileLandscape = false; //adjust scaling if for mobile
let isMobilePortrait = false;
let width = app.renderer.width;
let height = app.renderer.height;

//names for each container for graphics
const menu = app.stage.children[0];
const livingRoom = app.stage.children[1];
const kitchen = app.stage.children[2];
const playroom = app.stage.children[3];
const crib = app.stage.children[4];
const taken = app.stage.children[5];

stages.push(menu);
stages.push(livingRoom);
stages.push(kitchen);
stages.push(playroom);
stages.push(crib);
stages.push(taken);

//checks for mobile based on screen size
if (app.renderer.width < 950 || app.renderer.width - app.renderer.height < 300) {
  isMobileLandscape = true;
}

//detection for mobile portrat mode
//TODO: adjust this to detect ipad portrait mode
if (app.renderer.height > app.renderer.width + 200) {
  isMobilePortrait = true;
}

//initialize graphics
//Menu
let menuTexture = Texture.from('/media/experiences/tobi/menu.png');
let menuBG = new Sprite(menuTexture);
menuBG.width = width;
menuBG.height = height;
menuBG.position.set(-width / 2, -height / 2);
menu.addChild(menuBG);

//Start button--this transitions to the rules display
let startTexture = Texture.from('/media/experiences/tobi/start.png');
let startButton = new Sprite(startTexture);
startButton.anchor.set(0.5, 0.5);
startButton.width = 295;
startButton.height = 101;
startButton.y = height / 3;
startButton.eventMode = 'static';
startButton.on('pointerdown', showRules);
menu.addChild(startButton);

//Rules
let rulesTexture = Texture.from('/media/experiences/tobi/rules.png');
let rules = new Sprite(rulesTexture);
rules.anchor.set(0.5, 0.5);
rules.position.set(0, 0);
rules.width = 725 * 0.7;
rules.height = 725 * 0.7;
menu.addChild(rules);
rules.visible = false;

//Play button--this starts the game
let playTexture = Texture.from('/media/experiences/tobi/play.png');
let playButton = new Sprite(playTexture);
playButton.anchor.set(0.5, 0.5);
playButton.width = 166;
playButton.height = 66;
playButton.y = height / 3.5;
playButton.eventMode = 'static';
playButton.on('pointerdown', nextScene);
menu.addChild(playButton);
playButton.visible = false;

//Room backgrounds
//living room
let livingRoomTexture = Texture.from('/media/experiences/tobi/livingRoom.png');
let livingRoomBG = new Sprite(livingRoomTexture);
livingRoom.addChild(livingRoomBG);
backgrounds.push(livingRoomBG);

//kitchen TODO: final texture
let kitchenTexture = Texture.from('/media/experiences/tobi/kitchen.png');
let kitchenBG = new Sprite(kitchenTexture);
kitchen.addChild(kitchenBG);
backgrounds.push(kitchenBG);

//playroom
let playroomTexture = Texture.from('/media/experiences/tobi/playroom.png');
let playroomBG = new Sprite(playroomTexture);
playroom.addChild(playroomBG);
backgrounds.push(playroomBG);

//crib
let cribTexture = Texture.from('/media/experiences/tobi/crib.png');
let cribBG = new Sprite(cribTexture);
crib.addChild(cribBG);
backgrounds.push(cribBG);

//taken
let takenScreen = Texture.from('/media/experiences/tobi/takenFirst.png');
let takenBG = new Sprite(takenScreen);
taken.addChild(takenBG);
backgrounds.push(takenBG);

//loops through backgrounds to assign general info
for (let i = 0; i < backgrounds.length; i++) {
  backgrounds[i].width = width;
  backgrounds[i].height = height;
  backgrounds[i].position.set(-width / 2, -height / 2);
  backgrounds[i].eventMode = 'static';
  backgrounds[i].on('pointerdown', backgroundClick);
}

//Continue button
let continueTexture = Texture.from('/media/experiences/tobi/next.png');
let continueButton = new Sprite(continueTexture);
continueButton.anchor.set(0.5, 1);
continueButton.width = 158;
continueButton.height = 68;
continueButton.position.set(width / 3, height / 2);
continueButton.eventMode = 'static';
continueButton.on('pointerdown', nextScene);
livingRoom.addChild(continueButton);

//B&W item sprites--these are hidden on the page for the player to find
//living room item
let lrObjectTexture = Texture.from('/media/experiences/tobi/bookBW.png');
let livingRoomObject = new Sprite(lrObjectTexture);
livingRoomObject.width = width / 12;
livingRoomObject.height = height / 6;
livingRoomObject.anchor.set(0.5, 0.5);
livingRoomObject.position.set(-width / 6, height / 3);
livingRoom.addChild(livingRoomObject);
objects.push(livingRoomObject);

//kitchen
let kitchenObjectTexture = Texture.from('/media/experiences/tobi/bottleBW.png');
let kitchenObject = new Sprite(kitchenObjectTexture);
kitchenObject.width = width / 20;
kitchenObject.height = height / 8;
kitchenObject.anchor.set(0.5, 0.5);
kitchenObject.position.set(width / 4 + 10, -height / 6 + 20);
kitchen.addChild(kitchenObject);
objects.push(kitchenObject);

//playroom
let playroomObjectTexture = Texture.from('/media/experiences/tobi/bearBW.png');
let playroomObject = new Sprite(playroomObjectTexture);
playroomObject.width = width / 14;
playroomObject.height = height / 6;
playroomObject.anchor.set(0.5, 0.5);
playroomObject.position.set(width / 7, 0);
playroom.addChild(playroomObject);
objects.push(playroomObject);

//crib
let cribObjectTexture = Texture.from('/media/experiences/tobi/tobi.png');
let cribObject = new Sprite(cribObjectTexture);
cribObject.anchor.set(0.5, 0.5);
cribObject.width = 253;
cribObject.height = 439;
cribObject.position.set(0, 0);
crib.addChild(cribObject);
objects.push(cribObject);

//loops through for general object values
for (let i = 0; i < objects.length; i++) {
  objects[i].eventMode = 'static';
  objects[i].on('pointerdown', objectFound);
}

//Color items--these are the larger sprites displayed when the player finds the object
//note that initial height and width are manually set so that general scaling can be done later.
//living room
let lrItemColorTexture = Texture.from('/media/experiences/tobi/bookColor.png');
let lrItemColor = new Sprite(lrItemColorTexture);
lrItemColor.width = 626 * 0.7;
lrItemColor.height = 456 * 0.7;
livingRoom.addChild(lrItemColor);
colorObjects.push(lrItemColor);

//kitchen
let kitchenItemColorTexture = Texture.from('/media/experiences/tobi/bottleColor.png');
let kitchenItemColor = new Sprite(kitchenItemColorTexture);
kitchenItemColor.width = 253 * 0.7;
kitchenItemColor.height = 439 * 0.7;
kitchen.addChild(kitchenItemColor);
colorObjects.push(kitchenItemColor);

//playroom
let playroomItemColorTexture = Texture.from('/media/experiences/tobi/bearColor.png');
let playroomItemColor = new Sprite(playroomItemColorTexture);
playroomItemColor.width = 347 * 0.7;
playroomItemColor.height = 467 * 0.7;
playroom.addChild(playroomItemColor);
colorObjects.push(playroomItemColor);

//crib
let cribItemColorTexture = Texture.from('/media/experiences/tobi/tobi.png');
let cribItemColor = new Sprite(cribItemColorTexture);
cribItemColor.width = 253;
cribItemColor.height = 439;
crib.addChild(cribItemColor);
colorObjects.push(cribItemColor);

//loops through for common value assignments
for (let i = 0; i < colorObjects.length; i++) {
  colorObjects[i].anchor.set(0.5, 0.5);
  colorObjects[i].visible = false;
  if (i < 3) {
    //cribItem not moved
    colorObjects[i].y = -height / 5;
  }
}

//Hints
//icon to display hint
let displayTexture = Texture.from('/media/experiences/tobi/hint.png');
let displayHintSprite = new Sprite(displayTexture);
displayHintSprite.width = 127;
displayHintSprite.height = 129;
displayHintSprite.anchor.set(0.5, 0.5);
displayHintSprite.position.set(width / 2 - 100, -height / 3);
displayHintSprite.eventMode = 'static';
displayHintSprite.on('pointerdown', displayHint);
livingRoom.addChild(displayHintSprite);

//living room
let lrHintTexture = Texture.from('/media/experiences/tobi/lrHint.png');
let livingRoomHint = new Sprite(lrHintTexture);
livingRoom.addChild(livingRoomHint);
itemHints.push(livingRoomHint);

//kitchen
let kitchenHintTexture = Texture.from('/media/experiences/tobi/kitchenHint.png');
let kitchenHint = new Sprite(kitchenHintTexture);
kitchen.addChild(kitchenHint);
itemHints.push(kitchenHint);

//playroom
let playroomHintTexture = Texture.from('/media/experiences/tobi/playroomHint.png');
let playroomHint = new Sprite(playroomHintTexture);
playroom.addChild(playroomHint);
itemHints.push(playroomHint);

//crib
let cribHintTexture = Texture.from('/media/experiences/tobi/cribHint.png');
let cribHint = new Sprite(cribHintTexture);
crib.addChild(cribHint);
itemHints.push(cribHint);

//general data for item hints
for (let i = 0; i < itemHints.length; i++) {
  itemHints[i].width = 1144;
  itemHints[i].height = 125;
  itemHints[i].anchor.set(0.5, 0.5);
  itemHints[i].position.set(0, height / 3);
}

//Item Found Texts
//living room
let lrFoundTexture = Texture.from('/media/experiences/tobi/lrFound.png');
let lrFound = new Sprite(lrFoundTexture);
livingRoom.addChild(lrFound);
foundTexts.push(lrFound);

//kitchen
let kitchenFoundTexture = Texture.from('/media/experiences/tobi/kitchenFound.png');
let kitchenFound = new Sprite(kitchenFoundTexture);
kitchen.addChild(kitchenFound);
foundTexts.push(kitchenFound);

//playroom
let playroomFoundTexture = Texture.from('/media/experiences/tobi/playroomFound.png');
let playroomFound = new Sprite(playroomFoundTexture);
playroom.addChild(playroomFound);
foundTexts.push(playroomFound);

//crib
let cribFoundTexture = Texture.from('/media/experiences/tobi/cribFound.png');
let cribFound = new Sprite(cribFoundTexture);
crib.addChild(cribFound);
foundTexts.push(cribFound);

//loops through array for general data
for (let i = 0; i < foundTexts.length; i++) {
  foundTexts[i].width = 1144;
  foundTexts[i].height = 125;
  foundTexts[i].anchor.set(0.5, 0.5);
  foundTexts[i].position.set(0, height / 3.5);
  foundTexts[i].visible = false;
}

//Mobile adjustments
//Disables start if portrait mode is detected
if (isMobilePortrait) {
  startButton.visible = false;

  //TODO: display text prompting to rotate device
}

//item scaling for mobile
if (isMobileLandscape) {
  //scales color objects
  for (let i = 0; i < colorObjects.length; i++) {
    colorObjects[i].width *= 0.5;
    colorObjects[i].height *= 0.5;
  }

  //Scales and repositions text boxes
  for (let i = 0; i < foundTexts.length; i++) {
    foundTexts[i].width *= 0.5;
    foundTexts[i].height *= 0.5;
    foundTexts[i].x = -width / 15;
    itemHints[i].width *= 0.5;
    itemHints[i].height *= 0.5;
  }

  //Scales tobi
  cribObject.width *= 0.5;
  cribObject.height *= 0.5;

  //Scales and repositions(if needed) buttons
  startButton.width *= 0.8;
  startButton.height *= 0.8;
  continueButton.width *= 0.8;
  continueButton.height *= 0.8;
  continueButton.position.set(width / 2.5, height / 2.5);
  displayHintSprite.width *= 0.5;
  displayHintSprite.height *= 0.5;
  rules.width *= 0.5;
  rules.height *= 0.5;
  playButton.width *= 0.5;
  playButton.height *= 0.5;
  resetButton.width *= 0.8;
  resetButton.height *= 0.8;

  //TODO: ipad scaling
}

//Displays the rules and start button
function showRules() {
  startButton.visible = false;
  rules.visible = true;
  playButton.visible = true;
}

//Transitions to next scene
function nextScene() {
  if (currentStage < stages.length) {
    stages[currentStage].visible = false;

    if (currentStage <= 4) {
      stages[currentStage + 1].visible = true;
      currentStage++;
    }

    displayHintSprite.visible = true;

    //moves the button to the active stage
    switch (currentStage) {
      case 2:
        kitchen.addChild(continueButton);
        kitchen.addChild(displayHintSprite);
        break;
      case 3:
        playroom.addChild(continueButton);
        playroom.addChild(displayHintSprite);
        break;
      case 4:
        crib.addChild(continueButton);
        crib.addChild(displayHintSprite);
        break;
    }
  }

  //hides the button
  continueButton.visible = false;

  // This allows for the final slideshow of images to appear at the finale
  if (currentStage == 5) {
    let currentFrame = 0;
    const stageMover = setInterval(function () {
      finalTrans(currentFrame);
      currentFrame++;
      if (currentFrame >= 7) {
        clearInterval(stageMover);
      }
    }, 1500);
  }
}

//allows for the final images to be changed through time passing
function finalTrans(cF) {
  switch (cF) {
    case 0:
      takenBG = new Sprite(Texture.from('/media/experiences/tobi/takenSecond.png'));
      takenBG.position.set(-width / 2, -height / 2);
      takenBG.width = width;
      takenBG.height = height;
      taken.addChild(takenBG);
      break;
    case 1:
      takenBG = new Sprite(Texture.from('/media/experiences/tobi/takenThird.png'));
      takenBG.position.set(-width / 2, -height / 2);
      takenBG.width = width;
      takenBG.height = height;
      taken.addChild(takenBG);
      break;
    case 4:
      takenBG = new Sprite(Texture.from('/media/experiences/tobi/takenFinal.png'));
      takenBG.position.set(-width / 2, -height / 2);
      takenBG.width = width;
      takenBG.height = height;
      taken.addChild(takenBG);
      break;
    case 6:
      //Reset button--appears at the very end of the experience
      let resetTexture = Texture.from('/media/experiences/tobi/replay.png');
      let resetButton = new Sprite(resetTexture);
      resetButton.anchor.set(0.5, 0.5);
      resetButton.width = 295;
      resetButton.height = 101;
      resetButton.y = height / 3;
      resetButton.eventMode = 'static';
      resetButton.on('pointerdown', reset);
      taken.addChild(resetButton);
      break;
  }
}

//toggles display of hint text box for the current stage
function displayHint() {
  if (itemHints[currentStage - 1].visible == false) {
    itemHints[currentStage - 1].visible = true;
  } else if (itemHints[currentStage - 1].visible == true) {
    itemHints[currentStage - 1].visible = false;
  }
}

//switches visible object to centered color version
function objectFound() {
  //hides object on stage
  objects[currentStage - 1].visible = false;

  //displays revealed object
  colorObjects[currentStage - 1].visible = true;

  //hides hint box
  itemHints[currentStage - 1].visible = false;

  //reveals text box for corresponding stage
  foundTexts[currentStage - 1].visible = true;

  //darkens background
  backgrounds[currentStage - 1].tint = 0x898989;

  //hides hint box
  displayHintSprite.visible = false;

  //reveals continue button
  continueButton.visible = true;
}

//when a background (not on object sprite) is clicked, display textbox saying that's incorrect
function backgroundClick() {
  //Hides current hint box, does not occur during the slideshow
  if (currentStage <= 4) {
    itemHints[currentStage - 1].visible = false;
  }
}

//returns game to original state TODO: check back to see if anything else needs to be added here
function reset() {
  currentStage = 0;
  crib.visible = false;
  menu.visible = true;
  livingRoom.addChild(continueButton);
  //livingRoom.addChild(itemFoundText);
  livingRoom.addChild(displayHintSprite);
  continueButton.visible = false;
  //itemFoundText.visible = false;
  displayHintSprite.visible = true;

  //reset object visibility and tints
  for (let i = 0; i < objects.length; i++) {
    objects[i].visible = true;
    colorObjects[i].visible = false;
    backgrounds[i].tint = 0x000000;
  }

  location.reload();
}
