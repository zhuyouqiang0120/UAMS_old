package com.zens.adms.controller;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import javax.imageio.ImageIO;

import com.chasonx.directory.FileUtil;
import com.jfinal.aop.Before;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.zens.adms.config.CacheConfig;
import com.zens.adms.model.BookMark;
import com.zens.adms.model.Collect;
import com.zens.adms.model.Dot;
import com.zens.adms.model.History;
import com.zens.adms.model.Media;
import com.zens.adms.model.TRecord;
import com.zens.adms.util.ExcelReadUT;
import com.zens.ssh2.tools.Ssh2Util;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import spin.common.controller.PublicController;
import spin.common.model.Entity;
import spin.common.service.CacheFactory;
import spin.common.util.GUIDCreateUT;
import spin.common.util.HttpClientUT;
import spin.common.util.TimeUT;

/**
 * 媒资数据
 * 
 * @author zhuyq@zensvision.com
 */
public class MediaController extends PublicController {
	private Media media = new Media();
	private Dot dot = new Dot();
	private History history = new History();
	private Collect collect = new Collect();
	private TRecord trecord = new TRecord();
	private BookMark bookmark = new BookMark();
	private Entity poster = CacheFactory.getCacheEntityByRoute("poster");

	public void getImage() {
		String callback = getPara("UAMS_Callback");
		Page<Record> datapage = poster.getSourcesByPagin(getParaToInt("currPage"), getParaToInt("pageSize"),
				getParaToInt("deleted"), getPara("orderCase"), getPara("sifter"));
		if (null != callback) {
			renderJavascript(callback + "(" + JsonKit.toJson(datapage) + ")");
		} else {
			renderJson(datapage);
		}
	}

	public void getImages() {
		String callback = getPara("UAMS_Callback");
		Page<Record> datapage = poster.getImages(getParaToInt("currPage"), getParaToInt("pageSize"),
				getParaToInt("deleted"), getPara("orderCase"), getPara("sifter"));
		if (datapage.getList().size() != 0) {
			for (int i = 0; i < datapage.getList().size(); i++) {
				datapage.getList().get(i).set("auditStatus", datapage.getList().get(i).get("Deleted"));
			}
		}
		if (null != callback) {
			renderJavascript(callback + "(" + JsonKit.toJson(datapage) + ")");
		} else {
			renderJson(datapage);
		}
	}

	public void getImagesByGUIDs() {
		String callback = getPara("UAMS_Callback");
		List<Record> records = new ArrayList<Record>();
		String id = getPara("ids");
		int count = 0;
		String ids = "";
		if (id.equals("")) {
			ids = id;
			count = 0;
		} else {
			if (id.indexOf(",") == -1) {
				ids = "'" + id + "'";
				count = 1;
			} else {
				ids = "'" + id.replace(",", "','") + "'";
				count = ids.split(",").length;
			}
			records = poster.getImagesByGUIDs(ids);
			if (records.size() != 0) {
				for (int i = 0; i < records.size(); i++) {
					records.get(i).set("auditStatus", records.get(i).get("Deleted"));
					records.get(i).remove("Deleted");
				}
			}
		}

		Record record = new Record();
		record.set("totalRow", count);
		record.set("list", records);
		if (null != callback) {
			renderJavascript(callback + "(" + JsonKit.toJson(record) + ")");
		} else {
			renderJson(record);
		}
	}

	public void checkImage() {
		String[] imgIds = getParaValues("imgIds[]");
		Integer Deleted = getParaToInt("Deleted");
		String idStr = "";
		for (int i = 0, len = imgIds.length; i < len; i++) {
			idStr += imgIds[i];
			if (i < (len - 1))
				idStr += ",";
		}
		renderJson(Db.update("update t_media_poster set Deleted = ? where ID in(" + idStr + ")", Deleted));
	}

	public void submitImage() {
		renderJson("{\"success\":" + poster.updateImg(getPara("ids"), getPara("deleted")) + "}");
	}

