var Common = { 
	socket: null,
	worker: null,
	popupClose: function() {},
	useCacheReserPop: true,
	offworkPopup: '',
	myPlanPopup: '<input type="text" placeholder="제목" style="width:100%;visibility:hidden;"><textarea class="ta-myplan" style="width:99%;margin-top:5px;" readOnly>{0}</textarea>',
	myGyeoljaePopup: '<input type="text" style="width:100%;visibility:hidden;"><textarea class="ta-myplan" style="width:99%;margin-top:5px;" id="txtGyeoljaeOpinion">{0}</textarea>',
	myPlanRegPopup: '<input type="text" placeholder="제목" style="width:100%;" id="planTitle"><textarea class="ta-myplan" style="width:99%;margin-top:5px;" id="planDetail"></textarea>',
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
	getFormatDate: function(date) {
		try {
			var year = date.getFullYear();                                
			var month = (1 + date.getMonth());                     

			month = month >= 10 ? month : '0' + month;     
			var day = date.getDate();                      
			day = day >= 10 ? day : '0' + day;             

			return  year + '-' + month + '-' + day;
		}
		catch(e) {
			throw e;
		}
	},
	ajax: function(cfg) {
		var dataType = cfg.dataType || 'json';
		
		$.ajax(cfg.url, {
			method: cfg.method || 'POST',
			dataType: dataType,
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
					case '1010':
					case '1011':
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
				if(dataType == 'json') {
					var json = $.parseJSON(jqXHR.responseText);
					if(json.success) {
						cfg.success(json, textStatus, jqXHR); 
					}
					else {
						jqXHR.errCode = json.errCode;
						jqXHR.errMsg = json.errMsg;
						jqXHR.data = json.datas;
					}
				}
				else if(dataType == 'html') {
					if(textStatus == 'success') {
						cfg.success(data, textStatus, jqXHR); 
					}
				}
			
			},
			error: function(jqXHR, textStatus, err) {
				setTimeout(function() {
					Common.makeErrMsg('오류가 발생했습니다.(' + jqXHR.status + ')');
				}, 1);
				
			
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
			$('#btnPopupEtc').hide();
			$('#btnPopupCancel').text('확인');
			$('#btnPopupCancel').show();
		}
		else if(type == 'offwork') {
			$('#btnPopupOk').text('퇴근처리');
			$('#btnPopupOk').show();
			$('#btnPopupEtc').hide();
			$('#btnPopupCancel').text('닫기');
			$('#btnPopupCancel').show();
		}
		else if(type == 'reg_plan') {
			$('#btnPopupOk').text('일정등록');
			$('#btnPopupOk').show();
			$('#btnPopupEtc').hide();
			$('#btnPopupCancel').text('닫기');
			$('#btnPopupCancel').show();
		}
		else if(type == 'mod_add_plan') {
			$('#btnPopupOk').text('추가등록');
			$('#btnPopupOk').show();
			$('#btnPopupEtc').hide();
			$('#btnPopupCancel').text('닫기');
			$('#btnPopupCancel').show();
		}
		else if(type == 'mod_add_del_plan') {
			$('#btnPopupOk').text('추가등록');
			$('#btnPopupOk').show();
			$('#btnPopupEtc').show();
			$('#btnPopupEtc').text('삭제');
			$('#btnPopupCancel').text('닫기');
			$('#btnPopupCancel').show();
		}
		else if(type == 'del_plan') {
			$('#btnPopupOk').text('삭제');
			$('#btnPopupOk').show();
			$('#btnPopupEtc').hide();
			$('#btnPopupCancel').text('취소');
			$('#btnPopupCancel').show();
		}
		else if(type == 'commit_gyeoljae') {
			$('#btnPopupOk').text('결재');
			$('#btnPopupOk').show();
			$('#btnPopupEtc').hide();
			$('#btnPopupCancel').text('닫기');
			$('#btnPopupCancel').show();
		}
		else if(type == 'reject_gyeoljae') {
			$('#btnPopupOk').text('반려');
			$('#btnPopupOk').show();
			$('#btnPopupEtc').hide();
			$('#btnPopupCancel').text('닫기');
			$('#btnPopupCancel').show();
		}
		/*else if(type == 'app') {
			$('#btnPopupOk').hide();
			$('#btnPopupEtc').hide();
			$('#btnPopupCancel').hide();
		}*/
		
		Common.popupClose = afterFn;
		$('#popupDialog').popup('open');
		$.scrollLock(true);
	},
	closePopup: function() {
		$('#popupDialog').popup('close');
	},
	makeErrMsg: function(errMsg, fn) {
		Common.makePopup('', errMsg);
		Common.openPopup('alert', fn);
	},
	makeResultMsg: function(msg, fn) {
		Common.makePopup('', msg);
		Common.openPopup('alert', fn);
	},
	makePopupOkHandler: function(fn) {
		$('#btnPopupOk')
		.off('click')
		.on('click', fn);
	},
	makePopupEtcHandler: function(fn) {
		$('#btnPopupEtc')
		.off('click')
		.on('click', fn);
	},
	dateAdd: function(date, add) {
		var copiedDate = new Date(date.getTime());
		copiedDate.setDate(copiedDate.getDate() + add);
		return Common.getFormatDate(copiedDate);
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

String.format = function() {
	var s = arguments[0];
	for(var i = 0; i < arguments.length - 1; i++) {       
		var reg = new RegExp("\\{" + i + "\\}", "gm");             
		s = s.replace(reg, arguments[i + 1]);
	}

	return s;
}

$(document)
.off('change', '#selOverworkType')
.on('change', '#selOverworkType', function() {
	var v = $(this).val();
	var $txtOutworkContent = $('#txtOutworkContent');
	var $chkStartSix = $('#chkStartFrom6');
	
	if(v == '0') {
		$txtOutworkContent.val('');
		$txtOutworkContent.prop('disabled', true);
		$chkStartSix.prop('disabled', true);
		$chkStartSix.prop('checked', false);
	}
	else {
		$txtOutworkContent.prop('disabled', false);
		$chkStartSix.prop('disabled', false);
	}
});

$(document)
.off('pageinit')
.on('pageinit', function (event) {
	$('body>[data-role="panel"]').panel();
	
	var overworkTypes = $('#overworkTypes').val();
	var html = '<form><div style="width:256px;"><h4>업무내용: </h4><textarea style="width:100%; height:40px;" id="txtWorkContent"></textarea>';
	//html += '<h4>야근유형: </h4><select id="selOverworkType">' + overworkTypes + '</select>';
	html += '<select id="selOverworkType">' + overworkTypes + '</select> <input type="checkbox" id="chkStartFrom6" disabled>6시부터';
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
	
	function movePageAfterSessionCheck(param) {
		if(param) {
			if(typeof param === 'function') {
				Common.checkSession(param);
			}
			else if(typeof param === 'string') {
				Common.checkSession(function() {
					$.mobile.loading('show', {
					    theme: 'a'
					});
					window.location.href = param;
				});
			}
		}
	}
	
	function offworkHandler() {
		var $txtWorkContent = $('#txtWorkContent');
		var $txtOutworkContent = $('#txtOutworkContent');
		var $selOverworkType = $('#selOverworkType');
		var $chkStartFrom6 = $('#chkStartFrom6');
		
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
				overworkType: $selOverworkType.val(),
				startFrom6: $chkStartFrom6.prop('checked') ? 'Y' : 'N'
			}),
			headers: {'CUSTOM': 'Y'},
			contentType: 'application/json',
			success: function(data, textStatus, jqXHR) {
				alert(data.datas[0] + ' - '+ data.datas[1] + '에 퇴근처리 되었습니다.');
				//$('#btnOffwork').addClass('ui-disabled');
				window.location.reload();
			},
		});
		
	}
	
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
				//$('#btnOffwork').removeClass('ui-disabled');
				window.location.reload();
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
			Common.makePopupOkHandler(offworkHandler);
			Common.makePopup('', Common.offworkPopup);
			Common.openPopup('offwork');
		});
	});
	
	$(document)
	.off('click', '#btnChangeInOut')
	.on('click', '#btnChangeInOut', function() {
		var $this = $(this);
		var inout = $this.data('out');
		var geuntaeCode = $this.data('geuntae');
		var seatNum = $this.data('seatNum');
		
		//외근전환
		if(inout == 'N') {
			movePageAfterSessionCheck(function() {
				Common.ajax({
					url: '/geuntae/m/change/inwork/' + geuntaeCode + '?seatNum=' + seatNum,
	    	    	method: 'GET',
	    			dataType: 'json',
	    			headers: {'CUSTOM': 'Y'},
	    			success: function(data, textStatus, jqXHR) {
	    				if(data.success) {
	    					alert('외근전환 되었습니다.')
	    					window.location.reload();
	    				}
	    			},
	    		});
			});
		}
		else if(inout == 'Y') {
			movePageAfterSessionCheck(function() {
				Common.ajax({
					url: '/geuntae/m/change/outwork/' + geuntaeCode + '?seatNum=' + seatNum,
	    	    	method: 'GET',
	    			dataType: 'json',
	    			headers: {'CUSTOM': 'Y'},
	    			success: function(data, textStatus, jqXHR) {
	    				if(data.success) {
	    					alert('내근전환 되었습니다.')
	    					window.location.reload();
	    				}
	    			},
	    		});
			});
			
		}
	});
	
	
	
