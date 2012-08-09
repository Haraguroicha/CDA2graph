core.Pages = new function Pages() {
	var pageTester = document.createElement("div");
	pageTester.id = "pageTester";
	var pageArticle = $x("//section[@class='page-viewpoint']/article")[0];
	this.getPageNumber = function getPageNumber() {
		return Math.floor(1 + $$(".page-viewpoint")[1].scrollTop / ($("baseView").offsetHeight + 17)) + " of " + $$(".page-view").length;
	}
	this.getPages = function getPages() {
		return $$(".page-view").length;
	}
	this.getAvailableHeight = function getAvailableHeight(page) {
		if(typeof(page) == "number") page = $$(".page-view")[page - 1].getElementsByTagName("article")[0];
		page.appendChild(pageTester);
		var pt = $("pageTester")
		var availHeight = pt.parentNode.offsetHeight - pt.offsetTop + pt.parentNode.offsetTop;
		pt.parentNode.removeChild(pt);
		return availHeight;
	}
	this.addPage = function addPage() {
		var sec = document.createElement("section");
		sec.className = "page-view";
		var art = document.createElement("article");
		sec.appendChild(art);
		pageArticle.appendChild(sec);
		core.UI.resize();
		this.scrollTo(this.getPages());
	}
	this.removePage = function removePage(p) {
		if($$(".page-view").length >= p) {
			var pv = $$(".page-view")[p - 1];
			pv.parentNode.removeChild(pv);
			core.UI.resize();
			this.scrollTo(p - 1);
		}
	}
	this.scrollTo = function scrollTo(p) {
		if(p < $$(".page-view").length && p > 0)
			$$(".page-viewpoint")[1].scrollTop = $$(".page-view")[p - 1].offsetTop - 5;
	}
}