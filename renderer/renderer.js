var phantom = require('phantom');
var fs = require('fs');

phantom.create(function (ph) {
  ph.createPage(function (page) {

    page.open("../app-ui/index.html", function(status) {
      console.log("opened? ", status);

      page.evaluate(function() {
        var props = [],
        matches = document.querySelectorAll('.dom2three');
        
        document.body.style.background = 'transparent';

        var i, el;
        for(i = 0; i < matches.length; ++i) {
          el = matches[i];
            props.push({
              x: el.offsetLeft,
              y: el.offsetTop,
              width: el.offsetWidth,
              height: el.offsetHeight,
              id: el.getAttribute('id')
            });
        }
        return props;
      },
      function(props) {
        fs.writeFile("../scrape/index.json", JSON.stringify(props), function(err) {
          if (err) {
            console.log(err);
          }
        });
      });

    
      page.render('../scrape/index.png');
      
      ph.exit();

    });
  });
});
