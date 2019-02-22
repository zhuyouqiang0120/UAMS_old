/**
 * Panel 布局窗体组件
 * @auther huyi@zensvision.com
 * @version spin_2.0
 */
;define(function(require, exports, module){
	var G = require('global'),
		view = require('T/view');
	
	function Panel( _o_ ){
		var head_class = 'panel-head',
			body_class = 'panel-body',
			foot_class = 'panel-foot',
			o = {
				tag : 'panel',
				target : '',
				ele : {tag:'div', class:'panel'},
			};
		G.Extend(o, _o_);
		
		var panel = new view( o ),
			title = G.$(panel.target).attr( head_class ),
			footFlag = G.$(panel.target).attr( foot_class ),
			head = title ? '<div class="' + head_class + '">' + title + '</div>' : '',
			body = '<div class="' + body_class + '">' + G.$(panel.target).html() + '</div>',
			foot = footFlag == 'true' ? '<div class="' + foot_class + '"></div>' : '';
		
		G.$(panel.target).html( head + body + foot );
		
		this.target = panel.target;
		this.head = function( _h_ ){
			return _h_ !== undefined ? G.$(panel.target).find( '.panel-head' ).html( _h_ ) : G.$(panel.target).find( '.panel-head' );
		};
		this.body = function( _b_ ){
			return _b_ !== undefined ? G.$(panel.target).find( '.panel-body' ).html( _b_ ) : G.$(panel.target).find('.panel-body' );
		};
		this.foot = function( _f_ ){
			return _f_ !== undefined ? G.$(panel.target).find( '.panel-foot' ).html( _f_ ) : G.$(panel.target).find('.panel-foot' );
		};
		
		//callback
		this.callback = function( _callback_ ){
			G.isFunction( _callback_ ) && _callback_.call(this); 
		};
	}
	
	module.exports = function( _o_ ){
		return new Panel( _o_ );
	};
});