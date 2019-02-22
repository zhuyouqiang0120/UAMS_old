/**
 * 表格组件
 * @auther huyi@zensvision.com
 * @version spin_2.0
 */
;define(function(require, exports, module) {
	'use strict';

	var G = require('global'),
		View = require('T/view');

	function List(_o_) {
		var o = {
			tag : 'list',
			target : '',
			exist: false,
			itemClass: '',
			uri: '',
			list: [],
			ele: {tag:'div', attr:{class:'spin-list'}},
			context : function(){},
			bind: function(){}
		};
		G.Extend(o, _o_, false);
		
		var uri = o.uri,
			array = [],
			itemClass = o.itemClass || 'list-item';		
		
		var list = new View(o);
		
		function itemContext(){
			var bodyHtml = '';
			for(var i = 0; i < array.length; ++i)
				bodyHtml += '<div class="' + itemClass + '">' + list.context( array[i] ) + '</div>';
			list.target.html( bodyHtml );
			
			G.isFunction(list.bind) && list.bind( array );
			
			list.target.find( itemClass ).click(function(){
				var idx = G.$(this).index();
				G.isFunction( list.callback ) && list.callback(this, array[idx]);
			});
		}
		
		list.uri ? (function(){
			G.ajax({
				url : list.uri,
				success : function( response ){
					array = response.list; //JFinal返回
					itemContext();
				},
				error : function(req, error){ G.toastr('danger', '获取列表数据错误'); }
			});
		})() : (function(){
			array = list.list;
			itemContext();
		})();
		
		this.target = list.target;
		this.list = function(){ return array; }
	}
	
	module.exports = function( _o_ ){
		return new List( _o_ );
	}
});