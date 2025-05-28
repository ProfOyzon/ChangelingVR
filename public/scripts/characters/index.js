import Parallax from 'parallax-js/src/parallax.js';

// Some constant enumerations for this section of code
const CharPos = {
  ABOVE: 1,
  BELOW: -1,
  CENTER: 0,
};
const TextY = {
  ABOVE: -30,
  CENTER: 0,
  BELOW: 30,
};

//// Calls all of the functions that need to be called when the page loads
//// Don't ask me why this needs to exist, but it does, probably
let mobile = false;

// array for prop images
// this should be updated with changeling-specific assets at some point
var aureliaImages = [
  '/assets/images/main-site/props/aurelia/deathheadmoth.png',
  '/assets/images/main-site/props/aurelia/painterpallete.png',
  '/assets/images/main-site/props/aurelia/casefile.png',
];

var angelaImages = [
  '/assets/images/main-site/props/angela/familyalbum.png',
  '/assets/images/main-site/props/angela/musicbox.png',
  '/assets/images/main-site/props/angela/mask.png',
];

var douglasImages = [
  '/assets/images/main-site/props/douglas/headphones.png',
  '/assets/images/main-site/props/douglas/pencil.png',
  '/assets/images/main-site/props/douglas/notebook.png',
];

var dylanImages = [
  '/assets/images/main-site/props/dylan/chisel.png',
  '/assets/images/main-site/props/dylan/gears.png',
  '/assets/images/main-site/props/dylan/wrench.png',
];

var kirstenImages = [
  '/assets/images/main-site/props/kirsten/bunny.webp',
  '/assets/images/main-site/props/kirsten/fairy.svg',
  '/assets/images/main-site/props/kirsten/magic.webp',
];

let lastTimeout; // Stores each timeout call, used to clear the previous timeout

let scrollingChars;
let scrollingTexts;
let scrollingPortraits;
let scrollingAuroras;
let scrollingProps;
let propArray;
let charPositions;

let scale;
let bg;

let bgCanvas;
let ctx;

let index;
let tops;

initializeCharacters();

document.querySelector('body').style.backgroundColor = 'white';

/// Adds listeners to the characters page for every method that needs it
/// Then calls all of the functions that are needed to initialize this script
function initializeCharacters() {
  window.addEventListener('resize', resizeInitCharacters);
  window.addEventListener('scroll', scrollInitCharacters);

  initialInitCharacters();
}
/////////////////////////
//// Initialization ////
///////////////////////

/// Whenever the size of the window changes, check if it needs to be mobile sized
///  If it does, make the necessary changes to create the mobile layout
/// Presently it doesn't need to do anything, thankfully
/// + For adding/removing listeners, it would be a good idea to only do it once
/// +  Something like a boolean to flip that only lets code trigger once and the sets it to the opposite

/////////////////////////////
///   Characters Page   ////
///////////////////////////
function initialInitCharacters() {
  setTops();
  console.log(tops);
  updateIndex();
  setTimeout(snapScroll, 2000);

  // Canvas Background
  backgroundSetup(); // Only called once
  updateBackgroundConstants();

  // Scrolling Elements
  scrollSetup(); // Only called once
  scrollElements();

  // Selects the scene for the parallax and uses it for Parallax.js
  let parallax = new Parallax(document.querySelector('#scene'));
}

// Meant to be called when character page is resized
function resizeInitCharacters() {
  setTops();
  window.scrollTo(0, tops[index]); // Replaces updateIndex()

  snapScroll();

  // Canvas Background
  updateBackgroundConstants();

  // Scrolling Elements
  scrollElements();
}

// Meant to be called when character page is scrolled
function scrollInitCharacters() {
  updateIndex();
  snapScroll();

  // Canvas Background
  updateBackgroundConstants();

  // Scrolling Elements
  scrollElements();
}

/// Creates an array to store the distances (in px)
///  of each section from the top of the entire page
/// The index variable with it is used by other functions
///  to help tell them where they are on the page
function setTops() {
  tops = [0, 0]; // Top of the page

  // Each of the character sections
  let spaces = document.querySelectorAll('.space');
  for (let s of spaces) {
    tops.push(s.offsetTop);
  }
}

/// Checks the current position of the page
///  and updates the index to the corresponding position in the tops array
function updateIndex() {
  for (let i = 0; i < tops.length; i++) {
    if (window.pageYOffset >= tops[i]) {
      index = i; // The index only changes when the position passes the top of a section
    }
  }

  // Ensures that the index is within bounds
  if (index < 0) {
    index = 0;
  }
  if (index >= tops.length) {
    index = tops.length - 1;
  }
}

