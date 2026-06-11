import { TextStyle } from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';
//import {widthForText} from './index.js'


//values for getting the widthWordWrap for the soliloquy to fit better.. this solution sucks and should be changed later. 
let alter = 0.00144927535;
let wordWrapWidthCode = (170 * (window.innerWidth * alter) );  //this makes the width scale with the size of the window
//console.log( "Window InnerWidth: "+ window.innerWidth + "\nWindow Alterd: "+  (window.innerWidth * alter) + "\nwordWrapWidth: " + wordWrapWidthCode);

// Used for Onboarding "Click anywhere or space to continue"
export const hintTextStyle = new TextStyle({
  fill: '403e38',
  fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
  fontSize: 25,
});
// Used for Rules "Click anywhere or space to continue"
export const hintTextStyle2 = new TextStyle({
  fill: '403e38',
  fill: 'e8ebe8',
  fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
  fontSize: 18,
});
// Used for timer styles
export const timerStyle = new TextStyle({
  fill: 'white',
  fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
  fontSize: 25,
  fontWeight: 'bolder',
  stroke: 'd1ab00',
  stroke: '7d6702',
  strokeThickness: 3,
});
// similar to timer style but is for score
export const scoreStyle = new TextStyle({
  fill: 'white',
  fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
  fontSize: 25,
  fontWeight: 'bolder',
  stroke: 'd1ab00',
  stroke: '7d6702',
  strokeThickness: 3,
});
// "Rule" title style
export const ruleTitleStyle = new TextStyle({
  fill: '403e38',
  fill: 'c9aa0c',
  fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
  fontSize: 50,
  fontWeight: 'bolder',
  stroke: 'black',
  strokeThickness: 3,
});
// soliloquy text styles
export const soliloquyTextStyle = new TextStyle({
  fill: '628237',
  // fill: 'black',
  // stroke: '628237',
  // strokeThickness: 1.25,
  fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
  fontSize: '3em',
  wordWrap: true,
  //wordWrapWidth: (560), //the original width
  wordWrapWidth: wordWrapWidthCode,
  lineJoin: 'round',
  // fontWeight: 'bold'
});



// export each style
