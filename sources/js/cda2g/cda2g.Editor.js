cda2g.Editor = new function Editor() {
	var editor = null;
	var editContainer = null;
	var CDACode = "";
	var hospitalOID = "";
	this.init = function init() {
		editor = window.open("editor.html", "cda2g_Editor", "location=no,menubar=no,status=no,toolbar=no,top=1,left=1,width=1,height=1");
		editor.close();
		editor = window.open("editor.html", "cda2g_Editor", "location=no,menubar=no,status=no,toolbar=no,top=10,left=10,width=950,height=650");
		$(editor).on('load', function() {
			//cda2g.Editor.getEditor();
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
					var attr = {
						style: '[scoped]',
						json: '[!id]',
						data: '[!match]',
						green: '[!root,!filename]',
						eachselector: '[!section,!path,target]',
						selector: '[!section,!path,target,attr,match,format]',
						selector_: '[!id,!path,target,attr,match,format]'
					};
					
					cda2g.Editor.extendElement('', 'style', attr.style);
					
					cda2g.Editor.extendElement('', 'processable');
					cda2g.Editor.extendElement('processable', 'green', attr.green, ['processable']);
					
					cda2g.Editor.extendElement('', 'info');
					cda2g.Editor.extendElement('info', 'header', null, ['info']);
					cda2g.Editor.extendElement('info', 'footer', null, ['info']);
					cda2g.Editor.extendElement('header', 'choose', null, ['header']);
					cda2g.Editor.extendElement('footer', 'choose', null, ['footer']);
					cda2g.Editor.extendElement('header', 'selector', attr.selector, ['header']);
					cda2g.Editor.extendElement('footer', 'selector', attr.selector, ['footer']);
					
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
					
					editor.Editor.setData(sourceData);
					editor.Editor.execCommand('source');
				}
			}
		});
		editor.Editor = editContainer;
		return editContainer;
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