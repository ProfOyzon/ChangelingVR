import {
  AnimatedSprite,
  Graphics,
  SCALE_MODES,
  Sprite,
  Text,
} from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';

/*Author: Elliot Gong
Date: 1/2024 - 5/2024
Create the classes for the Douglas game.
*/

// player class
class Player extends AnimatedSprite {
  constructor(
    stage,
    idleTextures,
    walkTextures,
    jumpTextures,
    x,
    y,
    width,
    height,
    runSound,
    jumpSound,
  ) {
    super(idleTextures);
    this.runSound = runSound;
    this.jumpSound = jumpSound;
    this.idleTextures = idleTextures;
    this.walkTextures = walkTextures;
    this.jumpTextures = jumpTextures;
    stage.addChild(this);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.jumpStrength = 6;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.yMax = 6;
    this.gravity = 0.3;
    this.grounded = true;
    this.leftWall = 50;
    this.rightWall = 850;
  }

  // applies gravity to the character on top of vertical movement
  applyPhysics() {
    if (this.grounded) {
      if (this.xVelocity != 0) {
        //Flip the sprite based on direction
        if (this.xVelocity > 0) {
          this.scale.x = 1;
        } else {
          this.scale.x = -1;
        }

        //Only change animations once per movement state change

        if (this.idle || super.textures != this.walkTextures) {
          this.runSound.play();
          this.stop();
          super.textures = this.walkTextures;
          this.animationSpeed = 1 / 6;
          this.loop = true;
          this.play();
          this.idle = false;
          this.grounded = true;
        }
      }
      //Play idle animations
      else {
        if (!this.idle && this.grounded) {
          this.runSound.pause();
          this.stop();
          super.textures = this.idleTextures;
          this.animationSpeed = 1 / 30;
          this.loop = true;
          this.play();
          this.idle = true;
        }
      }
    }
    this.x += this.xVelocity;

    // applies gravity to y velocity
    this.yVelocity += this.gravity;

    // clamps y velocity to maximum
    if (this.yVelocity > this.yMax) {
      this.yVelocity = this.yMax;
    }

    // applies y velocity to y position
    this.y += this.yVelocity;

    // sets walls offscreen at the edge of the canvas
    if (this.x < this.leftWall + this.width / 2) {
      this.x = this.leftWall + this.width / 2;
    }
    if (this.x > this.rightWall - this.width / 2) {
      this.x = this.rightWall - this.width / 2;
    }
  }

  // jumps if grounded
  jump() {
    if (this.grounded && this.yVelocity == 0) {
      this.runSound.pause();
      this.stop();
      super.textures = this.jumpTextures;
      this.animationSpeed = 1;
      this.loop = false;
      this.play();
      this.yVelocity = -this.jumpStrength;
      this.grounded = false;
      this.idle = false;
      this.jumpSound.play();
    }
  }
  // warps from (x1, y1) to (x2, y2) if position is within margin of (x1, y1)
  warp(x1, y1, x2, y2, margin) {
    if (
      this.x >= x1 - margin &&
      this.x <= x1 + margin &&
      this.y >= y1 - margin &&
      this.y <= y1 + margin
    ) {
      this.x = x2;
      this.y = y2;
    }
  }
}

//Button class that doesn't have custom textures.
class Button extends Sprite {
  constructor(stage, texture, x, y, unlocked, color = 0xdddddd) {
    texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
    super(texture);
    stage.addChild(this);
    this.x = x;
    this.y = y;
    this.anchor.set(0.5);
    this.unlocked = unlocked;
    this.color = color;
    this.cleared = false;

    // sets up unlocked condition
    if (this.unlocked) {
      this.unlock();
    } else {
      this.tint = 0x666666;
    }
  }

  // sets up interactivity and changes tint when hovering over button
  unlock() {
    if (!this.cleared) {
      this.tint = this.color;
      this.eventMode = 'static';
      this.cursor = 'pointer';
      this.on('pointerover', () => {
        this.tint = 0xaaaaaa;
      });
      this.on('pointerout', () => {
        this.tint = this.color;
      });
    }
  }

