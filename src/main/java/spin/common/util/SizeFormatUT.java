package spin.common.util;

import java.text.DecimalFormat;

public class SizeFormatUT {

	public static String parseFileSize(long size) {
		String fileSize = "";
		DecimalFormat format = new DecimalFormat("#.##");
		if (size / (1024 * 1024) > 1000) {
			fileSize = format.format((size / 1024 / 1024)) + "G";
		} else if (size / 1024 > 1000) {
			fileSize = format.format((size / 1024 / 1024)) + "MB";
		} else if (size > 1000) {
			fileSize = format.format(size / 1024) + "KB";
		} else {
			fileSize = size + "B";
		}
		return fileSize;
	}
}
