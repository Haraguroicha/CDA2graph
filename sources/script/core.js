var core = new function _core() {
	this.init = function init() {
		this.UI.setUI();
		$("pageNum").innerText=this.getPageNumber();
		window.addEventListener("scroll", function (e) {
			window.scrollTo(0, 0);
		}, false);
		window.addEventListener("resize", function (e) {
			this.core.UI.setUI();
		}, false);
		document.addEventListener("mousewheel", function (e) {
			$("pageNum").innerText=this.core.getPageNumber();
		}, false);
		document.addEventListener("scroll", function (e) {
			$("pageNum").innerText=this.core.getPageNumber();
		}, true);
		
		this.setDropArea($$(".page-wrapper")[0], $("fileImporter"));
		this.UI.resize();
	}
	this.getPageNumber = function getPageNumber() {
		return Math.floor(1 + $$(".page-viewpoint")[1].scrollTop / ($("baseView").offsetHeight + 17)) + " of " + $$(".page-view").length;
	}
	this.setTitle = function setTitle(n, parent) {
		n.enumerateCall(function(il) { il.getParent(parent).title = il.innerText; });
	}
	this.addEventListener = function addEventListener(n, evn, fn, parent) {
		n.enumerateCall(function(il) { il.getParent(parent).addEventListener(evn, fn); });
	}
	this.removeEventListener = function removeEventListener(n, evn, fn, parent) {
		n.enumerateCall(function(il) { il.getParent(parent).removeEventListener(evn, fn); });
	}
	this.setActive = function setActive(n, obj, parent) {
		var cssClass = "selectedItem";
		n.enumerateCall(function(il) { il.getParent(parent).classList.remove(cssClass); });
		obj.getParent(parent).classList.add(cssClass);
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
			if(e.type == "dragover" && core.Files.isFiles(e) && !(e.pageY < dpb.offsetHeight)) {
				dpa.classList.add("DragDropArea");
				this.classList.add("NonDragDropArea");
			} else {
				dpa.classList.remove("DragDropArea");
				this.classList.remove("NonDragDropArea");
			}
		}
		var dpaf = function dpaDragHover(e) {
			e.dataTransfer.dropEffect = "link";
			if(e.type == "dragover" && core.Files.isFiles(e)) {
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
				core.Files.importFiles(e);
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
}