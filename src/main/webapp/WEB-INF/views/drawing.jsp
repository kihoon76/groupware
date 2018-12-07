<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<content tag="script">
<script src="/resources/lib/jquery.min.js"></script>
<script src="/resources/os/SVG/svg.min.js"></script>
<script src="/resources/js/icommon.js"></script>
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

</body>