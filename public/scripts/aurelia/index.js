import { Howl } from 'https://cdn.skypack.dev/howler@2.2.4';

let caseFileData = {
  file1: {
    left: `<h2>Case No. 1</h2>
	<img src="/experiences/aurelia/polaroid_flat1.png" alt="BoogeyManImage">
	<h3>Name: A Standard Boogeyman</h3>
	<h3>Status: Resolved</h3>`,
    right: `<h3>Background:</h3>
	<p>A police investigation hit a dead end in a case of repeated break-ins with no signs of entry. The
	    break-ins occurred in the home of a family of three, and the perpetrator always entered the
	    child's room. After several unsuccessful attempts to catch the perpetrator, the parents
	    contacted me, believing the break-ins to be the work of a magical creature. I was brought in to
	    identify the creature and find a method to capture or repel it.</p>
	<h3>Summary:</h3>
	<p>When I arrived at the home, I questioned the family to find any details on the creature. Only the
	    child provided useful information, as they were the only one to see it. They described it as a
	    boogeyman, a generic term for creatures that seek out sleeping children for various purposes.
	    They told me it was a tall, dark, human-shaped figure, but it did not appear to do anything, just
	    watching them as they slept.</p>
	<p>At this point I knew vaguely what it looked like, and that it was
	    intelligent enough to hide when other humans were approaching. My abilities could give me a
	    clearer picture of the creature, but I would need to be in the room when it appears, which is
	    impossible. This was not enough to determine a specific creature, so over the next three weeks I
	    gathered more information.</p>
	<p>Eventually, I had a breakthrough when I noticed the child was
	    becoming more lethargic, and had lower emotional responses. While those symptoms could be
	    explained by sleep disruptions, I believed they were the creature's doing. This would make it an
	    emotional feeder, similar to the Baku (a creature that devours dreams). This feeding behavior means the child is not in imminent
	    danger, but harm could come to them if the creature is not removed.</p>
	<h3>Result:</h3>
	<p>The case was handed off to an expert in expelling creatures that have become attached to homes. Full
	    resolution of the case is pending, but my investigation was successful.</p>`,
  },
  file2: {
    left: `<h2>Case No. 2</h2>
	<img id="caseImg" src="/experiences/aurelia/polaroid_flat2.png" alt="PlantImage">
	<h3>Name: The Neuro-Carnivorous Plant</h3>
	<h3>Status: Resolved</h3>`,
    right: `<h3>Background:</h3>
	<p>I was contacted by a nursery owner who was suffering from intense nightmares. After a few of his
	    employees started noticing the same effects, he suspected magical interference. I was hired to
	    find and put an end to the source of the nightmares.</p>
	<h3>Summary:</h3>
	<p>Upon arrival, I asked the affected employees about the nature of the nightmares, and how long
	    they had been experiencing them. As stated on the phone call, all of the employees started
	    experiencing nightmares after the owner. This could suggest that he was the vector for some kind of
	    “dream virus”, or that he was some kind of impostor that induces nightmares.</p>
	<p>My next step was to enter someone's nightmare and see if I can discover the source from within.
	    I couldn't entirely trust the owner, so I asked one of the employees if they could fall asleep.
	    Upon entering their dream, I found myself inside of a small, dark room. It could have been a closet, 
	    but it was completely empty. It was also completely silent, no sounds of birds, cars or even wind.</p>
	<p>Regular nightmares have action, something actively affecting the person who is experiencing them.
	    Something seemed to be draining the experience out of the nightmare—perhaps it was not even a
	    nightmare to begin with. After I got out from the closet space, before me was an otherwise normal 
	    apartment, save for the lush overgrowth that had taken over the building.</p>
	<p>Not far from the closet space I found the dreaming employee. She seemed to be trapped by vines, 
	    with parts of it seemingly fused to her. I tried to reassure her, but quickly moved on to investigate 
	    the building. I noticed that all the vegetation was growing from below the building, so I followed it
	    down into the basement. There was a single massive vine breaking through the floor, extending up from 
	    a void below. Without any other leads, I followed the vine down to its source, spending hours walking 
	    down flights of stairs—dreams tend to warp perceptions of time.</p>
	<p>Eventually I reached a nursery, floating in the void. I believed this to be some kind of nexus,
	    as there were more branches extending out into the void. The branches all converged on a bag of
	    soil, wildly bursting out of it. I attempted various methods of destroying the branches, but
	    they appeared to be impervious to damage. My efforts did have an effect however, waking up
	    the employee and expelling me from the dream with her.</p>
	<h3>Result:</h3>
	<p>After my experience in the dream, we decided to check the storage room. Inside one of the soil
	    bags we found a fully grown and healthy root system, with no leaves or stems. After removing and
	    killing it, the worker's dreams returned to normal. It seems this plant is some kind of mind
	    parasite—sucking up experiences to feed itself. I have no idea where the plant came from, or
	    how many more exist.</p>`,
  },
  file3: {
    left: `<h2>Case No. 3</h2>
	<img id="caseImg" src="/experiences/aurelia/polaroid_flat3.png" alt="ShapeShiftCase">
	<h3>Name: The Shape Shifter</h3>
	<h3>Status: Resolved</h3>`,
    right: `<h3>Background: </h3>
	<p>I was hired by a pharmaceutical company intern to investigate a strange occurrence at their lab.
	    Security cameras recorded a newly hired intern entering the facility after-hours. When
	    questioned about why they entered, the intern claimed they did not, and no logs in the computer
	    system show them entering the facility. The intern believes some kind of shapeshifter is framing
	    her to prevent anyone from discovering it.</p>
	<h3>Summary: </h3>
	<p>When we first met, I first made sure she knew exactly how my powers worked. At that point, I had
	    suspected she did it and was trying to use magic to come up with a cover story. On contact,
	    however, I found that she was telling the truth—she hadn't left her apartment the night of the
	    supposed break-in. Since I now knew she was telling the truth, the next obstacle was convincing
	    her employer. The company would most likely not take the word of a dream walker alone, so
	    we used the intern's internet activity on that night, and her roommates testimony as
	    additional evidence.</p>
	<h3>Result:</h3>
	<p>The company seemed to accept our evidence, although it was not the deciding factor. The security
	    footage showed the intern entering the building and walking directly towards the server room,
	    and accessing one particular machine. They didn't believe it was possible for an intern hired a
	    week ago to be so familiar with the building layout, so they have called in an investigator of
	    their own. My client was no longer under extreme suspicion, so unless she contacts me again, I
	    will consider this case resolved.</p>`,
  },
  file4: {
    left: `<div id="aboutInfo">
	<h2>My Abilities</h2>
	<img id="profile" src="/experiences/aurelia/pfp.PNG" alt="Logo">
	<p>I am specialized in dealing with mind altering or otherwise psychological effects and creatures,
	    but I can also diagnose most magical disturbances and refer you to an expert when
	    physical force is required.</p>
	<p>In addition to my expertise, I also possess the ability to enter the
	    minds of my clients when physical contact is made, allowing me to screen for any magical
	    influnces directly.</p>
	</div>`,
    right: `<div id="contactInfo">
	<h2 id="CIHeader">Contact Information</h2>
	<div id="call">
	    <img class="iconImage" src="/experiences/aurelia/phoneIcon.png" alt="phone">
	    <p class="CCInfo">555-824-2345</p>
	</div>
	<div id="address">
	    <img class="iconImage" src="/experiences/aurelia/HomeIcon.png" alt="home">
	    <p class="CCInfo">
		123 Fake Loc<br>
		New York, NY<br>
		1234-5678
	    </p>
	</div>
	<div id="mail">
	    <img class="iconImage" src="/experiences/aurelia/MailIcon.png" alt="email">
	    <p class="CCInfo">Awalker@Dreamwalkers.com</p>
	</div>
	<div id="other">
	    <img class="iconImage" src="/experiences/aurelia/Scryglass.png" alt="ScryglassIcon">
	    <p class="CCInfo">🜀 - 🜚 - 🝒 - 🜛 - 🝆 - 🜾</p>
	</div>
	</div> `,
  },
};

