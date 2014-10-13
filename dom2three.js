'use strict';

function DOM2three(uiJson) {
	var self = this;
	self.path = null;
	self.data = null;
	self.onload = null;
	self.texture = null;
	self.mesh = null;
	self.item = null;

	self.loadJson(uiJson)
		.then( function(response) {
				return JSON.parse(response)
			})
		.then( function(response) {
			self.data = response;
			if (self.data.texture) {
				self.loadTexture(self.data.texture)
					.then(function() {
						// data loaded
						// texture loaded

						if (typeof self.onload == 'function') {
							self.onload.call(self);
						}
					})
			}
	});

	return this;
}

/*
bits for three.js layouts
-----------------------
*/
DOM2three.prototype.loadTexture = function(src) {
	var self = this;
	return new Promise(function(resolve, reject) {
		var texture = THREE.ImageUtils.loadTexture(self.path+src, undefined, function() {
			self.texture = texture;
			resolve(texture);
		});
	})
}

DOM2three.prototype.setText = function(selector, text) {
	var item = this.item;
	var select = this.getNode(selector);

	if (!select) {
		console.warn('Nothing found for '+select);
		return false;
	};

	console.log(select.rectangle, select.canvas);

	var context = select.canvas.context;

	context.clearRect(select.rectangle.x,
		select.rectangle.y,
		select.rectangle.width,
		select.rectangle.height);

	context.fillText(text,
		select.canvas.x,
		select.canvas.y
	);

	select.canvas.texture.needsUpdate = true;

}

DOM2three.prototype.getMesh = function(selector) {
	var self = this;
	var geometry = new THREE.PlaneGeometry( 1, 1 );
	var item = this.getNode(selector);

	// texture positioning
	var rect = item.rectangle;
	var tex = self.texture.clone();
	tex.repeat.x = rect.width / tex.image.width;
	tex.repeat.y = rect.height / tex.image.height;
	tex.offset.x = rect.x / tex.image.width;
	tex.offset.y = 1 - ((rect.y + rect.height) / tex.image.height );
	tex.needsUpdate = true;
	item.texture = tex;

	// positioning
	var centerOffsetX = tex.image.width / 2;
	var centerOffsetY = tex.image.height / 2;
	var x = rect.x + (rect.width / 2) - centerOffsetX;
	var y = rect.y + (rect.height / 2) - centerOffsetY;
	item.position = {
		x: x,
		y: y
	};

	// materials
	// map the base texture to object.
	var materials = [new THREE.MeshBasicMaterial({ map : tex })];

	// create additional materials for each replaceable piece of content.
	if (item.content) {
		var canvasMaterials = this.createCanvasMaterials(item);
		materials = materials.concat(canvasMaterials);
	}

	// mesh
	var mesh;
	if (materials.length > 1) {
		mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, materials );
	} else {
		mesh = new THREE.Mesh( geometry, materials[0] );
	}

	mesh.position.set( x, -y, 0);
	mesh.scale.set( rect.width, rect.height, 1 );
	mesh.userData.position = new THREE.Vector2( x, y );

	item.mesh = mesh;

	self.item = item;

	return mesh;
}

DOM2three.prototype.createCanvasMaterials = function(item) {
	var materials = [];

	item.content.forEach(function(content) {
		if (content.hasOwnProperty('canvas')) {
			var rect = item.rectangle;
			// create a canvas element for canvas enabled selector
			var canvas = document.createElement('canvas');
			// set to parent element width/height
			canvas.width = rect.width;
			canvas.height = rect.height;

			var context = canvas.getContext('2d');
			context.font = content.font;
			context.fillStyle = content.fillStyle;

			content.canvas = {};
			content.canvas.context = context;
			content.canvas.x = content.rectangle.x - rect.x;
			content.canvas.y = content.rectangle.y - rect.y + content.rectangle.height;

			var texture = new THREE.Texture(canvas);
			texture.needsUpdate = true;

			var material = new THREE.MeshBasicMaterial( { map: texture, side:THREE.DoubleSide } );
			material.transparent = true;

			content.canvas.texture = texture;

			materials.push(material);
		}
	});

	return materials;
}

DOM2three.prototype.getNode = function(selector) {
	var items = this.data.items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];

		if (item.hasOwnProperty('selector')) {
			if (item.selector == selector) {
				return item;
				break;
			}
		};

		if (item.content) {
			for (var j = 0; j < item.content.length; j++) {
				var content = item.content[j];
				if (content.hasOwnProperty('selector')) {
					if (content.selector == selector) {
						return content;
						break;
					}
				}
			}
		}
	}
	return false;
}


/*
bits for HTML templates
-----------------------
*/

/*
get placement on page
*/
DOM2three.prototype.getRectangle = function(el) {
	var rect = el.getBoundingClientRect();
	//console.log(el, rect);
	return {
		x: rect.x,
		y: rect.y,
		width: el.offsetWidth,
		height: el.offsetHeight
	};
}

/*
applies to any item with content property.
*/
DOM2three.prototype.applyContent = function(dom) {
	var self = this;
	var items = self.data.items;

	items.forEach(function(item) {
		var select = dom.querySelector(item.selector);

		var el;

		// clone the item that is being selected.
		if (item.clone) {
			el = select.cloneNode(true);
			el.id = '';	// clear ID so that we don't collide with cloned element.
			select.parentNode.appendChild(el);
		} else {
			el = select;
		}

		// project content into element.
		if (item.content) {
			item.content.forEach(function(content) {
				if (content.selector) {
					var cel = el.querySelector(content.selector)
					if (cel) {
						// content with canvas property will be overwritten using canvas text.
						if (content.canvas) {
							cel.innerHTML = '&nbsp;';
						} else {
							cel.innerHTML = content.content;
						}
					} else {
						console.error(content.selector + " not found");
					}
					content.rectangle = self.getRectangle(cel);
				}
			});
		};

		// get bounding rect for element.
		item.rectangle = self.getRectangle(el);
	});

	return items;
}


/*
utils
-----------------------
*/
DOM2three.prototype.loadJson = function(url) {
	var a = document.createElement('a');
	a.href = url;
	var path = a.pathname.substring(0, a.pathname.lastIndexOf('/')) + '/';
	this.path = path;

	return new Promise( function(resolve, reject) {
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
};
