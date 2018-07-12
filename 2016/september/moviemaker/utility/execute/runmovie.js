var page = require('webpage').create();
var system = require('system');

//Set the page size
page.viewportSize = { width: 640, height: 480 };

if (system.args.length === 1) {
  console.log('Usage: runmovie.js <imageLocation>');
  phantom.exit();
}

function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log(">>>>>>> 'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};

function padWithZeroes(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

page.open('http://localhost:8080/', function(status) {
  if(status !== "success") {
      console.log("Connection failed");
      phantom.exit();
  }
  else {
    //Hide display navigation
    page.evaluate(function () {
      return timeController.hideNavigation();
    });

    //Start initalize and execute activity
    waitFor(
      function() {
        return page.evaluate(function () {

          return timeController.isInitialized();
        });
      },
      function() {
        var frame = 0;
        var target_fps = 30;
        var outDir = system.args[1];

        var frames = page.evaluate(function () {
          return 30;
        }) * target_fps;

        console.log("Total Time: " + frames);

        for(var frame = 0; frame < frames; frame++) {
            page.evaluate(function (time) {
                timeController.pauseAnimationAt(time);
            }, frame * (1 / target_fps));
            page.render(outDir+'/frame_' + padWithZeroes(frame, 5) + '.png', { format: "png" });
        }
        phantom.exit();
      }
    );
  }
});
