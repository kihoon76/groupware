<%@ page language="java" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<!--[if IE 8]><html class="ie8" lang="ko"><![endif]-->
<!--[if IE 9]><html class="ie9" lang="ko"><![endif]-->
<!--[if gt IE 9]><!--><html lang="ko"><!--<![endif]-->
<head>
	<meta charset="utf-8">
	<style>
	@import url('https://fonts.googleapis.com/css?family=Righteous');
	
	body{
	background-color: #000;
	     color:red; 
	}
	.Wrapper{
	  width:540px;
	  height:200px;
	  display:none;
	  margin:4% auto 0;
	  max-width:100%;
	  max-height:100%;
	  position:relative;
	  overflow:hidden;
	}
	
	#five{
	  z-index: 10;
	  position: absolute;
	}
	
	.left{
	  z-index: 1;
	  width: 550px;
	  height: 200px;
	  position: absolute;
	  overflow:hidden;
	}
	
	.right{
	  z-index: 1;
	  width: 550px;
	  height: 200px;
	  position: absolute;
	  overflow:hidden;
	  left:80%;
	}
	
	h1{
	 color:#000; 
	 background:red;
	 padding: 10px;
	 border-radius:50px;
	 width:150px;
	  margin:30px auto 10px;
	text-align:center;
	font-size:1em;
	font-family: 'Righteous', sans-serif;
	display:none;
	}
	
	p{
	 width:350px;
	  margin:0px auto;
	text-align:center;
	font-family: 'Righteous', sans-serif;
	display:none;
	}
	</style>
</head>
<body>
<div class="Wrapper">
	<div class="left">Error</div>
  	<div class="right">Error</div>
  	<canvas id="five" width="550" height="205"></canvas>
</div>
<h1>오류</h1>
<p><c:out value="${msg}" /></p>
<script>
WebFontConfig = {
	google:{ families: ['Righteous'] },
  	active: function(){FiveOhFiveFont();},
};
		
(function(){
	var wf = document.createElement('script');
	wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.5.10/webfont.js';
	wf.async = 'true';
	document.head.appendChild(wf);
})();
</script>
</body>

</html>

