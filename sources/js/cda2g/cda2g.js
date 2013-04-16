var cda2g = new function _cda2g() {
	this.onCoreEvent = false;
	this.init = function init() {
		this.UI.setUI();
		window.addEventListener("scroll", function (e) {
			window.scrollTo(0, 0);
		}, false);
		window.addEventListener("resize", function (e) {
			this.cda2g.UI.setUI();
		}, false);
		document.addEventListener("mousewheel", function (e) {
			return cda2g.UI.refreshPageNumber();
		}, false);
		document.addEventListener("scroll", function (e) {
			return cda2g.UI.refreshPageNumber();
		}, true);
		$("<div id='textPaddingWrapper'></div>").text("textPaddingWrapper_1234567890_~!@#$%^&*()_+?").appendTo($(document));
		
		this.setDropArea($(".page-wrapper")[0], $("#fileImporter")[0]);
		this.UI.resize();
		window.__exported_components_polyfill_scope__.run($('pageNum'), 'DOMContentLoaded');
		$('pageNum').trigger('DOMContentLoaded');
		window.__exported_components_polyfill_scope__.run($('version'), 'DOMContentLoaded');
		$('version').trigger('DOMContentLoaded');
		window.__exported_components_polyfill_scope__.run($('article.pageBox'), 'ComponentAppended');
		$('article.pageBox').on('ComponentAppended', function(){$('article.pageBox').trigger('ContentAppeded');});
		$('article.pageBox').on('ContentAppeded', function(){setTimeout(function(){cda2g.Pages.contentAppened();}, 250);});
		$(document).on('ComponentAppended', function(){setTimeout(function(){cda2g.Files.parseCDA();}, 10);});
	}
	this.setTitle = function setTitle(n, parent) {
		this.enumerateCall(n, function(il) { cda2g.getParent(il, parent).title = il.innerText; });
	}
	this.addEventListener = function addEventListener(n, evn, fn, parent) {
		this.enumerateCall(n, function(il) { cda2g.getParent(il, parent).addEventListener(evn, fn); });
	}
	this.removeEventListener = function removeEventListener(n, evn, fn, parent) {
		this.enumerateCall(n, function(il) { cda2g.getParent(il, parent).removeEventListener(evn, fn); });
	}
	this.setActive = function setActive(obj, parent) {
		var cssClass = "selectedItem";
		this.enumerateCall(_$$("." + cssClass), function(il) { cda2g.getParent(il, parent).classList.remove(cssClass); });
		cda2g.getParent(obj, parent).classList.add(cssClass);
	}
	this.setDropArea = function setDropArea(dpb, dpa) {
		window.addEventListener("resize", function (e) {
			dpa.style.width = dpb.offsetWidth - 10 + "px";
			dpa.style.height = window.innerHeight - dpb.offsetHeight - 10 + "px";
		}, false);
		var sp = function dpsp(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
		var dpbf = function dpbDragHover(e) {
			e.dataTransfer.dropEffect = "none";
			if(e.type == "dragover" && cda2g.Files.isFiles(e) && !(e.pageY < dpb.offsetHeight)) {
				dpa.classList.add("DragDropArea");
				this.classList.add("NonDragDropArea");
			} else {
				dpa.classList.remove("DragDropArea");
				this.classList.remove("NonDragDropArea");
			}
		}
		var dpaf = function dpaDragHover(e) {
			e.dataTransfer.dropEffect = "link";
			if(e.type == "dragover" && cda2g.Files.isFiles(e)) {
				this.classList.add("DragDropArea");
				dpb.classList.add("NonDragDropArea");
			} else {
				this.classList.remove("DragDropArea");
				dpb.classList.remove("NonDragDropArea");
			}
		}
		var dpDrop = function dpDrop(e) {
			e.preventDefault();
			e.stopPropagation();
			if(!this.classList.contains("NonDragDropArea")) {
				cda2g.Files.importFiles(e);
			}
			dpa.classList.remove("DragDropArea");
			dpb.classList.remove("NonDragDropArea");
			return false;
		}
		dpb.addEventListener("dragenter", sp);
		dpb.addEventListener("dragover", sp);
		dpb.addEventListener("dragleave", sp);
		dpb.addEventListener("dragover", dpbf);
		dpb.addEventListener("drop", dpDrop);
		
		dpa.addEventListener("dragenter", sp);
		dpa.addEventListener("dragover", sp);
		dpa.addEventListener("dragleave", sp);
		dpa.addEventListener("dragover", dpaf);
		dpa.addEventListener("dragleave", dpaf);
		dpa.addEventListener("drop", dpDrop, false);
	}
	this.getParent = function getParent(t, p) {
		if(p == undefined) p = 0;
		var n = t;
		for(var i = p; i > 0; i--)
			n = n.parentNode;
		return n;
	}
	this.enumerateCall = function enumerateCall(t, f) {
		for(var k in t) {
			var o = t[k];
			if(typeof(o) == "object")
				f(o);
		}
	}
}