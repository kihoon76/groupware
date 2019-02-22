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
<script src="/resources/os/fullcalendar-3.9.0/scheduler-1.9.4.min.js"></script>
<script src="/resources/os/jQuery-Contextmenu-2.7.1/jquery.contextMenu.js"></script>
<script src="/resources/os/jQuery-Contextmenu-2.7.1/jquery.ui.position.js"></script>
<script src="/resources/os/jQuery-loading-overlay/loadingoverlay.min.js"></script>
<script src="/resources/js/icommon.js"></script>
<script src="/resources/js/project/mywbs.js"></script>
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
  		
  		#external-events .fc-event { 
     		margin: 5px 0; 
     		cursor: pointer; 
   		} 
   		
   		#wbsName {
  			width: 600px; 
     		padding: 0 10px; 
     		border: 1px solid #ccc; 
/*      		background: #eee;  */
     		text-align: left; 
     		margin-bottom: 10px;
  		}
  		
  		#wbsWriter {
  			width: 100px; 
     		padding: 0 10px; 
     		border: 1px solid #ccc; 
     		background: #eee; 
     		text-align: left; 
     		margin-bottom: 10px;
  		}
  		
  		#wbsWriter .wbs_header {
  			margin: 5px 0;
  		}
  		
  		#wbsName .wbs_header {
  			margin: 5px 0;
  		}
  		
  		#external-events .fc-event { 
     		margin: 5px 0; 
     		cursor: pointer; 
   		} 
   		
   		#external-events .fc-event button{ 
     		cursor: pointer; 
   		} 
   		
   		div .DV_FLOAT {
   			float:left;
   			margin-right: 10px;
   		}
	</style>
</head>
<body>
	<div id="wrap">
    	<div id="external-events" class="DV_FLOAT">
      		<div class="fc-event">&nbsp;</div>
    	</div>
    	<div class="DV_FLOAT">
    		<input type="text" id="txtWbsName"  style="height:23px; width:400px; padding-left:5px;" placeholder="WBS이름" readonly>
    	</div>
    	
    	<div class="DV_FLOAT">
    		<input type="text" id="txtWbsWriter" style="height:23px; width:80px; text-align:center;" placeholder="WBS작성자" readonly>
    	</div>
    	<div class=" DV_FLOAT">
      		<button id="btnWBSPop" style="width:120px; height:29px;">내 WBS검색</button>
    	</div>
    	<div style="clear:both"></div>
    	<div id="calendar"><span id="spLoading">폼 로딩중......</span></div>

    </div>
</body>