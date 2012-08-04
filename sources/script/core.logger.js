core.logger = new function logger() {
	this.getMsg = function getMsg(msg, printStackTrace) {
		var date = new core.Date();
		return sprintf("** logger[%s]: %s%s", date, msg, (printStackTrace) ? "\n\t" + stackTrace().join("\n\t") : "");
	}
	this.log = function log(msg, printStackTrace) {
		console.log(this.getMsg(msg, printStackTrace));
	}
	this.warn = function warn(msg, printStackTrace) {
		console.warn(this.getMsg(msg, printStackTrace));
	}
	this.error = function error(msg, printStackTrace) {
		console.error(this.getMsg(msg, printStackTrace));
	}
};