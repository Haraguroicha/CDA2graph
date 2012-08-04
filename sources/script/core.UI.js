core.UI = new function _UI() {
	this.resize = function resize() {
		var evt = document.createEvent('UIEvents');
		evt.initUIEvent('resize', true, false,window,0);
		window.dispatchEvent(evt);
		core.logger.log("calling UIEvents of resize");
		delete evt;
	}
}