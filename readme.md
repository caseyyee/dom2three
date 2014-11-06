## DOM2three

Render web page element into three.js meshes for 3d radness!

### Basic usage

#### 1. Saving your HTML layout 
1. Create a HTML layout and include the `dom2three.js` onto the page with content you want to convert.

        <script src="dom2thee.js"></script>

2. Tag any elements which you would like created into a three.js mesh with a `data-mesh` attribute.

        <div id="example" data-mesh> Example element </div>

3. Run the gulp script on your project folder.

        gulp render yourproject/index.html

4. The gulp script will place all the necessary data files into a `dom2three` sub-folder.  

#### 2. Adding DOM2three elements to your three.js scene.
    
1. Include `dom2three.js` onto the page with your three.js scene.  (step 1 above)

2. Call `load` with the dom2three data folder (step 4 above)

        var d23 = DOM2three.load('dom2three_dir')
    
    `Load` returns a promise once we are ready to go.

3. Retrieve a dom2three node and add the mesh to your three.js scene.

        d23.then( function() {
            var node = d23.getNodeById('example', true);
            scene.add( node.mesh );
        });


### More usage notes
* Create dynamic text areas from HTML layouts by specifying `data-textarea` attributes.   You'll also need to include what mesh hosts this textarea by specifying `data-hostmesh='mesh-name'`.

### Gotcha's!
* Examples are not really real examples yet.  It's what we need to for our project www.github.com/mozvr/HIRO.   I will come up with basic examples that are more general purpose at a later date.
* We are using JADE + SASS to make it quick for us to generate templates, but standard HTML/CSS pages will work too.
* There's a few dependencies that need to be installed.   We will need to create a isntall script to make this easier to work with.

  * [Slimerjs](http://slimerjs.org)
  * [Imagemagick](http://www.imagemagick.org)
  * [Node.js](http://http://nodejs.org/)
