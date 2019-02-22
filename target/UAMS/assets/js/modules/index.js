/**
 * 单页面入口
 * @author huyi@zensvision.com
 * @version spin_2.0
 */
;define(function(require, exports, module){
	var G = require('global'), 
		Panel = require('T/panel'),
		Menu = require('T/menu'),
		Table = require('T/table'),
		Unit = require('T/unit');
	
	window._Static_ = new G.HashMap(); //记录全局重要变量
	
	var verify = G.getUrlParam('verify');
	
	if( verify ){
		//窗体调整
		G.$('._wrap_>.header').remove();
		G.$('._wrap_>.main>.left').remove();
		G.$('._wrap_>.footer').remove();
		G.$('._wrap_>.main').css({'width': '100%', 'max-width': '100%', 'height':'100%', 'max-height':'100%'});
		G.$('._wrap_>.main>.center').css({'width': '100%', 'max-width': '100%','height':'100%', 'max-height':'100%'});
	}
	
	var indexPanel = new Panel({
		exist: true,
		target: G.$('.panel.index'),
	}),
	menuPanel = new Panel({
		tag: 'menu panel',
		exist: true,
		target: G.$('.panel.menu'),
		init : function(){
			G.ajax({
				url : 'menu',
				success : function( response ){
					var menu = new Menu({
						target: menuPanel.target.find('div.panel-body'),
						list: response,
					});
					
					var modal = new Unit.Modal({ target: G.$('body') });
					
					_Static_.put('modal', modal);
					_Static_.put('indexPanel', indexPanel); //记录主panel为全局变量
					
					if( verify ){//uams认证
						indexPanel.body('<div><span class="spin-text-info">认证不通过，暂无操作权限</span></div>');
						
						var uName = G.getUrlParam("uName"),
							uSession = G.getUrlParam("uSession");
						
						uName && uSession && G.ajax({
							url: controller.auth,
							data: {uName: uName, uSession: uSession},
							dataType: 'jsonp',
							jsonp: 'jsoncallback',
							success: function(res){
								res.result == 1 ? (function(){
									var config = controller[ 'media_' + verify ];
									
									indexPanel.head( verify === 'manage' ? '媒资管理' : '媒资编单' );
									indexPanel.body('');
									if( config.type === 'table' ){
										config.conf.exist = false;
										config.conf.target = indexPanel.target.find('div.panel-body');
										
										_Static_.put('table', new Table( config.conf )); //表格模式需要记录表格当前主体对象到全局变量
									}else if( config.type === 'extend' ){
										require.async(config.conf.extend, function( a ){
											a.init( config.conf );
										});
									}
								})() : indexPanel.body('<span class="spin-text-info">认证不通过，暂无操作权限</span>');
							},
							error: function(){ indexPanel.body('<span class="spin-text-info">认证不通过，暂无操作权限</span>'); }
						});
					}else{
						menu.bind(function( _route_, _title_ ){
							var config = controller[ _route_ ];
							
							if( !config || !config.type ){
								modal.title( _title_ ).body('<div class="spin-text-info">该功能正在开发设计中......</div>' ).show();
								return false;
							}
							
							indexPanel.head( _title_ );
							indexPanel.body('');
							if( config.type === 'table' ){
								config.conf.exist = false;
								config.conf.target = indexPanel.target.find('div.panel-body');
								
								_Static_.put('table', new Table( config.conf )); //表格模式需要记录表格当前主体对象到全局变量
							}else if( config.type === 'extend' ){
								require.async(config.conf.extend, function( a ){
									a.init( config.conf );
								});
							}
						});
					}
				}
			});
		}
	});
	
});