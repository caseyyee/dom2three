window.app = (function() {
	function App() {
		var self = this;
		this.settings = null;

		this.initSettings('./data/settings.json').then(function(data) {
			this.settings = data;
			self.parseFavorites(this.settings.favorites);
		});
	};

	App.prototype.parseFavorites = function(favorites) {// hash function
		var djb2Code = function(str){
	    var i, hash = 5381;
	    for (i = 0; i < str.length; i++) {
	        char = str.charCodeAt(i);
	        hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
	    }
	    return hash;
		}
		var container = document.querySelector('#favorites');
		var template = document.querySelector('#favorites-template');

		var i = 0, fav, node;
		for (i = 0; i < favorites.length; i++) {
			fav = favorites[i];
			node = template.cloneNode(true);
			node.style = 'display: block';
			node.setAttribute('data-d23-id', djb2Code(fav.url));
			node.querySelector('.fav-inner').appendChild(document.createTextNode(fav.name));
			container.appendChild(node);

			console.log(node.getBoundingClientRect());
		}
	}

	App.prototype.initSettings = function(url) {
		return new Promise(function(resolve, reject) {
			var self = this;
			
			var xhr = new XMLHttpRequest();

			xhr.onload = function() {
				resolve(JSON.parse(xhr.response));
			}
			xhr.onerror = function() {
				reject(new Error('Some kind of network error, XHR failed.'))
			}
			xhr.open('GET', url);
			xhr.send();
		});
	}

	return new App();
})();