	@Before(Tx.class)
	public void removeImage() {
		renderJson("{\"success\":" + poster.removeImage(getPara("ids")) + "}");
	}

	public void injectMediaForBesTV() {
		try {
			ExcelReadUT.readExcel(getPara("path"));
		} catch (IOException e) {
			e.printStackTrace();
		}
		renderJson("{\"count\" : " + false + "}");
	}

	public void getMedias() {
		String callback = getPara("UAMS_Callback");
		Page<Record> datapage = media.getMedias(getParaToInt("currPage"), getParaToInt("pageSize"),
				getPara("orderCase"), getParaToInt("deleted"), getPara("sifter"));
		if (datapage.getList().size() != 0) {
			for (int i = 0; i < datapage.getList().size(); i++) {
				datapage.getList().get(i).set("auditStatus", datapage.getList().get(i).get("Deleted"));
			}
		}
		
		if (null != callback) {
			renderJavascript(callback + "(" + JsonKit.toJson(datapage) + ")");
		} else {
			renderJson(datapage);
		}
	}

	public void addTag() {
		long id = getParaToLong("ID");
		String name, newName;
		try {
			name = new String(getPara("Name").getBytes(), "UTF-8");
			newName = new String(getPara("newName").getBytes(), "UTF-8");
			renderJson("{\"success\":" + media.addTag(id, name, newName) + "}");
		} catch (UnsupportedEncodingException e) {
			renderJson("{\"success\":" + false + "}");
		}
	}

	public void insertMedia() {
		renderJson("{\"success\":" + media.insert(getParaMap()) + "}");
	}

	@Before(Tx.class)
	public void updateMedia() {
		renderJson("{\"success\":" + media.updateMedia(getParaMap()) + "}");
	}

	@Before(Tx.class)
	public void removeMedia() {
		renderJson("{\"success\":" + media.removeMedia(getPara("ids")) + "}");
	}

	public void submitMedia() {
		renderJson("{\"success\":" + media.updateKeys(getPara("ids"), getPara("sifter")) + "}");
	}

	public void getEpisodes() {
		renderJson(JsonKit.toJson(media.getMedias(getParaToInt("currPage"), getParaToInt("pageSize"),
				getPara("orderCase"), getParaToInt("deleted"), getPara("sifter"))));
	}

	/**
	 * 新增剧集
	 */
	public void insertEpisode() {
		Record record = new Record().set("GUID", GUIDCreateUT.guid()).set("Provider", "手动新增").set("Deleted", "0")
				.set("Title", getPara("Title")).set("Tag", getPara("Tag")).set("Director", "").set("Actor", "")
				.set("Type", Media.SERIES_PAKAGE_MEDIA).set("Episode", "0").set("State", Media.INIT_STATUS);
		renderJson("{\"success\":" + media.insert(record) + "}");
	}

	/**
	 * 打包/拆散剧集
	 */
	@Before(Tx.class)
	public void packMedia() {
		String type = getPara("type"), episode = getPara("episode"), ids = getPara("ids");
		long pid = getParaToLong("pid");
		synchronized (this) {
			boolean flag = false;
			if (type.equals(Media.SERIES_PAKAGE_MEDIA)) {// 打包
				flag = media.updateKeys(pid + "", "string:Episode@" + episode)
						? media.updateKeys(ids, "number:Type@" + Media.SERIES_SINGLE_MEDIA + ",number:PID@" + pid)
						: false;
			} else if (type.equals(Media.SINGLE_MEDIA)) {// 拆散
				flag = media.updateKeys(pid + "", "string:Episode@" + episode) ? media.updateKeys(ids, "number:Type@"
						+ Media.SINGLE_MEDIA + ",number:State@" + Media.NOT_PUBLISH_STATUS + ",number:PID@0") : false;
			}
			renderJson("{\"success\":" + flag + "}");
		}
	}