let cfButtons, cfHead, cfBody, currentFile;
init();
/// Initializes all the global variables and event listeners
function init() {
  cfButtons = document.querySelectorAll('.cfButton');
  cfHead = document.querySelector('.caseFileHead');
  cfBody = document.querySelector('.caseFileBody');

  // Makes each button call the onFileClick function when pressed
  for (let i = 0; i < cfButtons.length - 1; i++) {
    cfButtons[i].addEventListener('click', (e) => {
      onFileClick(e);
    });
  }

  // Sets initial values for the case file section
  cfHead.innerHTML = caseFileData['file1'].left;
  cfBody.innerHTML = caseFileData['file1'].right;
  currentFile = 'file1';
}

// Switches the case file text based on the button pressed
function onFileClick(e) {
  // if currentFile != idName:
  // -- set currentFile = idName
  // -- play turn page sound

  if (currentFile != e.target.id) {
    // Controls the colors of the folder tabs (the buttons)
    e.target.style.backgroundColor = '#E2A757';
    for (let i = 0; i < cfButtons.length - 1; i++) {
      if (e.target != cfButtons[i]) {
        cfButtons[i].style.backgroundColor = '#674E29';
      }
    }
    // Initializes shuffle paper sound
    var shufflePaper = new Howl({
      src: ['/sounds/page-turn.mp3'],
      volume: 0.2,
    });

    // Here the text gets changed and a sound gets played
    cfHead.innerHTML = caseFileData[e.target.id].left;
    cfBody.innerHTML = caseFileData[e.target.id].right;
    shufflePaper.play();
    currentFile = e.target.id;
  } else {
    // If the current file is already set to the target file, do nothing
  }
}
