$.fn.serializeToString = function serializeToString() {
	var xmlString = [];
	var oSerializer = new XMLSerializer();
	this.each(function(){xmlString.push(oSerializer.serializeToString(this));});
	return xmlString.join('\n');
}
$.fn.findNS = function(namespace, find) {
	var prefix = "";
	if(!!namespace && !!find)
		prefix = namespace + "\\:"
	return this.find(prefix+find);
};
$.fn.filterNS = function(namespace, find) {
	var prefix = "";
	if(!!namespace && !!find)
		prefix = namespace + "\\:"
	return this.filter(prefix+find);
};
$.fn.findAndSelf = function(selector) { return this.find(selector).andSelf().filter(selector); }