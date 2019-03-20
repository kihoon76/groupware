<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<content tag="main">
<div id="dvGeuntae">
	<div style="width:100%; height:30px;">
		 <span class="ui-icon-user ui-btn-icon-notext inlineIcon"></span>
		 <span>${sawonName}</span>
		 <span id="spTime" style="color:#0000ff;">${currentTime10}</span>
	</div>
	<div>
		<c:choose>
		<c:when test="${isGotoworkChecked == true}">
		<a href="#" class="ui-btn ui-icon-gotowork ui-btn-icon-bottom ui-disabled" id="btnGotowork" data-ajax="false">출근처리</a>
		</c:when>
		<c:otherwise>
		<a href="#" class="ui-btn ui-icon-gotowork ui-btn-icon-bottom" id="btnGotowork" data-ajax="false">출근처리</a>
		</c:otherwise>
		</c:choose>
		
		<c:choose>
		<c:when test="${isOffworkChecked == true}">
		<a href="#" class="ui-btn ui-icon-offwork ui-btn-icon-bottom ui-disabled" id="btnOffwork" >퇴근처리</a>
		</c:when>
		<c:otherwise>
		<a href="#" class="ui-btn ui-icon-offwork ui-btn-icon-bottom" id="btnOffwork">퇴근처리</a>
		</c:otherwise>
		</c:choose>
		
		<c:if test="${me.isGotowork eq 'Y' and me.isOffwork eq 'N'}">
			<c:choose>
			<c:when test="${me.isOutwork eq 'Y'}">
				<a href="#" class="ui-btn ui-icon-inwork ui-btn-icon-bottom" id="btnChangeInOut" data-out="Y" data-geuntae="${me.todayGeuntaeCode}" data-seat-num="${me.seatNum }">내근전환</a>
			</c:when>
			<c:otherwise>
				<a href="#" class="ui-btn ui-icon-outwork ui-btn-icon-bottom" id="btnChangeInOut" data-out="N" data-geuntae="${me.todayGeuntaeCode}" data-seat-num="${me.seatNum }">외근전환</a>
			</c:otherwise>
			</c:choose>
		</c:if>

	</div>
	<input id="baseUrl" type="hidden" value="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}${req.contextPath}" />
	<input id="overworkTypes" type="hidden" value="${overworkTypes}" />
</div>
</content>