	/**
	 * 外部上传图片
	 */
	public void uploadFile() {

		Record imageCache = CacheConfig.IMAGE_CACHE;
		String imgPath = imageCache.getStr("Real");

		Record image = new Record();
		File uploadFile = getFile().getFile();

		String callback = getPara("UAMS_Callback");
		String authCode = getPara("authCode");
		String position = getPara("position"); // 位置
		String deleted = getPara("deleted");
		long fileSize = uploadFile.length();

		File newFile = new File(
				imgPath + TimeUT.getRenameTime() + uploadFile.getName().substring(uploadFile.getName().indexOf(".")));
		System.out.println(
				imgPath + TimeUT.getRenameTime() + uploadFile.getName().substring(uploadFile.getName().indexOf(".")));
		FileUtil.moveFile(uploadFile, newFile);
		FileUtil.delfile(uploadFile.getPath());
		// uploadFile.renameTo(newFile); // 重命名

		BufferedImage bufferedImage = null;
		int width = 0, height = 0, hash = 0;
		try {
			bufferedImage = ImageIO.read(newFile);
			width = bufferedImage.getWidth();
			height = bufferedImage.getHeight();
			hash = bufferedImage.hashCode();
		} catch (IOException e) {
			e.printStackTrace();
		}

		image.set("GID", 0).set("Title", getPara("Summary")).set("Size", fileSize).set("Hash", hash)
				.set("Height", height).set("Width", width).set("Deleted", 0).set("FileName", newFile.getName())
				.set("Format", newFile.getName().substring(newFile.getName().indexOf(".") + 1))
				.set("Url", imageCache.get("Virtual") + newFile.getName()).set("Path", imgPath)
				.set("AuthCode", authCode).set("Position", position).set("Deleted", deleted);
		String data = "{\"success\" : " + Db.save(poster.getTableName(), image) + ", \"path\":\"" + imgPath + "\"}";
		if (null != callback)
			renderJavascript(callback + "(" + data + ")");
		else
			renderJson(data);
	}

	/**
	 * search搜索接口 2017-03-21
	 */
	public void search() {
		String callback = getPara("UAMS_Callback");
		String key = getPara("key");

		Integer pageSize = getParaToInt("pageSize");
		Integer pageNumber = getParaToInt("pageNumber");
		List<Record> records = new ArrayList<>();
		Record record = new Record();
		if (pageNumber == 0) {
			records = media.getMediaByKey(key, pageSize, pageNumber);
			int count = records.size();
			record.set("totalRow", count);
			record.set("totalPage", "1");
			record.set("pageSize", count);
			record.set("pageNumber", "1");
			record.set("list", records);
		} else {
			// pageNumber = pageNumber - 1;System.out.println(pageNumber);
			records = media.getMediaByKey(key, pageSize, pageNumber);
			int count = media.getMediaByKey(key, null, 0).size();
			int pages = count / pageSize;
			int res = count % pageSize;
			record.set("totalRow", count);
			record.set("totalPage", res == 0 ? pages : pages + 1);
			record.set("pageSize", pageSize);
			record.set("pageNumber", pageNumber);
			record.set("list", records);
		}
		
		String res = new HttpClientUT().sendGet("http://localhost/search.json", "");
		System.out.println(res);
		JSONObject jsonObject = JSONObject.fromObject(res);
		JSONObject DataArea = JSONObject.fromObject(jsonObject.get("DataArea")); 
		JSONArray Movies = JSONArray.fromObject(DataArea.get("ListOfSearchMovie"));
		System.out.println(Movies.size());
		for(Record record2 : records) {
			JSONObject rec = new JSONObject();
			rec.element("genre","zens");
			rec.element("detailUrl", record2.get(""));
			rec.element("titleFull", record2.get("Title"));
			rec.element("channelCode", record2.get(""));
			rec.element("runtime", record2.get(""));
			rec.element("beginTime", record2.get(""));
			rec.element("endTime", record2.get(""));
			rec.element("assetId", record2.get("GUID"));
			rec.element("providerId", record2.get(""));
			rec.element("programguideId", record2.get(""));
			Movies.add(rec);
		}
		DataArea.element("ListOfSearchMovie", Movies);
		jsonObject.element("DataArea", DataArea);

		if (null != callback)
			renderJavascript(callback + "(" + JsonKit.toJson(jsonObject) + ")");
		else
			renderJson(jsonObject);
	}

