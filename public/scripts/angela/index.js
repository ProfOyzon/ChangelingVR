import * as sounds from './sounds.js';
import {
  Application,
  Container,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Texture,
} from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';
import * as helpers from './helpers.js';
import * as images from './images.js';
import * as textStyles from './textStyles.js';

// get references
const canvas = document.getElementById('back'); // game canvas
const vignettesDiv = document.querySelector('.vignettesDiv');
const gameResult = document.querySelector('#game-result'); // texts that show up when the game is finished
const restartBtn = document.querySelector('#restartBtn'); // brings to rules and resets the game
const playBtn = document.querySelector('#playBtn'); // changes to game state
const skipBtn = document.querySelector('#skipBtn'); // skips onboarding
const currentTimeSlot = document.querySelector('.currentTime'); // slots are the data that will be updated and displayed at the end of the game
const goodCompleteSlot = document.querySelector('.goodComplete'); // num of completed good tasks
const badCompleteSlot = document.querySelector('.badComplete'); // num of completed bad tasks
const goodMissSlot = document.querySelector('.goodMiss'); // num of good tasks missed
const badAvoidSlot = document.querySelector('.badAvoid'); // num of bad tasks avoided
const highScoreSlot = document.querySelector('.highScore'); // high score num
const allTimeHighScoreSlot = document.querySelector('.allTimeHighScore'); // all time high score num (doesn't stay with page reload; doesn't track cookies)

