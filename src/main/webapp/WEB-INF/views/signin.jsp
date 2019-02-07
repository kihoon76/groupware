<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<head>
	<title>동림피엔디</title>
	<link rel="icon" href="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}${req.contextPath}/resources/images/favicon.png" type="image/png" />
	<link rel="stylesheet" href="/resources/core/ver/4.1.1-rc2/css/ext-all-gray.css"/>
	<link rel="stylesheet" href="/resources/css/icon.css"/>
	<style>
	.customLoadMask {
		filter: alpha(opacity=70);
        opacity: .7;
        background: black !important;
	}
	</style>
</head>
<body data-url="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}${req.contextPath}">
	<script src="/resources/core/ver/4.1.1-rc2/js/ext-all.js"></script>
	
	<!-- locale -->
	<script src="/resources/core/locale/ext-lang-ko.js"></script>
	<script src="/resources/js/signin.js"></script>
</body>