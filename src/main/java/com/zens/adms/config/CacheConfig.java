package com.zens.adms.config;

import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.ehcache.CacheKit;

import spin.common.model.Entity;
import spin.common.service.CacheFactory;

/**
 * 全局变量配置中心
 * 
 * @author huyi@zensvision.com
 */
public class CacheConfig {
	private static final Entity config = CacheKit.get(CacheFactory.ConfigCacheName, "config");
	/**
	 * 系统缓存配置
	 */
	public final static Record IMAGE_CACHE = config.getEntityByKey("route", "ImageCache");
	public final static Record Video_CACHE = config.getEntityByKey("route", "VideoCache");
	public final static Record SQL_BACKUP_CACHE = config.getEntityByKey("route", "SQLBackup");
	public final static Record LOG_CACHE = config.getEntityByKey("route", "LogCache");
	public final static Record CONTRACT_FILE_CACHE = config.getEntityByKey("route", "CTFileCache");
	public final static Record FTP_FILE_CACHE = config.getEntityByKey("route", "FTPCache");
}
