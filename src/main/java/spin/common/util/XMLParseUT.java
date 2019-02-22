package spin.common.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;

import com.jfinal.plugin.activerecord.Record;

import spin.common.model.Config;
import spin.common.model.Control;
import spin.common.model.Table;

/**
 * xml 解析
 * 
 * @author huyi@zensvision.com
 * @date 2016年4月26日
 */
public class XMLParseUT {

	/**
	 * 局限于无属性节点
	 * 
	 * @param key
	 * @param result
	 * @return
	 */
	public static String getValue(String key, String result) {
		String value = "";
		if (result.contains("<" + key + ">")) {
			value = result.substring(result.indexOf("<" + key + ">") + key.length() + 2,
					result.indexOf("</" + key + ">"));
		}
		return value;
	}

	public static Document getDocument(File file) throws IOException, DocumentException {
		BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"));
		String line = "";
		StringBuffer buffer = new StringBuffer();
		while ((line = in.readLine()) != null) {
			buffer.append(line.trim());
			if (line.trim().endsWith("?>")) {
				buffer.append("\n");
			}
		}
		in.close();

		// 检测xml对象是否正确， 将xml文档转换为Document的对象
		return DocumentHelper.parseText(buffer.toString());
	}

	/**
	 * 解析配置文件jfinal-factory.xml
	 * 
	 * @param file
	 * @return
	 * @throws IOException
	 * @throws DocumentException
	 * @throws ClassNotFoundException
	 */
	public static Config parseConfig(String file) throws IOException, DocumentException, ClassNotFoundException {
		Config config = new Config();
		File configFile = new File(file);
		if (configFile.exists()) {
			SAXReader saxReader = new SAXReader();
			Document document = saxReader.read(new File(file));

			// 获取根元素
			Element root = document.getRootElement();
			List<Control> controls = new ArrayList<Control>();
			List<Table> entitys = new ArrayList<Table>();

			List<Element> elements = root.elements();
			for (Element element : elements) {
				if (element.getName().equals("controller")) {
					Control control = new Control();
					control.setRoute(element.attributeValue("route"));
					control.setMapping(Class.forName(element.attributeValue("class")));
					controls.add(control);
				} else if (element.getName().equals("entity")) {
					Table table = new Table();
					table.setResident(element.attributeValue("resident").equals("true"));
					table.setTableName(element.attributeValue("mapping"));
					table.setPrimaryKey(element.attributeValue("key"));
					table.setForeignKey(element.attributeValue("foreignKey"));
					table.setIntro(element.attributeValue("intro"));
					table.setIndex(element.attributeValue("index"));
					entitys.add(table);
				}
			}
			config.setControls(controls);
			config.setTables(entitys);
		} else {
			throw new RuntimeException("The file of jfinal-factory.xml is not exist...");
		}
		return config;
	}

	public static Record parseIPanelXml(String xmlPath) {// 茁壮媒资自动扫描注入 xml
		Record record = new Record();
		File xmlFile = new File(xmlPath);
		SAXReader reader = new SAXReader();
		Document doc;

		try {
			doc = reader.read(new File(xmlPath));

			List<Node> provider = doc.selectNodes("ADI/Metadata/AMS");// Provider
			String Provider = ((Element) provider.get(0)).attributeValue("Provider_ID");
			record.set("Provider", Provider);
			String Asset_ID = ((Element) provider.get(0)).attributeValue("Asset_ID");
			record.set("PosterHash", Asset_ID);
			record.set("VideoHash", Asset_ID);

			// System.out.println("------------");

			List<Node> titles = doc.selectNodes("ADI/Asset/Metadata/App_Data");// 详情
			Iterator<Node> it_titles = titles.iterator();
			while (it_titles.hasNext()) {
				Element elm = (Element) it_titles.next();
				String key = elm.attributeValue("Name");
				String value = elm.attributeValue("Value");
				// System.out.println(key + " : " + value);
				if ("Title".equals(key)) {
					String title = elm.attributeValue("Value");
					record.set("Title", title);
				}
				if ("SummaryShort".equals(key)) {
					String SummaryShort = elm.attributeValue("Value");
					record.set("Intro", SummaryShort);
				}
				if ("DirectorName".equals(key)) {
					String DirectorName = elm.attributeValue("Value");
					record.set("Director", DirectorName);
				}
				if ("Actors".equals(key)) {
					String Actors = elm.attributeValue("Value");
					record.set("Actor", Actors);
				}
				if ("Genre".equals(key)) {
					String Genre = elm.attributeValue("Value");
					record.set("Region", Genre);
				}
				if ("Year".equals(key)) {
					String Year = elm.attributeValue("Value");
					record.set("Years", Year);
				}
				if ("RunTime".equals(key)) {
					String RunTime = elm.attributeValue("Value");
					record.set("Duration", RunTime);
				}
				if ("Rating".equals(key)) {
					String Rating = elm.attributeValue("Value");
					record.set("Grade", Rating);
				}

				record.set("Type", "1");
				record.set("PosterHash", "1");
			}

			// System.out.println("------------");

			List<Node> movies = doc.selectNodes("ADI/Asset/Asset/Metadata/App_Data");// 视频、海报信息
			Iterator<Node> it_movies = movies.iterator();
			while (it_movies.hasNext()) {
				Element elm = (Element) it_movies.next();
				String key = elm.attributeValue("Name");
				String value = elm.attributeValue("Value");
				// System.out.println(key + " : " + value);
				if ("BitRate".equals(key)) {
					String BitRate = elm.attributeValue("Value");
					record.set("BitRate", BitRate);
				}
				if ("ContentFileSize".equals(key)) {
					String ContentFileSize = elm.attributeValue("Value");
					if (!ContentFileSize.equals("")) {
						record.set("VideoSize", ContentFileSize);
					}
				}
			}

			// System.out.println("------------");

			List<Node> medias = doc.selectNodes("ADI/Asset/Asset/Content");// 视频、海报文件名
			record.set("VideoPath", ((Element) medias.get(0)).attributeValue("Value"));
			record.set("VideoUrl", ((Element) medias.get(0)).attributeValue("Value"));
			record.set("PosterPath", ((Element) medias.get(1)).attributeValue("Value"));
			record.set("PosterUrl", ((Element) medias.get(1)).attributeValue("Value"));
		} catch (DocumentException e) {
		}
		return record;
	}

	public static void main(String[] args) {
		parseIPanelXml("/Users/zyq/Downloads/yunnan/100550ylxf100000444/100550ylxf100000444.xml");
	}
}
