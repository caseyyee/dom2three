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

    // pickup the script tag with dom2three element data and persist it into a json file.
    var uidata = page.evaluate(function() {
    	return document.querySelector('#dom2three').innerHTML;
    });

    fs.write(writePath+'/index.json', uidata);
    console.log('saved '+writePath+'/index.json');

    // write blue component image
    page.evaluate(function() {
      document.body.style.background = '#0000FF';
    });
    page.render(writePath+'/index-0000ff.png');
    console.log('saved '+writePath+'/index-0000ff.png');

    // write yellow component image
    page.evaluate(function() {
      document.body.style.background = '#FFFF00';
    });
    page.render(writePath+'/index-ffff00.png');
    console.log('saved '+writePath+'/index-ffff00.png');

   	phantom.exit();
  }, 200);
});
