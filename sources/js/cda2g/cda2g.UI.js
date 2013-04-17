cda2g.UI = new function _UI() {
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
			var fontFamily = "'cdaFont'" + ((cjk == "zh" || cjk == "ko" || cjk == "ja") ? ", 'cdaFont-" + cjk + "'" : "") + ", sans-serif";
			$("body > *").css("font-family", fontFamily);
			cda2g.logger.log(sprintf("Change font to `%s` by language: %s", fontFamily, lang));
		}
	}
	this.showEditor = function showEditor() {
		return CKEDITOR.replace($('editor#editor')[0]);
	}
	this.closeEditor = function closeEditor() {
		return CKEDITOR.instances.editor.destroy();
	}
}