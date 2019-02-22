/**
 * 数据库备份
 * 
 * @author huyi@zensvision.com
 * @version spin_2.0
 */
;define(function(require, exports, module){
	var G = require('global'),
		indexPanel = _Static_.get('indexPanel'),
		table = G.Global('table'),
		modal = G.Global('modal');
	
	module.exports = {
		backup : function( btn ){
			modal.body('是否确定备份数据库？').title( btn.name || '数据备份' ).bind(function(){
				G.ajax({
					url: btn.uri,
					async: false,
					success : function( data ){
						if( data.success ){
							G.toastr('success', btn.name + '成功~');
							table.refresh(1);
						}else{
							G.toastr('warning', btn.name + '失败~');
						}
						modal.hide();
					},
					timeout:10000,
					error : function(){ G.toastr('danger', btn.name + '异常...'); }
				});
			}).show();
		},
		restore : function(btn, item){
			modal.body('是否确定还原数据库？').title( btn.name || '数据还原' ).bind(function(){
				G.ajax({
					url: btn.uri,
					data: item,
					async: false,
					success : function( data ){
						if( data.success ){
							G.toastr('success', btn.name + '成功~');
						}else{
							G.toastr('warning', btn.name + '失败~');
						}
						table.refresh(1);
						modal.hide();
					},
					timeout:10000,
					error : function(){ G.toastr('danger', btn.name + '异常...'); }
				});
			}).show();
		},
		deleteDB : function(btn, item){
			modal.body('是否确定删除数据库文件？').title( btn.name || '备份文件删除' ).bind(function(){
				G.ajax({
					url: btn.uri,
					data: item,
					async: false,
					success : function( data ){
						if( data.success ){
							G.toastr('success', btn.name + '成功~');
						}else{
							G.toastr('warning', btn.name + '失败~');
						}
						table.refresh(1);
						modal.hide();
					},
					timeout:5000,
					error : function(){ G.toastr('danger', btn.name + '异常...'); }
				});
			}).show();
		}
	}
});