	/**
	 * 添加收藏接口 2017-03-22
	 */
	public void collect() {
		boolean b = true;
		String callback = getPara("UAMS_Callback");
		String GUID = getPara("GUID");
		String UserID = getPara("UserID");
		Record record = new Record();
		record.set("GUID", GUID).set("UserID", UserID);
		List<Record> records = collect.isExistCollect(record);
		if (records.size() == 0) {
			b = collect.insert(record);
		} else {
			b = collect.updateCollect(records.get(0));
		}
		if (null != callback)
			renderJavascript(callback + "(" + b + ")");
		else
			renderJson(b);
	}

	/**
	 * 删除收藏接口 2017-03-22
	 */
	public void delcollect() {
		String callback = getPara("UAMS_Callback");
		String GUID = getPara("GUID");
		String UserID = getPara("UserID");
		Record record = new Record();
		record.set("GUID", GUID).set("UserID", UserID);
		int b = collect.deleteCollect(record);
		if (null != callback)
			renderJavascript(callback + "(" + b + ")");
		else
			renderJson(b);
	}

	/**
	 * 获取收藏记录接口 2017-03-23
	 */
	public void getcollect() {
		String callback = getPara("UAMS_Callback");
		String UserID = getPara("UserID");
		Integer pageSize = getParaToInt("pageSize");
		Integer pageNumber = getParaToInt("pageNumber") - 1;

		int count = collect.getCollectCount(UserID).intValue();
		int pages = count / pageSize;
		int res = count % pageSize;

		Record record = new Record();
		record.set("totalRow", count);
		record.set("totalPage", res == 0 ? pages : pages + 1);
		record.set("pageSize", pageSize);
		record.set("pageNumber", pageNumber);
		List<Record> records = collect.getCollect(pageSize, pageNumber, UserID);
		record.set("list", records);
		if (null != callback)
			renderJavascript(callback + "(" + JsonKit.toJson(record) + ")");
		else
			renderJson(record);
	}

	/**
	 * 记录点播历史记录接口 2017-03-22
	 */
	public void history() {
		boolean b = true;
		String callback = getPara("UAMS_Callback");
		String GUID = getPara("GUID");
		String UserID = getPara("UserID");
		Record record = new Record();
		record.set("GUID", GUID).set("UserID", UserID);
		List<Record> records = history.isExistHistory(record);
		if (records.size() == 0) {
			b = history.insert(record);
		} else {
			b = history.updateHistory(records.get(0));
		}
		if (null != callback)
			renderJavascript(callback + "(" + new Record().set("success", b) + ")");
		else
			renderJson(new Record().set("success", b));
	}

	/**
	 * 获取历史记录接口 2017-03-23
	 */
	public void gethistory() {
		String callback = getPara("UAMS_Callback");
		String UserID = getPara("UserID");
		Integer pageSize = getParaToInt("pageSize");
		Integer pageNumber = getParaToInt("pageNumber") - 1;

		int count = history.getHistoryCount(UserID).intValue();
		int pages = count / pageSize;
		int res = count % pageSize;

		Record record = new Record();
		record.set("totalRow", count);
		record.set("totalPage", res == 0 ? pages : pages + 1);
		record.set("pageSize", pageSize);
		record.set("pageNumber", pageNumber);
		List<Record> records = history.getHistory(pageSize, pageNumber, UserID);
		record.set("list", records);
		if (null != callback)
			renderJavascript(callback + "(" + JsonKit.toJson(record) + ")");
		else
			renderJson(record);
	}

