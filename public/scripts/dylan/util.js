import { Container, Graphics, LINE_CAP, LINE_JOIN, Text, TextStyle, Ticker } from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';

/**
 * Makes an object that can repeatedly call a function at a certain rate
 * @param {Ticker} ticker The PIXI Ticker that the repeater will run in
 * @param {Function} action The function to call
 * @param {number} delay How many ms to wait before beginning the function calls
 * @param {number} rate The rate (ms) at which the function should be called
 * @param {boolean} condition Whether or not to start the delay countdown
 * @returns {{
 *  counter: 0
 *  condition: boolean
 *  run: Function
 *  isReady: boolean
 * }}
 */
function makeRepeater(ticker, action = () => {}, delay = 0, rate = 0, condition = true) {
  const repeater = {};
  repeater.counter = 0;
  repeater.condition = condition;

  // This method must be continuously called in a PIXI Ticker in order for it to work
  repeater.run = () => {
    if (!repeater.condition) return;
    repeater.counter += ticker.deltaMS;
    if (repeater.counter >= delay && repeater.counter - delay >= rate) {
      repeater.counter = delay;
      action();
    }
  };

  repeater.isReady = () => {
    return repeater.counter >= delay ? true : false;
  };
  return repeater;
}

/**
 * Randomly generates a whole number
 * @param {number} min
 * @param {number} max
 * @returns random number between min (inclusive) and max (exclusive)
 */
