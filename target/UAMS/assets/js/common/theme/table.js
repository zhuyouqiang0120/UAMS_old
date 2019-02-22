/**
 * 表格组件
 * @auther huyi@zensvision.com
 * @version spin_2.0
 */
;define(function(require, exports, module) {
	'use strict';

	var G = require('global'),
		View = require('T/view'),
		Button = require('T/button'),
		Pagination = require('T/pagination'),
		Unit = require('T/unit');

	function Table(_o_) {
		var o = {
			tag : 'table',
			target : '',
			exist: false,
			ele: {tag:'div', attr:{class:'spin-table-box'}}
		}, time = new G.Time(), totalPage = 0;
		G.Extend(o, _o_, false);
		
		if( !o.uri ){
			G.toastr('warning', '获取数据请求地址为空!');
			return false;
		}
		
		var guid = G.GUID('table'),
			isAllowMulit = o.isAllowMulit || false,
			uri = o.uri,
			field = o.field,
			util = o.util,
			currPage = o.currPage || 1,
			pageSize = o.pageSize || 16,
			selectItems = [],
			list;
		
		var headHtml = '<tr><td width="3%"><span class="icon icon-unchecked"></span></td>';
		for(var j = 0; j < field.length; ++ j){
			if( field[j].isShow ){
				headHtml += '<td width="' + field[j].weight + '%">' + field[j].text +
								(field[j].isSort ? '&nbsp;<button type="button" field="' + field[j].name + '" class="btn btn-link btn-xs">' +
														'<span class="icon icon-menu-down"></span>' +
													'</button>' : '') +
							'</td>';
			}
		}
		headHtml += '</tr>';
		//初始化表格组件容器
		o.ele.content = '<div class="spin-util"><div class="btn-group left"></div><div class="btn-group right"></div></div>' +
						'<table class="spin-table">' + 
						  	'<thead>' + headHtml + '</thead>' + 
							'<tbody id="body-' + guid + '"></tbody>' + 
					    '</table>';
		
		var table = new View(o),
			button = new Button({
				exist: true,
				route: o.route || '',
				target: table.target.find('div.spin-util'),
				extend: table.extend,
				util: table.util,
				callback: function( _item_ ){
					var self = this,
						util = _item_[0];
					
					return util.type === 'search' ? ( (function(){
						data( 0, _item_[1] );
					})() ) : ( (function(){
						var selects = [];
						for(var i = 0; i < selectItems.length; ++ i)
							selects.push(list[ selectItems[i] ]);
						
						self.operate( util, field, selects, function(direct, filter){
							data(direct, filter);
						});
					})() );
				}
			}),
			pagination = new Pagination({
				route: o.route || '',
				target: table.target,
				currPage: currPage,
				totalPage: totalPage,
				pageSize: pageSize,
				ele: {tag:'div', attr:{class:'spin-pagination'}},
				callback: function(direct, filter){
					data(direct, filter);
				}
			});
		
		//多选选择事件绑定
		if( isAllowMulit ){
			table.target.find('table thead tr td:nth-child(1)').click(function(){
				var span = table.target.find('table tr td:nth-child(1)').find('span');
				if(G.$(this).find('span').hasClass('icon-check')){
					span.attr('class', 'icon icon-unchecked');
					selectItems = [];
				}else{
					span.attr('class', 'icon icon-check');
					for(var i = 0; i < list.length; i ++){
						selectItems.push( list[i].ID );
					}
				}
			});
		}
		//按照字段排序事件绑定
		table.target.find('table thead tr td button').click(function(){
			var name = $(this).attr('field'),
				filter = {};
			if( !name ) return false;

			var span = $(this).find('span');
			if( span.hasClass('icon-menu-down') ){
				span.attr('class', 'icon icon-menu-up');
				name += ' ASC';
			}else{
				span.attr('class', 'icon icon-menu-down');
				name += ' DESC';
			}
			filter.orderCase = name;
			data(0, filter);
		});
		//初始化绘制表格
		data(0);
		
		function except( flag, info ){//异常呈现
			if(flag){
				table.target.append('<div class="spin-text-warning">' + (info || '表格数据为空...') + '</div>');
				table.target.find('.spin-table').hide();
				table.target.find('.spin-pagination').hide();
			}else{
				table.target.find('.spin-text-warn').remove();
				table.target.find('.spin-table').show();
				table.target.find('.spin-pagination').show();
			}
		}
		//获取表格数据
		function data( direct, filter ){
			if( !uri ) return false;
			filter = filter || {};
			
			currPage = filter.currPage ? filter.currPage : direct;
			currPage = currPage > totalPage ? totalPage : (currPage < 1 ? 1 : currPage );
			pageSize = filter.pageSize || pageSize;
			selectItems = [];
			
			G.ajax({
				url : filter.uri || uri,
				data: {route:o.route || '', currPage: currPage, pageSize: pageSize, orderCase: filter.orderCase || o.orderCase, sifter: filter.sifter ? filter.sifter + (o.sifter ? ',' + o.sifter : '') : (o.sifter || '')},
				success : function( response ){
					list = response.list; //JFinal返回
					totalPage = response.totalPage || 1;
					
					pagination.setTotalPage( totalPage ).setPage( currPage ).setStatus( filter );
					
					table.target.find('div.spin-text-warning').remove();
					
					except(list.length === 0, '表格数据为空...');
					
					var bodyHtml = '';
					for(var i = 0; i < list.length; ++i){
						bodyHtml += '<tr><td><span class="icon icon-unchecked"></span></td>';
						for(var j = 0; j < field.length; ++j){
							var value = list[i][field[j].name];
							if( field[j].isShow ){
								switch( field[j].type ){
									case 'tag':
									case 'switch':
										bodyHtml += '<td>' + ( field[j].value[ list[i][field[j].name] ] ) + '</td>'; break;
									case 'linkBtn':
										var addr = list[i][field[j].name];
										bodyHtml += '<td><button ' + (addr == '' ? 'disabled="disabled"' : '') + 'class="btn btn-primary btn-xs" onclick="window.open(\'' + addr  + '\');"><span class="icon icon-search"></span> 查看</button></td>';
										break;
									case 'select': bodyHtml += '<td>' + ( field[j].css[ value ] || value )  + '</td>'; break;
									case 'badge': bodyHtml += '<td><span class="badge">' + ( value || '' ) + '</span></td>'; break;
									case 'rangetime':
										value = value ? eval('(' + value + ')') : {start:'', end:''};
										bodyHtml += !value.end || ( value.end > time.current.format('yyyy/MM/dd hh:mm:ss') ) ? '<td><span class="label label-info">有效</span></td>' : '<td><span class="label label-danger">过期</span></td>';
										break;
									default: bodyHtml += '<td>' + ( value || '' ) + '</td>'; break;
								}
							}
						}
						bodyHtml += '</tr>';
					}
					G.$('#body-' + guid).html( bodyHtml );	

					//选中条目事件绑定
					table.target.find('table tbody tr').click(function(){
						var idx = G.$(this).index(), 
							span = G.$(this).find('td:nth-child(1)>span');
						
						if( !isAllowMulit ){
							table.target.find('table tr td:nth-child(1)>span.icon-check').attr('class', 'icon icon-unchecked');
							selectItems = [];
						}
						
						if(span.hasClass('icon-check')){
							span.attr('class', 'icon icon-unchecked');
							var buf = [];
							for(var i = 0; i < selectItems.length; i ++){
								if( idx !== selectItems[i] )
									buf.push( selectItems[i] );
							}
							selectItems = buf;
						}else{
							span.attr('class', 'icon icon-check');
							selectItems.push( idx );
						}
					});
				},
				error : function(req, error){
					except(true, '获取表格数据错误');
					G.toastr('danger', '获取表格数据错误');
				}
			});
		};
		
		this.target = table.target;
		this.list = function(){ return list; }
		this.select = function(){ return selectItems; }
		this.refresh = function(direct, filter){ data(direct, filter); }
	}
	
	module.exports = function( _o_ ){
		return new Table( _o_ );
	}
});