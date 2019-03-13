(function(c) {
	var dEvents = [];
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
	    								end: end
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
	    					alert('일정을 로드하지 못했습니다.')
	    				}
	    				
	    			},
	    		});
	    	}
	    	else {
	    		var events = $calendarPlan.data('jqm-calendar').settings.events;
		    	var s = '';
		    	var h = '<span style="padding-left:15px;">' + c.getFormatDate(date) + ' 일정</span>';
		    	var len = events.length;
		    	for(var i=0; i<len; i++) {
		    		if(events[i].begin.getFullYear() == date.getFullYear() && // same year?
		    	       events[i].begin.getMonth() == date.getMonth() &&        // same month?
		    	       events[i].begin.getDate() == date.getDate() ) {        // same date?
		    	          
		    		   s = events[i].summary.replace(/<br\/>/gmi, '\n');
		    		   hasData = true;
		    		   break;
		    	    }
		    	}
		    	
		    	//$('#calendarPlan ul').html('<li class='ui-li-static ui-body-inherit ui-first-child ui-last-child'>test<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt<br/>trtrt</li>')
		    	$('#calendarPlan ul').html('');
		    	
		    	console.log(event);
		    	
		    	if(hasData) {
		    	 	c.makePopup(h, String.format(Common.myPlanPopup, s));
					c.openPopup('alert');
		    	}
		   
	    	}
	    });
	    
	    c.ajax({
	    	url: '/calendar/m/getMyPlan/',
	    	method: 'GET',
			dataType: 'json',
			headers: {'CUSTOM': 'Y'},
			success: function(data, textStatus, jqXHR) {
				console.log(data)
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
								end: end
							});
						}
					}
					
					$calendarPlan.trigger('refresh');
					
				}
				else {
					alert('일정을 로드하지 못했습니다.')
				}
			},
	    });
	}
}(Common));

