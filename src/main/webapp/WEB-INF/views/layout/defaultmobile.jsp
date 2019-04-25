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
	<title>동림피엔디</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0" />
	<!-- 안드로이드 홈화면추가시 상단 주소창 제거 -->
	<meta name="mobile-web-app-capable" content="yes">
	<!-- ios홈화면추가시 상단 주소창 제거 -->
	<meta name="apple-mobile-web-app-capable" content="yes">

	
	<link rel="stylesheet" href="/resources/lib/jqmobile/jquery.mobile-1.4.5.min.css" />
	<link rel="stylesheet" href="/resources/os/swiper-4.4.1/css/swiper.min.css" />
	<link rel="stylesheet" href="/resources/os/jqm-calendar/jw-jqm-cal.css" />
<!-- 	<link rel="stylesheet" href="/resources/os/jqm-progress-bar/jQMProgressBar.css" /> -->
		
	<link rel="stylesheet" href="/resources/css/mobile/default.css" />
	<link rel="stylesheet" href="/resources/css/mobile/gyeoljae.css" />
	
	<script type="text/javascript" src="/resources/lib/jqmobile/jquery-1.11.1.min.js"></script>
	<script type="text/javascript" src="/resources/lib/jqmobile/jquery.mobile-1.4.5.min.js"></script>
	<script type="text/javascript" src="/resources/os/swiper-4.4.1/js/swiper.min.js"></script>
	<script type="text/javascript" src="/resources/os/jqm-calendar/jw-jqm-cal.js"></script>
<!-- 	<script type="text/javascript" src="/resources/os/jQuery-Download-File/jquery.fileDownload.js"></script> -->
<!-- 	<script type="text/javascript" src="/resources/os/jqm-progress-bar/jQMProgressBar.js"></script> -->
	
	<script type="text/javascript" src="/resources/lib/jqmobile/fastclick.js"></script>
	<script type="text/javascript" src="/resources/lib/jqmobile/jquery.scrollLock.js"></script>
	
	<script type="text/javascript" src="/resources/js/mobile/main.js"></script>
	<script type="text/javascript" src="/resources/js/mobile/calendar/plan.js"></script>
	<script type="text/javascript" src="/resources/js/mobile/gyeoljae/receivedbox.js"></script>
</head>
<body onload="initFastButtons();">
<div data-role="popup" id="popupDialog" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="max-width: 400px;" data-transition="none">
	<div id="popupHeader" data-role="header" data-theme="a"></div>
	<div role="main" class="ui-content">
		<div id="dvPopupContent"></div>
		<a href="#" data-role="button" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" id="btnPopupOk" rel="external">퇴근처리</a>
		<a href="#" data-role="button" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" id="btnPopupEtc" style="display:none;"></a>
		<a href="#" data-rel="button" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" id="btnPopupCancel">닫기</a>
		
	</div>
</div>

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
         		<li><a id="footerInfo" href="#" data-ajax="false" data-icon="info" <c:if test="${'info' eq footbar}">class="ui-btn-active"</c:if>>사용안내</a></li>
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
        	<li>
<%--         		<a id="lnkViewReceivedBox" data-ajax="false">결재(<span style="color:#f00;"><c:out value="${mygyeoljaeCount}" /></span>) </a> --%>
        		<a id="lnkViewReceivedBox" data-ajax="false"><img src="/resources/images/gyeoljae.png" style="width:16px;height:16px;" class="ui-li-icon">결재(<span style="color:#f00;"><c:out value="${mygyeoljaeCount}" /></span>) </a>
        	</li>
<!--         	<li><a href="/book/statistics/read">메뉴2</a></li> -->
<!--         	<li><a href="/book/rental_manage">메뉴3</a></li> -->
        </ul>
        
        <div data-role="collapsible" data-inset="false" data-iconpos="right" data-theme="d" data-content-theme="b">
     		<h3>캘린더</h3>
        	<ul data-role="listview" >
<!--         		<li><a href="/calendar/m/view/plan" class="ui-btn ui-btn-icon-right ui-icon-carat-r">일정관리</a></li> -->
<!-- 				<li><a id="lnkViewPlan" href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r" data-ajax="false">일정관리</a></li> -->
				<li><a id="lnkViewPlan" href="#" data-ajax="false"><img src="/resources/images/calendar.png" style="width:16px;height:16px;" class="ui-li-icon">일정관리</a></li>
        	</ul>
     	</div><!-- /collapsible -->
	</div><!-- /leftpanel3 -->
</div>
<!-- </span> end fastclick -->

<!-- $(":mobile-pagecontainer").pagecontainer("change", "#page", { options }); -->
</body>
</html>
