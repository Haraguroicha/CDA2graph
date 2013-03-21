cda2g.Date = function _Date() {
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var date = d.getDate();
	var hours = d.getHours();
	var minutes = d.getMinutes();
	var seconds = d.getSeconds();
	this.toString = function toString() {
		month = (month<10?"0":"") + month;
		date = (date<10?"0":"") + date;
		hours = (hours<10?"0":"") + hours;
		minutes = (minutes<10?"0":"") + minutes;
		seconds = (seconds<10?"0":"") + seconds;
		return sprintf("%s/%s/%s %s:%s:%s", year, month, date, hours, minutes, seconds);
	}
};