import { Intersection } from '@splidejs/splide-extension-intersection/dist/js/splide-extension-intersection.esm.js';
import { Video } from '@splidejs/splide-extension-video/dist/js/splide-extension-video.esm.js';
import { Splide } from '@splidejs/splide/dist/js/splide.esm.js';

window.onload = () => {
  // Begin: Slideshow at bottom of page
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
  splide.sync(thumbnails);
  splide.mount({ Intersection, Video });
  thumbnails.mount({ Intersection, Video });

  // Code necessary for newsletter's embedded form to work
  (function (w, d, e, u, f, l, n) {
    ((w[f] =
      w[f] ||
      function () {
        (w[f].q = w[f].q || []).push(arguments);
      }),
      (l = d.createElement(e)),
      (l.async = 1),
      (l.src = u),
      (n = d.getElementsByTagName(e)[0]),
      n.parentNode.insertBefore(l, n));
  })(window, document, 'script', 'https://assets.mailerlite.com/js/universal.js', 'ml');
  ml('account', '881721');
  // End
};
