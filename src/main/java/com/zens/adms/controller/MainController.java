package com.zens.adms.controller;

import javax.servlet.http.HttpServletRequest;

import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;
import com.zens.adms.intercept.LoginIntercept;
import com.zens.adms.intercept.SessionIntercept;
import com.zens.adms.model.User;

import spin.common.model.Entity;
import spin.common.service.CacheFactory;
import spin.common.util.SystemUT;

/**
 * 主控制器，控制跳转
 * 
 * @author huyi@zensvision.com
 */
public class MainController extends Controller {
	public void index() {
		renderJsp("login.jsp");
	}

	/**
	 * 登陆拦截
	 */
	@Before(LoginIntercept.class)
	public void login() {
		redirect("/home");
	}

	public void logout() {
		getSession().invalidate();
		renderJsp("login.jsp");
	}

	/**
	 * 主页session检测
	 */
	@Before(SessionIntercept.class)
	public void home() {
		renderJsp("main.jsp");
	}

	public void menu() {
		Entity menu = CacheFactory.getCacheEntityByRoute("menu");
		renderJson(menu.getEntitysByKey("open", "1"));
	}

	public void loginMessage() {
		HttpServletRequest request = getRequest();
		renderJson(new Record().set("user", getSession().getAttribute(User.SESSION_USER))
				.set("ip", SystemUT.getRemoteIP(getRequest())).set("port", request.getLocalPort()));
	}
}
