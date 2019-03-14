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
	.title {margin-top:100px; text-align:center; text-decoration:underline;font-size:25px;letter-spacing:50px;}
	.title_sub {margin-top:10px; text-align:center; font-size:19px;}
	.select_type {border-style:solid; border-width:1px; border-color:#000; border-radius:25px; display:inline-block;}
	.up_gyeoljae {margin-top:20px;}
	table {width:100%;border:1px solid #444444;border-collapse:collapse;}
  	th, td {border:1px solid #444444;width:60px;}
	.wrapper {display:inline-block;text-align:right;vertical-align:top;zoom: 1;}
	.wrapper div {float:right;height:100px;margin:10px;width:300px;}
	.foo {border-color:blue;float: right;}
	.sawon {margin:0px 0px 10px 50px;}
	.letter {letter-spacing:30px;}
	.info {margin:30px 0px 0px 50px;}​
	</style>
</head>
<body>
<div>
    <div class="paper">
    	<button id="btnPrint" style="height:30px; width:100px;">인쇄</button>
        <div class="content">
        	<div class="title">휴가원</div>
        	<div class="title_sub">(<span class="select_type">연차</span>, <span>보건</span>, <span>청원</span>, <span>공가</span>, <span>병가</span>, <span>직무교육</span>, <span>기타</span>)</div>
        	<div class="up_gyeoljae">
        		<div class="wrapper">
        			<div class="foo">
        				<table>
        				<tr>
        					<th rowspan="2" style="width:10px">소속부서</th>
        					<td style="height:10px;">팀장</td>
        					<td>이사</td>
        					<td>전무</td>
        				</tr>
        				<tr>
        					<td></td>
        					<td></td>
        					<td></td>
        				</tr>
        				</table>
        			</div>
        			<div></div>
        		</div>
        	</div>
        	<div class="sawon">
        		<span class="letter">부서:</span><span><c:out value="${docs.teamName}" /></span>
        	</div>
        	<div class="sawon">
        		<span class="letter">직급:</span><span><c:out value="${docs.positionName}" /></span>
        	</div>
        	<div class="sawon">
        		<span class="letter">성명:</span><span><c:out value="${docs.sawonName}" /></span>
        	</div>
        	<div class="info">
        		<span style="padding-left:50px;">상기인은 <span>2019</span>년 <span>3</span>월 <span>3</span>일 부터  <span>2019</span>년 <span>3</span>월 <span>3</span>일까지 (<span></span>일간)</span><br/>
        		<span>아래 사유로 (<span>연차</span>, <span>보건</span>, <span>청원</span>, <span>공가</span>, <span>병가</span>, <span>직무교육</span>, <span>기타</span>) 휴가를 사용하고자 하오니 허락하여 주시기 바랍니다.</span><br/>
        		<br />
        		<br />
        		<br />
        		<div style="width:500px;border-bottom-style:solid;border-bottom-color:#444444;border-bottom-width:1px">사 유 :</div>
        		<div style="width:500px;text-align:right;">청원휴가, 공가, 직무교육, 기타의 경우에만 작성할 것</div> 
        	</div>
        	<div style="margin-top:50px;margin-left:400px;">
        		<span>2019</span>년 <span>3</span>월 <span>25</span>일 
        	</div>
        	<div style="margin-top:20px;margin-left:400px;">
        		<span>위원인:</span><span><c:out value="${docs.sawonName}" /></span><span><img src="${docs.mySign }" style="position:relative;width:100px;height:80px;top:30px;left:5px;" alt=""/></span> 
        	</div>
        	<div style="margin-top:30px;margin-left:50px;">
        		<strong>주식회사 동림피엔디 대표이사 귀하</strong>
        	</div>
        	<div style="margin-left:50px;margin-top:30px;">
        		<table style="width:400px;">
    			<tr>
    				<th rowspan="2" style="width:10px">결재</th>
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