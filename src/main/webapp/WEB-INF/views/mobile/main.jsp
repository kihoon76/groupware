<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
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
		<a href="#" class="ui-btn ui-icon-offwork ui-btn-icon-bottom">퇴근처리</a>
	</div>
</div>
</content>