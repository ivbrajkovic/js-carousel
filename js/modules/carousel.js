/**
 * Create a DOM element
 * @param {string} element Element to create
 * @param {array} classes Classes to apply
 * @param {string} text Text to append
 * @param {string} data Data attribute
 */
function createElement(element, classes, text, data) {
  const el = document.createElement(element);
  classes.forEach((c) => c && el.classList.add(c));
  text && el.appendChild(document.createTextNode(text));
  data >= 0 && el.setAttribute("data-index", data);
  return el;
}

/**
 * Carusel elevation level
 */
const elevation = [
  "none",
  "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
  "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
  "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
];

/**
 * Carousel class
 */
class Carousel {
  constructor(carousel, opt) {
    // Carousel options
    this.carousel = carousel;
    this.running = false;
    this.index = opt?.startIndex ?? 0;
    this.keyNavigation = opt?.keyNavigation ?? true;
    this.around = opt?.around ?? false;
    this.elevation = opt?.elevation ?? 0;
    this.slideSpeed = opt?.slideSpeed ?? 500;

    // Carousel CSS properties
    this.navigationElementsHeight = opt?.navigationElementsHeight || 3;
    this.navigationColor = opt?.navigationColor || "#566475";
    this.navigationOverlayColor = opt?.navigationOverlayColor || "#FFF";

    // Bullets
    this.bullets = null;
    this.showBullets = opt?.showBullets ?? false;

    // Arrows
    this.arrows = null;
    this.showArrows = opt?.showArrows ?? true;
    this.arrowLeftText = opt?.arrowRightLeft ?? "prev";
    this.arrowRightText = opt?.arrowRightText ?? "next";

    // Carousel items
    this.items = carousel.querySelectorAll(".carousel__item");
    this.itemsLenght = this.items.length;
    this.itemsLenghtMiddle = ~~(this.itemsLenght / 2); // truncate to integer

    // Autoplay
    this.autoplay = opt?.autoplay ?? false;
    this.autoplayInterval = opt?.autoplayInterval ?? 3000;
    this.autoplayIntervalObject = null;

    this.initCSSProperties();
    this.initCarousel();
  }

  /**
   * Set carousel css properties
   */
  initCSSProperties = () => {
    this.carousel.style.setProperty(
      "--carousel-shadow",
      elevation[this.elevation]
    );
    this.carousel.style.setProperty(
      "--carousel-slide-speed",
      this.slideSpeed + "ms"
    );
    this.carousel.style.setProperty(
      "--navigation-elements-height",
      this.navigationElementsHeight + "px"
    );
    this.carousel.style.setProperty("--navigation-color", this.navigationColor);
    this.carousel.style.setProperty(
      "--navigation-overlay-color",
      this.navigationOverlayColor
    );
  };

