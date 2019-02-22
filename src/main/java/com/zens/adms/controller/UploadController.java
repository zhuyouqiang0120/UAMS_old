package com.zens.adms.controller;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import com.chasonx.directory.FileUtil;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;
import com.zens.adms.config.CacheConfig;

import spin.common.model.Entity;
import spin.common.service.CacheFactory;
import spin.common.util.GUIDCreateUT;
import spin.common.util.TimeUT;

/**
 * 上传海报接口
 * 
 * @author huyi@zensvision.com
 */
public class UploadController extends Controller {

	/**
	 * 上传图片
	 */
	public void uploadFile() {
		Entity poster = CacheFactory.getCacheEntityByRoute("poster");
		Record imageCache = CacheConfig.IMAGE_CACHE;
		String imgPath = imageCache.getStr("Real");
		String authCode = getPara("authCode");
		
		Record image = new Record();
		File uploadFile = getFile().getFile();
		
		File newFile = new File(imgPath + TimeUT.getRenameTime() + uploadFile.getName().substring(uploadFile.getName().indexOf(".")));
		System.out.println(imgPath + TimeUT.getRenameTime() + uploadFile.getName().substring(uploadFile.getName().indexOf(".")));
		FileUtil.moveFile(uploadFile, newFile);
		FileUtil.delfile(uploadFile.getPath());
		//uploadFile.renameTo(newFile); // 重命名

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

		image.set("GID", 0).set("GUID", GUIDCreateUT.guid()).set("Title", getPara("Summary")).set("Size", getPara("Size")).set("Hash", hash)
				.set("Height", height).set("Width", width).set("Deleted", 0).set("FileName", newFile.getName())
				.set("Format", newFile.getName().substring(newFile.getName().indexOf(".") + 1))
				.set("Url", imageCache.get("Virtual") + newFile.getName()).set("Path", imgPath).set("AuthCode", authCode);

		renderJson("{\"success\" : " + poster.insert(image) + ", \"path\":\"" + imgPath + "\"}");
	}

	public void uploadCTFile() {
		Entity ctFile = CacheFactory.getCacheEntityByRoute("ctfile");
		Record ctCache = CacheConfig.CONTRACT_FILE_CACHE;
		
		String ctPath = ctCache.getStr("Real");

		Record ctfile = new Record();
		File uploadFile = getFile().getFile();
		String title = uploadFile.getName();
		File newFile = new File(
				ctPath + TimeUT.getRenameTime() + uploadFile.getName().substring(uploadFile.getName().indexOf(".")));
		uploadFile.renameTo(newFile); // 重命名

		ctfile.set("GID", 0).set("Title", title).set("Size", getPara("Size"))
				.set("Hash", newFile.hashCode()).set("Deleted", 0).set("FileName", newFile.getName())
				.set("Format", newFile.getName().substring(newFile.getName().indexOf(".") + 1))
				.set("Url", ctCache.get("Virtual") + newFile.getName()).set("Path", ctPath);

		renderJson("{\"success\" : " + ctFile.insert(ctfile) + ", \"path\":\"" + ctPath + "\"}");
	}
}
