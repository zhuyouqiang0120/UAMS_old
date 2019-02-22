package com.zens.adms.controller;

import java.io.IOException;
import java.util.UUID;

import com.chasonx.tools.HttpUtil;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.zens.adms.model.Device;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import spin.common.controller.PublicController;

/**
 * 媒资设备数据
 * 
 * @author zhuyq@zensvision.com
 */
public class DeviceController extends PublicController {
	private Device device = new Device();

	public void getDevices() throws IOException {
		String callback = getPara("UAMS_Callback");
		String sifter = "";
		String desc = "CreateTime asc";
		if (getPara("sifter") != null) {
			sifter = getPara("sifter");
		}
		if (getPara("orderCase") != null) {
			desc = getPara("orderCase");
		}
		Page<Record> datapage = device.getDevices(getParaToInt("currPage"), getParaToInt("pageSize"), desc,
				getParaToInt("deleted"), sifter);

		if (datapage.getList().size() != 0) {
			for (int i = 0; i < datapage.getList().size(); i++) {
				Record record = datapage.getList().get(i);
				String url = "http://" + record.getStr("deviceIP") + record.getStr("deviceExt");
				JSONObject disk = getDisk(url);
				//record.set("disk", getDisk(url));
				
				if(!disk.equals("")){
					JSONObject object = JSONObject.fromObject(disk);
					record.set("d_total", object.get("total"));
					record.set("d_used", object.get("used"));
					record.set("d_avilable", object.get("avilable"));
					record.set("d_usedPercent", object.get("usedPercent"));
					record.set("d_mnt", object.get("mnt"));
				}
				
				record.remove("deviceExt");
			}
		}

		if (null != callback) {
			renderJavascript(callback + "(" + JsonKit.toJson(datapage) + ")");   
		} else {
			renderJson(datapage);
		}
	}
	

	public void getDevices51() throws IOException {
		String callback = getPara("UAMS_Callback");
		String sifter = "";
		String desc = "CreateTime asc";
		if (getPara("sifter") != null) {
			sifter = getPara("sifter");
		}
		if (getPara("orderCase") != null) {
			desc = getPara("orderCase");
		}
		Page<Record> datapage = device.getDevices(getParaToInt("currPage"), getParaToInt("pageSize"), desc,
				getParaToInt("deleted"), sifter);

		if (datapage.getList().size() != 0) {
			for (int i = 0; i < datapage.getList().size(); i++) {
				Record record = datapage.getList().get(i);
				String url = "http://" + record.getStr("deviceIP") + record.getStr("deviceExt");
				//JSONObject disk = getDisk(url);
				record.set("disk", getDisk51(url));
				/*
				if(!disk.equals("")){
					JSONObject object = JSONObject.fromObject(disk);
					record.set("d_total", object.get("total"));
					record.set("d_used", object.get("used"));
					record.set("d_avilable", object.get("avilable"));
					record.set("d_usedPercent", object.get("usedPercent"));
					record.set("d_mnt", object.get("mnt"));
				}
				*/
				record.remove("deviceExt");
			}
		}

		if (null != callback) {
			renderJavascript(callback + "(" + JsonKit.toJson(datapage) + ")");   
		} else {
			renderJson(datapage);
		}
	}

	/*
	 * 获取硬盘存储
	 */
	public JSONArray getDisk51(String url) {
		JSONArray dev = null;
		try {
			dev = new JSONArray();
			String diskStat = HttpUtil.UrlGetResponse(url);
			JSONObject object = JSONObject.fromObject(JSONObject.fromObject(diskStat).get("responseJSON"));
			JSONArray array = JSONArray.fromObject(object.get("disk"));
			//dev = JSONObject.fromObject(array.get(array.size() - 1));
			dev = array;
		} catch (Exception e) {
			return dev;
		}
		return dev;
	}
	
	/*
	 * 获取硬盘存储
	 */
	public JSONObject getDisk(String url) {
		JSONObject dev = new JSONObject();
		try {
			String diskStat = HttpUtil.UrlGetResponse(url);
			JSONObject object = JSONObject.fromObject(JSONObject.fromObject(diskStat).get("responseJSON"));
			JSONArray array = JSONArray.fromObject(object.get("disk"));
			dev = JSONObject.fromObject(array.get(array.size() - 1));
		} catch (Exception e) {
			return dev;
		}
		return dev;
	}

	public static void main(String[] args) {
		System.out.println(UUID.randomUUID().toString());
	}
}
