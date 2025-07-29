/**
 * This file is the first script that runs when Dylan's page loads
 * It creates a pixi app complete with a renderer, game loop, and root container, and it initializes two game states: main and play
 * The main state consists of the main menu and an introductory dialogue
 * The play state is the actual game
 */
import { Application, Assets, Container } from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';
import { initMain } from './states/main.js';
import { initPlay } from './states/play.js';

// Load all sprites and fonts before initializing states
// Assets.addBundle('assets', {
//   fira: './fira.ttf',
// });
// await Assets.loadBundle('assets');

// The width calculation makes the screen's left and right margins equal to its top and bottom ones
// The height calculation makes the screen's bottom margin equal to its top margin specified in dylan.css
const app = new Application({
  width: window.innerWidth / 1.0625,
  height: window.innerHeight - 128,
  antialias: true,
});
app.renderer.background.color = 0x282828;

// Centering the root container makes it easier to shift the origin of all its descendant containers from top-left to center
app.stage.x = app.renderer.width * 0.5;
app.stage.y = app.renderer.height * 0.5;

// The first child represents the play state, and the second represents the main state
app.stage.addChild(new Container(), new Container());
app.stage.children[0].visible = false;
document.querySelector('#wrapper').appendChild(app.view);

/**
 * Both states have an update function that runs in the ticker's listener
 * This object literal's job is to run the updater of the currently active state
 * The active updater is changed within the state's updater
 */
const tickerManager = { active: () => {}, main: () => {}, play: () => {} };
initMain(app, tickerManager);
initPlay(app, tickerManager);
tickerManager.active = tickerManager.main;
app.ticker.add(() => tickerManager.active());
