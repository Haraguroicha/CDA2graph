/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

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
	var getFirstElement = function getFirstElement(element) {
		if(!element)
			return;
		if(CKEDITOR.__cda2gTempSelection__)
			if(CKEDITOR.__cda2gTempSelection__.is('selector') && $(CKEDITOR.__cda2gTempSelection__.$).filter('selector[id]').length > 0) {
				var ele = $(CKEDITOR.__cda2gTempSelection__.$);
				ele.real = CKEDITOR.__cda2gTempSelection__;
				return ele;
			}
		var ele = element.$;
		var parent = null;
		if(!element.is('selector'))
			while(parent = ele.parentElement) {
				var ret = undefined;
				$(cda2gElements).each(function() {
					if (parent.localName == this.toString())
						ret = parent;
				});
				if(!ret)
					break;
				else
					ele = parent;
			}
		
		if(ele)
			ele = $(ele);
		ele.real = element;
		return ele;
	}
	var getSelectedElement = function getSelectedElement( editor, element ) {
		if ( !element )
			element = editor.getSelection().getStartElement();
		
		var ret = undefined;
		$(cda2gElements).each(function() {
			if ( element && element.is( this.toString() ) && !element.data( 'cke-realelement' ) && !element.isReadOnly() )
				ret = element;
		});
		if(ret == undefined) {
			var eles = element.getChildren();
			var count = eles.count();
			for(var i = 0; i < count; i++) {
				var ele = eles.getItem(i);
				$(cda2gElements).each(function() {
					if(ele.type == CKEDITOR.NODE_ELEMENT)
						if ( ele && ele.is( this.toString() ) && !ele.data( 'cke-realelement' ) && !ele.isReadOnly() )
							ret = ele;
				});
				if(ret != undefined && ret == ele)
					break;
			}
		}
		return ret;
	}
	var cda2gDialog = function( editor, dialogType ) {
		var validateMF = function() {
			var validateE = ((this.getValue() == '' && this._.dialog.cda2g_type == 'eachselector') || this._.dialog.cda2g_type == 'selector');
			if(!validateE)
				alert(editor.lang.cda2g.errorMessage.MFE);
			var validate = (this._.dialog.cda2g_match != '' && this._.dialog.cda2g_format != '') || (this._.dialog.cda2g_match == '' && this._.dialog.cda2g_format == '');
			if(!validate)
				alert(editor.lang.cda2g.errorMessage.MF);
			return validateE && validate;
		}
		return {
			title: editor.lang.cda2g[ dialogType ],
			resizable: CKEDITOR.DIALOG_RESIZE_NONE,
			minWidth: 480,
			minHeight: 360,
			onShow: function() {
				var editor = this.getParentEditor(),
					sel = editor.getSelection(),
					element = sel && sel.getStartElement() && CKEDITOR.__cda2gTempSelection__;
				
				if(CKEDITOR.__cda2gTempSelection__) {
					var parent = null;
					while(parent = element.getParent()) {
						var ret = undefined;
						$(cda2gElements).each(function() {
							if (parent.$.localName == this.toString())
								ret = parent;
						});
						if(!ret)
							break;
						else
							element = parent;
					}
					var range = editor.createRange();
					range.moveToPosition( element, CKEDITOR.POSITION_AFTER_START );
					range.select();
				}
				
				this.cda2gElement = getFirstElement(getSelectedElement(editor, element));
				this.cda2gEditing = (this.cda2gElement != undefined) ? (this.cda2gElement.length > 0) : false;
				if(this.cda2gElement != undefined)
					this.cda2gEach = (this.cda2gElement.parent('eachselector').length > 0);
				else
					this.cda2gEdit = false;
				
				if(this.cda2gEditing)
					this.setupContent(this.cda2gElement);
				
				if(CKEDITOR.__cda2gTempST__)
					$('body', editor.document.$.documentElement)[0].scrollTop = CKEDITOR.__cda2gTempST__;
				else
					CKEDITOR.__cda2gTempSTop__ = $('body', editor.document.$.documentElement)[0].scrollTop;
			},
			onOk: function() {
				var editor = this.getParentEditor();
				// Edit existing.
				if (this.cda2gEditing) {
					this.commitContent(this.cda2gElement);
				} else {// Create a new.
					this.cda2gElement = editor.document.createElement('selector');
					this.commitContent($(this.cda2gElement.$));
					editor.insertElement(this.cda2gElement);
				}
				if(!this.cda2gElementRemoved) {
					var range = editor.createRange();
					if(this.cda2gEditing && this.cda2gElement)
						range.moveToPosition( this.cda2gElement.real, CKEDITOR.POSITION_BEFORE_START );
					else
						range.moveToPosition( this.cda2gElement, CKEDITOR.POSITION_BEFORE_START );
					range.select();
				}

				if(CKEDITOR.__cda2gTempST__) {
					$('body', editor.document.$.documentElement)[0].scrollTop = CKEDITOR.__cda2gTempST__;
					delete CKEDITOR.__cda2gTempST__;
				}
				if(CKEDITOR.__cda2gTempSelection__)
					delete CKEDITOR.__cda2gTempSelection__;
			},
			onLoad: function() {
				var doc = this._.element.getDocument();
			},
			onHide: function() {
				var editor = this.getParentEditor();
				if(CKEDITOR.__cda2gTempST__) {
					$('body', editor.document.$.documentElement)[0].scrollTop = CKEDITOR.__cda2gTempST__;
					delete CKEDITOR.__cda2gTempST__;
				}
				setTimeout(function(){
					if(CKEDITOR.__cda2gTempSTop__) {
						$('body', editor.document.$.documentElement)[0].scrollTop = CKEDITOR.__cda2gTempSTop__;
						setTimeout(function() {delete CKEDITOR.__cda2gTempSTop__;}, 500);
					}
				}, 100);
				var editor = this.getParentEditor();
				var range = editor.createRange();
				if(!this.cda2gElementRemoved)
					if(this.cda2gElement)
						if(this.cda2gElement.real) {
							range.moveToPosition( this.cda2gElement.real, CKEDITOR.POSITION_BEFORE_START );
							range.select();
						}
				delete this.cda2gElement;
				var notCompletedElement = $('selector[id]:not([path])', editor.document.$.documentElement);
				if(notCompletedElement.length > 0 || this.cda2gElementInserted) {
					if(!this.cda2gElementInserted)
						alert(editor.lang.cda2g.errorMessage.notCompleted);
					this.cda2gElementInserted = true;
					CKEDITOR.__cda2gTempSelection__ = new CKEDITOR.dom.node($('selector[id]:not([path])', editor.document.$.documentElement)[0]);
					var range = editor.createRange();
					range.moveToPosition( CKEDITOR.__cda2gTempSelection__, CKEDITOR.POSITION_BEFORE_START );
					range.select();
				}
				if(this.cda2gElementInserted)
					setTimeout(function() {
						editor.execCommand('cda2g');
					}, 500);
				else
					if(CKEDITOR.__cda2gTempSelection__)
						delete CKEDITOR.__cda2gTempSelection__;
				delete this.cda2gElementInserted;
				delete this.cda2gElementRemoved;
			},
			contents: [
				{
				id: 'selector',
				label: editor.lang.cda2g.elements.selector,
				accessKey: 's',
				elements: [
					{
					type: 'vbox',
					padding: 0,
					children: [
						{
						type: 'hbox',
						widths: [ '100px', '80px', '180px', '100px' ],
						align: 'right',
						children: [
							{
							id: 'cdaSelectorType',
							type: 'select',
							label: editor.lang.cda2g.dialog.type,
							required: true,
							items: [
								['-Select Type-'],
								['Selector'],
								['EachSelector']
							],
							default: '-Select Type-',
							onChange: function() {
								if(this.getValue().indexOf('-') == -1)
									this._.dialog.cda2g_type = this.getValue().toLowerCase();
								var type = this._.dialog.cda2g_type;
								switch(type) {
									case 'selector':
										this._.dialog.showPage('data');
										this._.dialog.hidePage('each');
										break;
									case 'eachselector':
										this._.dialog.hidePage('data');
										this._.dialog.showPage('each');
										break;
									default:
										this._.dialog.showPage('data');
										this._.dialog.showPage('each');
								}
							},
							setup: function(element) {
								if(element) {
									switch(element[0].localName.toLowerCase()) {
										case 'selector':
											this._.dialog.cda2g_type = 'selector';
											this.setValue('Selector');
											break;
										case 'eachselector':
											this._.dialog.cda2g_type = 'eachselector';
											this.setValue('EachSelector');
											break;
										default:
											this._.dialog.cda2g_type = '';
											this.setValue('-Select Type-')
									}
								}
							},
							commit: function(element) {
								element.attr('section', this.getValue());
							},
							validate: function() {
								var val = this.getValue();
								var isValid = (val.substr(0, 1) + val.substr(-1) != '--');
								if(!isValid)
									alert(editor.lang.cda2g.errorMessage.selectorType);
								return isValid;
							}
						},{
							id: 'cdaSection',
							type: 'select',
							label: editor.lang.cda2g.dialog.section,
							required: true,
							items: [
								['-section-'],
								['header'],
								['body']
							],
							default: '-section-',
							setup: function(element) {
								if(element.attr('id') != null)
									$('#' + this.domId).find('div div').children().attr('disabled', 'disabled');
								else
									$('#' + this.domId).find('div div').children().removeAttr('disabled');
								this.setValue(element.attr(this.id.substr(3).toLowerCase()));
							},
							commit: function(element) {
								var value = this.getValue();
								if(value != '')
									element.attr(this.id.substr(3).toLowerCase(), value);
								else
									element.removeAttr(this.id.substr(3).toLowerCase());
							},
							validate: function() {
								var val = this.getValue();
								var isValid = (val.substr(0, 1) + val.substr(-1) != '--');
								if(!isValid)
									alert(editor.lang.cda2g.errorMessage.section);
								return isValid;
							}
						},{
							id: 'cdaTarget',
							type: 'text',
							label: editor.lang.cda2g.dialog.target,
							required: false,
							setup: function(element) {
								this.setValue(element.attr(this.id.substr(3).toLowerCase()));
							},
							commit: function(element) {
								var value = this.getValue();
								if(value != '')
									element.attr(this.id.substr(3).toLowerCase(), value);
								else
									element.removeAttr(this.id.substr(3).toLowerCase());
							},
							validate: function() {
								return true;
							}
						},{
							id: 'cdaId',
							type: 'text',
							label: editor.lang.cda2g.dialog.id,
							required: true,
							setup: function(element) {
								if(this._.dialog.cda2gEach)
									$('#' + this.domId).find('div div').children().removeAttr('disabled');
								else
									$('#' + this.domId).find('div div').children().attr('disabled', 'disabled');
								$('#' + this.domId).find('div div').children().attr('disabled', 'disabled');
								this.setValue(element.attr(this.id.substr(3).toLowerCase()));
							},
							commit: function(element) {
								return;
								var value = this.getValue();
								if(value == '') {
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
									this._.dialog.cda2gElementRemoved = true;
								}
							},
							validate: function() {
								if(this._.dialog.cda2g_type == 'eachselector' && this.getValue() != '') {
									alert(editor.lang.cda2g.errorMessage.id);
									return false;
								}
								return true;
							}
						}
						]
					},{
						type: 'hbox',
						widths: [ '400px', '80px' ],
						align: 'right',
						children: [
						{
							id: 'cdaPath',
							type: 'text',
							label: editor.lang.cda2g.dialog.path,
							required: true,
							setup: function(element) {
								this.setValue(element.attr(this.id.substr(3).toLowerCase()));
							},
							commit: function(element) {
								element.attr(this.id.substr(3).toLowerCase(), this.getValue());
							},
							validate: function() {
								try{
									document.evaluate(this.getValue(), document, null, XPathResult.ANY_TYPE).iterateNext()
									return true;
								} catch(e) {
									alert(editor.lang.cda2g.errorMessage.path);
									return false;
								}
							}
						},{
							id: 'cdaAttr',
							type: 'text',
							label: editor.lang.cda2g.dialog.attr,
							required: false,
							setup: function(element) {
								if(this._.dialog.cda2g_type == 'selector')
									this.setValue(element.attr(this.id.substr(3).toLowerCase()));
							},
							commit: function(element) {
								var value = this.getValue();
								if(value != '')
									element.attr(this.id.substr(3).toLowerCase(), value);
								else
									element.removeAttr(this.id.substr(3).toLowerCase());
							},
							validate: function() {
								var validate = ((this.getValue() == '' && this._.dialog.cda2g_type == 'eachselector') || this._.dialog.cda2g_type == 'selector');
								if(!validate)
									alert(editor.lang.cda2g.errorMessage.attr);
								return validate;
							}
						}
						]
					},{
						type: 'hbox',
						widths: [ '240px', '240px' ],
						align: 'right',
						children: [
						{
							id: 'cdaMatch',
							type: 'text',
							label: editor.lang.cda2g.dialog.match,
							required: false,
							onKeyUp: function() {
								this._.dialog.cda2g_match = this.getValue();
							},
							onChange: function() {
								this._.dialog.cda2g_match = this.getValue();
							},
							setup: function(element) {
								this.setValue(element.attr(this.id.substr(3).toLowerCase()));
							},
							commit: function(element) {
								var value = this.getValue();
								if(value != '')
									element.attr(this.id.substr(3).toLowerCase(), value);
								else
									element.removeAttr(this.id.substr(3).toLowerCase());
							},
							validate: validateMF
						},{
							id: 'cdaFormat',
							type: 'text',
							label: editor.lang.cda2g.dialog.format,
							required: false,
							onKeyUp: function() {
								this._.dialog.cda2g_format = this.getValue();
							},
							onChange: function() {
								this._.dialog.cda2g_format = this.getValue();
							},
							setup: function(element) {
								this.setValue(element.attr(this.id.substr(3).toLowerCase()));
							},
							commit: function(element) {
								var value = this.getValue();
								if(value != '')
									element.attr(this.id.substr(3).toLowerCase(), value);
								else
									element.removeAttr(this.id.substr(3).toLowerCase());
							},
							validate: validateMF
						}
						]
					}
					]
				}
				]
			},{
				id: 'data',
				label: editor.lang.cda2g.elements.data,
				accessKey: 'd',
				elements: [
					{
						id: 'cdaFormat',
						type: 'textarea',
						rows: 22,
						cols: 104,
						label: editor.lang.cda2g.dialog.enumeratorData,
						required: false,
						setup: function(element) {
							var ele = element.find('enumerator data[match]');
							var val = '';
							ele.each(function() {
								var self = $(this);
								var match = self.attr('match');
								var value = self.text();
								val+=(val.length > 0 ? '\n' : '')+match+','+value;
							});
							this.setValue(val);
						},
						commit: function(element) {
							var creation = (element.find('enumerator').length == 0);
							if(creation)
								$('<enumerator />').appendTo(element);
							var ele = element.find('enumerator');
							ele.find('data[match]').each(function() {$(this).remove();});
							var rebuildResult = (element.find('data').length > 0);
							if(rebuildResult) element.find('data').remove();
							var val = this.getValue().trim();
							if(val.length > 0 && val.indexOf(',') != -1) {
								$(val.split('\n')).each(function() {
									var match = this.split(',')[0];
									var data = this.substr(match.length + 1);
									$('<data/>').attr('match', match).text(data).appendTo(ele);
								});
								$('<data/>').appendTo(element);
							} else {
								element.find('enumerator').remove();
								element.find('data').remove();
							}
						},
						validate: function() {
							return true;
						}
					}
				]
			},{
				id: 'each',
				label: editor.lang.cda2g.elements.each,
				accessKey: 'e',
				elements: [
					{
						id: 'cdaEach',
						type: 'text',
						label: editor.lang.cda2g.dialog.each,
						required: false,
						setup: function(element) {
							var ele = element.find('each');
							if(ele.length == 0)
								return;
							ele = $(ele[0].childNodes);
							var val = '';
							ele.each(function() {
								switch(this.nodeType) {
									case Node.ELEMENT_NODE:
										val += '<#' + $(this).attr('id') + '>'
									case Node.TEXT_NODE:
										val += $(this).text();
								}
							});
							this.setValue(val);
						},
						commit: function(element) {
							if(this.getValue().length == 0)
								return;
							if(element.find('each').length == 0)
								$('<each/>').appendTo(element)
							var ele = element.find('each');
							ele.html('');
							var val = this.getValue();
							var match = val.replace(/</g, '&gt;').replace(/&gt;#/g, '<#').match(/(<#[\w]+>|[^<]+)/gi);
							var tags = [];
							$(match).each(function() {
								var val = this.toString();
								if(val.match(/<#(\w+)>/) != null) {
									var v = val.replace(/<#(\w+)>/g, '$1');
									$('<json/>').attr('id', v).appendTo(ele);
									tags.push(v);
								} else {
									ele.html(ele.html() + val);
								}
							});
							var inserted = false;
							$(tags).each(function() {
								var id = this.toString();
								var ele = element.find('selector[id="' + id + '"]');
								if(ele.length > 0) {
									ele.attr('accessed', 'accessed');
								} else {
									$('<selector/>').attr('id', id).attr('accessed', 'accessed').prependTo(element);
									inserted = true;
								}
							});
							this._.dialog.cda2gElementInserted = inserted;
							element.find('selector:not([accessed])').remove();
							element.find('selector[accessed]').removeAttr('accessed');
						},
						validate: function() {
							return true;
						}
					}
				]
			}
			]
		};
	}

	CKEDITOR.dialog.add( 'cda2gAdd', function( editor ) {
		return cda2gDialog( editor, 'Add' );
	});
	CKEDITOR.dialog.add( 'cda2gEdit', function( editor ) {
		return cda2gDialog( editor, 'Edit' );
	});
})();
