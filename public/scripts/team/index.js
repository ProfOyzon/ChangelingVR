function createLink(url) {
  let head = document.querySelector('head');
  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  head.appendChild(link);
}

createLink('https://fonts.googleapis.com/css2?family=Waiting+for+the+Sunrise&display=swap');
createLink('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');
createLink(
  'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,400;1,700&display=swap',
);

//global variables
let filtersBtn;
let searchBtn;
let clearBtn;
let searchBox;
let allTeam;
let placeholderImg;
let buttons;
let data = undefined;
let teams = ['Development', 'Tech', 'Art', 'Audio', 'Web', 'Narrative', 'Voice', 'Production'];
let developmentTeam = [];
let audioTeam = [];
let narrativeTeam = [];
let webTeam = [];
let voiceTeam = [];
let productionTeam = [];
let artTeam = [];
let techArtTeam = [];
let teamArrays = [
  developmentTeam,
  techArtTeam,
  artTeam,
  audioTeam,
  webTeam,
  narrativeTeam,
  voiceTeam,
  productionTeam,
];
//bools used to track if each area is toggled to full display
let devDisplay = false;
let techDisplay = false;
let artDisplay = false;
let audioDisplay = false;
let webDisplay = false;
let narrativeDisplay = false;
let voiceDisplay = false;
let productionDisplay = false;
let displayBools = [
  devDisplay,
  techDisplay,
  artDisplay,
  audioDisplay,
  webDisplay,
  narrativeDisplay,
  voiceDisplay,
  productionDisplay,
];
let displayButtons = [];

window.onload = setup;

/**
 * when the page loads, get every member from the database and begin instantiation
 */

