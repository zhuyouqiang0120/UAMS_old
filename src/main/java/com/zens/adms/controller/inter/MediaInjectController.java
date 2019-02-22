package com.zens.adms.controller.inter;

import java.io.File;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;

import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;
import com.zens.adms.config.CacheConfig;
import com.zens.adms.model.Inject;
import com.zens.adms.model.Media;

import net.sf.json.JSONObject;
import spin.common.model.Entity;
import spin.common.service.CacheFactory;
import spin.common.service.SLF4jLoggerFactory;
import spin.common.util.FileUtils;
import spin.common.util.TimeUT;
import spin.common.util.XMLParseUT;

/**
 * 媒资注入接口
 * @author huyi@zensvision.com
 */
public class MediaInjectController extends Controller {
	private static final int INJECT_FAILED = 0;
	private static final int INJECT_SUCCESS = 1;
	private static final Logger logger = SLF4jLoggerFactory.getInjectLogger();

	private Entity task = CacheFactory.getCacheEntityByRoute("inject");
	private Media media = new Media();

	public void upload() {
		Record record = new Record();
		Map<String, String[]> maps = getParaMap();
		for (Map.Entry<String, String[]> entry : maps.entrySet())
			record.set(entry.getKey(), entry.getValue()[0]);

		Inject inject = new Inject("UPLOAD");
		renderText(inject.upload(record) ? "1" : "0");
	}

	public void getEpisode() {
		List<Record> list = media.getEpisodes();
		renderJson(new JSONObject().element("list", list).element("result", list.size()));
	}

	public void syncTask() {
		boolean flag = false;
		StringBuffer buffer = new StringBuffer();
		String xml = getPara("XML"), 
			   assetId = getPara("AssetID"),
					   authCode = getPara("authCode");//UCGS用户id
			   
		Record record = new Record();
		record.set("FileName", xml).set("AssetID", assetId).set("CreateTime",
				TimeUT.getCurrTime());

		try {
			Record videoCache = CacheConfig.Video_CACHE;
			String realPath = videoCache.get("Real"),
					virtualPath = videoCache.getStr("Virtual");
			realPath = !realPath.isEmpty() && realPath.lastIndexOf("/") != realPath.length() - 1 ? realPath + "/" : realPath;
			virtualPath = !virtualPath.isEmpty() && virtualPath.lastIndexOf("/") != virtualPath.length() - 1 ? virtualPath + "/" : virtualPath;
	System.out.println(realPath + "/" + xml);
	System.out.println(virtualPath + "/" + xml);
			File file = new File(realPath + "/" + xml);
//			File file = new File("/Users/huyi/Downloads/1be53b3105d5fe58129e7b389371a4c9.xml");
			if (file.exists()) {
				record.set("XML", file.toString());
				String[] fields = new String[] { "Title", "NameEN", "Tag", "Provider", "Type", "Intro", "Director",
						"Actor", "Region", "Years", "Classification", "PosterPath", "PosterUrl", "PosterSize",
						"PosterHash", "PosterWidth", "PosterHeight", "VideoPath", "VideoUrl", "VideoSize", "VideoHash",
						"VideoWidth", "VideoHeight", "Duration", "BitRate", "CodecVariant", "FPS", "VideoEncode",
						"AudioEncode", "GroupTitle", "GroupIndex" };

				String result = XMLParseUT.getDocument(file).asXML(); // 解析报文
				Record media = new Record();
				Inject inject = new Inject("UPLOAD");
				for (String field : fields) {
					String value = XMLParseUT.getValue(field, result);
					if(field.equals("PosterUrl") && !value.isEmpty()){
						media.set("PosterName", value);
						value = virtualPath + value;
					}
					if(field.equals("VideoUrl") && !value.isEmpty()){
						media.set("VideoName", value);
						value = virtualPath + value;
					}
					buffer.append(field + "@" + value + " | ");
					media.set(field, value);
				}
				//设置海报视频地址
				media.set("PosterPath", realPath + assetId).set("VideoPath", realPath + assetId); 
				//设置影片对于UCGS用户
				media.set("AuthCode", authCode);
				media.set("State", 0);
				
				flag = inject.upload(media); // 注入媒资
				record.set("Result", flag ? "注入成功" : "注入失败").set("State", flag ? INJECT_SUCCESS : INJECT_FAILED);
			} else {
				record.set("Result", "报文不存在").set("State", INJECT_FAILED);
			}
		} catch (Exception e) {
			record.set("Result", e.toString().length() > 255 ? e.toString().substring(0, 255) : "").set("State", 0);
		} finally {
			// 注入日志
			logger.info(TimeUT.getCurrTime() + " : " + buffer.toString() + "result@" + (flag ? INJECT_SUCCESS : INJECT_FAILED));

			record.set("EndTime", TimeUT.getCurrTime()).set("Deleted", 0);
			flag = task.insert(record);

		}
		
		renderText("{\"success\":" + flag + "}");
	}
	
