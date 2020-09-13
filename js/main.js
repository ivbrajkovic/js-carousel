import Carousel from "./modules/carousel.js";

const carouselsArr = document.querySelectorAll(".carousel");

new Carousel(carouselsArr[0], {
  // startIndex: 2,
  elevation: 3,
  around: false,
  showBullets: true,
  autoplay: false,
  // slideSpeed: 100,
});

new Carousel(carouselsArr[1], {
  elevation: 3,
  around: true,
  showBullets: true,
  autoplay: true,
});