	/**
	 * 获取单剧集详情，for打点拆条 2016-12-12
	 */
	public void getMedia() {
		String callback = getPara("UAMS_Callback");
		String GUID = getPara("GUID");
		Record record = media.getMediaByGUID(GUID);
		if(record != null){
			String type = record.getStr("Type");System.out.println(type);
			if(type.equals("2")){
				BigInteger PID = record.getBigInteger("ID");System.out.println(PID);
				List<Record> records = media.getEpisodesByPID(PID);
				record.set("Episodes", records);
				record.set("indexs", records.size());
			}
		}else{
			record = new Record();
			record.set("date", "null");
		}
		if (null != callback)
			renderJavascript(callback + "(" + JsonKit.toJson(record) + ")");
		else
			renderJson(record);
	}
	
	/**
	 * 根据集数获取单剧集详情， 2018-01-15
	 */
	public void getMediaByIdx() {
		String callback = getPara("UAMS_Callback");
		int Idx = getParaToInt("Idx");
		String FGUID = getPara("FGUID");
		Record record = media.getMediaByGUID(FGUID);
		if(record != null){
			String type = record.getStr("Type");
			if(type.equals("2")){//电视剧
				BigInteger PID = record.getBigInteger("ID");
				List<Record> records = media.getEpisodesByPID(PID);
				record.set("Episodes", "");
				if(Idx <= records.size()) {
					record.set("Episodes", records.get(Idx-1));
				}
				record.set("indexs", records.size());
			}
		}else{
			record = new Record();
			record.set("date", "null");
		}
		if (null != callback)
			renderJavascript(callback + "(" + JsonKit.toJson(record) + ")");
		else
			renderJson(record);
	}
	
	/**
	 * 记录点播书签20180115
	 */
	public void addbookmark() {
		boolean b = true;
		String callback = getPara("UAMS_Callback");
		String GUID = getPara("GUID");
		String UserID = getPara("UserID");
		String NAME = getPara("CONTENT_NAME");
		String TIME = getPara("CONTENT_TIME");
		String TYPE = getPara("CONTENT_TYPE");
		Record record = new Record();
		record.set("GUID", GUID).set("UserID", UserID).set("CONTENT_NAME", NAME).set("CONTENT_TYPE", TYPE).set("CONTENT_TIME", TIME);
		List<Record> records = bookmark.isExistBookMark(record);
		if (records.size() == 0) {
			b = bookmark.insert(record);
		} else {
			records.get(0).set("CONTENT_NAME", NAME).set("CONTENT_TYPE", TYPE).set("CONTENT_TIME", TIME);
			b = bookmark.updateBookMark(records.get(0));
		}
		if (null != callback)
			renderJavascript(callback + "(" + new Record().set("success", b) + ")");
		else
			renderJson(new Record().set("success", b));
	}
	
	/**
	 * 删除点播书签20180115
	 */
	public void delbookmark() {
		boolean b = true;
		String callback = getPara("UAMS_Callback");
		String GUID = getPara("GUID");
		String UserID = getPara("UserID");
		Record record = new Record();
		record.set("GUID", GUID).set("UserID", UserID);
		bookmark.delBookMark(record);
		if (null != callback)
			renderJavascript(callback + "(" + new Record().set("success", b) + ")");
		else
			renderJson(new Record().set("success", b));
	}

	/**
	 * 获取点播书签20180115
	 */
	public void getbookmark() {
		boolean b = true;
		String callback = getPara("UAMS_Callback");
		String GUID = getPara("GUID");
		String UserID = getPara("UserID");
		Record record = new Record();
		record.set("GUID", GUID).set("UserID", UserID);
		List<Record> records = bookmark.isExistBookMark(record);
		if (records.size() != 0) {
			record = records.get(0);
		} else {
			record = null;
		}
		if (null != callback)
			renderJavascript(callback + "(" + record + ")");
		else
			renderJson(record);
	}
	
