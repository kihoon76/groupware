<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<div style="padding:10px;">
<table class="responstable">
	<tr>
    	<th colspan="2" style="text-align:right;">
    		<button style="width:100px;height:32px;" class="BTN-ACC" data-sangsin-num="">결재</button>
    		<button style="width:100px;height:32px;" class="BTN-RJT" data-sangsin-num="">반려</button>
    	</th>
  	</tr>
  	<tr>
    	<td>기안<br/>제목</td>
    	<td>기안제목</td>
  	</tr>
  	<tr>
    	<td>기안자</td>
    	<td>Steffie</td>
  	</tr>
	<tr>
    	<td>내용</td>
    	<td>Stan</td>
  	</tr>
  	<tr>
    	<td>첨부<br/>파일</td>
    	<td>Stella</td>
  	</tr>
</table>
</div>