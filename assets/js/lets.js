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
      if (oldau) {
        oldau.pause();
      }
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

  return { init: init };
}

window.Page = Page;
