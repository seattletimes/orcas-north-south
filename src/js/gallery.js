var $ = require("./lib/qsa");
var h = require("./lib/dom");
var scroll = require("./lib/animateScroll");

var galleries = window.galleryData;

var photoPath = (f, i) => `./assets/photos/${i}`;
var thumbPath = i => `./assets/photos/${i}`;

var elements = $(".gallery");

elements.forEach(function(container) {

  var gallery = galleries[container.getAttribute("data-gallery")];
  var lookup = {};
  console.log(gallery);

  // spotlight UI elements
  var previous = h("button.stepper.previous", { "data-step": "-1", "aria-label": "previous image" }, "&laquo;");
  var next = h("button.stepper.next", { "data-step": "1", "aria-label": "next image" }, "&raquo;");
  var image = h("img.featured");

  var spotlight = h("div.spotlight", [
    previous,
    h("div.image-frame", [
      image 
    ]),
    next 
  ]);

  var captionContainer = h("div.caption", { "aria-live": "polite" });

  
  
  // assemble gallery DOM
  var children = h("div.row", [
    thumbContainer,
    h("div.contents", [
      spotlight,
      captionContainer
    ])
  ]);

  container.appendChild(children);

  var currentImage = null;

  var whenLoaded = function(callback) {
    var onLoad = function() {
      callback();
      image.removeEventListener("load", onLoad);
    }
    image.addEventListener("load", onLoad);
  };

  

  var onStep = function() {
    var step = this.getAttribute("data-step") * 1;
    var currentThumb = lookup[currentImage];
    var index = thumbs.indexOf(currentThumb);
    index = (index + step) % thumbs.length;
    if (index < 0) {
      index = thumbs.length + index;
    }
    var stepped = thumbs[index];
    selectImage.call(stepped);
  };

  [previous, next].forEach(b => b.addEventListener("click", onStep));

});