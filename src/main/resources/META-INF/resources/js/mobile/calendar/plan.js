(function(c) {
	var dEvents = [];
	var selPlanData = {cate: 'C03'};
	
	function addPlan() {
		c.closePopup();
		var h = '<span style="padding-left:15px;">' + selPlanData.begin + ' 일정</span>';
		c.makePopup(h, c.myPlanRegPopup);
		c.makePopupOkHandler(regPlan);
		c.openPopup('reg_plan');
	}
	
	function addDelPlan() {
		c.closePopup();
		var h = '<span style="padding-left:15px;">' + selPlanData.begin + ' 일정</span>';
		c.makePopup(h, '삭제하시겠습니까?');
		c.makePopupOkHandler(delPlan);
		c.openPopup('del_plan');
	}
	
	function delPlan() {
		if(selPlanData.num) {
			c.ajax({
    			url: '/calendar/m/removeMyPlan/' + selPlanData.num,
    	    	method: 'GET',
    			dataType: 'json',
    			headers: {'CUSTOM': 'Y'},
    			success: function(data, textStatus, jqXHR) {
    				if(data.success) {
    					window.location.reload();
    				}
    			},
    		});
			
		}
		else {
			c.closePopup();
		}
	}
	
	function regPlan() {
		var $planTitle = $('#planTitle');
		var $planDetail = $('#planDetail');
		var param = {
			title: $.trim($planTitle.val()),
			detail: $.trim($planDetail.val())
		};
		
		if(param.title == '') {
			$planTitle.focus();
			return;
		}
		
		if(param.detail == '') {
			$planDetail.focus();
			return;
		}
		
		
		param.cate = selPlanData.cate;
		param.cateMonth = selPlanData.cateMonth;
		param.begin = selPlanData.begin;
		param.end = selPlanData.end;
		
		c.ajax({	
			url: '/calendar/m/regMyPlan',
	    	method: 'POST',
			dataType: 'json',
			headers: {'CUSTOM': 'Y'},
			contentType: 'application/json',
			data: JSON.stringify(param),
			success: function(data, textStatus, jqXHR) {
				if(data.success) {
					setTimeout(function() {
						c.makeResultMsg('일정이 등록되었습니다.', function() {
							window.location.reload();	
						});
					}, 1);
				}
			}
		});

	}
	
	c.viewCalendarPlan = function() {
	    var $calendarPlan = $('#calendarPlan');
	    var currentYM = $calendarPlan.data('current').substring(0, 7);
	    
	    $calendarPlan.jqmCalendar({
	    	events: dEvents,
	        months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
	        days: ['일', '월', '화', '수', '목', '금', '토'],
	        startOfWeek: 0
	        
	    });
	    
	    $('#calendarPlan ul').html('');
	    
	    $calendarPlan.bind('change', function(event, date) {
	    	var selectdDateYM = c.getFormatDate(date).substring(0, 7);
	    	var hasData = false;
	    	//달이동
	    	if(currentYM != selectdDateYM) {
	    		currentYM = selectdDateYM;
	    		$('#calendarPlan ul').html('');
	    		if(c.popupClose) {
	    			c.popupClose();
	    			c.popupClose = null;
	    		}
	    		
	    		c.ajax({
	    			url: '/calendar/m/getMyPlan/' + selectdDateYM,
	    	    	method: 'GET',
	    			dataType: 'json',
	    			headers: {'CUSTOM': 'Y'},
	    			success: function(data, textStatus, jqXHR) {
	    				if(data.success) {
	    					var datas = data.datas;
	    					var len = datas.length;
	    					var end = null;
	    					if(len > 0) {
	    						for(var i=0; i<len; i++) {
	    							end = new Date(datas[i].end);
	    							end.setDate(end.getDate()-1);
	    							dEvents.push({
	    								summary: datas[i].summary,
	    								begin: new Date(datas[i].begin),
	    								end: end,
	    								num: datas[i].num,
	    								union: datas[i].union
	    							});
	    						}
	    					}
	    					
//	    					dEvents.push({
//								summary: 'Test event',
//								begin: new Date('2019-04-05'),
//								end: new Date('2019-04-05')
//							}); 
	    					// Trigger refresh
	    					$calendarPlan.trigger('refresh');
	    					
	    				}
	    				else {
	    					setTimeout(function() {
	    						Common.makeErrMsg('일정을 로드하지 못했습니다.');
	    					}, 1);
	    				}
	    				
	    			},
	    		});
	    	}
	    	else {
	    		var events = $calendarPlan.data('jqm-calendar').settings.events;
		    	var s = '';
		    	var h = '<span style="padding-left:15px;">' + c.getFormatDate(date) + ' 일정</span>';
		    	var len = events.length;
		    	var union = null;
		    	var num = null;
		    	
		    	for(var i=0; i<len; i++) {
		    		if(events[i].begin.getFullYear() == date.getFullYear() && // same year?
		    	       events[i].begin.getMonth() == date.getMonth() &&        // same month?
		    	       events[i].begin.getDate() == date.getDate() ) {        // same date?
		    	          
		    		   s = events[i].summary.replace(/<br\/>/gmi, '\n');
		    		   union = events[i].union;
		    		   hasData = true;
		    		   num = events[i].num;
		    		   break;
		    	    }
		    	}
		    	
		    	//$('#calendarPlan ul').html('<li class='ui-li-static ui-body-inherit ui-first-child ui-last-child'>test<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt</li>')
		    	$('#calendarPlan ul').html('');
		    	
		    	if(hasData) {
		    		selPlanData.cateMonth = selectdDateYM;
		    		selPlanData.begin = c.getFormatDate(date);
		    		selPlanData.end = c.dateAdd(date, 1);
		    		
		    	 	c.makePopup(h, String.format(c.myPlanPopup, s));
		    	 	c.makePopupOkHandler(addPlan);
		    	 	
		    	 	if(union == 'Y') {
						c.openPopup('mod_add_plan');
						selPlanData.num = null;
		    	 	}
		    	 	else {
		    	 		selPlanData.num = num;
		    	 		c.makePopupEtcHandler(addDelPlan);
						c.openPopup('mod_add_del_plan');
		    	 	}
		    	 	
		    	}
		    	else {
		    		selPlanData.cateMonth = selectdDateYM;
		    		selPlanData.begin = c.getFormatDate(date);
		    		selPlanData.end = c.dateAdd(date, 1);
		    		selPlanData.num = null;
		    		
		    		c.makePopup(h, Common.myPlanRegPopup);
		    		c.makePopupOkHandler(regPlan);
					c.openPopup('reg_plan');
		    	}
		   
	    	}
	    });
	    
	    c.ajax({
	    	url: '/calendar/m/getMyPlan/',
	    	method: 'GET',
			dataType: 'json',
			headers: {'CUSTOM': 'Y'},
			success: function(data, textStatus, jqXHR) {
				if(data.success) {
					var datas = data.datas;
					var len = datas.length;
					var end = null;
					if(len > 0) {
						for(var i=0; i<len; i++) {
							end = new Date(datas[i].end);
							end.setDate(end.getDate()-1);
							dEvents.push({
								summary: datas[i].summary,
								begin: new Date(datas[i].begin),
								end: end,
								num: datas[i].num,
								union: datas[i].union
							});
						}
					}
					
					$calendarPlan.trigger('refresh');
					
				}
			},
	    });
	}
}(Common));

