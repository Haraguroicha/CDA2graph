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
			files = { "./size": 0, "./loader": [], "./list": [] };
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
								try {
									f.xmlnsPrefix = f.data.match(new RegExp(sprintf('xmlns(:([\\w]*))?="%s"', f.xmlnsURI)))[2];
								} catch(e) {
									f.xmlnsPrefix = null;
								}
								f.isDoc = ((f.data.match(/<\?xml[^?>]+\?>\s*(<\?xml-stylesheet .+\?>)?\s*<([\w]*:)?ClinicalDocument[^>]+>([\s\w\W]*)<\/([\w]*:)?ClinicalDocument>([\s\w\W]*)/)) ? true : false);
								f.xml = null;
								f.xss = null;
								f.parser = cda2g.Files.CDAParser;
								try {
									f.xml = $.parseXML(f.data);
								} catch(e) {
									f.isDoc = false;
								}
								if(f.isDoc) {
									f.xss = (f.xml.nextSibling != null) ? ((f.xml.nextSibling.nodeType == document.COMMENT_NODE) ? f.xml.nextSibling.textContent : null) : null;
									obj["./size"] += f.size;
									cda2g.logger.log(sprintf("ClinicalDocument%s loaded: `%s`(%s bytes)", ((!!f.xmlns) ? sprintf("[xmlns:%s]", f.xmlns) : ""), f.name, f.size));
									obj[f.name] = f;
									obj["./list"].push(f.name);
									obj["./loader"].push(f.name);
									if(obj["./loader"].length == fss.length)
										cda2g.Files.initParse();
								} else {
									cda2g.logger.log(sprintf("loaded file: `%s`(%s bytes), but that is not valid ClinicalDocument.", f.name, f.size));
									$("<div title='" + _("mistypeCDA") + "'/>")
										.html(_("canNotReadCDA"))
										.append($("<img/>").attr("src", "img/CDA_Sample.png"))
										.dialog({
											width: 625,
											height: 480,
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
			files.__defineGetter__("count", function() {
				return (!!this["./list"]) ? this["./list"].length : 0;
			});
		}
	}
	this.initParse = function initParse() {
		$("#fileLoader").dialog({
			width: 600,
			height: 250,
			modal: true,
			show: { effect: "drop", direction: "left" },
			hide: { effect: "drop", direction: "right" },
			open: function(event, ui) {
				$(".ui-dialog-titlebar-close").hide();
				$("#fileLoader").attr("data-l10n-id", "fileInitializing");
				$("#ui-dialog-title-plLoader").attr("data-l10n-id", "fileInitializing");
			},
			close: function(event,ui) { $("#fileMessage").html('') },
			closeOnEscape: false,
			draggable: false,
			resizable: false
		});
		cda2g.Pages.clearView();
		setTimeout(function(){cda2g.Files.parseCDA();}, 10);
	}
	var XCD = $('<style scoped="scoped" />').html("@import url(components/css/XCD.css);");
	this.parseCDA = function parseCDA() {
		$('cda2g[is]').each(function() {
			var node = this;
			if(!!node.webkitShadowRoot) {
				var sr = node.webkitShadowRoot.querySelectorAll('*')
				var haveXCD = false;
				$(sr).filter('style').each(function() {
					if(this.innerHTML.match(/@import url\(components\/css\/XCD\.css\);/) != null)
						haveXCD = true;
				});
				if(!haveXCD) {
					cda2g.logger.log("Append XCD scoped style Element");
					$(node.webkitShadowRoot).append(XCD);
				}
			}
		});
		var loader = this.files["./loader"];
		if(!!loader)
			if(loader.length > 0) {
				var obj = this.files[loader[0]];
				obj.parser();
				this.files["./loader"] = this.files["./loader"].slice(1);
				$("#fileMessage").prepend(sprintf('<span data-l10n-id="fileLoading">Loading </span>\'%s\' (%s bytes)...<br />', obj.name, obj.size));
				$("#fileProgress").progressbar({value: ((this.files.count - this.files["./loader"].length) / this.files.count * 100)});
				if(files["./loader"].length == 0) {
					$("#fileMessage").prepend('<span data-l10n-id="fileFinalizing">Finalizing</span>...<br/>');
					setTimeout(function(){$( "#fileLoader" ).dialog('close');}, 1000);
				}
			}
	}
	this.CDAParser = function CDAParser() {
		if(!!!this.xml) return;
		var doc = $(this.xml);
		var cda_header = doc.xpath("*:ClinicalDocument/(* except self::*/*:component)");
		var cda_body = doc.xpath("*:ClinicalDocument/*:component");
		var CDAcode = cda_header.xpath("../*:code");
		var hospitalOID = cda_header.xpath("../*:recordTarget/*:patientRole/*:id");
		var components = cda_body.xpath("./*:structuredBody/*:component");
		var hospitalOID_root = hospitalOID.attr("root");
		var CDAcode_code = CDAcode.attr("code");
		if(hospitalOID_root == undefined)
			hospitalOID_root = "";
		if(CDAcode_code == undefined)
			CDAcode_code = "";
		var cdaName = sprintf("___%s___%s", CDAcode_code, hospitalOID_root);
		var template = sprintf("templates/%s/%s.xhtml", ((CDAcode_code != "") ? CDAcode_code.md5() : "default"), ((hospitalOID_root != "") ? hospitalOID_root.md5() : "default"));
		var cdah = $('<cdaHeader />');
		var cdab = $('<cdaBody />');
		var xTemplate = 0;
		$.ajax({
			type: "GET",
			url: template,
			dataType: "text",
			async: false,
			success: function (data, textStatus, jqXHR) {
				xTemplate = parseInt(jqXHR.getResponseHeader("X-Template"));
				var message = "";
				switch(xTemplate) {
					case 303:
						message = sprintf("GET '%s' failed, using demo.", template);
						cdaName = "Demo";
						template = "components/cdaDemo.xhtml";
						break;
					case 307:
						message = sprintf("GET '%s' failed, return default template.", template);
						cdaName = sprintf("___%s", CDAcode_code);
						template = sprintf("templates/%s/default.xhtml", ((CDAcode_code != "") ? CDAcode_code.md5() : "default"));
						break;
					case 200:
						message = "OK";
						break;
					default:

				}
				cda2g.logger.log(sprintf("Query template code=%s, return message='%s'", xTemplate, message));
			}
		});
		var cda = $(sprintf('<cda2g is="cda%s" style="display: none;" xmlnsPrefix="%s" xmlnsURI="%s"/>', cdaName, ((!!this.xmlnsPrefix) ? this.xmlnsPrefix : ""), ((!!this.xmlnsURI) ? this.xmlnsURI : "")));
		cda2g.logger.log(sprintf("CDA data parsed. DOC_CODE='%s', HOS_ID='%s', components=%s, templates=%s", CDAcode_code, hospitalOID_root, components.length, template));
		if(cdaName == 200 && $(sprintf('link[rel="components"][href="%s"]', template)).length == 0) {
			$('head').append($(sprintf('<link type="application/xhtml+xml" rel="components" href="%s" />', template)));
			cda2g.logger.log(sprintf("CDA template=%s", template));
		}
		cda_header.appendTo(cdah);
		cda_body.appendTo(cdab);
		cda.html(cdah.wrapAll('<div/>').parent().html() + cdab.wrapAll('<div/>').parent().html());
		cda2g.Pages.addPage().setTitle(this.name);
		cda2g.Pages.appendHTML(cda.wrapAll('<div/>').parent().html());
	}
	this.selectorParse = function selectorParse(root, content) {
		var xmlns = $(content).attr("xmlnsName");
		var shadow = $(root.querySelectorAll('*'));
		selectors = shadow.find('selector');
		selectors.each(function(index, value) {
			var obj = $(this);
			var path = '*:' + obj.attr("path").split('/').join('/*:').replace(/\ ?(,|\||\ or\ [^@]|\ and\ [^@]|\ OR\ [^@]|\ AND\ [^@])\ ?/g, " $1 *:").replace(/\/\*:\.\./g, "/..");
			var attr = obj.attr('attr');
			var match_string = obj.attr("match");
			var format_string = obj.attr("format");
			var placeholder = obj.attr("placeholder");
			var type = obj.attr("type");
			var mode = obj.attr("mode");
			var section = obj.attr("section").toString();
			section = section.substring(0, 1).toUpperCase() + section.substring(1);
			var data = $($(content).children('cda' + section));
			if(type == "observationMedia") {
				path += "/*:value";
				var val = data.xpath(path);
				if(val.length > 0) {
					ret = $('<span/>');
					if(mode == "image") {
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
					}
					if(mode == "binary") {
						var list = $('<ul/>');
						val.each(function() {
							var info = cda2g.Files.getMediaInfo(mode, this);
							var base64 = $(this).text().trim();
							cda2g.logger.log(sprintf("Selecting path:'%s'%s observationMedia='%s' filename='%s'", path, ((!!attr) ? "@" + attr : ""), info.observationMedia, info.filename));
							var li = $('<li/>');
							var a = cda2g.Files.createBlobDownload({
								"Content-Type": info.observationMedia,
								"encoding": "base64",
								"output": "blob",
								"content": base64,
								"filename": info.filename
							});
							a.text(sprintf("%s (%s bytes)", info.filename, atob(base64).length));
							a.appendTo(li);
							li.appendTo(list);
						});
						list.appendTo(ret);
					}
				} else {
					if(placeholder == undefined)
						obj.css('display', 'none');
					else
						val = placeholder;
				}
			} else {
				var val = data.xpath(path);
				var ret = "";
				if(val.length > 0) {
					if(attr != undefined)
						val = val.attr(attr);
					else
						for(var i = 0; i < val.length; i++) {
							var v = $(val[i]).text();
							if(v.length > 0) {
								val = v;
								break;
							}
						}
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