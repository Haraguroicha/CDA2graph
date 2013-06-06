cda2g.UI = new function _UI() {
	var dropping = false;
	this.__defineGetter__("dropping", function() {return dropping;});
	this.__defineSetter__("dropping", function(v) {
		dropping = v;
		if(dropping)
			$("#fileImporter [data-l10n-id]").html(_("dragNdrop"));
		else
			$("#fileImporter [data-l10n-id]").html(_("dragNNdrop"));
		var importer = $('#fileImporter');
		if(importer.hasClass('DragDropDisabledArea') && v) {
			importer.removeClass('DragDropDisabledArea');
			importer.addClass('DragDropArea');
		}
		if(importer.hasClass('DragDropArea') && !v) {
			importer.removeClass('DragDropArea');
			importer.addClass('DragDropDisabledArea');
		}
	});
	this.setUI = function setUI() {
		document.title = _("title");
		$(".page-viewpoint")[0].style.height = window.innerHeight - $("#menubox")[0].offsetHeight - $("section.page-wrapper > footer")[0].offsetHeight + "px";
		$(".page-viewpoint")[0].style.top = $("#menubox")[0].offsetHeight + "px";
		$("pageNum").css("visibility", "");
	}
	this.resize = function resize() {
		cda2g.logger.log("Calling UIEvents for window.resize and document.scroll");
		//Resize
		evt = document.createEvent('UIEvents');
		evt.initUIEvent('resize', true, false, window, 0);
		window.dispatchEvent(evt);
		//Scroll
		evt = document.createEvent('UIEvents');
		evt.initUIEvent('scroll', true, false, document, 0);
		document.dispatchEvent(evt);
		delete evt;
	}
	this.refreshPageNumber = function refreshPageNumber() {
		var page = cda2g.Pages.getPageNumber();
		var pageData = sprintf("<first class='l10n'>%s</first><middle class='l10n'>%s</middle><last class='l10n'>%s</last><now>%s</now><total>%s</total>",
			_("core_pageNum_firstContent"), _("core_pageNum_middleContent"), _("core_pageNum_lastContent"),
			page[0], page[1]
		).replace(/'/g, '"');
		var pdNow = $("pageNum").find('now').html();
		var pdTotal = $("pageNum").find('total').html();
		pdNow = (pdNow == undefined) ? 0 : parseInt(pdNow);
		pdTotal = (pdTotal == undefined) ? 0 : parseInt(pdTotal);
		if(pdTotal != page[1])
			$('pageTotal').html(page[1]);
		if(pdNow != page[0] || pdTotal != page[1]) {
			$("pageNum").html(pageData);
			if(!cda2g.onCoreEvent)
				history.pushState({type: "page", data: page}, document.title, "./?page=" + page[0]);
			cda2g.logger.log(sprintf("Scrolled to Page %s of %s", page[0], page[1]));
		}
		return pageData;
	}
	this.refreshPageNumbers = function refreshPageNumbers() {
		var pagesNumber = cda2g.Pages.getPageNumber();
		for(var p = 1; p <= pagesNumber[1]; p++) {
			var page = cda2g.Pages.getPage(p);
			page.pageNum = p;
			$(page).parent('section.page-view').find('footer.outside > thispage').html(p);
		}
	}
	this.activateDrop = function activeteDrop() {
		return (this.dropping = true);
	}
	this.deactivateDrop = function deactiveteDrop() {
		return (this.dropping = false);
	}
	this.setDropArea = function setDropArea(dpb, dpa) {
		if(dpb == undefined)
			dpb = $(".page-wrapper")[0];
		if(dpa == undefined)
			dpa = $("#fileImporter")[0];
		this.dropping = this.dropping;

		var wResize = function wResize(e) {
			dpa.style.width = dpb.offsetWidth - 10 + "px";
			dpa.style.height = window.innerHeight - dpb.offsetHeight - 10 + "px";
		}
		var sp = function dpsp(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
		var dpaf = function dpaDragHover(e) {
			e.originalEvent.dataTransfer.dropEffect = (e.ctrlKey && e.altKey && !e.shiftKey) ? "copy" : (!e.ctrlKey && !e.altKey && e.shiftKey) ? "move" : "link";
			if(e.type == "dragover" && cda2g.Files.isFiles(e.originalEvent)) {
				if(!cda2g.UI.dropping)
					this.classList.add("DragDropDisabledArea");
				else
					this.classList.add("DragDropArea");
				dpb.classList.add("NonDragDropArea");
			} else {
				this.classList.remove("DragDropDisabledArea");
				this.classList.remove("DragDropArea");
				dpb.classList.remove("NonDragDropArea");
			}
		}
		var dpbf = function dpbDragHover(e) {
			e.originalEvent.dataTransfer.dropEffect = "none";
			if(e.type == "dragover" && cda2g.Files.isFiles(e.originalEvent) && !(e.pageY < dpb.offsetHeight)) {
				if(!cda2g.UI.dropping)
					dpa.classList.add("DragDropDisabledArea");
				else
					dpa.classList.add("DragDropArea");
				this.classList.add("NonDragDropArea");
			} else {
				dpa.classList.remove("DragDropDisabledArea");
				dpa.classList.remove("DragDropArea");
				this.classList.remove("NonDragDropArea");
			}
		}
		var dpDrop = function dpDrop(e) {
			e.preventDefault();
			e.stopPropagation();
			if(!this.classList.contains("NonDragDropArea") && cda2g.UI.dropping) {
				cda2g.Files.importFiles(e.originalEvent);
			}
			dpa.classList.remove("DragDropArea");
			dpb.classList.remove("NonDragDropArea");
			dpa.classList.remove("DragDropDisabledArea");
			dpb.classList.remove("DragDropDisabledArea");
			return false;
		}
		$(window).on("resize", wResize);
		$(window).on("dragenter dragleave dragover drop", sp);
		
		$(dpa).on("dragenter", sp);
		$(dpa).on("dragleave", sp);
		$(dpa).on("dragleave", dpaf);
		$(dpa).on("dragover", sp);
		$(dpa).on("dragover", dpaf);
		$(dpa).on("drop", dpDrop);
		
		$(dpb).on("dragenter", sp);
		$(dpb).on("dragleave", sp);
		$(dpb).on("dragover", sp);
		$(dpb).on("dragover", dpbf);
		$(dpb).on("drop", dpDrop);
	}
	this.changeLanguage = function changeLanguage(lang) {
		if(lang == undefined || lang == "") lang = navigator.language;
		if(document.webL10n) {
			cda2g.logger.log(sprintf("Change language from %s to %s", document.webL10n.getLanguage(), lang));
			document.webL10n.setLanguage(lang);
			setTimeout(function() {
				while(document.webL10n.getReadyState() != "complete"){	};
				setTimeout(function() {
					cda2g.UI.setUI();
					cda2g.UI.resize();
					cda2g.logger.log(sprintf("Language changed to %s", document.webL10n.getLanguage()));
				}, 100);
			}, 100);
			var cjk = lang.split("-")[0];
			var fontFamily = "'cdaFont'" + ((cjk == "zh" || cjk == "ko" || cjk == "ja") ? ", 'cdaFont-" + cjk + "'" : "") + ', "Helvetica Neue", Helvetica, Arial, sans-serif';
			$("body > *").css("font-family", fontFamily);
			cda2g.logger.log(sprintf("Change font to `%s` by language: %s", fontFamily, lang));
		}
	}
}