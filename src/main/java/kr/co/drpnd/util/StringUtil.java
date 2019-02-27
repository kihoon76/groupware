package kr.co.drpnd.util;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

public class StringUtil {

	public static String getStringNullValue(Object obj) {
		if(obj == null) return "";
		
		try {
			return String.valueOf(obj);
		}
		catch(Exception e) {
			return "";
		}
	}
	
	public static String escapeMsSql(String str) {
		if(str == null || "".equals(str)) return "";
		
		
		str = str.replaceAll("`",  "")
			  .replaceAll("%", "`%")
			  .replaceAll("\\[", "`\\[")
			  .replaceAll("\\]", "`\\]")
			  .replaceAll("\\?", "`\\?")
			  .replaceAll("\\_", "`\\_");
		
		return "%" + str + "%";
	}
	
	public static Map<String, String> getMonthStartEnd() {
		Map<String, String> result = new HashMap<>();
		
		Calendar calendar = Calendar.getInstance();
		
		int lastDate = calendar.getActualMaximum(Calendar.DATE);
		int year = calendar.get(Calendar.YEAR);
		int month = calendar.get(Calendar.MONTH) + 1;
		
		String yearStr = String.valueOf(year);
		String monthStr = month < 10 ? String.valueOf("0" + month) : String.valueOf(month);
		String lastDateStr = String.valueOf(lastDate);
		
		result.put("start", yearStr + "-" +  monthStr + "-01" );
		result.put("end", yearStr + "-" +  monthStr + "-" + lastDateStr);
		
		return result;
	}
	
	public static boolean isNull(String s) {
		if(s == null || "".equals(s.trim())) return true;
		return false;
	}
}