  // changes color to green to indicate completion
  clear() {
    this.cleared = true;
    this.tint = 0x00aa00;
    this.on('pointerover', () => {
      this.tint = 0x006600;
    });
    this.on('pointerout', () => {
      this.tint = 0x00aa00;
    });
  }
}
// parent class for other classes
class Box extends Graphics {
  constructor(stage, x, y, width, height) {
    super();
    stage.addChild(this);
    this.x = x;
    this.y = y;
    this.saveWidth = width;
    this.saveHeight = height;
  }
}

// platform class
class Platform extends Box {
  constructor(stage, x, y, width, height, landingSound, text = '', textColor = 0x000000) {
    super(stage, x, y, width, height);
    this.text = text;
    this.textColor = textColor;
    this.landingSound = landingSound;
    this.drawOutline(this.saveWidth, this.saveHeight);
    this.textbox = new Text(this.text, {
      fontFamily: 'Shadows Into Light',
      fontSize: 24,
      fill: this.textColor,
    });
    this.textbox.anchor.set(0.5);
    this.textbox.x = this.x + this.width / 2;
    this.textbox.y = this.y + this.height / 2;
    stage.addChild(this.textbox);

    this.climbMargin = 10;
    this.collisionMargin = 6;
  }
  drawOutline(width, height) {
    this.clear();
    this.beginFill(0xe9e9e9);
    this.lineStyle(1, 0x000000, 1); // Add this line to draw an outline
    this.drawRect(0, 0, width, height);
    this.endFill();
  }

  // checks collision against player
  checkCollision(player) {
    // climbMargin is the maximum distance from the bottom of the player sprite
    // to the top of the platform where the player will automatically zip to the top of the platform

    // collisionMargin is the maximum distance beten an edge of the player sprite
    // to the edge of a platform where collision is registered

    // effectively forming a box around every platform that checks for collision
    // and affects the player's position/velocity accordingly
    const playerTop = player.y - player.height;
    const playerBottom = player.y;
    const playerLeft = player.x - player.width / 2;
    const playerRight = player.x + player.width / 2;

    const formTop = this.y;
    const formBottom = this.y + this.height;
    const formLeft = this.x;
    const formRight = this.x + this.width;

    // checks for landing on top of the platform
    if (
      playerBottom > formTop &&
      playerBottom < formTop + this.climbMargin &&
      playerRight > formLeft &&
      playerLeft < formRight
    ) {
      if (!player.grounded) {
        this.landingSound.play();
      }
      player.grounded = true;
      player.y = this.y;
      player.yVelocity = 0;
    }

    // checks against the walls of the platform
    if (playerTop < formBottom && playerBottom > formTop + this.climbMargin) {
      if (playerRight > formLeft && playerRight < formLeft + this.collisionMargin) {
        player.x = this.x - player.width / 2;
      }
      if (playerLeft < formRight && playerLeft > formRight - this.collisionMargin) {
        player.x = this.x + this.width + player.width / 2;
      }
    }

    // checks against the ceiling of the platform
    if (
      playerTop <= formBottom &&
      playerTop > formBottom - this.collisionMargin &&
      playerRight > formLeft &&
      playerLeft < formRight
    ) {
      player.y = this.y + this.height + player.height;
      if (player.yVelocity < 0) player.yVelocity = 0;
    }
  }
}

