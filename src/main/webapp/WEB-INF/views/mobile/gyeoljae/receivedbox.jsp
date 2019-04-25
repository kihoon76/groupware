<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<content tag="main">
<div id="dvGyeoljaeReceivedBox">
	<div style="width:100%; height:30px; margin-bottom:20px;">
		 <span class="ui-icon-user ui-btn-icon-notext inlineIcon"></span>
		 <span>${sawonName}님의 결재목록</span>
	</div>
	
	
	<c:choose>
	<c:when test="${not empty err}">
	<div>
		<c:out value="${err}"/>
	</div>
	</c:when>
	<c:otherwise>
		<c:choose>
		<c:when test="${not empty list}">
	<div>
			<ul id="myGyeoljaeList" data-role="listview">
				<c:forEach var="map" items="${list}">
				<li>
					<a href="#" class="GYEOLJAE" data-sangsin-num="${map.sangsinNum}">${map. title}-(${map.gianja})</a>
					<div></div>
				</li>
				</c:forEach> 
			</ul>
	</div>
		</c:when>
		<c:otherwise>
	<div style="height:230px; width:100%;white-space:nowrap;text-align:center;margin:2em 0;">
<!-- 		내가 결재할 문서가 없습니다. -->
		<span style="display:inline-block;height:100%;vertical-align:middle;"></span><img src="/resources/images/mobile/no-image-icon.png" style="width:200px;height:200px;">
		
	</div>
	<div style="text-align:center;color:#00f;">내가 결재할 문서가 없습니다.</div>
		</c:otherwise>
		</c:choose>
	</c:otherwise>
	</c:choose>
<!-- 	<div> -->
<!-- 		<ul id="myGyeoljaeList" data-role="listview"> -->
<%-- 		<c:forEach begin="1" end="30" step="1"> --%>
<!-- 			<li> -->
<!-- 				<a href="#" class="GYEOLJAE" data-sangsin-num="83">test</a> -->
<!-- 				<div></div> -->
<!-- 			</li> -->
<%-- 		</c:forEach>  --%>
<!-- 		</ul> -->
<!-- 	</div> -->
	
</div>
</content>