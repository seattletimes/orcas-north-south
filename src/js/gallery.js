var $ = require("./lib/qsa");
var h = require("./lib/dom");
var scroll = require("./lib/animateScroll");

var galleries = window.galleryData;

var photoPath = (f, i) => `./assets/photos/toned/${i}`;
var thumbPath = i => `./assets/photos/thumbnails/${i}`;

var elements = $(".gallery");

elements.forEach(function(container) {

  var gallery = galleries[container.getAttribute("data-gallery")];
  var lookup = {};

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

  var thumbs = gallery.map((r, i) => {
    var t = h("a.thumbnail", {
      href: photoPath(r.folder, r.image),
      "data-image": r.image,
      "data-index": i,
    }, [
      h("img.square", {
        src: thumbPath(r.image),
        alt: (r.title || "").replace(/"/g, "&quot;")
      })
    ]);
    lookup[r.image] = t;
    return t;
  });
  var thumbContainer = h("div.thumbnails", thumbs);

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

  var selectImage = function(e) {
    if (e) {
      e.preventDefault();
      scroll(image)
    }
    $(".selected.thumbnail", thumbContainer).forEach(t => t.classList.remove("selected"));
    this.classList.add("selected");
    var url = this.href;
    image.src = url;
    var index = this.getAttribute("data-index");
    var id = this.getAttribute("data-image");
    currentImage = id;
    var content = gallery[index];
    var caption = content.preview || "This space unintentionally left blank.";
    if (content.more) caption += `
<button class="unfold" aria-hidden="hidden">Show more &raquo;</button>
<p class="fold">
${content.more.split(/\n+/).join(`<p class="fold">`)}`;
    
    container.classList.add("loading");
    whenLoaded(_ => {
      container.classList.remove("loading");
      captionContainer.innerHTML = `
<h4>
${content.title || "Title goes here"}
<div class="time">${content.time || ""}</div>
</h4>
${caption}
          `;
    });
  };

  thumbs.forEach(a => a.addEventListener("click", selectImage));

  selectImage.call(thumbs[0]);

  captionContainer.addEventListener("click", function(e) {
    if (e.target.className == "unfold") {
      container.classList.add("unfolded");
    }
  });

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