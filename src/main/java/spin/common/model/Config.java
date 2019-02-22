package spin.common.model;

import java.util.List;

/**
 * 配置实体
 * 
 * @author huyi@zensvision.com
 * @date 2016年4月26日
 */
public class Config {
	List<Control> controls;
	List<Table> tables;

	public List<Control> getControls() {
		return controls;
	}

	public void setControls(List<Control> controls) {
		this.controls = controls;
	}

	public List<Table> getTables() {
		return tables;
	}

	public void setTables(List<Table> tables) {
		this.tables = tables;
	}

}
