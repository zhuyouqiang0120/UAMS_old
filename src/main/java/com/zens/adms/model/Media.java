package com.zens.adms.model;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.zens.adms.config.CacheConfig;

import spin.common.model.Entity;
import spin.common.service.CacheFactory;
import spin.common.util.GUIDCreateUT;
import spin.common.util.SystemUT;
import spin.common.util.TimeUT;

/**
 * 媒资数据交互
 * @author huyi@zensvision.com
 */
public class Media extends Entity {
	
	public static final String INDEX = "media";
	/**
	 * 媒资类型
	 */
	public static final String SINGLE_MEDIA = "1"; //单片
	public static final String SERIES_PAKAGE_MEDIA = "2"; //剧集虚拟包
	public static final String SERIES_SINGLE_MEDIA = "3"; //剧集单片
	
	/**
	 * 媒资发布状态
	 */
	public static final String INIT_STATUS = "0"; //初始状态，未上架
	public static final String PUBLISH_STATUS = "1"; //已发布，即上架
	public static final String NOT_PUBLISH_STATUS = "2"; //已下架
	
	public Media() {
		super( CacheFactory.getCacheTableByRoute(INDEX));
	}
	
	public boolean isExistVideo(String filename){
		return !filename.isEmpty() && Db.find("select * from " + getTableName() + " where Deleted=0 and VideoUrl like '%" + filename + "%'").size() > 0;
	}
	
	//获取所有剧集
	public List<Record> getEpisodes(){
		List<Record> buffer = new ArrayList<Record>();
		List<Record> lists = Db.find("select * from " + getTableName() + " where Deleted=0 and Type=" + SERIES_PAKAGE_MEDIA);
		if(lists.size() > 0){
			for(Record record : lists)
				buffer.add(new Record().set("GroupIndex", record.get("ID")).set("GroupTitle", record.get("Title")));
		}
		return buffer;
	}
	
	//用于剧集添加
	public boolean insertMedia(Map<String, String[]> map){
		Record record = new Record();
		record.set("GUID", GUIDCreateUT.guid());
		
		String key = null, value = null;
		for (Map.Entry<String, String[]> entry : map.entrySet()) {
			key = entry.getKey();
			value = entry.getValue()[0];
			
			if(key.equals("CreateTime")){
				record.set("CreateTime", TimeUT.getCurrTime());
			}
			if( !key.equals("ID") && !value.isEmpty() ){
				record.set(key, value);
			}
		}
		return Db.save(getTableName(), "ID", record);
	}
	
	public boolean updateMedia(Map<String, String[]> map){
		boolean flag = update(map);
		if( !map.get("Type")[0].equals(SERIES_PAKAGE_MEDIA) ){ //非剧集，非虚拟目录
			flag = CacheFactory.getCacheEntityByRoute("title").updateKeysByForeign(map.get("ID")[0], "string:Name@" + map.get("Title")[0]);
		}
		return flag;
	}
	
	public boolean removeMedia(String ids){
		
		SystemUT systemUT = new SystemUT();
		List<Record> records = Db.find("select * from " + getTableName() + "  where ID in (" + ids + ")"); 
		Record videoCache = CacheConfig.Video_CACHE;
		String realPath = videoCache.get("Real");
		for(Record record : records){
			String VideoUrl = record.get("VideoUrl");
			String PosterUrl = record.get("PosterUrl");
			
			String name = VideoUrl.substring(VideoUrl.lastIndexOf("/")+1, VideoUrl.lastIndexOf("."));
			systemUT.deleteFile(realPath+name+".mp4");
			systemUT.deleteFile(realPath+name+".xml");
			systemUT.deleteFile(realPath+name+".jpg");
			systemUT.deleteFile(realPath+name+".gif");
			systemUT.deleteFile(realPath+name+".png");
			
		}

		/*
		boolean flag = remove(ids);
		
		if( flag && CacheFactory.getCacheEntityByRoute("title").removeByForeign(ids) 
					 && CacheFactory.getCacheEntityByRoute("director").removeByForeign(ids) 
					 && CacheFactory.getCacheEntityByRoute("actor").removeByForeign(ids) 
					 && CacheFactory.getCacheEntityByRoute("desc").removeByForeign(ids) 
					 && CacheFactory.getCacheEntityByRoute("poster").removeByForeign(ids) 
					 && CacheFactory.getCacheEntityByRoute("video").removeByForeign(ids) ) ;
					 */

		boolean flag = delete(ids);
		if( flag && CacheFactory.getCacheEntityByRoute("title").deleteByForeign(ids) 
							 && CacheFactory.getCacheEntityByRoute("director").deleteByForeign(ids) 
							 && CacheFactory.getCacheEntityByRoute("actor").deleteByForeign(ids) 
							 && CacheFactory.getCacheEntityByRoute("desc").deleteByForeign(ids) 
							 && CacheFactory.getCacheEntityByRoute("poster").deleteByForeign(ids) 
							 && CacheFactory.getCacheEntityByRoute("video").deleteByForeign(ids) ) ;
		
		return flag;
	}
	 
