cda2g.Editor = new function Editor() {
	var editor = null;
	var editContainer = null;
	this.init = function init() {
		editor = window.open("editor.html", "cda2g_Editor", "location=no,menubar=no,status=no,toolbar=no,top=10,left=10,width=950,height=650");
		return editor;
	}
	this.getEditor = function getEditor() {
		var textarea = $('#editor', editor.document)[0];
		$.ajax({
			type: "GET",
			url: 'components/sample.xhtml',
			dataType: "text",
			async: false,
			success: function (data, textStatus, jqXHR) {
				textarea.innerHTML = data;
			}
		});
		//editor.CKEDITOR.config.allowedContent = 'style div span info processable header footer table tr th td script green element template decorate selector eachselector json data each choose when otherwise';
		editor.editor = editor.CKEDITOR.replace(textarea, { toolbar: 'Basic', uiColor: '#14B8C4' });
		editContainer = editor.editor;
		return editContainer;
	}
	this.setEditor = function setEditor(evt) {
		evt.editor.execCommand('maximize');
	}
}