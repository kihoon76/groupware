var Common = { 
	socket: null,
	worker: null,
	popupClose: function() {},
	useCacheReserPop: true,
	offworkPopup: '',
	getFullHeight: function() {
		var screen = $.mobile.getScreenHeight();
    	var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight()  - 1 : $(".ui-header").outerHeight();
    	var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();

    	/* content div has padding of 1em = 16px (32px top+bottom). This step
    	   can be skipped by subtracting 32px from content var directly. */
    	var contentCurrent = $('.ui-content').outerHeight() - $('.ui-content').height();
    	var content = screen - header - footer - contentCurrent;
    	
    	return content - 32 - 32 - 32;
	},
	ajax: function(cfg) {
		$.ajax(cfg.url, {
			method: cfg.method || 'POST',
			dataType: cfg.dataType || 'json',
			data: cfg.data || {},
			contentType: cfg.contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
			headers: cfg.headers || {},
			beforeSend: function() {
				$.mobile.loading('show', {
				    theme: 'a'
				});
			},
			complete: function(jqXHR, textStatus) {
			    $.mobile.loading('hide');
			    
			    if(!cfg.isSystem) Common.closePopup();
			    
				if(jqXHR.errCode) {
					var msg = '';
					var fn = null;
					
					switch(jqXHR.errCode) {
					case '100': 
						msg = '세션이 만료되었습니다. <br/> 다시 로그인 해 주세요';
						fn = function() {
							window.location.href = '/signin'
						};
						break;
					case '202': 
						msg = '중복로그인 되었습니다. <br/> 다시 로그인 해 주세요';
						fn = function() {
							window.location.href = '/signin'
						};
						break;
					case '1002': 
					case '1004':
						msg = jqXHR.errMsg;
						break;
					default: 
						msg = '오류가 발생했습니다.';
						break;
					}
					
					//alert창 사용
					if(cfg.isSystem) {
						alert(msg);
						if(fn) fn();
					}
					else {
						setTimeout(function() {
							Common.makeErrMsg(msg, fn);
						}, 500);
					}
					
				}
				else {
					//성공 이후 final로 실행할 함수
					if(jqXHR.runFinal) {
						setTimeout(jqXHR.runFinal, 100);
					}
				}
				
			},
			success: function(data, textStatus, jqXHR) {
				var json = $.parseJSON(jqXHR.responseText);
				if(json.success) {
					cfg.success(json, textStatus, jqXHR); 
				}
				else {
					jqXHR.errCode = json.errCode;
					jqXHR.errMsg = json.errMsg;
					jqXHR.data = json.datas;
				}
			},
			error: function(jqXHR, textStatus, err) {
				console.log(jqXHR)
			}
		});
	},
	checkSession: function(fn) {
		Common.ajax({
			url: '/checkSession',
			method: 'GET',
			dataType: 'json',
			headers: {'CUSTOM': 'Y'},
			success: function(data, textStatus, jqXHR) {
				if(fn) {
					jqXHR.runFinal = fn;
				}
			},
		});
	},
	makePopup: function(header, content, datas) {
		var $dvPopupContent = $('#dvPopupContent');
		//$('#popupHeader').html(header || '<span style="padding: 10px 10px 10px 10px; font-size:1.5em;">알림</span>');
		$('#popupHeader').html(header || '');
		$dvPopupContent.html(content || '');
		if(datas) {
			for(var i=0, len=datas.length; i<len; i++) {
				$dvPopupContent.data(datas[i].key, datas[i].value);
			}
		}
	},
	openPopup: function(type, afterFn) {
		if(type == 'alert') {
			$('#btnPopupOk').hide();
			$('#btnPopupCancel').text('확인');
		}
		else if(type == 'offwork') {
			$('#btnPopupOk').show();
			$('#btnPopupCancel').text('닫기');
		}
		
		Common.popupClose = afterFn;
		$('#popupDialog').popup('open');
	},
	closePopup: function() {
		$('#popupDialog').popup('close');
	},
	makeErrMsg: function(errMsg, fn) {
		Common.makePopup('', errMsg);
		Common.openPopup('alert', fn);
	}
};

