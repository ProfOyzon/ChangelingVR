import { Intersection } from '@splidejs/splide-extension-intersection/dist/js/splide-extension-intersection.esm.js';
import { Video } from '@splidejs/splide-extension-video/dist/js/splide-extension-video.esm.js';
import { Splide } from '@splidejs/splide/dist/js/splide.esm.js';

let pagenav, pagenavToggle, main;
init_Page();
function setPageNav() {
  // Previous calc used when the pagenav started lower, smooth rise no longer needed
  // let calc = (18 - (36 * window.pageYOffset / window.screen.height));
  // if (calc > 5)
  //     pagenav.style.transform = `translate3d(0, ${calc}rem, 0)`;
  // else

  pagenav.style.transform = `translate3d(0, 5rem, 0)`;
}

function init_Page() {
  // Used for parallax scroll effect of in-page navigation
  pagenav = document.querySelector('.pagenav');
  main = document.querySelector('main');

  //bootstrap modal for images
  /*$('.ss').on('click', function () {
		$('.imagepreview').attr('src', $(this).find('img').attr('src'));
		$('#imagemodal').modal('show');
	});*/

  // Slight parallax scroll effect for the in-page navigation
  window.addEventListener('scroll', setPageNav);
  setPageNav();
  create_Slideshow();
}

/// Splide for Screenshot Slideshow
// Waits until dom is loaded, to initialize splide slideshow and its thumbnails
function create_Slideshow() {
  // Main slider
  let splide = new Splide('.splide', {
    type: 'loop',
    autoplay: 'pause',
    speed: 400,
    pagination: false,
    arrows: false,
    intersection: {
      inView: {
        autoplay: true,
      },
    },
  });

  // Thumbnail slider
  let thumbnails = new Splide('#thumbnail-carousel', {
    fixedWidth: 150,
    gap: 10,
    rewind: true,
    pagination: false,
    isNavigation: true,
    focus: 'center',
    trimSpace: true,
    // Changes width at 800px
    breakpoints: {
      800: {
        fixedWidth: 80,
      },
    },
  });

  // Syncs both sliders
  splide.sync(thumbnails);

  // Finally, mounts both splides
  splide.mount(window.splide.Extensions);

  splide.on('mounted', function () {
    if (document.querySelector('.splide__video > button')) {
      var playButton = document.querySelector('.splide__video > button');
      var playSvg = playButton.innerHTML;
      console.log(playSvg);
    }
  });

  thumbnails.mount(window.splide.Extensions);
}
