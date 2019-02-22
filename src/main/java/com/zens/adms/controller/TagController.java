package com.zens.adms.controller;

import com.jfinal.core.Controller;
import com.zens.adms.model.Tag;

/**
 * 标签控制器
 * 
 * @author huyi@zensvision.com
 */
public class TagController extends Controller {
	private Tag tag = new Tag();

	public void getTags() {
		renderJson(tag.getAllList());
	}

	public void insertTag() {
		renderJson("{\"success\":" + tag.insertTag(getParaMap(), getPara("Name")) + "}");
	}

	public void updateTag() {
		renderJson("{\"success\":" + tag.update(getParaMap()) + "}");
	}

	public void deleteTag() {
		try {
			renderJson("{\"success\":" + tag.delete(getPara("ids")) + "}");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
