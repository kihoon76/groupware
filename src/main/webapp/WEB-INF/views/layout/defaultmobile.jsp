<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url" value="${req.requestURL}" />
<c:set var="uri" value="${req.requestURI}" />
<!DOCTYPE html>
<!--[if IE 8]><html class="ie8" lang="ko"><![endif]-->
<!--[if IE 9]><html class="ie9" lang="ko"><![endif]-->
<!--[if gt IE 9]><!--><html lang="ko"><!--<![endif]-->
<head>
	<title>Home</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimun-scale=1.0, user-scalable=0" />
	<!-- 안드로이드 홈화면추가시 상단 주소창 제거 -->
	<meta name="mobile-web-app-capable" content="yes">
	<!-- ios홈화면추가시 상단 주소창 제거 -->
	<meta name="apple-mobile-web-app-capable" content="yes">

	
	<link rel="stylesheet" href="/resources/lib/jqmobile/jquery.mobile-1.4.5.min.css" />
	<link rel="stylesheet" href="/resources/css/mobile/default.css" />
	
	<script type="text/javascript" src="/resources/lib/jqmobile/jquery-1.11.1.min.js"></script>
	<script type="text/javascript" src="/resources/lib/jqmobile/jquery.mobile-1.4.5.min.js"></script>
	
	<script type="text/javascript" src="/resources/lib/jqmobile/fastclick.js"></script>
	<script type="text/javascript" src="/resources/js/mobile/main.js"></script>
</head>
<body onload="initFastButtons();">
<div data-role="page" id="pg1" data-dom-cache="false">
    <div data-role="header" data-position="fixed"  data-tap-toggle="false" data-theme="a">
    	<h1></h1>
    	<a href="#leftpanel1" data-icon="bars" data-iconpos="notext" data-shadow="false" data-iconshadow="false">메뉴</a>
    </div>
    <div id="dvMain" role="main" class="ui-content" data-theme="a">
        <sitemesh:write property="page.main" />
    </div>
    <!-- footer  -->
    <span id="fastclick"><!-- start fastclick -->
    <div data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="b">
         <div data-role="navbar">
         	<ul>
         		<li><a id="footerHome" href="#" data-icon="home" data-ajax="false" <c:if test="${'home' eq footbar}">class="ui-btn-active"</c:if>>홈</a></li>
         		<li><a href="/info" data-icon="info" <c:if test="${'info' eq footbar}">class="ui-btn-active"</c:if>>사용안내</a></li>
         		<c:choose>
         		<c:when test="${'event' eq footbar}">
         		<li><a id="btnRegEvent" href="#" data-icon="action" data-ajax="false">이벤트등록</a></li>
         		</c:when>
         		<c:when test="${'Y' eq back}">
         		<li><a id="footerPrevious" href="#" data-icon="back" data-ajax="false">이전</a></li>
         		</c:when>
         		<c:when test="${'reservation' eq footbar}">
         		<li><a id="footerReservation" href="#" data-rel="popup" data-icon="star" data-ajax="false">예약하기</a></li>
         		</c:when>
         		</c:choose>
         		<li><a id="footerLogout" href="#" data-icon="user" data-ajax="false">로그아웃</a></li>
         	</ul>
         </div>
    </div>
    </span> <!-- end fastclick -->
    
    <!-- leftpanel3  -->
	<div data-role="panel" id="leftpanel1" data-position="left" data-display="reveal" data-theme="c">
		<ul data-role="listview" data-theme="d">
        	<li data-icon="delete"><a href="#" data-rel="close">&nbsp;</a></li>
        	<li data-role="list-divider">Menu</li>
        	<li><a href="/book/rental_history">대여현황</a></li>
        	<li><a href="/book/statistics/read">도서통계</a></li>
        	<li><a href="/book/rental_manage">대여관리</a></li>
        </ul>
	</div><!-- /leftpanel3 -->
	
	
</div>
<!-- </span> end fastclick -->
<!-- $(":mobile-pagecontainer").pagecontainer("change", "#page", { options }); -->
</body>
</html>
