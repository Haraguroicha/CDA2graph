core.UI = new function _UI() {
	this.setUI = function setUI() {
		_$$(".page-viewpoint")[0].style.height = window.innerHeight - _$("menubox").offsetHeight + "px";
		_$$(".page-viewpoint")[0].style.top = _$("menubox").offsetHeight + "px";
		_$("pageNum").style.visibility = "";
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
}