/// After a brief pause, scrolls the page to fit the nearest section
function snapScroll() {
  clearTimeout(lastTimeout);
  let closer = tops[index];

  // If the below section is closer, use its index instead
  if (
    index != tops[tops.length - 1] &&
    window.pageYOffset - tops[index] > tops[index + 1] - window.pageYOffset
  ) {
    closer = tops[index + 1];
  }

  lastTimeout = setTimeout(window.scrollTo, 2000, 0, closer);
}

////////////////////////////
//// Canvas Background ////
//////////////////////////

/// Creates objects that store the info for each background
///  'path' = filepath for the background image
function makeBackground(path) {
  let bg = {
    image: new Image(),
    widthCenterOffset: 0,
    heightCenterOffset: 0,
    yInTranslate: 0,
    yOutTranslate: 0,
  };
  bg.image.src = path;

  // // Draws everything again once each image loads, a little inefficient
  // bg.image.addEventListener("load", scrollBackground);

  return bg;
}

// Defines the scale of the background

/// Prepares all the backgrounds and the variables that control it
function backgroundSetup() {
  // Selects the canvas background and sets its size
  //  both for the element and the canvas, if that makes sense
  bgCanvas = document.querySelector('#char-background');
  // Also stores the canvas context in another variable
  ctx = bgCanvas.getContext('2d');

  // Creates an array to hold all of the backgrounds that the canvas will draw
  bg = makeBackground('/assets/images/main-site/backgrounds/Web_BackgroundSky.png');
}

/// Updates the values of those background objects that are "constant"
///  (as constant as the window size is at least)
/// ---Needs to be called any time the window is resized
/// ---and any time the window is scrolled, for some reason
function updateBackgroundConstants() {
  // Sets the size of the canvas
  //  for both the HTML element and the drawing canvas
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  bgCanvas.style.width = bgCanvas.width + 'px';
  bgCanvas.style.height = bgCanvas.height + 'px';

  // Compares the aspect ratios of the background and the window
  //  and sets the scale to the value that covers the screen without warping the background
  if (bg.image.width / bg.image.height > bgCanvas.width / bgCanvas.height) {
    scale = bgCanvas.height / bg.image.height;
  } else {
    scale = bgCanvas.width / bg.image.width;
  }
  ctx.setTransform(scale, 0, 0, scale, 0, 0); // Sets the canvas to use the above scale

  //Draw the background
  ctx.drawImage(bg.image, bg.widthCenterOffset, bg.yInTranslate);
}

/////////////////////////////
//// Scrolling Elements ////
///////////////////////////

/// Creates an object that holds all of the information that a prop needs
function makeProp(path, w, h, i, d, a, c, b) {
  let p = {
    filepath: path,
    width: w,
    height: h,
    index: i,
    depth: d,
    above: a,
    center: c, // Can kind of control the position-
    below: b,
  };

  return p;
}

/// Disables or enables the transitions on the scrolling characters and props
function toggleTransitions(state) {
  if (state == 'off') {
    for (let char of scrollingChars) {
      char.className = 'scroll no-transition';
    }
    for (let prop of scrollingProps) {
      prop.className = 'no-transition';
    }
    for (let aurora of scrollingAuroras) {
      aurora.className = 'aurora no-transition';
    }
  } else {
    for (let char of scrollingChars) {
      //char.className = "scroll";
      char.className = 'scroll no-transition';
    }
    for (let prop of scrollingProps) {
      //prop.className = "";
      prop.className = 'no-transition';
    }
    for (let aurora of scrollingAuroras) {
      aurora.className = 'aurora';
    }
  }
}

