function Page() {
  var config = {
    $bookBlock: $("#bb-bookblock"),
    $bookName: null, // will fix in init
  };

  var oldau = null;
  var aualerted = false;

  var playAudio = function (old, page, isLimit) {
    if (isLimit) {
      return false;
    }
    var url = page <= 9 ? "0" + page : "" + page;
    url = "assets/audio/" + config.$bookName + "/" + url + ".mp3";
    var au = new Audio(url);
    au.addEventListener("canplaythrough", (event) => {
      stopAudio();
      au.play()
        .then(function () {
          oldau = au;
        })
        .catch(function (err) {
          if (!aualerted) {
            // alert("Please enable automatic audio play");
            aualerted = true;
          }
        });
    });
  }; // playAudio

  var stopAudio = function () {
    if (oldau) {
      oldau.pause();
      oldau = null;
    }
  };

  var init = function (bookname) {
      config.$bookName = bookname;
      config.$bookBlock.bookblock({
        speed: 300,
        shadowSides: 0.8,
        shadowFlip: 0.7,
        onEndFlip: playAudio,
      });
      initEvents();
      stopAudio();
      playAudio(0, 0, false); // Cover page
    },
    initEvents = function () {
      var $slides = config.$bookBlock.children();
      $slides.each(function (i) {
        this.onclick = function (e) {
          if (e.offsetX > e.target.width / 2) {
            config.$bookBlock.bookblock("next");
          } else {
            config.$bookBlock.bookblock("prev");
          }
        };
      });

      // add keyboard events
      $(document).keydown(function (e) {
        var keyCode = e.keyCode || e.which,
          arrow = {
            left: 37,
            up: 38,
            right: 39,
            down: 40,
          };

        switch (keyCode) {
          case arrow.left:
            config.$bookBlock.bookblock("prev");
            break;
          case arrow.right:
            config.$bookBlock.bookblock("next");
            break;
        }
      });
    };

  var close = function () {
    stopAudio();
    config = null;
  };
  return { init: init, close: close };
}

window.Page = Page;

// Modern browsers don't show scroll bars, so some
// visual indication is necessary, otherwise the text looks clipped
// esp on small screens.
// For all text-wrappers, this indicator is in the form of a 
// bottom shadow that somewhat obscures the last visible line, which
// nudge the viewer to scroll down to get it into clear view.

function addMoreIndicatorIfOverflow(event) {
  let t = event.target;
  if (t.clientHeight > 0 && (t.scrollHeight - t.scrollTop > t.clientHeight)) {
    // console.log({obj: t, ch: t.clientHeight, sh: t.scrollHeight, st: t.scrollTop});
    t.classList.add("more-text-indicator");
  } else {
    t.classList.remove("more-text-indicator");
  }
}


$(".text-center").each(function(i, tw) {
  const options = {
    root: document.body,
    rootMargin: '0px',
    threshold: 0
  }
  
  const observer = new IntersectionObserver(() => {
    console.log({target: tw, "msg": "intersection"})
    addMoreIndicatorIfOverflow({target: tw });
  }, options); // check for intersection with the viewport, then install. 
  
  observer.observe(tw);

  tw.addEventListener("scroll", addMoreIndicatorIfOverflow, {passive: true});
  window.addEventListener("resize", () => {
    addMoreIndicatorIfOverflow({ target: tw });
  });
});

/* Support for book popup */

function getViewportWidth() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
}
function getViewportHeight() {
    return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

}
const template = `
<div id='bb-bookblock' class='bb-bookblock'>
    <div id="book-close" onclick="closeBook()"> &times;<\/div>
    <div class="bb-item"> <img src="assets/img/books/BOOKNAME/00.png" \/><\/div>
    <div class="bb-item"> <img src="assets/img/books/BOOKNAME/01.jpg" \/><\/div>
    <div class="bb-item"> <img src="assets/img/books/BOOKNAME/02.jpg" \/><\/div>
    <div class="bb-item"> <img src="assets/img/books/BOOKNAME/03.jpg" \/><\/div>
    <div class="bb-item"> <img src="assets/img/books/BOOKNAME/04.jpg" \/><\/div>
<\/div>
`

function openBook(bookname) {
    const book_open = $("#book-open");
    book_open.css("display", "block");
    const html = template.replaceAll("BOOKNAME", bookname);
    book_open.append(html);
    const bb_bookblock = book_open.find("#bb-bookblock");
    if (getViewportWidth() < getViewportHeight()) {
        bb_bookblock.addClass("bb-vw");
    } else {
        bb_bookblock.addClass("bb-vh");
    }
    const page = Page();
    page.init(bookname);
    book_open.find("#book-close").click(() => { closeBook(page) });
}

function closeBook(page) {
    page.close();
    const book_open = $("#book-open");
    book_open.css("display", "none");
    $("#book-open").empty();
}
