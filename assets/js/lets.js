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
    url = "assets/audio/" + url + ".mp3";
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

// Scroll support. For all text-wrappers, add a "shadow" class
// that covers it, and then turn its bottom shadow on if
// there is more content. This is to compensate for the 
// fact that modern browsers don't show scroll bars, so some
// visual indication is necessary.

function setShadows(event) {
  let t = event.target;
  if (t.scrollHeight - t.scrollTop > t.clientHeight) {
    // console.log("Adding bottom")
    t.classList.add("at-bottom");
  } else {
    t.classList.remove("at-bottom");
  }
}

$('<div class="more-text shadow-bottom" aria-hidden="true"></div>')
  .insertAfter(".body-text");
$(".text-wrapper").each(function(i, tw) {
  console.log("Added");
  setShadows({ target: tw }); // on loading.
  tw.addEventListener("scroll", setShadows);
  window.addEventListener("resize", () => {
    setShadows({ target: tw });
  });
});
