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
								f.xmlnsURI = "urn:hl7-org:v3";
								f.xmlnsPrefix = f.data.match(new RegExp(sprintf('xmlns(:([\\w]*))?="%s"', f.xmlnsURI)))[2];
								f.isDoc = ((f.data.match(/<\?xml[^?>]+\?>\s*(<\?xml-stylesheet .+\?>)?\s*<([\w]*:)?ClinicalDocument[^>]+>([\s\w\W]*)<\/([\w]*:)?ClinicalDocument>([\s\w\W]*)/)) ? true : false);
								f.xml = null;
								f.parser = cda2g.Files.CDAParser;
								try {
									f.xml = $.parseXML(f.data);
								} catch(e) {
									f.isDoc = false;
								}
								f.xss = (f.xml.nextSibling != null) ? ((f.xml.nextSibling.nodeType == document.COMMENT_NODE) ? f.xml.nextSibling.textContent : null) : null;
								if(f.isDoc) {
									obj["./size"] += f.size;
									cda2g.logger.log(sprintf("ClinicalDocument%s loaded: `%s`(%s bytes)", ((!!f.xmlns) ? sprintf("[xmlns:%s]", f.xmlns) : ""), f.name, f.size));
									obj[f.name] = f;
									f.parser();
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
			cda2g.Pages.clearView();
		}
	}
	this.CDAParser = function CDAParser() {
		if(!!!this.xml) return;
		var cdah = $($(sprintf('<cda2g is="cda-header" style="display: none;" xmlnsPrefix="%s" xmlnsURI="%s"/>', ((!!this.xmlnsPrefix) ? this.xmlnsPrefix : ""), ((!!this.xmlnsURI) ? this.xmlnsURI : ""))));
		var cdab = $($(sprintf('<cda2g is="cda-body" style="display: none;" xmlnsPrefix="%s" xmlnsURI="%s"/>', ((!!this.xmlnsPrefix) ? this.xmlnsPrefix : ""), ((!!this.xmlnsURI) ? this.xmlnsURI : ""))));
		var doc = $(this.xml);
		var cda_header = doc.xpath("*:ClinicalDocument/(* except self::*/*:component)");
		var cda_body = doc.xpath("*:ClinicalDocument/*:component");
		var CDAcode = cda_header.xpath("../*:code");
		var hospitalOID = cda_header.xpath("../*:recordTarget/*:patientRole/*:id");
		var components = cda_body.xpath("./*:structuredBody/*:component");
		cda2g.logger.log(sprintf("CDA data parsed. DOC_CODE='%s', HOS_ID='%s', components=%s", CDAcode.attr("code"), hospitalOID.attr("root"), components.length));
		cda_header.appendTo(cdah);
		cda_body.appendTo(cdab)
		cda2g.Pages.addPage();
		cda2g.Pages.appendHTML(cdah.wrapAll('<div/>').parent().html() + cdab.wrapAll('<div/>').parent().html());
	}
	this.selectorParse = function selectorParse(root, content) {
		var xmlns = $(content).attr("xmlnsName");
		var shadow = $(root.querySelectorAll('*'));
		selectors = shadow.find('selector');
		selectors.each(function(index, value) {
			var obj = $(this);
			var path = '*:' + obj.attr("path").split('/').join('/*:').replace(/\/\*:\.\./g, "/..");
			var attr = obj.attr('attr');
			var match_string = obj.attr("match");
			var format_string = obj.attr("format");
			var placeholder = obj.attr("placeholder");
			var type = obj.attr("type");
			var mode = obj.attr("mode");
			if(type == "observationMedia") {
				path += "/*:value";
				var val = $(content).xpath(path);
				if(val.length > 0) {
					ret = $('<span/>');
					if(mode == "image")
						val.each(function() {
							var info = cda2g.Files.getMediaInfo(mode, this);
							var base64 = $(this).text().trim();
							cda2g.logger.log(sprintf("Selecting path:'%s'%s observationMedia='%s' filename='%s'", path, ((!!attr) ? "@" + attr : ""), info.observationMedia, info.filename));
							var img = $('<img/>').attr('src', cda2g.Files.createBlob({
								"Content-Type": info.observationMedia,
								"encoding": "base64",
								"output": "DataURI",
								"content": base64,
								"filename": info.filename
							}));
							var a = cda2g.Files.createBlobDownload({
								"Content-Type": info.observationMedia,
								"encoding": "base64",
								"output": "blob",
								"content": base64,
								"filename": info.filename
							});
							img.appendTo(a);
							a.appendTo(ret);
						});
					if(mode == "binary")
						val.each(function() {
							var info = cda2g.Files.getMediaInfo(mode, this);
							var base64 = $(this).text().trim();
							cda2g.logger.log(sprintf("Selecting path:'%s'%s observationMedia='%s' filename='%s'", path, ((!!attr) ? "@" + attr : ""), info.observationMedia, info.filename));
							var a = cda2g.Files.createBlobDownload({
								"Content-Type": info.observationMedia,
								"encoding": "base64",
								"output": "blob",
								"content": base64,
								"filename": info.filename
							});
							a.text(info.filename);
							a.appendTo(ret);
						});
				} else {
					if(placeholder == undefined)
						obj.css('display', 'none');
					else
						val = placeholder;
				}
			} else {
				var val = $(content).xpath(path);
				var ret = "";
				if(val.length > 0) {
					if(attr != undefined)
						val = val.attr(attr);
					else
						val = val.text();
				} else{
					val = undefined;
				}
				if(val == undefined) {
					if(placeholder == undefined)
						obj.css('display', 'none');
					else
						val = placeholder;
				}
				if(val != undefined && match_string != undefined && format_string != undefined)
					ret = val.replace(new RegExp(match_string), format_string);
				else
					ret = val;
				if(val == undefined)
					val = "";
				if(ret == undefined)
					ret = "";
				cda2g.logger.log(sprintf("Selecting path:'%s'%s value='%s' => '%s'", path, ((!!attr) ? "@" + attr : ""), val, ret));
			}
			var data = obj.find('data');
			if(data.length != 0)
				data.html(ret);
			else
				obj.html(ret);
		});
		shadow.filter('div._XCD_Component').css('display', 'block');
		$(content).css('display', 'block');
	}
	this.getMediaInfo = function getMediaInfo(mode, content) {
		var observationMedia = undefined;
		var filename = undefined;
		if(mode == "image") {
			observationMedia = $(content).xpath('../*:id[@assigningAuthorityName]').attr('assigningAuthorityName');
			filename = $(content).xpath('../*:id[@extension and @root="FileName"]').attr('extension');
		}
		if(mode == "binary") {
			observationMedia = $(content).xpath('../*:id[@assigningAuthorityName]').attr('assigningAuthorityName');
			filename = $(content).xpath('../*:id[@extension]').attr('extension');
		}
		return {"observationMedia": observationMedia, "filename": filename};
	}
	this.createBlobArray = function createBlobArray(blob) {
		var ua = new Uint8Array(blob.length);
		for(var i = 0; i < blob.length; i++)
			ua[i] = blob.charCodeAt(i);
		return ua;
	}
	this.createBlob = function createBlob(obj) {
		if(obj.output == "DataURI")
			return sprintf('data:%s;%s,%s', obj['Content-Type'], obj.encoding, obj.content);
		if(obj.output == "blob")
			return new Blob([((obj.encoding == "base64") ? this.createBlobArray(atob(obj.content)) : obj.content)], {type: obj['Content-Type']});
	}
	this.createBlobURL = function createBlobURL(blob) {
		var URLObj = window.URL || window.webkitURL;
		return URLObj.createObjectURL(blob);
	}
	this.createBlobDownload = function createBlobDownload(obj) {
		var a = $('<a/>').attr('href', this.createBlobURL(this.createBlob(obj))).attr('download', obj.filename);
		a[0].dataset.downloadurl = [obj['Content-Type'], obj.filename, a.attr('href')].join(':');
		return a;
	}
}