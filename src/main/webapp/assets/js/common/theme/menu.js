/**
 * 菜单组件
 * @auther huyi@zensvision.com
 * @version spin_2.0
 */
;define(function(require, exports, module){
	var view = require('T/view'),
		G = require('global');
	
	function Menu( _o_ ){
		var o = {
			tag: 'menu',
			target: '',
			exist: false,
			ele: {tag:'div', attr:{class:'spin-menu'}},
			list: []
		};
		G.Extend(o, _o_);
		
		//menu html
		function menuTOhtml( guid, obj, map ){
			if( !G.isObject(obj) ) return obj;
			
			var html = '', next = null;
			for(var i = 0; i < obj.length; ++ i){
				next = map.get( obj[i].ID );
				html += next == null ? '<li><a href="javascript:void(0)" menu-bind="' + guid + '" menu-index="' + obj[i].Uri + '"><span class="' + obj[i].Icon + '"></span> ' + obj[i].Name + '</a></li>' 
									 : '<li><a href="javascript:void(0)" class="menu-dropdown"><i class="' + obj[i].Icon + '"></i> ' + obj[i].Name + '<i class="right icon icon-menu-down"></i></a><ul class="submenu">' + menuTOhtml(guid, next, map) + '</ul></li>';
			}
			return html;
		}
		
		if( o.list.length == 0 ){
			console.log('menu list is empty.');
			return false;
		} 
		
		var menuMap = new G.HashMap(),
			array;
		for(var i = 0; i < o.list.length; ++ i){
			array = menuMap.get( o.list[i].Code ) || [];
			if( o.list[i].Open == 1 ){
				array.push( o.list[i] );
				menuMap.put( o.list[i].Code, array );				
			}
		}
		
		var indexMenu = menuMap.get( 0 ),  //父级菜单
			guid = G.GUID('menu');
		o.ele.content = '<ul class="menu">' + menuTOhtml(guid, indexMenu, menuMap) + '</ul>';
		
		var menu = new view(o);
		
		menu.target.find('.menu-dropdown').click(function(){
			var ul = G.$(this).next('ul');
			if( ul.is(':visible') ){
				ul.slideUp();
				G.$(this).find('.right').addClass('rotate');
			}else{
				ul.slideDown();
				G.$(this).find('.right').removeClass('rotate');
			}
		});
		
		//bind evt 用于链接回调方法
		this.bind = function( _callback_ ){
			G.$('[menu-bind="' + guid + '"]').click(function(){
				G.$('a.active').removeClass('active');
				G.$(this).addClass('active');
				
				var menuIndex = G.$(this).attr('menu-index');
				G.isFunction( _callback_ ) && _callback_( menuIndex, G.$(this).html() );
			});
		}
	}
	
	module.exports = function( _o_ ){
		return new Menu( _o_ );
	}
});