window.onload = init;
function init() {
  let cap = document.querySelector('#checkbox');
  cap.addEventListener('click', checkClicked);
}

function checkClicked() {
  setTimeout(() => {
    window.location.replace('/aurelia.html');
  }, 3000);
}
