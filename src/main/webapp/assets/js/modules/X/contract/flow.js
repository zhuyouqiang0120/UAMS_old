/**
 * 流程设置
 * @author huyi@zensvision.com
 * @version spin_2.0
 */
;define(function(require, exports, module){
	var G = require('global'),
		Canvas = require('T/canvas'),
		indexPanel = G.Global('indexPanel'), canvas; //全局canvas使用
	
	module.exports = {
		init : function(config){
			indexPanel.body('<div class="__flow__">' + 
								'<div class="flow-content"><span class="spin-text-info">暂无流程内容...</span></div>' +
								'<div class="flow-canvas">' + 
									'<div class="canvas-util"></div>' +
									'<div class="canvas-area"></div>' +
								'</div>' + 
							'</div>');
			
			canvas = new Canvas({target: indexPanel.target.find('.panel-body>.__flow__>.flow-canvas')});
			
		}
	}
});