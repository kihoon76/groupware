<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="/resources/css/print.css" /> 
	<style>
	.title {margin-top:80px; text-align:center;font-size:25px;letter-spacing:50px;text-indent:0.9em;text-decoration:underline;}
	.title_sub {margin-top:10px; text-align:center; font-size:19px;}
	.select_type {border-style:solid; border-width:1px; border-color:#000; border-radius:25px; display:inline-block;}
	.up_gyeoljae {margin-top:20px;margin-bottom:30px;}
	table {width:100%;border:1px solid #444444;border-collapse:collapse;}
  	th, td {border:1px solid #444444;width:60px;}
	.wrapper {display:inline-block;text-align:right;vertical-align:top;zoom: 1;}
	.wrapper div {float:right;height:100px;margin:10px;width:300px;}
	.foo {border-color:blue;float: right;}
	.sawon {margin:0px 0px 10px 50px;}
	.letter {letter-spacing:30px;}
	.info {margin:30px 0px 0px 50px;}
	.numberCircle {
    	border-radius: 50%;
	    width: 36px;
    	height: 36px;
    	padding: 2px;
    	background: #fff;
    	border: 1px solid #444;
    	color: #444;
    	text-align: center;
	    font: 10px Arial, sans-serif;
	}​
	</style>
</head>
<body>
<div>
    <div class="paper">
    	<button id="btnPrint" style="height:30px; width:100px;">인쇄</button>
        <div class="content">
        	<div class="title">&nbsp;휴가원</div>
        	<div class="title_sub">(
        		<span <c:if test="${docs.type eq '1'}">class="select_type"</c:if>>연차</span>, 
        		<span <c:if test="${docs.type eq '2'}">class="select_type"</c:if>>보건</span>, 
        		<span <c:if test="${docs.type eq '3'}">class="select_type"</c:if>>청원</span>, 
        		<span <c:if test="${docs.type eq '4'}">class="select_type"</c:if>>공가</span>, 
        		<span <c:if test="${docs.type eq '5'}">class="select_type"</c:if>>병가</span>, 
        		<span <c:if test="${docs.type eq '6'}">class="select_type"</c:if>>직무교육</span>, 
        		<span <c:if test="${docs.type eq '7'}">class="select_type"</c:if>>기타</span>)
        	</div>
        	<div class="up_gyeoljae">
        		<div class="wrapper">
        			<div class="foo">
        				<table>
        				<tr>
        					<td rowspan="2" style="width:10px">소<br/>속</br/>부<br/>서</td>
        					<td style="height:10px;width:90px;">팀장</td>
        					<td style="height:10px;width:90px;">이사/상무</td>
        					<td style="height:10px;width:90px;">전무</td>
        				</tr>
        				<tr>
        				<c:set var="sign" value="${fn:length(docs.signs)}" />
        				<c:choose>
        				<c:when test="${sign eq '1'}">
        					<td style="height:70px;width:90px;"></td>
        					<td></td>
        					<c:forEach items="${docs.signs}" var="gs">
        					<td>
        						<img src="${gs.sign}" style="width:90px;height:60px" alt=""/>
        					</td>
        					</c:forEach>
        				</c:when>
        				<c:when test="${sign eq '2'}">
        					<td style="height:70px;width:90px;"></td>
        					<c:forEach items="${docs.signs}" var="gs">
        					<td>
        						<img src="${gs.sign}" style="width:100px;height:60px" alt=""/>
        					</td>
        					</c:forEach>
        				</c:when>
        				<c:when test="${sign eq '3'}">
        					<c:forEach items="${docs.signs}" var="gs">
        					<td style="height:70px;width:90px;">
        						<img src="${gs.sign}" style="width:100px;height:60px" alt=""/>
        					</td>
        					</c:forEach>
        				</c:when>
        				<c:otherwise>
        					<td style="height:70px;width:90px;"></td>
        					<td></td>
        					<td></td>
        				</c:otherwise>
        				</c:choose>
        				</tr>
        				</table>
        			</div>
        			<div></div>
        		</div>
        	</div>
        	<div class="sawon">
        		<span class="letter">부서:</span><span><c:out value="${docs.departmentName}" /></span>
        	</div>
        	<div class="sawon">
        		<span class="letter">직급:</span><span><c:out value="${docs.positionName}" /></span>
        	</div>
        	<div class="sawon">
        		<span class="letter">성명:</span><span><c:out value="${docs.sawonName}" /></span>
        	</div>
        	<div class="info">
        		<div style="padding-left:50px;">상기인은 
        			<span><c:out value="${docs.startYear}" /></span>년 
        			<span><c:out value="${docs.startMonth}" /></span>월 
        			<span><c:out value="${docs.startDay}" /></span>일부터  
        			<span><c:out value="${docs.endYear}" /></span>년
        			<span><c:out value="${docs.endMonth}" /></span>월 
        			<span><c:out value="${docs.endDay}" /></span>일까지 (<span><c:out value="${docs.term}" /></span>일간)
        		</div>
        		<div style="margin-top:5px;">아래 사유로 (
        			<span <c:if test="${docs.type eq '1'}">class="select_type"</c:if>>연차</span>, 
	        		<span <c:if test="${docs.type eq '2'}">class="select_type"</c:if>>보건</span>, 
	        		<span <c:if test="${docs.type eq '3'}">class="select_type"</c:if>>청원</span>, 
	        		<span <c:if test="${docs.type eq '4'}">class="select_type"</c:if>>공가</span>, 
	        		<span <c:if test="${docs.type eq '5'}">class="select_type"</c:if>>병가</span>, 
	        		<span <c:if test="${docs.type eq '6'}">class="select_type"</c:if>>직무교육</span>, 
	        		<span <c:if test="${docs.type eq '7'}">class="select_type"</c:if>>기타</span>)
	        		휴가를 사용하고자 
	        	</div>
	        	<div style="margin-top:5px;margin-bottom:30px;">하오니 허락하여 주시기 바랍니다.</div>
        		<div style="width:557px;border-bottom-style:solid;border-bottom-color:#444444;border-bottom-width:1px">사 유 :</div>
        		<div style="width:557px;text-align:right;">청원휴가, 공가, 직무교육, 기타의 경우에만 작성할 것</div> 
        	</div>
        	<div style="margin-top:50px;margin-left:400px;">
        		<span><c:out value="${docs.todayYear}" /></span>년 
        		<span><c:out value="${docs.todayMonth}" /></span>월 
        		<span><c:out value="${docs.todayDay}" /></span>일 
        	</div>
        	<div style="margin-top:20px;margin-left:400px;">
        		<c:choose>
        		<c:when test="${empty docs.mySign}">
        		<span>위원인:</span>
        		<span><c:out value="${docs.sawonName}" /></span>
        		<span class="numberCircle">인</span>
        		</c:when>
        		<c:otherwise>
        		<span style="position:relative;top:-70px;">위원인:</span>
        		<span style="position:relative;top:-70px;"><c:out value="${docs.sawonName}" /></span>
        		<span style="position:relative;top:-30px;">
        			<img src="${docs.mySign }" style="width:100px;height:80px" alt=""/>
        		</span> 
        		</c:otherwise>
        		</c:choose>
        	</div>
        	<div style="margin-top:30px;margin-left:50px;">
        		<strong>주식회사 동림피엔디 대표이사 귀하</strong>
        	</div>
        	<div style="margin-left:50px;margin-top:30px;">
        		<table style="width:400px;">
    			<tr>
    				<td rowspan="2" style="width:10px">결재</td>
    				<td style="height:10px;">인사담당</td>
    				<td>인사부장</td>
    				<td>임원</td>
    				<td>대표이사</td>
    			</tr>
    			<tr style="height: 60px;">
    				<td></td>
    				<td></td>
    				<td></td>
    				<td></td>
    			</tr>
    			</table>
        	</div>
        </div>    
    </div>
</div>
<script src="/resources/lib/jquery.min.js"></script>
<script type="text/javascript">
	$('#btnPrint').on('click', function() {
		$(this).hide();
		window.print();
	});
	
	window.onafterprint = function() {
		$('#btnPrint').show();
	}

   
   
</script>
</body>
</html>