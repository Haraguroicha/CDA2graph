$.fn.serializeToString = function serializeToString() {
	var xmlString = [];
	var oSerializer = new XMLSerializer();
	this.each(function(){xmlString.push(oSerializer.serializeToString(this));});
	return xmlString.join('\n');
}