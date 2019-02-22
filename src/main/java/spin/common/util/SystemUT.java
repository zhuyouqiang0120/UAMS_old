package spin.common.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;

import javax.servlet.http.HttpServletRequest;

/**
 * 系统数据获取工具
 * 
 * @author huyi@zensvision.com
 * @date 2016年5月5日
 */
public class SystemUT {

	/**
	 * 获取访问ip
	 * 
	 * @param request
	 * @return
	 */
	public static String getRemoteIP(HttpServletRequest request) {
		String ip = request.getHeader("x-forwarded-for");
		if (!checkIP(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (!checkIP(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (!checkIP(ip)) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}

	private static boolean checkIP(String ip) {
		if (ip == null || ip.length() == 0 || "unkown".equalsIgnoreCase(ip) || ip.split(".").length != 4) {
			return false;
		}
		return true;
	}

	// 删除文件
	public void delete(String src) {
		try {
			String commands = "sudo rm -rf " + src;

			System.out.println("##################shell:" + commands);
			Process process = Runtime.getRuntime().exec(commands);

			InputStreamReader ir = new InputStreamReader(process.getInputStream());

			BufferedReader input = new BufferedReader(ir);
			String line;

			while ((line = input.readLine()) != null) {
				// System.out.println("line&&&&&:"+line);
				line.equals(line);
			}

			ir.close();
			input.close();
			process.destroy();
		} catch (java.io.IOException e) {

			System.err.println("IOException " + e.getMessage());

		}
	}
	
	public boolean deleteFile(String sPath) {  
		System.out.println("删除文件路径："+sPath);
		 boolean flag = false;  
		    File file = new File(sPath);  
	    // 路径为文件且不为空则进行删除  
	    if (file.isFile() && file.exists()) {  
	        file.delete();  
	        flag = true;  
	    }  
	    return flag;  
	}  
	
	public static void main(String[] args) {
		String url = "/uams/video/BesTV/电影/华丽上班族.mp4";
		String name = url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("."));
		System.out.println(name);
	}
}
