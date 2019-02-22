package spin.common.model;

import java.util.List;
import java.util.Map;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

import spin.common.util.TimeUT;

/**
 * 实体基类
 * 
 * @author huyi@zensvision.com
 */
public class Entity {
	private String tableName;
	private String primaryKey;
	private String foreignKey;

	public Entity(Table table) {
		tableName = table.getTableName();
		primaryKey = table.getPrimaryKey();
		foreignKey = table.getForeignKey();
	}

	public Entity(String tableName, String primaryKey, String foreignKey) {
		this.tableName = tableName;
		this.primaryKey = primaryKey;
		this.foreignKey = foreignKey;
	}

	public String getForeignKey() {
		return foreignKey;
	}

	public void setForeignKey(String foreignKey) {
		this.foreignKey = foreignKey;
	}

	public String getTableName() {
		return tableName;
	}

	public Record parseRecord(Map<String, String[]> map) {
		Record record = new Record();
		for (Map.Entry<String, String[]> entry : map.entrySet()) {
			record.set(entry.getKey(), entry.getValue()[0]);
		}
		return record;
	}

	public Record getEntityByPrimary(String value) {
		return Db.findFirst("select * from" + tableName + "where " + primaryKey + " = " + value);
	}

	public Record getEntityByPrimary(long value) {
		return Db.findById(tableName, primaryKey, value);
	}

	public Record getEntityByKey(String key, String value) {
		return Db.findFirst("select * from " + getTableName() + " where " + key + " = '" + value + "'");
	}

	public List<Record> getEntitysByKey(String key, String value) {
		return Db.find("select * from " + getTableName() + " where " + key + " = '" + value + "'");
	}

	public List<Record> getEntitysByKeyLike(String key, String value) {
		return Db.find("select * from " + getTableName() + " where " + key + " like '%" + value + "%'");
	}

	public List<Record> getAllList() {
		return Db.find("select * from " + tableName);
	}

	/**
	 * @param sifter
	 * @param func
	 *            select / update
	 * @param selectStyle
	 *            查询方式 true:模糊查询; false:严格查询
	 * @return
	 */
	public String parseFieldSql(String sifter, String func, boolean selectStyle) {
		String sifterSql = ""; // sifter:
								// string:key@value,number:key@!value,......
		if (!sifter.isEmpty() && sifter.contains("@")) {
			String[] sifters = sifter.contains(",") ? sifter.split(",") : new String[] { sifter }, buf = null,
					format = null;
			for (int i = 0; i < sifters.length; ++i) {
				buf = sifters[i].contains("@") ? sifters[i].split("@") : null;
				format = buf[0].contains(":") ? buf[0].split(":") : null;
				sifterSql += buf == null ? ""
						: (i > 0 ? (func.equals("select") ? " and " : ",") : "") + format[1]
								+ (format[0].equals("string")
										? (selectStyle ? " like '%" + buf[1] + "%'"
												: (buf[1].contains("!") ? " <> '" + buf[1].replace("!", "") + "'"
														: " = '" + buf[1] + "'"))
										: (buf[1].contains("!") ? " <> " + buf[1].replace("!", "") : " = " + buf[1]));
			}
		}
		return sifterSql;
	}

	public Page<Record> getSourcesByPagin(int page, int pageSize, int deleted, String orderCase, String sifter) {
		if (tableName.isEmpty())
			return null;
		if (deleted == 2) {// 已发布
			return Db.paginate(page, pageSize, "select * ",
					"from " + tableName + " where deleted = ? " + (sifter.isEmpty() ? "" : " and ")
							+ parseFieldSql(sifter, "select", true)
							+ (orderCase.equals("") ? "" : (" order by " + orderCase)),
					deleted);

		} else {// 未删除
			return Db.paginate(page, pageSize, "select * ",
					"from " + tableName + " where deleted != ? " + (sifter.isEmpty() ? "" : " and ")
							+ parseFieldSql(sifter, "select", true)
							+ (orderCase.equals("") ? "" : (" order by " + orderCase)),
					deleted);

		}
	}

	public Page<Record> getSys(int page, int pageSize, int deleted, String orderCase, String sifter) {
		if (tableName.isEmpty())
			return null;
		/*
		 * if(deleted == 2){//已发布 return Db.paginate(page, pageSize, "select * "
		 * , "from " + tableName + " where deleted = ? " + (sifter.isEmpty() ?
		 * "" : " and ") + parseFieldSql(sifter, "select", true) +
		 * (orderCase.equals("") ? "" : (" order by " + orderCase)), deleted);
		 * 
		 * }else{//未删除
		 */ return Db.paginate(page, pageSize, "select * ",
				"from " + tableName + " where deleted = ? " + (sifter.isEmpty() ? "" : " and ")
						+ parseFieldSql(sifter, "select", true)
						+ (orderCase.equals("") ? "" : (" order by " + orderCase)),
				deleted);

		// }
	}

