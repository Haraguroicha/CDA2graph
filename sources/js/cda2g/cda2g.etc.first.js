function sprintf(format, etc) {
	var arg = arguments;
	var i = 1;
	return format.replace(/%((%)|s)/g, function (m) { return m[2] || arg[i++] });
}