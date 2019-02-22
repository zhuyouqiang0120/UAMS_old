package spin.common.service;

import java.util.List;

import com.jfinal.plugin.ehcache.CacheKit;

import spin.common.model.Config;
import spin.common.model.Database;
import spin.common.model.Entity;
import spin.common.model.Table;

/**
 * 缓存工厂
 * 
 * @author huyi@zensvision.com
 * @ddate 2016年4月26日
 */
public class CacheFactory {
	public static final String ConfigCacheName = "configFactory";
	public static String EHCACHEXML;
	public static Database DATABASE;
	public static Config ConfigFactory;

	public static void main(String[] args) {
		System.out.println(CacheFactory.class.getSimpleName());
	}
	
	public static Entity getCacheEntityByRoute(String route) {
		Entity entity = null;
		if (!route.isEmpty()) {
			Object object = CacheKit.get(ConfigCacheName, route);
			entity = object.getClass().getSimpleName().equals("Entity") ? (Entity) object : null;
		}
		return entity;
	}

	public static Table getCacheTableByRoute(String route) {
		Table table = null;
		if (!route.isEmpty()) {
			Object object = CacheKit.get(ConfigCacheName, route);
			table = object.getClass().getSimpleName().equals("Table") ? (Table) object : null;
		}
		return table;
	}

	public static void addConfigCache() {
		List<Table> entitys = ConfigFactory.getTables();
		for (Table table : entitys) {
			if (table.isResident()) {
				// 缓存数据库实体映射
				CacheKit.put(ConfigCacheName, table.getIndex(), new Entity(table));
			} else {
				CacheKit.put(ConfigCacheName, table.getIndex(), table);
			}
		}
		// 缓存数据库账户信息
		CacheKit.put(ConfigCacheName, "Database", CacheFactory.DATABASE);
	}
	
	public static void updateConfigCache(String key, Entity entity){
		CacheKit.put(ConfigCacheName, key, entity);
	}
	
	public static void clearAll() {
		CacheKit.getCacheManager().clearAll();
	}

	public static void setEHCACHEXML(String eHCACHEXML) {
		EHCACHEXML = eHCACHEXML;
	}

	public static void setDatabse(Database databse) {
		CacheFactory.DATABASE = databse;
	}

	public static void setConfigFactory(Config configFactory) {
		ConfigFactory = configFactory;
	}
}
