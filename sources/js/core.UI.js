core.UI = new function _UI() {
	this.setUI = function setUI() {
		document.title = _("title");
		_$$(".page-viewpoint")[0].style.height = window.innerHeight - _$("menubox").offsetHeight + "px";
		_$$(".page-viewpoint")[0].style.top = _$("menubox").offsetHeight + "px";
		$("pageNum").css("visibility", "");
	}
	this.resize = function resize() {
		core.logger.log("Calling UIEvents for window.resize and document.scroll");
		
		evt = document.createEvent('UIEvents');
		evt.initUIEvent('resize', true, false, window, 0);
		window.dispatchEvent(evt);

		evt = document.createEvent('UIEvents');
		evt.initUIEvent('scroll', true, false, document, 0);
		document.dispatchEvent(evt);
		
		delete evt;
	}
	this.refreshPageNumber = function refreshPageNumber() {
		var page = core.Pages.getPageNumber();
		var pageData = sprintf("<first class='l10n'>%s</first><middle class='l10n'>%s</middle><last class='l10n'>%s</last><now>%s</now><total>%s</total>",
			_("core_pageNum_firstContent"), _("core_pageNum_middleContent"), _("core_pageNum_lastContent"),
			page[0], page[1]
		).replace(/'/g, '"');
		if($("pageNum").html() != pageData) {
			$("pageNum").html(pageData);
			if(!core.onCoreEvent)
				history.pushState({type: "page", data: page}, document.title, "./?page=" + page[0]);
			core.logger.log(sprintf("Scrolled to Page %s of %s", page[0], page[1]));
		}
		return pageData;
	}
	this.updateX_UI = function updateX_UI() {
		var xui = "X-UI-Components";
		$("object[rel~='" + xui + "']").each(function (objIndex, objElement) {
			$(objElement.contentDocument.documentElement).find("element>template").each(function (tempIndex, tempElement) {
				var targetElement = $(tempElement).parent().attr("extends");
				core.logger.log(sprintf("Updating X-UI-Components: `%s`", targetElement));
				targetElement += ":not([rel~='" + xui + "'])";
				$(targetElement).each(function (shadowIndex, shadowElement) {
					$(shadowElement).attr("rel", xui)[0].webkitCreateShadowRoot().appendChild(tempElement.content);
				});
			});
		});
	}
	this.changeLanguage = function changeLanguage(lang) {
		if(lang == undefined || lang == "") lang = navigator.language;
		if(document.webL10n) {
			core.logger.log(sprintf("Change language from %s to %s", document.webL10n.getLanguage(), lang));
			document.webL10n.setLanguage(lang);
			setTimeout(function() {
				while(document.webL10n.getReadyState() != "complete"){	};
				setTimeout(function() {
					core.UI.setUI();
					core.UI.resize();
					core.logger.log(sprintf("Language changed to %s", document.webL10n.getLanguage()));
				}, 100);
			}, 100);
			var cjk = lang.split("-")[0];
			var fontFamily = "'cdaFont'" + ((cjk == "zh" || cjk == "ko" || cjk == "ja") ? ", 'cdaFont-" + cjk + "'" : "");
			$("body > *").css("font-family", fontFamily);
			core.logger.log(sprintf("Change font to `%s` by language: %s", fontFamily, lang));
		}
	}
}