//	$(document)
//	.off('click', '#btnPopupOk')
//	.on('click', '#btnPopupOk', Common.popupOkHandler/*function() {
//		var $txtWorkContent = $('#txtWorkContent');
//		var $txtOutworkContent = $('#txtOutworkContent');
//		var $selOverworkType = $('#selOverworkType');
//		
//		var workContent = $.trim($txtWorkContent.val());
//		if(workContent == '') {
//			$txtWorkContent.focus(); 
//			
//			return;
//		}
//	
//		Common.ajax({
//			url: '/geuntae/m/offwork',
//			method: 'POST',
//			dataType: 'json',
//			data: JSON.stringify({
//				workContent: workContent,
//				outworkContent: $.trim($txtOutworkContent.val()),
//				overworkType: $selOverworkType.val()
//			}),
//			headers: {'CUSTOM': 'Y'},
//			contentType: 'application/json',
//			success: function(data, textStatus, jqXHR) {
//				alert(data.datas[0] + ' - '+ data.datas[1] + '에 퇴근처리 되었습니다.');
//				$('#btnOffwork').addClass('ui-disabled');
//			},
//		});
//		
//		
//	}*/);
	
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
		movePageAfterSessionCheck('/m/main');
	});
	
	$(document)
	.off('click', '#footerInfo')
	.on('click', '#footerInfo', function(e) {
		movePageAfterSessionCheck('/m/info');
	});
	
	//일정관리
	$(document)
	.off('click', '#lnkViewPlan')
	.on('click', '#lnkViewPlan', function() {
		movePageAfterSessionCheck('/calendar/m/view/plan');
	});
	
	//
	$(document)
	.off('click', '#lnkViewReceivedBox')
	.on('click', '#lnkViewReceivedBox', function() {
		movePageAfterSessionCheck('/gyeoljae/m/view/receivedbox');
	});
	
	
	
});