/// Prepares all the fixed elements that will be scrolling across the screen
function scrollSetup() {
  // change the middle set of values to change their locations on the page.
  // Hardcoded array that holds all of the props
  propArray = [
    //"../assets/images/experiencess/AureliaSiteImages/polaroid1.png" Use this instead of a random image if you want to test the sizes

    // Aurelia's props
    makeProp(aureliaImages[0], 200, 200, 0, 0.2, '80vw, 130vh', '70vw, 17vh', '60vw, -70vh'),
    makeProp(aureliaImages[1], 300, 300, 0, 0.3, '20vw, 185vh', '44vw, 75vh', '80vw, -150vh'),
    makeProp(
      aureliaImages[2],
      200,
      200,
      0,
      0.25, // < this last number controls how much it'll move with the paralaxing. Lower it if you want to make a prop more "stiff" so it won't block the writing.
      '-150vw, -40vh',
      '8vw, 36vh',
      '-30vw, -30vh',
    ),

    // Angela's props
    makeProp(angelaImages[0], 200, 200, 1, 0.2, '-80vw, 130vh', '25vw, 90vh', '140vw, 80vh'),
    makeProp(angelaImages[1], 200, 200, 1, 0.15, '-20vw, 120vh', '15vw, 30vh', '30vw, -80vh'),
    makeProp(angelaImages[2], 200, 200, 1, 0.3, '-30vw, 130vh', '80vw, 15vh', '-30vw, 30vh'),

    // Dylan's props
    makeProp(dylanImages[0], 200, 200, 2, 0.15, '-40vw, 13vh', '70vw, 40vh', '-40vw, 40vh'),
    makeProp(dylanImages[1], 300, 300, 2, 0.3, '-40vw, 13vh', '40vw, 20vh', '-40vw, 30vh'),
    makeProp(dylanImages[2], 200, 200, 2, 0.2, '130vw, 130vh', '5vw, 80vh', '130vw, 90vh'),

    // Douglas' props
    makeProp(douglasImages[0], 200, 200, 3, 0.2, '30vw, 135vh', '75vw, 25vh', '-50vw, 100vh'),
    makeProp(douglasImages[1], 200, 200, 3, 0.15, '-40vw, -90vh', '10vw, 10vh', '-30vw, -50vh'),
    makeProp(douglasImages[2], 200, 200, 3, 0.2, '50vw, -100vh', '7vw, 85vh', '140vw, 150vh'),

    // Kirsten's props
    makeProp(kirstenImages[0], 200, 200, 4, 0.2, '80vw, 190vh', '20vw, 85vh', '40vw, 190vh'),
    makeProp(kirstenImages[1], 200, 200, 4, 0.1, '80vw, 190vh', '70vw, 20vh', '40vw, 190vh'),
    makeProp(kirstenImages[2], 200, 200, 4, 0.15, '30vw, 150vh', '20vw, 25vh', '-10vw, 150vh'),

    // Tobi's props
    makeProp(kirstenImages[2], 200, 200, 5, 0.15, '80vw, 190vh', '20vw, 60vh', '40vw, 190vh'),
    makeProp(kirstenImages[2], 200, 200, 5, 0.1, '80vw, 190vh', '60vw, 30vh', '40vw, 190vh'),
    makeProp(kirstenImages[2], 200, 200, 5, 0.1, '30vw, 150vh', '50vw, 70vh', '-10vw, 150vh'),
  ];

  // Adds all of the props above into the HTML
  // + It may be worth considering doing this with Vue.js instead
  let charScene = document.querySelector('#scene');

  for (let prop of propArray) {
    let elem = document.createElement('div');
    elem.setAttribute('data-depth', prop.depth);
    elem.setAttribute('class', 'prop');

    let elemImg = document.createElement('img');
    elemImg.setAttribute('src', prop.filepath);
    elemImg.setAttribute('style', `top: ${prop.height / -2}px; left: ${prop.width / -2}px;`);
    elemImg.style.setProperty('width', '30vw');
    elemImg.style.setProperty('height', '30vw');

    let elemDiv = document.createElement('div');
    elemDiv.appendChild(elemImg);
    elem.appendChild(elemDiv);
    charScene.appendChild(elem);
  }

  // Defintes the arrays of all the elements that need to be controlled
  scrollingChars = document.querySelectorAll('.scroll');
  scrollingTexts = document.querySelectorAll('.scroll section');
  scrollingPortraits = document.querySelectorAll('.info > div');
  scrollingAuroras = document.querySelectorAll('.aurora');
  scrollingProps = document.querySelectorAll('.prop > div');

  // Stores the possible random positions for the character sections to scroll in to and from
  //  They all need to be centered when they need to be in the center, so they all have the same center
  let randomPositions = [
    {
      above: `-155vh, -155vh,  0`,
      below: ` 155vh,  155vh,  0`,
      center: `0, 0, 0`,
    },
    {
      above: ` 155vh,  155vh,  0`,
      below: `-155vh, -155vh,  0`,
      center: `0, 0, 0`,
    },
    {
      above: ` 155vh, -155vh,  0`,
      below: `-155vh,  155vh,  0`,
      center: `0, 0, 0`,
    },
    {
      above: `-155vh,  155vh,  0`,
      below: ` 155vh, -155vh,  0`,
      center: `0, 0, 0`,
    },
    {
      above: ` -90vh, -200vh,  0`,
      below: `  90vh,  200vh,  0`,
      center: `0, 0, 0`,
    },
    {
      above: `  90vh,  200vh,  0`,
      below: ` -90vh, -200vh,  0`,
      center: `0, 0, 0`,
    },
    {
      above: `  90vh, -200vh,  0`,
      below: ` -90vh,  200vh,  0`,
      center: `0, 0, 0`,
    },
    {
      above: ` -90vh,  200vh,  0`,
      below: `  90vh, -200vh,  0`,
      center: `0, 0, 0`,
    },
    {
      above: `-200vh,  -90vh,  0`,
      below: ` 200vh,   90vh,  0`,
      center: `0, 0, 0`,
    },
    {
      above: ` 200vh,   90vh,  0`,
      below: `-200vh,  -90vh,  0`,
      center: `0, 0, 0`,
    },
    {
      above: ` 200vh,  -90vh,  0`,
      below: `-200vh,   90vh,  0`,
      center: `0, 0, 0`,
    },
    {
      above: `-200vh,   90vh,  0`,
      below: ` 200vh,  -90vh,  0`,
      center: `0, 0, 0`,
    },
  ];

  // // Randomly assigns each character section one of the possible sets of positions above
  charPositions = [
    randomPositions.splice(Math.floor(Math.random() * randomPositions.length), 1)[0], // Mainchar
    randomPositions.splice(Math.floor(Math.random() * randomPositions.length), 1)[0], // Mother
    randomPositions.splice(Math.floor(Math.random() * randomPositions.length), 1)[0], // Father
    randomPositions.splice(Math.floor(Math.random() * randomPositions.length), 1)[0], // Son
    randomPositions.splice(Math.floor(Math.random() * randomPositions.length), 1)[0], // Daughter
    randomPositions.splice(Math.floor(Math.random() * randomPositions.length), 1)[0], // Infant
  ];

  // Set the initial positions of all scrolling elements
  //  as well as the initial opacity and z-indexes of each element
  //  as well as any classes of each element
  // Toggles the transitions off for this section so elements can move instantly
  toggleTransitions('off');
  for (let i = 0; i < scrollingChars.length; i++) {
    scrollingChars[i].style.transform = `translate3d(${charPositions[i].above})`;
    scrollingChars[i].parentElement.style.zIndex = 3;
  }

  for (let txt of scrollingTexts) {
    txt.style.transform = `translate3d(0, 10vh, 0)`;
    txt.className = 'masked';
  }

  for (let pic of scrollingPortraits) {
    pic.className = 'masked';
  }

  for (let i = 0; i < scrollingProps.length; i++) {
    scrollingProps[i].style.transform = `translate3d(${propArray[i].above}, 0)`;
  }
  setTimeout(toggleTransitions, 0, 'on'); // The timeout might be necessary, it might be useless
}