//모바일 홈페이지 바로가기 링크 생성 
var userAgent = navigator.userAgent.toLowerCase(); // 접속 핸드폰 정보 
if(userAgent.match('iphone')) { 
    $('head').append('<link rel="apple-touch-icon" href="/resources/images/dongrim.png" />') 
} 
else if(userAgent.match('android')) { 
	$('head').append('<link rel="shortcut icon" href="/resources/images/dongrim.png" />') 
}


$(document)
.off('change', '#selOverworkType')
.on('change', '#selOverworkType', function() {
	var v = $(this).val();
	var $txtOutworkContent = $('#txtOutworkContent');
	if(v == '0') {
		$txtOutworkContent.val('');
		$txtOutworkContent.prop('disabled', true);
	}
	else {
		$txtOutworkContent.prop('disabled', false);
	}
});

$(document)
.off('pageinit')
.on('pageinit', function () {
	$('body>[data-role="panel"]').panel();
	
	var overworkTypes = $('#overworkTypes').val();
	var html = '<form><div><h4>업무내용: </h4><textarea style="width:100%; height:40px;" id="txtWorkContent"></textarea>';
	html += '<h4>야근유형: </h4><select id="selOverworkType">' + overworkTypes + '</select>';
	html += '<h4>야근내용: </h4><textarea style="width:100%; height:40px;" id="txtOutworkContent" disabled></textarea></div></form>';
	Common.offworkPopup = html;
//	var baseUrl = $('#baseUrl').val();
//	
//	(function callWorker() {
//		if(window.Worker) {
//			if(Common.worker) {
//				Common.worker.terminate();
//			}
//			
//			Common.worker = new Worker(baseUrl + '/resources/js/mobile/worker.js');
//			
//			Common.worker.onmessage = function(event) {
//				var d = event.data;
//				$('#spTime').text(d);
//			}
//			
//			var time = $('#spTime').text();
//			var ymd = time.split(' ');
//			var ymdSplit = ymd[0].split('-');
//			var hmsSplit = ymd[1].split(':');
//			
//			var timeObj = {
//				year: ymdSplit[0],
//				month: ymdSplit[1],
//				day: ymdSplit[2],
//				hour: hmsSplit[0],
//				min: hmsSplit[1],
//				sec: hmsSplit[2]
//			}
//			
//			Common.worker.postMessage(timeObj);
//		}
//		
//	})();
	
	$(document)
	.off('click', '#btnGotowork')
	.on('click', '#btnGotowork', function() {
		var $this = $(this);
		Common.ajax({
			url: '/geuntae/m/gotowork?lat=0&lng=0',
			method: 'GET',
			dataType: 'json',
			headers: {'CUSTOM': 'Y'},
			success: function(data, textStatus, jqXHR) {
				alert(data.datas[0] + '에 출근처리 되었습니다.');
				$this.addClass('ui-disabled');
				$('#btnOffwork').removeClass('ui-disabled');
			},
		});
		
//		if('geolocation' in navigator) {
//			// 지오로케이션 사용 가능 
//			navigator.geolocation.getCurrentPosition(function(position) {
//				geoAllow = true;
//				var coords = position.coords;
//				
//				Common.ajax({
//					url: '/geuntae/m/gotowork?lat=' + coords.latitude + '&lng=' + coords.longitude,
//					method: 'GET',
//					dataType: 'json',
//					headers: {'CUSTOM': 'Y'},
//					success: function(data, textStatus, jqXHR) {
//						alert(data.datas[0] + '에 출근처리 되었습니다.');
//						$this.addClass('ui-disabled');
//						$('#btnOffwork').removeClass('ui-disabled');
//					},
//				});
//				
//			}, function(err) {
//				geoErrMsg = '브라우져가 위치정보를 차단하였습니다.';
//				//alert(geoErrMsg);
//				alert(err.message);
//			});
//		}
//		else {
//			geoErrMsg = '사용하시는 브라우져가 위치기반 서비스를 제공하지 않습니다.';
//			alert(geoErrMsg);
//		}
		
//		var $this = $(this);
//		Common.ajax({
//			url: '/geuntae/m/gotowork',
//			method: 'GET',
//			dataType: 'json',
//			headers: {'CUSTOM': 'Y'},
//			success: function(data, textStatus, jqXHR) {
//				alert(data.datas[0] + '에 출근처리 되었습니다.');
//				$this.addClass('ui-disabled');
//				$('#btnOffwork').removeClass('ui-disabled');
//			},
//		});
	});
	
	$(document)
	.off('click', '#btnOffwork')
	.on('click', '#btnOffwork', function() {
		Common.checkSession(function() {
			Common.makePopup('', Common.offworkPopup);
			Common.openPopup('offwork');
		});
	});
	
	$(document)
	.off('click', '#btnPopupOk')
	.on('click', '#btnPopupOk', function() {
		var $txtWorkContent = $('#txtWorkContent');
		var $txtOutworkContent = $('#txtOutworkContent');
		var $selOverworkType = $('#selOverworkType');
		
		var workContent = $.trim($txtWorkContent.val());
		if(workContent == '') {
			$txtWorkContent.focus(); 
			
			return;
		}
	
		Common.ajax({
			url: '/geuntae/m/offwork',
			method: 'POST',
			dataType: 'json',
			data: JSON.stringify({
				workContent: workContent,
				outworkContent: $.trim($txtOutworkContent.val()),
				overworkType: $selOverworkType.val()
			}),
			headers: {'CUSTOM': 'Y'},
			contentType: 'application/json',
			success: function(data, textStatus, jqXHR) {
				alert(data.datas[0] + ' - '+ data.datas[1] + '에 퇴근처리 되었습니다.');
				$('#btnOffwork').addClass('ui-disabled');
			},
		});
		
		
	});
	
	$(document)
	.off('click', '#btnPopupCancel')
	.on('click', '#btnPopupCancel', function() {
		Common.closePopup();
	});
	
	
	
	//$popupDialog.open();
	$('[data-role=panel] a')
	.off('click')
	.on('click', function () {
		var $this = $(this);
		console.log($this)
		
		if($this.attr('href') != '#') {
			$('#leftpanel1').panel('close');
		}
	});
	
	//로그아웃
	$(document)
	.off('click','#footerLogout')
	.on('click', '#footerLogout', function() {
		Common.ajax({
			url: '/logout',
			method: 'POST',
			dataType: 'json',
			headers: {'CUSTOM': 'Y'},
			contentType: 'application/json',
			success: function(data, textStatus, jqXHR) {
				window.location.href = '/signin';
			},
		});
	});
	
	$(document)
	.off('click', '#footerHome')
	.on('click', '#footerHome', function(e) {
		$.mobile.loading('show', {
		    theme: 'a'
		});
		window.location.href = '/m/main';
	});
});

