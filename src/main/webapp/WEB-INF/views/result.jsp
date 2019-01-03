<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="kr.co.drpnd.domain.AjaxVO" %>
<%@ page import="java.io.PrintWriter" %>
<%
	if("XMLHttpRequest".equals(request.getHeader("X-Requested-With"))) {
		AjaxVO vo = new AjaxVO();
		String errCode = (String) request.getAttribute("errCode");
		
		if("".equals(errCode)) {
			vo.setSuccess(true);
		}
		else {
			vo.setSuccess(false);
			vo.setErrCode(errCode);
		}
		
		//vo.setErrCode("500");
		
		response.setContentType("application/json;charset=UTF-8");
		
		PrintWriter o = response.getWriter();
		o.print(new Gson().toJson(vo));
		o.flush();
		o.close();
	}
	else {
		//response.sendRedirect("/signin");
%>
<script>
	alert('중복로그인 되었습니다.');
	window.location.href = '/siginin';
</script>
<%
	}

%>
