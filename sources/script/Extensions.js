Object.prototype.getParent = function getParent(p) {
	if(p == undefined) p = 0;
	var n = this;
	for(var i = p; i > 0; i--)
		n = n.parentNode;
	return n;
}
Object.prototype.enumerateCall = function enumerateCall(f) {
	for(var k in this) {
		var o = this[k];
		if(typeof(o) == "object")
			f(o);
	}
}