/**
 * sea 配置中心
 * @author huyi@zensvision.com
 * @version spin_2.0
 */
;(function(seajs, win){
	// seajs 配置
	seajs.config({
		debug: false, //调试模式
		charset: "utf-8",
		base: "/UAMS/assets/js/",
		vers:{
			version: "v1.2.0",
		},
		paths:{
			"lib": "lib/",
			"common": "common/",
			"T": "common/theme/",
			"modules": "modules/",
			"X": "modules/X/",
			"jquery":"lib/jquery/",
			"bootstrap":"lib/bootstrap/"
		},
	    alias: {
	    	"jquery": "jquery/jquery-2.0.3.min.js",
	    	"jform": "jquery/jquery.form.js",
	    	"boot": "bootstrap/bootstrap.min.js",
	    	"global":"common/base.js",
	    },
	    preload: ['jquery', 'boot']
	});
	
	win.controller = {
		auth: 'http://10.211.55.6:8080/UCMS/data/auth/loginAuth',
		projects: {
			type: 'extend',
			conf:{
				route: 'group',
				extend: 'X/project',
				pageSize: 15,
				orderCase: '',
				uri: 'public/getEntitys?deleted=0',
				util: [{name: '添加项目组', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-plus', uri: 'group/insertGroup', func:'add'},
			              {name: '编辑项目组', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-edit', uri: 'group/updateGroup', func:'edit'},
			              {name: '移除项目组', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-minus', uri: 'group/removeGroup', func:'remove'}],
	     		field: [{name: 'ID', text: 'ID', isShow: true,  type:'INDEX', readonly:true}, 
			             {name: 'GID', text: 'GID', isShow: true,  type:'sys', value:''},
			             {name: 'Name', text: '项目组名称', isShow: true,  type:'text'}, 
				         {name: 'Summary', text: '概要', isShow: true,  type:'text'}, 
				         {name: 'Creator', text: '创建者', isShow: true,  type:'creator', value:''}, 
				         {name: 'Operator', text: '操作者', isShow: true,  type:'operator', value:''},
				         {name: 'CreateTime', text: '创建时间',   type:'sys', value:'',  readonly:true}, 
				         {name: 'UpdateTime', text: '更改时间', isShow: true,  type:'sys', value:'',  readonly:true}, 
				         {name: 'Freezed', text: '',  type:'sys', value:0},
				         {name: 'Deleted', text: '',  type:'sys', value:0}]
			}
		},
		contract_flow:{
			type:'extend',
			conf: {
				extend:'X/contract/flow',
				util: [],
			}
		},
		contract_manage:{
			type: 'table',
			conf: {
				route: 'contract',
				pageSize: 16,
				orderCase: 'CreateTime desc',
				isAllowMulit: true,
				uri: 'public/getEntitys?deleted=0',
				sifter: '',
				extend: 'X/contract/manage',//外部拓展模块地址
				util :[
				        {name: '添加', type: 'btn', direct:'left', css:'btn btn-success', icon: 'icon icon-plus', uri:'contract/insertEntity', func:'add'},
				       	{name: '编辑', type: 'btn', direct:'left', css:'btn btn-info', icon: 'icon icon-edit', uri:'contract/updateEntity', func:'edit'},
				       	{name: '移除', type: 'btn', direct:'left', css:'btn btn-warning', icon: 'icon icon-minus', uri:'contract/removeEntity', func:'remove'},
				       	{name: '详情', type: 'btn', direct:'left', css:'btn btn-purple', icon: 'icon icon-option-horizontal', func:'extend', extend:{item:'single', entry:'detail'}}, 
				       ],
			    field: [{name: 'ID', text: 'ID', weight:4, isShow: true, isSort:true, type:'INDEX', readonly:true}, 
				         {name: 'GUID', text: '编号', weight:12, sensitive: true, sensAlert:'必填', isShow: true, isSort:true, type:'text'}, 
				         {name: 'Name', text: '名称', weight:12, sensitive: true, sensAlert:'必填', isShow: true, isSort:true,  type:'text'}, 
				         {name: 'Client', text: '广告商', weight:12, sensitive: true, sensAlert:'必选', isShow: true, isSort:true, type:'select', value:[{name:'单片',value:1}, {name:'剧集',value:2}], css:{1:'<span class="label label-success">单片</span>', 2:'<span class="label label-info">剧集</span>'}},
				         {name: 'Level', text: '级别', weight:6, isShow: true, sensAlert:'可操作', type:'string-array', arrayEdit:true,  readonly:true},
				         {name: 'Proxy', text: '代理商', weight:12, isShow: true, isSort:true, type:'string-array', readonly:true},
				         {name: 'Bondsman', text: '责任人', weight:8, isShow: true, type:'string-array', readonly:true}, 
				         {name: 'Phone', text: '电话', weight:8, sensAlert:'选填', isShow: true, type:'text', value:''},
				         {name: 'Price', text: '价格', weight:8, sensAlert:'选填', isShow: true, type:'text', value:''},
				         {name: 'Rebate', text: '折扣', weight:6, sensAlert:'选填', isShow: true, type:'text', value:''},
				         {name: 'PayStyle', text: '支付', weight:8, sensAlert:'选填', isShow: true, type:'text', value:''},
				         {name: 'ADType', text: '广告类型', weight:8, sensAlert:'选填', isShow: true, type:'text', value:''},
				         {name: 'State', text: '状态', weight:8, sensitive: true, sensAlert:'必选', isShow: true, type:'tag', value:{0:'<span class="badge" style="background-color:#260EFA">未上架</span>', 1:'<span class="badge" style="background-color:#53A93F">已发布</span>', 2:'<span class="badge" style="background-color:#BA27C3">已下架</span>'}},
				         {name: 'Flow', text: '流程', weight:8, sensAlert:'选填', isShow: true, type:'text', value:''},
				         {name: 'Creator', text: '创建者', weight:8, sensAlert:'选填', isShow: true, isSort:true, type:'text', value:''},
				         {name: 'StartTime', text: '起始时间', weight:8, sensAlert:'选填', isShow: true, type:'text', value:''},
				         {name: 'EndTime', text: '终止时间', weight:8, sensAlert:'选填', isShow: true, type:'text', value:''},
				         {name: 'CreateTime', text: '创建时间', weight:10, type:'sys', value:'',  readonly:true}, 
				         {name: 'Deleted', text: '', type:'sys', value:0}]
			}
		},
		media_arrange: {
			type: 'extend', //指向外部
			conf: { 
				extend: 'X/media/arrange',
				place: {
					ucms: {
						prefix: 'http://10.211.55.6:8080/UCMS/data/mr/',
						siteUri: 'getTemplateList?siteGuid=',
						publishUri: 'mediaModify'
					},
					uams: {
						placeholderUri: 'placeholder/publishPlaceholder',
					}
				},
				video: {
					route: 'video',
					posterErr: '/UAMS/assets/UI/image/posterPrev.png',
					uri: 'media/getMedias?deleted=0',
					sifter: 'number:Type@1,',
					extend: 'X/media/arrange',
					util: [{name: '全部', type: 'btn', direct:'left', css:'btn btn-info btn-sm', icon: 'icon icon-asterisk', uri:'media/getMedias?deleted=0&sifter=number:Type@1', func:'refresh'},
					       {name: '搜索', type: 'search', direct:'right', css:'btn btn-success btn-sm', uri:'media/getMedias', option: [{name:'Title', text:'片名'}, {name:'Tag', text:'标签'}, {name:'Director', text:'导演'}, {name:'Actor', text:'演员'}, {name:'Provider', text:'提供商'}]}]
				},
				image: {
					route: 'poster',
					imageErr: '/UAMS/assets/UI/image/preview.png',
					uri: 'media/getImage?deleted=0',
					sifter: 'number:GID@0',
					extend: 'X/media/arrange',
					util: [{name: '全部', type: 'btn', direct:'left', css:'btn btn-info btn-sm', icon: 'icon icon-asterisk', uri:'media/getImage?deleted=0', func:'refresh'},
					       {name: '上传图片', type: 'btn', direct:'left', css:'btn btn-maroon btn-sm', icon: 'icon icon-upload', func:'extend', extend: {item:'none', entry:'uploadImage'} },
					       {name: '搜索', type: 'search', direct:'right', css:'btn btn-success btn-sm', uri:'source/getImage?sifter', option: [{name:'Title', text:'标题'}]}],
				}
			}
		},
		media_manage: {
			type: 'table',
			conf: {
				route: 'media',
				pageSize: 16,
				orderCase: 'CreateTime desc',
				isAllowMulit: true,
				uri: 'media/getMedias?deleted=0',
				sifter: 'number:Type@!3',
				extend: 'X/media/manage',//外部拓展模块地址
				util :[
				       //{name: '注入', type: 'btn', direct:'left', css:'btn btn-info', icon: 'icon icon-download-alt', func:'extend', item:'none', extend:{router:'manage', entry:'inject'}},
				        {name: '编辑', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-edit', uri:'media/updateMedia', func:'edit'},
				       	{name: '移除', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-minus', uri:'media/removeMedia', func:'remove'},
				       	{name: '详情', type: 'btn', direct:'left', css:'btn btn-orange', icon: 'icon icon-option-horizontal', func:'extend', extend:{item:'single', entry:'detail'}}, 
				    	{name: '集合操作', type: 'btnG', direct:'left', css:'btn btn-purple', icon: 'icon icon-briefcase', uri: [
				    	        {name: '添加剧集', type: 'btn', css:'btn btn-default', icon: 'icon icon-plus', uri:'', func:'extend', extend:{item:'none', entry:'episode'}}, 
	                            {name: '单片打包', type: 'btn', css:'btn btn-success', icon: 'icon icon-folder-close', uri:'', premise:[{'name':'Type', value:2, text:'单片打包', debug:'剧集不能打包~'}], func:'extend', extend:{item:'mulit', entry:'pack'}},
	                            {name: '剧集拆散', type: 'btn', css:'btn btn-warning', icon: 'icon icon-folder-open', uri:'', premise:[{'name':'Type', value:1, text:'剧集拆散', debug:'单片不能拆散~'}], func:'extend', extend:{item:'single', entry:'separate'}} ]},
				       	{name: '媒资审核', type: 'btnG', direct:'left', css:'btn btn-warning', icon: 'icon icon-globe', uri: [
								{name: '发布媒资', type: 'btn', css:'btn btn-success', icon: 'icon icon-share-alt', uri:'media/submitMedia?sifter=number:State@1', premise:[{'name':'State', value:1, text:'发布媒资', debug:'媒资已发布~'}], func:'submit'},
								{name: '下架媒资', type: 'btn', css:'btn btn-danger', icon: 'icon icon-download-alt', uri:'media/submitMedia?sifter=number:State@2', premise:[{'name':'State', value:2, text:'下架媒资', debug:'媒资已下架~'}], func:'submit'}]},
				        {name: '状态筛查', type: 'btnG', direct:'left', css:'btn btn-success', icon: 'icon icon-filter', uri: [
	                           {name: '已发布', type: 'btn', css:'btn btn-default', icon: 'icon icon-share-alt', uri:'media/getMedias?deleted=0&sifter=number:State@1,number:Type@!3', func:'refresh'},
	                           {name: '已下架', type: 'btn', css:'btn btn-default', icon: 'icon icon-download-alt', uri:'media/getMedias?deleted=0&sifter=number:State@2,number:Type@!3', func:'refresh'},
	                           {name: '未上架', type: 'btn', css:'btn btn-default', icon: 'icon icon-inbox', uri:'media/getMedias?deleted=0&sifter=number:State@0,number:Type@!3', func:'refresh'},
	                           {type: 'divider'},
	                           {name: '单片', type: 'btn', css:'btn btn-default', icon: 'icon icon-film', uri:'media/getMedias?deleted=0&sifter=number:Type@1', func:'refresh'},
	                           {name: '剧集', type: 'btn', css:'btn btn-default', icon: 'icon icon-book', uri:'media/getMedias?deleted=0&sifter=number:Type@2', func:'refresh'},
	                           {type: 'divider'},
	                           {name: '全部', type: 'btn', css:'btn btn-default', icon: 'icon icon-asterisk', uri:'media/getMedias?deleted=0&sifter=number:Type@!3', func:'refresh'} ]},
				       	{name: '搜索', type: 'search', direct:'right', css:'btn btn-success', uri:'media/getMedias', option: [{name:'Title', text:'片名'}, {name:'Tag', text:'标签'}, {name:'Director', text:'导演'}, {name:'Actor', text:'演员'}, {name:'Provider', text:'提供商'}]}
				       ],
			    field: [{name: 'ID', text: 'ID', weight:4, isShow: true, isSort:true, type:'INDEX', readonly:true}, 
				         {name: 'Title', text: '片名', weight:16, sensitive: true, isSort:true, sensAlert:'必填', isShow: true, type:'text'}, 
				         {name: 'Type', text: '类型', weight:7, sensitive: true, isSort:true, sensAlert:'必选', isShow: true, type:'select', value:[{name:'单片',value:1}, {name:'剧集',value:2}], css:{1:'<span class="label label-success">单片</span>', 2:'<span class="label label-info">剧集</span>'}},
				         {name: 'Tag', text: '标签', weight:10, isShow: true, isSort:true, sensAlert:'可操作', type:'string-array', arrayEdit:true,  readonly:true},
				         {name: 'Director', text: '导演', weight:12, isShow: true, type:'string-array', readonly:true},
				         {name: 'Actor', text: '演员', weight:18, isShow: true, type:'string-array', readonly:true}, 
				         {name: 'Provider', text: '提供商', weight:8, sensAlert:'选填', isShow: true, isSort:true, type:'text', value:''}, 
				         {name: 'State', text: '状态', weight:7, sensitive: true, sensAlert:'必选', isShow: true, type:'tag', value:{0:'<span class="badge" style="background-color:#260EFA">未上架</span>', 1:'<span class="badge" style="background-color:#53A93F">已发布</span>', 2:'<span class="badge" style="background-color:#BA27C3">已下架</span>'}},
				         {name: 'CreateTime', text: '注入时间', weight:10, isShow: true, isSort:true, type:'sys', value:'',  readonly:true}, 
				         {name: 'Deleted', text: '', type:'sys', value:0}]
			}
		},
		syslog: {
			type:'table',
			conf:{
				route: 'syslog',
				pageSize: 16,
				orderCase: 'ID desc',
				isAllowMulit: true,
				uri: 'public/getEntitys?deleted=0',
				util :[
					       {name: '清除日志', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-minus', uri: 'public/deleteEntity', func:'delete'}
				       ],
			    field: [{name: 'ID', weight:4, text: 'ID', isShow: true, isSort:true, type:'INDEX', readonly:true}, 
				         {name: 'Action', weight:12, text: '动作', isShow: true, isSort:true, type:'text'},
				         {name: 'Method', weight:10, text: '请求', isShow: true, isSort:true, type:'text'},
				         {name: 'Summary', weight:20, text: '摘要', isShow: true, type:'text'},
				         {name: 'Terminal', weight:25, text: '终端版本', isShow: true, type:'text'},
				         {name: 'Operator', weight:8, text: '操作者', isShow: true, type:'text', value:''},
				         {name: 'State', weight:9, text: '状态', isShow: true,  type:'tag', value:{0:'<span class="badge" style="background-color:#FC2003">异常</span>', 1:'<span class="badge" style="background-color:#08BBFC">正常</span>'}},
				         {name: 'CreateTime', weight:15, text: '创建时间', isShow: true,  type:'sys', value:'',  readonly:true}, 
				         {name: 'Deleted', text: '', type:'sys', value:0}]
			}
		},
		backup: {
			type:'table',
			conf:{
				pageSize: 16,
				orderCase: '',
				isAllowMulit: false,
				uri: 'backup/getBackupFiles?order=time',
				util :[{name: '数据备份', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-save-file', uri: 'backup/backUpDB', func:'refresh'},
		              {name: '数据还原', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-open-file', uri: 'backup/restoreDB', func:'submit'},
		              {name: '数据删除', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-minus', uri: 'backup/deleteDBFile>name', func:'direct'}],
			    field: [
				   	         {name: 'name', weight:50, text: '文件名', isShow: true, type:'text'}, 
					         {name: 'size', weight:20, text: '文件大小', isShow: true, type:'text'}, 
					         {name: 'time', weight:25, text: '创建时间', isShow: true, type:'sys', value:'', readonly:true}, 
				         ]
			}
		},
		user: { 
			type: 'table',
			conf: {
				route: 'user',
				pageSize: 16,
				orderCase: '',
				isAllowMulit: false,
				uri: 'public/getEntitys?deleted=0',
				util: [{name: '添加用户', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-plus', uri: 'public/insertEntity', func:'add'},
			              {name: '编辑用户', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-edit', uri: 'public/updateEntity', func:'edit'},
			              {name: '移除用户', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-minus', uri: 'public/removeEntity', func:'remove'}],
			    field: [{name: 'ID', text: 'ID', weight:5, isShow: true, isSort:true, type:'INDEX', readonly:true}, 
				         {name: 'Username', text: '用户名', weight:10, sensitive: true, sensAlert:'必填', isShow: true, isSort:true, type:'text', popover:true, content:'用户名不能为空', title:'提示', regex:'', }, 
				         {name: 'Password', text: '密码', weight:10, sensitive: true, sensAlert:'必填', isShow: false, type:'password', popover:true, content:'密码不能为空', title:'提示', regex:'', },
				         {name: 'Organization', text: '组织', weight:10, isShow: true, type:'text'}, 
				         {name: 'Department', text: '部门', weight:15, isShow: true, type:'text'}, 
				         {name: 'Area', text: '区域', weight:15, isShow: true, isSort:true, type:'text'}, 
				         {name: 'CreateTime', text: '创建时间', weight:15, isShow: true, isSort:true, type:'sys', value:'', readonly:true}, 
				         {name: 'UpdateTime', text: '更改时间', weight:15, isShow: true, type:'sys', value:'', readonly:true}, 
				         {name: 'Extj', text: '', type:'sys', value:''},
				         {name: 'Deleted', text: '',  type:'sys', value:0}]
			}
		},
		config:{
			type: 'table',
			conf: {
				route: 'config',
				pageSize: 16,
				orderCase: '',
				isAllowMulit: false,
				uri: 'public/getEntitys?deleted=0',
				util: [{name: '添加配置', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-plus', uri: 'public/insertEntity', func:'add'},
			              {name: '编辑配置', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-edit', uri: 'public/updateEntity', func:'edit'},
			              {name: '移除配置', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-minus', uri: 'public/removeEntity', func:'remove'}],
			    field: [{name: 'ID', text: 'ID', weight:5, isShow: true, isSort:true, type:'INDEX', readonly:true}, 
				         {name: 'Name', text: '名称', weight:10, sensitive: true, isSort:true, sensAlert:'必填', isShow: true,  type:'text'}, 
				         {name: 'Route', text: '检索索引', weight:15, sensitive: true, isSort:true, sensAlert:'必填', isShow: true,  type:'text'}, 
				         {name: 'Real', text: '实际配置', weight:20, sensitive: true, sensAlert:'必填', isShow: true,  type:'text'},
				         {name: 'Virtual', text: '虚拟配置', weight:20, isShow: true,  type:'text'},
				         {name: 'CreateTime', text: '创建时间', weight:15, isShow: true, isSort:true, type:'sys', value:'', readonly:true}, 
				         {name: 'UpdateTime', text: '更改时间', weight:15, isShow: true, type:'sys', value:'', readonly:true}, 
				         {name: 'Deleted', text: '',  type:'sys', value:0}]
			}
		},
		inject:{
			type: 'table',
			conf: {
				route: 'inject',
				pageSize: 16,
				orderCase: '',
				isAllowMulit: false,
				uri: 'public/getEntitys?deleted=0',
				util: [{name: '移除配置', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-minus', uri: 'public/removeEntity', func:'remove'}],
			    field: [{name: 'ID', text: 'ID', weight:5, isShow: true, isSort:true, type:'INDEX', readonly:true}, 
				         {name: 'AssetID', text: '任务码', weight:10, isShow: true, isSort:true, type:'text'}, 
				         {name: 'FileName', text: '报文', weight:15, isShow: true, type:'text'}, 
				         {name: 'Result', text: '注入信息', weight:20, isShow: true, type:'text'},
				         {name: 'State', text: '执行状态', weight:20, isShow: true, isSort:true, type:'tag', value:{0:'<span class="badge" style="background-color:#FC2003">注入失败</span>', 1:'<span class="badge" style="background-color:#08BBFC">注入成功</span>'}},
				         {name: 'CreateTime', text: '创建时间', weight:15, isShow: true, isSort:true, type:'sys', value:'', readonly:true}, 
				         {name: 'EndTime', text: '结束时间', weight:15, isShow: true, type:'sys', value:'', readonly:true}, 
				         {name: 'Deleted', text: '',  type:'sys', value:0}]
			}
		}
	};
})(seajs, window);