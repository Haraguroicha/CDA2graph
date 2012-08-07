core.UI = new function _UI() {
	this.setUI = function setUI() {
		document.getElementsByClassName("page-viewpoint")[0].style.height = window.innerHeight - $("menubox").offsetHeight + "px";
		document.getElementsByClassName("page-viewpoint")[0].style.top = $("menubox").offsetHeight + "px";
	}
	this.resize = function resize() {
		var evt = document.createEvent('UIEvents');
		evt.initUIEvent('resize', true, false, window, 0);
		window.dispatchEvent(evt);
		core.logger.log("calling UIEvents of resize");
		delete evt;
	}
}