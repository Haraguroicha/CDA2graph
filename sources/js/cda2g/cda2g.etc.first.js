function _$(n) { return document.getElementById(n); }
function _$$(s) { return document.querySelectorAll(s); }
function _$x(x,n,r) {
	if(typeof(n) == "undefined") n = document;
	if(typeof(r) == "undefined") r = null;
	var xd = document.evaluate(x, n, r, XPathResult.ANY_TYPE, null);
	var xpr = xd.iterateNext();
	var xr = [];
	while (xpr) {
		xr.push(xpr);
		xpr = xd.iterateNext();
	}
	return xr
}
function sprintf(format, etc) {
	var arg = arguments;
	var i = 1;
	return format.replace(/%((%)|s)/g, function (m) { return m[2] || arg[i++] });
}