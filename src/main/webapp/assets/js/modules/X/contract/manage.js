/**
 * 流程设置
 * @author huyi@zensvision.com
 * @version spin_2.0
 */

;define(function(require, exports, module){
	var G = require('global'),
		Unit = require('T/unit'),
		modal = G.Global('modal'), 
		indexPanel = G.Global('indexPanel');
	
	module.exports = {
		import : function(btn, item){
			modal.body('');
			new Unit.UploadFile({
				mulit: true,
				limit: 1024*10240,
				target: modal.target.find('.modal-body'),
				uri: 'upload/uploadCTFile',
				bind: function(){
					modal.hide();
				}
			});
			modal.title(btn.name).show();
		},
		detail : function(btn, item){
			console.log(btn, item);
		}
	}
});