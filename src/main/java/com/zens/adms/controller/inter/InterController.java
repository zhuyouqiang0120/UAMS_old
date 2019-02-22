package com.zens.adms.controller.inter;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.net.URLDecoder;
import java.util.List;

import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.zens.adms.model.Media;
import com.zens.adms.model.Placeholder;
import com.zens.adms.model.User;

import net.sf.json.JSONObject;

public class InterController extends Controller {

	private Placeholder holder = new Placeholder();
	private Media media = new Media();
	private User user = new User();
	
	public void checkUser(){
		String username = getPara("UserName"),
			   passwd = getPara("Password");
		renderText( user.isExistUser(username, passwd) + "" );
	}
	
	public void checkMedia(){
		renderText( media.isExistVideo(getPara("VideoName")) + "" );
	}
	
	public void getPlaceholder() {
		String tempGUID = getPara("GUID");

		renderJson(new JSONObject()
				.element("version", "1.0.0")
				.element("desc", "占位符广告集")
				.element("medaInfo", new JSONObject().element("type", "template")
													 .element("adaptor", "ZENS-ADMS")
													 .element("guid", tempGUID))
				.element("adc", new JSONObject().element("protocol", "HTTP 1/1")
												.element("items", holder.getPlaceholders(tempGUID))));
	}
	
	public void getMediaByGUID(){
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
	
	public void getMedias(){
		String sifter = getPara("sifter");
		/*
		try {//大理服务器需要进行转码
			byte[] b = sifter.getBytes("iso8859-1");//编码 
		    sifter = new String(b, "UTF-8");//解码:
			System.out.println("sifter: "+sifter);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		*/
		Page<Record> datapage = media.getMedias(getParaToInt("PageNumber"), getParaToInt("PageSize"), " ID desc", 0, sifter.split("@").length == 3 ?sifter.split(",")[0]+","+sifter.split(",")[1]:sifter);

		for(int i=0; i<datapage.getList().size();i++){
			String type = datapage.getList().get(i).getStr("Type");
			if(type.equals("2")){
				BigInteger PID = datapage.getList().get(i).getBigInteger("ID");
				List<Record> records = media.getEpisodesByPID(PID);
				datapage.getList().get(i).set("Episodes", records);
				datapage.getList().get(i).set("indexs", records.size());
			}
		}
		
		
		renderJavascript(getPara("UAMS_Callback") + "(" + JsonKit.toJson(datapage) + ")");
	}
	
	public void referMedias(){
		long start = System.currentTimeMillis();
		renderJavascript(getPara("UAMS_Callback") + "(" + JsonKit.toJson(new Record().set("inter", "referMedias")
																					 .set("version", "UAMS 1.0.0")
																					 .set("data", media.referMediasMulit(getPara("director"), getPara("actor"), getPara("tag")))
																					 .set("time", System.currentTimeMillis() - start)) + ")");
	}
	
	public void referMediaByChannel(){
		String channelID = getPara("ChannelID");
		String type = ( channelID.equals( "1001" ) ? "爱情" : ( channelID.equals( "1002" ) ? "动作" : "剧情" ) );
		
		long start = System.currentTimeMillis();
		renderJavascript( JsonKit.toJson(new Record().set("inter", "referMediaByChannel")
													 .set("version", "UAMS 1.0.0")
													 .set("ChannelID", channelID)
													 .set("refer", type)
													 .set("list", media.getMediaByTag(type))
													 .set("time", System.currentTimeMillis() - start)) );
	}
}
