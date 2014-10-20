(function() {
	var uidata = document.querySelector('#uidata');

	var d23 = new DOM2three('./data/index.json');

	d23.onload = function(items) {
		// apply content to HTML layout.
		this.applyContent(document.body);
		// calculate rectangles for each layout item.
		this.getItemsRectangles();
		// insert resultant JSON data onto page for the renderer to pick up.
		uidata.innerHTML = JSON.stringify(this.data);
	}
})();
