<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<content tag="script">
<script src="/resources/lib/jquery.min.js"></script>
<script src="/resources/lib/bootstrap.min.js"></script>
<script src="/resources/os/tabulator-4.1/js/tabulator.min.js"></script>
<script src="/resources/js/icommon.js"></script>
<script src="/resources/js/gyeoljae/gyeoljae.js"></script>
<script src="/resources/js/gyeoljae/overview.js"></script>
</content>
<head>
	<link rel="stylesheet" href="/resources/css/bootstrap.min.css" />
	<!-- tabulator -->
    <link rel="stylesheet" href="/resources/os/tabulator-4.1/css/tabulator_simple.min.css" />
    <link rel="stylesheet" href="/resources/css/gyeoljae.css" />
</head>
<body>
	<form>
		<div class="divMT">
  			<span style="font-size:1.5em;"><span class="badge badge-pill badge-info">결재 대기중</span></span>
  			<span style="font-size:1.2em;"><span class="badge badge-pill badge-danger">※최근 5개까지만 보여줍니다.</span></span>
  			<div class="text-right">
  				<button type="button" class="btn btn-secondary btn-sm" id="btnReceived">수신함</button>
  			</div>
  		</div>
		<div class="divMT divMB">
  			<div id="myGyeoljae"></div>
  		</div>
  		
		<div class="divMT">
  			<span style="font-size:1.5em;"><span class="badge badge-pill badge-info">내가 올린 기안</span></span>
  			<span style="font-size:1.2em;"><span class="badge badge-pill badge-danger">※최근 5개까지만 보여줍니다.</span></span>
  			<div class="text-right">
  				<button type="button" class="btn btn-secondary btn-sm" id="btnSansin">상신함</button>
  			</div>
  		</div>
		<div class="divMT divMB">
  			<div id="myGian"></div>
  		</div>
	</form>
</body>