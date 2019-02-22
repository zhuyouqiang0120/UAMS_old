package spin.common.listener;

import java.io.IOException;
import java.util.Locale;
import java.util.ResourceBundle;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.dom4j.DocumentException;

import spin.common.model.Database;
import spin.common.service.CacheFactory;
import spin.common.util.XMLParseUT;

/**
 * 配置信息初始化
 * 
 * @author huyi@zensvision.com
 * @date 2016年4月26日
 */
public class ConfigListener implements ServletContextListener {

	public void contextDestroyed(ServletContextEvent destory) {

	}

	public void contextInitialized(ServletContextEvent init) {
		String classpath = this.getClass().getClassLoader().getResource("/").getPath();
		ServletContext context = init.getServletContext();
		
		try {
			// 解析配置文件jfinal-factory.xml，获取路由信息，数据库表映射信息
			CacheFactory.setConfigFactory(
					XMLParseUT.parseConfig(classpath + context.getInitParameter("configFactory")));
			//配置ehcache.xml路径
			CacheFactory.setEHCACHEXML(classpath + context.getInitParameter("ehcache"));
			
			ResourceBundle rb = ResourceBundle.getBundle(context.getInitParameter("properties"), Locale.getDefault());
			//解析config.properties 获取数据库配置信息
			CacheFactory.setDatabse(new Database(rb.getString("jdbc.driverClassName"),
					rb.getString("jdbc.databse"), rb.getString("jdbc.url"), rb.getString("jdbc.username"),
					rb.getString("jdbc.password"), rb.getString("jdbc.path")));
			
		} catch (IOException e) {
			e.printStackTrace();
		} catch (DocumentException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	}

}
