package com.zens.adms.intercept;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.jfinal.aop.Interceptor;
import com.jfinal.core.ActionInvocation;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

import spin.common.model.Entity;
import spin.common.service.CacheFactory;
import spin.common.util.TimeUT;

/**
 * 日志拦截器
 * @author huyi@zensvision.com
 */
public class LogIntercept implements Interceptor {
	private Entity log = CacheFactory.getCacheEntityByRoute("syslog");

	private static Map<String, String> control = new HashMap<String, String>();
	private static Map<String, String> method = new HashMap<String, String>();
	static {
		control.put("/", "全局路由管理");
		control.put("/media", "媒资管理");
		control.put("/user", "用户管理");
		control.put("/placeholder", "占位符管理");
		control.put("/group", "组管理");
		control.put("/Tag", "标签管理");
		control.put("/inter", "接口管理");
		// control : /
		method.put("login", "用户登陆");
		method.put("logout", "用户注销");
		// control : media
		method.put("addTag", "添加标签");
		method.put("insertMedia", "添加媒资");
		method.put("updateMedia", "更新媒资");
		method.put("removeMedia", "移除媒资");
		method.put("deleteMedia", "删除媒资");
		method.put("submitMedia", "更新媒资状态");
		method.put("insertEpisode", "添加剧集");
		method.put("packMedia", "打包/拆散剧集");
		// control : user
		method.put("insertUser", "添加用户");
		method.put("updateUser", "更新用户");
		method.put("removeUser", "移除用户");
		method.put("deleteUser", "删除用户");
		// control : group
		method.put("insertGroup", "添加组");
		method.put("updateGroup", "更新组");
		method.put("removeGroup", "移除组");
		method.put("deleteGroup", "删除组");
		// control : tag
		method.put("insertTag", "添加标签");
		method.put("updateTag", "更新标签");
		method.put("deleteTag", "删除标签");
		// control : placeholder
		method.put("publishPlaceholder", "占位符广告");
		// contaol : inter
		method.put("getPlaceholder", "获取占位符广告");
		method.put("getMediaByGUID", "通过GUID获取媒资信息");
		method.put("getMedias", "片名检索媒资信息");
		method.put("referMedias", "通过导演/演员/标签信息提取媒资信息");
		method.put("referMediaByChannel", "通过频道号提取媒资信息");
	}

	public void intercept(ActionInvocation ai) {
		ai.invoke(); // 继续执行请求
		
		Record record = new Record();
		Controller controller = ai.getController();
		HttpServletRequest request = controller.getRequest();
		String actionKey = ai.getActionKey(), 
				  controllerKey = ai.getControllerKey(), 
				  methodName = ai.getMethodName(), 
				  userAgent = request.getHeader("User-Agent"), 
				  user = controller.getSessionAttr("loginUser"), 
				  ip = request.getRemoteAddr();
		
		record.set("Address", ip)
				.set("Operator", user)
				.set("Method", actionKey)
				.set("Param", request.getQueryString())
				.set("Terminal", userAgent)
				.set("Deleted", 0);
		boolean flag = false;
		try{
			String action = control.get( controllerKey );
			if( !action.isEmpty() || action != null ){
				record.set("Action", action)
					.set("Summary", method.get(methodName))
					.set("State", 1);
				flag = true;
			}
		}catch(Exception e){
			flag = true;
			record.set("Action", "异常捕捉")
					.set("Summary", method.get(methodName))
					.set("State", 0);
		}finally{
			if( flag ){
				record.set("CreateTime", TimeUT.getCurrTime());
				log.insert( record );
			}
		}
	}
}
