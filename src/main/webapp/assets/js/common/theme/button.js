/**
 * 按钮组件
 * @auther huyi@zensvision.com
 * @version spin_2.0
 */
;define(function(require, exports, module){
	'use strict';
	
	var G = require('global'),
		View = require('T/view'),
		Unit = require('T/unit'),
		Form = require('T/form');
	
	function Button( _o_ ){
		var self = this,
			o = {
				tag:'button', 
				route : '',
				ele: {tag:'div', attr:{class:'spin-util'}, content:'<div class="btn-group left"></div><div class="btn-group right"></div>'}, 
				target:'', 
				extend:'',
				util:[], 
				callback:function(){}
			};
		G.Extend(o, _o_, false);
		
		if( !o.util || !G.isObject(o.util) || o.util.length == 0) return false;

		var button = new View(o),
			util = button.util,
			extend, item;
		
		button.extend && require.async( button.extend, function(a){ extend = a; } );
		
		for(var i = 0; i < util.length; ++i){
			item = util[i];
			switch( item.type ){
				case 'btn': 
					new Unit.Button({target:button.target.find('div.' + item.direct), util:item, callback:function(){ o.callback.call(self, arguments); }});
					break;
				case 'btnG':
					new Unit.ButtonGroup({target:button.target.find('div.' + item.direct), util:item, callback:function(){ o.callback.call(self, arguments); }});
					break;
				case 'link': break;
				case 'search': 
					new Unit.Search({target:button.target.find('div.' + item.direct), util:item, callback:function(){ o.callback.call(self, arguments); }});
					break;
			}
		}
		
		var modal = G.Global('modal') || new Unit.Modal({target:button.target.parent().parent(), showFooter: true });
		//callback 为上层代理回调，例如表格、组更新主数据方法
		this.operate = function( button, field, selectItems, callback ){
			var buttonUri = button.uri,
				buttonName = button.name,
				premise = button.premise, 
			  	currItem = {}, operateFlag = false, param = '', warn = '';
			
			modal.title( '<span class="' + button.icon + '"></span> ' + buttonName );
			//请求前提判断
			if( premise ){
				operateFlag = true;
				for(var j = 0; j < selectItems.length; ++j){
					currItem = selectItems[j];
					for(var i = 0; i < premise.length; ++i){
						if( premise[i].type ){
							if( premise[i].type === 'rangetime' ){
								var rangeTime = currItem[ premise[i].name ],
									rangeTime = typeof rangeTime === 'string' ? eval('(' + rangeTime + ')') : rangeTime ;
								if( ( rangeTime.end > spin.time.getCurrTime() ) === premise[i].value ){
									//提示
									G.toastr('info', 'ID为  ' + currItem.ID + ' 的' + premise[i].debug );
									return;
								}
							}
						}else{
							if( currItem[ premise[i].name ] === premise[i].value ){
								//提示
								G.toastr('info', 'ID为  ' + currItem.ID + ' 的' + premise[i].debug );
								return;
							}
						}
					}
				}
			}
			
			var form, obj = {target:modal.target.find('.modal-body'), select: selectItems, operate: button.func, uri: button.uri, showFooter: true};
			
			modal.target.find('.modal-body').html('');
			param = '', warn = '';
			switch( button.func ){
				case 'add': 
				case 'edit':
				case 'part'://针对部分字段数据更改
				case 'direct': //分析uri获取选中条目的某个参数并传递到请求-->支持单条数据操作时
					if( selectItems.length === 1 || button.func === 'add' ){
						if( button.func !== 'part'){
							obj.field = field;
							form = new Form( obj );
							operateFlag = true;
						}else if( button.func === 'part' ){
							currItem = selectItem[0];
							if( buttonUri.indexOf('#') > -1 ){
								var buf = [], params = buttonUri.substring(buttonUri.indexOf('#') + 1).split('&');
								for(var i = 0; i < field.length; ++ i)
									for(var j = 0; j < params.length; ++ j)
										if(params[j] === field[i].name)
											buf.push( field[i] );
								o.field = buf;
								form = new Form( obj ); //获取部分字段form
								operateFlag = true;
							}
						}else if( button.func === 'direct' ){
							var fields, currItem = selectItems[0] || {};
							
							if(buttonUri.indexOf('>') > 0){
								fields = buttonUri.split('>');
								buttonUri = fields[0];
								
								param = '{';
								for(var i = 1; i < fields.length; i++){
									if( fields[i] ){
										param += '\'' + fields[i] + '\':\'' + currItem[ fields[i] ] + '\'';
										if(i != fields.length - 1){
											param += ',';
										}
									}
								}
								param += '}';
							}
							modal.show().bind(function(){ ajax( buttonName, buttonUri, eval('(' + param + ')'), callback(1) ); });
							return;
						}
					}else if( selectItems.length === 0 ){
						warn = '请先选择您需要 ' + buttonName + ' 的信息~';
					}else{
						warn = '只能选择一条信息' + buttonName + '~';
					}
					break;
				case 'remove': 
				case 'delete':
				case 'submit': //对多条进行操作，传递参数：集合 ID
					if(selectItems.length === 0){
						warn = '请先选择您需要' + buttonName + '的信息~';
					}else{
						operateFlag = true;
						warn = '是否确定' + buttonName + '当前选中的 ' + selectItems.length + ' 条数据？';
					}
					break;
				case 'refresh': //直接执行请求，获取新的table数据
					if( buttonUri ){
						callback( 1, {uri:buttonUri} );
						return;
					}else{
						warn = '请求地址为空~';
					}
					operateFlag = false;
					break;
				case 'search':
					operateFlag = false;
					break;
				case 'extend': //对数据执行扩展方法
					operateFlag = false;
					
					var conf = button.extend || {};
					if( conf.item === 'none' ){
						extend[conf.entry]( button );
						return false;
					}else if( conf.item === 'single' ){
						if( selectItems.length === 1 ){
							extend[conf.entry]( button, selectItems[0] );
							return false;
						}else{
							warn = selectItems.length === 0 ? '请先选择您需要 ' + buttonName + ' 的信息~' : '请只选择一条信息进行操作~';
						}
					}else if( conf.item === 'mulit' ){
						if(selectItems.length === 0){
							warn = '请先选择您需要 ' + buttonName + ' 的信息~';
						}else{
							extend[conf.entry]( button, selectItems );
							return false;
						}
					}
			}
			
			if( operateFlag ){
				if(button.func === 'add' || button.func === 'edit' || button.func === 'part'){
					modal.show().bind(function(){
						param = form ? form.getData() : false;
						param && !G.$.isEmptyObject(param) && ajax(buttonName, buttonUri, param, function(){ callback(1); });
					});
				}else{
					modal.body( warn ).bind(function(){
						param = '{"ids" : "';
						for(var i = 0; i < selectItems.length; ++i){
							//此处默认删除是按照主键[ primaryKey ]，如需拓展可根据field中type=INDEX参数进行判断
							param += selectItems[i].ID;
							if(i != selectItems.length - 1){
								param += ',';
							}
						}
						param = eval('(' + param + '"})');
						!G.$.isEmptyObject(param) && ajax(buttonName, buttonUri, param, function(){ callback(1); });
					}).show();
				}
			}else{
				G.toastr('warning', warn);
			}
		}
		
		function ajax(name, uri, data, callback){
			if( !uri ) return false;
			
			G.ajax({ url: uri, data: data, 
				beforeSend: function(xhr){ xhr.setRequestHeader("TableRoute", o.route || ''); },
				success: function( response ){ 
					G.toastr( response.success ? 'success' : 'danger', name + (response.success ? '成功' : '失败') );
					response.success && G.isFunction(callback) && callback();
					modal.hide();
				},
				error:function(){ G.toastr('danger', name + '异常'); }
			});
		}
	};
	
	module.exports = function( _o_ ){
		return new Button( _o_ );
	}
});