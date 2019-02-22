package com.zens.adms.model;

import java.util.List;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

import spin.common.model.Entity;
import spin.common.service.CacheFactory;

public class Title extends Entity {
	public static final String INDEX = "title";

	public Title() {
		super(CacheFactory.getCacheTableByRoute(INDEX));
	}

	public List<Record> getTitles(String key) {
		return Db.find("select * from " + getTableName() + " where NameEN  like '%" + key + "%'");
	}

}
