$(function() {
	var eventSources = null;
	
	var delEvents = [];
	var calId = '#reservation';
	var TimeObj = {
		title: null,
		startTime: null,
		endTime: null,
		ymd: ''
	};
	
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
		
		eventSources['mine'] = {
			events: [],
			color: 'red',
			textColor: 'white'
		} 
	}
	
	function reloadDefaultEventSource() {
		$(calId).fullCalendar('removeEventSource', eventSources['default']);
		$(calId).fullCalendar('removeEventSource', eventSources['mine']);
		$(calId).fullCalendar('addEventSource', eventSources['default']);
		$(calId).fullCalendar('addEventSource', eventSources['mine']);
	}
	
	function getCurrentDate() {
		return $(calId).fullCalendar('getDate').format().substring(0, 10);
	}
	
	function getData() {
		var cd = getCurrentDate();
		eventSources['default'].events = null;
		eventSources['mine'].events = null;
		common.ajaxExt({
    		url: '/calendar/conference/reservation/load?reserveDate=' + cd,
    		method: 'GET',
    		loadmask: {
    			msg: '(' + cd + ') 정보로딩중...'
    		},
			success: function(jo) {
				var events = jo.datas[0];
				if(events != null) {
					eventSources['default'].events = events['default'] || [];
					eventSources['mine'].events = events['mine'] || [];
					reloadDefaultEventSource();
				}
			}
    	});
		
		
		
//		eventSources['default'].events = [{
//			title: 'E-Biz팀 회의',
//			start: '2018-12-07T13:00',
//			end: '2018-12-07T14:30',
//			reserver: '남기훈'
//		}];
//		
//		$(calId).fullCalendar('removeEventSource', eventSources['default']);
//		$(calId).fullCalendar('addEventSource', eventSources['default']);
//		
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
		eventClick: function(event, jsEvent, view) {
			if(event.mine == 'Y') {
				modifyConferenceTime(event);
			}
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
	
	function modifyConferenceTime(event) {
		var rnum = event.rnum;
		var timeModifyWin = parent.Ext.create('Ext.window.Window', {
			title: '시간설정(' + getCurrentDate() + ')',
			height: 200,
			width: 400,
			layout: 'fit',
			closeAction: 'destroy',
			modal: true,
			items: [{
				xtype: 'form',
				bodyStyle  : 'padding: 10px;',
		        margins    : '0 0 0 0',
		        fieldDefaults: {
		            msgTarget: 'side',
		            labelWidth: 85,
		            anchor: '100%'
		        },
		        defaultType: 'textfield',
		        items: [{
		        	fieldLabel: '제목',
		        	value: event.title,
		        	listeners: {
		        		afterrender: function(txt) {
		        			TimeObj.title = txt;
		        		}
		        	}
		        },{
		        	fieldLabel: '시작시간',
		        	xtype: 'timefield',
		        	allowBlank: false,
		        	editable: false,
		            increment: 30,
		            format: 'H:i',
		            minValue: '08:00',
		            maxValue: '19:00',
		            listeners: {
		        		afterrender: function(time) {
		        			TimeObj.startTime = time;
		        			var t = event.start.format().split('T')[1].substring(0, 5);
		        			time.setRawValue(t);
		        		}
		        	}
				},{
		        	fieldLabel: '종료시간',
		        	xtype: 'timefield',
		        	allowBlank: false,
		        	editable: false,
		            increment: 30,
		            format: 'H:i',
		            minValue: '08:00',
		            maxValue: '19:00',
		            listeners: {
		        		afterrender: function(time) {
		        			TimeObj.endTime = time;
		        			var t = event.end.format().split('T')[1].substring(0, 5);
		        			time.setRawValue(t);
		        		}
		        	}
				}]
			}],
			dockedItems: [{
			    xtype: 'toolbar',
			    dock: 'bottom',
			    ui: 'footer',
			    //defaults: {minWidth: minButtonWidth},
			    items: [
			        { xtype: 'component', flex: 1 },
			        { xtype: 'button', text: '수정', listeners: {
			        	click: function() {
			        		
			        	}
			        } },
			        { xtype: 'button', text: '삭제', listeners: {
			        	click: function() {
			        		
			        	}
			        } },
			        { xtype: 'button', text: '닫기', listeners: {
			        	click: function(btn) {
			        		timeModifyWin.close();
			        	}
			        } }
			    ]
			}]  
		});
		
		timeModifyWin.show();
	}
	
	window.getCurrentDate = getCurrentDate;
	
	window.addEvent = function(event, key) {
		$(calId).fullCalendar('removeEventSource', eventSources[key]);
		
		eventSources[key].events.push(event);
		$(calId).fullCalendar('addEventSource', eventSources[key]);
	}
});