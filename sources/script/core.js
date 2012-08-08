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
		this.setTitle("iconLabel", true);
		this.addEventListener("iconLabel", "click", function() {core.setActive("iconLabel", this);}, true);
		this.setDropArea(document.getElementsByClassName("page-wrapper")[0], $("fileImporter"));
		this.UI.resize();
	}
	this.getPageNumber = function getPageNumber() {
		return Math.floor(1 + document.getElementsByClassName("page-viewpoint")[1].scrollTop / ($("baseView").offsetHeight + 17)) + " of " + document.getElementsByClassName("page-view").length;
	}
	this.getEBCN = function getEBCN(cn, fn) {
		var ls = document.getElementsByClassName(cn);
		for(var k in ls) {
			var il = ls[k];
			if(typeof(il)=="object")
				fn(il);
		}
	}
	this.setTitle = function setTitle(cn, parent) {
		this.getEBCN(cn, function(il) {
				if(parent)
					il.parentElement.title = il.innerText;
				else
					il.title = il.innerText;
		});
	}
	this.addEventListener = function addEventListener(cn, evn, fn, parent) {
		this.getEBCN(cn, function(il) {
			if(parent)
				il.parentElement.addEventListener(evn, fn);
			else
				il.addEventListener(evn, fn);
		});
	}
	this.setActive = function setActive(cn, obj, parent) {
		var cssClass = "selectedItem";
		this.getEBCN(cssClass, function(il) {
				il.className = il.classList.remove(cssClass);
		});
		if(parent)
			obj.parentElement.classList.add(cssClass);
		else
			obj.classList.add(cssClass);
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
			var isFiles = false;
			for(var k in e.dataTransfer.types) {
				var f = e.dataTransfer.types[k];
				if(f == "Files") isFiles = true;
			}
			if(e.type == "dragover" && isFiles && !(e.pageY < dpb.offsetHeight)) {
				dpa.classList.add("DragDropArea");
				this.classList.add("NonDragDropArea");
			} else {
				dpa.classList.remove("DragDropArea");
				this.classList.remove("NonDragDropArea");
			}
		}
		var dpaf = function dpaDragHover(e) {
			e.dataTransfer.dropEffect = "link";
			var isFiles = false;
			for(var k in e.dataTransfer.types) {
				var f = e.dataTransfer.types[k];
				if(f == "Files") isFiles = true;
			}
			if(e.type == "dragover" && isFiles) {
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
				if(e.dataTransfer.files.length > 0) {
					var fss = e.dataTransfer.files;
					files = { "./size": 0 };
					for(var k in fss) {
						var fs = fss[k];
						if(typeof(fs)=="object") {
							reader = new FileReader();
							reader.onload = (
								function (obj, fs) {
									return function (e) {
										obj[fs.name] = {};
										var f = obj[fs.name];
										f.name = fs.name;
										f.data = e.target.result;
										f.date = fs.lastModifiedDate;
										f.size = e.total;
										obj["./size"] += f.size;
										core.logger.log(sprintf("loaded file: `%s`(%s bytes)", f.name, f.size));
									};
								}(files, fs)
							);
							reader.readAsText(fs);
						}
					}
					files.__defineGetter__("size", function() {
						return this["./size"];
					});
				}
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
	var files = {};
	this.__defineGetter__("files", function() {return files;});
}