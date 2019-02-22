/**
 * canvas 图形绘制
 * @author huyi@zensvision.com
 * @version spin_2.0
 */
;define(function(require, exports, module){
	var G = require('global'),
		View = require('T/view');
	
	function Canvas(_o_){
		var o = {tag: 'canvas', target: '', exist: false, ele: {tag:'canvas', attr:{class:'spin-canvas'}, content:''}};
		G.Extend(o, _o_, false);
		
		var canvas = new View(o),
			brush = canvas.target[0].getContext('2d'); //画笔
		
		this.drawRec = function(){
			brush.strokeStyle = 'red';
			brush.strokeRect(30,30,340,240);
		}
		
		this.drawTriangle = function(){
			brush.beginPath();
			brush.arc(200,150,100,0,Math.PI,true);
			brush.closePath();
			brush.fillStyle = 'green';
            brush.fill();
		}
		
		this.drawRound = function(){
			brush.beginPath();
			brush.arc(200,150,100,0,Math.PI*2,true);
			brush.closePath();
			brush.fillStyle = 'green';
            brush.fill();
		}
	}
	
	module.exports = function( _o_ ){
		return new Canvas( _o_ );
	}
});