package spin.common.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * SLF4j 日志工厂 配合logback使用
 * 
 * @author huyi@zensvision.com
 * @date 2016年4月24日
 */
public class SLF4jLoggerFactory {

	/**
	 * 日志logger配置
	 */
	private static final Logger sysLogger = LoggerFactory.getLogger("uams");
	private static final Logger placeLogger = LoggerFactory.getLogger("placeholder");
	private static final Logger injectLogger = LoggerFactory.getLogger("inject");
	private static final Logger accessLogger = LoggerFactory.getLogger("access");
	private static final Logger backupLogger = LoggerFactory.getLogger("backup");

	/**
	 * 系统日志.
	 * 
	 * @return
	 */
	public static final Logger getSystemLogger() {
		return sysLogger;
	}

	/**
	 * 占位符日志.
	 * 
	 * @return
	 */
	public static final Logger getPlaceLogger() {
		return placeLogger;
	}

	/**
	 * 注入日志
	 * 
	 * @return
	 */
	public static final Logger getInjectLogger() {
		return injectLogger;
	}

	/**
	 * 访问路径记录
	 * 
	 * @return
	 */
	public static final Logger getAccessLogger() {
		return accessLogger;
	}
	
	/**
	 * 数据库备份记录
	 * 
	 * @return
	 */
	public static final Logger getBackupLogger() {
		return backupLogger;
	}
}
