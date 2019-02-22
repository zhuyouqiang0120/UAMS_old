/**
 * view 所有视图基类
 * 以此衍生其他部件
 * 
 * @author huyi@zensvision.com
 * @date 2016-01-29
 * @version spin_2.0
 */
;define(function(require, exports, module){
	'use strict';
	var G = require('global'),
		time = new G.Time();
	
	function View( _o_ ){
		var o = {tag:'', debug:false, target:'', ele: { tag:'', content:'', attr:{}, css:{} }, before:function(){}, init:function(){}, after:function(){}},
			currTime = time.current().millis();
		
		G.Extend(o, _o_); //copy
		for(var obj in o){
			//方法继承
			G.isFunction( obj ) ? obj.apply(this) : this[ obj ] = o[obj]; //属性记录
		}
		
		this.guid = G.GUID(this.tag.replace(' ', '_'));
		if( this.exist ){
			this.target.attr('id', this.guid);
			!G.$.isEmptyObject(this.ele.attr) && this.target.attr(this.ele.attr);
			this.ele.content && this.target.html( this.ele.content );
		}else{
			var ele = G.createElement(this.ele.tag, this.ele.attr, this.ele.css, this.ele.content);
			ele.id = this.guid;
			
			this.target.append(ele);
		}
		this.target = G.$('#' + this.guid);

		//init before...
		this.before();
		
		//function init...
		G.isFunction(this.init) && this.init(); //初始化
		
		//init after...
		this.after();
		
		this.debug && this.log( this.tag + ' init post: ' + (time.current().millis() - currTime) + ' ms');
	};
	
	View.prototype = {
		log : function( info ){
			console.log( info );
		}
	};
	
	module.exports = function( _o_ ){
		return new View( _o_ );
	};
});