import { Graphics } from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';

/*Author: Elliot Gong
Date: 1/2024 - 5/2024
Allocate helper functions for Douglas game
*/

/**
 * This function automatially resizes the pixi application based on the window size
 * @param {} app the app that will be resized.
 */
const resize = (app) => {
  let newWidth, newHeight;
  const width = window.innerWidth;
  const height = window.innerHeight;

  const gameWidth = app.renderer.width;
  const gameHeight = app.renderer.height;
  const gameRatio = gameHeight / gameWidth;

  if (gameHeight / gameWidth > height / width) {
    if (width <= 730) {
      newHeight = height;
    } else {
      newHeight = height - 65;
    }
    newWidth = newHeight * (1 / gameRatio);
  } else {
    newWidth = width;
    newHeight = newWidth * gameRatio;
  }

  app.renderer.view.style.width = newWidth + 'px';
  app.renderer.view.style.height = newHeight + 'px';
  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.left = '50%';
  if (width <= 730) {
    app.renderer.view.style.top = '0px';
  } else {
    app.renderer.view.style.top = '60px';
  }
  app.renderer.view.style.transform = 'translate3d(-50%, 0, 0)';
};

// draws lines on screen to simulate notebook page
const drawLines = (scene, spacing = 25) => {
  // red line on the left side of screen
  const sideLine = new Graphics();
  sideLine.lineStyle(1, 0xff0000);
  sideLine.moveTo(50, 0);
  sideLine.lineTo(50, 650);
  scene.addChild(sideLine);

  // draws cyan lines based on spacing, default is 25
  for (let i = 125; i < 650; i += spacing) {
    const line = new Graphics();
    line.lineStyle(1, 0x00ffff);
    line.moveTo(0, i);
    line.lineTo(850, i);
    scene.addChild(line);
  }
};

export { resize, drawLines };
