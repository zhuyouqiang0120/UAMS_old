package com.zens.adms.util;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import com.jfinal.plugin.activerecord.Record;
import com.zens.adms.config.CacheConfig;
import com.zens.adms.model.Media;

import spin.common.util.GUIDCreateUT;
import spin.common.util.TimeUT;

public class ExcelReadUT {

	public static void readExcel(String filename) throws FileNotFoundException, IOException{
		HSSFWorkbook wookbook = new HSSFWorkbook(new FileInputStream(filename));
		HSSFSheet sheet = wookbook.getSheet("Sheet1");
		int rows = sheet.getPhysicalNumberOfRows();
		List<Record> list = new ArrayList<Record>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/M/d"); 
		Media media = new Media();
		
		Record videoCache = CacheConfig.Video_CACHE;
		
		String path = videoCache.getStr("Real") + "BesTV/电影/",
			   httpPath = videoCache.getStr("Virtual") + "BesTV/电影/";
		
		for(int i = 0; i < rows; ++ i){
			HSSFRow row = sheet.getRow(i);
			if (row != null) {
				Record record = new Record();
				String name = row.getCell(0).getStringCellValue().replaceAll(" ", "");
				double duration = row.getCell(6).getNumericCellValue();
				
				record.set("NameEN", "" )
						.set("Title", name )
						.set("Duration", duration )
						.set("Years", sdf.format(HSSFDateUtil.getJavaDate(row.getCell(8).getNumericCellValue())).toString() )
						.set("Region", row.getCell(4).getStringCellValue().replaceAll("/", ",").replaceAll("\\s", "") )
						.set("Tag", row.getCell(7).getStringCellValue().replaceAll("/", ",").replaceAll("\\s", "") )
						.set("Actor", row.getCell(3).getStringCellValue().replaceAll("/", ",").replaceAll("\\s", "") )
						.set("GUID", GUIDCreateUT.guid())
						.set("Type", "电影")
						.set("Director", row.getCell(1).getStringCellValue().replaceAll("/", ",").replaceAll("\\s", "") )
						.set("Desc", row.getCell(2).getStringCellValue().trim())
						.set("InjectStyle", "xls")
						.set("Provider", "百视通")
						.set("Grade", row.getCell(5).getNumericCellValue() + "" )
						.set("State", 0)
						.set("CreateTime", TimeUT.getCurrTime())
						.set("Deleted", 0)
						.set("PosterPath", path)
						.set("VideoPath", path)
						.set("VideoSize", Math.round(16713827.72 * duration) + "")
						.set("PosterFormat", "jpg").set("VideoFormat", "mp4")
						.set("VideoUrl", httpPath + name + ".mp4")
						.set("PosterUrl", httpPath + name + ".jpg");
				
				media.uploadMedia(record);
				list.add(record);
			}
		}
		wookbook.close();
//		System.out.println(JsonKit.toJson(list));
	}

	public static void main(String[] args) {
//		try {
//			readExcel("C:/Users/IceSpin/Desktop/sss/百视通.xls");
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
	}
}
