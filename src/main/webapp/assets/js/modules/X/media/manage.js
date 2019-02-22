/**
 * 媒资管理业务拓展
 * @author huyi@zensvision.com
 * @version spin_2.0
 */
;define(function(require, exports, module){
	'use strict';
	var G = require('global'),
		Group = require('T/group'),
		Form = require('T/form'),
		Unit = require('T/unit');
	
	function sizeFormat( _size_ ){
		return ( _size_ > 1024 ? ( _size_ < 1024 * 1024 ? (_size_ / 1024).toFixed(2) + ' KB' : ( _size_ < 1024 * 1024 * 1024 ? (_size_ / (1024*1024)).toFixed(2) + ' MB' : (_size_ / (1024*1024*1024)).toFixed(2) + ' GB') ) : _size_ + ' B' );
	}
	
	function media( _item_ ){
		return '<div class="detail-item">' +
					'<div class="detail-poster"><img src="' + _item_.PosterUrl + '" width="100%" height="100%"/></div>' +
					'<div class="detail-message">' +
						'<span class="detail-no-wrap">片名：' + _item_.Title + '</span>' +
						'<span class="detail-wrap">标签：' + _item_.Tag + '</span>' +
						'<span class="detail-info">提供商：<i class="badge">' + _item_.Provider + '</i></span>' +
						'<span class="detail-info">大小：' + sizeFormat( _item_.VideoSize ) + '</span>' +
						'<span class="detail-wrap">导演：' + _item_.Director + '</span>' +
						'<span class="detail-no-wrap">演员：' + _item_.Actor + '</span>' +
						'<span class="detail-no-wrap">简介：' + _item_.Desc + '</span>' +
					'</div>' +
					'<span class="detail-preview">' + '<video controls="controls" src="' + _item_.VideoUrl + '" autoplay="autoplay"></video></span>' +
			   '</div>';
	}
	
	var modal = G.Global('modal'),
		table = G.Global('table'), //全局变量
		states = {0:'<i class="badge" style="background-color:#260EFA">未上架</i>', 
				  1:'<i class="badge" style="background-color:#53A93F">已发布</i>', 
				  2:'<i class="badge" style="background-color:#BA27C3">已下架</i>'};
	
	module.exports = {
		episode: function( btn ){
			var form = new Form({
				target:modal.target.find('.modal-body'), 
				operate: 'add',
				field:[{name: 'Title', text: '片名', weight:16, sensitive: true, sensAlert:'必填', isShow: true,  type:'text'}, 
				       {name: 'Tag', text: '标签', weight:10, isShow: true, sensAlert:'可操作', type:'string-array', arrayEdit:true, readonly:true}]
			});
			
			modal.body('').title( btn.name ).show().bind(function(){
				if( !form.validate() ) return false;
				
				G.ajax({
					url: 'media/insertEpisode',
					data: form.getData(),
					success : function( data ){
						if( data.success ){
							G.toastr('success', '添加剧集成功~');
							table.refresh(1);
						}else{
							G.toastr('warning', '添加剧集失败~');
						}
						modal.hide();
					},
					error : function(){ G.toastr('danger', '添加剧集异常...'); }
				});
			});
		},
		pack: function(btn, _items_){//媒资单片打包到剧集
			var	media = null,
				group = new Group({
					target: modal.target.find('.modal-body'),
					uri: 'media/getMedias?deleted=0',
					orderCase: 'CreateTime desc',
					sifter: 'number:Type@2',
					context: function( item ){
						return  '<button class="btn btn-info">' + item.Title + ' <span class="badge">' + item.Episode + '</span></button>'; 
					},
					callback: function( target, item ){
						var button = G.$(target).find('button');
						
						this.target.find('button.btn-orange').attr('class', 'btn btn-info');
						button.attr('class', button.hasClass('btn btn-info') ? 'btn btn-orange' : 'btn btn-info');
						media = item;
					}
				});
			modal.body('').title( btn.name ).show().bind(function(){
				if( media === null ){
					G.toastr('info', '请先选中需要加入的剧集...');
					return false;
				}
				
				var ids = '', episode = parseInt( media.Episode ) + _items_.length;
				for(var i = 0; i < _items_.length; ++ i)
					ids += (i === 0 ? '' : ',') + _items_[i].ID;
				
				G.ajax({url: 'media/packMedia?pid=' + media.ID + '&type=2&ids=' + ids + '&episode=' + episode, 
					success:function( data ){
						if( data.success ){
							G.toastr('info', '剧集 ' + media.Title + ' 成功加入' + _items_.length + ' 个单片~');
							table.refresh(1);
						}else{
							G.toastr('warning', '剧集 ' + media.Title + ' 加入单片失败~');
						}
						modal.hide();
					}, 
					error:function(){ G.toastr('danger', '剧集 ' + media.Title + ' 加入单片异常~'); }
				});
			});
		},
		detail: function(btn, _item_){//媒资详情
			if(_item_.Type === 2){ //剧集
				modal.body('');
				new Group({
					target: modal.target.find('.modal-body'),
					uri: 'media/getMedias?deleted=0',
					pageSize: 9,
					orderCase: 'CreateTime desc',
					sifter: 'number:Type@3,number:PID@' + _item_.ID,
					context: function( item ){
						return  '<img src="' + item.PosterUrl + '" width="80" height="100"/>' +
								'<span class="detail-no-wrap">' + item.Title + '</span>' + 
								'<span>' + states[ item.State ] + '</span>' + 
								'<span><i class="badge">' + item.Grade + '分</i></span>'; 
					},
					callback: function( target, item ){
						var self = this;
						var ele = G.createElement('button', {class:'btn btn-link'}, '', '<< 返回'),
							content = G.createElement('div', {class:'media-detail'}, '', media( item ));
						
						this.target.hide();
						this.target.parent().append( content );
						G.$(content).prepend( ele );
						
						ele.onclick = function(){
							G.$(content).remove();
							self.target.show();
						}
					}
				});
			}else{
				modal.body( media( _item_ ) );
			}
			modal.title(btn.name).show().foot('hide');
		},
		separate: function(btn, _item_){
			modal.body('');
			var group = new Group({
				target: modal.target.find('.modal-body'),
				uri: 'media/getMedias?deleted=0',
				orderCase: 'CreateTime desc',
				pageSize: 9,
				sifter: 'number:Type@3,number:PID@' + _item_.ID,
				context: function( item ){
					return  '<img src="' + item.PosterUrl + '" width="80" height="100"/>' +
							'<span class="detail-no-wrap">' + item.Title + '</span>' +
							'<span>' + states[ item.State ] + '</span>' +
							'<div class="btn-group btn-group-xs" role="group">' +
								  '<button ' + (item.State === 1 ? 'disabled="disabled"' : '') + ' class="btn btn-default"><i class="icon icon-share-alt"></i> 发布</button>' +
								  '<button ' + (item.State === 1 ? "" : 'disabled="disabled"') + ' class="btn btn-default"><i class="icon icon-download-alt"></i> 下架</button>' +
								  '<button class="btn btn-default"><i class="icon icon-export"></i> 移出</button>' +
							'</div>'; 
				},
				bind: function( list ){
					this.target.find('div.btn-group>button').click(function(){
						var idx = G.$(this).index(),
							span = G.$(this).parent().prev(),
							media = list[ span.parent().index() ],
							publish = G.$(this).parent().find('button:nth-child(1)'),
							download = G.$(this).parent().find('button:nth-child(2)'),
							remove = G.$(this).parent().find('button:nth-child(3)');
						
						if( idx < 2 ){
							var action = idx == 0 ? '发布' : '下架',
								state = idx + 1;
							
							G.ajax({
								url:'media/submitMedia?sifter=number:State@' + state + '&ids=' + media.ID, 
								success : function( data ){
									if( data.success ){
										G.toastr('success', action + '单片成功...'); 
										span.html( states[ state ] );
										publish.attr("disabled", state == 1 ); 
										download.attr("disabled", state == 2);
									}else
										G.toastr('warning', action +'单片失败...');
								},
								error : function(){ G.toastr('danger', action + '单片出错...'); }
							});
						}else{
							var episode = list.length - 1;
							G.ajax({
								url:'media/packMedia?pid=' + media.PID + '&type=1&ids=' + media.ID + '&episode=' + episode, 
								success : function( data ){
									if( data.success ){
										G.toastr('success', '移出剧集成功...');
										_item_.Episode = episode;
										
										var buf = [];
										for(var i in list){
											if( list[i].ID !== media.ID )
												buf.push( list[i] );
										}
										list = buf;
										
										list.length === 0 && modal.hide();
										table.refresh(1);
										span.parent().addClass('fadeoutLeft');
										setTimeout( function(){ span.parent().remove(); }, 1000);
									}else{
										G.toastr('warning', '移出剧集失败...');
									}
								},
								error : function(){ G.toastr('danger', '移出剧集出错...'); }
							});
						}
					});
				}
			});
			modal.title(btn.name).show().foot('hide');
		}
	};
});