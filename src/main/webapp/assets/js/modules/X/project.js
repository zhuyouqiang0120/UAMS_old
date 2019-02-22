;define(function(require, exports, module){
	var G = require('global'),
		Group = require('T/group');
	
	var indexPanel = _Static_.get('indexPanel');
	
	module.exports = {
		init: function( _project_ ){
			var group = new Group({
				target: indexPanel.target.find('.panel-body'),
				uri: _project_.uri,
				pageSize: 16,
				orderCase: 'CreateTime desc',
				isNeedCheck: true,
				itemClass: '__project_item__',
				util: _project_.util,
				field: _project_.field,
				extend: _project_.extend,
				context: function( item ){
					return  '<span class="box-title">' + (item.Name || '') + '</span>' +
							'<span class="box-summary"><i class="icon icon-map-marker"></i> ' + (item.Summary || '') + '</span>' +
							'<span class="box-footer">' + 
								'<time><i class="icon icon-calendar"></i> ' + (item.CreateTime.substring(0, 10) || '') + '</time>' + 
//								'<a class="footer-right"><i class="icon icon-share-alt"></i></a>' + 
							'</span>'; 
				},
				callback: function( target, item ){
				}
			});
		}	
	};
});