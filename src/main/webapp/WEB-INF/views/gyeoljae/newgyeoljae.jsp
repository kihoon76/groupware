<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<content tag="script">
<script src="/resources/lib/jquery.min.js"></script>
<script src="/resources/lib/bootstrap.min.js"></script>
<script src="/resources/os/tabulator-4.1/js/tabulator.min.js"></script>
<script src="/resources/os/Quill-Editor-Bootstrap-4/sprite.svg.js"></script>
<script src="/resources/os/Quill-Editor-Bootstrap-4/bootstrap-quill.js"></script>
<script src="/resources/js/icommon.js"></script>
<script src="/resources/js/gyeoljae/newgyeoljae.js"></script>
</content>
<head>
	<link rel="stylesheet" href="/resources/css/bootstrap.min.css" />
	<link rel="stylesheet" href="/resources/os/font-awesome/css/font-awesome.min.css" />
	 <!-- tabulator -->
    <link rel="stylesheet" href="/resources/os/tabulator-4.1/css/tabulator_simple.min.css" />
    
    
    <link rel="stylesheet" href="/resources/os/Quill-Editor-Bootstrap-4/css/quill.css">
  	<link rel="stylesheet" href="/resources/os/Quill-Editor-Bootstrap-4/css/quill.snow.css">
  	<link rel="stylesheet" href="/resources/os/Quill-Editor-Bootstrap-4/css/quill.bubble.css">
	<style>
	form {padding:10px 10px 10px 10px;}
	.divMT {margin-top:10px;}
	.divMB {margin-bottom:10px;}
/* 	.has-search .form-control {padding-left: 2.375rem;} */
/* 	.has-search .form-control-feedback { */
/* 	    position: absolute; */
/* 	    z-index: 2; */
/* 	    display: block; */
/* 	    width: 2.375rem; */
/* 	    height: 2.375rem; */
/* 	    line-height: 2.375rem; */
/* 	    text-align: center; */
/* 	    pointer-events: none; */
/* 	    color: #aaa; */
/* 	} */
	</style>
</head>
<body>
	<form>
		<div class="form-group">
    		<input type="text" class="form-control" id="gianTitle" placeholder="기안제목">
  		</div>
  		<div class="input-group">
    		<input type="text" class="form-control" placeholder="이름 입력해서 검색함" id="txtSearchSawon">
    		<div class="input-group-append">
      			<button class="btn btn-secondary" type="button" id="btnSearchSawon" disabled>
        			<i class="fa fa-search"></i>
      			</button>
    		</div>
  		</div>
  		<div class="divMT"><h3><span class="badge badge-danger">결재라인</span></h3></div>
  		<div class="divMT divMB">
  			<div id="gyeoljaeLine"></div>
  		</div>
  		<div class="divMT"><h3><span class="badge badge-danger">내용</span></h3></div>
  		<div class="editor-full">
  			<div id="document-full" class="ql-scroll-y" style="height: 300px;">
    			<h1>jQueryScript.Net</h1>
			</div>
		</div>
  		<div class="divMT">
  			<button type="button" class="btn btn-primary" disabled id="btnSangsin">상신</button>
  		</div>
	</form>
</body>