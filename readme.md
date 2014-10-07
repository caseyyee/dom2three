## DOM2three

Render any web page element into your three.js scene.

### Directories

    /app - example of a webGL scene that imports dom2three elements.
    /app-ui - example of UI markup in HTML tagged for dom2three
    /renderer - renderer scripts that generate texture bitmaps and texture atlas.
    /renderer/scrape - output of the renderer.

### Working on Hiro templates

    /hiro-ui - hiro UI templates.
        /build - exported html/js/css
        /src - source files
        /data - settings.json for favorites.

The default gulp task in `/hiro-ui` will output into `/hiro-ui/build` folder.   This is where the renderer is pointed to extract layout, texture bitmap and texture atlas for use in Hiro.

### Rendering and using Hiro templates

1. Setup web server to serve hiro templates at:
`http://localhost:8000/build/index-layout.html`

2. From `/renderer` run:
    `slimerjs-0.9.3/slimerjs ./script.js`

3. Copy output from renderer in `/renderer/scrape/` to `{JAVRIS folder}/data/ui/`
