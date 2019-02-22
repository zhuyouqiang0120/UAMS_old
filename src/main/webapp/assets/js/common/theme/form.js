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
		form.target.append('<error class="spin-text-warning" style="display:none;color:#D62C2C;"></error>');

		function getForm(_operate_, _idx_){
			var o = field[ _idx_ ], 
				isAdd = _operate_ === 'add',
				isEdit = _operate_ === 'edit',
				type = o.type, 
				value = select.length === 0 ? '' : ( select.length === 1 ? select[0][ o.name ] : null),
				buf;
			
			if( (o.isIn && type !== 'tag' && type !== 'sys') || (type === 'INDEX' && isEdit) ){ //避免配置错误，故加多级判断
				var html = '<label for="' + o.name + '">' + o.text + '</label>';
				if( type === 'select' ){
					html += '<select class="form-control" name="' + o.name + '">';
					var options = o.value;
					for(var j = 0; j < options.length; ++j)
						html += '<option ' + ( (isAdd && j === 0) || (isEdit && options[j].value == value) ? 'selected="selected"' : '' ) + ' value="' + options[j].value + '">' + options[j].name + '</option>';
					html += '</select>';
				}else if( type === 'text' || type === 'INDEX' ){
					html += '<input type="text" class="form-control" name="' + o.name + '" placeholder="' + o.text + '" ' + (isEdit ? 'value="' + value + '" ' + ( o.readonly ? ' readonly ' : '' ) + '' : '') + '>';
				}else if(type === 'date' || type === 'datetime' || type === 'time' || type === 'week' || type === 'datetime-local'){//时间 h5
					html += '<input type="' + type + '" class="form-control" name="' + o.name + '" placeholder="' + o.text + '" ' + (isEdit ? 'value="' + value + '" ' + ( o.readonly ? ' readonly ' : '' ) + '' : '') + '/>'
				}else if( type === 'email' || type === 'tel' || type === 'url'){// h5
					html += '<input type="' + type + '" class="form-control" name="' + o.name + '" placeholder="' + o.text + '" ' + (isEdit ? 'value="' + value + '" ' + ( o.readonly ? ' readonly ' : '' ) + '' : '') + '/>'
				}else if(type === 'range' || type === 'number'){// h5
					html += '<input type="' + type + '" min="' + o.min + '" max="' + o.max + '" class="form-control" name="' + o.name + '" ' + (isEdit ? 'value="' + value + '" ' + ( o.readonly ? ' readonly ' : '' ) + '' : '') + ' placeholder="' + o.text + '" />'
				}else if(type === 'guid'){//自动生成序列号
					html += '<input type="' + type + '" class="form-control" name="' + o.name + '" value="' + (isEdit ? value : G.GUID()) + '" ' + ( o.readonly ? ' readonly ' : '' ) + '/>'
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
					case 'switch': break;
					case 'string-array': //默认字符串数组，以’，‘逗号分隔  与 arrayEdit:true; 配合使用来确定是否修改
						map.put( o.name, new Unit.StringArray({target:G.$(ele).find('div:nth-child(2)'), exist:true, operate: _operate_, array: value || '', isEdit: o.arrayEdit}) );
						break;
				}
			}
		}
		
		function validate( _field_, _value_){
			var txt = _field_.text, warn, flag = true;
			if(_value_ && _field_.regex){
				//需完善正则判断
				var reg = new RegExp( _field_.regex );
				if( !reg.test(_value_) ){
					warn = txt + '格式不正确...';
					flag = false;
				}
			}else if( !_value_ ){
				warn = txt + '不能为空...';
				flag = false;
			}
			
			if(!flag){
				form.target.find('[name="' + _field_.name + '"]').focus();
				form.target.find('error').html( warn );
			}
			return flag;
		}
		
		this.getData = function(){
			var data = {}, 
				item = select[0],
				name = '', value = '', type = '', buf = '';
			
			for(var i = 0; i < field.length; ++i){
				name = field[i].name,
				value = $('[name="' + name + '"]').val() || '',
				type = field[i].type;
				
				if( field[i].isIn && type !== 'sys' && type !== 'tag' && type !== 'INDEX' ){
					switch(type){
						case 'ajaxSelected': data[ name ] = $('#' + name + ' option:selected').text() || ''; data[ name + 'ID' ] = value; break;
						case 'switch': data[ name ] = $('[name="' + name + '"]').attr('switchVal'); break;
						case 'string-array': data[ name ] = map.get( name ).getValue();break;
						default: data[ name ] = value || ''; break;
					}
				}else{
					switch(type){
						//初始值都为数值
						case 'INDEX': operate === 'edit' && (data[ name ] = item[name]); break;
						case 'tag': data[ name ] = operate === 'edit' ? item[ name ] : 0; break;
//						case 'sys': data[ name ] = operate === 'edit' ? item[ name ] : field[i].value ; break;
						default: data[ name ] = operate === 'edit' ? item[ name ] : field[i].value; break;
					}
				}
				
				if( field[i].sensitive ){ //校验
					if( !validate(field[i], data[name]) ){
						form.target.find('error').show();
						return false;
					}else{
						form.target.find('error').hide();
					}
				}
			}
			return data;
		}
	}
	
	module.exports = function( _o_ ){
		return new Form( _o_ );
	}
});