	public boolean deleteMedia(String ids){
		boolean flag = delete(ids);
		if( flag && CacheFactory.getCacheEntityByRoute("title").deleteByForeign(ids) 
							 && CacheFactory.getCacheEntityByRoute("director").deleteByForeign(ids) 
							 && CacheFactory.getCacheEntityByRoute("actor").deleteByForeign(ids) 
							 && CacheFactory.getCacheEntityByRoute("desc").deleteByForeign(ids) 
							 && CacheFactory.getCacheEntityByRoute("poster").deleteByForeign(ids) 
							 && CacheFactory.getCacheEntityByRoute("video").deleteByForeign(ids) ) ;
		return flag;
	}
	/**
	 * 根据键值对整理各类型推荐片源
	 * @param key
	 * @param value
	 * @param type
	 * @return
	 */
	private Record referForMedia(String key, String value, String type, String sign){
		List<Record> records = new ArrayList<Record>();
		Record data = new Record();
		
		String[] buffers = value.contains(",") ? value.split(",") : new String[]{value.trim()} ;
		records = referMediaByParam(key, buffers, true, true);
		
		if( records.size() < 8 && buffers.length > 1 ){
			for(int i = 1; i < buffers.length; ++ i){
				buffers[i] = "";
				List<Record> recs = referMediaByParam(key, buffers, true, false);
				for(Record rec : recs){
					if( !records.contains(rec) )
						records.add(rec);
				}
				if( records.size() >= 8 ) break;
			}
		}
		data.set("list", records.size() > 8 ? records.subList(0, 8) : records)
			.set("refer", key).set("type", type).set("keyword", value).set("sign", sign);
		return data;
	}
	
	/**
	 * 根据键值对查询片源
	 * @param key
	 * @param values
	 * @param dim
	 * @param limit
	 * @return
	 */
	private List<Record> referMediaByParam(String key, String[] values, boolean dim, boolean limit){
		if( !key.isEmpty() && values.length > 0 ){
			String str = "";
			for(int i = 0; i < values.length; ++ i){
				str += values[i].trim().isEmpty() ? "" : ( dim ? " and " + key + " like " + "'%" + values[i].trim() + "%'" : " and " + key + " = '" + values[i].trim() +"'");
			}
			return Db.find("select * from " + getTableName() + "  where deleted = 0  " + str + " order by ID desc" + ( limit ? " limit 1,8" : ""));
		}
		return null;
	}
	
	/**
	 * 根据ID和标签判断是否存在某个片子
	 * @param id
	 * @param name
	 * @return
	 */
	public boolean isExist(long id, String name){
		return Db.find("select * from " + getTableName() + " where ID = " + id + " and Tag like '%" + name + "%'").size() > 0;
	}
	
	/**
	 * 通过片源guid获取相关信息
	 * @param guid
	 * @return
	 */
	public Record getMediaByGUID(String guid){
		Record record = Db.findFirst("select * from " + getTableName() + "  where deleted = 0 and GUID = '" + guid + "'"); 
		return record; 
	}
	
	public List<Record> getEpisodesByPID(BigInteger pID){
		List<Record> records = Db.find("select * from " + getTableName() + "  where deleted = 0 and PID = " + pID ); 
		return records; 
	}
	
	public List<Record> getMediaByTag(String type){
		return Db.find("select * from " + getTableName() + "  where deleted = 0  and tag like '%" + type + "%' order by id desc limit 1, 8"); 
	}
	
