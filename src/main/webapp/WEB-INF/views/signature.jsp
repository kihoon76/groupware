<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<content tag="link">
<link rel="stylesheet" href="/resources/os/smoothsignature/jquery.signaturepad.css" />
<link rel="stylesheet" href="/resources/os/jQuery-Upload-File/4.0.11/uploadfile.css" />
</content>
<content tag="script">
<script src="/resources/os/smoothsignature/jquery-1.11.3.min.js"></script>
<script src="/resources/os/smoothsignature/numeric-1.2.6.min.js"></script>
<script src="/resources/os/smoothsignature/bezier.js"></script>
<script src="/resources/os/smoothsignature/jquery.signaturepad.min.js"></script>
<script src="/resources/os/smoothsignature/json2.min.js"></script>
<script src="/resources/js/icommon.js"></script>
<script src="/resources/js/signature.js"></script>
</content>
<body>
	<div class="sigPad" id="smoothed" style="width:404px;">
	<ul class="sigNav">
	<li class="clearButton"><a id="btnClear" href="#clear">지우기</a></li>
	</ul>
	<div class="sig sigWrapper" style="height:auto;">
	<div class="typed"></div>
	<canvas id="canvasSign" class="pad" width="400" height="190"></canvas>
	<input type="hidden" id="hdnSign" class="output">
	</div>
</body>