// interactable class
class Interactable extends Platform {
  constructor({
    stage,
    x,
    y,
    width,
    height,
    landingSound,
    text,
    correct,
    texture = '',
    red = 'FF',
    green = 'FF',
    blue = 'FF',
    paintSound = '',
    eraseSound = '',
    shrinkSound = '',
    growSound = '',
    growToNormalSound = '',
    shrinkToNormalSound = '',
  }) {
    super(stage, x, y, width, height, landingSound, text, 0xff0000);
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.correct = correct;
    this.paintSound = paintSound;
    this.eraseSound = eraseSound;
    this.shrinkSound = shrinkSound;
    this.growSound = growSound;
    this.growToNormalSound = growToNormalSound;
    this.shrinkToNormalSound = shrinkToNormalSound;

    if (texture != '') {
      this.sprite = Sprite.from(texture);
      this.sprite.x = x;
      this.sprite.y = y;
      this.sprite.anchor.x = 0.175;
      this.sprite.anchor.y = 0.2;
      this.sprite.tint = '0x' + red + green + blue;
      stage.addChild(this.sprite);
    }
  }
  //helpers function to manage color changes, mainly for level 5.
  manageColor(hue) {
    this.textbox.text = '';

    if (this[hue] == '00') {
      this[hue] = 'FF';
    } else {
      this[hue] = '00';
    }
    this.paintSound.play();
    this.sprite.tint = '0x' + this.red + this.green + this.blue;
    if (this.red == 'FF' && this.green == 'FF' && this.blue == 'FF') {
      this.y = 600;
      this.height = 0;
      this.sprite.y = 600;
      this.sprite.height = 0;
    }
  }
  // checks for corresponding word to interactable
  checkInteraction(word, player, platforms, scene) {
    // checks for correct interaction hitbox
    if (
      this.correct.includes(word.text) &&
      word.x > this.x &&
      word.x < this.x + this.width &&
      word.y > this.y &&
      word.y < this.y + this.height
    ) {
      // clears word text/box

      this.textbox.text = word.text;
      word.textbox.text = '';
      word.clear();

      // handles logic for correct comparisons with words
      switch (word.text) {
        case 'things.':
          let newPlatform = new Platform(scene, 750, 350, 100, 50, this.landingSound);
          console.log(newPlatform.landingSound);
          platforms.push(newPlatform);
          if (
            this.x < player.x &&
            player.x < this.x + this.width &&
            newPlatform.y <= player.y &&
            player.y <= newPlatform.y + newPlatform.height
          ) {
            player.y = 350;
          }
          break;
        case 'caring':
        case 'good':
          this.y = 100; // Add half the line width to the y-position

          this.drawOutline(this.saveWidth, 25);
          break;
        case 'equal.':
          this.y = 300;
          this.drawOutline(this.saveWidth, 25);
          break;
        case 'praise':
          this.y = 400;
          this.drawOutline(this.saveWidth, 25);
          break;
        case 'naive.':
        case 'childish.':
          this.shrinkSound.play();
          player.height = 25;
          player.jumpStrength = 3;

          break;
        case 'disregard':
        case 'neglect':
          this.growSound.play();
          player.height = 75;
          player.jumpStrength = 7;
          break;
        case 'strange.':
        case 'unusual.':
          if (player.height < 50) {
            this.growToNormalSound.play();
          } else if (player.height > 50) {
            this.shrinkToNormalSound.play();
          }
          player.height = 50;
          player.jumpStrength = 6;
          break;
        case 'red':
          this.manageColor('red');
          break;
        case 'green':
          this.manageColor('green');
          break;
        case 'blue':
          this.manageColor('blue');
          break;
        case 'erase':
          this.eraseSound.play();
          this.y = 700;
          this.textbox.y = 700;
          if (this.sprite) {
            this.sprite.y = 700;
            this.sprite.height = 0;
          }
          break;
        default:
          break;
      }
    }
  }
}

// finish class
class Finish extends Platform {
  constructor(stage, x, y, width, height, landingSound) {
    super(stage, x, y, width, height, landingSound, 'Finish', 0x00ff00);
    this.landed = false;
  }

  // checks for collision and level clear
  checkCollision(player) {
    const playerBottom = player.y;
    const playerLeft = player.x;
    const playerRight = player.x + player.width;

    const formTop = this.y;
    const formLeft = this.x;
    const formRight = this.x + this.width;

    // clears the level
    if (
      playerBottom > formTop &&
      playerBottom < formTop + this.climbMargin &&
      playerRight > formLeft &&
      playerLeft < formRight
    ) {
      this.landed = true;
    }

    super.checkCollision(player);
  }
}

