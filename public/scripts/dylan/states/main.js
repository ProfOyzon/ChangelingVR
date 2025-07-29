import { Application, Graphics, Text, TextStyle } from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';
import { makeButton, makeCover, makeRepeater, makeReplaceCover, makeWindow } from '../util.js';

/**
 * Initializes the main state's container and update function
 * @param {Application} app
 * @param {*} tickerManager
 */
export function initMain(app, tickerManager) {
  // Need these to add graphics to the main state's container and transition to the play state
  const stateMain = app.stage.children[1];
  const statePlay = app.stage.children[0];

  // Variables that will be used in the main state's update loop
  const lines = [
    `${new Date().toString()}`,
    'Got a lot to do today...',
    "But I can't waste any time.",
    'My family needs me.',
    'Gotta stay focused.',
    'I got this.',
    'This is Dylan, signing off.',
  ];
  const twoPi = Math.PI * 2;
  const arcRate = twoPi * 0.001;
  let endAngle = 0;
  let iLetter = 0;
  let iLine = 0;

  // Code that should continuously run in the main state's update loop
  const repeatShrinkStart = makeRepeater(app.ticker, shrinkStart, 0, 0, false);
  const repeatShrinkIntro = makeRepeater(app.ticker, shrinkIntro, 1000, 0, false);
  const repeatGrowIntro = makeRepeater(app.ticker, growIntro, 250, 0, false);
  const repeatBlink = makeRepeater(app.ticker, blink, 0, 500, false);
  const repeatType = makeRepeater(app.ticker, type, 1000, 50, false);
  const repeatStartGame = makeRepeater(app.ticker, startGame, 0, 0, false);
  const repeatMoveCaret = makeRepeater(app.ticker, moveCaret, 0, 0, false);
  const repeatSkip = makeRepeater(app.ticker, skip, 0, 0, false);

  // Main state's graphics
  let title = makeCover('OVERTIME', 'a Dylan Experience', false);

  //rules text formatting is adjusted if the user is on a tablet
  let rules;
  if (app.screen.width - app.screen.height < 400) {
    rules = makeCover(
      'RULES',
      'Complete as many random tasks as you can! \nComplete the task \nbefore its timer runs out.' +
        '\nThe game ends when you fail 3 tasks.' +
        "\n\nTask Rules: \nBaseball: Click or Tap Dylan \nwhen the ball is over Dylan's glove." +
        '\nCooking: Drag 3 ingredients from the \nrecipe into the bowl.' +
        '\nRepairs: Press the key (tap on mobile) \nthe letter prompts \nto turn the wrench.',
      true,
    );
  } else {
    rules = makeCover(
      'RULES',
      'Complete as many random tasks as you can! \nEach task must be completed before its timer runs out.' +
        '\nThe game ends when you fail 3 tasks.' +
        "\n\nTask Rules: \nBaseball: Click or Tap Dylan \nwhen the ball is over Dylan's glove to catch it." +
        '\nCooking: Drag 3 ingredients from the recipe into the bowl.' +
        '\nRepairs: Press the key shown on screen (tap the prompt on mobile) \nto turn the wrench.',
      true,
    );
  }
  rules.x = 0;
  rules.y = -window.screen.height / 4;
  rules.visible = false;
  title.x = 0;
  title.y = 0;
  if (window.screen.height <= 430) {
    title.y = -75;
  } else if (window.screen.height <= 770) {
    title.y = -125;
  }
  let buttonStart = makeButton('START', startClicked);
  let buttonRules = makeButton('RULES', showRules);
  buttonStart.x = -buttonStart.width * 0.5 - buttonStart.width / 1.5;
  buttonStart.y = title.height + title.y;
  buttonRules.y = -buttonRules.width * 0.5 + buttonStart.width / 1.5;
  buttonRules.y = title.height + title.y;

  //Need to fix wrapping problems
  if (window.screen.height > window.screen.width) {
    title.removeChildren();
    buttonStart.removeChildren();
    buttonRules.removeChildren();
    title = makeReplaceCover(
      'OVERTIME',
      'a Dylan Experience',
      'Can only be played in landscape mode',
      'Please flip your device and refresh the page',
    );
    title.x = 0;
    title.y = 0;
  }

  const throbberClose = new Text(
    'Shutting Down...',
    new TextStyle({
      fontFamily: 'fira',
      fontSize: 32,
      fill: 0xc3868c,
    }),
  );
  throbberClose.x = -throbberClose.width * 0.5;
  throbberClose.y = -throbberClose.height * 0.5;
  throbberClose.visible = false;
  let dialogueStyle = new TextStyle({
    fontFamily: 'fira',
    fontSize: 32,
    fill: 0xa9b665,
  });
  if (window.screen.width < 1180) {
    //The dialogue font size will decrease according to how small the screen width becomes
    dialogueStyle.fontSize = 32 - (1180 - window.screen.width / 2) / window.screen.width / 0.09;
  }
  const dialogue = new Text('', dialogueStyle);
  dialogue.anchor.set(0.5);
  const tip = new Text(
    "Press 'Enter' or Tap to accelerate or progress dialogue\n\nHold 'Enter' or Tap to skip intro",
    new TextStyle({
      align: 'center',
      fontFamily: 'fira',
      fontSize: 16,
      fill: 0xe78a4e,
    }),
  );
  tip.x = -tip.width * 0.5;
  tip.y = -tip.height * 0.5 + 128;
  if (window.screen.height < 540) {
    // The tip text will slowly increase to allow for the skip circle to appear at the bottom of the canvas
    // The math below allows this to happen
    tip.y = 128 - (1180 - window.screen.height / 2) / window.screen.height / 0.02;
    // The y value of dialogue text will also adjust accordingly
    dialogue.y = -(1180 - window.screen.height) / window.screen.height / 0.05;
  }
  const throbberSkip = new Graphics().lineStyle(4, 0x65aea3);
  const caret = new Graphics().beginFill(0xaeafad).drawRect(0, 0, 4, 32);
  const windowStart = makeWindow(title, rules, buttonStart, buttonRules);
  const windowIntro = makeWindow(throbberClose, dialogue, tip, throbberSkip, caret);
  windowIntro.container.width = 0;
  windowIntro.container.height = 0;
  windowIntro.container.alpha = 0;
  stateMain.addChild(windowStart.container, windowIntro.container);

  tickerManager.main = () => {
    repeatShrinkStart.run();
    repeatGrowIntro.run();
    repeatBlink.run();
    repeatType.run();
    repeatMoveCaret.run();
    repeatSkip.run();
    repeatStartGame.run();
    repeatShrinkIntro.run();
  };

  // The event listeners for pointers have different methods
  // This is due to pointers not being compatible with event.repeat

  function startClicked() {
    repeatShrinkStart.condition = true;
    document.body.addEventListener('keydown', checkSkip);
    document.body.addEventListener('pointerdown', checkPointerSkip);
    document.body.addEventListener('keyup', progress);
    document.body.addEventListener('pointerup', resetProgress);
  }

  //Displays the rules
  function showRules() {
    title.visible = false;
    rules.visible = true;

    //repositions the start button and hides the rules button on mobile
    if (
      (app.screen.height < 500 && app.screen.width < 950) ||
      app.screen.width - app.screen.height < 400
    ) {
      buttonRules.visible = false;
      buttonStart.y = -window.screen.height / 3;
      buttonStart.x = window.screen.width / 3.5;
    }
    if (app.screen.width - app.screen.height < 400) {
      buttonStart.y = window.screen.height / 3;
    }
  }

  // Initiates the skipping sequence if the user is holding down the Enter key
  function checkSkip() {
    if (
      tickerManager.active === tickerManager.main &&
      !repeatShrinkIntro.condition &&
      event.key === 'Enter' &&
      event.repeat
    )
      repeatSkip.condition = true;
  }

  // These two variables allow the pointers to trigger the intro skip
  let downInterval = null;
  let timeDown = 0;

  function timeInc() {
    timeDown += 1;
    if (
      tickerManager.active === tickerManager.main &&
      !repeatShrinkIntro.condition &&
      timeDown >= 1
    ) {
      repeatSkip.condition = true;
      clearInterval(downInterval);
    }
  }

  function checkPointerSkip() {
    event.preventDefault();
    downInterval = setInterval(timeInc, 1000);
  }

  function resetProgress() {
    clearInterval(downInterval);
    timeDown = 0;
    if (repeatSkip.condition) {
      repeatSkip.condition = false;
      endAngle = 0;
      throbberSkip.clear();
      throbberSkip.lineStyle(4, 0x65aea3);
      return;
    } else if (repeatType.isReady()) {
      if (iLine >= 7) {
        iLine = 7;
      }
      if (iLine >= lines.length) {
        repeatStartGame.condition = true;
        return;
      }
      if (iLetter < lines[iLine].length && iLetter != 7) {
        dialogue.text = lines[iLine];
        iLetter = lines[iLine].length;
        return;
      }
      iLine++;
      dialogue.text = '';
      iLetter = 0;
    }
  }

  // Either progresses the dialogue or cancels the skipping sequence
  function progress() {
    if (
      tickerManager.active !== tickerManager.main ||
      repeatShrinkIntro.condition ||
      event.key !== 'Enter'
    )
      return;
    if (repeatSkip.condition) {
      repeatSkip.condition = false;
      endAngle = 0;
      throbberSkip.clear();
      throbberSkip.lineStyle(4, 0x65aea3);
      return;
    } else if (repeatType.isReady()) {
      if (iLine >= 7) {
        iLine = 7;
      }
      if (iLine >= lines.length) {
        repeatStartGame.condition = true;
        return;
      }
      if (iLetter < lines[iLine].length) {
        dialogue.text = lines[iLine];
        iLetter = lines[iLine].length;
        return;
      }
      iLine++;
      dialogue.text = '';
      iLetter = 0;
    }
  }
  // Shrinks the main menu window
  function shrinkStart() {
    windowStart.resize(app.ticker.deltaMS, -1);
    if (windowStart.container.width > 0) return;
    windowStart.container.destroy(true);
    repeatShrinkStart.condition = false;
    repeatGrowIntro.condition = true;
    repeatBlink.condition = true;
    repeatType.condition = true;
    repeatMoveCaret.condition = true;
  }
  // Shrinks the window with the introductory dialogue
  function shrinkIntro() {
    windowIntro.resize(app.ticker.deltaMS, -1);
    if (windowIntro.container.width > 0) return;
    repeatShrinkIntro.condition = false;
    windowIntro.container.destroy(true);
    tickerManager.active = tickerManager.play;
  }
  // Grows the window with the introductory dialogue
  function growIntro() {
    windowIntro.resize(app.ticker.deltaMS, 1);
    if (windowIntro.container.width < windowIntro.ogWidth) return;
    windowIntro.container.alpha = 1;
    windowIntro.container.width = windowIntro.ogWidth;
    windowIntro.container.height = windowIntro.ogHeight;
    repeatGrowIntro.condition = false;
  }
  // Makes the typing caret visible and invisible at certain intervals
  function blink() {
    caret.visible = !caret.visible;
  }
  // Shows more dialogue
  function type() {
    if (iLine >= 7) return;
    if (repeatShrinkIntro.condition || iLetter >= lines[iLine].length) return;
    dialogue.text += lines[iLine][iLetter];
    iLetter++;
  }
  // Keeps dialogue centered and moves the caret accordingly
  function moveCaret() {
    caret.x = dialogue.width * 0.5;
    caret.y = dialogue.y - dialogue.height * 0.5;
  }
  // Charges up the skip indicator
  function skip() {
    endAngle += arcRate * app.ticker.deltaMS;
    throbberSkip.arc(0, tip.y + tip.height + 32, 16, 0, endAngle);
    if (endAngle >= twoPi) repeatStartGame.condition = true;
  }
  // Transitions to the play state
  function startGame() {
    repeatShrinkIntro.condition = true;
    repeatStartGame.condition = false;
    repeatBlink.condition = false;
    repeatType.condition = false;
    repeatMoveCaret.condition = false;
    repeatSkip.condition = false;
    for (const child of windowIntro.container.children) child.visible = false;
    throbberClose.visible = true;
    statePlay.visible = true;
    document.body.removeEventListener('keydown', checkSkip);
    document.body.removeEventListener('pointerdown', checkPointerSkip);
    document.body.removeEventListener('keyup', progress);
    document.body.removeEventListener('pointerup', resetProgress);
  }
}
