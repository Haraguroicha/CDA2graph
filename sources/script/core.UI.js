core.UI = new function _UI() {
	this.setUI = function setUI() {
		_$$(".page-viewpoint")[0].style.height = window.innerHeight - _$("menubox").offsetHeight + "px";
		_$$(".page-viewpoint")[0].style.top = _$("menubox").offsetHeight + "px";
	}
	this.resize = function resize() {
		var evt = document.createEvent('UIEvents');
		evt.initUIEvent('resize', true, false, window, 0);
		window.dispatchEvent(evt);
		core.logger.log("calling UIEvents of resize");
		var evt = document.createEvent('UIEvents');
		evt.initUIEvent('scroll', true, false, document, 0);
		document.dispatchEvent(evt);
		core.logger.log("calling UIEvents of scroll");
		delete evt;
	}
}