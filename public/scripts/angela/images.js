import { Texture } from 'https://unpkg.com/pixi.js@7.4.0/dist/pixi.mjs';

let bgTxrs = []; // array that stores all the background textures
let goodTasks = []; // stores all good tasks
let badTasks = []; // stores all bad tasks

// import textures

const bg01 = Texture.from('/media/experiences/angela/bg/bg01.png');
const bg02 = Texture.from('/media/experiences/angela/bg/bg02.png');
const bg03 = Texture.from('/media/experiences/angela/bg/bg03.png');
const bg04 = Texture.from('/media/experiences/angela/bg/bg04.png');
const bg05 = Texture.from('/media/experiences/angela/bg/bg05.png');
const bg06 = Texture.from('/media/experiences/angela/bg/bg06.png');
const bg07 = Texture.from('/media/experiences/angela/bg/bg07.png');
const bg08 = Texture.from('/media/experiences/angela/bg/bg08.png');
const bg09 = Texture.from('/media/experiences/angela/bg/bg09.png');
const bg10 = Texture.from('/media/experiences/angela/bg/bg10.png');
const bg11 = Texture.from('/media/experiences/angela/bg/bg11.png');
const bg12 = Texture.from('/media/experiences/angela/bg/bg12.png');
const bg13 = Texture.from('/media/experiences/angela/bg/bg13.png');
const bg14 = Texture.from('/media/experiences/angela/bg/bg14.png');
// bad images
const bad1 = Texture.from('/media/experiences/angela/yellatkirsten.png');
const bad2 = Texture.from('/media/experiences/angela/leavehome.png');
const bad3 = Texture.from('/media/experiences/angela/readnotebook.png');
const bad4 = Texture.from('/media/experiences/angela/grievebaby_v3.png');
const bad5 = Texture.from('/media/experiences/angela/lockinroom.png');
const bad6 = Texture.from('/media/experiences/angela/rantatdylan.png');
// good images
const good1 = Texture.from('/media/experiences/angela/cleaning.png');
const good2 = Texture.from('/media/experiences/angela/laundry_v2.png');
const good3 = Texture.from('/media/experiences/angela/meditate.png');
const good4 = Texture.from('/media/experiences/angela/washingdishes.png');
const good5 = Texture.from('/media/experiences/angela/bake_v2.png');
const good6 = Texture.from('/media/experiences/angela/boardgames.png');
const good7 = Texture.from('/media/experiences/angela/groceries.png');
const good8 = Texture.from('/media/experiences/angela/healthysnack.png');
const good9 = Texture.from('/media/experiences/angela/journaling_v2.png');
const good10 = Texture.from('/media/experiences/angela/talktodylan_v3.png');

// add all the textures for background into an array
bgTxrs.push(bg14, bg13, bg12, bg11, bg10, bg09, bg08, bg07, bg06, bg05, bg04, bg03, bg02, bg01);

// adding images to list
goodTasks.push(good1, good2, good3, good4, good5, good6, good7, good8, good9, good10);
badTasks.push(bad1, bad2, bad3, bad4, bad5, bad6);

// one time textures
export const momTxr = Texture.from('/media/experiences/angela/mom03.png');
export const explosionTxr = Texture.from('/media/experiences/angela/explosion.png');
export const checkMarkTxr = Texture.from('/media/experiences/angela/checkMark.png');
//upset family image
export const upsetTxr = Texture.from('/media/experiences/angela/family_upset.png');

// export bgTxrs, goodTasks, badTasks, and one time textures

export { bgTxrs, goodTasks, badTasks };
