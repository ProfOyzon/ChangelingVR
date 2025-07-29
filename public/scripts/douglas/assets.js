import { Howl, Howler } from 'https://cdn.skypack.dev/howler@2.2.4';
import { Texture } from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';

/*Author: Elliot Gong
Date: 1/2024 - 5/2024
Load in external asset files like images and audio.
*/
const sounds = {
  buttonSound: new Howl({
    src: '/sounds/button.mp3',
    volume: 0.3,
    loop: false,
  }),
  jumpSound: new Howl({
    src: '/sounds/douglas/jump.mp3',
    volume: 0.25,
    loop: false,
  }),
  runSound: new Howl({
    src: '/sounds/douglas/running.wav',
    volume: 1.5,
    loop: true,
  }),
  paintSound: new Howl({
    src: '/sounds/douglas/painting.wav',
    volume: 2,
    loop: false,
  }),
  menuMusic: new Howl({
    src: '/sounds/douglas/music/menu_music.wav',
    volume: 0.25,
    loop: true,
  }),
  levelMusic: new Howl({
    src: '/sounds/douglas/music/level_music_2.wav',
    volume: 0.25,
    loop: true,
  }),
  eraseSound: new Howl({
    src: '/sounds/douglas/erasing.wav',
    volume: 2,
    loop: false,
  }),
  growSound: new Howl({
    src: '/sounds/douglas/grow.wav',
    volume: 0.5,
    loop: false,
  }),
  shrinkSound: new Howl({
    src: '/sounds/douglas/shrink.wav',
    volume: 0.5,
    loop: false,
  }),
  growToNormalSound: new Howl({
    src: '/sounds/douglas/grow_return.wav',
    volume: 0.5,
    loop: false,
  }),
  shrinkToNormalSound: new Howl({
    src: '/sounds/douglas/shrink_return.wav',
    volume: 0.5,
    loop: false,
  }),
  landingSound: new Howl({
    src: '/sounds/douglas/landing.wav',
    volume: 0.4,
    loop: false,
  }),
};

export { sounds };
