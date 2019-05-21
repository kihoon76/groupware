<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<content tag="script">
<script src="/resources/lib/jquery.min.js"></script>
<script src="/resources/os/html2canvas-1.0.0/html2canvas.min.js"></script>
<script src="/resources/os/jQuery-Orgchart-2.1.3/jquery.orgchart.min.js"></script>
<script src="/resources/js/orgchart.js"></script>
</content>
<head>
	  <link rel="stylesheet" href="/resources/os/font-awesome/css/font-awesome.min.css" />
	  <link rel="stylesheet" href="/resources/os/jQuery-Orgchart-2.1.3/jquery.orgchart.min.css" />
	  <style>
	  .team1 {background-color:#000000; color:#ffd700;}
	  .team1_title {background-color:#000000; color:#ffd700; margin-bottom:10px;}
	  .team2 {background-color:#006400; color:#ffd700;}
	  .team2_title {background-color:#006400; color:#ffd700; margin-bottom:10px;}
	  .team3 {background-color:#9932cc; color:#e6e6fa;}
	  .team3_title {background-color:#9932cc; color:#e6e6fa; margin-bottom:10px;}
	  .team4 {background-color:#CD0000; color:#FFE641;}
	  .team4_title {background-color:#CD0000; color:#FFE641; margin-bottom:10px;}
	  .team5 {background-color:#0000ff; color:#ffffff;}
	  .team5_title {background-color:#0000ff; color:#ffffff; margin-bottom:10px;}
	  .team6 {background-color:#FFD700; color:#0000ff;}
	  .team6_title {background-color:#FFD700; color:#0000ff; margin-bottom:10px;}
	  .ebiz {background-color:#828282; color:#ffffff;}
	  .ebiz_title {background-color:#828282; color:#ffffff; margin-bottom:10px;}
	  .imwon {background-color:#996600; color:#ffffff;}
	  .design {background-color:#33cccc; color:#000000;}
	  .design_title {background-color:#33cccc; color:#000000; margin-bottom:10px;}
	  </style>
</head>
<body>
	<div id="chart-container"></div>
</body>
