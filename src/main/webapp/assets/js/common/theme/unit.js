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
		
		var m = new View( o ),
			sureBtn = m.target.find('.modal-footer button:last-of-type');
		
		m.target.find('.modal-header button').click(function(){ m.target.find('.modal-footer button:last-of-type').unbind('click'); });
		
		if(!m.showFooter) {
			m.target.find('.modal-footer').hide();
		}else{
			m.target.find('.modal-footer').show();
			 
			sureBtn.unbind('click');
			G.isFunction(m.bind) && sureBtn.click(m.bind)
		}
		
		this.target = m.target;
		this.show = function(){ m.target.modal({backdrop: 'static', keyboard: false, show: true}); return this; }
		this.hide = function(){ sureBtn.unbind('click'); m.target.modal('hide'); }
		this.body = function( html ){ m.target.find('.modal-body').html( html ); return this; }
		this.foot = function( state ){ state === 'show' ? m.target.find('.modal-footer').show() : m.target.find('.modal-footer').hide(); }
		this.title = function( title ){ title && m.target.find('.modal-title').html( title ); return this; }
		this.bind = function( callback ){ 
			if( G.isFunction( callback ) ){
				m.target.find('.modal-footer').show();
				sureBtn.unbind('click');
				sureBtn.click(function(){ callback(); });
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
					 	 '<div class="upload-button">' +
			                '<span class="btn btn-success fileinput-button" >' +
			                    '<i class="icon icon-plus"></i> ' +
			                    '<span> 选择图片 </span>' +
			                    '<input type="file" class="form-control" name="image" accept=".png,.jpg,.jpeg,"/>' +
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
				reader.readAsDataURL( file ); //Data URL是一种将小文件直接嵌入文档的方案
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
	
	Unit.Progress = function(_o_){
		var o = {
				tag: 'progress',
				target: '',
			};
		G.Extend(o, _o_, false);

		var target = o.target,
			ele = G.createElement('div', {class:'progress'}, '', '<div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"><span class="sr-only">1%</span></div>');
		target.append(ele);
		target = G.$(ele);
		
		var bar = target.find('[role="progressbar"]');
		this.update = function(num){
			num = num < 0 ? 0 : (num > 100 ? 100 : num);
			bar.attr('aria-valuenow', num).css('width', num + '%');
			bar.html(num + '%');
		};
		this.reset = function(){
			bar.attr('aria-valuenow', 0).css('width', '0%');
			bar.html('0%');
		}
	};
	
	Unit.UploadFile = function( _o_ ){
		var o = {
			tag: 'upload-file',
			target: '',
			uri: '',
			mulit:true,
			limit: 1024,
			bind: function(){}
		};
		G.Extend(o, _o_, false);
		
		if(!o.uri) return false;
		
		function sizeFormat( _size_ ){
			return ( _size_ > 1024 ? ( _size_ < Math.pow(1024, 2) ? (_size_ / 1024).toFixed(2) + ' KB' : ( _size_ < Math.pow(1024, 3) ? (_size_ / (Math.pow(1024, 2))).toFixed(2) + ' MB' : (_size_ / (Math.pow(1024, 3))).toFixed(2) + ' GB') ) : (_size_ || 0) + ' B' );
		}
		
		var target = o.target,
			limitSize = sizeFormat(o.limit || '1024'),
			text = '文件大小不能超过' + limitSize,
			warnText = '文件大小超过' + limitSize + '，请重新选择文件',
			html =  '<div class="file-group"></div>' +
			   		'<div class="spin-text-warning">请点击下方添加文件按钮选择上传文件</div>' +
			   		'<div class="upload-button">' +
					    '<button type="button" class="btn btn-success">' +
					        '<i class="icon icon-plus"></i> ' +
					        '<span> 添加文件 </span>' +
					    '</button>' +
					    '<button type="submit" class="btn btn-maroon cancel" disabled="disabled">' +
					        '<i class="icon icon-upload"></i> ' +
					        '<span> 上传文件 </span>' +
					    '</button>' +
					    '<button type="reset" class="btn btn-warning cancel" disabled="disabled">' +
					        '<i class="icon icon-remove"></i> ' +
					        '<span> 移除文件 </span>' +
					    '</button>' +
					'</div>',
			ele = G.createElement('div', {class:'spin-upload'}, '', html);
		target.append(ele);
		target = G.$(ele);
		
		var btnG = target.find('div.upload-button'),
			addBtn = btnG.find('button:nth-child(1)'),
			submitBtn = btnG.find('button:nth-child(2)'),
			removeBtn = btnG.find('button:nth-child(3)'),
			warnBox = target.find('.spin-text-warning'),
			fileGroup = target.find('div.file-group'),
			files = [];
		
		function buttonStatus(flag){
			submitBtn.attr('disabled', flag);
			removeBtn.attr('disabled', flag);
		}
		
		function FileUpload(){
			var item = G.createElement('div', {class:'file-item'}, '', 
					'<div class="item-info"><span class="info"><span>名称：<i class="info-name"></i><i class="info-result"></i></span><span>类型：<i class="info-type"></i><i class="info-size"></i></span></span><span class="bar"></span><span><i class="info-speed"></i><i class="info-transfer"></i></span></div>' + 
				    '<span class="btn btn-success fileinput-button"><i class="icon icon-plus"></i><span> 选择文件 </span><input type="file" name="' + G.GUID('file') + '" class="form-control" accept=".docx,.doc,.txt,.pdf"/></span>' +
			        '<button type="button" class="close"><span>&times;</span></button>');
			
			fileGroup.append(item);
			
			var targ = G.$(item),
				bar = targ.find('span.bar'),
				input = targ.find('input'),
				info = targ.find('span.info'),
				result = targ.find('i.info-result'),
				name = info.find('i.info-name'),
				size = info.find('i.info-size'),
				type = info.find('i.info-type'),
				speed = info.find('i.info-speed'),
				transfer = info.find('i.info-transfer'),
				progress = new Unit.Progress({target:bar}),
				close = targ.find('button.close'),
				isEmpty = true,
				isFreezed = false;

			function resultMsg(msg){ result.html(msg || ''); }
			
			input.change(function(){
				var file = this.files[0], 
					reader = new FileReader();
				
				if( file.size > limitSize ){
					buttonStatus(true);
					resultMsg(warnText);
				}else{
					reader.onloadstart = function(){
						progress.reset(); //进度条重置
					};
					reader.onload = function(){
						var sizeIn = info.find('input[name="Size"]'),
							nameIn = info.find('input[name="FileName"]');
						
						sizeIn && file.size ? info.append('<input name="Size" type="hidden" value="' + file.size + '"/>') : sizeIn.val(file.size);
						nameIn && file.name ? info.append('<input name="FileName" type="hidden" value="' + file.name + '"/>') : nameIn.val(file.name);
						name.html(file.name || '');
						type.html(file.type || '');
						size.html('文件大小：' + (sizeFormat(file.size) || 0))
					};					
					reader.onloadend = function(evt){ //读取完成触发，无论成功或失败 
						isEmpty = !evt.lengthComputable; //空白状态
						isFreezed = !evt.lengthComputable; //解锁
						buttonStatus( !evt.lengthComputable ); 
						resultMsg(evt.lengthComputable ? '' : '文件读取失败');
					};
					
					reader.readAsBinaryString( file ); //读取为二进制字符串
				}
			});
			
			this.reset = function(){ //重置
				isEmpty = true;
				isFreezed = false;
				targ.find('i').html('');
				trag.find('input').val('');
			}
			
			this.upload = function(){
				if( isEmpty ){
					resultMsg('未选择上传文件');
				}else{
					G.ajax({
						type : 'post',
						url : o.uri,
						data : {FileName:'', Size:'', },
						beforeSend : function(XMLHttpRequest) {
							XMLHttpRequest.upload.addEventListener("progress", function(evt) {
								if(evt.lengthComputable){
						    		var percentComplete = Math.round(evt.loaded / evt.total),
						    	  	  	transfered = sizeFormat(e.loaded);
						        
						    		process.update( percentComplete ); //更新进度条
						    		transfer.html( transfered ); //更新传输量
						        
						    		percentComplete == 100 && resultMsg('上传成功')
						        }
							}, false);
						},
						success: function(data){
							isFreezed = data.success || false;
							resultMsg( '上传' + (data.success ? '成功' : '失败'));
						},
						error: function(){ resultMsg( '上传异常'); }
					});
					!isFreezed && targ.ajaxSubmit({
						beforeSubmit: function(data){
							console.log('before', arguments);
							
							var xhr = new XMLHttpRequest();
							xhr.upload.addEventListener("progress", function(evt){
								console.log(evt);
						    	
						    }, false);
						  },
						  
					});
				}
			};
			
			close.click(function(){ targ.remove(); });
		}
		
		addBtn.click(function(){
			files.push( new FileUpload() );
		});
		
		submitBtn.click(function(){ //开始批量上传
			for(var i = 0; i < files.length; ++ i) 
				files[i].upload();
		});
		
		this.target = target;
	};
	module.exports = Unit;
});