/// One of the many helper functions before scrollElements()
/// Changes the transform of the character section given by the index to the given position
function changeCharTransforms(i, pos) {
  if (pos == CharPos.ABOVE) {
    scrollingChars[i].style.transform = `translate3d(${charPositions[i].above})`;
  } else if (pos == CharPos.CENTER) {
    scrollingChars[i].style.transform = `translate3d(${charPositions[i].center})`;
  } else if (pos == CharPos.BELOW) {
    scrollingChars[i].style.transform = `translate3d(${charPositions[i].below})`;
  }
}

/// Given the index of a character's section,
///  set the transforms of that character's elements
///  as well as the transforms of the adjacent characters' elements
function scrollCharTransforms(i) {
  if (i == -1) {
    // Above the scene
    changeCharTransforms(2, CharPos.BELOW);
    changeCharTransforms(1, CharPos.BELOW);
    changeCharTransforms(0, CharPos.BELOW);

    scrollingTexts[0].style.transform = `translate3d(0, ${TextY.BELOW}vh, 0)`;
  } else if (i == 0) {
    // First
    changeCharTransforms(1, CharPos.BELOW);
    changeCharTransforms(0, CharPos.CENTER);

    scrollingTexts[1].style.transform = `translate3d(0, ${TextY.BELOW}vh, 0)`;
    scrollingTexts[0].style.transform = `translate3d(0, ${TextY.CENTER}vh, 0)`;
  } else if (i == 5) {
    // Last
    changeCharTransforms(5, CharPos.CENTER);
    changeCharTransforms(4, CharPos.ABOVE);

    scrollingTexts[5].style.transform = `translate3d(0, ${TextY.CENTER}vh, 0)`;
    scrollingTexts[4].style.transform = `translate3d(0, ${TextY.ABOVE}vh, 0)`;
  } else {
    changeCharTransforms(i + 1, CharPos.BELOW);
    changeCharTransforms(i, CharPos.CENTER);
    changeCharTransforms(i - 1, CharPos.ABOVE);

    scrollingTexts[i + 1].style.transform = `translate3d(0, ${TextY.BELOW}vh, 0)`; // Below
    scrollingTexts[i].style.transform = `translate3d(0, ${TextY.CENTER}vh, 0)`; // Centered
    scrollingTexts[i - 1].style.transform = `translate3d(0, ${TextY.ABOVE}vh, 0)`; // Above
  }
}

