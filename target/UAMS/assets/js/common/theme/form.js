/**
 * 表单组件
 * @auther huyi@zensvision.com
 * @version spin_2.0
 */
;define(function(require, exports, module){
	var G = require('global'),
		View = require('T/view'),
		Unit = require('T/unit');
	
	function Form( _o_ ){
		var o = {tag: 'form', target: '', exist: false, operate:'', uri:'', field: field, ele: {tag:'div', attr:{class:'spin-form'}, content:''}, bind: function(){}};
		G.Extend(o, _o_, false);
		
		var form = new View( o ),
			field = o.field, 
			operate = o.operate, 
			uri = o.uri || '',
			select = o.select || [],
			map = new G.HashMap();
		
		if( operate === 'add' || operate === 'edit' ){
			for(var i = 0; i < field.length; ++i)
				getForm(operate, i);
		}else if( operate === 'part' && uri ){
			var uriBuf = uri,
				params = uriBuf.substring(uriBuf.indexOf('#') + 1).split('&');
			uri = uriBuf.substring(0, uriBuf.indexOf('#'));
			for(var i = 0; i < field.length; ++i)
				for(var j = 0; j < params.length; ++j)
					if(field[i].name === params[j])
						getForm('edit', i);
		}

		function getForm(_operate_, _idx_){
			var o = field[ _idx_ ], 
				type = o.type, 
				value = select.length === 0 ? '' : ( select.length === 1 ? select[0][ o.name ] : null),
				buf;
			
			if( !o.isShow || !type || type === 'sys' || type === 'tag' || ( type === 'INDEX' && _operate_ === 'add' ) || type === 'badge' ) return '';
			
			var html = '<label for="' + o.name + '">' + o.text + '</label>';
			if( type === 'select' ){
				html += '<select class="form-control" name="' + o.name + '">';
				var options = o.value;
				for(var j = 0; j < options.length; ++j)
					html += '<option ' + ( (_operate_ === 'add' && j === 0) || (_operate_ === 'edit' && options[j].value == value) ? 'selected="selected"' : '' ) + ' value="' + options[j].value + '">' + options[j].name + '</option>';
				html += '</select>';
			}else if( type === 'text' || type === 'INDEX' || type === 'creator' || type === 'operator' ){
				html += '<input type="text" class="form-control" name="' + o.name + '" placeholder="' + o.text + '" ' + 
				        ' value="' + ( ( type === 'creator' && _operate_ === 'edit' ) || type === 'operator' ? 'user' : value ) + '" ' + 
				        ( o.readonly ? ' readonly ' : '' ) + 
				        ( o.popover ? 'rel="popover" data-content="' + o.content + '" data-original-title="' + o.title + '" data-regex="' + (o.regex || '') + '"' : '' ) + '>';
			}else if( type === 'email' || type === 'tel' || type === 'date' || type === 'url' ){
				html += '<input type="' + type + '" name="' + o.name + '" placeholder="' + o.text + '" />'
			}
			html += '<div></div><span>' + ( o.sensitive ? '<warn>必填<warn>' : (o.sensAlert ? '<info>' + o.sensAlert + '</info>' : '') ) + '</span>'
			var ele = G.createElement('div', {class:'form-group'}, '', html);
			form.target.append(ele);
			
			switch( type ){
				case 'ajaxSelected':
					o.ajaxUri && G.ajax({url : o.ajaxUri, async:false, timeout : 2000, success : function( data ){
										html = '<select class="form-control" name="' + o.name + '">';
										var options = data, fieldName = o.ajaxField;
										for(var j = 0; j < options.length; ++j)
											html += '<option ' + ( (_operate_ === 'add' && j === 0) || (_operate_ === 'edit' && options[j][ fieldName ] == value) ? 'selected="selected"' : '' ) + ' value="' + options[j].ID + '">' + options[j][ fieldName ] + '</option>';
										html += '</select>';
										G.$(ele).find('span:nth-child(2)').html( html );
									},
								 });
					break;
				case 'switch':
//					var switched = o.switched;
//					formHTML += '<input name="' + o.name + '" id="' + o.name + 'Switch" type="checkBox" switchVal="' + ( route === 'edit' && value ? value : switched.off.value ) + '"/>';
//					switchFields.push({ID:o.name + 'Switch', option : {state:value == switched.on.value, labelWidth:100, handleWidth:100, onText:switched.on.name || 'ON', offText:switched.off.name || 'OFF', onColor:switched.on.cls || 'primary', offColor:switched.off.cls || 'info', onSwitchChange:function(event, state){ $(this).attr('switchVal', state ? switched.on.value : switched.off.value); }}});
//					break;
				case 'item-group': 
					break;
				case 'range-time': 
					break;
				case 'string-array': //默认字符串数组，以’，‘逗号分隔  与 arrayEdit:true; 配合使用来确定是否修改
					map.put( o.name, new Unit.StringArray({target:G.$(ele).find('div:nth-child(2)'), exist:true, operate: _operate_, array: value || '', isEdit: o.arrayEdit}) );
					break;
			}
		}
		
		this.validate = function(){
			return true; //待添加
		}
		
		this.getData = function(){
			var data = {}, 
				item = select[0],
				name = '', value = '', type = '';
			
			for(var i = 0; i < field.length; ++i){
				name = field[i].name,
				value = $('[name="' + name + '"]').val() || '',
				type = field[i].type;
				
				if( field[i].isShow ){
					switch(type){
						case 'ajaxSelected': data[ name ] = $('#' + name + ' option:selected').text() || ''; data[ name + 'ID' ] = value; break;
						case 'switch': data[ name ] = $('[name="' + name + '"]').attr('switchVal'); break;
						//初始值都为数值
						case 'tag': data[ name ] = operate === 'edit' ? item[ name ] : 0; break;
						case 'sys': data[ name ] = operate === 'edit' ? item[ name ] : field[i].value; break;
						case 'string-array': data[ name ] = map.get( name ).getValue();break;
						case 'item-group': break;
						case 'range-time': break;
						default: data[ name ] = value || ''; break;
					}
				}else{
					data[ name ] = operate === 'edit' ? item[ name ] : field[i].value;
				}
			}
			return data;
		}
		
		//--------------------------------route, field, item, uri
//		//组件初始化
//		function moduleInit(){
//			switchFields = switchFields || [];
//			
//			//switch开关组件
//			for(var i = 0; i < switchFields.length; i++)
//				$('#' + switchFields[i].ID).bootstrapSwitch(switchFields[i].option || {}); //bootstrap 方法	
//			switchFields = [];
//			
//			//datetime时间组件
//			if( $(".form-datetime").size() > 0 ){
//				$(".form-datetime").datetimepicker({
//				    format: "mm/dd/yyyy hh:ii",
//				    autoclose: true,
//				    todayBtn: true,
//				    pickerPosition: "bottom-left"
//				});
//			}
//			
//			//组件事件绑定
//			for(var i in module){
//				module[i].bind();
//			}
//		}
//		function error( _msg ){
//			$('#form-warn').html( _msg ? '<span class="glyphicon glyphicon-warning-sign"></span> ' + _msg : '' );
//		}
//		this.draw = function( target ){
//			if( !$(target) ) return false;
//			var html = '';
//			if( route === 'add' || route === 'edit' ){
//				for(var i = 0; i < field.length; ++i){
//					html += getForm(route, i);
//				}
//			}else if( route === 'part' ){
//				var _uri = uri,
//					 fields = _uri.substring(_uri.indexOf('#') + 1).split('&');
//					  _uri = _uri.substring(0, _uri.indexOf('#'));
//				for(var i = 0; i < field.length; ++i){
//					for(var j = 0; j < fields.length; ++j){
//						if(field[i].name === fields[j]){
//							html += getForm('edit', i); 	
//						}								
//					}
//				}								
//			}
//			$(target).html( '<div class="spin-form">' + html + '</div><div id="form-warn"></div>' );
//			moduleInit();
//			//绑定输入检测 bootstrap popover
//			$("#spin-form").find('input').bind('blur', function(){ 
//				var elem = $(this), val = elem.val(), regex = elem.attr('data-regex') || '';
//				if( !regex ){
//					if( !val ){
//						elem.popover({placement:'top'});
//						elem.popover('show');
//					}else{
//						elem.popover('destroy');
//					}
//				}else{
//					//需完善正则判断
//					var reg = new RegExp( regex );
//					if( reg.test(val) ){
//						elem.popover('destroy');
//					}else{
//						elem.popover({placement:'top'});
//						elem.popover('show');
//					}
//				}
//			});
//		};
//		
		//--------------------------------
	}
	
	module.exports = function( _o_ ){
		return new Form( _o_ );
	}
});