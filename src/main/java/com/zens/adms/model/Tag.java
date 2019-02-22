package com.zens.adms.model;

import java.util.Map;

import com.jfinal.plugin.activerecord.Db;

import spin.common.model.Entity;
import spin.common.service.CacheFactory;

public class Tag extends Entity {
	public static final String INDEX = "tag";

	public Tag() {
		super(CacheFactory.getCacheTableByRoute(INDEX));
	}

	public boolean isExist(String name) {
		return Db.find("select * from " + getTableName() + " where Name = '" + name + "'").size() > 0;
	}

	public int insertTag(Map<String, String[]> map, String name) {
		if (isExist(name)) {
			return 0; // 已存在
		} else {
			if (insert(map)) {
				return 1; // 成功
			} else {
				return -1; // 失败
			}
		}
	}
}
