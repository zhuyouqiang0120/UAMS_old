package spin.common.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 时间工具
 * 
 * @author huyi@zensvision.com
 * @date 2016年4月26日
 */
public class TimeUT {
	/**
	 * 可用作唯一订单号或者序列号 按照时间生产，精确到毫秒数
	 * 
	 * @return
	 */
	public static String getSerialNo() {
		Date date = new Date();
		SimpleDateFormat dateformat = new SimpleDateFormat("yyyyMMddHHmmssSSS"); // 一直到毫秒
		String time = dateformat.format(date);
		return time;
	}

	/**
	 * 获取当前时间
	 * 
	 * @return
	 */
	public static String getCurrTime() {
		Date date = new Date();
		SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time = dateformat.format(date);
		return time;
	}

	/**
	 * 前几天凌晨0点时间
	 * 
	 * @param preIndex
	 *            前几天天数（负数）
	 * @return
	 */
	public static String getPreDay(int preIndex) {
		Date date = new Date();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.DAY_OF_MONTH, preIndex);
		date = calendar.getTime();
		SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time = dateformat.format(date);
		time = time.substring(0, time.indexOf(" ")) + " 00:00:01";
		return time;
	}

	/**
	 * 前几天毫秒时间
	 * 
	 * @param preIndex
	 *            往前天数
	 * @return
	 */
	public static long getLongPreDay(int preIndex) {
		Date date = new Date();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.DAY_OF_MONTH, preIndex);
		date = calendar.getTime();
		return date.getTime();
	}

	public static long getMillsTime(String time) throws ParseException {
		if (time.equals("") || time == null) {
			return 0;
		}
		String timeFormat = "yyyy-MM-dd HH:mm:ss";
		SimpleDateFormat sdf = new SimpleDateFormat(timeFormat);
		return sdf.parse(time).getTime();
	}

	/**
	 * long 转 String
	 * 
	 * @param time
	 * @return
	 */
	public static String getTime(long time) {
		Date date = new Date(time);
		DateFormat dateformat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return dateformat.format(date);
	}

	public static String getRenameTime() {
		Date date = new Date();
		SimpleDateFormat dateformat = new SimpleDateFormat("yyyyMMddHHmmss");
		return dateformat.format(date);
	}

}
