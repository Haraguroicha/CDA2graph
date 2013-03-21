String.prototype.repeat = function repeat(n) {
	var r = "";
	for(var i = 0; i < n; i++)
		r += this;
	return r;
}