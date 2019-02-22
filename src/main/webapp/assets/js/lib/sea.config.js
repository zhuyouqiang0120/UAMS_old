/**
 * sea 配置中心
 * @author huyi@zensvision.com
 * @version spin_2.0
 */
var _baseHost = window.location.host.split(":");
var ucgs_ip = "http://10.211.55.3:8080";//'http://'+ (_baseHost[0].indexOf('192') != -1?'192.168.2.37':'opgdtv.f3322.net') +':28081';
var uams_resource_ip = 'http://localhost:8080';
var uams_ip = 'http://'+ _baseHost[0] ;

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
		auth: ucgs_ip + '/UCGS/data/auth/loginAuth',
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
			             {name: 'GID', text: 'GID', isIn:true, isShow: true,  type:'sys', value:''},
			             {name: 'Name', text: '项目组名称', isIn:true, isShow: true,  type:'text'}, 
				         {name: 'Summary', text: '概要', isIn:true, isShow: true,  type:'text'}, 
				         {name: 'Creator', text: '创建者', isShow: true,  type:'creator', value:''}, 
				         {name: 'Operator', text: '操作者', isShow: true,  type:'operator', value:''},
				         {name: 'CreateTime', text: '创建时间', type:'sys', value:'',  readonly:true}, 
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
				       	{name: '添加附件', type: 'btn', direct:'left', css:'btn btn-maroon', icon: 'icon icon-paperclip', func:'extend', extend:{item:'single', entry:'import'}},
				       	{name: '详情', type: 'btn', direct:'left', css:'btn btn-purple', icon: 'icon icon-option-horizontal', func:'extend', extend:{item:'single', entry:'detail'}},
				       	{name: '移除', type: 'btn', direct:'left', css:'btn btn-warning', icon: 'icon icon-minus', uri:'contract/removeEntity', func:'remove'},
				       ],
			    field: [{name: 'ID', text: 'ID', weight:4,isShow: true, isSort:true, type:'INDEX', readonly:true}, 
				         {name: 'GUID', text: '编号', weight:12, isIn:true, isShow: true, isSort:true, type:'guid', readonly:true}, 
				         {name: 'Name', text: '名称', weight:12, isIn:true, sensitive: true, sensAlert:'必填', isShow: true, isSort:true,  type:'text'}, 
				         {name: 'Client', text: '广告商', weight:12, isIn:true,sensitive: true, sensAlert:'必填', arrayEdit:true, isShow: true, isSort:true, type:'string-array'},
				         {name: 'Level', text: '合同级别', weight:6, isIn:true, isShow: true, type:'select', value:[{name:'初级',value:1}, {name:'中级',value:2}, {name:'高级',value:3}], css:{1:'<span class="label label-info">初级</span>', 2:'<span class="label label-warning">中级</span>', 3:'<span class="label label-danger">高级</span>'}},
				         {name: 'Proxy', text: '代理商', weight:12, isIn:true, isShow: true, sensAlert:'必填', arrayEdit:true, isSort:true, type:'string-array'},
				         {name: 'Bondsman', text: '责任人', weight:8, isIn:true, sensitive: true, isShow: false, sensAlert:'必填', arrayEdit:true, type:'string-array'}, 
				         {name: 'Phone', text: '联系电话', weight:8, isIn:true, sensitive: true, sensAlert:'必填', isShow: true, type:'text', value:''},
				         {name: 'Price', text: '价格', weight:8, isIn:true, sensAlert:'选填', isShow: false, type:'text', value:''},
				         {name: 'Rebate', text: '折扣', weight:6, isIn:true, sensAlert:'选填', isShow: false, type:'number', min:1, max:10, value:''},
				         {name: 'PayStyle', text: '支付方式', weight:8, isIn:true, sensAlert:'选填', isShow: false, type:'text', value:''},
				         {name: 'ADType', text: '广告类型', weight:8, isIn:true, sensitive: true, sensAlert:'必选', isShow: true, type:'select', value:[{name:'高清',value:'HD'}, {name:'标清',value:'SD'}, {name:'移动端',value:'PHONE'}], css:{'HD':'<span class="label label-info">HD高清</span>', 'SD':'<span class="label label-success">标清</span>', 'PHONE':'<span class="label label-purple">移动端</span>'}},
				         {name: 'State', text: '状态', weight:8, isShow: true, type:'tag', value:{0:'<span class="badge" style="background-color:#260EFA">未上架</span>', 1:'<span class="badge" style="background-color:#53A93F">已发布</span>', 2:'<span class="badge" style="background-color:#BA27C3">已下架</span>'}},
				         {name: 'Flow', text: '流程', weight:8, isIn:true, sensitive: true, sensAlert:'必填', isShow: true, type:'text', value:''},
				         {name: 'Creator', text: '创建者', weight:8, sensAlert:'选填', isShow: true, isSort:true, type:'user', value:''},
				         {name: 'StartTime', text: '起始时间', weight:8, isIn:true, sensitive: true, sensAlert:'必选', isShow: true, type:'datetime-local', value:''},
				         {name: 'EndTime', text: '终止时间', weight:8, isIn:true, sensAlert:'选填', isShow: true, type:'datetime-local', value:''},
				         {name: 'CreateTime', text: '创建时间', weight:10, type:'sys', value:'', readonly:true}, 
				         {name: 'Deleted', text: '', type:'sys', value:0}]
			}
		},
		media_arrange: {
			type: 'extend', //指向外部
			conf: { 
				extend: 'X/media/arrange',
				place: {
					ucms: {
						prefix: ucgs_ip + '/UCGS/data/mr/',
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
					sifter: 'number:Type@1',
					extend: 'X/media/arrange',
					util: [{name: '全部', type: 'btn', direct:'left', css:'btn btn-info btn-sm', icon: 'icon icon-asterisk', uri:'media/getMedias?deleted=0&sifter=number:Type@1', func:'refresh'},
					       {name: '搜索', type: 'search', direct:'right', css:'btn btn-success btn-sm', uri:'media/getMedias', option: [{name:'Title', text:'片名'}, {name:'Tag', text:'标签'}, {name:'Director', text:'导演'}, {name:'Actor', text:'演员'}, {name:'Provider', text:'提供商'}]}]
				},
				image: {
					route: 'poster',
					imageErr: '/UAMS/assets/UI/image/preview.png',
					uri: 'media/getImages?deleted=2',
					sifter: 'number:GID@0',
					extend: 'X/media/arrange',
					util: [{name: '全部', type: 'btn', direct:'left', css:'btn btn-info btn-sm', icon: 'icon icon-asterisk', uri:'media/getImages?deleted=0', func:'refresh'},
					       {name: '上传图片', type: 'btn', direct:'left', css:'btn btn-maroon btn-sm', icon: 'icon icon-upload', func:'extend', extend: {item:'none', entry:'uploadImage'} },
						   {name : '状态',type :'btnG',direct : 'left',css:'btn btn-maroon btn-sm',func:'extend',uri :[
							   {name : '未上架',val : 0,type : 'btn',css : 'btn btn-default',icon : 'icon',func:'extend',extend:{item:'none',entry:'selector'}},
							   {name : '已删除',val : 1,type : 'btn',css : 'btn btn-default',icon : 'icon',func:'extend',extend:{item:'none',entry:'selector'}},
							   {name : '已发布',val : 2,type : 'btn',css : 'btn btn-default',icon : 'icon',func:'extend',extend:{item:'none',entry:'selector'}},
							   {name : '已下架',val : 4,type : 'btn',css : 'btn btn-default',icon : 'icon',func:'extend',extend:{item:'none',entry:'selector'}}
						   ]},
						   {name : '审核',type:'btnG',direct : 'left',css:'btn btn-purple btn-sm',func : 'extend', uri :[
							   {name : '发布',val : 2,type : 'btn' , css : 'btn btn-default',icon : 'icon',func:'extend',extend :{item:'none',entry:'check'} },
							   {name : '删除',val : 1,type : 'btn' , css : 'btn btn-default',icon : 'icon',func:'extend',extend :{item:'none',entry:'check'} },
							   {name : '下架',val : 4,type : 'btn' , css : 'btn btn-default',icon : 'icon',func:'extend',extend :{item:'none',entry:'check'} }
						   ]},
					       {name: '搜索', type: 'search', direct:'right', css:'btn btn-success btn-sm', uri:'source/getImages?sifter', option: [{name:'Title', text:'标题'}]}],
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
				         {name: 'Title', text: '片名', weight:16, isIn:true, sensitive: true, isSort:true, sensAlert:'必填', isShow: true, type:'text'}, 
				         {name: 'Type', text: '类型', weight:7, isIn:true, sensitive: true, isSort:true, sensAlert:'必选', isShow: true, type:'select', value:[{name:'单片',value:1}, {name:'剧集',value:2},{name : '广告视频',value : 4},{name : '回看补片',value : 8}], css:{1:'<span class="label label-success">单片</span>', 2:'<span class="label label-info">剧集</span>',4:'<span class="label label-info">广告视频</span>',8:'<span class="label label-info">回看补片</span>'}},
				         {name: 'Tag', text: '标签', weight:10, isIn:true, isShow: true, isSort:true, sensAlert:'可操作', type:'string-array', arrayEdit:true,  readonly:true},
				         {name: 'Director', text: '导演', weight:12, isIn:true, isShow: true, type:'string-array', readonly:true},
				         {name: 'Actor', text: '演员', weight:18, isIn:true, isShow: true, type:'string-array', readonly:true}, 
				         {name: 'Provider', text: '提供商', weight:8, isIn:true, sensAlert:'选填', isShow: true, isSort:true, type:'text', value:''}, 
				         {name: 'State', text: '状态', weight:7, sensitive: true, sensAlert:'必选', isShow: true, type:'tag', value:{0:'<span class="badge" style="background-color:#260EFA">未上架</span>', 1:'<span class="badge" style="background-color:#53A93F">已发布</span>', 2:'<span class="badge" style="background-color:#BA27C3">已下架</span>'}},
				         {name: 'CreateTime', text: '注入时间', weight:10, isShow: true, isSort:true, type:'sys', value:'',  readonly:true}, 
				         {name: 'Deleted', text: '', type:'sys', value:0}]
			}
		},
		media_img: {
			type: 'table',
			conf: {
				route: 'media',
				pageSize: 16,
				orderCase: 'CreateTime desc',
				isAllowMulit: true,
				uri: 'media/getImage?deleted=1',
				sifter: 'number:GID@0',
				extend: 'X/media/manage',//外部拓展模块地址
				util :[
				        {name: '编辑', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-edit', uri:'media/updateImage', func:'edit'},
				       	{name: '移除', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-minus', uri:'media/removeImage', func:'remove'},
				       	{name: '详情', type: 'btn', direct:'left', css:'btn btn-orange', icon: 'icon icon-option-horizontal', func:'extend', extend:{item:'single', entry:'detail'}}, 
				       	{name: '媒资审核', type: 'btnG', direct:'left', css:'btn btn-warning', icon: 'icon icon-globe', uri: [
								{name: '发布媒资', type: 'btn', css:'btn btn-success', icon: 'icon icon-share-alt', uri:'media/submitImage?deleted=2', premise:[{'name':'deleted', value:2, text:'发布媒资', debug:'媒资已发布~'}], func:'submit'},
								{name: '下架媒资', type: 'btn', css:'btn btn-danger', icon: 'icon icon-download-alt', uri:'media/submitImage?deleted=4', premise:[{'name':'deleted', value:4, text:'下架媒资', debug:'媒资已下架~'}], func:'submit'}]},
				        {name: '状态筛查', type: 'btnG', direct:'left', css:'btn btn-success', icon: 'icon icon-filter', uri: [
	                           {name: '已发布', type: 'btn', css:'btn btn-default', icon: 'icon icon-share-alt', uri:'media/getImages?deleted=2', func:'refresh'},
	                           {name: '已下架', type: 'btn', css:'btn btn-default', icon: 'icon icon-download-alt', uri:'media/getImages?deleted=4', func:'refresh'},
	                           {name: '未上架', type: 'btn', css:'btn btn-default', icon: 'icon icon-inbox', uri:'media/getImages?deleted=0', func:'refresh'},
	                           {type: 'divider'},
	                           {name: '全部', type: 'btn', css:'btn btn-default', icon: 'icon icon-asterisk', uri:'media/getImage?deleted=0&sifter=number:Type@!3', func:'refresh'} ]},
				       	{name: '搜索', type: 'search', direct:'right', css:'btn btn-success', uri:'media/getMedias', option: [{name:'Title', text:'片名'}, {name:'Tag', text:'标签'}, {name:'Director', text:'导演'}, {name:'Actor', text:'演员'}, {name:'Provider', text:'提供商'}]}
				       ],
			    field: [{name: 'ID', text: 'ID', weight:4, isShow: true, isSort:true, type:'INDEX', readonly:true}, 
				         {name: 'Title', text: '名称', weight:16, isIn:true, sensitive: true, isSort:true, sensAlert:'必填', isShow: true, type:'text'}, 
				         {name: 'Format', text: '类型', weight:7, isIn:true, sensitive: true, isSort:true, sensAlert:'必选', isShow: true, type:'select', value:[{name:'单片',value:1}, {name:'剧集',value:2}], css:{1:'<span class="label label-success">单片</span>', 2:'<span class="label label-info">剧集</span>'}},
				         {name: 'Tag', text: '标签', weight:10, isIn:true, isShow: true, isSort:true, sensAlert:'可操作', type:'string-array', arrayEdit:true,  readonly:true},
				        // {name: 'Director', text: '导演', weight:12, isIn:true, isShow: true, type:'string-array', readonly:true},
				        // {name: 'Actor', text: '演员', weight:18, isIn:true, isShow: true, type:'string-array', readonly:true}, 
				         {name: 'Provider', text: '提供商', weight:8, isIn:true, sensAlert:'选填', isShow: true, isSort:true, type:'text', value:''}, 
				         {name: 'Deleted', text: '状态', weight:7, sensitive: true, sensAlert:'必选', isShow: true, type:'tag', value:{0:'<span class="badge" style="background-color:#260EFA">未上架</span>', 2:'<span class="badge" style="background-color:#53A93F">已发布</span>', 4:'<span class="badge" style="background-color:#BA27C3">已下架</span>'}},
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
				         {name: 'Action', weight:12, isIn:true, text: '动作', isShow: true, isSort:true, type:'text'},
				         {name: 'Method', weight:10, isIn:true, text: '请求', isShow: true, isSort:true, type:'text'},
				         {name: 'Summary', weight:20, isIn:true, text: '摘要', isShow: true, type:'text'},
				         {name: 'Terminal', weight:25, isIn:true, text: '终端版本', isShow: true, type:'text'},
				         {name: 'Operator', weight:8, text: '操作者', isShow: true, type:'text', value:''},
				         {name: 'State', weight:9, text: '状态', isShow: true,  type:'tag', value:{0:'<span class="badge" style="background-color:#FC2003">异常</span>', 1:'<span class="badge" style="background-color:#08BBFC">正常</span>'}},
				         {name: 'CreateTime', weight:15, text: '创建时间', isShow: true,  type:'sys', value:'',  readonly:true}, 
				         {name: 'Deleted', text: '', type:'sys', value:0}]
			}
		},
		backup: {
			type:'table',
			conf:{
				route: 'backup',
				pageSize: 16,
				orderCase: '',
				isAllowMulit: false,
				uri: 'backup/getEntitys?deleted=0',
				extend: 'X/system/database',
				util :[{name: '数据备份', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-save-file', uri: 'backup/backupDB', func:'extend', extend:{item:'none', entry:'backup'}},
		               {name: '数据还原', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-open-file', uri: 'backup/restoreDB', func:'extend', extend:{item:'single', entry:'restore'}},
		               {name: '文件删除', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-remove', uri: 'backup/deleteDB', func:'extend', extend:{item:'single', entry:'deleteDB'}},
				       {name: '数据移除', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-minus', uri: 'backup/deleteEntity', func:'delete'}],
			    field: [{name: 'ID', weight:5, text: 'ID', isShow: true, isSort:true, type:'INDEX', readonly:true},
			   	         {name: 'FileName', weight:25, text: '文件名', isShow: true, type:'text'}, 
				         {name: 'Size', weight:10, text: '文件大小', isShow: true, type:'text'}, 
				         {name: 'State', text: '处理结果', weight:15, isShow: true, type:'tag', value:{0:'<span class="badge" style="background-color:#260EFA">处理失败</span>', 1:'<span class="badge" style="background-color:#53A93F">处理成功</span>'}},
				         {name: 'Result', weight:15, text: '近期处理信息', isShow: true, type:'text', value:'', readonly:true},
				         {name: 'CreateTime', weight:15, text: '创建时间', isShow: true, type:'sys', value:'', readonly:true},
				         {name: 'UpdateTime', weight:15, text: '处理时间', isShow: true, type:'sys', value:'', readonly:true},
				         {name: 'Deleted', text: '', type:'sys', value:0}]
			}
		},
		user: { 
			type: 'table',
			conf: {
				route: 'user',
				pageSize: 16,
				orderCase: '',
				isAllowMulit: false,
				uri: 'user/getEntitys?deleted=0',
				util: [{name: '添加用户', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-plus', uri: 'user/insertEntity', func:'add'},
			              {name: '编辑用户', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-edit', uri: 'user/updateEntity', func:'edit'},
			              {name: '移除用户', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-minus', uri: 'user/removeEntity', func:'remove'}],
			    field: [{name: 'ID', text: 'ID', weight:5, isShow: true, isSort:true, type:'INDEX', readonly:true}, 
				         {name: 'Username', text: '用户名', weight:10, isIn:true, sensitive: true, sensAlert:'必填', isShow: true, isSort:true, type:'text', popover:true, content:'用户名不能为空', title:'提示', regex:'', }, 
				         {name: 'Password', text: '密码', weight:10, isIn:true, sensitive: true, sensAlert:'必填', isShow: false, type:'password', popover:true, content:'密码不能为空', title:'提示', regex:'', },
				         {name: 'Organization', text: '组织', weight:10, isIn:true, isShow: true, type:'text'}, 
				         {name: 'Department', text: '部门', weight:15, isIn:true, isShow: true, type:'text'}, 
				         {name: 'Area', text: '区域', weight:15, isIn:true, isShow: true, isSort:true, type:'text'}, 
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
				         {name: 'Name', text: '名称', weight:10, isIn:true, sensitive: true, isSort:true, sensAlert:'必填', isShow: true,  type:'text'}, 
				         {name: 'Route', text: '检索索引', weight:15, isIn:true, sensitive: true, isSort:true, sensAlert:'必填', isShow: true,  type:'text'}, 
				         {name: 'Real', text: '实际配置', weight:20, isIn:true, sensitive: true, sensAlert:'必填', isShow: true,  type:'text'},
				         {name: 'Virtual', text: '虚拟配置', weight:20, isIn:true, isShow: true,  type:'text'},
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
		},
		devices: {
			type: 'table',
			conf: {
				route: 'device',
				pageSize: 16,
				orderCase: 'CreateTime asc',
				isAllowMulit: true,
				uri: 'device/getDevices?deleted=0',
				//sifter: 'number:Type@!3',
				extend: 'X/media/manage',//外部拓展模块地址
				util :[
				        {name: '编辑', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-edit', uri:'device/updateMedia', func:'edit'},
				       	{name: '移除', type: 'btn', direct:'left', css:'btn btn-default', icon: 'icon icon-minus', uri:'device/removeMedia', func:'remove'},
				       //	{name: '详情', type: 'btn', direct:'left', css:'btn btn-orange', icon: 'icon icon-option-horizontal', func:'extend', extend:{item:'single', entry:'detail'}}, 
				       	{name: '搜索', type: 'search', direct:'right', css:'btn btn-success', uri:'device/getDevices', option: [{name:'GUID', text:'GUID'}, {name:'deviceName', text:'名称'}, {name:'deviceIP', text:'IP'}]}
				       ],
			    field: [{name: 'ID', text: 'ID', weight:4, isShow: true, isSort:true, type:'INDEX', readonly:true}, 
				         {name: 'GUID', text: 'GUID', weight:16, isIn:true, sensitive: true,  sensAlert:'必填', isShow: true, type:'text'}, 
				         {name: 'deviceName', text: '名称', weight:10, isIn:true, sensitive: true, sensAlert:'必填', isShow: true, type:'text'}, 
				         {name: 'deviceIP', text: 'IP', weight:15, isIn:true, sensitive: true, sensAlert:'必选', isShow: true, type:'text'},
				         {name: 'devicePort', text: '服务端口', weight:5, isIn:true, isShow: true,  sensAlert:'可操作', type:'text'},
				         {name: 'deviceFtpUser', text: 'FTP用户名', weight:7, isIn:true, isShow: true, type:'string-array', readonly:true},
				         {name: 'deviceFtpPwd', text: 'FTP密码', weight:7, isIn:true, isShow: true, type:'string-array', readonly:true},
				         {name: 'd_total', text: '存储总量', weight:7, isIn:true, isShow: true, type:'string-array', readonly:true},
				         {name: 'd_used', text: '已用量', weight:7, isIn:true, isShow: true, type:'string-array', readonly:true},
				         {name: 'd_avilable', text: '剩余量', weight:7, isIn:true, isShow: true, type:'string-array', readonly:true},
				         {name: 'd_usedPercent', text: '使用率', weight:7, isIn:true, isShow: true, type:'string-array', readonly:true},
				         {name: 'd_mnt', text: '挂载点', weight:7, isIn:true, isShow: true, type:'string-array', readonly:true}]
			}
		}
	};
})(seajs, window);