async function setup() {
  //get every member (profile) from the database as a json object
  const response = await fetch('/members', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  //convert the response to json and assign it to allTeam
  //allTeam holds all team members (profiles)
  const json = await response.json();
  allTeam = json;

  //instantiate the rest of the page once the data has been gathered
  start();
}

/**
 * instantiate all the objects on the page
 */
function start() {
  //instantiate the filter button
  filtersBtn = document.querySelector('.filtersBtn');
  filtersBtn.onclick = (e) => {
    filtersDropdown();
  };

  //instantiate the search button
  searchBtn = document.querySelector('#searchBtn');
  searchBtn.onclick = (e) => {
    filter();
    searchName(false);
    // searchName(true);
  };

  //instantiate the search button
  clearBtn = document.querySelector('#clearBtn');
  clearBtn.onclick = (e) => {
    clearFilters();
  };

  //instantiate the searchName textbox
  searchBox = document.querySelector('#searchBox');
  //searchName should be called every time a character is changed within the textbox
  searchBox.oninput = (e) => {
    searchName(false);
  };

  //instantiating the show more/show less buttons
  const devButton = document.querySelector('#devButton');
  displayButtons.push(devButton);
  const techButton = document.querySelector('#techButton');
  displayButtons.push(techButton);
  const artButton = document.querySelector('#artButton');
  displayButtons.push(artButton);
  const audioButton = document.querySelector('#audioButton');
  displayButtons.push(audioButton);
  const webButton = document.querySelector('#webButton');
  displayButtons.push(webButton);
  const narrativeButton = document.querySelector('#narrativeButton');
  displayButtons.push(narrativeButton);
  const voiceButton = document.querySelector('#voiceButton');
  displayButtons.push(voiceButton);
  const productionButton = document.querySelector('#productionButton');
  displayButtons.push(productionButton);
  for (let i = 0; i < displayButtons.length; i++) {
    displayButtons[i].onclick = (e) => {
      displayBools[i] = toggleFullDisplay(
        teams[i],
        teamArrays[i],
        displayButtons[i],
        displayBools[i],
      );
    };
  }

  //set up the close button on the information pop-ups
  let closeB = document.querySelector('#close');
  closeB.addEventListener('click', closePInfo);

  //close the info pop-up when the window is resized
  //this prevents the pop-up from moving to undesired positions due to its position:absolute style
  window.onresize = (e) => {
    closePInfo();
  };

  //set the placeholder image
  placeholderImg = '/assets/images/team/placehold.png';

  //load all the data into a usable format
  loadData();
  //display everyone randomly as soon as the user gets on the page
  randomDisplay();

  //make the info pop-up not display at the bottom of the webpage upon page load
  //for some reason the pop-up breaks if you close it while empty, so populate it first
  updateInfo(orderedList[0]);
  closePInfo();
}

//loader stuff//////////////////////////////////////////////////////////////////////////////////////////

/*
 *	Loads team data from the server file and puts it into an object
 */
function loadData() {
  //sort everyone alphabetically
  let all = alphabetizeTeam(allTeam);
  //establish an array for the data
  data = { all };
}

/**
 * sorts the team list alphabetically
 * @param {object} teamObj The team list object
 * @returns {object} teamObj the team list object, but sorted
 */
function alphabetizeTeam(teamObj) {
  //make a temp team object and temp object storage
  let temp = [];
  let userObj;

  //for each element, extract it from the temp
  for (let i = 0; i < Object.values(teamObj).length; i++) {
    userObj = Object.values(teamObj)[i];
    //compare the element to each element in the team array
    for (let j = 0; j < temp.length; j++) {
      let compObj = temp[j];
      //if it is less then the element in the array, splice it into the array at that spot
      if (userObj.username < compObj.username) {
        temp.splice(j, 0, userObj);
        //nullify the element to show that it was added
        userObj = '';
      }
    }
    //if the element was not added (is greater than every element in the array) add it to the end
    if (userObj !== '') {
      temp.push(userObj);
    }
  }

  //return the newly sorted team object
  return temp;
}

let orderedList = [];
/**
 * randomly display every profile
 */
function randomDisplay() {
  //get every profile
  let teamObj = data['all'];

  //instantiate orderedList with the first profile
  orderedList = [teamObj[0]];

  //for every profile
  for (let i = 1; i < teamObj.length; i++) {
    //if the profile has no teams, move onto the next one
    if (teamObj[i].teams == '') {
      continue;
    }
    //adds object to orderedList
    orderedList.push(teamObj[i]);
  }

  //Initial population of various areas
  populateHTML(orderedList);
}

let tempList = [];
/**
 * loads the desired team onto the page in proper format
 * @param {*} teamID the name of the team being loaded
 * @returns
 */
function loadSearchSection(teamID) {
  //get the team from data
  let teamObj = data[teamID];

  //SORT TEAMS INTO ALPHABETICAL ORDER BY TEAM & YEAR
  //we will sort by year first since we want each team to be sorted by year
  //sorting by year first makes this easier because the list is already in order aside from the team

  //teams simply holds all the teams so they can be used in a loop
  //years are listed in reverse order so the most recent members are displayed first
  let years = ['2024', '2023', '2022', '2021', '2020'];
  //for each year, loop through every member
  for (let y = 0; y < years.length; y++) {
    //the current profile resets to the start of the list for each team
    let curProfile = 0;
    //set the new length to the remaining amount of profiles
    let curNumProfiles = Object.keys(teamObj).length;
    //for each profile in the original list
    for (let i = 0; i < curNumProfiles; i++) {
      //if their years section includes the current year
      if (teamObj[curProfile].terms.includes(years[y])) {
        //remove that profile from the original list and add it to the temp list
        tempList[Object.keys(tempList).length] = teamObj.splice(curProfile, 1);
      }
      //if the profile is not a match, advance to the next profile
      //this is only done on a miss because removing an element moves up every other element
      //so if element 5 is removed, element 6 becomes the new element 5
      //so to check element 6, we want to leave the current profile on element 5
      else {
        curProfile++;
      }
    }
  }

  //add the profiles with no years to the end of the temp list
  let remainingProfiles = Object.keys(teamObj).length;
  for (let i = 0; i < remainingProfiles; i++) {
    //the objects need to be spliced so they are stored in tempList the same way as the other objects
    tempList[Object.keys(tempList).length] = teamObj.splice(0, 1);
  }

  //teams simply holds all the teams so they can be used in a loop
  //now sort by teams into orderedList, the final list that will be used
  for (let t = 0; t < teams.length; t++) {
    //the current profile resets to the start of the list for each team
    let curProfile = 0;
    //set the new length to the remaining amount of profiles
    let curNumProfiles = Object.keys(tempList).length;
    //for each profile in the temp list
    for (let i = 0; i < curNumProfiles; i++) {
      //if their teams section includes the current team
      if (tempList[curProfile][0].teams.includes(teams[t])) {
        //remove that profile from the temp list and add it to the ordered list
        orderedList[Object.keys(orderedList).length] = tempList.splice(curProfile, 1);
      }
      //if the profile is not a match, advance to the next profile
      //this is only done on a miss because removing an element moves up every other element
      //so if element 5 is removed, element 6 becomes the new element 5
      //so to check element 6, we want to leave the current profile on element 5
      else {
        curProfile++;
      }
    }
  }
}

//populate the html with the profile data
function populateHTML(list) {
  //default contentArea to place items
  let contentArea = document.querySelector('#Development');

  //for each team member, put their profile into the html
  for (let i = 0; i < list.length; i++) {
    //get the profile
    let userObj = list[i];
    let teams = userObj.teams.replaceAll(',', ', ');
    //put the user profile into each content section they're on the team for
    if (teams.includes('Production')) {
      contentArea = document.querySelector('#Production');
      addUserObj(contentArea, teams, userObj, i);
      productionTeam.push(userObj);
    }
    if (teams.includes('Web')) {
      contentArea = document.querySelector('#Web');
      addUserObj(contentArea, teams, userObj, i);
      webTeam.push(userObj);
    }
    if (teams.includes('Voice')) {
      contentArea = document.querySelector('#Voice');
      addUserObj(contentArea, teams, userObj, i);
      voiceTeam.push(userObj);
    }
    if (teams.includes('Narrative')) {
      contentArea = document.querySelector('#Narrative');
      addUserObj(contentArea, teams, userObj, i);
      narrativeTeam.push(userObj);
    }
    if (teams.includes('Tech')) {
      contentArea = document.querySelector('#Tech');
      addUserObj(contentArea, teams, userObj, i);
      techArtTeam.push(userObj);
    }
    if (teams.includes('Development')) {
      contentArea = document.querySelector('#Development');
      addUserObj(contentArea, teams, userObj, i);
      developmentTeam.push(userObj);
    }
    if (teams.includes('Audio')) {
      contentArea = document.querySelector('#Audio');
      addUserObj(contentArea, teams, userObj, i);
      audioTeam.push(userObj);
    }
    if (teams.includes('Art') && !teams.includes('Tech')) {
      contentArea = document.querySelector('#Art');
      addUserObj(contentArea, teams, userObj, i);
      artTeam.push(userObj);
    }
  }

  //grab a list of all the profiles that have just been created and turn them into buttons
  //this allows the user to see their data
  for (let i = 0; i < teams.length; i++) {
    addTileButtons(teams[i], teamArrays[i]);
  }

  //load the profile pictures once the html has been populated to reduce load times
  for (let i = 0; i < teams.length; i++) {
    loadTileImages(teams[i], teamArrays[i]);
  }

  //once everything is loaded, removing the loading symbols
  document.querySelector('#loading-zone').classList.add('hidden');
}

//adds user to current html area
function addUserObj(area, teams, userObj, number) {
  area.innerHTML += `<span class=teamtile>
		<img src="${placeholderImg}" onerror="this.src='${placeholderImg}'" alt="No Image Loaded" class="no${userObj.id % 7} tileButton" id="pic${number}">
		<h1>${userObj.username}</h1>
		<h2>${teams}</h2>
		</span>`;
}

//loads images for user tiles
function loadTileImages(contentArea, teamList) {
  let area = document.querySelector('#' + contentArea);
  let tiles = area.getElementsByClassName('teamtile');
  for (let i = 0; i < tiles.length; i++) {
    let img;
    let userObj = teamList[i];
    //if the profile pic doesn't exist, use the placeholder
    try {
      //img = "data:image/png;base64," + userObj.pfp;
      img = `/assets/images/team/${userObj.id}.jpg`;
    } catch (e) {
      img = placeholderImg;
    }

    //set the image as the source
    tiles[i].querySelector('img').src = img;
  }
}

//turns items in specified area into buttons
function addTileButtons(area, teamList) {
  let contentArea = document.querySelector('#' + area);
  let buttons = contentArea.querySelectorAll('.tileButton');
  let fullProfiles = contentArea.querySelectorAll('.teamtile'); //this is grabbed for the display toggle function setup.
  for (let i = 0; i < buttons.length; i++) {
    //grab the data directly from orderedList
    buttons[i].onclick = function () {
      updateInfo(teamList[i]);
      //resets all unclicked buttons to default state
      for (let j = 0; j < buttons.length; j++) {
        buttons[j].parentElement.style.zIndex = 'auto';
        buttons[j].parentElement.style += 'display: block';
      }
      let parentElement = buttons[i].parentElement;

      //position the info pop-up to the proper profile
      let tileWidth = parentElement.offsetWidth;
      let pageWidth = contentArea.offsetWidth;
      let tilesPerRow = Math.floor(pageWidth / tileWidth);

      //handles rightmost tiles (they need to be pushed inwards)
      //if the tile is close to the right edge of the screen
      if (
        buttons[i].parentElement.getBoundingClientRect().right >
          window.innerWidth - buttons[i].parentElement.getBoundingClientRect().width &&
        buttons[i].parentElement.getBoundingClientRect().left >
          buttons[i].parentElement.getBoundingClientRect().width
      ) {
        //cycle back through all the tiles until one that isn't hidden is found
        //hide this tile so the rightmost tile jumps to the left, preventing the info from going off the screen
        let t = 1;
        while (buttons[i - t].parentElement.classList.contains('hidden')) {
          t++;
        }
        buttons[i - t].parentElement.style = 'display: none;';
      }

      //set the info-popup to the top-left corner of the tile
      parentElement.style.zIndex = 9999;
      pInfo.style.left = `${parentElement.getBoundingClientRect().left}px`;
      pInfo.style.top = `${parentElement.getBoundingClientRect().top + window.scrollY}px`;
    };

    //if past the first 10 members, hides the data
    if (i > 9) {
      fullProfiles[i].classList.add('hidden');
    }
  }
}

//toggles show more/show less function for a team section
//requires section name, array of team data, button data, and current toggle status
function toggleFullDisplay(sectionName, teamList, button, isFullDisplay) {
  //retrieves the profile data for the section
  let contentArea = document.querySelector('#' + sectionName);
  let profiles = contentArea.querySelectorAll('.teamtile');
  let profileCounter = 0; //counts how many profiles are visible. used for collapsing a list with filters active.

  if (!isFullDisplay) {
    button.innerHTML = 'Show Less';
    isFullDisplay = true;

    //loops to display all profiles
    for (let i = 0; i < profiles.length; i++) {
      profiles[i].classList.remove('hidden');

      //retrieves filter data
      //collects checked roles
      let roles = document.querySelectorAll('#roleFilters input');
      let curRoles = [];
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].checked) {
          curRoles.push(roles[i].value);
        }
      }
      //collects checked years
      let years = document.querySelectorAll('#yearFilters input');
      let curYears = [];
      for (let i = 0; i < years.length; i++) {
        if (years[i].checked) {
          curYears.push(years[i].value);
        }
      }

      //filters the specific section
      filterTeam(sectionName, teamList, curRoles, curYears, isFullDisplay);

      //checks if there's anything in the searchbox, calls that filter too if so
      if (!searchBox.value == '') {
        searchByName(sectionName, teamList, isFullDisplay);
      }
    }
  } else if (isFullDisplay) {
    button.innerHTML = 'Show More';
    isFullDisplay = false;

    //loops to hide everything past the first ten VISIBLE profiles
    //counts how many visible have been found, hides past that--
    //this is used to allow filtering with a collapsed section
    for (let i = 0; i < profiles.length; i++) {
      //checks if the current profile is visible
      if (!profiles[i].classList.contains('hidden')) {
        profileCounter++;
      }

      //hides all remaining profiles once counter is maxed
      if (profileCounter > 10) {
        profiles[i].classList.add('hidden');
      }
    }
  }
  return isFullDisplay;
}

