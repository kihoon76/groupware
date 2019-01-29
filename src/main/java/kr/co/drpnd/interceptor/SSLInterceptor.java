package kr.co.drpnd.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class SSLInterceptor extends HandlerInterceptorAdapter {
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		
		String url = request.getRequestURL().toString();
		
		if(url.startsWith("http://")) {
			
			String uri = request.getRequestURI();
			String host = url.substring(0, url.indexOf(uri)); //result
			String s = host.replace("http://", "");
			int portIdx = s.indexOf(":");
			if(portIdx > -1) {
				s = s.substring(0, portIdx);
			}
			response.sendRedirect("https://" + s + ":58443");
			return false;
		}
		

		return true;
	}
}
