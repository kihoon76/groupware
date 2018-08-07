package kr.co.drpnd.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class DateUtil {

	public static String getCurrentDateString(String format) {
		DateFormat dateFormat = new SimpleDateFormat(format);
		Calendar cal = Calendar.getInstance();
		
		return dateFormat.format(cal.getTime());
	}
	
	public static String getCurrentDateString() {
		return getCurrentDateString("yyyy-MM-dd");
	}
}
