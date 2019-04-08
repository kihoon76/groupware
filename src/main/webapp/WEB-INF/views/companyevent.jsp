<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<content tag="script">
<script src="/resources/lib/jquery.min.js"></script>
<script src="/resources/lib/jquery-ui.min.js"></script>
<script src="/resources/lib/moment.min.js"></script>
<script src="/resources/os/fullcalendar-3.9.0/fullcalendar.min.js"></script>
<script src="/resources/os/fullcalendar-3.9.0/locale/ko.js"></script>
<script src="/resources/js/icommon.js"></script>
<script src="/resources/js/companyevent.js"></script>
</content>
<head>
	<link rel="stylesheet" href="/resources/css/jquery-ui.css" />
	<link rel="stylesheet" href="/resources/css/calendar.css" />
	<link rel="stylesheet" href="/resources/os/fullcalendar-3.9.0/fullcalendar.min.css" />
	<style>
	.unavailable {
  display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    /*background-color: lightgrey;*/
}
	</style>
</head>
<body>
	<div id="ceCalendar"></div>
	<input type="hidden" id="hdnCurrentDate" value="${currentDate}">
</body>