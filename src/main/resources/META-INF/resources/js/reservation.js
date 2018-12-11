$(function() {
	var eventSources = {
		'default': {
			events:[],
			color: 'red',
			textColor: 'black'
		}
	};
	
	var delEvents = [];
	var calId = '#reservation';
	
//	var socket = new SockJS('/websocket'),
//		stompClient = Stomp.over(socket);
//	
//	stompClient.connect({}, function(frame) {
//	    hasConntected = true;
//	    //displayWebSocketConnectionStatus(true, hasConntected);
//	 
//	    stompClient.send('/app/authorization', {}, JSON.stringify({
//	        'key': 'csrfToken',
//	        'value': $('#_csrfToken').val()
//	    }));
//	 
//	    stompClient.subscribe('/message/authentication', function(message){
//	       var m = $.parseJSON(message.body);
//	       console.log(m)
//	    });
//	 
//
//	}, function(error) {
//	   console.log(error)
//	});
	
	
	
	function initEventSources() {
		eventSources = {};
		delEvents.length = 0;
		$(calId).fullCalendar('removeEventSources');
		
		
		eventSources['default'] = {
			events: [],
			color: 'blue',
			textColor: 'white'
		} 
	}
	
	function getData() {
		eventSources['default'].events = [{
			title: 'E-Biz팀 회의',
			start: '2018-12-07T13:00',
			end: '2018-12-07T14:30',
			reserver: '남기훈'
		}];
		
		$(calId).fullCalendar('removeEventSource', eventSources['default']);
		$(calId).fullCalendar('addEventSource', eventSources['default']);
		
//		common.ajaxExt({
//    		url: '/calendar/load?startDate=' + calMStart + '&endDate=' + calMEnd + '&cate=' + category,
//    		method: 'GET',
//    		loadmask: {
//    			msg: '정보로딩중...'
//    		},
//			success: function(jo) {
//				//console.log(jo);
//				if(jo.success) {
//					if(jo.datas.length > 0) {
//						var events = jo.datas[0];
//						
//						for(var k in events) {
//							eventSources[k].events = events[k];
//							$('#calendar').fullCalendar('removeEventSource', eventSources[k]);
//							$('#calendar').fullCalendar('addEventSource', eventSources[k]);
//						}
//					}
//				}
//			}
//    	});
	}
	
	$(calId).fullCalendar({
		height: 'auto',
		defaultView: 'agendaDay',
		minTime: '08:00:00',
		maxTime: '20:00:00',
		viewRender: function(view) {
   		 	initEventSources();
   		 	getData();
		},
		eventRender: function(event, element) {
			element.find('.fc-title').remove();
			element.find('.fc-time').remove();
			
			//시간이 1시간 이하면 한줄로
			var sStart = moment(event.start).format('HH:mm');
			var sEnd = moment(event.end).format("HH:mm");
			var diff = parseInt(sEnd.replace(':', '')) - parseInt(sStart.replace(':', ''));
			var new_description = '';
			
			if(diff >= 130) {
				new_description = '회의시간 : ' 
				+ sStart + ' - ' + sEnd + '<br/>'
			    + '회의제목: ' + event.title + '<br/>'
				+ '예약자: ' +  event.reserver + '<br/>';
			}
			else {
				new_description = '(' + sStart + ' - ' + sEnd + ') '
				+ event.title + ' (예약자: ' + event.reserver + ')';
			}

			element.append(new_description);
	     }
	});
	
	window.getCurrentDate = function() {
		return $(calId).fullCalendar('getDate').format().substring(0, 10);
	}
	
	window.addEvent = function(event) {
		$(calId).fullCalendar('removeEventSource', eventSources['default']);
		
		eventSources['default'].events.push(event);
		$(calId).fullCalendar('addEventSource', eventSources['default']);
	}
});