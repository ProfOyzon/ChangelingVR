import { Application, Container, Sprite, Text, TextStyle, Texture } from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';
import { makeCover, makeRepeater } from '../util.js';

/**
 * Initializes a task that the play state will use to update it, reset it, and execute its event handlers accordingly
 * @param {Application} app
 * @param {*} stats
 * @returns
 */
function initTask1(app, stats) {
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

  let dragTarget = null;
  let ingredientCount = 0;
  const potBottomT = Texture.from('/experiences/dylan/potBottom.png');
  const potText = Texture.from('/experiences/dylan/pot.png');

  // Ingredients
  const onion = createIngredient(
    Texture.from('/experiences/dylan/onion.png'),
    false,
    true,
    100 + Math.floor(Math.random() * 550),
    360 + Math.floor(Math.random() * 150),
    0.15,
  );
  const greenOnion = createIngredient(
    Texture.from('/experiences/dylan/greenOnion.png'),
    false,
    false,
    app.screen.width - (Math.floor(Math.random() * 400) + 215) - app.screen.width / 100,
    100 + Math.floor(Math.random() * 500),
    0.3,
  );
  const flour = createIngredient(
    Texture.from('/experiences/dylan/flour.png'),
    false,
    false,
    400 + Math.floor(Math.random() * 400),
    200,
    0.35,
  );
  const beef = createIngredient(
    Texture.from('/experiences/dylan/beef.png'),
    false,
    true,
    app.screen.width - (Math.floor(Math.random() * 325) + 95) - app.screen.width / 100,
    350 + Math.floor(Math.random() * 125),
    0.25,
  );
  const apple = createIngredient(
    Texture.from('/experiences/dylan/apple.png'),
    false,
    false,
    400 + Math.floor(Math.random() * 300),
    400,
    0.2,
  ); // same column as flour
  const carrot = createIngredient(
    Texture.from('/experiences/dylan/carrot.png'),
    false,
    true,
    app.screen.width - (Math.floor(Math.random() * 300) + 215) - app.screen.width / 100,
    140 + Math.floor(Math.random() * 200),
    0.2,
  ); // same row as tomato
  const tomato = createIngredient(
    Texture.from('/experiences/dylan/tomato.png'),
    false,
    true,
    app.screen.width - (Math.floor(Math.random() * 400) + 85) - app.screen.width / 100,
    150 + Math.floor(Math.random() * 100),
    0.4,
  ); // same column as beef

  // Background
  const background = Texture.from('/experiences/dylan/cookingBackground.png');
  const backgroundSprite = new Sprite(background);
  backgroundSprite.anchor.set(0.5);
  backgroundSprite.position.set(app.screen.width / 2, app.screen.height / 2);
  backgroundSprite.width = app.screen.width;
  backgroundSprite.height = app.screen.height;

  // Store all ingredients within list
  let ingredients = [onion, greenOnion, flour, beef, apple, carrot, tomato];

  // Container is centered
  task.container.x = -app.screen.width / 2;
  task.container.y = -app.screen.height / 2;

  // Recipe list
  const recipeList = Texture.from('/experiences/dylan/recipeList.png');
  const recipeSprite = new Sprite(recipeList);
  recipeSprite.anchor.set(0.5);
  recipeSprite.width = 250;
  recipeSprite.height = 250;
  recipeSprite.position.set(150, 130);

  // Cooking Pot
  const potBottom = new Sprite(potBottomT); // Used to detect collision so there is a more accurate detection
  const pot = new Sprite(potText);
  potBottom.scale.set(0.25);
  potBottom.anchor.set(0.5);
  potBottom.zIndex = 5;
  potBottom.x = app.screen.width / 2;
  potBottom.y = app.screen.height / 2;
  pot.scale.set(0.25);
  pot.anchor.set(0.5);
  pot.zIndex = 12;
  pot.x = app.screen.width / 2;
  pot.y = app.screen.height / 2;

  // The size of the assets will shrink according to the width of the user's screen
  // This will trigger on sizes smaller than 951
  if (app.screen.width <= 950) {
    recipeSprite.width = 200;
    recipeSprite.height = 200;
    onion.scale.set(0.2 - (0.1 - 0.085 * (app.screen.width / 1250)) * (1250 / app.screen.width));
    greenOnion.scale.set(
      0.3 - (0.1 - 0.085 * (app.screen.width / 1250)) * (1250 / app.screen.width),
    );
    flour.scale.set(0.3 - (0.1 - 0.085 * (app.screen.width / 1250)) * (1250 / app.screen.width));
    beef.scale.set(0.25 - (0.1 - 0.085 * (app.screen.width / 1250)) * (1250 / app.screen.width));
    apple.scale.set(0.25 - (0.1 - 0.085 * (app.screen.width / 1250)) * (1250 / app.screen.width));
    carrot.scale.set(0.25 - (0.1 - 0.085 * (app.screen.width / 1250)) * (1250 / app.screen.width));
    tomato.scale.set(0.3 - (0.1 - 0.085 * (app.screen.width / 1250)) * (1250 / app.screen.width));
    potBottom.scale.set(0.25 - (0.1 - 0.085 * (app.screen.width / 1250)));
    pot.scale.set(0.25 - (0.1 - 0.085 * (app.screen.width / 1250)));
  }
  // If the screen width is smaller than 1251, than the responPos function will be called
  // which will align the ingredients accordingly
  if (app.screen.width <= 1250) {
    responPos();
  }

  // Everything is added at the end to allow for changes in size and location due to
  // compatibility reasons
  task.container.addChild(backgroundSprite);
  task.container.addChild(potBottom);
  task.container.addChild(pot);
  task.container.addChild(recipeSprite);

  // Add all ingredients to the container.
  for (let i = 0; i < ingredients.length; i++) {
    task.container.addChild(ingredients[i]);
  }

  task.container.eventMode = 'static';
  task.container.hitArea = app.screen;
  task.container.on('pointerup', onDragEnd);
  task.container.on('pointerupoutside', onDragEnd);

  // This is the task's game loop
  function update() {
    // Check for collision between ingredient and the bottom of the bot
    for (let i = 0; i < ingredients.length; i++) {
      if (testForAABB(ingredients[i], potBottom)) {
        // Only count for ingredients that are not already in the pot
        if (!ingredients[i].inPot) {
          ingredients[i].inPot = true;
          if (ingredients[i].inRecipe == true) {
            // Correct ingredient into the pot, up count
            ingredientCount++;
          } else {
            // Wrong ingredient in the pot, tint red
            ingredients[i].tint = 0xfc0303;
          }
        }
      } else {
        if (ingredients[i].inPot) {
          // If the ingredient was in the pot but now is not
          ingredients[i].inPot = false;
          ingredients[i].tint = 0xffffff; // Clear tint once out of the pot
          if (ingredients[i].inRecipe) {
            ingredientCount--;
          }
        }
      }
    }

    // Once all right ingredients have been added, the task is finished and move on to the next task
    if (ingredientCount == 3) {
      stats.score += 100;
    }
  }

  /**
   * The play state will call this function whenever a task is finished or failed
   * Make sure to return the task to its inital state here
   */
  function reset() {
    // Everything goes back to its start position
    ingredientCount = 0;

    // If the the width of the user's application is less than 1251, than mobile responsiveness
    // will be triggered, otherwise the positions are reset to their normal positions
    if (app.screen.width <= 1250) {
      responPos();
    } else {
      onion.x = 100 + Math.floor(Math.random() * 550);
      onion.y = 360 + Math.floor(Math.random() * 150);
      greenOnion.y = 100 + Math.floor(Math.random() * 500);
      flour.x = 400 + Math.floor(Math.random() * 400);
      flour.y = 200;
      beef.y = 350 + Math.floor(Math.random() * 125);
      apple.x = 400 + Math.floor(Math.random() * 300);
      apple.y = 400;
      carrot.y = 140 + Math.floor(Math.random() * 200);
      tomato.y = 150 + Math.floor(Math.random() * 100);
    }

    // Universal x values go here, these are the same regardless of mobile or desktop view
    greenOnion.x =
      app.screen.width - (Math.floor(Math.random() * 400) + 200) - app.screen.width / 100;
    beef.x = app.screen.width - (Math.floor(Math.random() * 325) + 95) - app.screen.width / 100;
    carrot.x = app.screen.width - (Math.floor(Math.random() * 300) + 215) - app.screen.width / 100;
    tomato.x = app.screen.width - (Math.floor(Math.random() * 400) + 85) - app.screen.width / 100;

    // All inPot set to false
    for (let i = 0; i < ingredients.length; i++) {
      ingredients[i].inPot = false;
    }
  }

  // This function places the ingredients in different places to allow for a better mobile experience
  function responPos() {
    onion.x = 100 + Math.floor(Math.random() * 50);
    onion.y = app.screen.height - (Math.floor(Math.random() * 100) + 75);

    greenOnion.y = app.screen.height - (Math.floor(Math.random() * 100) + 75);

    flour.x = app.screen.width / 2;
    flour.y = 200 - 10 / (app.screen.height / 1250);
    flour.zIndex = -1;

    beef.y = app.screen.height - (Math.floor(Math.random() * 100) + 85);

    apple.x = app.screen.width / 2 - (Math.floor(Math.random() * 240) - 90);
    apple.y = app.screen.height - (Math.floor(Math.random() * 125) + 100);

    carrot.y = 125 - 10 / (app.screen.height / 1250);

    tomato.y = 100 - 10 / (app.screen.height / 1250);

    recipeSprite.x = 10 + recipeSprite.width / 2;
  }

  // A basic AABB check between two different squares
  function testForAABB(object1, object2) {
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }

  // Create ingredient and return sprite
  function createIngredient(texture, inPot, inRecipe, x, y, scale) {
    const sprite = new Sprite(texture);

    sprite.inPot = inPot;
    sprite.inRecipe = inRecipe;

    sprite.eventMode = 'static';
    sprite.cursor = 'pointer';

    sprite.anchor.set(0.5);
    sprite.scale.set(scale);
    sprite.x = x;
    sprite.y = y;

    sprite.on('pointerdown', onDragStart, sprite);

    return sprite;
  }

  function onDragMove(event) {
    if (dragTarget) {
      dragTarget.parent.toLocal(event.global, null, dragTarget.position);
    }
  }

  function onDragStart() {
    // Store a reference to the data
    // * The reason for this is because of multitouch *
    // * We want to track the movement of this particular touch *
    this.alpha = 0.5;
    dragTarget = this;
    task.container.on('pointermove', onDragMove);
  }

  function onDragEnd() {
    if (dragTarget) {
      task.container.off('pointermove', onDragMove);
      dragTarget.alpha = 1;
      dragTarget = null;
    }
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
  function handleKeyup(kbe) {}
  return task;
}

export { initTask1 };
