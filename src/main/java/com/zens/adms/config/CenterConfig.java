package com.zens.adms.config;

import java.util.List;

import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.core.Controller;
import com.jfinal.ext.handler.ContextPathHandler;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.activerecord.dialect.MysqlDialect;
import com.jfinal.plugin.c3p0.C3p0Plugin;
import com.jfinal.plugin.ehcache.EhCachePlugin;
import com.jfinal.render.ViewType;

import cn.dreampie.log.Slf4jLogFactory;
import spin.common.model.Control;
import spin.common.service.CacheFactory;

public class CenterConfig extends JFinalConfig {
	/**
	 * JFinal 常量值配置 执行顺序 1
	 */
	public void configConstant(Constants constants) {
		constants.setDevMode(true); // 开发模式

		constants.setBaseViewPath("WEB-INF/views"); // 路径
		constants.setViewType(ViewType.JSP); // 视图类型

		constants.setErrorView(404, "/WEB-INF/views/error/404.jsp");
		constants.setErrorView(500, "/WEB-INF/views/error/500.jsp");

		// 设置日志工程为SLF4J
		constants.setLoggerFactory(new Slf4jLogFactory());
	}

	/**
	 * 路由配置 执行顺序 2
	 */
	@SuppressWarnings("unchecked")
	public void configRoute(Routes routes) {
		List<Control> controls = CacheFactory.ConfigFactory.getControls();
		for (Control control : controls) {
			routes.add(control.getRoute(), (Class<? extends Controller>) control.getMapping());
		}
	}

	/**
	 * 配置JFinal插件 执行顺序 3
	 */
	public void configPlugin(Plugins plugins) {
		C3p0Plugin c3p0 = new C3p0Plugin(CacheFactory.DATABASE.getUrl(), CacheFactory.DATABASE.getUsername(),
				CacheFactory.DATABASE.getPassword());
		plugins.add(c3p0); // 添加插件

		ActiveRecordPlugin arp = new ActiveRecordPlugin(c3p0);
		plugins.add(arp);
		arp.setShowSql(true);
		arp.setDialect(new MysqlDialect()); // 配置MySQL方言

		// 配置定時插件
		// plugins.add(new QuartzPlugin());

		// 配置 ehcache 缓存
		plugins.add(new EhCachePlugin(CacheFactory.EHCACHEXML));
	}

	/**
	 * 拦截器,此处为 Global 全局拦截 执行顺序 4
	 */
	public void configInterceptor(Interceptors interceptors) {
		// interceptors.add(new LogInterceptor());
		// interceptors.add(new CacheInterceptor());
	}

	/**
	 * JFinal处理器，可以接管所有的web请求，对应用可以完全控制 执行顺序 5
	 */
	public void configHandler(Handlers handlers) {
		ContextPathHandler path = new ContextPathHandler("ContextPath");
		handlers.add(path); // 添加全局路径，提供给jsp定位使用
	}

	/**
	 * 执行顺序 6
	 */
	public void afterJFinalStart() {
		super.afterJFinalStart();
		// 添加缓存
		CacheFactory.addConfigCache();
	}

	/**
	 * 执行顺序 7
	 */
	public void beforeJFinalStop() {
		super.beforeJFinalStop();
		// 清除缓存
		CacheFactory.clearAll();
	}

}
