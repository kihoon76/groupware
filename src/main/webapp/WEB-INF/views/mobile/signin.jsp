<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="kr.co.drpnd.domain.AjaxVO" %>
<%@ page import="java.io.PrintWriter" %>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%
	if("Y".equals(request.getHeader("CUSTOM"))) {
		AjaxVO vo = new AjaxVO();
		String errCode = (String) request.getAttribute("errCode");
		
		vo.setSuccess(false);
		vo.setErrCode("100");
		
		
		//vo.setErrCode("500");
		
		response.setContentType("application/json;charset=UTF-8");
		
		PrintWriter o = response.getWriter();
		o.print(new Gson().toJson(vo));
		o.flush();
		o.close();
	}
	else {
%>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<!DOCTYPE html>
<!--[if IE 8]><html class="ie8" lang="ko"><![endif]-->
<!--[if IE 9]><html class="ie9" lang="ko"><![endif]-->
<!--[if gt IE 9]><!--><html lang="ko"><!--<![endif]-->
<head>
	<title>동림피엔디</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<!-- 안드로이드 홈화면추가시 상단 주소창 제거 -->
	<meta name="mobile-web-app-capable" content="yes">
	<!-- ios홈화면추가시 상단 주소창 제거 -->
	<meta name="apple-mobile-web-app-capable" content="yes">
	<link rel="stylesheet" href="/resources/lib/jqmobile/jquery.mobile-1.4.5.min.css" />
	<link rel="stylesheet" href="/resources/css/mobile/msignin.css" />
	
	<script type="text/javascript" src="/resources/lib/jqmobile/jquery-1.11.1.min.js"></script>
	<script type="text/javascript" src="/resources/lib/jqmobile/jquery.mobile-1.4.5.min.js"></script>
	<script type="text/javascript" src="/resources/js/mobile/signin.js"></script>
</head>
<body>
<div data-role="page" id="pg1" data-dom-cache="false" data-theme="a">
    <div data-role="content">
    	<div class="form">
  			<div class="thumbnail"><img  src="/resources/images/dongrim.png"/></div>
  			<form class="login-form" id="loginFm">
    			<input type="text" placeholder="아이디" id="id" name="id" autocapitalize="off"/>
    			<input type="password" placeholder="비밀번호" id="pw" name="pw"/>
    			<button id="btnLogin" type="button">로그인</button>
  			</form>
		</div>
    </div>
</div>

<div data-role="dialog" id="dialog">
	<div data-role="header">
    	<h1>로그인 실패</h1>
  	</div>
  	<div data-role="content">
    	<p>아이디/비번이 잘못되었습니다.</p>
  	</div>
</div>

<!-- $(":mobile-pagecontainer").pagecontainer("change", "#page", { options }); -->

</body>
</html>
<% } %>