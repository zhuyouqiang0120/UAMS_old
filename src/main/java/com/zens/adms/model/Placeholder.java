package com.zens.adms.model;

import java.util.List;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

import spin.common.model.Entity;
import spin.common.service.CacheFactory;

public class Placeholder extends Entity {
	public static final String INDEX = "placeholder";

	public Placeholder() {
		super( CacheFactory.getCacheTableByRoute(INDEX) );
	}
	
	public boolean isExist(String  guid){
		return Db.find("select * from " + getTableName() + " where guid = '" + guid + "'").size() > 0;
	}
	
	public List<Record> getPlaceholders(String tempGUID){
		return Db.find("select * from " + getTableName() + " where tempGUID = '" + tempGUID + "'");
	}
	
	public Record getAdList(String guid){
		List<Record> records = Db.find("select * from " + getTableName() + " where GUID = '" + guid + "'");
		if(records.size() > 0){
			return records.get(0);
		}
		return new Record();
	}
}
