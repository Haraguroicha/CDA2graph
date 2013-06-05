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
		
		this.UI.setDropArea();
		this.UI.resize();
		window.__exported_components_polyfill_scope__.run($('pageNum'), 'DOMContentLoaded');
		$('pageNum').trigger('DOMContentLoaded');
		window.__exported_components_polyfill_scope__.run($('version'), 'DOMContentLoaded');
		$('version').trigger('DOMContentLoaded');
		window.__exported_components_polyfill_scope__.run($('article.pageBox'), 'ComponentAppended');
		$('article.pageBox').on('ComponentAppended', function(){$('article.pageBox').trigger('ContentAppeded');});
		$('article.pageBox').on('ContentAppeded', function(){setTimeout(function(){cda2g.Pages.contentAppened();}, 250);});
		$(document).on('ComponentAppended', function(){setTimeout(function(){cda2g.Files.parseCDA();}, 10);});
		$(document).on('DOMSubtreeModified', function(e) {
			$(e.target).xpath('./*[@data-l10n-id]').each(function() {
				var self = $(this);
				var l10n = self.attr('data-l10n-id');
				if(!!l10n)
					self.html(_(l10n));
			});
		});
		setTimeout(function(){cda2g.UI.activateDrop();}, 1000);
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