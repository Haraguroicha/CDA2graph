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
			height: 400,
			modal: true,
			show: { effect: "drop", direction: "left" },
			hide: { effect: "drop", direction: "right" },
			open: function(event, ui) {
				$(".ui-dialog-titlebar-close").hide();
				$("#fileLoader").attr("data-l10n-id", "fileInitializing");
				$("#ui-dialog-title-plLoader").attr("data-l10n-id", "fileInitializing");
			},
			close: function(event,ui) { $("#fileMessage").html(''); },
			closeOnEscape: false,
			draggable: false,
			resizable: false
		});
		cda2g.Pages.clearView();
		setTimeout(function(){cda2g.Files.parseCDA();}, 10);
	}
	var XCD = $('<style scoped="scoped" />').html("@import url(css/index.css);@import url(components/css/XCD.css);");
	this.appendXCD = function appendXCD() {
		return $('cda2g[is]').each(function() {
			var node = this;
			if(!!node.webkitShadowRoot) {
				var sr = node.webkitShadowRoot;
				var qa = sr.querySelectorAll('style')
				var haveXCD = false;
				$(qa).filter('style').each(function() {
					if(this.innerHTML.match(/@import url\(components\/css\/XCD\.css\);/) != null)
						haveXCD = true;
				});
				if(!haveXCD) {
					cda2g.logger.log(sprintf("Append XCD scoped style Element to cda2g[is='%s' cda.filename='%s']", $(node).attr('is'), $(node).attr('cda.filename')));
					$(sr).append(XCD.clone());
				}
			}
		});
	}
	this.parseCDA = function parseCDA() {
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
					setTimeout(function(){cda2g.Files.appendXCD();}, 1000);
					setTimeout(function(){cda2g.Files.convertShadowRootToHTML(cda2g.Pages.getPageNumber());}, 1500);
					
				}
			}
	}
	this.convertShadowRootToHTML = function convertShadowRootToHTML(p) {
		var pf = p[0];
		var pe = p[1];
		$("#fileMessage").prepend('<span data-l10n-id="fileRePaging">Re-Paging!!</span><br/>');
		setTimeout(function(){cda2g.Files.shadowRootToHTML(p);}, 100);
	}
	this.shadowRootToHTML = function shadowRootToHTML(p) {
		var cda = $('cda2g');
		if(cda.length == 0) {
			setTimeout(function(){ $("#fileMessage").prepend('<span data-l10n-id="fileDone">Done!!</span><br/>'); }, 1000);
			setTimeout(function(){ $("#fileLoader").dialog('close'); cda2g.UI.activateDrop(); }, 1500);
			return;
		}
		var pf = p[1] - cda.length + 1;
		var pe = p[1];
		var info = $(cda[0].webkitShadowRoot.querySelectorAll('*')).filter('info');
		var shadowRootHTML = cda[0].webkitShadowRoot.innerHTML;
		var header = info.find('header').text().trim();
		var footer = info.find('footer').text().trim();
		$("#fileProgress").progressbar({value: (pf / pe) * 100});
		cda2g.Pages.addPage().setHeader(header).setFooter(footer).appendHTML(shadowRootHTML);
		cda2g.Pages.removePage(1);
		setTimeout(function(){cda2g.Files.shadowRootToHTML(p);}, 250);
	}
	this.CDAParser = function CDAParser() {
		if(!!!this.xml) return;
		var doc = $(this.xml);
		var filename = this.name;
		var filesize = this.size;
		var cda_header = doc.xpath("*:ClinicalDocument/(* except self::*/*:component)");
		var cda_body = doc.xpath("*:ClinicalDocument/*:component");
		var CDAcode = cda_header.xpath("../*:code");
		var hospitalOID = cda_header.xpath("../*:custodian/*:assignedCustodian/*:representedCustodianOrganization/*:id | ../*:recordTarget/*:patientRole/*:providerOrganization/*:id");
		var components = cda_body.xpath("./*:structuredBody/*:component");
		var hospitalOID_extension = hospitalOID.attr("extension");
		var CDAcode_code = CDAcode.attr("code");
		if(hospitalOID_extension == undefined)
			hospitalOID_extension = "";
		if(CDAcode_code == undefined)
			CDAcode_code = "";
		var cdaName = sprintf("___%s___%s", CDAcode_code, hospitalOID_extension);
		var template = sprintf("templates/%s/%s.xhtml", ((CDAcode_code != "") ? CDAcode_code.md5() : "default"), ((hospitalOID_extension != "") ? hospitalOID_extension.md5() : "default"));
		var cdah = $('<cdaHeader />');
		var cdab = $('<cdaBody />');
		var xTemplate = 0;
		$.ajax({
			type: "GET",
			url: template,
			dataType: "text",
			async: false,
			success: function (data, textStatus, jqXHR) {
				var temp = template.replace(/templates\//g, "");
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
				$("#fileMessage").prepend(sprintf("<pre>%s; %s</pre>", xTemplate, temp));
				cda2g.logger.log(sprintf("Query template code=%s, return message='%s'", xTemplate, message));
			}
		});
		var parsing = $('<parsing is="parsing" />');
		parsing.append('<loading class="l10n" /><filename /><filesize />');
		parsing.find('loading.l10n').html(_("fileLoading"));
		parsing.find('filename').html(filename);
		parsing.find('filesize').html(filesize);
		var cda = $(sprintf('<cda2g is="cda%s" cda.filename="%s" style="display: none; height: 0px !important; overflow: hidden;" xmlnsPrefix="%s" xmlnsURI="%s"/>', cdaName, filename, ((!!this.xmlnsPrefix) ? this.xmlnsPrefix : ""), ((!!this.xmlnsURI) ? this.xmlnsURI : "")));
		cda2g.logger.log(sprintf("CDA data parsed. DOC_CODE='%s', HOS_ID='%s', components=%s, templates=%s", CDAcode_code, hospitalOID_extension, components.length, template));
		if(cdaName != 303 && $(sprintf('link[rel="components"][href="%s"]', template)).length == 0) {
			$('head').append($(sprintf('<link type="application/xhtml+xml" rel="components" href="%s" />', template)));
			cda2g.logger.log(sprintf("CDA template=%s", template));
		}
		cda_header.appendTo(cdah);
		cda_body.appendTo(cdab);
		cda.html(cdah.wrapAll('<div/>').parent().html() + cdab.wrapAll('<div/>').parent().html());
		cda2g.Pages.addPage();
		cda2g.Pages.appendHTML(parsing.wrapAll('<div/>').parent().html() + cda.wrapAll('<div/>').parent().html());
	}
	this.toAllXPathDomain = function toAllXPathDomain(path, parent) {
		var ret = (!!parent ? this.toAllXPathDomain(parent) + "/" : "") + '*:' + path.split('/').join('/*:')
			.replace(/\ ?(,|\||\ or\ [^@]|\ and\ [^@]|\ OR\ [^@]|\ AND\ [^@])\ ?/g,
				sprintf(" $1 %s*:", (!!parent ? this.toAllXPathDomain(parent) + "/" : ""))
			).replace(/\/\*:\.\./g, "/..");
		return ret;
	}
	this.selectorParse = function selectorParse(root, content) {
		var xmlns = content.attr("xmlnsName");
		var shadow = $(root.querySelectorAll('*'));
		var parse = function parse(index, value) {
			var obj = $(this);
			var isEach = (obj.parents("eachselector").length != 0);
			if(isEach) {
				var section = obj.parents("eachselector").attr("section");
				var path = cda2g.Files.toAllXPathDomain(obj.attr("path"), obj.parents("eachselector").attr("path"));
			} else {
				var section = obj.attr("section").toString();
				var path = cda2g.Files.toAllXPathDomain(obj.attr("path"));
			}
			var id = obj.attr("id");
			var data = $(content.children('cda' + section));
			var attr = obj.attr('attr');
			var match_string = obj.attr("match");
			var format_string = obj.attr("format");
			var placeholder = obj.attr("placeholder");
			var type = obj.attr("type");
			var mode = obj.attr("mode");
			var hideEmptyParent = obj.attr("onemptyhideparent");
			var allChildren = obj.attr("allchildren");
			allChildren = ((!!allChildren) ? (allChildren.toLowerCase() == "yes") : false);
			section = section.substring(0, 1).toUpperCase() + section.substring(1);
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
				if(val == undefined)
					val = "";
				if(ret == undefined)
					ret = "";
			} else {
				var val = data.xpath(path);
				var ret = "";
				var rt = [];
				if(val.length > 0) {
					if(!!attr && !isEach)
						val = val.attr(attr);
					else {
						for(var i = 0; i < val.length; i++) {
							var v = $(val[i]).clone();
							v.find('*').each(function(){
								//$(this).remove();
							});
							v = (!allChildren) ? v.text() : v.wrapAll('div').parent().html();
							if(v.length > 0) {
								rt.push(v);
								if(!isEach)
									break;
							} else {
								var valAttr = (!!attr) ? $($(val[i]).filter(sprintf('[%s]', attr))).attr(attr) : "";
								if(!!valAttr)
									rt.push(valAttr);
								else
									rt.push("");
								if(!isEach)
									break;
							}
						}
						if(isEach && id != undefined) {
							var rr = {};
							rr.id = id;
							rr.value = rt;
							val = escape(JSON.stringify(rr));
						} else {
							val = rt[0];
						}
					}
				} else {
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
				cda2g.logger.log(sprintf("Selecting path:'%s'%s value='%s' => '%s'", path, ((!!attr) ? "@" + attr : ""), (isEach) ? "JSON Data:" + unescape(val) : val, (isEach) ? "JSON Data:" + unescape(ret) : ret));
			}
			var data = obj.find('data');
			if(data.length != 0)
				data.html(ret);
			else
				obj.html(ret);
			if(hideEmptyParent != undefined)
				if(obj.css('display') == 'none')
					$(obj).xpath(sprintf('.%s', '/..'.repeat(hideEmptyParent))).css('display', 'none');
		}
		selectors = shadow.find('selector:not(eachselector selector)');
		selectors.each(parse);
		selectors = shadow.find('eachselector selector');
		selectors.each(parse);
		shadow.filter('div._XCD_Component').css('display', 'block');
		$(content).css('display', 'block');
		this.chooseParse(root, content);
		this.eachParse(root, content);
		cda2g.Pages.getLastPage().setHeader(shadow.find('info>header').text().trim());
	}
	this.eachParse = function eachParse(root, content) {
		var shadow = $(root.querySelectorAll('*'));
		each = $(shadow.find('each'));
		each.each(function() {
			var result = [];
			var length = 0;
			var ec = $(this);
			var selector = ec.parent().find('selector');
			var jsonData = {};
			selector.each(function() {
				var self = $(this);
				if(self.css('display') != "none") {
					var data = JSON.parse(unescape(self.html().trim()));
					jsonData[data.id] = data.value;
					if(data.value.length > length)
						length = data.value.length;
				}
			});
			for(var i = 0; i < length; i++) {
				result[i] = $('<result />');
				var ecc = ec.clone();
				ecc.find('json').each(function() {
					var self = $(this);
					var html = jsonData[self.attr('id')][i];
					if(self.filter('data').length > 0)
						self.filter('data').html(html);
					else
						self.html(html);
				});
				result[i].append(ecc.html());
			}
			$(this).parent().append(result);
		});
	}
	this.chooseParse = function chooseParse(root, content) {
		var shadow = $(root.querySelectorAll('*'));
		choose = $(shadow.find('choose'));
		choose.each(function() {
			var c = $(this);
			var exist = $(c.find('exist'));
			var otherwise = $(c.find('otherwise'));
			if(exist.find(':empty').length == 0) {
				exist.css("display", "inline-block");
				otherwise.css("display", "none").remove();
			} else {
				exist.css("display", "none").remove();
				otherwise.css("display", "inline-block");
			}
		});
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