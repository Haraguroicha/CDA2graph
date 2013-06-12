cda2g.Editor = new function Editor() {
	var editor = null;
	var editContainer = null;
	var CDACode = "";
	var hospitalOID = "";
	var cda2gElements = [
		'json',
		'each',
		'data',
		'enumerator',
		'selector',
		'eachselector',
		'exist',
		'otherwise',
		'choose'
	];
	var attr = {
		style: '[scoped]',
		json: '[!id]',
		data: '[!match]',
		green: '[!root,!filename]',
		eachselector: '[!section,!path,target]',
		selector: '[!section,!path,target,attr,match,format]',
		selector_: '[!id,!path,target,attr,match,format]'
	};
	var ewc = function(e) {
		if(e != undefined)
			if(e.editor.mode != "wysiwyg")
				return false;
		$('#loading', editor).dialog('close');
		$(cda2gElements).each(function() {
			cda2g.Editor.parseEditorElements(this.toString());
		});
	}
	this.init = function init() {
		editor = window.open("editor.html", "cda2g_Editor", "location=no,menubar=no,status=no,toolbar=no,top=1,left=1,width=1,height=1");
		editor.close();
		editor = window.open("editor.html", "cda2g_Editor", "location=no,menubar=no,status=no,toolbar=no,top=10,left=10,width=1020,height=800");
		$(editor).on('load', function() {
			$('#loading', editor).html('Loading file...').dialog({
				width: 600,
				height: 250,
				modal: true,
				show: { effect: "drop", direction: "left" },
				hide: { effect: "drop", direction: "right" },
				open: function(event, ui) {
					$(".ui-dialog-titlebar-close", editor).hide();
					$("#loading", editor).attr("data-l10n-id", "appInitializing");
					$("#ui-dialog-title-loading", editor).attr("data-l10n-id", "appInitializing").html(_("appInitializing"));
				},
				close: function(event,ui) {  },
				closeOnEscape: false,
				draggable: false,
				resizable: false
			});
		});
		return editor;
	}
	this.registerTemplate = function registerTemplate(code, oid) {
		CDACode = code;
		hospitalOID = oid;
		return true;
	}
	this.getEditor = function getEditor() {
		var textarea = $('#editor', editor.document)[0];
		var fn = cda2g.Files.getFileName(CDACode, hospitalOID);
		editor.document.title = sprintf('Editor - %s[%s]', CDACode, hospitalOID);
		var sourceData = '';
		$.ajax({
			type: "GET",
			url: sprintf('templates/%s/%s.xhtml', fn.code, fn.oid),
			dataType: "text",
			async: false,
			success: function (data, textStatus, jqXHR) {
				textarea.innerHTML = '';
				sourceData = data;
			}
		});
		editContainer = editor.CKEDITOR.replace(textarea, {
			on: {
				instanceReady: function(evt) {
					evt.editor.execCommand('maximize');
					editor.focus();
					
					cda2g.Editor.extendElement('', 'style', attr.style);
					
					cda2g.Editor.extendElement('body', 'processable', null , null, true);
					cda2g.Editor.extendElement('processable', 'green', attr.green, ['processable']);
					
					cda2g.Editor.extendElement('body', 'info', null , null, true);
					cda2g.Editor.extendElement('info', 'header', null, ['info']);
					cda2g.Editor.extendElement('info', 'footer', null, ['info']);
					cda2g.Editor.extendElement('header', 'choose', null, ['info', 'header']);
					cda2g.Editor.extendElement('footer', 'choose', null, ['info', 'footer']);
					cda2g.Editor.extendElement('header', 'selector', attr.selector, ['info', 'header']);
					cda2g.Editor.extendElement('footer', 'selector', attr.selector, ['info', 'footer']);
					
					cda2g.Editor.extendElement('', 'choose');
					cda2g.Editor.extendElement('choose', 'exist', null, ['choose']);
					cda2g.Editor.extendElement('choose', 'otherwise', null, ['choose']);
					cda2g.Editor.extendElement('exist', 'selector', attr.selector, ['exist']);
					cda2g.Editor.extendElement('otherwise', 'selector', attr.selector, ['otherwise']);
					
					cda2g.Editor.extendElement('', 'eachselector', attr.eachselector);
					cda2g.Editor.extendElement('eachselector', 'selector', attr.selector_, ['eachselector']);
					cda2g.Editor.extendElement('eachselector', 'each', null, ['eachselector']);
					cda2g.Editor.extendElement('each', 'json', attr.json, ['each']);
					
					cda2g.Editor.extendElement('selector', 'selector', attr.selector, ['selector']);
					cda2g.Editor.extendElement('selector', 'enumerator', null, ['selector']);
					cda2g.Editor.extendElement('enumerator', 'data', attr.data, ['enumerator']);
					cda2g.Editor.extendElement('selector', 'data', null, ['selector']);
					
					editor.Editor.config.contentsCss = "css/editor.css";
					editor.Editor.setData(sourceData);

					setTimeout(function() {ewc();}, 500);
					//editor.Editor.execCommand('source');
				},
				mode: function(e) {setTimeout(function() {ewc(e);}, 100);},
				afterCommandExec: function(e) {
					if(e.data.name.indexOf('cda2g') != -1)
						setTimeout(function(){editor.CKEDITOR.dialog.getCurrent().on('ok', function(){ewc();});}, 100);
					setTimeout(function() {ewc(e);}, 100);
				}
			}
		});
		editor.Editor = editContainer;
		return editContainer;
	}
	this.parseEditorElements = function parseEditorElements(element) {
		var doc = editor.Editor.document.$.documentElement;
		$(element, doc).each(function() {
			var needSR = (this.webkitShadowRoot == null);
			var sr = (needSR) ? this.webkitCreateShadowRoot() : this.webkitShadowRoot;
			var self = $(this);
			switch(element) {
				case 'selector':
					var id = self.attr('id');
					var match = self.attr('match');
					var format = self.attr('format');
					var formatString = (match != undefined && format != undefined) ? sprintf('<span>formatting: %s =&gt; %s</span>', match, format) : '';
					var path = self.attr('path');
					var section = self.attr('section');
					var attrib = self.attr('attr');
					attrib = (attrib == undefined) ? '' : sprintf('attr: %s<br/>', attrib);
					if(section == undefined)
						section = '';
					else
						section = sprintf('@@%s<br/>', section);
					path = (path == undefined) ? '' : sprintf('path: <div title="%s">%s</div>', path.replace(/"/g, '\\"'), path);
					if(id != undefined)
						sr.innerHTML = sprintf('<span>&lt;#%s&gt;</span><div>%s%s%s</div>%s<content></content>', self.attr('id'), section, attrib, path, formatString);
					else
						sr.innerHTML = sprintf('<div>%s%s%s</div>%s<content></content>', section, attrib, path, formatString);
					break;
				case 'eachselector':
					var path = self.attr('path');
					var section = self.attr('section');
					if(section == undefined)
						section = '';
					else
						section = sprintf('@@%s<br/>', section);
					path = (path == undefined) ? '' : sprintf('path: <div>%s</div>', path);
					sr.innerHTML = sprintf('<span>%s</span><div>%s%s</div><content></content>', element, section, path);
					break;
				case 'json':
					sr.innerHTML = sprintf('<span>&lt;#%s&gt;</span>', self.attr('id'));
					break;
				case 'data':
					var match = self.attr('match');
					if(match != undefined)
						sr.innerHTML = sprintf('%s-&gt;<content></content>', match);
					else
						sr.innerHTML = '<span>#result#</span>';
					break;
				case 'each':
				case 'choose':
				case 'exist':
				case 'otherwise':
				case 'enumerator':
					sr.innerHTML = sprintf('<span>%s</span><content></content>', element);
					break;
				default:
					sr.innerHTML = '<content></content>';
			}
			sr.innerHTML = sprintf('<style>span,div{border:solid 1px orange;padding: 2px;background-color: lightblue;}div div{border: dotted 1px red;width: 100px;height: 10px;overflow: hidden;display: inline-block;text-overflow: ellipsis;white-space: nowrap;}</style>%s', sr.innerHTML);
		});
	}
	this.extendElement = function extendElement(elementPath, elementName, attribute, additionalParent, parentOnly) {
		if(elementPath == undefined && elementName == undefined)
			return false;
		if(attribute == undefined || attribute == null)
			attribute = '';
		if(elementPath.substr(-1) != ';')
			elementPath += ';';
		var _ = elementPath.replace(/;/g, ' ' + elementName + ';');
		_ = _.replace(/;/g, attribute + '; ');
		if(_.substr(-2) == '; ')
			_ = _.substr(0, _.length - 2);
		var obj = {_: _, elementPath: elementPath, elementName: elementName, attribute: attribute, additionalParent: additionalParent};
		editor.CKEDITOR.extendDTD(elementName, additionalParent, parentOnly);
		var __ = _.split(';');
		for(var i = 0; i < __.length; i++)
			editor.Editor.filter.allow(__[i], 'cda2gFilter_' + elementPath + '_' + elementName + '_' + (new cda2g.Date().toString().replace(/[/: ]/g,'')), true);
		return obj;
	}
}