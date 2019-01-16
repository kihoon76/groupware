<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<content tag="script">
<script src="/resources/lib/jquery.min.js"></script>
<script src="/resources/os/summernote/popper-1.11.0.min.js"></script>
<script src="/resources/lib/bootstrap.min.js"></script>
<script src="/resources/os/summernote/summernote-bs4.min.js"></script>
<script src="/resources/os/summernote/lang/summernote-ko-KR.min.js"></script>
<script src="/resources/js/gyeoljae/keepbox.js"></script>
</content>
<head>
  	<link rel="stylesheet" href="/resources/css/bootstrap.min.css" />
  	<link rel="stylesheet" href="/resources/os/summernote/summernote-bs4.css" />
</head>
<body>
	<div id="summernote">Hello Summernote</div>
</body>