core.Pages = new function Pages() {
	var pageTester = document.createElement("div");
	pageTester.id = "pageTester";
	var pageArticle = _$x("//section[@class='page-viewpoint']/article")[0];
	this.getPageNumber = function getPageNumber() {
		return Math.floor(1 + _$$(".page-viewpoint")[1].scrollTop / (_$("baseView").offsetHeight + 17)) + " of " + _$$(".page-view").length;
	}
	this.getPage = function getPage(page) {
		if(typeof(page) == "number")
			return _$$(".page-view")[page - 1].getElementsByTagName("article")[0];
		return undefined;
	}
	this.getPages = function getPages() {
		return _$$(".page-view").length;
	}
	this.getAvailableHeight = function getAvailableHeight(page) {
		page = this.get(page);
		page.appendChild(pageTester);
		var pt = _$("pageTester")
		var availHeight = pt.parentNode.offsetHeight - pt.offsetTop + pt.parentNode.offsetTop;
		pt.parentNode.removeChild(pt);
		return availHeight;
	}
	this.addPage = function addPage() {
		var pageNum = this.getPages() + 1;
		var sec = document.createElement("section");
		sec.className = "page-view";
		var art = document.createElement("article");
		sec.appendChild(art);
		art.pageNum = pageNum;
		art.addEventListener("pageInit", function(e) {
			this.scrollTop = this.defaultScrollTop || 0;
			core.logger.log(sprintf("page #%s has raised pageInit event, scrollTop=%s", this.pageNum, this.scrollTop));
		})
		art.appendHTML = function(html) {core.Pages.appendHTML(this.pageNum, html);}
		$(art).scroll(function(event){ this.scrollTop = this.defaultScrollTop || 0; });
		pageArticle.appendChild(sec);
		core.UI.resize();
		//this.scrollTo(this.getPages());
		return this.getPage(pageNum);
	}
	this.removePage = function removePage(p) {
		if(_$$(".page-view").length >= p) {
			var pv = _$$(".page-view")[p - 1];
			pv.parentNode.removeChild(pv);
			core.UI.resize();
			this.scrollTo(p - 1);
		}
	}
	this.scrollTo = function scrollTo(p) {
		if(p < _$$(".page-view").length && p > 0)
			_$$(".page-viewpoint")[1].scrollTop = _$$(".page-view")[p - 1].offsetTop - 5;
	}
	this.appendHTML = function appendHTML(page, html) {
		page = this.getPage(page);
		if(typeof(html)=="object")
			page.appendChild(html);
		if(typeof(html)=="string")
			page.innerHTML += html;
	}
	this.contentFrom = function contentFrom(src) {
		_$("baseView").innerHTML = src.innerHTML;
	}
	this.init = function init() {
		var pageInitEvt = new CustomEvent("pageInit", {});
		for(var p = 1; p <= this.getPages(); p++) {
			this.getPage(p).dispatchEvent(pageInitEvt);
		}
	}
}