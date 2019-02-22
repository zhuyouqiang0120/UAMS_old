package spin.common.controller;

import com.jfinal.core.Controller;

import spin.common.model.Entity;
import spin.common.service.CacheFactory;

/**
 * 公共控制器
 * 
 * @author huyi@zensvision.com
 * @date 2016年4月26日
 */
public class PublicController extends Controller {
	private Entity entity;

	private void resetEntity(String route) {
		entity = CacheFactory.getCacheEntityByRoute(route);
		if (entity == null) {
			entity = new Entity(CacheFactory.getCacheTableByRoute(route));
		}
	}

	public void getEntitys() {
		resetEntity(getRoute());
		renderJson(entity.getSys(getParaToInt("currPage"), getParaToInt("pageSize"), getParaToInt("deleted"),
				getPara("orderCase"), getPara("sifter")));
	}

	public void insertEntity() {
		resetEntity(getRoute());

		renderJson("{\"success\":" + entity.insert(getParaMap()) + "}");
	}

	public void updateEntity() {
		resetEntity(getRoute());
		renderJson("{\"success\":" + entity.update(getParaMap()) + "}");
	}

	public void removeEntity() {
		resetEntity(getRoute());
		try {
			renderJson("{\"success\":" + entity.remove(getPara("ids")) + "}");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void deleteEntity() {
		resetEntity(getRoute());
		try {
			renderJson("{\"success\":" + entity.delete(getPara("ids")) + "}");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private String getRoute() {
		return getRequest().getHeader("TableRoute");
	}
}