// create the app
const app = new Application({
  width: window.innerWidth * 0.87,
  height: window.innerHeight - 60, // full height minus the a little more than the height of the nav bar (58)
  view: canvas,
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// create variables

// 4 different states of the game. Freeze them so that the values won't be accidentally updated.
const GAME_STATE = Object.freeze({
  Onboarding: 'onboarding',
  Rule: 'rule',
  Playing: 'playing',
  Finished: 'finished',
});

let allTimeHighScore = 0; // all time high score
let highScore = 0; // high score
let gameState = GAME_STATE.Onboarding; // current game state
let screenWidth = app.view.width; // screen width
let screenHeight = app.view.height; // screen height
vignettesDiv.style.width = canvas.width + 'px'; // set vignettesDiv to be the same size as canvas
vignettesDiv.style.height = canvas.height + 'px';
let maxGameSpeed = 7; // max speed for the game
let initialGameSpeed = 3; // starting speed for the game
let gameSpeed = initialGameSpeed; // current game speed （will change during the game）
let frequency = 2.5; // update() is called every [frequency] seconds
let seconds = frequency; // seconds passed since the last call of update(), doesn't start from 0 so that player won't need to wait full [frequency] seconds to see tasks start scrolling
let gameDuration = 0; // seconds passed since the last update of the timer
let secondsForEachHour = 3; // every [secondsForEachHour] seconds, the timer will update to add 1 hour
let hours = 5; // hours passed for the day
const taskMargin = 100; // minimum space between tasks and the canvas borders

let tasksInGame = []; // array that stores all tasks in the game
let goodTaskIndex = 0; // track which good task to generate next. This will be randomized everytime we start a new game so that we won't start with the first task every time.
let badTaskIndex = 0; // track which bad task to generate next
let totalTaskGenerated = 0; // num of total tasks on screen
let goodTasksNumHighestMax = 3; // goodTasksNumMax can't go bigger than this
let goodTasksNumMax = 2; // Once [goodTasksNumMax] good tasks are generated in a row, there will be 1 bad task generated
let goodTasksNum = 0; // used to count for number of good tasks generated in a row
let goodTaskCompleted = 0; // num to track good tasks completed
let badTaskCompleted = 0; // num to track bad tasks completed
let goodTaskMissed = 0; // num to track good tasks missed
let badTaskAvoided = 0; // num to track bad tasks avoided
let currBgIndex; // background num index
let goodClickMax = 2; // see comment below
let goodClickNum = 0; // good clicks in a row (if more than [goodClickMax]), game speed will increase to make the game harder
let blur = 90; // of the vignettes
let spread = 0; // of the vignettes
let color = 'rgb(1, 10, 2, 0.9)'; // of the vignettes
let spreadChange = 30; // of the vignettes
let explosions = []; // current explosions on screen
let checkMarks = []; // current checkmarks on screen
let orangeLinePos = screenHeight - 180; // y position of the orange line
const explosionLinePos = screenHeight - 20; // y position of the red line
let currBg; // current background
let bgs = []; // array that stores all the background sprites
let restartBtnActive = false; // restart button state
let playBtnActive = false; // play button state
let skipBtnActive = false; // skip button state
let round = 1; // will increase every time the play restarts
let passedNoon = false; // used to indicate whether it's AM or PM to put after TIME NOW
let gameWin = false; // game win is true if the player powered through the whole day 24h
let isMobile = false; //used to re-scale sprites
let isMobileLandscape = false;

if (screenWidth < 600) {
  isMobile = true;
}
if (screenHeight < 600) {
  isMobileLandscape = true;
  orangeLinePos = screenHeight - 80;
}

// create different containers to store the game elements
const onboardingContainer = new Container();
const ruleContainer = new Container();
const playingContainer = new Container();
const finishedContainer = new Container();

// make it so that we can edit the zIndex of the children in the containers
onboardingContainer.sortableChildren = true;
ruleContainer.sortableChildren = true;
playingContainer.sortableChildren = true;
finishedContainer.sortableChildren = true;

// attach the containers to the app
app.stage.addChild(onboardingContainer);
app.stage.addChild(ruleContainer);
app.stage.addChild(playingContainer);
app.stage.addChild(finishedContainer);

// onboarding background
const onboardingBg = new Sprite(
  Texture.from('/experiences/angela/angelaBackground.png'),
);
onboardingBg.width = screenWidth;
onboardingBg.height = screenHeight;
onboardingContainer.addChild(onboardingBg);

// rule background
const ruleBg = new Sprite(Texture.from('/experiences/angela/angelaRules.png')); // black bg
ruleBg.width = screenWidth;
ruleBg.height = screenHeight;
ruleContainer.addChild(ruleBg);

/*
// click anywhere on the rule page to proceed to the actual game
ruleBg.eventMode = "static";
ruleBg.on('pointerdown', changeGameState);
ruleBg.cursor = 'pointer';
*/

// create sprites using background textures above
for (let i = 0; i < images.bgTxrs.length; i++) {
  let currentTxr = images.bgTxrs[i];
  const bg = new Sprite(currentTxr);

  // makethem fill up the whole screen
  bg.height = screenHeight;
  bg.width = screenWidth;

  // add the sprite to an array
  bgs.push(bg);

  // add all the sprites to the container for display
  playingContainer.addChild(bg);
}

//add transparent upset image
const backgrnd = new Sprite(images.upsetTxr);
//setting opacity to transparent
backgrnd.alpha = 0;
//making them fill the whole screen
backgrnd.height = screenHeight;
backgrnd.width = screenWidth;
//adding sprite to display container
playingContainer.addChild(backgrnd);

// make the last background the current background
currBgIndex = bgs.length - 1;
currBg = bgs[currBgIndex];

// create mom's sprite
/*const mom = new Sprite(images.momTxr);
const momScale = 8;
const momWidth = 469 / momScale;
const momHeight = 1181 / momScale;
mom.width = momWidth;
mom.height = momHeight;
mom.position.set(screenWidth / 2, // x - middle of the screen
	screenHeight - momHeight / 2 - 20); // y - 20px above the bottom of the screen
mom.anchor.set(0.5); // center of the sprite
*/

// create texts
let soliloquyIndex = 0;
let soliloquies = [
  "I'm Angela Summers.",
  "I'm a mom and a wife.",
  'I tend to be a woman who always thinks a lot......',
  'I want to be the best mom for my lovely kids.',
  'I will always try my hardest to make them happy and healthy.',
  'I want to be a good wife and support my beloved husband Dylan,',
  'who always cares for me and supports me.',
  'I try to achieve this, every single day.',
];
let AngelaSoliloquy = new Text(soliloquies[soliloquyIndex], textStyles.soliloquyTextStyle);
AngelaSoliloquy.position.set(screenWidth / 2 + 85, screenHeight / 2 - 100);
AngelaSoliloquy.anchor.set(0.5, 1);

// enable the skip button so that the player can proceed to the rule state
if (!skipBtnActive) {
  helpers.toggleButton(skipBtn);
  skipBtnActive = true;
}

/*
// hints created
// let onboardingHintTexts = 'Click anywhere or press SPACE to proceed.'
let ruleHintTexts = 'Click anywhere to proceed.'
// let onboardingHint = new Text(onboardingHintTexts, textStyles.hintTextStyle);
let ruleHint = new Text(ruleHintTexts, textStyles.hintTextStyle2);
// onboardingHint.position.set(screenWidth / 2 - 225, screenHeight / 2 - 300);
// onboardingHint.anchor.set(0, 1);
ruleHint.position.set(10, screenHeight - 10);
ruleHint.anchor.set(0, 1);
*/

// Adjust text position and buttons if mobile
if (isMobile) {
  AngelaSoliloquy.style.fontSize = '1.3em';
  AngelaSoliloquy.style.wordWrapWidth = 200;
  AngelaSoliloquy.position.set(screenWidth / 2 + 27, screenHeight / 2 - 50);

  skipBtn.style.fontSize = '10px';
  playBtn.style.fontSize = '10px';
}
/*

// rule title creation
let ruleTitle = new Text("Rules", textStyles.ruleTitleStyle);
ruleTitle.position.set(screenWidth / 2, screenHeight / 4);
ruleTitle.anchor.set(0.5);

// rule text creation
// Rule Text Styles: this text style uses screenWidth

const ruleTextStyle = new TextStyle({
	fill: '403e38',
	fill: 'white',
	fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
	fontSize: 22,
	wordWrap: true,
	wordWrapWidth: screenWidth / 2,
})
let ruleTexts = "- Click on the scrolling tasks to complete them.\n\n- Try to distinguish what tasks are good and complete them. \n\n- If you miss good tasks or complete bad tasks, Angela's world will become darker and darker.\n\n- Try your best to bring more sunshine into her day before her day ends.";
let rules = new Text(ruleTexts, ruleTextStyle);
rules.position.set(screenWidth / 4, screenHeight / 2 - 70);
rules.anchor.set(0);
*/

// time text creation -- starting time
let timeNow = 'TIME NOW:\n';
let timer = new Text(timeNow + '5:00 AM', textStyles.timerStyle);
timer.position.set(10, 10);

// score text creation -- current score
let score = 'SCORE:\n';
let currentScore = new Text(score + '0', textStyles.scoreStyle);
currentScore.position.set(1550, 10);

// create graphics used to draw the 2 lines
const lineGraphics = new Graphics();

// draw the orange line
lineGraphics
  .lineStyle(2, 0xdb7f07, 200)
  .moveTo(0, orangeLinePos)
  .lineTo(screenWidth, orangeLinePos);
lineGraphics.endFill();

// draw the red line (explosion line)
lineGraphics
  .lineStyle(2, 0xeb2309, 200)
  .moveTo(0, explosionLinePos)
  .lineTo(screenWidth, explosionLinePos);
lineGraphics.endFill();

// add the assets into the containers
onboardingContainer.addChild(AngelaSoliloquy /*, onboardingHint*/);
// ruleContainer.addChild(ruleTitle, rules,ruleHint);
playingContainer.addChild(lineGraphics, timer, currentScore);

// add event listeners
window.onresize = helpers.resizeCanvas(
  canvas,
  app,
  screenWidth,
  screenHeight,
  vignettesDiv,
  window,
);
restartBtn.addEventListener('click', restartGame);
playBtn.addEventListener('click', changeGameState);
skipBtn.addEventListener('click', changeGameState);
onboardingBg.eventMode = 'static';
onboardingBg.on('pointerdown', (event) => clickSoliloquy());
onboardingBg.cursor = 'pointer';
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    clickSoliloquy();
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// create helper functions

let introNum = 0;
// update soliloquy when the screen is clicked
function clickSoliloquy() {
  if (introNum == 0) {
    introNum = 1;
    sounds.introMusic.play();
  }
  // change to the next soliloquy in the array
  soliloquyIndex++;

  // make sure we don't go out of range
  if (soliloquyIndex >= soliloquies.length - 1) {
    // stop when we've displayed all the soliloquies
    soliloquyIndex = soliloquies.length - 1;
    //at the last soliloquy
    // disable the skip button

    skipBtn.innerHTML = 'Start my day';

    /*
		if (skipBtnActive) {
			helpers.toggleButton(skipBtn);
			skipBtnActive = false;
		}
		// enable the play button so that the player can proceed to the playing state
		if (!playBtnActive) {
			helpers.toggleButton(playBtn);
			playBtnActive = true;
		}
		*/
  }

  // update it in the game
  AngelaSoliloquy.text = soliloquies[soliloquyIndex];
}

// change game state function
function changeGameState() {
  if (gameState == GAME_STATE.Onboarding) {
    gameState = GAME_STATE.Rule;
  } else if (gameState == GAME_STATE.Rule) {
    gameState = GAME_STATE.Playing;
  } else if (gameState == GAME_STATE.Playing) {
    gameState = GAME_STATE.Finished;
  } else if (gameState == GAME_STATE.Finished) {
    gameState = GAME_STATE.Onboarding;
  }
}

//restarts the game -- returns to rules
function restartGame() {
  // go to rule state
  gameState = GAME_STATE.Rule;

  // update round num
  round++;
  highScore = 0;
}

// update() is called every [frequency] seconds
function update() {
  // before 5am and after 8pm, generate 1 task at a time
  if ((hours < 10 && !passedNoon) || (passedNoon && hours >= 8)) {
    generateTask(1);
  }
  // after 12pm and before 8pm, generate 3 tasks at a time
  else if (passedNoon && !isMobile && hours < 7) {
    generateTask(3);
  }
  //anytime in between, generate 2 tasks at a time
  //also only generates 2 at a time for mobile version
  else {
    generateTask(2);
  }
}

// set only the current bg to visible -- background images
function setCurrBgVisible() {
  // update current bg
  currBg = bgs[currBgIndex];

  // set all bgs to invisible, unless it's the current bg
  for (let i = 0; i < bgs.length; i++) {
    let bg = bgs[i];
    if (bg == currBg) {
      bg.visible = true;
    } else {
      bg.visible = false;
    }
  }
}

// lightens vignettes or lightens background
function lightenBackground() {
  //if image is not already transparent
  if (backgrnd.alpha > 0) {
    backgrnd.alpha -= 0.1;
  }
  // if there's vignettes, decrease that first
  if (spread > 0) {
    spread -= spreadChange;
    if (spread == 0) {
      blur = 0;
    }
    printVignettes(vignettesDiv);
  }
  // if there's no vignettes, just lighten the background
  else {
    // update current bg index
    currBgIndex++;

    // make sure bg index is not bigger than the range
    if (currBgIndex >= bgs.length - 1) {
      currBgIndex = bgs.length - 1;
    }

    // set only the current bg to visible
    setCurrBgVisible();
  }
}

// adds/increases vignettes or darkens background
function darkenBackground() {
  //if image is not already opaque
  if (backgrnd.alpha < 1) {
    backgrnd.alpha += 0.1;
  }
  // if it's the last bg, print vignettes (only add 1 spread so that it's not abrupt change)
  if (currBg == bgs[0] && spread == 0) {
    spread += 1;
    blur = 90; // set blur in case it's 0
    printVignettes(vignettesDiv);
  }
  // if it's the last bg and we've started to print vignettes already, increase [spreadChange] spread
  else if (currBg == bgs[0] && spread != 0) {
    spread += spreadChange;
    printVignettes(vignettesDiv);
  }
  // if it's not the last bg, just darken the background
  else {
    // update current bg index
    currBgIndex--;

    // make sure bg index doesn't go negative
    if (currBgIndex <= 0) {
      currBgIndex = 0;
    }

    // set only the current bg to visible
    setCurrBgVisible();
  }
}

// print vignettes onto the screen by changing the spread of the inner border
function printVignettes(vignettesDiv) {
  // if the vignettes didn't fully cover the whole screen, keep printing
  if (spread < screenHeight / 2) {
  }
  // finished closing off
  else {
    // end game
    gameState = GAME_STATE.Finished;
  }
  vignettesDiv.style.setProperty('--boxShadow', `0 0 ${blur}px ${spread}px ${color} inset`);
}

// click on the good task to complete it
function clickGoodTask(task) {
  goodTaskCompleted++; // update it to display when the game is finished
  highScore++;
  currentScore.text = score + highScore;
  goodClickNum++;

  // increase max number of good tasks that can be generated in a row
  goodTasksNumMax++; // (the more good tasks you click, the more good tasks will be generated. You'll more likely to win.)

  // make sure goodTasksNumMax is not too big to have almost none bad tasks
  if (goodTasksNumMax >= goodTasksNumHighestMax) {
    goodTasksNumMax = goodTasksNumHighestMax;
  }

  // increase game speed if there are [goodClickMax] good clicks in a row to make the game harder
  if (goodClickNum >= goodClickMax) {
    helpers.increaseGameSpeed(1.2, gameSpeed, maxGameSpeed);
    goodClickNum = 0;
  }

  // remove it from the screen
  playingContainer.removeChild(task);

  // remove it from the array that stores it
  let indexNum = tasksInGame.indexOf(task);
  tasksInGame.splice(indexNum, 1);

  // generate a green check mark at where the task was
  helpers.generateCheckMark(task.x + task.width / 2, task.y, checkMarks, playingContainer);

  // lighten the background
  lightenBackground();
}

// click on bad task
function clickBadTask(task) {
  // tasks moved passed the orange line will disapear and not clickable, so don't call this function for them
  if (!task.disappear && !task.clicked) {
    badTaskCompleted++; // update it to display when the game is finished
    highScore--;
    currentScore.text = score + highScore;

    task.clicked = true; // distinguish it from other bad tasks that aren't clicked

    // decrease max number of good tasks that can be generated in a row
    goodTasksNumMax--; // (the more bad tasks you click, the less good tasks will be generated. You'll be more likely to lose.)

    // make sure goodTasksNumMax is not too small to go below 1 (otherwise there will be no good tasks any more)
    if (goodTasksNumMax <= 1) {
      goodTasksNumMax = 1;
    }

    // remove it from the screen
    playingContainer.removeChild(task);

    // remove it from the array that stores it
    let indexNum = tasksInGame.indexOf(task);
    tasksInGame.splice(indexNum, 1);

    // increase game speed when a bad task is clicked
    helpers.increaseGameSpeed(1.1, gameSpeed, maxGameSpeed);
    sounds.failureSound.play();

    // darken the background
    darkenBackground();
  }
}

// create and display tasks onto the screen (pass in the number of tasks needed)
function generateTask(taskNum) {
  // update the number of total tasks
  totalTaskGenerated += taskNum;

  // initiate and create starting positions

  let yPos = 0; // default starting y pos (very top of the canvas)
  let yPosOffset = -300; // when generating more than 1 tasks, create different starting y pos within this range difference

  // x range to generate random starting x position
  let min1, max1, min2, max2, min3, max3; // for different taskNum, these minx and maxes will be different
  let xPos01, xPos02, xPos03, yPos01, yPos02, yPos03; // starting positions
  //used to check for overlap with existing tasks
  let overlap02 = false;
  let overlap03 = false;

  switch (taskNum) {
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // generate starting positions for 1 task
    case 1:
      {
        xPos01 = randomX();
        yPos01 = yPos;
      }
      break;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // generate starting positions for 2 tasks
    case 2:
      {
        // create 2 different starting y positions
        yPos01 = Math.floor(Math.random() * (0 - yPosOffset)) + yPosOffset;
        yPos02 = Math.floor(Math.random() * (0 - yPosOffset)) + yPosOffset;

        // Random x positions
        xPos01 = randomX();
        xPos02 = randomX();
        //loop for redoing position if there's overlap with 1
        while (
          (xPos02 > xPos01 && xPos02 < xPos01 + 200) ||
          (xPos02 < xPos01 && xPos01 < xPos02 + 200)
        ) {
          xPos02 = randomX();
        }
      }
      break;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // generate starting positions for 3 tasks
    case 3:
      {
        // create 3 different starting y positions
        yPos01 = Math.floor(Math.random() * (0 - yPosOffset)) + yPosOffset;
        yPos02 = Math.floor(Math.random() * (0 - yPosOffset)) + yPosOffset;
        yPos03 = Math.floor(Math.random() * (0 - yPosOffset)) + yPosOffset;

        //Random x positions
        xPos01 = randomX();
        xPos02 = randomX();
        xPos03 = randomX();

        //Redo X values if there's overlap
        while (
          (xPos03 > xPos01 && xPos03 < xPos01 + 200) ||
          (xPos03 < xPos01 && xPos01 < xPos03 + 200) ||
          (xPos03 > xPos02 && xPos03 < xPos02 + 200) ||
          (xPos03 < xPos02 && xPos02 < xPos03 + 200) ||
          (xPos02 > xPos01 && xPos02 < xPos01 + 200) ||
          (xPos02 < xPos01 && xPos01 < xPos02 + 200)
        ) {
          xPos02 = randomX();
          xPos03 = randomX();
        }
      }
      break;
  }

  // After generating positions, actually create the tasks

  // generate tasks based on the taskNum passed in
  for (let i = 0; i < taskNum; i++) {
    // initiate a new task
    let task;

    // check if we should generate a good or bad task
    if (goodTasksNum < goodTasksNumMax) {
      // generate a good task if we haven't reach the max yet
      task = new Sprite(images.goodTasks[goodTaskIndex]);

      //mobile version decreases sprite size
      if (isMobile || isMobileLandscape) {
        task.width = task.width / 2;
        task.height = task.height / 2;
      }
      goodTasksNum++;

      // update the correct index number for the next good task
      goodTaskIndex++;
      if (goodTaskIndex >= images.goodTasks.length) {
        goodTaskIndex = 0;
      }

      // add event listener for when it's pressed
      task.on('pointerdown', (event) => clickGoodTask(task));
    } else {
      // generate a bad task if we've reached the maximum good tasks
      task = new Sprite(images.badTasks[badTaskIndex]);

      //mobile version decreases sprite size
      if (isMobile || isMobileLandscape) {
        task.width = task.width / 2;
        task.height = task.height / 2;
      }

      // update the currect index number for the next bad task
      badTaskIndex++;
      if (badTaskIndex >= images.badTasks.length) {
        badTaskIndex = 0;
      }

      // add event listener for when it's pressed
      task.on('pointerdown', (event) => clickBadTask(task));

      // label bad task
      task.bad = true;

      // once we have 1 bad task, reset the goodTasksNum back to 0 so that we can start counting again
      goodTasksNum = 0;
    }

    // assign the random positions we created before for all task(s)
    switch (i) {
      case 0:
        {
          task.position.set(xPos01, yPos01);
        }
        break;
      case 1:
        {
          task.position.set(xPos02, yPos02);
        }
        break;
      case 2:
        {
          task.position.set(xPos03, yPos03);
        }
        break;
    }

    // make it interactive so that event listeners will work
    task.eventMode = 'static';
    // set anchor point to the bottom of the task
    task.anchor.set(0, 1);

    // set the rgb values of the task so that we can change it later (now it's white)
    task.r = 255;
    task.g = 255;
    task.b = 255;

    // display the task onto the screen
    playingContainer.addChild(task);

    // add task into the array
    tasksInGame.push(task);

    // add event listener for both good and bad tasks for when they're hovered
    task.on('pointerover', (event) => helpers.hoverTask(task));
  }
}

//generates a random x value
function randomX() {
  let xValue = 0;

  if (!isMobile) {
    xValue = Math.floor(Math.random() * (screenWidth - 200));
  } else {
    xValue = Math.floor(Math.random() * (screenWidth - 100));
  }

  return xValue;
}

// reset the game
function resetGame() {
  totalTaskGenerated = 0;
  goodTaskCompleted = 0;
  badTaskCompleted = 0;
  goodTaskMissed = 0;
  badTaskAvoided = 0;
  spread = 0;
  blur = 0;
  gameSpeed = initialGameSpeed;
  maxGameSpeed = 7;
  goodTaskIndex = 0;
  goodTasksNum = 0;
  badTaskIndex = 0;
  goodClickNum = 0;
  gameDuration = 0;
  hours = 5;
  highScore = 0;
  passedNoon = false;
  seconds = frequency; // after 0 sec into the game, task will appear
  gameWin = false;

  // randomize a starting good task (max: goodTasks.length - 1, min: 0)
  goodTaskIndex = Math.floor(Math.random() * (images.goodTasks.length - 1 - 0)) + 0;

  // reset timer
  timer.text = timeNow + '0' + hours + ':00 AM';
  //reset score
  currentScore.text = score + '0';

  // reset the vignettes using current values
  printVignettes(vignettesDiv);

  // make the last background the current background
  currBgIndex = bgs.length - 1;
  setCurrBgVisible();
  introNum = 0;
  gameNum1 = 0;

  //making image transparent
  backgrnd.alpha = 0;
}

//music stoppers
let gameNum1 = 0;
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// create the game loop
function gameLoop(delta) {
  onboardingContainer.visible = false;
  ruleContainer.visible = false;
  playingContainer.visible = false;
  finishedContainer.visible = false;

  switch (gameState) {
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // onboarding state
    case GAME_STATE.Onboarding:
      {
        onboardingContainer.visible = true;

        // disable the restart button
        if (restartBtnActive) {
          helpers.toggleButton(restartBtn);
          restartBtnActive = false;
        }

        // hide the game results
        gameResult.style.display = 'none';
      }
      break;
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // rule state
    case GAME_STATE.Rule:
      {
        ruleContainer.visible = true;

        // hide the game results
        gameResult.style.display = 'none';

        // disable the restart button
        if (restartBtnActive) {
          helpers.toggleButton(restartBtn);
          restartBtnActive = false;
        }

        // disable the play button
        if (!playBtnActive) {
          helpers.toggleButton(playBtn);
          playBtnActive = true;
        }
        // disable the skip button
        if (skipBtnActive) {
          helpers.toggleButton(skipBtn);
          skipBtnActive = false;
        }

        // reset the game
        resetGame();
      }
      break;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // playing state
    case GAME_STATE.Playing:
      {
        playingContainer.visible = true;
        if (gameNum1 == 0) {
          sounds.gameMusic1.play();
          gameNum1 += 1;
        }

        // hide the game results
        gameResult.style.display = 'none';

        //run the music
        sounds.introMusic.stop();

        // disable the play button
        if (playBtnActive) {
          helpers.toggleButton(playBtn);
          playBtnActive = false;
        }

        //disable the skip button
        if (skipBtnActive) {
          helpers.toggleButton(skipBtn);
          skipBtnActive = false;
        }

        // update frequency according to the speed (slow speed with small number frequency so it's not boring; high speed with bigger number frequency so that the tasks won't overlap with the previous ones)
        if (gameSpeed >= 6 && !isMobile) {
          frequency = 1.5;
        } else if (gameSpeed >= 1.6 && !isMobile) {
          frequency = 2;
        }

        //Slightly longer breaks for portrait mode (deterring overlapping)
        if (gameSpeed >= 6 && isMobile) {
          frequency = 2.0;
        } else if (gameSpeed >= 1.6 && isMobile) {
          frequency = 2.5;
        }

        // starting from 4pm, increase the max speed to 5 instead of 3.9
        if (hours > 4 && passedNoon) {
          maxGameSpeed = 7;
        }

        // update every [frequency] seconds
        // count the seconds passed since the last time update() is called
        seconds += (1 / 60) * delta;
        // if we've counted to [frequency]
        if (seconds >= frequency + 0.5) {
          // call the update function to generate more tasks
          update();
          // reset the counter back to 0
          seconds = 0;
        }

        // count the seconds passed since the last update of the timer
        gameDuration += (1 / 60) * delta;
        // update every [secondsForEachHour] seconds. Total max game time will be 24 * secondsForEachHour. So, if it's 5, total game time wil be 120 sec (2 min).
        if (gameDuration >= secondsForEachHour) {
          // update the hour
          hours++;
          // if it's 12:00 passed noon, make it 5:00 AM. Game Ends.
          if (hours == 10 && passedNoon) {
            // end game
            gameWin = true;
            gameState = GAME_STATE.Finished;
          }
          // starting from 12pm, we'll use PM instead of AM (didn't use >12 b/c otherwise the game will be endless. Everytime it gets to 12:00pm, it will restart another afternoon.)
          if (hours > 11) {
            passedNoon = true;
          }
          // use 01:00 PM instead of 13:00 PM, etc. So, we'll need to minus 12.
          if (hours > 12) {
            hours = hours - 12;
          }
          // if it's something like 9:00 with one digit, will need to add a 0 before
          if (hours < 10) {
            timer.text = timeNow + '0' + hours + ':00';
          } else {
            timer.text = timeNow + hours + ':00';
          }
          // Add either AM or PM
          if (!passedNoon) {
            timer.text += ' AM';
          } else {
            timer.text += ' PM';
          }
          // reset the counter every [secondsForEachHour] seconds
          gameDuration = 0;
        }

        // tasks scrolling down constantly
        for (let i = 0; i < tasksInGame.length; i++) {
          // store the current task
          const task = tasksInGame[i];

          // move it down
          task.y += gameSpeed;

          // if they reach the orange line
          if (task.y >= orangeLinePos) {
            // for bad tasks that are not clicked, make them gradually disappear
            if (task.bad && !task.clicked && task.y - task.height >= orangeLinePos) {
              task.disappear = true;
              task.alpha *= 0.95;
            }

            // for good tasks, make them turn red and grow bigger as if they will explode soon
            if (!task.bad) {
              task.width *= 1.002;
              task.height *= 1.002;
              // don't need to decrease r because we want to get close to (255, 0, 0).
              task.g -= 4;
              task.b -= 5;
              task.tint = `rgb(${task.r}, ${task.g}, ${task.b})`; // update the task color using the updated rgb values
            }

            // increase game speed
            helpers.increaseGameSpeed(1.1, gameSpeed, maxGameSpeed);
          }

          // if the good tasks reach the red line, make them explode
          if (task.y >= explosionLinePos && !task.bad) {
            goodTaskMissed++;
            highScore--;
            currentScore.text = score + highScore;

            // remove it from the screen
            playingContainer.removeChild(task);

            // remove it from the array that stores it
            let indexNum = tasksInGame.indexOf(task);
            tasksInGame.splice(indexNum, 1);

            // generate explosion at this position
            //TODO: Remove this?
            //helpers.generateExplosion(task.x, task.y, explosions, playingContainer);
            //sounds.failureSound.play();
            // darken the background
            darkenBackground();

            // increase game speed
            helpers.increaseGameSpeed(1.1, gameSpeed, maxGameSpeed);
          }

          // check if the task goes off screen
          if (task.y >= task.height + screenHeight) {
            // if so, remove it from the game
            playingContainer.removeChild(task);
            let indexNum = tasksInGame.indexOf(task);
            tasksInGame.splice(indexNum, 1);
            if (task.disappear) {
              badTaskAvoided++;
              highScore++;
              currentScore.text = score + highScore;
            }
          }

          // increase game speed
          helpers.increaseGameSpeed(1.1, gameSpeed, maxGameSpeed);
        } // end of for loop

        // loop through all explosions
        for (let i = 0; i < explosions.length; i++) {
          // store the current explosion sprite
          let explosion = explosions[i];

          // move the explosion down by gameSpeed
          explosion.y += gameSpeed;

          // make the explosion bigger
          explosion.width += explosion.width / 2;
          explosion.height += explosion.height / 2;

          // start fading it out when it reaches this point
          if (explosion.y >= explosionLinePos + 2) {
            // container.removeChild(task);
            // let indexNum = tasksInGame.indexOf(task);
            // tasksInGame.splice(indexNum, 1);
            if (explosion.alpha >= 0) {
              explosion.alpha *= 0.99;
            }
          }

          // remove the explosion from the game
          if (explosion.y >= explosionLinePos + 7) {
            playingContainer.removeChild(explosion);
            let indexNum = explosions.indexOf(explosion);
            explosions.splice(indexNum, 1);
          }
        }

        // loop through all check marks
        for (let i = 0; i < checkMarks.length; i++) {
          // store the current check
          let check = checkMarks[i];

          // if it's still moving down
          if (check.moveDown) {
            // keep moving it down for 50 px before it bounces up
            if (check.y <= check.initialY + 10) {
              check.y *= 1.02;
            } else {
              // start to move up from here
              check.moveDown = false;
            }
          }

          if (!check.moveDown) {
            check.y -= 0.01;

            if (check.alpha >= 0) {
              check.y -= gameSpeed;
            }

            if (check.y <= check.initialY - 30) {
              check.alpha *= 0.7;
            }
          }

          if (check.alpha <= 0.01) {
            playingContainer.removeChild(check);
            // let indexNum = checkMarks.indexOf(check);
            checkMarks.splice(i, 1);
          }
        }
      }
      break;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // finished state
    case GAME_STATE.Finished:
      {
        playingContainer.visible = true;
        finishedContainer.visible = true;

        //stopping all music
        sounds.gameMusic1.stop();

        // clear tasks array and remove all of them from the screen
        for (let i = 0; i < tasksInGame.length; i++) {
          playingContainer.removeChild(tasksInGame[i]);
          tasksInGame.splice(i, 1);
        }

        // clear explosions array and remove all of them from the screen
        for (let i = 0; i < explosions.length; i++) {
          playingContainer.removeChild(explosions[i]);
          explosions.splice(i, 1);
        }

        // update the game result texts
        if (hours < 10) {
          currentTimeSlot.innerText = '0' + hours + ':00';
        } else {
          currentTimeSlot.innerText = hours + ':00';
        }
        if (!passedNoon) {
          currentTimeSlot.innerText += ' AM';
        } else {
          currentTimeSlot.innerText += ' PM';
        }

        // check if the day ends
        if (gameWin) {
          currentTimeSlot.innerText += ".  You've powered through today! Great job!";
        } else {
          currentTimeSlot.innerText += ".  You've become overwhelmed before the day even ended...";
        }
        if (highScore > allTimeHighScore) {
          allTimeHighScore = highScore;
        }
        goodCompleteSlot.innerText = goodTaskCompleted;
        badCompleteSlot.innerText = badTaskCompleted;
        goodMissSlot.innerText = goodTaskMissed;
        badAvoidSlot.innerText = badTaskAvoided;
        highScoreSlot.innerText = highScore;
        allTimeHighScoreSlot.innerText = allTimeHighScore;

        // show the game results
        gameResult.style.display = 'block';

        // enable the restart button
        if (!restartBtnActive) {
          helpers.toggleButton(restartBtn);
          restartBtnActive = true;
        }
      }
      break;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
} // end of game loop

// add this 60fps game loop to the app
app.ticker.add(gameLoop);
