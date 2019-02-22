/**
 * APE媒资编单管理
 * @author huyi@zensvision.com
 * @version spin_2.0
 */
;define(function(require, exports, module){
	var G = require('global'),
		Group = require('T/group'),
		List = require('T/list'),
		Unit = require('T/unit');
	
	var indexPanel = _Static_.get('indexPanel'), 
		modal = _Static_.get('modal'), 
		target, imageGroup, videoGroup,
		currPlace = null, //保存占位符
		bufferMedias = new G.HashMap(), //用于缓存广告集合
		buffer = null, //用于缓存需要移动对象
		dragTarget = null, //缓存拖动模块
		_place_ = null, _video_ = null, _image_ = null;
		
	function sizeFormat( _size_ ){
		return ( _size_ > 1024 ? ( _size_ < 1024 * 1024 ? (_size_ / 1024).toFixed(2) + ' KB' : ( _size_ < 1024 * 1024 * 1024 ? (_size_ / (1024*1024)).toFixed(2) + ' MB' : (_size_ / (1024*1024*1024)).toFixed(2) + ' GB') ) : (_size_ || 0) + ' B' );
	}
	
	function drawDrag( item ){
		var ele = G.createElement('div', {class:'timer-item'}, '', '<button type="button" class="close" bind-idx="' + item.ID + '">×</button>' +
																   '<img src="' + (currPlace.type === 'Video' ? item.posterUri : item.fullUri) + '"><br>' +
																   '<span class="item-info">' + (currPlace.type === 'Video' ? item.title : '<i class="badge">' + (item.width || 0) + '*' + (item.height || 0) + '</i>') + '</span><br>' +
																   '<span class="item-info">大小：' + sizeFormat(item.size) + '</span>');
		target.find('.spin-timer-shaft>.timer-content').append(ele);
		
		G.$(ele).find('img').error(function(){
			G.$(this).attr('src', currPlace.type === 'Video' ? _video_.posterErr : _image_.imageErr);
		});
		G.$(ele).find('button.close').click(function(){
			var idx = G.$(this).attr("bind-idx");
			bufferMedias.remove(idx);
			G.$(this).parent().remove();
			target.find('.place-util>button.btn').attr('disabled', bufferMedias.length === 0);
		});
	}
	
	module.exports = {
		init: function( config ){
			currPlace = null; //初始化
			buffer = null;
			bufferMedias.clear()
			
			_place_ = config.place, 
			_video_ = config.video, 
			_image_ = config.image;
			
			//结构布局
			indexPanel.body('<div class="__media_wrap__">' +
								'<div class="media-arrange-area">' + 
									'<div class="area-place"><div class="title"><i class="icon icon-paperclip"></i> 广告占位符</div><div class="context"></div></div>' +
									'<div class="area-video"><div class="title"><i class="icon icon-facetime-video"></i> 视频资源</div><div class="context"></div></div>' +
									'<div class="area-image"><div class="title"><i class="icon icon-picture"></i> 图片资源</div><div class="context"></div></div>' +
								'</div>' + 
								'<div class="media-edit-area">' + 
									'<div class="area-place-detail"></div>' +
									'<div class="area-edit-place">' +
										'<div class="place-util"><button class="btn btn-info"><i class="icon icon-share-alt"></i> 发布资源</button></div>' +
										'<div class="spin-timer-shaft">' +
											'<div class="timer-line"></div>' +
											'<div class="timer-content">' +
												'<div class="timer-point"></div>' +
											'</div>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>');
			target = G.$('.__media_wrap__');
			
			target.find('.spin-timer-shaft>.timer-content').on('mouseover', function(){
				var self = this;
				buffer && currPlace && (function(){
					//判断媒资是否重复
					bufferMedias.get( buffer.ID ) ? G.toastr('warning', '占位符媒资重复') : (function(){
						var item = currPlace.type === 'Video' ? {type:'Video', ID:buffer.ID, posterUri:buffer.PosterUrl, fullUri:buffer.VideoUrl, title:buffer.Title, size:buffer.VideoSize, grade:buffer.Grade, duration:buffer.Duration}
							: {type:'Image', ID:buffer.ID, fullUri:buffer.Url, title:buffer.Title, size:buffer.Size, width:buffer.Width, height:buffer.Height};
						bufferMedias.put(buffer.ID, item);
						drawDrag(item);
					})();
					buffer = null; //鼠标松开则清空缓存媒资对象
				})();
			});
			//发布广告
			target.find('.place-util>button').click(function(){
				if(bufferMedias.size() > 0){
					var lists = [], map = bufferMedias.map();
					for(var i in map)
						lists.push(map[i]);
					lists = JSON.stringify( lists );
					G.ajax({
						url: _place_.ucms.prefix + _place_.ucms.publishUri,
						data: {guid: currPlace.guid, state: 1, medialist: lists},
						dataType: 'jsonp',
						jsonp: 'jsoncallback',
						success: function(response){
							response.result === 1 ? (function(){
								G.toastr('success', 'UCMS发布占位符媒资成功');
								currPlace.medialist = lists;
								G.ajax({//暂无错误回滚机制
									url: _place_.uams.placeholderUri,
									data: {GUID: currPlace.guid, TemplateGUID:currPlace.templateGuid, State: 1, MediaList: lists, Width:currPlace.width, Height:currPlace.height, Type:currPlace.type, BigRate: currPlace.bigrate, Codec:currPlace.codec, MName:currPlace.mname},
									success: function( data ){
										data.success ? G.toastr('success', 'UAMS记录占位符媒资成功') : G.toastr('warning', 'UAMS记录占位符媒资失败');
									},
									error: function(){ G.toastr('danger', 'UAMS记录占位符媒资异常'); }
								});
							})() : G.toastr('warning', 'UCMS发布占位符媒资失败');
						},
						error: function(){ G.toastr('danger', 'UCMS发布占位符媒资异常'); }
					});
				}else{
					G.toastr('info', '请先添加占位符媒资');
				}
			});
			
			this.place( _place_ );
			this.video( _video_ );
			this.image( _image_ );
		},
		place : function( _place_ ){
			var ucms = _place_.ucms,
				guid = G.getUrlParam('guid'), //'931ad090-12b3-4700-8ad9-10f0a1a0fae5'
				body = target.find('.media-arrange-area>.area-place>.context'),
				detailTarget = target.find('.media-edit-area>.area-place-detail'),
				editTarget = target.find('.media-edit-area>.area-edit-place>.spin-timer-shaft');
			
			body.html('<div class="spin-text-info">该站点占位符为空</div>');
			detailTarget.html('<div class="spin-text-info">请先选择上方站点资源占位符</div>');
			
			if( guid && ucms.siteUri && ucms.prefix){
				G.ajax({
					url : ucms.prefix + ucms.siteUri + guid,
					dataType: 'jsonp',
					jsonp: 'jsoncallback',
					success : function( data ){
						body.html('');
						new List({
							target: body,
							list: data.data,
							itemClass:'__place_item__',
							context: function( item ){
								var items = item.items || [],
									html = '<div class="place-title"><i class="icon icon-triangle-right"></i> ' + (item.tempname || '模板名称未定') + '</div><div class="place-sign">';
								
								for(var i = 0; i < items.length; ++ i){
									html += '<span class="sign-item"><i class="icon icon-' + (items[i].type === 'Video' ? 'facetime-video' : 'picture') + '"></i> ' + (items[i].mname || '占位符') + '</span>';
								}
								return html + '</div>';
							},
							bind: function( array ){
								var self = this;
								self.target.find('span.sign-item').click(function(){
									self.target.find('span.sign-item').removeClass('active');
									G.$(this).addClass('active');
									
									var idx = G.$(this).parent().parent().index(),
										idxAd = G.$(this).index(),
										item = array[idx].items[idxAd],
										mediaList = item.medialist ? JSON.parse(item.medialist) : [];
									
									currPlace = item; //记录当前占位符
									detailTarget.html('<table class="spin-table">' + 
														'<caption align="top"><i class="icon icon-pushpin"></i> 资源占位符</caption>' + 
													  	'<tr><td width="30">GUID</td><td width="70">' + item.guid + '</td></tr>' + 
													  	'<tr><td>名称</td><td>' + item.mname + '</td></tr>' + 
													  	'<tr><td>类型</td><td>' + (item.type === 'Video' ? '<i class="label label-orange">视频</i>' : '<i class="label label-info">图片</i>') + '</i></td></tr>' +
													  	(item.type === 'Video' ? '<tr><td>格式</td><td>' + (item.codec ? '<i class="label label-default">' + item.codec + '</i>' : '') + '</td></tr><tr><td>码率</td><td>' + (item.bigrate || '') + '</td></tr>' : '') +
													  	'<tr><td>宽度</td><td>' + item.width + '</td></tr>' +
													  	'<tr><td>高度</td><td>' + item.height + '</td></tr>' + 
													  '</table>');
									
									bufferMedias.clear();
									editTarget.find('.timer-content>.timer-item').remove();
									if(mediaList.length > 0){
										var html = '';
										for(var i = 0; i < mediaList.length; ++ i){
											bufferMedias.put(mediaList[i].ID, mediaList[i]);
											drawDrag(mediaList[i]);
										}
									}
									editTarget.find('.place-util>button.btn').attr('disabled', bufferMedias.length === 0);
								});
							}
						});
					},
					error : function(){ G.toastr('warning', '获取UCMS站点异常...'); }
				});
			}else{
				G.toastr('info', 'UAMS站点GUID为空');
			}
		},
		video : function( _video_ ){
			var body = target.find('.media-arrange-area>.area-video>.context');
			videoGroup = new Group({
				target: body,
				uri: _video_.uri,
				pageSize: 12,
				sifter: _video_.sifter || '',
				orderCase: 'CreateTime desc',
				itemClass: '__media_item__',
				util: _video_.util,
				extend: _video_.extend,
				context: function( item ){
					return  '<span class="item-image"><img src="' + item.PosterUrl + '" height="90%"/></span>' +
							'<span class="item-info">' + item.Title + '</span>' + 
							'<span class="item-info">大小：' + sizeFormat( item.VideoSize ) + '</span>';
				},
				bind: function( items ){
					this.target.find('.item-image>img').error(function(){
						G.$(this).attr('src', _video_.posterErr);
					});
					body.on('mouseup', function(){
						buffer = null; //松开鼠标就释放缓存媒资对象
					});
					//鼠标按下事件，移动元素
					body.find('.__media_item__').on('mousedown', function(){
						if(!currPlace){
							G.toastr('warning', '请先选择资源占位符...');
							return false;
						}
						if(currPlace.type !== 'Video'){
							G.toastr('info', '当前资源属于视频类型...');
							return false;
						}
						buffer = items[G.$(this).index()];
					});
				}
			});
		},
		image : function( _image_ ){
			var body = target.find('.media-arrange-area>.area-image>.context');
			imageGroup = new Group({
				target: body,
				uri: _image_.uri,
				pageSize: 12, 				
				orderCase: 'ID desc',
				sifter: _image_.sifter || '',
				itemClass: '__media_item__',
				util: _image_.util,
				extend: _image_.extend,
				context: function( item ){
					return  '<span class="item-image"><img src="' + item.Url + '" height="100%"/></span>' +
							'<span class="item-info"><i class="badge">' + ((item.Width || 0) + '*' + (item.Height || 0)) + '</i></span>' + 
							'<span class="item-info">大小：' + sizeFormat( item.Size ) + '</span>';
				},
				bind: function( items ){
					this.target.find('.item-image>img').error(function(){
						G.$(this).attr('src', _image_.imageErr);
					});
					body.on('mouseup', function(){
						buffer = null; //松开鼠标就释放缓存媒资对象
					});
					//鼠标按下事件，移动元素
					body.find('.__media_item__').on('mousedown', function(){
//						console.log(items[G.$(this).index()]);
						if(!currPlace){
							G.toastr('warning', '请先选择资源占位符...');
							return false;
						}
						if(currPlace.type !== 'Image'){
							G.toastr('info', '当前资源属于图片类型...');
							return false;
						}
						buffer = items[G.$(this).index()];
					});
				}
			});
		},
		uploadImage: function( _t_ ){
			modal.body('');
			new Unit.UploadImage({
				target: modal.target.find('.modal-body'),
				uri: 'upload/uploadFile',
				bind: function(){
					modal.hide();
					imageGroup && imageGroup.refresh(1);
				}
			});
			modal.title(_t_).show();
		}
	}
});