	public List<Record> getMediaByKey(String key, Integer pageSize, Integer pageNumber){
		List<Record> records = CacheFactory.getCacheEntityByRoute("title").getEntitysByKeyLike("NameEN", key);
		String ids = ""  ;
		if (records.size() != 0) {
			ids = records.get(0).getLong("GID").toString();
			if(records.size() > 1){
				for(int i = 1; i<records.size(); i++){
					ids += ","+records.get(i).getLong("GID").toString();
				}
			}
			
		}else{
			return records;
		}
		if (pageNumber == 0) {
			return Db.find("select * from " + getTableName() + "  where deleted = 0 and ID in (" + ids + ")  order by CreateTime desc"); 
		}else{
			pageNumber = pageNumber - 1;
			return Db.find("select * from " + getTableName() + "  where deleted = 0 and ID in (" + ids + ") order by CreateTime desc limit "+ pageNumber*pageSize + "," + pageSize); 
		}
	}
	
	/**
	 * 添加片源标签
	 * @param id
	 * @param name
	 * @param newName
	 * @return
	 */
	public int addTag(long id, String name, String newName){
		if( isExist( id, name ) ){
			return 0; //已存在
		}else{
			if( Db.update(getTableName(), "ID", new Record().set("ID", id).set("Tag", newName)) ){
				return 1; //成功
			}else{
				return -1; //失败
			}
		}
	}
	/**
	 * 分页获取片源基本信息
	 * @param currPage
	 * @param pageSize
	 * @param orderCase
	 * @param deleted
	 * @param sifter 条件 例如: string:key@value,number:key@!value,......
	 * @return
	 */
	public Page<Record> getMedias(int currPage, int pageSize, String orderCase, int deleted, String sifter){
		if( getTableName().isEmpty() )
			return null; 
		return Db.paginate(currPage, pageSize, "select * ", "from " + getTableName() + " where deleted = ? " + ( sifter.isEmpty() ? "" : " and ")  + parseFieldSql(sifter, "select", true) + (orderCase.equals("") ? "" : (" order by " + orderCase)), deleted);
	}
	
	public List<Record> referMedias(String director, String actor, String tag){
		List<Record> list = new ArrayList<Record>();
		if( !director.isEmpty() )
			list.add(new Record().set("list", referMediaByParam("director", new String[]{director}, false, true))
					.set("refer", "director").set("type", "导演").set("keyword", director).set("sign", "导演相关"));
		if( !actor.isEmpty() )
			list.add(new Record().set("list", referMediaByParam("actor", new String[]{actor}, false, true))
					.set("refer", "actor").set("type", "演员").set("keyword", actor).set("sign", "演员相关"));
		if( !tag.isEmpty() )
			list.add(new Record().set("list", referMediaByParam("tag", new String[]{tag}, false, true))
					.set("refer", "tag").set("type", "标签").set("keyword", tag).set("sign", "猜你喜欢(" + tag + ")"));
		return list;
	}
	
	/**
	 * 根据相关属性提取相关推荐
	 * @param director
	 * @param actor
	 * @param tag
	 * @return
	 */
	public List<Record> referMediasMulit(String director, String actor, String tag){
		List<Record> list = new ArrayList<Record>();
		if( !director.isEmpty() )
			list.add( referForMedia("director", director, "导演", "导演相关") );
		if( !actor.isEmpty() )
			list.add( referForMedia("actor", actor, "演员", "演员相关") );
		if( !tag.isEmpty() )
			list.add( referForMedia("tag", tag, "标签", "猜你喜欢(" + tag + ")") );
		return list;
	}
	
