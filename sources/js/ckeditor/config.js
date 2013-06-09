/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */
CKEDITOR.extendDTD = function(tagName, custom, parentOnly) {
	customArea = [ '$block', 'body', 'table', 'tr', 'th', 'td', 'tbody', 'div', 'span' ];
	if((custom != undefined && custom != null) && parentOnly != true)
		for(var i = 0; i < custom.length; i++)
			customArea.push(custom[i]);
	else
		if(custom != undefined && custom != null)
			customArea = custom;
	var dtd = CKEDITOR.dtd;
	dtd[tagName] = {'#':1};
	for (var i = 0; i < customArea.length; i++)
		dtd[customArea[i]][tagName] = 1;
}
CKEDITOR.editorConfig = function( config ) {
	
	// %REMOVE_START%
	// The configuration options below are needed when running CKEditor from source files.
	config.plugins = 'dialogui,dialog,about,a11yhelp,dialogadvtab,basicstyles,bidi,blockquote,clipboard,button,panelbutton,panel,floatpanel,colorbutton,colordialog,templates,menu,contextmenu,div,resize,toolbar,elementspath,list,indent,enterkey,entities,popup,filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo,font,forms,format,htmlwriter,horizontalrule,iframe,wysiwygarea,image,smiley,justify,link,liststyle,magicline,maximize,newpage,pagebreak,pastetext,pastefromword,preview,print,removeformat,save,selectall,showblocks,showborders,sourcearea,specialchar,menubutton,scayt,stylescombo,tab,table,tabletools,undo,wsc,xml,codemirror';
	config.skin = 'moonocolor';
	// %REMOVE_END%

	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.uiColor = '#14B8C4';
};
