cda2g.Pages = new function Pages() {
	this.cacheHTML = [];
	var lineHeight = -1;
	var pageTester = document.createElement("div");
	pageTester.id = "pageTester";
	var pageArticle = $("section[class='page-viewpoint'] > article")[0];
	this.getPageNumber = function getPageNumber() {
		return [Math.floor(1 + $(".page-viewpoint")[1].scrollTop / ($("#baseView")[0].offsetHeight + 17)), $(".page-view").length];
	}
	this.getPage = function getPage(page) {
		if(typeof(page) == "number")
			return $(".page-view")[page - 1].getElementsByTagName("article")[0];
		return undefined;
	}
	this.getPages = function getPages() {
		return $(".page-view").length;
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
		art.pageNum = pageNum;
		art.defaultScrollTop = defaultScrollTop;
		art.appendHTML = function(html, offsetTop) { return cda2g.Pages.appendHTML(this.pageNum, html, offsetTop || this.defaultScrollTop); }
		art.getHeader = function(title) {return $(this).parent().find('header>title').html();}
		art.setHeader = function(title) {$(this).parent().find('header>title').html(title); return this;}
		art.getFooter = function(title) {return $(this).parent().find('footer>title').html();}
		art.setFooter = function(title) {$(this).parent().find('footer>title').html(title); return this;}
		$(art).scroll(function(event){ this.scrollTop = 0; });
		var header = (this.getPages() > 0) ? this.getLastPage().getHeader() : "";
		var footer = (this.getPages() > 0) ? this.getLastPage().getFooter() : "";
		var headerTitle = $('<header class="outside"><title class="outside"/></header>');
		var footerTitle = $('<footer class="outside"><title class="outside"/></footer>');
		if(header != "")
			headerTitle.find('title').html(header);
		if(footer != "")
			footerTitle.find('title').html(footer);
		headerTitle.appendTo(sec);
		sec.appendChild(art);
		footerTitle.appendTo(sec);
		$(sec).find('footer').html('&#35;<thispage>' + pageNum + '</thispage>/').append($('<pageTotal/>'));
		pageArticle.appendChild(sec);
		cda2g.UI.resize();
		return this.getPage(pageNum);
	}
	this.removePage = function removePage(p) {
		if($(".page-view").length >= p) {
			var pv = $(".page-view")[p - 1];
			pv.parentNode.removeChild(pv);
			cda2g.UI.resize();
			this.scrollTo(p - 1);
		}
		cda2g.UI.refreshPageNumbers();
	}
	this.clearView = function clearView() {
		$(".page-view").remove();
	}
	this.scrollTo = function scrollTo(p) {
		if(p < $(".page-view").length && p > 0)
			$(".page-viewpoint")[1].scrollTop = $(".page-view")[p - 1].offsetTop - 5;
	}
	this.getLineHeight = function getLineHeight() {
		if(lineHeight == -1) {
			this.addPage();
			this.appendHTML("test");
			this.appendHTML("test<br/>test");
			var l = this.getPage(this.getPages()).getElementsByTagName("section");
			var l1 = l[0].offsetHeight;
			var l2 = l[1].offsetHeight;
			lineHeight = l1 - (l2 - 2* l1);
			this.removePage(this.getPages());
		}
		return lineHeight;
	}
	this.getPageLines = function getPageLines() {
		return Math.floor(this.getPage(this.getPages()).offsetHeight / this.getLineHeight());
	}
	this.appendHTML = function appendHTML(page, html, offsetTop) {
		cda2g.UI.deactivateDrop();
		//If call this method directly by calling cda2g.Pages.appendHTML(html[, offset]);
		if(typeof(page) == "string" && (typeof(html) == "number" || typeof(html) == "undefined"))
			return this.getLastPage().appendHTML(page, html);
		if(this.cacheHTML.length == 0) this.cacheHTML.push(html);
		if(html != this.cacheHTML[0]) return this.cacheHTML.push(html);
		var lastPage = this.addContent(this.getPage(page), html, offsetTop);
		var prevWidgets = lastPage.getElementsByClassName("cda-widget");
		var prevLastWidget = prevWidgets[prevWidgets.length - 1];
		var prevPageScrollTop = prevLastWidget.offsetTop - lastPage.offsetTop;
		var lastWidgetPoint = prevLastWidget.scrollHeight + prevPageScrollTop;
		if(lastWidgetPoint > lastPage.offsetHeight) {
			cda2g.logger.log(sprintf("Object is too large, page #%s breaking to #%s.", page, page + 1, lastWidgetPoint, lastPage.offsetHeight));
			var nextScrollTop = -1 * (lastPage.offsetHeight - prevPageScrollTop - lastPage.scrollTop) + 1;
			return setTimeout(function(){cda2g.Pages.addPage(nextScrollTop).appendHTML(html);}, 10);
		}
		$('article.pageBox').trigger('ComponentAppended');
		cda2g.UI.activateDrop();
		return lastPage;
	}
	this.contentAppened = function contentAppened() {
		if(this.cacheHTML.length > 0) {
			this.cacheHTML = this.cacheHTML.slice(1);
			if(this.cacheHTML.length > 0)
				this.appendHTML(this.cacheHTML[0]);
		}
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