/**
 * Updates the info sheet section with clicked team member's info
 * @param {Object} member The team member that is being displayed
 */
function updateInfo(member) {
  //if the member exists
  if (member != undefined) {
    //set up the parts of the info tile
    let links = document.querySelector('#links');
    let terms = document.querySelector('#terms');
    let roles = document.querySelector('#roles');
    let bio = document.querySelector('#bio');

    links.innerHTML = '';

    let roleText = '';
    // Roles need some extra parsing to add spaces, will not parse if not valid JSON
    if (typeof member.roles == 'object') {
      // Roles is JSON encoded
      for (let i = 0; i < member.roles.length; i++) {
        //only add a comma to the role list if there is more than one role
        if (roleText == '') {
          roleText += member.roles[i];
        } else {
          roleText += `, ${member.roles[i]}`;
        }
      }
    } else {
      // Roles is not JSON encoded
      roleText = member.roles;
    }
    roles.innerHTML = `<b>Roles: </b>` + roleText.replace(/,/g, '<br>');

    //initialize the bio
    bio.innerHTML = member.bio;

    //set up the terms the same way as the roles
    let termText = '';
    termText = member.terms.replace(/,/g, '<br>');
    terms.innerHTML = '<b>Terms: </b>' + termText;

    //initialize the links
    if (member.link_website !== '') {
      let linkE;
      linkE = document.createElement('a');
      linkE.href = member.link_website;
      linkE.class = 'linkBox';
      linkE.target = '_blank';
      linkE.innerHTML = `<i class="fas fa-portrait"></i>`;
      links.appendChild(linkE);
    }
    if (member.link_github !== '') {
      let linkE;
      linkE = document.createElement('a');
      linkE.href = member.link_github;
      linkE.class = 'linkBox';
      linkE.target = '_blank';
      linkE.innerHTML = `<i class="fab fa-github"></i>`;
      links.appendChild(linkE);
    }
    if (member.link_linkedin !== '') {
      let linkE;
      linkE = document.createElement('a');
      linkE.href = member.link_linkedin;
      linkE.class = 'linkBox';
      linkE.target = '_blank';
      linkE.innerHTML = `<i class="fab fa-linkedin"></i>`;
      links.appendChild(linkE);
    }
    if (member.link_email !== '') {
      let linkE;
      linkE = document.createElement('a');
      linkE.href = 'mailto:' + member.link_email;
      linkE.class = 'linkBox';
      linkE.target = '_blank';
      linkE.innerHTML = `<i class="fas fa-envelope"></i>`;
      links.appendChild(linkE);
    }

    //make the info pop-up visible and add the buffer space
    pInfo.style.height = 'fit-content';
    pInfo.style.visibility = 'visible';
    document.querySelector('#buffer-space').classList.remove('hidden');
  }
}