function rng(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Takes in PIXI Containers and groups them in one resizable container
 * @returns {{
 *  container: Container
 *  ogWidth: number
 *  ogHeight: number
 * }}
 */
function makeWindow() {
  const window = { container: new Container(), ogWidth: 0, ogHeight: 0 };
  for (const arg of arguments) window.container.addChild(arg);
  window.ogWidth = window.container.width;
  window.ogHeight = window.container.height;
  window.resize = (dt, dir) => {
    window.container.alpha += 0.01 * dt * dir;
    window.container.width += 0.005 * window.ogWidth * dt * dir;
    window.container.height += 0.005 * window.ogHeight * dt * dir;
  };
  return window;
}

/**
 * Creates a title cover
 * @param {string} titleTxt
 * @param {string} subtitleTxt
 * @returns A container holding two Text objects: the first one being the title and the second one being the subtitle
 */
function makeCover(titleTxt, subtitleTxt, extraSpace) {
  const cover = new Container();
  const titleStyle = new TextStyle({
    fontFamily: 'fira',
    fontSize: 128,
    fill: 0xea6048,
    fontWeight: 'bold',
    fontStyle: 'oblique',
    padding: 16,
  });
  const subStyle = new TextStyle({
    fontFamily: 'fira',
    fontSize: 32,
    fill: 0xea6048,
  });
  if (window.screen.height <= 390) {
    titleStyle.fontSize = 58;
    titleStyle.padding = 0;
    subStyle.fontSize = 14;
  } else if (window.screen.height <= 430) {
    titleStyle.fontSize = 74;
    titleStyle.padding = 2;
    subStyle.fontSize = 18;
  }
  const title = new Text(titleTxt, titleStyle);
  const subtitle = new Text(subtitleTxt, subStyle);
  title.anchor.set(0.5);
  subtitle.anchor.set(0.5);
  subtitle.x = 0;
  subtitle.y = title.height;
  cover.addChild(title, subtitle);

  //if extra space is needed (i.e, for the rules display, adjusts the subtitle anchor/positioning)
  if (extraSpace) {
    subtitle.anchor.set(0.5, 0.25);
  }
  return cover;
}

function makeReplaceCover(titleTxt, subtitleTxt, thirdTxt, fourthTxt) {
  const cover = new Container();
  const titleStyle = new TextStyle({
    fontFamily: 'fira',
    fontSize: 128,
    fill: 0xea6048,
    fontWeight: 'bold',
    fontStyle: 'oblique',
    padding: 16,
  });
  const subStyle = new TextStyle({
    fontFamily: 'fira',
    fontSize: 32,
    fill: 0xea6048,
  });
  // The math seen below is to allow some form of responsive text
  if (window.screen.width <= 920) {
    titleStyle.fontSize = 128 - 920 / window.screen.width / 0.04;
    subStyle.fontSize = 28 - 920 / window.screen.width / 0.16;
  }
  const title = new Text(titleTxt, titleStyle);
  const subtitle = new Text(subtitleTxt, subStyle);
  const thirdTitle = new Text(thirdTxt, subStyle);
  const fourthTitle = new Text(fourthTxt, subStyle);
  title.anchor.set(0.5);
  subtitle.anchor.set(0.5);
  thirdTitle.anchor.set(0.5);
  fourthTitle.anchor.set(0.5);
  subtitle.y = title.height;
  thirdTitle.y = title.height + subtitle.height;
  fourthTitle.y = thirdTitle.y + thirdTitle.height;
  cover.addChild(title, subtitle, thirdTitle, fourthTitle);
  return cover;
}

/**
 *
 * @param {string} t button label
 * @param {Function} f code to execute when the button is clicked
 * @returns the container for the button
 */
function makeButton(t, f) {
  const button = new Container();

  const buttonDefault = makeButtonState(0x928374, 0xddc7a1, 0x32302f, t);
  const buttonHover = makeButtonState(0xddc7a1, 0x928374, 0x32302f, t);
  const buttonPress = makeButtonState(0xddc7a1, 0x32302f, 0x928374, t);

  buttonDefault.visible = true;
  buttonHover.visible = false;
  buttonPress.visible = false;

  button.addChild(buttonHover, buttonPress, buttonDefault);
  button.eventMode = 'static';

  let down = false;

  button.on('mouseover', () => {
    buttonDefault.visible = false;
    buttonHover.visible = true;
    buttonPress.visible = false;
  });
  button.on('pointerdown', () => {
    buttonDefault.visible = false;
    buttonHover.visible = false;
    buttonPress.visible = true;
    down = true;
  });
  button.on('pointerup', () => {
    buttonDefault.visible = false;
    buttonHover.visible = true;
    buttonPress.visible = false;
    if (down) f();
    down = false;
  });
  button.on('mouseout', () => {
    buttonDefault.visible = true;
    buttonHover.visible = false;
    buttonPress.visible = false;
    down = false;
  });

  return button;
}

/**
 * helper for creating the button in a different shade to represent different states for when the button is hovered, pressed, etc.
 * @param {number} stroke hex number determining the button state's outline color
 * @param {number} fill hex number determining the button state's inside color
 * @param {number} textColor hex number determining the button label's color
 * @param {string} text button label
 * @returns
 */
function makeButtonState(stroke, fill, textColor, text) {
  const margin = 16;

  const txt = new Text(
    text,
    new TextStyle({
      fontFamily: 'fira',
      fontSize: 32,
      fill: textColor,
    }),
  );
  txt.x = 16;
  txt.y = 16;

  const oct = new Graphics()
    .lineStyle({
      color: stroke,
      width: 4,
      cap: LINE_CAP.ROUND,
      join: LINE_JOIN.ROUND,
    })
    .beginFill(fill)
    .moveTo(0, margin)
    .lineTo(margin, 0)
    .lineTo(margin + txt.width, 0)
    .lineTo(2 * margin + txt.width, margin)
    .lineTo(2 * margin + txt.width, margin + txt.height)
    .lineTo(margin + txt.width, 2 * margin + txt.height)
    .lineTo(margin, 2 * margin + txt.height)
    .lineTo(0, margin + txt.height)
    .lineTo(0, margin)
    .endFill();
  oct.addChild(txt);

  return oct;
}
export { rng, makeRepeater, makeCover, makeReplaceCover, makeWindow, makeButton };
