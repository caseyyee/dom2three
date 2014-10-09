// slimer & phantom.js script
var page = require('webpage').create();
var fs = require('fs');

var url = phantom.args[0];
var writePath = phantom.args[1];
if (url == undefined) {
  console.log('You need to specify a URL and destination path');
  phantom.exit();
}

page.open(url, function(status) {
  // give a few hundred ms to let the page render.
  setTimeout(function() {
  	page.onConsoleMessage = function(msg, lineNum, sourceId) {
      console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
    };

    var properties = page.evaluate(function() {
    	var props = [],
    	matches = document.querySelectorAll('[data-d23]');

      //document.body.style.background = 'transparent';
      
    	var i, el;
      for(i = 0; i < matches.length; ++i) {
        el = matches[i];
        if (el.style.display!== 'none') {
          props.push({
            x: el.offsetLeft,
            y: el.offsetTop,
            width: el.offsetWidth,
            height: el.offsetHeight,
            id: el.getAttribute('data-d23-id')
          });
        }
      };

    	return props;
    });

    fs.write(writePath+'/index.json',JSON.stringify(properties));
    console.log('d23 saved '+writePath+'/index.json');
    page.render(writePath+'/index.png');
    console.log('d23 saved '+writePath+'/index.png');
   	phantom.exit();
  }, 200);
});
