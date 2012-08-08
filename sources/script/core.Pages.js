core.Pages = new function Pages() {
	var pageTester = document.createElement("div");
	pageTester.id = "pageTester";
	this.getAvailableHeight = function getAvailableHeight(page) {
		if(typeof(page) == "number") page = $$(".page-view")[page - 1].getElementsByTagName("article")[0];
		page.appendChild(pageTester);
		var pt = $("pageTester")
		var availHeight = pt.parentNode.offsetHeight - pt.offsetTop + pt.parentNode.offsetTop;
		pt.parentNode.removeChild(pt);
		return availHeight;
	}
}