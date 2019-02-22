package com.zens.adms.model;

import java.util.List;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

import spin.common.model.Entity;
import spin.common.service.CacheFactory;
import spin.common.util.TimeUT;

/**
 * 断点续播
 * @author zhuyq@zensvision.com
 * @date 2017年3月27日
 */

public class TRecord extends Entity {

	public static final String INDEX = "trecord";

	public TRecord() {
		super(CacheFactory.getCacheTableByRoute(INDEX));
	}

	public List<Record> isExistRecord(Record record) {
		return Db.find("select * from " + getTableName() + " where GUID = '" + record.get("GUID").toString()
				+ "' and UserID = '" + record.get("UserID").toString() + "'");
	}

	// 添加record
	public boolean insertRecord(Record record) {
		record.set("CreateTime", TimeUT.getCurrTime());
		return Db.save(getTableName(), "ID", record);
	}

	// 更新record
	public boolean updateRecord(Record record) {
		record.set("CreateTime", TimeUT.getCurrTime());
		return Db.update(getTableName(), "ID", record);
	}

}
