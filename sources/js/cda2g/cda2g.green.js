cda2g.green = new function green() {
	this.createGreenNode = function createGreenNode(parent, path, target, value) {
		var greenElement = $.zc(target).xpath('//*').last().html(value);
		if(greenElement.parents().length != 0)
			greenElement = greenElement.parents().last();
		var pg = parent.xpath("//processable/green");
		if(pg.length == 0) {
			var ipe = parent.filter('div._XCD_Component');
			if(ipe.length == 0)
				cda2g.logger.log("Error to generate green data.");
		} else {
			if(!!path && path.length > 0) {
				pg = path;
			}
			while(true) {
				if(pg.find(greenElement[0].tagName).length > 0) {
					pg = pg.find(greenElement[0].tagName).last();
					greenElement = greenElement.children();
				} else {
					if(pg.length > 0)
						pg.append(greenElement);
					else
						console.log("Error when append green data.", pg, greenElement, parent, path, target, value)
					break;
				}
			}
		}
	}
	this.toSerializeXML = function toSerializeXML(element) {
		var xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
		var green = $(element).clone();
		var root = green.attr("root");
		green.removeAttr("root");
		var filename = green.attr("filename");
		green.removeAttr("filename");
		var xml = new XMLSerializer().serializeToString(green[0])
			.replace(/ xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, "")
			.replace(/<(\/)?(green)>/g, "<$1" + ((!!root) ? root : "$2") + ">");
		return { "xml": vkbeautify.xml(xmlHeader + xml, '  '), "filename": filename };
	}
	this.toGreenSerializeFile = function toGreenSerializeFile() {
		var xmlData = "";
		$("processable>green").each(function() {
			var xmlObj = cda2g.green.toSerializeXML(this);
			xmlData += (xmlData.length > 0 ? "\n" : "") + xmlObj.xml;
			cda2g.Files.redirectDownload(xmlObj.filename, xmlObj.xml);
		});
		return xmlData;
	}
}