package com.zens.adms.intercept;

import com.jfinal.aop.Interceptor;
import com.jfinal.core.ActionInvocation;
import com.jfinal.core.Controller;
import com.zens.adms.model.User;

/**
 * 登录拦截器
 * @author huyi@zensvision.com
 */
public class LoginIntercept implements Interceptor{

	public void intercept(ActionInvocation ai) {
		Controller controller = ai.getController();
		
		String verify = controller.getPara("verify");
		String username = controller.getPara("username");
		String password = controller.getPara("password");
		String authCode = controller.getPara("authCode");
		
		if(verify == null){
			User user = new User();
			if( user.isExistUser(username, password) ){
				controller.setSessionAttr(User.SESSION_USER, username);
				ai.invoke();
			}else{
				controller.setAttr("loginErr", "用户名或密码错误！");
				controller.renderJsp("login.jsp");
			}
		}else{ //ucms访问
			controller.setSessionAttr(User.SESSION_USER, "admin");
			//String guid = controller.getPara("guid");
			String pmssionCode = controller.getPara("pmssionCode");
			String uName = controller.getPara("uName");
			String uSession = controller.getPara("uSession");
			//uams登录验证
			controller.redirect("/home?verify=" + verify + "&authCode=" + authCode + "&pmssionCode=" + pmssionCode + "&uName=" + uName + "&uSession=" + uSession);
		}
	}
}
