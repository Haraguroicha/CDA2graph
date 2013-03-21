cda2g.logger = new function logger() {
	this.getMsg = function getMsg(msg, printStackTrace) {
		var date = new cda2g.Date();
		var st = stackTrace();
		return [sprintf("** logger[%s]:\t%s", date, msg), sprintf("\t\t\t\t\t\t\t%s%s", st.splice(3).join("\n\t\t\t\t\t\t\t\t"), (printStackTrace) ? "\n\t" + st.join("\n\t") : "")];
	}
	this.log = function log(msg, printStackTrace) {
		var logMsg = this.getMsg(msg, printStackTrace);
		logMsg[1] = logMsg[1].replace(/\n\t\t\t\t\t\t\t\t/g, "\n\t\t\t\t\t\t\t");
		console.groupCollapsed(logMsg[0]);
		console.log(logMsg[1]);
		console.groupEnd();
	}
	this.warn = function warn(msg, printStackTrace) {
		console.warn(this.getMsg(msg, printStackTrace).join("\n\t\t\t\t\t\t\t\t"));
	}
	this.error = function error(msg, printStackTrace) {
		console.error(this.getMsg(msg, printStackTrace).join("\n\t\t\t\t\t\t\t\t"));
	}
};