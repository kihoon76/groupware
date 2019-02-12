<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<content tag="script">
<script src="/resources/lib/jquery.min.js"></script>
<script src="/resources/os/SVG/svg.min.js"></script>
<script src="/resources/os/SVG/svg.select.min.js"></script>
<script src="/resources/os/SVG/svg.resize.min.js"></script>
<script src="/resources/js/icommon.js"></script>
<!-- <script src="/resources/js/sockjs.min.js"></script> -->
<!-- <script src="/resources/js/stomp.min.js"></script> -->
<script src="/resources/js/floormap.js"></script>
</content>
<head>
<!-- 	<link rel="stylesheet" href="/resources/os/jquery-svg-1.5.0/jquery.svg.css" /> -->
	<style>
	.col {margin-right: 10px; float: left;}
	</style>
</head>
<body>
	<div id="drawing"></div>
	<input type="hidden" id="_csrfToken" value="${_csrfToken}" />
	<input type="hidden" value='${list}' id="list"/>
	<input type="hidden" value='${vacation}' id="vacation"/>
	<input type="hidden" value='${plan}' id="plan"/>
	<input type="hidden" value="${cr_count}" id="crCount" />
	<input type="hidden" value="${mySeatNum}" id="mySeatNum" />
</body>