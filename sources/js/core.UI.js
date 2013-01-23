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
		}
	}
}