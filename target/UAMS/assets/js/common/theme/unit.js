/**
 * 小工具 组件
 * @auther huyi@zensvision.com
 * @version spin_2.0
 */
;define(function(require, exports, module){
	'use strict';
	
	var G = require('global'),
		View = require('T/view'),
		Unit = {};
	
	Unit.StringArray = function( c ){
		var o = {tag:'StringArray', target:'', operate:'', isEdit: false, array:'', ele:{tag:'div', content:'', attr:{class:'spin-string-array'}}};
		G.Extend(o, c, false);
		
		var operate = o.operate,
			array = o.array || '',
			arrayObj = [];
		
		operate === 'edit' && (o.ele.content = parseArray(array));
		o.ele.content += o.isEdit || operate === 'add' ? '<button class="close btn-xm"><i class="icon icon-plus"></i></button>' : '';
		
		var stringArray = new View( o );
		o.isEdit && stringArray.target.find('span').addClass('edit');
		
		spanBind();

		stringArray.target.find('button').click(function(){
			if( stringArray.target.find('input').size() > 0 ) return false;
			
			var input = G.createElement('input', {max:12, type:'text', placeholder:'输入内容'});
			
			G.$(this).before( input );
			input.onkeypress = function(evt){
				if(evt.keyCode === 13){
					var value = G.$(input).val();
					if( value ){
						for(var i = 0; i < arrayObj.length; ++ i){
							if( value === arrayObj[i] ){
								G.toastr('info', '该项已存在，请重新输入！' );
								G.$(input).val('')
								return false;
							}
						}
						arrayObj.push( value );
						G.$(input).before('<span class="edit">' + value + '</span>').remove();
						spanBind();
					}else{
						G.toastr('info', '请先输入内容！');
					}
				}
			};
		});
		
		this.getValue = function(){
			var str = '';
			for(var i = 0; i < arrayObj.length; ++ i)
				str += arrayObj[i] + ( i < arrayObj.length - 1 ? ',' : '' );
			return str;
		};
		
		function spanBind(){
			stringArray.target.find('span.edit').click(function(){
				var text = G.$(this).text(),
					buf = [];
				for(var i = 0; i < arrayObj.length; ++ i){
					if( arrayObj[i] !== text ){
						buf.push( arrayObj[i] );
					}
				}
				arrayObj = buf;
				G.$(this).remove();
			});
		}
				
		function parseArray( _array_ ){
			var html = '';
			
			if( !_array_ ) return html;
			
			_array_ = _array_.indexOf(',') > 0 ? _array_.split(',') : [ _array_ || '' ];
			for(var str in _array_){
				if( _array_[str] ){
					arrayObj.push( _array_[str] );
					html += '<span>' + _array_[ str ] + '</span>';
				}
			}
			return html;
		}
	}
	
	Unit.Button = function( c ){
		var o = {target:'', util:{}, callback:function(){}};
		G.Extend(o, c, false);
		
		var util = o.util,
			ele = G.createElement('button', {class:util.css}, '', '<span class="' + util.icon + '"></span> ' + util.name);
		
		G.$(o.target).append( ele );
		ele.onclick = function(){ G.isFunction(o.callback) && o.callback(util); }
		this.target = G.$(ele);
	}
	
	Unit.ButtonGroup = function( c ){
		var o = {target:'', util:[], callback:function(){}};
		G.Extend(o, c, false);
		
		var html = '', util = o.util, ele;
		html +=	'<button type="button" class="' + util.css + ' dropdown-toggle" aria-expanded="false" data-toggle="dropdown">' +
					'<span class="' + util.icon + '"></span> ' + util.name + ' <span class="caret"></span>' +
				'</button>' + 
				'<ul class="dropdown-menu" role="menu">';
		for(var j = 0; j < util.uri.length; ++j)
			html +=  util.uri[j].type === 'divider' ? '<li role="separator" class="divider"></li>' : '<li><a href="#" bind-idx="' + j + '"><span class="' + util.uri[j].icon + '"></span> ' + util.uri[j].name + '</a></li>';
		html += '</ul>';
		
		ele = G.createElement('div', {class:'btn-group'}, '', html);
		G.$(o.target).append( ele );
		this.target = G.$(ele);
		
		this.target.find('ul.dropdown-menu li a').click(function(){ G.isFunction(o.callback) && o.callback( util.uri[ parseInt( G.$(this).attr('bind-idx') ) ] ); });
	}
	
	Unit.Search = function( c ){
		var o = {target:'', util:{}, callback:function(){}};
		G.Extend(o, c, false);
		
		var	html = '', optionHTML = '', util = o.util;
		for(var i = 0; i < util.option.length; i ++)
			optionHTML += '<option value="' + util.option[i].name + '">' + util.option[i].text + '</option>';
		html = '<select>' + optionHTML + '</select>' + 
	           '<input type="search" placeholder="搜索内容">' + 
	           '<button class="btn btn-success" type="button"><span class="icon icon-search"></span> 查找</button>';
		
		var ele = G.createElement('div', {class:'spin-search'}, '', html);
		G.$(o.target).append( ele );
		this.target = G.$(ele);
		
		this.target.find('input').on('keypress', function(evt){
			if(evt.keyCode === 13) find();
		});
		this.target.find('button').on('click', function(){
			find();
		});
		
		function find(){
			var select = G.$(ele).find('select').val(),
				input = G.$(ele).find('input').val(),
				item = {};
			if(!select){
				G.toastr('info', '提示先选择选项'); //提示先选择选项
				return false;
			}
			if(!input) {
				G.toastr('info', '提示先输入查找内容'); //提示先输入查找内容
				return false;
			}
			item.select = select;
			item.input = input;

			G.isFunction(o.callback) && o.callback(util, {sifter:'string:' + select + '@' + input});
		}
	}
	
	Unit.Modal = function( _o_ ){
		var o = {tag: 'modal', target:'', exist:false, showFooter: false, ele:{attr:{class:'modal fade', content:''}}, bind: function(){}};
		G.Extend(o, _o_, false);
		
		o.ele.content = '<div class="modal-dialog">' +
						    '<div class="modal-content">' +
						      '<div class="modal-header">' +
						        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
						        '<h4 class="modal-title"></h4>' +
						      '</div>' +
						      '<div class="modal-body"></div>' +
						      '<div class="modal-footer">' +
						        '<button type="button" class="btn btn-default" data-dismiss="modal"><span class="icon icon-remove"></span> 取消</button>' +
						        '<button type="button" class="btn btn-primary"><span class="icon icon-ok"></span> 确认</button>' +
						      '</div>' +
						    '</div>' +
						'</div>';
		
		var m = new View( o );
		
		!m.showFooter && m.target.find('.modal-footer').hide();
		m.showFooter && G.isFunction(m.bind) && m.target.find('.modal-footer button:last-of-type').one('click', m.bind);
		
		m.target.find('.modal-header button').click(function(){ m.target.find('.modal-footer button:last-of-type').unbind('click'); });
		m.target.find('.modal-footer button:first-of-type').click(function(){ m.target.find('.modal-footer button:last-of-type').unbind('click'); });
		
		this.target = m.target;
		this.show = function(){ m.target.modal({backdrop: 'static', keyboard: false, show: true}); return this; }
		this.hide = function(){ m.target.find('.modal-footer button:last-of-type').unbind('click'); m.target.modal('hide'); }
		this.body = function( html ){ m.target.find('.modal-body').html( html ); return this; }
		this.foot = function( state ){ state === 'show' ? m.target.find('.modal-footer').show() : m.target.find('.modal-footer').hide(); }
		this.title = function( title ){ title && m.target.find('.modal-title').html( title ); return this; }
		this.bind = function( callback ){ 
			if( G.isFunction( callback ) ){
				m.target.find('.modal-footer').show();
				m.target.find('.modal-footer button:last-of-type').one('click', function(){
					callback();
				});
			}else{
				m.target.find('.modal-footer').hide();
			}
			return this; 
		}
	};
	
	Unit.UploadImage = function( _o_ ){
		var o = {
			tag: 'upload-image',
			target: '',
			uri: '',
			bind: function(){}
		};
		G.Extend(o, _o_, false);
		
		if(!o.uri) return false;
		
		var target = o.target,
			html = '<div class="image-preview"></div>' + 
				   '<div class="spin-text-warning">图片文件大小不能超过1M，支持图片类型：png 或 jpg</div>' +
				   '<form action="' + o.uri + '" method="post" enctype="multipart/form-data">' +
					 	 '<div class="form-item">描述：<div class="item-input"><input type="text" name="Summary" class="form-control"/></div></div>' +
					 	 '<div class="form-item">图片大小：<div class="item-input"><input type="text" name="Size" class="form-control" readonly="readonly" /></div></div>' +
					 	 '<div class="upload-button" class="fileupload-buttonbar">' +
			                '<span class="btn btn-success fileinput-button" >' +
			                    '<i class="icon icon-plus"></i> ' +
			                    '<span> 选择图片 </span>' +
			                    '<input type="file" class="form-control" name="image"/>' +
			                '</span>' +
				            '<button type="submit" class="btn btn-maroon cancel" disabled="disabled">' +
			                    '<i class="icon icon-upload"></i> ' +
			                    '<span> 上传图片 </span>' +
			                '</button>' +
				            '<button type="reset" class="btn btn-warning cancel" disabled="disabled">' +
			                    '<i class="icon icon-remove"></i> ' +
			                    '<span> 移除图片 </span>' +
			                '</button>' +
				        '</div>' +
				    '</form>',
			ele = G.createElement('div', {class:'spin-upload'}, '', html);
		target.append(ele);
		target = G.$(ele);
		
		var image = target.find('div.image-preview'),
			size = target.find('input[name="Size"]'),
			select = target.find('input[type="file"]'),
			submit = target.find('button[type="submit"]'),
			remove = target.find('button[type="reset"]'),
			warn = target.find('.spin-text-warning'),
			text = '图片文件大小不能超过1M，支持图片类型：png 或 jpg';
		
		select.change(function(){
			var files = this.files,
				file = files[0], 
				reader = new FileReader();
			
			if( file.size > 1024 * 1024 ){
				submit.attr('disabled', true);
				remove.attr('disabled', true);
				warn.html('图片超过1M，请重新选择适合的图片');
			}else{
				submit.attr('disabled', false);
				remove.attr('disabled', false);
				warn.html( text );
				size.val( file.size );
				reader.onload = function(){
					image.css({'background':'url(' + this.result + ') center no-repeat', 'background-size': 'auto 100%'});
				};
				reader.readAsDataURL( file ); 
			}
		});
		
		submit.click(function(){
			target.find('form').ajaxForm({  
		        dataType: 'json',  
		        success: function( data ){
		        	if( data.success ){
		        		G.toastr('success', '上传图片成功');
		        		G.isFunction(o.bind) && o.bind();
		        	}else{
		        		G.toastr('warning', '上传图片失败');
		        	}
		        },
		        error: function(){ G.toastr('danger', '上传图片异常'); }
		    });
		});
		
		remove.click(function(){
			warn.html( text );
			select.val('');
			image.css('background', '');
			size.val('');
			
			submit.attr('disabled', true);
			remove.attr('disabled', true);
		});		
		
		this.target = target;
	};
	module.exports = Unit;
});