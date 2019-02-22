package spin.common.util;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author zhuyq@zensvision.com
 * @date 2017年10月10日
 */
public class FileUtils {
	public static List<File> getFileList(String strPath) {
		List<File> filelist = new ArrayList<>();

		File dir = new File(strPath);
		File[] files = dir.listFiles(); // 该文件目录下文件全部放入数组
		if (files != null) {
			for (int i = 0; i < files.length; i++) {
				String fileName = files[i].getName();
				if (files[i].isDirectory()) { // 判断是文件还是文件夹
					// getFileList(files[i].getAbsolutePath()); // 获取文件绝对路径
					// String strFileName = files[i].getAbsolutePath();
					// System.out.println("---" + fileName);
					filelist.add(files[i]);
				} else {
					continue;
				}
			}

		}
		return filelist;
	}

	public static void moveMeida(String path, String realPath) {
		//path = "/Users/zyq/Downloads/yunnan/100550ylxf100000443";
		//realPath = "/Users/zyq/Downloads/yunnan/";
		File dir = new File(path);
		File[] files = dir.listFiles();
		for (int i = 0; i < files.length; i++) {
			files[i].renameTo(new File(realPath + files[i].getName()));
		}
		dir.delete();
	}

	public static void main(String[] args) {
		moveMeida("", "");
	}
}
