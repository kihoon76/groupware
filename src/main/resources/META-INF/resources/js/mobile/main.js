var Common = { 
	socket: null,
	worker: null,
	popupClose: function() {},
	useCacheReserPop: true,
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
			    
				if(jqXHR.errCode) {
					var msg = '';
					var fn = null;
					
					switch(jqXHR.errCode) {
					case '100': 
						msg = '세션만료됨';
						fn = function() {
							window.location.href = '/signin'
						};
						break;
					case '600': 
						msg = '미반납된 도서가 있습니다<br/>[' + jqXHR.data[0].bookName + ']';
						break;
					case '601': 
						msg = '[' + jqXHR.data[0].rentalMan + ']님에게 대여중입니다.<br/>' + '대여일자 [' + jqXHR.data[0].rentalDate + ']';
						break;
					case '1002': 
						msg = jqXHR.errMsg;
						break;
					default: 
						msg = '오류가 발생했습니다.';
						break;
					}
					
					alert(msg);
					if(fn) fn();
					
				}
				else {
					//성공 이후 final로 실행할 함수
					if(jqXHR.runFinal) {
						setTimeout(jqXHR.runFinal, 500);
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
				
			}
		});
	}
};

$(document)
.off('pageinit')
.on('pageinit', function () {
	$('body>[data-role="panel"]').panel();
	//$('#bookReservePopup').hide();
	
	var baseUrl = $('body').data('url');
	
	(function callWorker() {
		if(window.Worker) {
			if(Common.worker) {
				Common.worker.terminate();
			}
			
			Common.worker = new Worker('http://localhost/resources/js/mobile/worker.js');
			
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
		
	})();
	
	$(document)
	.off('click', '#btnGotowork')
	.on('click', '#btnGotowork', function() {
		var $this = $(this);
		Common.ajax({
			url: '/geuntae/m/gotowork',
			method: 'GET',
			dataType: 'json',
			headers: {'CUSTOM': 'Y'},
			success: function(data, textStatus, jqXHR) {
				alert(data.datas[0] + '에 출근처리 되었습니다.');
				$this.addClass('ui-disabled');
				$('#btnOffwork').removeClass('ui-disabled');
			},
		});
	});
	
	$(document)
	.off('click', '#btnOffwork')
	.on('click', '#btnOffwork', function() {
		var $this = $(this);
		Common.ajax({
			url: '/geuntae/m/offwork',
			method: 'POST',
			dataType: 'json',
			data: JSON.stringify({
				workContent: 'tt',
				outworkContent: 'tt'
			}),
			headers: {'CUSTOM': 'Y'},
			contentType: 'application/json',
			success: function(data, textStatus, jqXHR) {
				alert(data.datas[0] + ' - '+ data.datas[1] + ' 퇴근처리 되었습니다.');
				$this.addClass('ui-disabled');
			},
		});
		
		
	});
	
	$(document)
	.off('click', 'a.IMG_POPUP')
	.on('click', 'a.IMG_POPUP', function() {
		var $this = $(this);
		var $img = $this.find('img');
		var possible = $img.data('possible');
		var msg = '';
		
		$.scrollLock(true);
		if('R' == possible) {
			if('Y' == $img.data('mine')) {
				msg = '[' + $img.data('name') + '] 대여신청을 취소하시겠습니까? ';
				makePopup('', msg, [{key: 'bookNum', value: $img.data('num')}]);
				openPopup('apply_cancel');
			}
			else {
				msg = '[' + $img.data('name') + ']는 ' + $img.data('rentalMan') + '님이 대여요청중 입니다.';
				makePopup('', msg);
				openPopup('alert');
			}
		}
		else if('A' == possible) {
			msg = '[' + $img.data('name') + ']는 ' + $img.data('rentalMan') + '님이 대여중 입니다.';
			makePopup('', msg);
			openPopup('alert');
		}
		else {
			makePopup('', + $img.data('num') + '.' + '[' + $img.data('name') + ']를 대여신청 하시겠습니까?', [{key: 'bookNum', value: $img.data('num')}]);
			openPopup('rental_apply');
		}
		
		
	});
	
	$(document)
	.off('click', 'a.RENTAL_SELECT')
	.on('click', 'a.RENTAL_SELECT', function() {
		var $this = $(this);
		var status = $this.data('status');
		var cate = '';
		
		var msg = '';
		if(status == 'R') {
			msg = $this.data('rentalMan') + '님의 [' + $this.data('bookName') + '] 대여승인/삭제 하시겠습니까?';
			cate = 'rental_manage';
		}
		else if(status == 'A') {  //도서반납
			msg = $this.data('rentalMan') + '님의 [' + $this.data('bookName') + ']를 반납/연장 하시겠습니까?';
			cate = 'rental_manage_return';
		}
		
		makePopup('', msg, [
		  {key: 'rentalManIdx', value: $this.data('rentalManIdx')},
		  {key: 'bookNum', value: $this.data('bookNum')},
		  {key: 'memberName', value: $this.data('rentalMan')}
		  
		]);
		openPopup(cate);
//		if('R' == possible) {
//			msg = '[' + $img.data('name') + ']는 ' + $img.data('rentalMan') + '님이 대여요청중 입니다.';
//			makePopup('', msg);
//			openPopup('alert');
//		}
//		else if('A' == possible) {
//			msg = '[' + $img.data('name') + ']는 ' + $img.data('rentalMan') + '님이 대여중 입니다.';
//			makePopup('', msg);
//			openPopup('alert');
//		}
//		else {
//			makePopup('', + $img.data('num') + '.' + '[' + $img.data('name') + ']를 대여신청 하시겠습니까?', [{key: 'bookNum', value: $img.data('num')}]);
//			openPopup();
//		}
		
		
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
	.off('click', '#btnRegUser')
	.on('click', '#btnRegUser', function() {
		var $userId = $('#userId'),
			$userName = $('#userName'),
			$userPhone = $('#userPhone'),
			$userEmail = $('#userEmail');
		
		var userId = $.trim($userId.val());
		if(userId == '') {
			$userId.focus();
			return;
		}
		
		var userName = $.trim($userName.val());
		if(userName == '') {
			$userName.focus();
			return;
		}
		
		var userPhone = $.trim($userPhone.val());
		
		if(userPhone == '') {
			$userPhone.focus();
			return;
		}
		
		if(!/^\d{3}-\d{3,4}-\d{4}$/gm.test(userPhone)) {
			$userPhone.val('');
			$userPhone.focus();
			return;
		}
		
		var userEmail = $.trim($userEmail.val());
		
		if(userEmail == '') {
			$userEmail.focus();
			return;
		}
		
		if(!/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(userEmail)) {
			$userEmail.val('');
			$userEmail.focus();
			return;
		}
		
		
		Common.ajax({
			url: '/admin/reg/user',
			method: 'POST',
			dataType: 'json',
			headers: {'CUSTOM': 'Y'},
			contentType: 'application/json',
			data: JSON.stringify({
				userId: userId,
				userName: userName,
				userPhone: userPhone,
				userEmail: userEmail
			}),
			success: function(data, textStatus, jqXHR) {
				jqXHR.runFinal = function() {
					makePopup('', '사용자가 등록되었습니다.');
					openPopup('alert', function() {
						$userId.val('');
						$userName.val('');
						$userPhone.val('');
						$userEmail.val('');
					});
				}
			},
		});
	});
	
//	$(document)
//	.off('touchmove', 'html')
//	.on('touchmove', 'html', function (event) {
//	    //only run code if the user has two fingers touching
//	    if(event.originalEvent.touches.length === 2) {
//	    	event.preventDefault();
//	    	return false;
//	    }
//	});
	
	
	
	
	
	
	
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
    
    if($('#dvRentalHistory').get(0)) {
    	var myMemberIdx = $('#dvRentalHistory').data('memberIdx');
    	console.log(myMemberIdx);
    	Common.socket = new SockJS('/rental_book/list');
		
    	Common.socket.onopen = function(event) {
    		console.log(event)
    	}
    	
    	Common.socket.onmessage = function(event) {
    		try {
    			var data = $.parseJSON(event.data);
    			var selector = '#book' + data.bookNum + 'Rental';
    			if(data.type == 'R') {
    				//대여신청
    				if(data.memberIdx == myMemberIdx) {
    					$(selector).removeClass('apply').addClass('apply_mine');
    					$(selector + 'Image').data('mine', 'Y');
    				}
    				else {
    					$(selector).removeClass('apply_mine').addClass('apply');
    					$(selector + 'Image').data('mine', 'N');
    				}
    				
    				$(selector).text('신청');
    				$(selector + 'Man').text(data.memberName);
    				$(selector + 'Image').data('possible', 'R');
    				$(selector + 'Image').data('rentalMan', data.memberName);
    				
    			}
    			else if(data.type == 'A') {
    				$(selector).removeClass('apply apply_mine');
    				$(selector).addClass('norental');
    				$(selector).text('대여');
    				$(selector + 'Man').text(data.memberName);
    				$(selector + 'Image').data('possible', 'A');
    				$(selector + 'Image').data('rentalMan', data.memberName);
    			}
    			else if(data.type == 'T') { //반납
    				$(selector).removeClass('apply_mine apply norental');
    				$(selector).text('가능');
    				$(selector + 'Man').html('&nbsp;');
    				$(selector + 'Image').data('possible', 'Y');
    				$(selector + 'Image').data('rentalMan', null);
    			}
    			else if(data.type == 'D') {//대여신청 취소
    				$(selector).removeClass('apply_mine apply norental');
    				$(selector).text('가능');
    				$(selector + 'Man').html('&nbsp;');
    				$(selector + 'Image').data('possible', 'Y');
    				$(selector + 'Image').data('rentalMan', null);
    			}
    			
    			Common.useCacheReserPop = false;
    		}
    		catch(e) {
    			console.log(e)
    		}
			
		}
    }
    else if($('#dvSiteInfo').get(0)) {
    	
    	//$('#dvSiteInfo').height(Common.getFullHeight());
    	var swiper = new Swiper('.swiper-container', {
    		pagination: {
    			el: '.swiper-pagination',
    	    },
    	});
    	
    	$('#dvSiteInfo').height(Common.getFullHeight());
    }
    else if($('#dvStatistics').get(0)) {
    	var dataPoints = $('#dvStatisticsChart').data('points');
    	
    	Common.renderChart('dvStatisticsChart', {
    		title: '도서읽은 현황',
    		dataPoints: dataPoints
    	});
    }
});

$(document).on('pageremove', function (event, ui) {
	console.log('pageremove')
    if(Common.socket != null) {
    	 Common.socket.close();
    }
});

$(window).unload(function() {
	if(Common.socket != null) {
   	 Common.socket.close();
   }
});


$(document).on('popupafterclose', "[data-role=popup]", function (e) {
	if(e.target.id == 'popupDialog') {
		if(Common.popupClose) {
			Common.popupClose();
			Common.popupClose = null;
		}
	}
	else if(e.target.id == 'bookReservePopup') {
		$('#footerReservation').removeClass('ui-disabled');
		$('#footerReservation').data('disabled', false);
	}
	
	$.scrollLock(false);
	
	
    console.log(e.target.id + " -> " + e.type);
});



//$(document).on("panelbeforeopen", "div[data-role='panel']", function(e,ui) {
//    $.mobile.activeClickedLink = null;
//});