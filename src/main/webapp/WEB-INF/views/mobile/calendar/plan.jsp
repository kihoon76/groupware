<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<content tag="main">
<div id="dvCalendarPlan">
	<div style="width:100%; height:30px; margin-bottom:20px;">
		 <span class="ui-icon-user ui-btn-icon-notext inlineIcon"></span>
		 <span>${sawonName}님의 일정관리</span>
		 <span id="spTime" style="color:#0000ff;">${currentTime10}</span>
	</div>
	<div id="calendarPlan" data-current="${currentDate}"></div>
	<div style="margin:10px;font-size:12px;">
	★ 하루에 일정이 복수개로 등록될 경우 모바일에서는 <br/>삭제/수정 불가합니다(추가 가능)
	</div>
</div>
</content>