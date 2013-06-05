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
		var root = green.attr('root');
		green.removeAttr('root');
		var filename = green.attr('filename');
		green.removeAttr('filename');
		var name = $(element).parent().parent().find('info').attr('filename');
		var xml = new XMLSerializer().serializeToString(green[0])
			.replace(/ xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, "")
			.replace(/<(\/)?(green)>/g, "<$1" + ((!!root) ? root : "$2") + ">");
		return { "xml": vkbeautify.xml(xmlHeader + xml, '  '), "name": name, "filename": filename };
	}
	this.toGreenSerializeFile = function toGreenSerializeFile(dontInvoke) {
		var xmlData = "";
		$("processable>green").each(function() {
			var xmlObj = cda2g.green.toSerializeXML(this);
			xmlData += (xmlData.length > 0 ? "\n" : "") + xmlObj.xml;
			cda2g.Files.redirectDownload(xmlObj.filename, xmlObj.xml, xmlObj.name, dontInvoke);
		});
		return xmlData;
	}
	this.showDownloadLink = function showDownloadLink() {
		var linksObj = {};
		var links = [];
		$("#downloadURI").clone().find('a').each(function() {
			linksObj[$(this).html().trim()] = $(this).wrapAll('<li/>').parent().wrapAll('<ul/>').parent();
		});
		for(var k in linksObj) {
			var obj = linksObj[k];
			if(typeof(obj) == "object")
				links.push(obj);
		}
		$("<div title='" + _("downloader") + "'/>")
			.html('')
			.append(links)
			.dialog({
				width: 625,
				height: 480,
				modal: true,
				show: { effect: "drop", direction: "up" },
				hide: { effect: "drop", direction: "up" },
				open: function(event, ui) {},
				close: function(event,ui) { $("#downloadURI>a").remove(); },
				buttons: [
					{
						text: _("btnClose"),
						class: "btn btn-success",
						click: function() {
							$(this).dialog('close');
						}
					}
				],
				closeOnEscape: true,
				draggable: false,
				resizable: false
			})
		;
	}
	this.requireConverting = function requireConverting(isNeed) {
		if(isNeed)
			$('#requireGreenCDA').dialog({
				width: 600,
				height: 400,
				modal: true,
				show: { effect: "drop", direction: "left" },
				hide: { effect: "drop", direction: "right" },
				open: function(event, ui) {
					$(".ui-dialog-titlebar-close").hide();
					$("#requireGreenCDATitle").attr("data-l10n-id", "requireGreenCDATitle");
					$("#ui-dialog-title-requireGreenCDA").attr("data-l10n-id", "requireGreenCDATitle").html(_("requireGreenCDATitle"));
				},
				close: function(event,ui) { $("#requireGreenCDAMessage").html(''); cda2g.UI.activateDrop(); },
				buttons: [
					{
						text: _("btnCancel"),
						class: "btn btn-inverse",
						click: function() {
							$(this).dialog('close');
						}
					},
					{
						text: _("btnProceed"),
						class: "btn btn-primary",
						click: function() {
							$(this).dialog('close');
							cda2g.green.toGreenSerializeFile(true);
							setTimeout(function(){ cda2g.green.showDownloadLink(); }, 1000);
						}
					}
				],
				closeOnEscape: false,
				draggable: false,
				resizable: false
			});
		else
			cda2g.UI.activateDrop();
	}
}