<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="/resources/css/bootstrap.min.css" />
	<link rel="stylesheet" href="/resources/os/font-awesome/css/font-awesome.min.css" />
	<style>
		html, body {height: 100%;}
		.main {height: 100%; width: 100%; display: table;}
		.wrapper {display: table-cell; height: 100%; vertical-align: middle;}
		div.container {height: 300px; border: solid 2px #CCC; text-align:center; line-height:300px;}
		button {vertical-align: middle;}
	</style>
</head>
<body>
<div class="main">
	<div class="wrapper">
		<div class="container" style="margin-top:10px; height:100px; text-align:left; line-height:10px; padding-top: 15px;">
			<p>※ 기존 모바일 웹 대신 결재시 알림기능을 위해 앱으로 교체해 주세요<p>
			<p>※ 앱 설치후 반드시 한번 로그인해 주십시요.</p>
			<p>※ 아이폰은 개발예정입니다.</p>
		</div>
		<div class="container" style="margin-top:10px;">
			<form id="fm" method="post" action="/app/m/download" target="_blank">
				<input type="hidden" id="device" name="device"/>
			</form>
			<button class="btn btn-primary btn-lg" id="btnAndroid"><i class="fa fa-android"></i> 안드로이드 다운로드</button>
			<button class="btn btn-danger btn-lg" disabled><i class="fa fa-apple"></i>아이폰 다운로드</button>
		</div>
	</div>
</div>

<script src="/resources/lib/jquery.min.js"></script>
<script src="/resources/lib/bootstrap.min.js"></script>
<script type="text/javascript">
	$('#btnAndroid').on('click', function() {
		$('#device').val('android');
		$('#fm').submit();
	})
</script>
</body>