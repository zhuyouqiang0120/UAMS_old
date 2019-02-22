package com.zens.adms.intercept;

import com.jfinal.aop.Interceptor;
import com.jfinal.core.ActionInvocation;
import com.jfinal.core.Controller;

/**
 * session 拦截器
 * 
 * @author huyi@zensvision.com
 */
public class SessionIntercept implements Interceptor {

	public void intercept(ActionInvocation ai) {
		Controller controller = ai.getController();
		String loginUser = controller.getSessionAttr("loginUser");

		if (loginUser == null || loginUser == "") {
			controller.redirect("/");
		} else {
			ai.invoke();
		}
	}
}