/// Changes the class of the element given by the index to one of the mask animation classes
///  Essentially starts either a fade in or a fade out
function changeMask(i, newState) {
  scrollingPortraits[i].className = 'no-anim';
  scrollingTexts[i].className = 'no-anim';

  scrollingPortraits[i].offsetHeight; // Reflow // Don't ask

  scrollingPortraits[i].className = newState;
  scrollingTexts[i].className = newState;
}

/// Sets the mask animation class of the given character section
///  as well as the character sections around it
function scrollCharAnimations(i) {
  if (i == -1) {
    // Above the scene
    if (scrollingPortraits[0].className == 'unmasked') {
      changeMask(0, 'masked');
    }
  } else if (i == 0) {
    // First
    if (scrollingPortraits[0].className == 'masked') {
      changeMask(0, 'unmasked');
    }

    if (scrollingPortraits[1].className == 'unmasked') {
      changeMask(1, 'masked');
    }
  } else if (i == 5) {
    // Last
    if (scrollingPortraits[5].className == 'masked') {
      changeMask(5, 'unmasked');
    }

    if (scrollingPortraits[4].className == 'unmasked') {
      changeMask(4, 'masked');
    }
  } else {
    if (scrollingPortraits[i].className == 'masked') {
      changeMask(i, 'unmasked');
    }

    if (scrollingPortraits[i - 1].className == 'unmasked') {
      changeMask(i - 1, 'masked');
    }

    if (scrollingPortraits[i + 1].className == 'unmasked') {
      changeMask(i + 1, 'masked');
    }
  }
}

/// Given the index of a character's section,
///  set the transforms of the props that should appear
function scrollPropTransforms(charIndex) {
  for (let i = 0; i < propArray.length; i++) {
    if (mobile) {
      scrollingProps[i].style.transform = `translate3d(0, -80vh, 0)`;
    } else if (propArray[i].index == charIndex + 1) {
      scrollingProps[i].style.transform = `translate3d(${propArray[i].above}, 0)`;
    } else if (propArray[i].index == charIndex) {
      scrollingProps[i].style.transform = `translate3d(${propArray[i].center}, 0)`;
    } else if (propArray[i].index == charIndex - 1) {
      scrollingProps[i].style.transform = `translate3d(${propArray[i].below}, 0)`;
    }
  }
}

/// Controls the movement of the all the scrolling elements
///  As the user scrolls up/down, the elements scroll into view
///
/// Any characters not visible are transparent,
///  and gradually gain opacity as they come into view
///  utilizing the mask animation instead of the opacity style rule
///
/// ---Needs to be called any time the window is resized
/// ---and any time the window is scrolled
function scrollElements() {
  // Puts every other character behind the one that gets drawn below
  //  and makes them transparent, not in that order
  for (let ch of scrollingChars) {
    ch.parentElement.style.zIndex = 3;
  }

  for (let au of scrollingAuroras) {
    au.parentElement.style.zIndex = 1;
  }

  // Sets the adjustment for where a character section starts and ends
  //  Presently, multiplying the height of a section by -0.5 keeps the images "centered"
  let adjust = document.querySelector('.space').offsetHeight * -0.5;

  // Determines which character section should be visible
  let section = -1;
  for (let i = 2; i < tops.length; i++) {
    if (window.pageYOffset > tops[i] + adjust) {
      section = i - 2;
    }
  }

  // Brings the current character section above the rest
  if (section >= 0) {
    scrollingChars[section].parentElement.style.zIndex = 4;
  }

  // Calls all the helper functions to move the characters and props
  scrollCharTransforms(section);
  scrollCharAnimations(section);

  scrollPropTransforms(section);

  // scrollAuroTransforms();
}
