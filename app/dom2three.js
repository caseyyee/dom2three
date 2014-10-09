function Dom2three(opts, onReady) {
	var self = this;

	this.opts = opts;
	this.opts.scale = 0.05;
	this.data = null;
	this.image = null;

	function init() {
		var dataP = makeRequest(opts.dataUrl);
		var imageP = getImage(opts.imageUrl);

		Promise.all([dataP, imageP]).then( function(values) {
			self.data = JSON.parse(values[0]);
			self.image = values[1];
			if (typeof(onReady) == 'function') {
				onReady();
			}
		});
	}

	function getImage(url) {
		return new Promise(function(resolve, reject) {
			var img = new Image();
			img.onload = function() {
				resolve(img);
			};
			img.onerror = function() {
				reject(new Error('image did not load.'));
			};
			img.src = url;
		});
	}

	function makeRequest(url) {
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			
			xhr.onload = function() {
				resolve(xhr.response);
			}
			xhr.onerror = function() {
				reject(new Error('Some kind of network error, XHR failed.'))
			}
			xhr.open('GET', url);
			xhr.send();
		});
	}
	
	init();
}

Dom2three.prototype.create = function(id) {
	function findById(id, data) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].id == id) 
				return data[i];
		}
	}

	var match = findById(id, this.data);
	
	if (!match) {
		console.log('no match found for id "' + id + '"');
		return false;
	}
	console.log(match);
	var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.width = match.width;
  canvas.height = match.height;
  context.drawImage(this.image, match.x * -1, match.y * -1);
  
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	 
	var material = new THREE.MeshBasicMaterial({
		map: texture,
		transparent: true
	});
	 
	var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width * this.opts.scale, canvas.height * this.opts.scale), material);
	// mesh.overdraw = true;
	// mesh.doubleSided = true;
	
	return mesh;
}