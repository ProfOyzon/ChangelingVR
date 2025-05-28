import { Howl } from 'https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js';

// SOUNDS
// success sound - activates when clicking on a good task
export let successSound = new Howl({
  src: ['/assets/sounds/chime.mp3'],
  volume: 0.2,
});
// failure sound - activates when clicking on a bad task or missing a good task
export let failureSound = new Howl({
  src: ['/assets/sounds/buzzer.mp3'],
  volume: 0.2,
});
// intro music - this runs during onboarding and rules if you click once on onboarding
export let introMusic = new Howl({
  src: ['/assets/sounds/angela-intro-music.mp3'],
  volume: 0.1,
  loop: true,
});
// game music - this runs during the game play
export let gameMusic1 = new Howl({
  src: ['/assets/sounds/angela-bg-music.mp3'],
  volume: 0.1,
  loop: true,
});

// export each sound
