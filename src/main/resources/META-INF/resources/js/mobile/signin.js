$(document).ready(function() {
	var geoAllow = true;//false;
	var geoErrMsg = '';

	$('#pw').on('keyup', function(e) {
		if(e.keyCode == 13) {
			$('#btnLogin').trigger('click');
		}
	});
	
	$('#btnLogin').on('click', function() {
		if(!geoAllow) {
			alert(geoErrMsg);
			return;
		}
		
		var $id = $('#id');
		var $pw = $('#pw');
		
		if($.trim($id.val()) == '') {
			$id.focus();
			return;
		}
		
		if($.trim($pw.val()) == '') {
			$pw.focus();
			return;
		}
		
		$.ajax('login', {
			method: 'POST',
			dataType: 'text',
			data: $('#loginFm').serialize(),
			beforeSend: function() {
				$.mobile.loading('show', {
				    theme: 'a'
				});
			},
			complete: function() {
			    $.mobile.loading('hide');
			},
			success: function(data, textStatus, jqXHR) {
				var jo = $.parseJSON(data);
				if(jo.success) {
					window.location.href = 'm/main';
				}
				else {
					$(':mobile-pagecontainer').pagecontainer('change', '#dialog');
				}
			},
		});
	});
	
	var userAgent = navigator.userAgent.toLowerCase(); // 접속 핸드폰 정보 
	   
	// 모바일 홈페이지 바로가기 링크 생성 
	if(userAgent.match('iphone')) { 
	    $('head').append('<link rel="apple-touch-icon" href="/resources/images/dongrim.png" />') 
	} 
	else if(userAgent.match('android')) { 
		$('head').append('<link rel="shortcut icon" href="/resources/images/dongrim.png" />') 
	}
	
	/*if('geolocation' in navigator) {
		// 지오로케이션 사용 가능 
		navigator.geolocation.getCurrentPosition(function(position) {
			geoAllow = true;
			
		}, function(err) {
			geoErrMsg = '브라우져가 위치정보를 차단하였습니다.';
			//alert(geoErrMsg);
			alert(err.message);
			console.log(err);
		});
	}
	else {
		geoErrMsg = '사용하시는 브라우져가 위치기반 서비스를 제공하지 않습니다.';
		alert(geoErrMsg);
	}*/
});