/**
 * 分页组件
 * @auther huyi@zensvision.com
 * @version spin_2.0
 */
;define(function(require, exports, module) {
	'use strict';
	
	var G = require('global'),
		View = require('T/view');

	function Pagination(_o_) {
		var o = {
			tag : 'pagination',
			target : '',
			ele: {tag:'div', attr:{class:'spin-pagination'}},
			currPage:1,
			pageSize:16,
			totalPage:1,
			callback: function(){}
		}, self = this;
		G.Extend(o, _o_, false);
		
		var currPage = o.currPage || 1,
			pageSize = o.pageSize,
			totalPage = o.totalPage,
			optionHTML = '';
		
		var num = pageSize;
		for(var i = 1; i < 6; i++){
			num = pageSize * i;
			optionHTML += '<option value="' + num + '">' + num + '</option>'
		}
		o.ele.content = '<ul class="pagination">' +
							'<li><a><span class="icon icon-fast-backward"></span> </a></li>' +
							'<li><a><span class="icon icon-chevron-left"></span> </a></li>' +
							'<li><a><span class="icon icon-chevron-right"></span> </a></li>' +
							'<li><a><span class="icon icon-fast-forward"></span></a></li>' +
						'</ul>' +
						'<div>当前第<span class="label label-info">' + currPage + '</span>页，条目数<select>' + optionHTML + '<select>，共<span class="label label-info">' + totalPage + '</span>页</div>';

		var pagination = new View(o),
			filter = {},
			li0 = pagination.target.find('ul li:nth-child(1)'),
			li1 = pagination.target.find('ul li:nth-child(2)'),
			li2 = pagination.target.find('ul li:nth-child(3)'),
			li3 = pagination.target.find('ul li:nth-child(4)');
		
		setStatus( currPage );
		//	事件绑定
		pagination.target.find('div>select').change(function(){
			pageSize = parseInt( G.$(this).val() );
			filter.pageSize = pageSize;
			jump();
		});
		pagination.target.find("ul li").click(function(){
			var	idx = G.$(this).index(),
				newPage;
			
			switch(idx){
				case 0: newPage = 1; break;
				case 1: newPage = currPage - 1 < 1 ? 1 : currPage - 1; break;
				case 2: newPage = currPage + 1 > totalPage ? totalPage : currPage + 1; break;
				case 3: newPage = totalPage; break;
			}
			currPage !== newPage && ( setStatus(newPage), jump() );
		});
		
		function setStatus( page ){
			if(totalPage === 1){ 
				pagination.target.find('ul li').attr('class', 'disabled');
				return;
			}
			
			currPage = page || 1;
			pagination.target.find('div span:first-of-type').text( currPage );
			
			if(currPage == 1){
				li0.attr('class', 'disabled');
				li1.attr('class', 'disabled');
				li2.attr('class', 'active');
				li3.attr('class', 'active');
			}else if(currPage > 1 && currPage < totalPage){
				pagination.target.find('ul li').attr('class', 'active');
			}else{
				li0.attr('class', 'active');
				li1.attr('class', 'active');
				li2.attr('class', 'disabled');
				li3.attr('class', 'disabled');
			}
		}
		function jump(){
			filter.currPage = currPage || 1;
			G.isFunction(pagination.callback) && pagination.callback(0, filter);
		}
		this.setPage = function( v ){
			setStatus( v );
			return this;
		}
		this.setTotalPage = function( v ){
			totalPage = v || 1;
			pagination.target.find('div span:last-of-type').text(v);
			return this;
		}
		this.setStatus = function(v){ filter = v || {}; }
	}
	
	module.exports = function( _o_ ){
		return new Pagination( _o_ );
	}
});