/**
 * closes the info pop-up
 */
function closePInfo() {
  //make the pop-up fundamentally invisible
  pInfo.style.top = '0%';
  pInfo.style.height = '0vh';
  pInfo.style.visibility = 'hidden';
  //loops through each individual content area's buttons
  let contentArea = document.querySelector('#Development');
  let buttons = contentArea.querySelectorAll('.tileButton');
  for (let i = 0; i < teams.length; i++) {
    contentArea = document.querySelector('#' + teams[i]);
    buttons = contentArea.querySelectorAll('.tileButton');
    //reset the buttons
    for (let j = 0; j < buttons.length; j++) {
      buttons[j].parentElement.style.zIndex = 'auto';
      buttons[j].parentElement.style += 'display: block';
    }
  }
  //hide the buffer space
  document.querySelector('#buffer-space').classList.add('hidden');
}

//filters a specific team section
function filterTeam(teamName, teamList, curRoles, curYears, isFullDisplay) {
  let contentArea = document.querySelector('#' + teamName);
  let profiles = contentArea.querySelectorAll('.teamtile');
  let empty = true;
  let profileCounter = 0;

  for (let i = 0; i < profiles.length; i++) {
    profiles[i].classList.add('hidden');
  }

  //loops through the whole list again, checking against the filter types
  for (let i = 0; i < profiles.length; i++) {
    //if the profile matches any team, viable will be made true
    let viable = false;

    //if the profile matches any of the roles, it's marked as viable
    for (let j = 0; j < curRoles.length; j++) {
      //checks using the allProfiles list--the # corresponds to the order in profiles list recently obtained
      if (teamList[i].roles.includes(curRoles[j])) {
        viable = true;
      }
    }

    //continues to check selected years if the profile is viable (or if no roles selected)
    if ((viable && curYears.length > 0) || curRoles.length == 0) {
      //resets viability for new test
      viable = false;

      for (let j = 0; j < curYears.length; j++) {
        if (teamList[i].terms.includes(curYears[j])) {
          viable = true;
        }
      }
    }

    //if after the checks, viability is true (or filters are cleared), displays the profile
    if (viable || (curRoles.length == 0 && curYears.length == 0)) {
      profiles[i].classList.remove('hidden');

      //if at least one viable profile exists, section isn't empty
      empty = false;
    }
  }

  //if no profiles are viable, display the end-tag
  if (empty) {
    contentArea.querySelector('#end-tag').classList.remove('hidden');
  }
  //if there is at least one profile, hide the end-tag
  else {
    contentArea.querySelector('#end-tag').classList.add('hidden');
  }

  //if the section is currently collapsed, re-hides everything past the first 10 visible profiles
  if (!isFullDisplay) {
    for (let i = 0; i < profiles.length; i++) {
      //checks if the profile is currently hidden under the current filter
      if (!profiles[i].classList.contains('hidden')) {
        profileCounter++;
      }

      //once 10 visible profiles have been found, everything past that is hidden
      if (profileCounter > 10) {
        profiles[i].classList.add('hidden');
      }
    }
  }
}

