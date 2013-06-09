/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

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
	config.protectedSource.push(/[\s]*<style[^>]*[^"]*">[\s\S]+<\/style>[\s]*/gi);
	config.protectedSource.push(/[\s]*<info>((?!<)(?!\/)(?!i)(?!n)(?!f)(?!o)(?!>)[\s\S]+)[\s]*<\/info>[\s]*/gi);
	config.protectedSource.push(/[\s]*<script[^>]*[^"]*">[\s\S]+<\/script>[\s]*/gi);
	config.protectedSource.push(/[\s]*<choose>[\s]*(<(exist|otherwise)>[\s]*(<selector[^>]*[^"]*">[^<\/selector>]*<\/selector>[\s]*){1,}<\/(exist|otherwise)>[\s]*){2}[\s]*<\/choose>[\s]*/gi);
	config.protectedSource.push(/[\s]*<eachselector[^>]*[^"]*">[\s]*(<selector[^>]*[^"]*">[\s]*(<enumerator>[\s]*(<data[^>]*>[^<\/data>]*<\/data>[\s]*){0,}<\/enumerator>[\s]*)?(<data><\/data>)?[\s]*<\/selector>[\s]*){0,}(<each>[\s]*(<json[^>]*><\/json>[^<]*){0,}<\/each>[\s]*)<\/eachselector>[\s]*/gi);
	config.protectedSource.push(/[\s]*<selector[^>]*[^"]*">[^<]*<\/selector>[\s]*/gi);
	config.protectedSource.push(/[\s]*<selector[^>]*[^"]*">[\s]*(<enumerator>[\s]*(<data[^>]*>[^<\/data>]*<\/data>[\s]*){0,}<\/enumerator>[\s]*)?(<data><\/data>)?[\s]*<\/selector>[\s]*/gi);
	config.protectedSource.push(/[\s]*<selector[^>]*[^"]*">[\s]*([^<]*<data><\/data>[^<]*)?[\s]*<selector[^>]*[^"]*">[\s]*([^<]*<(selector|data)[^>]*[^"]*"?>[^<]*<\/(selector|data)>[^<]*){0,}[\s]*<\/selector>[\s]*([^<]*<data><\/data>[^<]*)?[\s]*<\/selector>[\s]*/gi);
	config.protectedSource.push(/[\s]*<selector[^>]*[^"]*">[\s]*([^<]*<(selector|data)[^>]*[^"]*"?>[^<]*<\/(selector|data)>[^<]*){0,}[\s]*<\/selector>[\s]*/gi);
	config.protectedSource.push(/[\s]*<processable>[\s\S]*<\/processable>[\s]*/gi);
};