// word class
class Word extends Box {
  constructor(stage, x, y, width, height, text, textColor = 0x000000, fillColor = 0xcccccc) {
    super(stage, x, y, width, height);
    this.text = text;
    this.xOrigin = x;
    this.yOrigin = y;
    this.dragging = false;
    this.released = true;
    this.textColor = textColor;

    this.beginFill(fillColor);
    this.drawRect(-width / 2, -height / 2, width, height);
    this.endFill();
    this.textbox = new Text(this.text, {
      fontFamily: 'Shadows Into Light',
      fontSize: 24,
      fill: this.textColor,
    });
    this.textbox.anchor.set(0.5);
    this.textbox.x = x;
    this.textbox.y = y;
    stage.addChild(this.textbox);

    // sets up click-and-drag. Change cursor icon based on mouse actions.
    this.eventMode = 'static';

    this.textbox.eventMode = 'static';

    this.on('pointerover', () => {
      this.cursor = 'grab';
      this.textbox.cursor = 'grab';
    });
    this.textbox.on('pointerover', () => {
      this.cursor = 'grab';
      this.textbox.cursor = 'grab';
    });
    this.on('pointerdown', () => {
      this.cursor = 'grabbing';
      this.textbox.cursor = 'grabbing';
      this.dragging = true;
      this.released = false;
    });
    this.textbox.on('pointerdown', () => {
      this.cursor = 'grabbing';
      this.textbox.cursor = 'grabbing';
      this.dragging = true;
      this.released = false;
    });
  }

  // allows the user to drag words
  dragMove(x, y) {
    if (this.dragging) {
      this.x = x;
      this.y = y;
      this.textbox.x = x;
      this.textbox.y = y;
    }
  }

  // resets word to its original position
  reset() {
    this.x = this.xOrigin;
    this.y = this.yOrigin;
    this.textbox.x = this.xOrigin;
    this.textbox.y = this.yOrigin;
  }
}
/**
 * This custom button class functions the same as the one above, but comes with extra functionality for various textures and game states.
 */
class CustomButton extends Sprite {
  //Constructor with default named parameters to assist with readability and versatility.
  constructor({
    stage = '',
    baseTexture = '/experiences/douglas/start.png',
    x = 0,
    y = 0,
    unlocked = false,
    cleared = false,
    color = '',
    unlockedTexture = '',
    hoverTexture = '',
    clearTexture = '',
    clearHoverTexture = '',
  }) {
    baseTexture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
    super(baseTexture);
    this.baseTexture = baseTexture;
    this.hoverTexture = hoverTexture;
    if (unlockedTexture == '') {
      this.unlockedTexture = baseTexture;
    } else {
      this.unlockedTexture = unlockedTexture;
    }

    //Cases where buttons are always unlocked and 'cleared' by default, such as menu and ui buttons.
    if (clearHoverTexture == '') {
      this.clearHoverTexture = hoverTexture;
    } else {
      this.clearHoverTexture = clearHoverTexture;
    }
    if (clearTexture == '') {
      this.clearTexture = baseTexture;
    } else {
      this.clearTexture = clearTexture;
    }

    //Sets up the button on the stage.
    stage.addChild(this);
    this.x = x;
    this.y = y;
    this.anchor.set(0.5);
    this.unlocked = unlocked;
    this.cleared = cleared;
    this.color = color;

    // sets up unlocked condition
    if (this.unlocked) {
      this.unlock();
    }
    if (this.cleared) {
      this.clear();
    }
  }

  // sets up interactivity and changes sprite when hovering over button
  unlock() {
    //If 'scene' has been cleared
    this.eventMode = 'static';
    this.cursor = 'pointer';
    //These hover events applies to buttons that are always unlocked(menu/UI) or represent levels that have been completed.
    if (this.cleared) {
      //Change the tint of control buttons
      if (this.color != '') {
        this.on('pointerover', () => {
          this.tint = this.color;
        });
        this.on('pointerout', () => {
          this.tint = 0xffffff;
        });
      }
    } //Otherwise, 'locked' buttons will have the default hover effects.
    else {
      super.texture = this.unlockedTexture;
      this.on('pointerover', () => {
        super.texture = this.hoverTexture;
      });
      this.on('pointerout', () => {
        super.texture = this.unlockedTexture;
      });
    }
  }

  // set color
  clear() {
    super.texture = this.clearTexture;
    this.cleared = true;
    this.on('pointerover', () => {
      super.texture = this.clearHoverTexture;
    });
    this.on('pointerout', () => {
      super.texture = this.clearTexture;
    });
  }
}

export { CustomButton, Button, Player, Platform, Interactable, Finish, Word };