$(document).on('pageshow', function (event, ui) {
	$('#popupDialog').popup({history: false});
	var $dvUseInfo = $('#dvUseInfo');
	var $dvGeuntae = $('#dvGeuntae');
	var $dvCalendarPlan = $('#dvCalendarPlan'); //일정관리
	var $dvGyeoljaeReceivedBox = $('#dvGyeoljaeReceivedBox'); //결재
	var $mygyeoljaeCount = $('#mygyeoljaeCount');
	var $spMyGyeoljaeCount = $('#spMyGyeoljaeCount');
	
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
		
		//$spMyGyeoljaeCount.text($('#mygyeoljaeCount').val());
	}
	
	if($dvUseInfo.get(0)) {
		var swiper = new Swiper('.swiper-container', {
    		pagination: {
    			el: '.swiper-pagination',
    	    },
    	});
    	
		$dvUseInfo.height(Common.getFullHeight());
	}
	
	if($dvCalendarPlan.get(0)) {
		Common.viewCalendarPlan();
	}
	
	if($dvGyeoljaeReceivedBox.get(0)) {
		Common.viewMyGyeoljaeList();
	}
});

$(document).on('pageremove', function (event, ui) {
	console.log('pageremove')
});

$(document).on('pagebeforeshow', function() {
    
	//메뉴에서 중복로그인 발생시
	if(!$.mobile.activePage.attr('id')) {
    	alert('세션만료나 중복로그인 되었습니다.');
    	window.location.href = '/m/main';
    }
});

$(document).on('popupafterclose', "[data-role=popup]", function (e) {
	if(e.target.id == 'popupDialog') {
		if(Common.popupClose) {
			Common.popupClose();
			Common.popupClose = null;
		}
	}
		
	$.scrollLock(false);
	
	
    //console.log(e.target.id + " -> " + e.type);
});

$(document).on('pagebeforechange', function(e, data) {
	console.log('====================pagebeforechange====================')
});
