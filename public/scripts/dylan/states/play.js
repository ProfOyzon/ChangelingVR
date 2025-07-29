import { Application, Container, Graphics, LINE_CAP } from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';
import { initTask1 } from '../tasks/task1.js';
import { initTask2 } from '../tasks/task2.js';
import { initTask3 } from '../tasks/task3.js';
import { makeButton, makeCover, makeRepeater, makeWindow, rng } from '../util.js';

/**
 * Initializes the play state's container and update function
 * @param {Application} app
 * @param {*} tickerManager
 */
export function initPlay(app, tickerManager) {
  // Need this to add graphics to the play state's container
  const stateGame = app.stage.children[0];

  // Variables that will be used in the play state's update loop
  const barLength = app.renderer.width - 128;
  const barY = app.renderer.height * 0.5 - 32;
  const stats = { score: 0 };
  const tasks = [initTask1(app, stats), initTask2(app, stats), initTask3(app, stats)];
  let timeLimit = 10000;
  let drainRate = barLength / timeLimit; // The divisor represents the amount of time (ms) the player has to finish the task
  let taskDoneCount = 0;
  let currentTask = tasks[rng(0, 3)];
  let prevScore = stats.score;
  let lives = 3;

  // Code that should continuously run in the play state's update loop
  const repeatPlay = makeRepeater(app.ticker, play, 0, 0, true);
  const repeatShrinkIntermission = makeRepeater(app.ticker, shrinkIntermission, 1000, 0, false);
  const repeatIncreaseScore = makeRepeater(app.ticker, increaseScore, 1000, 0, false);
  const repeatDecreaseLives = makeRepeater(app.ticker, decreaseLives, 1000, 0, false);
  const repeatEndGame = makeRepeater(app.ticker, endGame, 1000, 0, false);

  // Play state's graphics
  const intermissionBG = new Graphics()
    .beginFill(0x282828)
    .drawRect(
      -app.renderer.width * 0.5,
      -app.renderer.height * 0.5,
      app.renderer.width,
      app.renderer.height,
    );

  const intermissionText = makeCover(`${stats.score}`, `Lives: ${lives}`);
  intermissionText.x = 0;
  intermissionText.y = 0;

  const buttonRestart = makeButton('RESTART', () => {
    buttonRestart.visible = false;
    repeatShrinkIntermission.condition = true;
    stats.score = 0;
    prevScore = stats.score;
    lives = 3;
    timeLimit = 10000;
    drainRate = barLength / timeLimit;
    taskDoneCount = 0;
    intermissionText.children[0].text = `${prevScore}`;
    intermissionText.children[1].text = `Lives: ${lives}`;
  });
  buttonRestart.x = -buttonRestart.width * 0.5;
  buttonRestart.y = intermissionText.height;
  buttonRestart.visible = false;

  const intermissionWindow = makeWindow(intermissionBG, intermissionText, buttonRestart);
  intermissionWindow.container.visible = false;

  const bar = new Graphics();
  bar.lineStyle({ cap: LINE_CAP.ROUND, color: 0xea6962, width: 16 });
  bar.moveTo(-barLength * 0.5, barY);
  bar.lineTo(barLength * 0.5, barY);

  stateGame.addChild(
    tasks[0].container,
    tasks[1].container,
    tasks[2].container,
    bar,
    intermissionWindow.container,
  );
  for (const task of tasks) task.container.visible = false;
  currentTask.container.visible = true;

  tickerManager.play = () => {
    intermissionText.x = 0;
    intermissionText.children[1].x = 0;

    repeatShrinkIntermission.run();
    repeatEndGame.run();
    repeatDecreaseLives.run();
    repeatIncreaseScore.run();
    repeatPlay.run();
  };

  document.body.addEventListener('mousedown', (event) => {
    if (tickerManager.active === tickerManager.play && !intermissionWindow.container.visible)
      currentTask.handleMousedown();
  });
  document.body.addEventListener('mouseenter', (event) => {
    if (tickerManager.active === tickerManager.play && !intermissionWindow.container.visible)
      currentTask.handleMouseenter();
  });
  document.body.addEventListener('mouseleave', (event) => {
    if (tickerManager.active === tickerManager.play && !intermissionWindow.container.visible)
      currentTask.handleMouseleave();
  });
  document.body.addEventListener('mousemove', (event) => {
    if (tickerManager.active === tickerManager.play && !intermissionWindow.container.visible)
      currentTask.handleMousemove();
  });
  document.body.addEventListener('mouseout', (event) => {
    if (tickerManager.active === tickerManager.play && !intermissionWindow.container.visible)
      currentTask.handleMouseout();
  });
  document.body.addEventListener('mouseover', (event) => {
    if (tickerManager.active === tickerManager.play && !intermissionWindow.container.visible)
      currentTask.handleMouseover();
  });
  document.body.addEventListener('mouseup', (event) => {
    if (tickerManager.active === tickerManager.play && !intermissionWindow.container.visible)
      currentTask.handleMouseup();
  });
  document.body.addEventListener('keydown', (event) => {
    if (tickerManager.active === tickerManager.play && !intermissionWindow.container.visible)
      currentTask.handleKeydown();
  });
  document.body.addEventListener('keyup', (event) => {
    if (tickerManager.active !== tickerManager.play) return;
    if (
      event.key === 'Escape' &&
      !repeatIncreaseScore.condition &&
      !repeatDecreaseLives.condition &&
      !repeatShrinkIntermission.condition &&
      intermissionText.children[0].text !== 'GAME OVER'
    ) {
      if (intermissionText.children[0].text === `PAUSED`) {
        intermissionText.children[0].text = `${prevScore}`;
        intermissionText.children[1].text = `Lives: ${lives}`;
        intermissionWindow.container.visible = false;
        repeatPlay.condition = true;
      } else if (intermissionText.children[0].text !== 'PAUSED') {
        intermissionText.children[0].text = `PAUSED`;
        intermissionText.children[1].text = `Press 'Esc' to unpause`;
        intermissionWindow.container.visible = true;
        repeatPlay.condition = false;
      }
      return;
    }
    if (tickerManager.active === tickerManager.play && !intermissionWindow.container.visible)
      currentTask.handleKeyup(event);
  });
  // Change the task
  function reset() {
    currentTask.container.visible = false;
    currentTask.reset();
    currentTask = tasks[rng(0, 3)];
    intermissionWindow.container.visible = true;
    repeatPlay.condition = false;
  }
  // Play/update the active task
  function play() {
    currentTask.update();
    bar.width -= drainRate * app.ticker.deltaMS;
    if (bar.width <= 0) {
      reset();
      bar.width = barLength;
      repeatDecreaseLives.condition = true;
    } else if (prevScore > stats.score) {
      reset();
      bar.width = barLength;
      repeatDecreaseLives.condition = true;
      stats.score = prevScore;
    } else if (prevScore < stats.score) {
      reset();
      //calculates score based on time remaining
      stats.score += Math.floor(bar.width / 2);
      bar.width = barLength;
      repeatIncreaseScore.condition = true;
      taskDoneCount++;
      localStorage.setItem('winCount', JSON.stringify(taskDoneCount));
      if (taskDoneCount % 3 === 0 && timeLimit > 5000) {
        timeLimit -= 2000;
        drainRate = barLength / timeLimit;
      }
    }
  }
  // Shrink the intermission window and transition to the next task
  function shrinkIntermission() {
    intermissionWindow.resize(app.ticker.deltaMS, -1);
    if (intermissionWindow.container.width > 0) return;
    intermissionWindow.container.visible = false;
    intermissionWindow.container.width = intermissionWindow.ogWidth;
    intermissionWindow.container.height = intermissionWindow.ogHeight;
    intermissionWindow.container.alpha = 1;
    repeatShrinkIntermission.counter = 0;
    repeatShrinkIntermission.condition = false;
    repeatPlay.condition = true;
    currentTask.container.visible = true;
  }
  // Animate the score visibly increasing
  function increaseScore() {
    prevScore += Math.floor(app.ticker.deltaMS);
    if (prevScore > stats.score) {
      prevScore = stats.score;
      repeatShrinkIntermission.condition = true;
      repeatIncreaseScore.counter = 0;
      repeatIncreaseScore.condition = false;
      repeatShrinkIntermission.condition = true;
    }
    intermissionText.children[0].text = `${prevScore}`;
  }
  // End the game
  function endGame() {
    intermissionText.children[0].text = 'GAME OVER';
    intermissionText.children[1].text = 'Try Again?';
    buttonRestart.visible = true;
    repeatEndGame.counter = 0;
    repeatEndGame.condition = false;
  }
  // Animate the lives count visibly decreasing
  function decreaseLives() {
    lives--;
    intermissionText.children[1].text = `Lives: ${lives}`;
    repeatDecreaseLives.counter = 0;
    repeatDecreaseLives.condition = false;
    if (lives <= 0) {
      repeatEndGame.condition = true;
      return;
    }
    repeatShrinkIntermission.condition = true;
  }
}
