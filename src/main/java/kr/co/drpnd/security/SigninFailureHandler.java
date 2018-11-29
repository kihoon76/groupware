package kr.co.drpnd.security;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.exception.NotAuthorized;

@Component
public class SigninFailureHandler extends SimpleUrlAuthenticationFailureHandler{

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {
		
		response.setContentType("application/json");
		response.setContentType("utf-8");
		
		AjaxVO<Map> ajax = new AjaxVO<Map>();
		ajax.setSuccess(false);
		
		Map<String, String> data = new HashMap<String, String>();
		//사용자정보 없음
		if(exception.getClass().isAssignableFrom(UsernameNotFoundException.class)) {
			ajax.setErrCode("101");
		}
		else if(exception.getClass().isAssignableFrom(BadCredentialsException.class)) {
			ajax.setErrCode("102");
		}
		else if(exception.getClass().isAssignableFrom(NotAuthorized.class)) {
			ajax.setErrCode("103");
		}
		//중복로그인
		else if(exception.getClass().isAssignableFrom(SessionAuthenticationException.class)) {
			ajax.setErrCode("202");
		}
		else {
			ajax.setErrCode("104");
		}
		
		ajax.addObject(data);
		
		PrintWriter out = response.getWriter();
		out.print(new Gson().toJson(ajax));
		out.flush();
		out.close();
	}
	
	
}
