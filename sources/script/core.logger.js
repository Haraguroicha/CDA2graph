core.logger = new function logger() {
	this.getMsg = function getMsg(msg, printStackTrace) {
		var date = new core.Date();
		var st = stackTrace();
		return sprintf("** logger[%s]:\t%s\n\t\t\t\t\t\t\t\t%s%s", date, msg, st[2].replace(" ", "() "), (printStackTrace) ? "\n\t" + st.join("\n\t") : "");
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