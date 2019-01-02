package kr.co.drpnd.util;

import javax.servlet.http.HttpServletRequest;

public class RequestUtil {

	public static String getBaseUrl(HttpServletRequest request) {
	    String scheme = request.getScheme() + "://";
	    String serverName = request.getServerName();
	    String serverPort = (request.getServerPort() == 80) ? "" : ":" + request.getServerPort();
	    String contextPath = request.getContextPath();
	    return scheme + serverName + serverPort + contextPath;
	}
	
	public static boolean  isMobile(HttpServletRequest request) {
		return "Y".equals(request.getAttribute("isMobile"));
	}
	
}
