package spin.common.model;

/**
 * 控制器类
 * 
 * @author huyi@zensvision.com
 * @date 2016年4月26日
 */
public class Control {
	private String route; //路由
	private Class<?> mapping; //映射控制器类

	public String getRoute() {
		return route;
	}

	public void setRoute(String route) {
		this.route = route;
	}

	public Class<?> getMapping() {
		return mapping;
	}

	public void setMapping(Class<?> mapping) {
		this.mapping = mapping;
	}

}