let unordered = true;
/**
 * filters the profiles using the filter checkboxes
 */
function filter() {
  document.querySelector('#loading-zone').classList.remove('hidden');

  //collects checked roles
  let roles = document.querySelectorAll('#roleFilters input');
  let curRoles = [];
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].checked) {
      curRoles.push(roles[i].value);
    }
  }

  //collects checked years
  let years = document.querySelectorAll('#yearFilters input');
  let curYears = [];
  for (let i = 0; i < years.length; i++) {
    if (years[i].checked) {
      curYears.push(years[i].value);
    }
  }

  //runs the filter on each team section
  for (let i = 0; i < teamArrays.length; i++) {
    filterTeam(teams[i], teamArrays[i], curRoles, curYears, displayBools[i]);
  }

  document.querySelector('#loading-zone').classList.add('hidden');
}

//Runs name filter on an individual team (called in searchName)
function searchByName(teamName, teamList, isFullDisplay) {
  let contentArea = document.querySelector('#' + teamName);
  let profiles = contentArea.querySelectorAll('.teamtile');

  //checks searchbox value
  //if searchbox is blank, unhides all the profiles
  if (searchBox.value == '') {
    for (let i = 0; i < profiles.length; i++) {
      profiles[i].classList.remove('hidden');
    }
  }
  //if the searchbox has text
  else {
    //for each profile,
    //if its name does not include the searched characters, hide it
    //this also ensures that the search only shows profiles relevant to any filters
    for (let i = 0; i < profiles.length; i++) {
      if (!teamList[i].username.toLowerCase().includes(searchBox.value.toLowerCase())) {
        profiles[i].classList.add('hidden');
      }
    }
  }

  //if the current section is collapsed, hides everything past the first 10 profiles
  if (!isFullDisplay) {
    let profileCounter = 0;
    for (let i = 0; i < profiles.length; i++) {
      //increments the counter up if the profile is visible
      if (!profiles[i].classList.contains('hidden')) {
        profileCounter++;
      }

      //once there are ten visible profiles, hides all the remaining profiles
      if (profileCounter > 10) {
        profiles[i].classList.add('hidden');
      }
    }
  }
}

