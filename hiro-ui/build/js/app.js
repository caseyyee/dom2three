(function() {
	var uidata = document.querySelector('#uidata');

	var d23 = new DOM2three('./data/ui.json','hud');
	d23.onload = function() {
		// apply content to HTML layout.
		this.root.items = this.applyContent(this.root.items, document.body);
		// insert resultant JSON data onto page for the renderer to pick up.
		uidata.innerHTML = JSON.stringify(this.data);
	}
})();	