	public Page<Record> getImages(int page, int pageSize, int deleted, String orderCase, String sifter) {
		if (tableName.isEmpty())
			return null;
		return Db.paginate(page, pageSize, "select * ",
				"from " + tableName + " where deleted = ? " + (sifter.isEmpty() ? "" : " and ")
						+ parseFieldSql(sifter, "select", true)
						+ (orderCase.equals("") ? "" : (" order by " + orderCase)),
				deleted);

	}

	public List<Record> getImagesByGUIDs(String Ids) {
		return Db.find("select * from " + tableName + " where GUID in (" + Ids + ")");
	}

	public boolean insert(Record record) {
		if (tableName.isEmpty())
			return false;
		if (record.getStr("CreateTime") == null || record.getStr("CreateTime").isEmpty())
			record.set("CreateTime", TimeUT.getCurrTime());
		return Db.save(tableName, primaryKey, record);
	}

	public long insertPrimary(Record record) {
		if (tableName.isEmpty())
			return 0;
		record.set("CreateTime", TimeUT.getCurrTime());
		Db.save(tableName, primaryKey, record);
		return record.getLong(primaryKey);
	}

	public boolean insert(Map<String, String[]> map) {
		Record record = parseRecord(map);
		record.remove("ID");
		record.set("CreateTime", TimeUT.getCurrTime());
		return Db.save(tableName, primaryKey, record);
	}

	public boolean update(Record record) {
		record.set("UpdateTime", TimeUT.getCurrTime());
		return Db.update(tableName, primaryKey, record);
	}

	public boolean update(Map<String, String[]> map) {
		Record record = parseRecord(map);
		record.set("UpdateTime", TimeUT.getCurrTime());
		return Db.update(tableName, primaryKey, record);
	}

	public boolean updateByForeign(Map<String, String[]> map) {
		Record record = parseRecord(map);
		record.set("UpdateTime", TimeUT.getCurrTime());
		return Db.update(tableName, foreignKey, record);
	}

	public boolean updateKeys(String ids, String sifter) {
		if (ids.isEmpty() || tableName.isEmpty())
			return false;
		return Db.update("update " + tableName + " set " + parseFieldSql(sifter, "update", false) + " where "
				+ primaryKey + " in (" + ids + ")") > 0;
	}

	public boolean updateKeysByForeign(String ids, String sifter) {
		if (ids.isEmpty() || tableName.isEmpty() || foreignKey.isEmpty())
			return false;
		return Db.update("update " + tableName + " set " + parseFieldSql(sifter, "update", false) + " where "
				+ foreignKey + " in (" + ids + ")") > 0;
	}

	public boolean remove(String ids) {
		if (ids.isEmpty() || tableName.isEmpty())
			return false;
		return Db.update("update " + tableName + " set deleted = 1 where " + primaryKey + " in (" + ids + ")") > 0;
	}

	public boolean removeByForeign(String ids) {
		if (ids.isEmpty() || tableName.isEmpty())
			return false;
		return Db.update("update " + tableName + " set deleted = 1 where " + foreignKey + " in (" + ids + ")") > 0;
	}

	public boolean delete(String ids) {
		if (ids.isEmpty() || tableName.isEmpty())
			return false;
		return Db.update("delete from " + tableName + " where " + primaryKey + " in (" + ids + ")") > 0;
	}

	public boolean deleteByForeign(String ids) {
		if (ids.isEmpty() || tableName.isEmpty() || foreignKey.isEmpty())
			return false;
		return Db.update("delete from " + tableName + " where " + foreignKey + " in (" + ids + ")") > 0;
	}

	public boolean updateImg(String ids, String deleted) {
		if (ids.isEmpty() || tableName.isEmpty())
			return false;
		return Db.update(
				"update " + tableName + " set Deleted = " + deleted + " where " + primaryKey + " in (" + ids + ")") > 0;
	}

	public boolean removeImage(String ids) {
		if (ids.isEmpty() || tableName.isEmpty())
			return false;
		return Db.update("update " + tableName + " set deleted = 1 where " + primaryKey + " in (" + ids + ")") > 0;
	}
}
