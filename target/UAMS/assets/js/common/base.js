/**
 * 组件基类、工具包
 * @auther huyi@zensvision.com
 * @version spin_2.0
 */
;define(function(require, exports, module){
	'use strict';
	var jquery = require('jquery'),
		jform = require('jform'),
		global = {
			$ : jquery,
			isFunction : function(o) {
				return typeof o === 'function' ? true : false;
			},
			isString : function(o) {
				return typeof o === 'string' ? true : false;
			},
			isObject : function(o) {
				return typeof o === 'object' ? true : false;
			},
			GUID : function(unit){
				var strs = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
					gid = '';
			    for (var i = 0; i < 12; i++)
			        gid += strs.charAt( Math.floor(Math.random() * 0x24) );
				return (unit || 'spin') + '_' + gid;
			},
			createElement : function( tag, attr, css, content ){
				var ele = document.createElement( tag || 'div' );
				
				if( this.isObject(attr) )
					for(var i in attr)
						ele.setAttribute(i, attr[i]);
				if( this.isObject(css) )
					for(var i in css)
						ele.style[i] = css[i];
				
				content && (ele.innerHTML = content);
				return ele;
			},
			//obj to string
			objTOstr : function( obj ){
				if( !this.isObject( obj ) ) return obj;
				
				var str = '{';
				for(var i in obj)
					str += ' ' + i + ': ' + ( this.isObject(obj[i]) ? this.objTOstr(obj[i]) : obj[i] ) + ', ';
				return str.length > 1 ? str.substring(0, str.lastIndexOf(',')) + '}' : '{}';
			},
			type : function( o ){
				return o === 'Null' || o === 'Undefined' ? o : Object.prototype.toString.call(o).slice(8,-1);
			},
			copy : function( item ){
				var buffer = {};
				return (global.type( item ) === 'Object' || global.type( item ) === 'Array') ? (function(){
					for(var key in item){
				        var copy = item[key];
				        buffer[key] = (global.type(copy) === "Object" || global.type(copy) === "Array") ? arguments.callee(copy) : item[key];
				    }
					return buffer;
				})() : item;
			},
			//继承方法， dest : 目标；src : 源； limit : 深层拷贝
			Extend : function(dest, src, limit) {
				for (var i in src) 
					dest[i] = limit ? global.copy(src[i]) : src[i]
				return dest;
			},
			ajax : function(obj){
				var o = {type: 'post', data:'', async: true, dataType: 'json', timeout:5000, success: function(){}, error: function(){}};
				this.Extend(o, obj, false);
				
				o.url && jquery.ajax(o);
			},
			getUrlParam: function(name) {
	            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	            if (r != null) return unescape(r[2]); return null; //返回参数值
	        }
		};
	
	global.Extend(global, {
		export : function( route ){
			seajs.use( 'X/' + route );
		},
		toastr : function(_cls_, _text_ ){
			if( !_text_ ) return false;
			
			// _direct_ --> [top-left, top-right, bottom-left, bottom-right]
			// _cls_ --> [danger, warning, info, success, primary]
			var cls = {'success':'ok', 'info':'comment', 'danger':'remove', 'warning':'warning-sign', 'primary':'send'},
				guid = global.GUID('toastr'),
				html = '<div id="' + guid + '" style="display:none;" class="toast toast-' + _cls_ + '">' +
							'<button class="toast-close-button" aria-label="Close"><span aria-hidden="true">×</button>' + 
							'<div class="toast-message"><i class="icon icon-' + (cls[ _cls_ ] || cls.primary) + '"></i> ' + (_text_ || '') + '</div>' +
						'</div>'; 

			if( $('.spin-toastr').length > 0 ){
				$('.spin-toastr').prepend( html );
			}else{
				$('._wrap_').append( global.createElement('div', {class:'spin-toastr top-right'}, '', html) );
			}
			var toast = $('#' + guid);
			toast.fadeIn( 1500 );
			setTimeout( function(){
				toast.fadeOut( 1500 );
				setTimeout(function(){ toast.remove(); }, 1500);
			}, 2500);
		}
	}, false);
	
	global.HashMap = function(){
		var length = 0,
			map = new Object();
		
		function containKey( key ){ return key && (key in map); }
		function containValue( value ){
			for(var i in obj)
				return map[ i ] === value;
			return false;
		}
		this.isEmpty = function(){ return length === 0; };
		this.size = function(){ return length; }
		this.get = function(key){ return map[ key ] || null; };
		this.put = function(key, value){
			if( key && value && !containKey(key) ) length++;
			map[ key ] = value;
		}
		this.map = function(){ return map; }
		this.remove = function(key){ return containKey(key) && (delete map[key], length--); }
		this.clear = function(){ length = 0; map = new Object(); }
		this.toString = function(){
			var str = '<';
			for(var i in map)
				str += ' ' + i + ': ' + global.objTOstr( map[i] ) + ', ';
			return str.length > 1 ? str.substring(0, str.lastIndexOf(',')) + '>' : '< >';
		}
	};
	
	global.Time = function(){
		var T = new Date();
		
		this.current = function(){
			T = new Date();
		   	return this;
		};
		this.millis = function(){
			return T.getMilliseconds();
		};
		this.differ = function( N ){ //+ 将来天数， - 以前天数      
		    T.setTime(T.getTime() + N * 1000 * 60 * 60 * 24);
		    return T;
		};
		this.format = function( F ){ //yyyy-mm-dd hh:MM:ss
			var Week = ['日', '一', '二', '三', '四', '五', '六'];
			var o = {  
	            "M+": T.getMonth() + 1,  
	            "d+": T.getDate(),  
	            "h+": T.getHours(),  
	            "m+": T.getMinutes(),  
	            "s+": T.getSeconds(),  
	            "S": T.getMilliseconds(),
	            "W": Week[ T.getDay() ]
	        };  
	        if (/(y+)/.test(F))  
	            F = F.replace(RegExp.$1, (T.getFullYear() + "").substr(4 - RegExp.$1.length));  
	        for (var r in o)  
	            if (new RegExp("(" + r + ")").test(F))  
	                F = F.replace(RegExp.$1, RegExp.$1.length == 1 ? o[r] : ("00" + o[r]).substr(("" + o[r]).length));  
	        return F;  
		};
	};
	
	module.exports = global;
});