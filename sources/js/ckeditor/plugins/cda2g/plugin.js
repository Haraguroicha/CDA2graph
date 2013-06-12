(function() {
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
	CKEDITOR.plugins.add( 'cda2g', {
		requires: 'dialog',
		lang: 'en,zh', // %REMOVE_LINE_CORE%
		icons: 'cda2g', // %REMOVE_LINE_CORE%
		init: function( editor ) {
			// Register the dialog.
			CKEDITOR.dialog.add( 'cda2gAdd', this.path + 'dialogs/cda2g.js' );
			CKEDITOR.dialog.add( 'cda2gEdit', this.path + 'dialogs/cda2g.js' );
			
			// Register the command.
			editor.addCommand( 'cda2g', new CKEDITOR.dialogCommand( 'cda2g' ) );
			editor.addCommand( 'cda2gAdd', new CKEDITOR.dialogCommand( 'cda2gAdd' ) );
			editor.addCommand( 'cda2gEdit', new CKEDITOR.dialogCommand( 'cda2gEdit' ) );
			editor.addCommand( 'cda2gDelete', {
				exec: function(editor) {
					var cda2gElement = CKEDITOR.__cda2gTempSelection__;
					
					if ( !cda2gElement )
						return;
					
					// If the table's parent has only one child remove it as well (unless it's the body or a table cell) (#5416, #6289)
					var parent = cda2gElement.getParent();
					if ( parent.getChildCount() == 1 && !parent.is( 'body', 'td', 'th' ) )
						cda2gElement = parent;
					
					var range = editor.createRange();
					range.moveToPosition( cda2gElement, CKEDITOR.POSITION_BEFORE_START );
					cda2gElement.remove();
					range.select();
				}
			} );
			
			editor.ui.addToolbarGroup('cda2g');
			
			// Register the toolbar button.
			editor.ui.addButton && editor.ui.addButton( 'cda2g', {
				label: editor.lang.cda2g.title,
				command: 'cda2g',
				toolbar: 'cda2g,0'
			});
			editor.on( 'selectionChange', function(evt) {
				var element = $(evt.data.selection.getStartElement().$);
				var ret = false;
				var parent = undefined;
				var ele = element;
				$(cda2gElements).each(function(){
					if(element.children(this.toString()).length > 0)
						ret = true;
				});
				if(!ret)
					while(parent = ele.parent()) {
						var ele = undefined;
						$(cda2gElements).each(function() {
							if (parent[0].localName == this.toString())
								ele = parent;
						});
						if(!ele)
							break;
						else
							ret = true;
					}
				var editState = ret;
				var dialogName = 'cda2g' + ((editState) ? 'Edit' : 'Add');
				editor.getCommand('cda2g').dialogName = dialogName;
			} );
			editor.on( 'doubleclick', function( evt ) {
				var element = evt.data.element;
				element = getSelectedElement(editor, element);

				$(cda2gElements).each(function() {
					if ( element.is( this.toString() ) && !element.data( 'cke-realelement' ) && !element.isReadOnly() ) {
						CKEDITOR.__cda2gTempSelection__ = element;
						editor.execCommand('cda2g');
					}
				});
			});
			editor.addMenuGroup('cda2g');
			// If the "menu" plugin is loaded, register the menu items.
			if ( editor.addMenuItems ) {
				editor.addMenuItems({
					cda2g: {
						label: editor.lang.cda2g.menu.Edit,
						command: 'cda2g',
						group: 'cda2g',
						order: 5
					},
					cda2gDelete: {
						label: editor.lang.cda2g.menu.Delete,
						command: 'cda2gDelete',
						group: 'cda2g',
						orget: 1
					}
				});
			}
			
			// If the "contextmenu" plugin is loaded, register the listeners.
			if ( editor.contextMenu ) {
				editor.contextMenu.addListener( function( element, selection ) {
					var selectedElement = getSelectedElement( editor, element );
					if(selectedElement) {
						CKEDITOR.__cda2gTempSelection__ = selectedElement;
						CKEDITOR.__cda2gTempST__ = $('body', editor.document.$.documentElement)[0].scrollTop;
					}
					return ( selectedElement ) ? { cda2g: CKEDITOR.TRISTATE_OFF, cda2gDelete: CKEDITOR.TRISTATE_OFF } : null;
				});
			}
		}
	});
	
	var getSelectedElement = function getSelectedElement( editor, element ) {
		if ( !element ) {
			var sel = editor.getSelection();
			element = sel.getSelectedElement();
		}
		
		var ret = undefined;
		$(cda2gElements).each(function() {
			if ( element && element.is( this.toString() ) && !element.data( 'cke-realelement' ) && !element.isReadOnly() )
				ret = element;
		});
		if(ret == undefined) {
			console.log(element)
			var eles = element.getChildren();
			var count = eles.count();
			for(var i = 0; i < count; i++) {
				ele = eles.getItem(i);
				$(cda2gElements).each(function() {
					if(ele.type == CKEDITOR.NODE_ELEMENT)
						if ( ele && ele.is( this.toString() ) && !ele.data( 'cke-realelement' ) && !ele.isReadOnly() )
							ret = ele;
				});
				if(!ret)
					break;
			}
		}
		if(ret == undefined) {
			var sel = editor.getSelection();
			element = sel.getStartElement();
			var ele = element.getChildren();
			var count = ele.count();
			for(var i = 0; i < count; i++) {
				element = ele.getItem(i);
				$(cda2gElements).each(function() {
					if(element.type == CKEDITOR.NODE_ELEMENT)
						if ( element && element.is( this.toString() ) && !element.data( 'cke-realelement' ) && !element.isReadOnly() )
							ret = element;
				});
			}
		}
		return ret;
	}
})();