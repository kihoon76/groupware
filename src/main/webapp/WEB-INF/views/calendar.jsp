<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<content tag="script">
<script src="/resources/lib/jquery.min.js"></script>
<script src="/resources/lib/jquery-ui.min.js"></script>
<script src="/resources/lib/moment.min.js"></script>
<script src="/resources/os/fullcalendar-3.9.0/fullcalendar.min.js"></script>
<script src="/resources/os/fullcalendar-3.9.0/locale/ko.js"></script>
<script src="/resources/js/icommon.js"></script>
<script src="/resources/js/calendar.js"></script>
</content>
<head>
	<link rel="stylesheet" href="/resources/css/jquery-ui.css" />
	<link rel="stylesheet" href="/resources/css/calendar.css" />
	<link rel="stylesheet" href="/resources/os/fullcalendar-3.9.0/fullcalendar.min.css" />
	<style>
	.fc-bgevent{opacity:.7;}
	.holiday{color:#FFE641;font-size:.8em;font-style:italic;}
	</style>
</head>
<body>
	<div class="calendar-sel">
		<c:set var="dftCate" value="${defaultCate}" />
		<select id="selCate" data-cate='${categoryStr}' style="display:none;">
			<c:forEach var="cate" items="${category}">
			<option value="${cate.code}" <c:if test="${cate.code eq dftCate}">selected</c:if>>${cate.name}</option>
			</c:forEach>
		</select> <b>(★ 반드시 저장을 하셔야 등록됩니다 - 단, 근태현황 제외임)</b>
	</div>
<%-- 	<sec:authorize access="hasRole('ROLE_DESIGN_ADMIN')"> --%>
<!-- 	<div class="calendar-sel"> -->
<!-- 		<select id="selDesign" style="display:none;"> -->
<%-- 			<c:forEach items="${sawonList}" var="sawon"> --%>
<%-- 			<option value="<c:out value='${sawon.sawonCode}' />"><c:out value="${sawon.sawonName}" /></option> --%>
<%-- 			</c:forEach> --%>
<!-- 		</select> -->
<!-- 	</div> -->
<%-- 	</sec:authorize> --%>
	<div id="calendar"></div>
	<input type="hidden" id="mineBgColor" value="<c:out value='${mineBgColor}'/>" />
	<input type="hidden" id="mineTxtColor" value="<c:out value='${mineTxtColor}'/>" />
	<input type="hidden" id="prefix" value="<c:out value='${prefix}'/>" />
	<input type="hidden" id="_csrfToken" value="${_csrfToken}" />
	<input type="hidden" id="isDesignAdmin" value="${isDesignAdmin}" />
	<input type="hidden" id="sawonList" value='${sawonList}' />
</body>