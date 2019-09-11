<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<content tag="script">
<script src="/resources/lib/jquery.min.js"></script>
<script src="/resources/os/exif-js/exif.js"></script>
<script src="/resources/js/photo.js"></script>
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=5bd70be4e4d73aa0679a9586b84780b7"></script>
</content>
<head>
	<style>
		*{margin:0; padding:0;}
		html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; }
		.customoverlay {position:relative;bottom:12px;border-radius:6px;border: 1px solid #ccc;border-bottom:2px solid #ddd;float:left;background-color:rgba(255,255,255,0.3); width:30px;text-align:center;font-size:1.1em;color:crimson;font-weight:bold;left:-2px;}
		.customoverlay:nth-of-type(n) {border:0; /*box-shadow:0px 1px 2px #888;*/}
		.customoverlay a {display:block;text-decoration:none;color:#000;text-align:center;border-radius:6px;font-size:14px;font-weight:bold;overflow:hidden;background: #d95050;background: #d95050 url(http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png) no-repeat right 14px center;}
		.customoverlay .title {display:block;text-align:center;background:#fff;margin-right:35px;padding:10px 15px;font-size:14px;font-weight:bold;}
		.customoverlay:after {content:'';position:absolute;margin-left:-12px;left:50%;bottom:-12px;width:22px;height:12px;/*background:url('http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')*/}
		.zIndexUp {z-index:1000;}
	</style> 
</head>
<body>
	<input id="file-input" type="file" multiple style="display:none;" accept="image/x-png,image/gif,image/jpeg"/>
	<div id="map"></div>
</body>