	/**
	 * 解析数据插入数据库相关关联表格中
	 * @param record
	 */
	@Before(Tx.class)
	public boolean uploadMedia(Record record) {
		boolean flag = false; 
		try{
			synchronized (record) {
				long gid = insertPrimary(new Record().set("GUID", record.get("GUID"))
												.set("Title", record.get("Title"))
												.set("Type", record.get("Type"))
												.set("Region", record.get("Region"))
												.set("Years", record.get("Years"))
												.set("Grade", record.get("Grade"))
												.set("Tag", record.get("Tag"))
												.set("Desc", record.get("Desc"))
												.set("Director", record.get("Director"))
												.set("Actor", record.get("Actor"))
												.set("Provider", record.get("Provider"))
												.set("Episode", 1)
												.set("InjectStyle", record.get("InjectStyle"))
												.set("Duration", record.get("Duration"))
												.set("VideoSize", record.get("VideoSize"))
												.set("VideoUrl", record.get("VideoUrl"))
												.set("PosterUrl", record.get("PosterUrl"))
												.set("State", record.get("State"))
												.set("CreateTime", record.get("CreateTime"))
												.set("AuthCode", record.get("AuthCode"))
												.set("Deleted", 0));
				if( gid > 0 )
					flag = CacheFactory.getCacheEntityByRoute("title").insert(new Record().set("GID", gid)
							.set("Name", record.get("Title")).set("NameEN", record.get("NameEN"))
							.set("CreateTime", record.get("CreateTime"))
							.set("Deleted", 0));
				if( flag )
					flag = CacheFactory.getCacheEntityByRoute("desc").insert(new Record().set("GID", gid)
							.set("Desc", record.get("Desc"))
							.set("CreateTime", record.get("CreateTime"))
							.set("Deleted", 0));
	
				String videoName = record.getStr("VideoName");
				if( flag )
					flag = CacheFactory.getCacheEntityByRoute("video").insert(new Record().set("GID", gid)
							.set("Title", record.get("Title"))
							.set("FileName", videoName)
							.set("Format", videoName.contains(".") ? videoName.substring(videoName.indexOf(".") + 1) : "")
							.set("Hash", record.get("VideoHash"))
							.set("Width", record.get("VideoWidth"))
							.set("Height", record.get("VideoHeight"))
							.set("Size", record.get("VideoSize"))
							.set("Path", record.get("VideoPath"))
							.set("Url", record.get("VideoUrl"))
							.set("Duration", record.get("Duration"))
							.set("BitRate", record.get("BitRate")) //码率
							.set("CodecVariant", record.get("CodecVariant")) //码流格式 CBR、VBR
							.set("FPS", record.get("FPS")) //帧率
							.set("VideoEncode", record.get("VideoEncode"))
							.set("AudioEncode", record.get("AudioEncode"))
							.set("CreateTime", record.get("CreateTime"))
							.set("Deleted", 0));
				
				String posterName = record.get("PosterName");
				if( flag )
					CacheFactory.getCacheEntityByRoute("poster").insert(new Record().set("GID", gid)
							.set("GUID", GUIDCreateUT.guid())
							.set("Title", record.get("Title"))
							.set("FileName", posterName)
							.set("Hash", record.get("Hash"))
							.set("Format", posterName.contains(".") ? posterName.substring(posterName.indexOf(".") + 1) : "")
							.set("Width", record.get("PosterWidth"))
							.set("Height", record.get("PosterHeight"))
							.set("Size", record.get("PosterSize"))
							.set("Path", record.get("PosterPath"))
							.set("Url", record.get("PosterUrl"))
							.set("CreateTime", record.get("CreateTime"))
							.set("Deleted", 0));
				
				String dirs = record.getStr("Director"), acts = record.getStr("Actor");
				List<Record> dirRecs = parseField(dirs);
				List<Record> actRecs = parseField(acts);
				if( flag ){
					for(Record dirRec : dirRecs)
						flag = CacheFactory.getCacheEntityByRoute("director").insert(new Record().set("GID", gid).set("CreateTime", record.get("CreateTime"))
								.set("Deleted", record.get("Deleted"))
								.set("Director", dirRec.get("Name")).set("Nation", dirRec.get("Nation"))
								.set("Sex", dirRec.get("Sex")));
					for(Record actRec : actRecs)
						flag = CacheFactory.getCacheEntityByRoute("actor").insert(new Record().set("GID", gid).set("CreateTime", record.get("CreateTime"))
								.set("Deleted", record.get("Deleted"))
								.set("Actor", actRec.get("Name")).set("Nation", actRec.get("Nation"))
								.set("Sex", actRec.get("Sex")));
				}
				return flag;
			}
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}
	
	private List<Record> parseField(String field){
		List<Record> records = new ArrayList<Record>();
		Record record = null;
		
		if (field.contains(",")) {
			String[] dirArray = field.split(",");
			for (String dir : dirArray) {
				record = new Record();
				String name = "", nation = "", sex = "";
				if (dir.contains("/")) {
					String[] params = dir.split("/");
					name = params[0];
					nation = params.length >= 1 ? params[1] : "";
					sex = params.length >= 2 ? params[2] : "";
				} else {
					name = dir;
				}
				record.set("Name", name).set("Nation", nation)
						.set("Sex", sex);
				records.add(record);
			}
		} else {
			String name = "", nation = "", sex = "";
			record = new Record();
			if (field.contains("/")) {
				String[] params = field.split("/");
				name = params[0];
				nation = params.length >= 1 ? params[1] : "";
				sex = params.length >= 2 ? params[2] : "";
			} else {
				name = field;
			}
			record.set("Name", name).set("Nation", nation)
					.set("Sex", sex);
			records.add(record);

		}
		return records;
	}
}
