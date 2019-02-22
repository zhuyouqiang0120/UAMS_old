/**
 * 组组件
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

	function Group(_o_) {
		var o = {
			tag : 'group',
			target : '',
			exist: false,
			isNeedCheck: false, //是否需要选中框
			itemClass: '',
			ele: {tag:'div', attr:{class:'spin-group-box'}},
			context : function(){},
			bind: function(){},
			callback: function(){}
		}, time = new G.Time(), totalPage = 0;
		G.Extend(o, _o_, false);
		
		if( !o.uri ){
			G.toastr('warning', '获取数据请求地址为空!');
			return false;
		}
		
		var guid = G.GUID('group'),
			isAllowMulit = o.isAllowMulit || false,
			isNeedCheck = o.isNeedCheck || false,
			uri = o.uri,
			util = o.util,
			field = o.field || [],
			currPage = o.currPage || 1,
			pageSize = o.pageSize || 16,
			itemClass = o.itemClass || 'group-item',
			selectItems = [],
			list;
		
		//初始化表格组件容器
		o.ele.content = (G.isObject(util) && util.length > 0 ? '<div class="spin-util"><div class="btn-group left"></div><div class="btn-group right"></div></div>' : '') +
						'<div class="spin-group"></div>';
		
		var group = new View(o),
			button = new Button({
				exist: true,
				target: group.target.find('div.spin-util'),
				extend: group.extend,
				util: util,
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
				target: group.target,
				currPage: currPage,
				totalPage: totalPage,
				pageSize: pageSize,
				ele: {tag:'div', attr:{class:'spin-pagination'}},
				callback: function(direct, filter){
					data(direct, filter);
				}
			});
		
		//多选选择事件绑定
		if( isAllowMulit && isNeedCheck ){
			group.target.find('div.' + itemClass).click(function(){
				var span = group.target.find('div.' + itemClass + '>check.icon');
				if(G.$(this).find('check.icon').hasClass('icon-check')){
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

		//初始化绘制组
		data(0);

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
				data: {currPage: currPage, pageSize: pageSize, orderCase: filter.orderCase || o.orderCase, sifter: filter.sifter ? filter.sifter + (o.sifter ? ',' + o.sifter : '') : (o.sifter || '')},
				success : function( response ){
					list = response.list; //JFinal返回
					totalPage = response.totalPage || 1;
					
					pagination.setTotalPage( totalPage ).setPage( currPage ).setStatus( filter );
					
					group.target.find('div.spin-text-warning').remove();
					if( list.length === 0 ) {
						group.target.append('<div class="spin-text-warning">组数据为空...</div>');
						group.target.find('.spin-group').hide();
						group.target.find('.spin-pagination').hide();
					}else{
						group.target.find('.spin-warn').remove();
						group.target.find('.spin-group').show();
						group.target.find('.spin-pagination').show();
					}
					
					var bodyHtml = '';
					for(var i = 0; i < list.length; ++i)
						bodyHtml += '<div class="' + itemClass + '">' + ( isNeedCheck ? '<check class="icon icon-unchecked"></check>' : '' ) + group.context( list[i] ) + '</div>';
					group.target.find('.spin-group').html( bodyHtml );	
					
					G.isFunction( group.bind ) && group.bind( list );
					//选中条目事件绑定 
					group.target.find('div.' + itemClass).click(function(){
						var idx = G.$(this).index();
						if( isNeedCheck ){
							var	span = G.$(this).find('check.icon');
							
							if( !isAllowMulit ){
								group.target.find('div.' + itemClass + '>check.icon').attr('class', 'icon icon-unchecked');
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
						}
						G.isFunction( group.callback ) && group.callback( this, list[idx] );
					});
				},
				error : function(req, error){ G.toastr('danger', '获取组数据错误'); }
			});
		};
		 
		this.target = group.target;
		this.list = function(){ return list; }
		this.refresh = function(direct, filter){ data(direct, filter); }
	}
	
	module.exports = function( _o_ ){
		return new Group( _o_ );
	}
});