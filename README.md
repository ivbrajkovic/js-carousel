# Vanilla JS Carousel

Carousel created with Vanilla JS with slide transations.

## Usage

Initialize Carousel class with a DOM elment and options.

```js
new Carousel(element, { autostart: true });
```

## Options

```js
// Deafult options
new Carousel(element, {
  startIndex: 0, // start slide index
  keyNavigation: true, // listen for arrow keys
  around: false, // slide in circle
  elevation: 0, // shadow elevation (0, 1, 2, 3)
  slideSpeed: 500, // slide speed in ms
  navigationElementsHeight: 3, // navigation line weight
  navigationColor: "#566475", // navigation lines color
  navigationOverlayColor: "#FFF", // navigation lines hover color
  showBullets: false, // show bullets navigation
  showArrows: true, // show navigation arrows
  arrowLeftText: true, // left navigation arrow text
  arrowRightText: true, // right navigation arrow text
  autoplay: false, // autostart
  autoplayInterval: 300, // autoplay interval in ms
});
```

## Class method

```js
const carousel = new Carousel(element, { autostart: true });

carousel.left(); // slide left
carousel.right(); // slide right
carousel.setIndex(); // set active slide index
carousel.startAutoplay(); // start autoplay
carousel.stopAutoplay(); // stop autoplay
```
