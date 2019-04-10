<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="/resources/os/lightslider/css/lightslider.css" />
	<style>
    	ul{
			list-style: none outside none;
		    padding-left: 0;
            margin: 0;
		}
        .demo .item{
            margin-bottom: 60px;
        }
		.content-slider li{
		    background-color: #000000;
		    text-align: center;
		    color: #FFF;
		}
		.content-slider h3 {
		    margin: 0;
		    padding: 70px 0;
		}
		.demo{
			width: 1500px;
		}
		.demo img {width:1269px; height:874px;}
    </style>
	<sitemesh:write property="head" />
</head>
<body>
	<div class="demo">
		<div class="item">
            <ul id="content-slider" class="content-slider">
            <sitemesh:write property="body" /> 
            </ul>
        </div>
	</div>
	<script src="/resources/lib/jquery.min.js"></script>
	<script type="text/javascript" src="/resources/os/lightslider/js/lightslider.js"></script>
	<script type="text/javascript">
		$(document).ready(function() {
			$("#content-slider").lightSlider({
	             loop:true,
	             keyPress:true,
	             item:1,
	         });
		});
	</script>
</body>
</html>