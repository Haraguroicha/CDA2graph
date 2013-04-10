cda2g.Files = new function Files() {
	var files = {};
	this.__defineGetter__("files", function() {return files;});
	this.isFiles = function isFiles(e) {
		var ff = false;
		for(var k in e.dataTransfer.types) {
			var f = e.dataTransfer.types[k];
			if(f == "Files") ff = true;
		}
		return ff;
	}
	this.importFiles = function importFiles(e) {
		if(e.dataTransfer.files.length > 0) {
			cda2g.Pages.clearView();
			cda2g.Pages.addPage();
			var fss = e.dataTransfer.files;
			files = { "./size": 0 };
			for(var k in fss) {
				var fs = fss[k];
				if(typeof(fs)=="object") {
					reader = new FileReader();
					reader.onload = (
						function (obj, fs) {
							return function (e) {
								var f = obj[fs.name];
								if(f == undefined) f = {};
								f.name = fs.name;
								f.data = e.target.result;
								f.date = fs.lastModifiedDate;
								f.size = e.total;
								f.isDoc = ((f.data.match(/<\?xml.+\?>\s+<ClinicalDocument.+>[\w\W\s]+<\/ClinicalDocument>\s?/)) ? true : false);
								f.xml = null;
								f.parser = cda2g.Files.CDAParser;
								try {
									f.xml = new DOMParser().parseFromString(f.data, "application/xml").documentElement;
								} catch(e) {
									f.isDoc = false;
								}
								f.xss = (f.xml.nextSibling != null) ? ((f.xml.nextSibling.nodeType == document.COMMENT_NODE) ? f.xml.nextSibling.textContent : null) : null;
								if(f.isDoc) {
									obj["./size"] += f.size;
									cda2g.logger.log(sprintf("ClinicalDocument loaded: `%s`(%s bytes)", f.name, f.size));
									obj[f.name] = f;
									obj[f.name].parser();
								} else {
									cda2g.logger.log(sprintf("loaded file: `%s`(%s bytes), but that is not valid ClinicalDocument.", f.name, f.size));
									$("<div title='" + _("mistypeCDA") + "'/>")
										.html(_("canNotReadCDA"))
										.dialog({
											width: 600,
											height: 250,
											modal: true,
											show: { effect: "drop", direction: "up" },
											hide: { effect: "drop", direction: "up" },
											open: function(event, ui) {},
											close: function(event,ui) {},
											buttons: [
												{
													text: _("retryCDA"),
													class: "btn btn-danger",
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
							};
						}(files, fs)
					);
					reader.readAsText(fs);
				}
			}
			files.__defineGetter__("size", function() {
				return this["./size"];
			});
		}
	}
	this.CDAParser = function CDAParser(data) {
		try {
			if(data == undefined) data = this.xml;
			if(typeof(data) == "string") data = new DOMParser().parseFromString(data, "application/xml").documentElement;
		} catch(e) {
			cda2g.logger.log(sprintf("Can not load or can not read data to parse CDA data."));
			return null;
		}
		var doc = $(data);
		var cda_header = $(doc.find("ClinicalDocument>*:not(ClinicalDocument>component)"));
		var cda_body = $(doc.find("ClinicalDocument>component"));
		var CDAcode = $(cda_header.filter("code")[0]);
		var hospitalOID = $(cda_header.find("recordTarget>patientRole>id")[0]);
		var components = cda_body.find("structuredBody>component");
		cda2g.logger.log(sprintf("CDA data parsed. DOC_CODE='%s', HOS_ID='%s', components=%s", CDAcode.attr("code"), hospitalOID.attr("root"), components.length));
		var xmlString = "";
		if (window.ActiveXObject){
			xmlString = cda_header.xml;
		} else {
			var oSerializer = new XMLSerializer();
			for(var i = 0; i < cda_header.length; i++) {
				xmlString += ((xmlString.length > 0) ? "\n" : "") + oSerializer.serializeToString(cda_header[i]);
			}
		}
		//$('cda2g[is="cda-header"]').html(xmlString);
		cda2g.Pages.appendHTML($('<cda2g is="cda-header"/>').append(xmlString).wrapAll('<div/>').parent().html());
	}
}