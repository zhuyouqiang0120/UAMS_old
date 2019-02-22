package com.zens.adms.model;

import java.util.List;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

import spin.common.model.Entity;
import spin.common.service.CacheFactory;
import spin.common.util.TimeUT;

/**
 * 历史记录操作类
 * 
 * @author zhuyq@zensvision.com
 * @date 2017年3月22日
 */

public class BookMark extends Entity {

	public static final String INDEX = "bookmark";

	public BookMark() {
		super(CacheFactory.getCacheTableByRoute(INDEX));
	}

	public List<Record> isExistBookMark(Record record) {
		return Db.find("select * from " + getTableName() + " where GUID = '" + record.get("GUID").toString()
				+ "' and UserID = '" + record.get("UserID").toString() + "'");
	}

	// 获取所有BookMark
	public List<Record> getBookMark(int pageSize, int pageNumber, String UserID) {
		return Db
				.find("SELECT m.GUID,m.Type,m.Title,m.Region,m.Grade,m.Actor,m.Tag,m.Duration,m.Director,m.`Desc`,m.PosterUrl,m.Years,m.VideoUrl,m.VideoSize,m.Provider FROM t_media m, "
						+ getTableName() + " h where m.GUID = h.GUID and h.UserID = '" + UserID
						+ "' order by h.CreateTime desc limit " + pageNumber * pageSize + "," + pageSize);
	}

	// 获取所有BookMark数目
	public Long getBookMarkCount(String UserID) {
		return Db.queryLong("select count(*) from " + getTableName() + " where UserID = '" + UserID + "'");
	}

	// 添加BookMark
	public boolean insertBookMark(Record record) {
		return Db.save(getTableName(), "ID", record);
	}

	// 更新
	public boolean updateBookMark(Record record) {
		record.set("CreateTime", TimeUT.getCurrTime());
		return Db.update(getTableName(), "ID", record);
	}
	
	// del BookMark
	public void delBookMark(Record record) {
		Db.update("delete  from " + getTableName() + " where UserID = '" + record.getStr("UserID") + "' and GUID = '"+record.getStr("GUID")+"'");
	}
}