/**
 * search for profiles with a matching name, or matching first letters
 * fromFilter: checks if searchName was called from filter() or not
 */
function searchName(fromFilter) {
  //if this method wasn't called from filter,
  //filter all the profiles
  //this makes the search only show profiles relevant to the filter
  if (!fromFilter) {
    filter();
  }

  // opens up the show more buttons to display all profiles when searching
  for (let i = 0; i < displayButtons.length; i++) {
    if (!displayBools[i]) {
      displayBools[i] = toggleFullDisplay(teams[i], teamArrays[i], displayButtons[i], true);
    }
  }

  for (let i = 0; i < teams.length; i++) {
    searchByName(teams[i], teamArrays[i], displayBools[i]);
  }

  //If the searchbox is empty and the method wasn't called from filter, filter all profiles
  if (searchBox.value == '' && !fromFilter) {
    filter();
  }
}

/**
 * displays and hides the filters panel
 **/
function filtersDropdown() {
  let filterSection = document.querySelector('#filter-dropdown');
  //if the section is hidden, reveal it by removing the class that keeps it hidden
  if (filterSection.classList.contains('hidden')) {
    filterSection.classList.remove('hidden');
    filtersBtn.classList.add('filters-open');
    filtersBtn.innerHTML = 'CLOSE FILTER OPTIONS';
  }
  //if the section is not hidden, add the hidden class to hide it
  else {
    filterSection.classList.add('hidden');
    filtersBtn.classList.remove('filters-open');
    filtersBtn.innerHTML = 'OPEN FILTER OPTIONS';
  }
  //close the info pop-up so it doesn't get desynched
  closePInfo();
}

/**
 * clear all of the filters by unchecking all of the checkboxes
 **/
function clearFilters() {
  //each "set" of checkboxes is pulled separately to make the pulling easier
  //(can just pull input elements without worrying about buttons)
  let teams = document.querySelectorAll('#teamFilters input');
  for (let i = 0; i < teams.length; i++) {
    teams[i].checked = false;
  }

  let roles = document.querySelectorAll('#roleFilters input');
  for (let i = 0; i < roles.length; i++) {
    roles[i].checked = false;
  }

  let years = document.querySelectorAll('#yearFilters input');
  for (let i = 0; i < years.length; i++) {
    years[i].checked = false;
  }

  //clear the name search box
  searchBox.value = '';
  //run filter to reset the displayed profiles automatically
  filter();
}

// JS implementation of String.Format(str, args[])
if (!String.format) {
  String.format = function (format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

/**
 * CHECKS IF AN IMAGE EXISTS
 **/
function checkIfImageExists(url, callback) {
  const img = new Image();
  img.src = url;

  if (img.complete) {
    callback(true);
  } else {
    img.onload = () => {
      callback(true);
    };

    img.onerror = () => {
      callback(false);
    };
  }
}

//export the setup function to be used in loader.js
