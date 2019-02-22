package com.zens.adms.controller;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.slf4j.Logger;

import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Record;
import com.zens.adms.config.CacheConfig;

import spin.common.controller.PublicController;
import spin.common.model.Database;
import spin.common.model.Entity;
import spin.common.service.CacheFactory;
import spin.common.service.MYSQLFactory;
import spin.common.service.SLF4jLoggerFactory;
import spin.common.util.SizeFormatUT;
import spin.common.util.TimeUT;

/**
 * 数据备份、还原控制器
 * 
 * @author huyi@zensvision.com
 * @date 2016年4月28日
 */
public class BackupController extends PublicController {
	private static final Logger logger = SLF4jLoggerFactory.getBackupLogger();

	private Entity backup = CacheFactory.getCacheEntityByRoute("backup");

	private Record backCache = CacheConfig.SQL_BACKUP_CACHE;
	private Database database = CacheFactory.DATABASE;

	public void backupDB() {
		String fileName = database.getName() + "_" + new SimpleDateFormat("MM-dd-yyyy-HH-mm-ss").format(new Date())
				+ ".sql";
		boolean flag = false;
		String result = "";

		Record record = new Record();
		try {
			String filePath = backCache.getStr("Real") + fileName;
			flag = MYSQLFactory.backUpTable(database, filePath);

			record.set("FileName", fileName).set("Path", filePath).set("Deleted", 0);
			if (flag) {
				File file = new File(filePath);
				record.set("Size", SizeFormatUT.parseFileSize(file.length())).set("State", 1);
			} else {
				record.set("Size", 0).set("State", 0);
			}
		} catch (Exception e) {
			result = e.toString().length() > 255 ? e.toString().substring(0, 254) : e.toString();
			record.set("Size", 0).set("State", 0);
			flag = false;
		} finally {
			record.set("Result", result.isEmpty() ? "备份数据库" + (flag ? "成功" : "失败") : result);
			backup.insert(record);

			logger.info(TimeUT.getCurrTime() + " | backup | " + flag + " | " + JsonKit.toJson(record));
		}
		renderJson("{\"success\":" + flag + "}");
	}

	public void restoreDB() {
		Record record = backup.parseRecord(getParaMap());

		String fileName = record.getStr("Path");
		boolean flag = false;
		String result = "";
		try {
			File file = new File(fileName);
			if (file.exists()) {
				flag = MYSQLFactory.restoreTable(database, fileName);
			} else {
				result = "备份文件不存在";
			}
		} catch (Exception e) {
			result = e.toString().length() > 255 ? e.toString().substring(0, 254) : e.toString();
			flag = false;
		} finally {
			String currTime = TimeUT.getCurrTime();
			record.set("Result", result.isEmpty() ? "还原数据库" + (flag ? "成功" : "失败") : result).set("State", flag ? 1 : 0)
					.set("UpdateTime", currTime);
			if (flag) {
				backup.insert(record);
			} else {
				backup.update(record);
			}
			logger.info(currTime + " | restore | " + flag + " | " + fileName);
		}
		renderJson("{\"success\":" + flag + "}");
	}

	public void deleteDB() {
		Record record = backup.parseRecord(getParaMap());

		File file = new File(record.getStr("Path"));
		boolean flag = false;
		String result = "";
		try {
			if (file.exists()) {
				flag = file.delete();
				if (flag) {
					record.set("Size", "0");
				}
			} else {
				record.set("Size", "0");
				result = "备份文件不存在";
			}
		} catch (Exception e) {
			result = e.toString().length() > 255 ? e.toString().substring(0, 254) : e.toString();
			flag = false;
		} finally {
			record.set("State", flag ? 1 : 0).set("Result",
					result.isEmpty() ? "删除备份文件" + (flag ? "成功" : "失败") : result);
			backup.update(record);
			logger.info(TimeUT.getCurrTime() + " | delete | " + flag + " | " + file.toString());
		}
		renderJson("{\"success\":" + flag + "}");
	}
}
