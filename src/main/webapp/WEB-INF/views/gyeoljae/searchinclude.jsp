<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<div class="form-inline divMT">
	<div class="form-group divMR">
 		<select class="form-control form-control-sm" id="selGyeoljaeType">
 			<option value="A"  selected>모두보기</option>
		    <option value="1">일반업무</option>
		    <option value="2">휴가</option>
		</select>		
	</div>
	<div class="form-group divMR">
 		<select class="form-control form-control-sm" id="selSearchTxt">
 			<option value="A">모두보기</option>
		    <option value="T">제목</option>
		    <c:if test="${tab eq 'keepbox'}">
		    <option value="G">작성자</option>
		    </c:if>
		</select>		
	</div>
	<div class="form-group divMR">
		<input type="text" class="form-control  form-control-sm" id="txtSearchContent" disabled>		
	</div>
	<c:if test="${tab ne 'keepbox'}">
	<div class="form-group divMR">
		<c:choose>
		<c:when test="${tab eq 'sangsinbox'}">
		<select class="form-control form-control-sm" id="status">
			<option value="A">모두보기</option>
		   	<option value="D">기안</option>
		   	<option value="S">결재중</option>
		   	<option value="R">반려</option>
		   	<option value="C">결재완료</option>
		</select>	
		</c:when>
		<c:when test="${tab eq 'receivedbox'}">
		<select class="form-control form-control-sm" id="status">
			<option value="A">모두보기</option>
		   	<option value="D">기안</option>
		   	<option value="S">결재중</option>
		</select>	
		</c:when>
		</c:choose>
	</div>
	</c:if>
	<div class="input-daterange form-group divMR" id="datepicker">
		<div class="input-group-prepend">
	  		<input type="text" style="width:120px;" class="form-control" id="txtStartDate" autocomplete="off" readOnly value="<c:out value='${start}' />"/>
	  		<span class="input-group-text"> ~ </span>
	  		<input type="text" style="width:120px;" class="form-control" id="txtEndDate" autocomplete="off" readOnly value="<c:out value='${end}' />"/>
	  	</div>
	</div>
	<div class="form-group divMR">
		<button type="button" class="btn btn-secondary btn-sm" id="btnSearch">
			<i class="fa fa-search"></i>
		</button>
	</div>
</div>