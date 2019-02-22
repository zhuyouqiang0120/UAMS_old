package com.zens.adms.model;

import java.util.List;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

import spin.common.model.Entity;
import spin.common.service.CacheFactory;
import spin.common.util.TimeUT;

/**
 * 历史记录管理类
 * 
 * @author zhuyq@zensvision.com
 * @date 2017年3月22日
 */

public class Collect extends Entity {

	public static final String INDEX = "collect";

	public Collect() {
		super(CacheFactory.getCacheTableByRoute(INDEX));
	}

	public List<Record> isExistCollect(Record record) {
		return Db.find("select * from " + getTableName() + " where GUID = '" + record.get("GUID").toString()
				+ "' and UserID = '" + record.get("UserID").toString() + "'");
	}

	// 获取所有收藏
	public List<Record> getCollect(int pageSize, int pageNumber, String UserID) {
		return Db.find("SELECT m.GUID,m.Type,m.Title,m.Region,m.Grade,m.Actor,m.Tag,m.Duration,m.Director,m.`Desc`,m.PosterUrl,m.Years,m.VideoUrl,m.VideoSize,m.Provider FROM t_media m, "+ getTableName() +" h where m.GUID = h.GUID and h.UserID = '" + UserID + "' order by h.CreateTime desc limit "
				+ pageNumber * pageSize + "," + pageSize);
	}

	// 获取所有收藏记录数目
	public Long getCollectCount(String UserID) {
		return Db.queryLong("select count(*) from " + getTableName() + " where UserID = '" + UserID + "'");
	}

	// 添加collect
	public boolean insertCollect(Record record) {

		return Db.save(getTableName(), "ID", record);
	}

	// 更新
	public boolean updateCollect(Record record) {
		record.set("CreateTime", TimeUT.getCurrTime());
		return Db.update(getTableName(), "ID", record);
	}

	// 删除collect
	public int deleteCollect(Record record) {

		return Db.update("delete from " + getTableName() + " where GUID = '" + record.get("GUID").toString()
				+ "' and UserID = '" + record.get("UserID").toString() + "'");
	}
}
