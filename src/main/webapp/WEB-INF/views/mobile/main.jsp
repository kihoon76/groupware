<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<content tag="main">
<div>
	<div style="width:100%; height:30px;">
		<span>${sawonName}</span>
		<span id="spTime">${currentTime10}</span>
	</div>
	<div>
		<c:choose>
		<c:when test="${isGotoworkChecked == true}">
		<a href="#" class="ui-btn ui-icon-gotowork ui-btn-icon-bottom ui-disabled" id="btnGotowork">출근처리</a>
		</c:when>
		<c:otherwise>
		<a href="#" class="ui-btn ui-icon-gotowork ui-btn-icon-bottom" id="btnGotowork">출근처리</a>
		</c:otherwise>
		</c:choose>
		
		<c:choose>
		<c:when test="${isOffworkChecked == true}">
		<a href="#" class="ui-btn ui-icon-offwork ui-btn-icon-bottom ui-disabled" id="btnOffwork">퇴근처리</a>
		</c:when>
		<c:otherwise>
		<a href="#" class="ui-btn ui-icon-offwork ui-btn-icon-bottom" id="btnOffwork">퇴근처리</a>
		</c:otherwise>
		</c:choose>
	</div>
	<input id="baseUrl" type="hidden" value="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}${req.contextPath}" />
</div>
</content>