	/**
	 * 保存拆条数据 2016-12-12
	 */
	public void saveDot() {
		boolean b = true;
		String callback = getPara("UAMS_Callback");
		String GUID = getPara("GUID");
		String Programs = getPara("Programs");
		Record record = new Record();
		record.set("GUID", GUID).set("Programs", Programs).set("Delete", 0).set("Freezed", 0);
		List<Record> records = dot.isExistDot(GUID);
		if (records.size() > 0) {
			records.get(0).set("Programs", Programs);
			b = dot.updateDot(records.get(0));
		} else {
			b = dot.insertDot(record);
		}

		if (null != callback)
			renderJavascript(callback + "(" + JsonKit.toJson("{\"success\":" + b + "}") + ")");
		else
			renderJson("{\"success\":" + b + "}");
	}

	/**
	 * 保存拆条数据 2016-12-12
	 */
	public void getDot() {
		String callback = getPara("UAMS_Callback");
		String GUID = getPara("GUID");
		List<Record> records = dot.isExistDot(GUID);

		if (null != callback)
			renderJavascript(callback + "(" + JsonKit.toJson(records) + ")");
		else
			renderJson(records);
	}

	public String getMacAddress() {
		try {
			Enumeration<NetworkInterface> allNetInterfaces = NetworkInterface.getNetworkInterfaces();
			byte[] mac = null;
			while (allNetInterfaces.hasMoreElements()) {
				NetworkInterface netInterface = (NetworkInterface) allNetInterfaces.nextElement();
				if (netInterface.isLoopback() || netInterface.isVirtual() || !netInterface.isUp()) {
					continue;
				} else {
					mac = netInterface.getHardwareAddress();
					if (mac != null) {
						StringBuilder sb = new StringBuilder();
						for (int i = 0; i < mac.length; i++) {
							sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" : ""));
						}
						if (sb.length() > 0) {
							return sb.toString();
						}
					}
				}
			}
		} catch (Exception e) {
		}
		return "";
	}

	/*
	 * public static void main(String[] args) { // Ssh2Util ssh = new
	 * Ssh2Util("10.135.249.20", "root", "123456"); //
	 * System.out.println(ssh.logIn()); // ssh.logOut(); try {
	 * Enumeration<NetworkInterface> allNetInterfaces =
	 * NetworkInterface.getNetworkInterfaces(); byte[] mac = null; while
	 * (allNetInterfaces.hasMoreElements()) { NetworkInterface netInterface =
	 * (NetworkInterface) allNetInterfaces.nextElement(); if
	 * (netInterface.isLoopback() || netInterface.isVirtual() ||
	 * !netInterface.isUp()) { continue; } else { mac =
	 * netInterface.getHardwareAddress(); if (mac != null) { StringBuilder sb =
	 * new StringBuilder(); for (int i = 0; i < mac.length; i++) {
	 * sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" :
	 * "")); } if (sb.length() > 0) { System.out.println(sb.toString()); } } } }
	 * } catch (Exception e) { }
	 * 
	 * try { Enumeration<NetworkInterface> allNetInterfaces =
	 * NetworkInterface.getNetworkInterfaces(); InetAddress ip = null; while
	 * (allNetInterfaces.hasMoreElements()) { NetworkInterface netInterface =
	 * (NetworkInterface) allNetInterfaces.nextElement(); if
	 * (netInterface.isLoopback() || netInterface.isVirtual() ||
	 * !netInterface.isUp()) { continue; } else { Enumeration<InetAddress>
	 * addresses = netInterface.getInetAddresses(); while
	 * (addresses.hasMoreElements()) { ip = addresses.nextElement(); if (ip !=
	 * null) { System.out.println(ip.getHostAddress()); } } } } } catch
	 * (Exception e) { } }
	 */
	public static void main(String[] args) {
		String id = "12,23";
		String ids = "";
		if (id.equals("")) {
			ids = id;
		} else {
			if (id.indexOf(",") == -1) {
				ids = "'" + id + "'";
			} else {
				ids = "'" + id.replace(",", "','") + "'";
			}
		}
		System.out.println(ids);
	}
}
