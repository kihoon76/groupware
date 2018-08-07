package kr.co.drpnd.security;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

import kr.co.drpnd.domain.AjaxVO;

@Component
public class SigninSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler{

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws ServletException, IOException {
		
		if(true) {
			response.setContentType("application/json");
			response.setContentType("utf-8");
		
			AjaxVO data = new AjaxVO();
			data.setSuccess(true);
			PrintWriter out = response.getWriter();
			out.print(new Gson().toJson(data));
			out.flush();
			out.close();
		}

	}
}
