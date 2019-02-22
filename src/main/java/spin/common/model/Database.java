package spin.common.model;

/**
 * jdbc 数据
 * 
 * @author huyi@zensvision.com
 * @date 2016年4月26日
 */
public class Database {
	private String driver;
	private String name;
	private String url;
	private String username;
	private String password;
	private String path; //MySQL命令路径 which -a mysqldump

	public Database(String driver, String name, String url, String username, String password, String path) {
		super();
		this.driver = driver;
		this.name = name;
		this.url = url;
		this.username = username;
		this.password = password;
		this.path = path;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getDriver() {
		return driver;
	}

	public void setDriver(String driver) {
		this.driver = driver;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