  /**
   * Initialize carousel
   */
  initCarousel = () => {
    // Create bullets
    this.showBullets && this.createBullets();

    // Create arrows
    this.showArrows && this.initArows();

    // Keyboard navigation
    this.keyNavigation &&
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") this.left();
        else if (e.key === "ArrowRight") this.right();
      });

    // Set first slide
    this.items[this.index].classList.add("active");

    // *****************************
    // TODO Add lasy load for images
    // *****************************

    // Set prev slide
    if (this.itemsLenght - 1 !== this.index)
      this.items[this.itemsLenght - 1].classList.add("prev");

    // Set next slide
    if (this.items[this.index + 1]) {
      this.items[this.index + 1].classList.remove("prev");
      this.items[this.index + 1].classList.add("next");
    }

    // Autoplay
    this.autoplay && this.startAutoplay();
  };

  /**
   * Check if current index is valid
   */
  checkBoundaries = () => {
    if (this.index > this.itemsLenght - 1) this.index = 0;
    else if (this.index < 0) this.index = this.itemsLenght - 1;
  };

  /**
   * Create navigation bullets
   */
  createBullets = () => {
    this.bullets = createElement("div", ["bullets-wrapper"]);

    // Delay slide movement
    const delaySetIndex = (index, goRight) => {
      setTimeout(() => {
        // Slide direction
        if (goRight) this.index++;
        else this.index--;

        this.checkBoundaries();

        // *****************************************************
        // TODO Add slide acceleration on greater path distances
        // *****************************************************

        this.setIndex(this.index);
        if (this.index !== index) delaySetIndex(index, goRight);
      }, 500);
    };

    for (let i = 0; i < this.itemsLenght; i++) {
      this.bullets.appendChild(
        createElement("div", ["bullets", this.index === i && "active"], null, i)
      );
      this.bullets.children[i].addEventListener("click", () => {
        // Find shortest path
        let goRight;
        if (this.around)
          goRight = i - this.index <= this.itemsLenghtMiddle ? true : false;
        else goRight = i > this.index ? true : false;

        if (this.index !== i) delaySetIndex(i, goRight);
      });
    }

    this.carousel.appendChild(this.bullets);
  };

  /**
   * Create navigation arrows
   * @param {object} opt Arrow options
   */
  initArows = () => {
    this.arrows = {};
    this.arrows.left = this.createArrow("left", this.arrowLeftText);
    this.arrows.right = this.createArrow("right", this.arrowLeftText);

    this.setArrowState();
  };

  setArrowState = () => {
    if (this.around) return;

    if (this.index === 0) this.arrows.left.style = "display: none";
    else if (this.arrows.left.style) this.arrows.left.style = "";

    if (this.index === this.itemsLenght - 1)
      this.arrows.right.style = "display: none";
    else if (this.arrows.right.style) this.arrows.right.style = "";
  };

  /**
   * Create arrow
   * @param {string} direction Arrow direction
   * @param {string} text Arrow text
   */
  createArrow = (direction = "left", text) => {
    // Create arrow wrapper
    const arrow = createElement("div", [
      "arrow-wrapper",
      `arrow-wrapper__${direction}`,
    ]);

    // Add click listener
    arrow.addEventListener("click", this[direction]);

    // Create arrow
    arrow.appendChild(createElement("div", ["arrow", `arrow__${direction}`]));

    // Create arrow overlay
    arrow.children[0].appendChild(
      createElement("div", ["arrow-overlay", `arrow-overlay__${direction}`])
    );

    // Append text for left arrow
    text && arrow.children[0].appendChild(createElement("span", [], text));

    this.carousel.appendChild(arrow);
    return arrow;
  };

  /**
   * Move carousel to left
   * @param {object} e event object
   */
  left = (e) => {
    // Check if first
    const first = this.index === 0;
    if (!this.around && first) return;

    this.index--;
    this.checkBoundaries();

    // Move to prev slide
    this.setIndex(this.index);
  };

  /**
   * Move carousel to right
   * @param {object} e event object
   */
  right = (e) => {
    // Check if last and
    const last = this.index === this.itemsLenght - 1;
    if (!this.around && last) return;

    this.index++;
    this.checkBoundaries();

    // Move to next slide
    this.setIndex(this.index);
  };

  /**
   * Set active slide
   * @param {number} index Carousel active index
   */
  setIndex = (index) => {
    for (let i = 0; i < this.items.length; i++)
      this.items[i].classList.remove("prev", "next", "active");

    if (index - 1 < 0) this.items[this.itemsLenght - 1].classList.add("prev");
    else this.items[index - 1].classList.add("prev");

    this.items[index].classList.add("active");

    if (index + 1 === this.itemsLenght) this.items[0].classList.add("next");
    else this.items[index + 1].classList.add("next");

    this.setActiveBullet(index);
    this.setArrowState();
  };

  /**
   * Set current active bullet
   * @param {number} index Current slide index
   */
  setActiveBullet = (index) => {
    for (let i = 0; i < this.bullets.children.length; i++)
      this.bullets.children[i].classList.remove("active");

    this.bullets.children[index].classList.add("active");
  };

  /**
   * Autoplay slider
   * @param {noolean} start Start or stop autoplay
   */
  startAutoplay = () => {
    // Already started
    if (this.autoplayIntervalObject) return;

    this.autoplayIntervalObject = setInterval(() => {
      this.index++;
      this.checkBoundaries();
      this.setIndex(this.index);
    }, this.autoplayInterval);
  };

  /**
   * Stop autoplay
   */
  stopAutoplay = () => {
    clearInterval(this.autoplayIntervalObject);
    this.autoplayIntervalObject = null;
  };
}

export default Carousel;
