package spin.common.util;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * GUID生成
 * 
 * @author huyi@zensvision.com
 * @date 2016年4月26日
 */
public class GUIDCreateUT {

	public static String guid() {
		StringBuffer buf = new StringBuffer();
		String hexDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		for (int i = 0; i < 12; i++) {
			buf.append(hexDigits.charAt((int) Math.floor(Math.random() * 0x10)));
		}
		buf.replace(2, 3, "4");
		buf.replace(6, 7, String.valueOf(hexDigits.charAt((buf.charAt(6) & 0x3) | 0x8))); // bits
																							// 6-7
																							// of
																							// the
																							// clock_seq_hi_and_reserved
																							// to
																							// 01
		SimpleDateFormat dateformat = new SimpleDateFormat("yymmdd");
		String time = dateformat.format(new Date());
		String uuid = "U_" + time + "_" + buf.toString();
		return uuid;
	}
}
