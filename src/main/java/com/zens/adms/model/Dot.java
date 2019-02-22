package com.zens.adms.model;

import java.util.List;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

import spin.common.model.Entity;
import spin.common.service.CacheFactory;
import spin.common.util.TimeUT;

/**
 * 打点拆条数据处理
 * 
 * @author zyq
 * @e-mail zhuyq@zensvision.com
 * @date 2016年12月12日 上午11:22:51
 */

public class Dot extends Entity {

	public static final String INDEX = "dot";
	/**
	 * 媒资类型
	 */
	public static final String SINGLE_MEDIA = "1"; // 单片
	public static final String SERIES_PAKAGE_MEDIA = "2"; // 剧集虚拟包
	public static final String SERIES_SINGLE_MEDIA = "3"; // 剧集单片

	/**
	 * 媒资发布状态
	 */
	public static final String INIT_STATUS = "0"; // 初始状态，未上架
	public static final String PUBLISH_STATUS = "1"; // 已发布，即上架
	public static final String NOT_PUBLISH_STATUS = "2"; // 已下架

	public Dot() {
		super(CacheFactory.getCacheTableByRoute(INDEX));
	}

	public List<Record> isExistDot(String GUID) {
		return Db.find("select * from " + getTableName() + " where GUID = '" + GUID + "'");
	}

	/**
	 * 保存拆条数据
	 * 
	 * @param record
	 * @return
	 */
	public boolean insertDot(Record record) {
		record.set("CreateTime", TimeUT.getCurrTime()).set("UpdateTime", TimeUT.getCurrTime());
		return Db.save(getTableName(), record);
	}

	/**
	 * 更新数据
	 * 
	 * @param record
	 * @return
	 */
	public boolean updateDot(Record record) {
		record.set("UpdateTime", TimeUT.getCurrTime());
		return Db.update(getTableName(), "ID", record);
	}
}
