(function() {
	var uidata = document.querySelector('#uidata');

	var d23 = new DOM2three('./data/title/index.json');
	d23.onload = function(items) {
		// apply content to HTML layout.
		this.applyContent(document.body);
		// insert resultant JSON data onto page for the renderer to pick up.
		uidata.innerHTML = JSON.stringify(this.data);
	}
})();
