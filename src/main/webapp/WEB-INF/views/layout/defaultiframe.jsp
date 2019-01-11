<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<sitemesh:write property="head" />
	<link rel="stylesheet" href="/resources/css/iframe.css" />
	<sitemesh:write property="page.link" />
</head>

<body data-url="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}${req.contextPath}/"
 	  data-date="<c:out value='${currentDate}' />" 
 	  oncontextmenu="return false;">
<sitemesh:write property="body" />
<sitemesh:write property="page.script" />
</body>
</html>