$(document).on('pageshow', function (event, ui) {
	$('#popupDialog').popup({history: false});
	var $dvUseInfo = $('#dvUseInfo');
	var $dvGeuntae = $('#dvGeuntae');
	
	if($dvGeuntae.get(0)) {
		var baseUrl = $('#baseUrl').val();
		if(window.Worker) {
			if(Common.worker) {
				Common.worker.terminate();
			}
			
			Common.worker = new Worker(baseUrl + '/resources/js/mobile/worker.js');
			
			Common.worker.onmessage = function(event) {
				var d = event.data;
				$('#spTime').text(d);
			}
			
			var time = $('#spTime').text();
			var ymd = time.split(' ');
			var ymdSplit = ymd[0].split('-');
			var hmsSplit = ymd[1].split(':');
			
			var timeObj = {
				year: ymdSplit[0],
				month: ymdSplit[1],
				day: ymdSplit[2],
				hour: hmsSplit[0],
				min: hmsSplit[1],
				sec: hmsSplit[2]
			}
			
			Common.worker.postMessage(timeObj);
		}
	}
	
	if($dvUseInfo.get(0)) {
		var swiper = new Swiper('.swiper-container', {
    		pagination: {
    			el: '.swiper-pagination',
    	    },
    	});
    	
		$dvUseInfo.height(Common.getFullHeight());
	}
});

$(document).on('pageremove', function (event, ui) {
	console.log('pageremove')
});

$(document).on('popupafterclose', "[data-role=popup]", function (e) {
	if(e.target.id == 'popupDialog') {
		if(Common.popupClose) {
			Common.popupClose();
			Common.popupClose = null;
		}
	}
		
	//$.scrollLock(false);
	
	
    console.log(e.target.id + " -> " + e.type);
});
