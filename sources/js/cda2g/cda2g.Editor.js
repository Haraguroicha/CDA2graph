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
		$.ajax({
			type: "GET",
			url: sprintf('templates/%s/%s.xhtml', fn.code, fn.oid),
			dataType: "text",
			async: false,
			success: function (data, textStatus, jqXHR) {
				textarea.innerHTML = data;
			}
		});
		editContainer = editor.CKEDITOR.replace(textarea, {
			on: {
				instanceReady: function(evt) {
					evt.editor.execCommand('maximize');
					editor.focus();
				}
			}
		});
		return editContainer;
	}
}