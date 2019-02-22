package spin.common.model;

/**
 * 数据表
 * 
 * @author huyi@zensvision.com
 * @date 2016年4月26日
 */
public class Table {
	private boolean resident;
	private String index;
	private String tableName;
	private String primaryKey;
	private String foreignKey;
	private String intro;

	public Table() {
		resident = false; // 默认false
	}

	public boolean isResident() {
		return resident;
	}

	public Table(String tableName, String primaryKey, String foreignKey, String intro) {
		this.tableName = tableName;
		this.primaryKey = primaryKey;
		this.foreignKey = foreignKey;
		this.intro = intro;
	}

	public String getIndex() {
		return index;
	}

	public void setIndex(String index) {
		this.index = index;
	}

	public void setResident(boolean resident) {
		this.resident = resident;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getPrimaryKey() {
		return primaryKey;
	}

	public void setPrimaryKey(String primaryKey) {
		this.primaryKey = primaryKey;
	}

	public String getForeignKey() {
		return foreignKey;
	}

	public void setForeignKey(String foreignKey) {
		this.foreignKey = foreignKey;
	}

	public String getIntro() {
		return intro;
	}

	public void setIntro(String intro) {
		this.intro = intro;
	}

}
