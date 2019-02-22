package spin.common.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Serializable;

import spin.common.model.Database;

/**
 * 数据库快速备份
 * 
 * @author huyi@zensvision.com
 * @ddate 2016年4月26日
 */
public class MYSQLFactory implements Serializable {

	private static final long serialVersionUID = -6940737202672774676L;

	/**
	 * 备份数据库
	 * 
	 * @param database
	 *            数据库
	 * @param bakName
	 *            备份文件名
	 * @return
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public static boolean backUpTable(Database database, String bakName) throws IOException, InterruptedException {
		boolean res = false;
		Runtime run = Runtime.getRuntime();

		Process process = null;
		BufferedReader reader = null;
		OutputStreamWriter writer = null;
		try {
			String command = database.getPath() + "mysqldump --add-drop-table -u" + database.getUsername() + " -p"
					+ database.getPassword() + " " + database.getName();
			process = run.exec(command);

			reader = new BufferedReader(new InputStreamReader(process.getInputStream(), "utf-8"));
			File newFile = new File(bakName);
			if (!newFile.exists())
				newFile.createNewFile();
			writer = new OutputStreamWriter(new FileOutputStream(newFile), "utf-8");

			StringBuffer sb = new StringBuffer(1000);
			String string = "";

			int i = 0;
			while ((string = reader.readLine()) != null) {
				sb.append(string + "\r\n");
				i++;
				if (i == 100) {
					writer.write(sb.toString());
					writer.flush();
					sb = new StringBuffer();
					i = 0;
				}
			}
			
			writer.write(sb.toString());
			writer.flush();
			
			writer.close();
			reader.close();
			
			process.waitFor();
			process.destroy();
			res = true;
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		} finally {
			if (writer != null)
				writer.close();
			if (reader != null)
				reader.close();
			if (process != null)
				process.destroy();
		}
		return res;
	}

	/**
	 * 还原数据库
	 * 
	 * @param database
	 *            数据库名
	 * @param fileName
	 *            备份的全文件名
	 * @return
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public static boolean restoreTable(Database database, String fileName) throws IOException, InterruptedException {
		boolean res = false;
		Runtime run = Runtime.getRuntime();

		Process process = null;
		BufferedReader reader = null;
		OutputStreamWriter writer = null;
		try {
			process = run.exec(database.getPath() + "mysql -u" + database.getUsername() + " -p" + database.getPassword()
					+ " " + database.getName());
			
			String instr, outstr;
			StringBuffer sb = new StringBuffer();
			reader = new BufferedReader(new InputStreamReader(new FileInputStream(fileName), "utf-8"));
			writer = new OutputStreamWriter(process.getOutputStream(), "utf-8");
			int i = 0;
			while ((instr = reader.readLine()) != null) {
				sb.append(instr + "\r\n");
				i++;
				if (i == 100) {
					writer.write(sb.toString());
					writer.flush();
					sb = new StringBuffer();
					i = 0;
				}
			}
			outstr = sb.toString();

			writer.write(outstr);
			writer.flush();
			reader.close();
			writer.close();
			
			process.waitFor();
			process.destroy();
			res = true;
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		} finally {
			if (writer != null)
				writer.close();
			if (reader != null)
				reader.close();
			if (process != null)
				process.destroy();
		}
		return res;
	}
}
