package com.zens.adms.controller;

import com.zens.adms.model.Placeholder;

import spin.common.controller.PublicController;

/**
 * 占位符控制器
 * 
 * @author huyi@zensvision.com
 */
public class PlaceholderController extends PublicController {

	private Placeholder holder = new Placeholder();

	public void publishPlaceholder() {
		String guid = getPara("GUID");
		boolean flag = false;
		if (guid == null || guid == "") {
			flag = false;
		} else {
			if (holder.isExist(guid)) {
				flag = holder.updateByForeign(getParaMap());
			} else {
				flag = holder.insert(getParaMap());
			}
		}
		renderJson("{\"success\":" + flag + "}");
	}

	public void getAdList() {
		renderJson(holder.getAdList(getPara("GUID")));
	}
}