	/**
	 * 扫描ftp文件并注入 20171010 zyq
	 */
	public void scan() {
		boolean flag = false;
		StringBuffer buffer = new StringBuffer();
		String authCode = "ipanel";// UCGS用户id


		Record videoCache = CacheConfig.Video_CACHE;
		String realPath = videoCache.get("Real"), virtualPath = videoCache.getStr("Virtual");

		Record ftpCache = CacheConfig.FTP_FILE_CACHE;
		String ftpRealPath = ftpCache.get("Real");
		List<File> files = FileUtils.getFileList(ftpRealPath);
		for(File _file : files){
			Record record = new Record();
			try {
				String dirName = _file.getName();
				String xmlPath = ftpRealPath + dirName + "/" + dirName + ".xml";
				record.set("FileName", dirName + ".xml").set("AssetID", dirName).set("CreateTime", TimeUT.getCurrTime());

				File file = new File(xmlPath);
				if (file.exists()) {
					record.set("XML", file.toString());
					String[] fields = new String[] { "Title", "NameEN", "Tag", "Provider", "Type", "Intro", "Director",
							"Actor", "Region", "Years", "Classification", "PosterPath", "PosterUrl", "PosterSize",
							"PosterHash", "PosterWidth", "PosterHeight", "VideoPath", "VideoUrl", "VideoSize", "VideoHash",
							"VideoWidth", "VideoHeight", "Duration", "BitRate", "CodecVariant", "FPS", "VideoEncode",
							"AudioEncode", "GroupTitle", "GroupIndex", "Grade" };

					Record media_rec = XMLParseUT.parseIPanelXml(xmlPath);// 解析报文
					Record media = new Record();
					Inject inject = new Inject("UPLOAD");
					for (String field : fields) {
						String value = media_rec.getStr(field);
						if (field.equals("PosterUrl") && !value.isEmpty()) {
							media.set("PosterName", value);
							value = virtualPath + value;
						}
						if (field.equals("VideoUrl") && !value.isEmpty()) {
							media.set("VideoName", value);
							value = virtualPath + value;
						}
						buffer.append(field + "@" + value + " | ");
						media.set(field, value);
					}
					// 设置海报视频地址
					media.set("PosterPath", realPath + dirName).set("VideoPath", realPath + dirName);
					// 设置影片对于UCGS用户
					media.set("AuthCode", authCode);
					media.set("State", 0);

					flag = inject.upload(media); // 注入媒资
					FileUtils.moveMeida(ftpRealPath+dirName, realPath);
					record.set("Result", flag ? "注入成功" : "注入失败").set("State", flag ? INJECT_SUCCESS : INJECT_FAILED);
				} else {
					record.set("Result", "报文不存在").set("State", INJECT_FAILED);
				}
			} catch (Exception e) {
				record.set("Result", e.toString().length() > 255 ? e.toString().substring(0, 255) : "").set("State", 0);
			} finally {
				// 注入日志
				logger.info(TimeUT.getCurrTime() + " : " + buffer.toString() + "result@"
						+ (flag ? INJECT_SUCCESS : INJECT_FAILED));

				record.set("EndTime", TimeUT.getCurrTime()).set("Deleted", 0);
				flag = task.insert(record);
			}
		}
		renderText("{\"success\":" + 0 + "}");
	}
}
