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
<!-- <script src="/resources/os/fullcalendar-3.9.0/fullcalendar-rightclick.js"></script> -->
<script src="/resources/os/fullcalendar-3.9.0/locale/ko.js"></script>
<script src="/resources/os/fullcalendar-3.9.0/scheduler-1.9.4.min.js"></script>
<script src="/resources/os/jQuery-Contextmenu-2.7.1/jquery.contextMenu.js"></script>
<script src="/resources/os/jQuery-Contextmenu-2.7.1/jquery.ui.position.js"></script>
<script src="/resources/js/icommon.js"></script>
<script src="/resources/js/project/newwbs.js"></script>
</content>
<head>
	<link rel="stylesheet" href="/resources/css/jquery-ui.css" />
	<link rel="stylesheet" href="/resources/css/calendar.css" />
	<link rel="stylesheet" href="/resources/os/fullcalendar-3.9.0/fullcalendar.min.css" />
	<link rel="stylesheet" href="/resources/os/fullcalendar-3.9.0/scheduler-1.9.4.min.css" />
	<link rel="stylesheet" href="/resources/os/jQuery-Contextmenu-2.7.1/jquery.contextMenu.css" />
	<link rel="stylesheet" href="/resources/os/font-awesome/css/font-awesome.min.css" />
	<style>
		body {
    		margin-top: 10px;
    		/*text-align: center;*/
    		font-size: 14px;
    		font-family: "Lucida Grande",Helvetica,Arial,Verdana,sans-serif;
  		}
  
   		#external-events {
     		width: 150px; 
     		padding: 0 10px; 
     		border: 1px solid #ccc; 
     		background: #eee; 
     		text-align: left; 
     		margin-bottom: 10px;
  		}
  		
  		 #external-events h5 {
    		font-size: 11px;
    		margin-top: 0;
     		padding-top: 3px; 
  		}
  
  		#external-events .fc-event { 
     		margin: 5px 0; 
     		cursor: pointer; 
   		} 
	</style>
</head>
<body>
	<div id="wrap">
    	<div id="external-events">
<!--     		<h5>드래그하세요</h5> -->
      		<div class="fc-event">&nbsp;</div>
    	</div>
    	<div id="calendar"><span id="spLoading">폼 로딩중......</span></div>
    	<div style="clear:both;"></div>
    </div>
</body>