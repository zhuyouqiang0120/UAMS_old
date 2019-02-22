package com.zens.adms.model;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

import spin.common.model.Entity;
import spin.common.service.CacheFactory;

/**
 * 媒资服务器设备
 * @author zhuyq@zensvision.com
 * @date 2017年9月20日
 */
public class Device extends Entity {
	
	public static final String INDEX = "devices";
	
	
	public Device() {
		super( CacheFactory.getCacheTableByRoute(INDEX));
	}
	
	/**
	 * 分页获取片源基本信息
	 * @param currPage
	 * @param pageSize
	 * @param orderCase
	 * @param deleted
	 * @param sifter 条件 例如: string:key@value,number:key@!value,......
	 * @return
	 */
	public Page<Record> getDevices(int currPage, int pageSize, String orderCase, int deleted, String sifter){
		if( getTableName().isEmpty() )
			return null; 
		System.out.println(sifter);
		return Db.paginate(currPage, pageSize, "select * ", "from " + getTableName() + " where deleted = ? " + ( sifter.isEmpty() ? "" : " and ")  + parseFieldSql(sifter, "select", true) + (orderCase.equals("") ? "" : (" order by " + orderCase)), deleted);
	}
	
}
