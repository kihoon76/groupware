<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<div style="padding:10px;">
<c:choose>
<c:when test="${empty sangsin}">
<table class="responstable">
  	<tr>
    	<td colspan="2">내 결재 기안이 아닙니다.</td>
  	</tr>
</table>
</c:when>
<c:otherwise>
<table class="responstable">
	<tr>
    	<th colspan="2" style="text-align:right;">
    		<button style="width:100px;height:32px;" class="BTN-ACC" data-sangsin-num="<c:out value='${sangsin.sangsinNum}' />">결재</button>
    		<button style="width:100px;height:32px;" class="BTN-RJT" data-sangsin-num="<c:out value='${sangsin.sangsinNum}' />">반려</button>
    	</th>
  	</tr>
  	<tr>
    	<td>기안<br/>제목</td>
    	<td><c:out value="${sangsin.title}" /></td>
  	</tr>
  	<tr>
    	<td>기안자</td>
    	<td><c:out value="${sangsin.gianja}" /></td>
  	</tr>
  	<tr>
    	<td>기안<br/>일자</td>
    	<td><c:out value="${sangsin.writeDate}" /></td>
  	</tr>
	<tr>
    	<td>내용</td>
    	<td><c:out value="${sangsin.content}" escapeXml="false" /></td>
  	</tr>
  	<tr>
    	<td>첨부<br/>파일</td>
    	<c:choose>
    	<c:when test="${fn:length(sangsin.attachFiles) == 0}">
    	<td>-</td>
    	</c:when>
    	<c:otherwise>
    	<td>
    	<c:forEach var="files" items="${sangsin.attachFiles}" varStatus="status">
            <a href="#" data-code="${files.code}" class="FILES" style="text-decoration:none; font-size:1.3em;">${files.name}</a>
        </c:forEach>
    	</td>
    	</c:otherwise>
    	</c:choose>
    	
  	</tr>
</table>
</c:otherwise>
</c:choose>
</div>