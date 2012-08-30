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
	this.getLastPage = function getLastPage() {
		return this.getPage(this.getPages());
	}
	this.getAvailableHeight = function getAvailableHeight(page) {
		page = this.get(page);
		page.appendChild(pageTester);
		var pt = _$("pageTester")
		var availHeight = pt.parentNode.offsetHeight - pt.offsetTop + pt.parentNode.offsetTop;
		pt.parentNode.removeChild(pt);
		return availHeight;
	}
	this.addPage = function addPage(defaultScrollTop) {
		var pageNum = this.getPages() + 1;
		var sec = document.createElement("section");
		sec.className = "page-view";
		var art = document.createElement("article");
		sec.appendChild(art);
		art.pageNum = pageNum;
		art.defaultScrollTop = defaultScrollTop;
		art.appendHTML = function(html, offsetTop) { return core.Pages.appendHTML(this.pageNum, html, offsetTop || this.defaultScrollTop); }
		$(art).scroll(function(event){ this.scrollTop = 0; });
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
	this.appendHTML = function appendHTML(page, html, offsetTop) {
		//If call this method directly by calling core.Pages.appendHTML(html[, offset]);
		if(typeof(page) == "string" && (typeof(html) == "number" || typeof(html) == "undefined"))
			return this.getLastPage().appendHTML(page, html);
		var lastPage = this.addContent(this.getPage(page), html, offsetTop);
		var prevWidgets = lastPage.getElementsByClassName("cda-widget");
		var prevLastWidget = prevWidgets[prevWidgets.length - 1];
		var prevPageScrollTop = prevLastWidget.offsetTop - lastPage.offsetTop;
		if(prevLastWidget.scrollHeight + prevPageScrollTop > lastPage.offsetHeight) {
			core.logger.log(sprintf("Object is too large, page #%s breaking to #%s.", page, page + 1));
			var nextScrollTop = -1 * (lastPage.offsetHeight - prevPageScrollTop - lastPage.scrollTop) + 1;
			return this.addPage(nextScrollTop).appendHTML(html);
		}
		return lastPage;
	}
	this.addContent = function addContent(page, html, offsetTop) {
		var pack = this.packSection(html, offsetTop);
		if(pack != null)
			page.appendChild(pack);
		return page;
	}
	this.packSection = function packSection(obj, offsetTop) {
		function makeSection(html) {
			var sec = document.createElement("section");
			var art = document.createElement("article");
			art.innerHTML = html;
			sec.appendChild(art);
			sec.className = "cda-widget";
			sec.style.position = "relative";
			if(typeof(offsetTop) == "number") {
				sec.classList.add("cda-widget-shadow");
				sec.style.top = offsetTop + "px";
			}
			return sec;
		}
		var pack = null;
		if(typeof(obj) == "string")
			pack = makeSection(obj);
		if(typeof(obj) == "object")
			if(typeof(obj.innerHTML) == "string")
				pack = makeSection(obj.innerHTML);
		return pack;
	}
	this.contentFrom = function contentFrom(src) {
		_$("baseView").innerHTML = src.innerHTML;
	}
}