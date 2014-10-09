## DOM2three

Render any web page element into your three.js scene.

### Directories

    /app - example of a webGL scene that imports dom2three elements.
    /app-ui - example of UI markup in HTML tagged for dom2three
    /renderer - renderer scripts that generate texture bitmaps and texture atlas.
    /scrape - output of the renderer.

### Working on Hiro templates

    /hiro-ui - hiro UI templates.
        /build - exported html/js/css
        /src - source files
        /data - settings.json from JAVRIS.

Running the  `./gulp` default task will process all the files in `/hiro-ui/src` and output them into `/hiro-ui/build`.   A local web server where you can preview all your changes also runs at `http://localhost:8000`.


### Rendering and using Hiro templates
To rener the templates, run `./gulp render`.  The renderers output will saved to `./scrape` folder.  Copy this into the `{JAVRIS folder}/data/ui`.

### Gulp configuration
Inside `gulpfile.js` you can change the source directory where templates are ready from:

    var path = {
        base: './hiro-ui/'
    }

Configure the renderer source file by changing variable:
    
    var renderFrom = 'http://localhost:8000/index-layout.html'
