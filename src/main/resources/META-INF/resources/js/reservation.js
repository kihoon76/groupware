$(function() {
	var eventSources = null;
	var calId = '#reservation';
	var TimeObj = {
		title: null,
		startTime: null,
		endTime: null,
		ymd: ''
	};
	
	var timeModifyWin = null;
	
	function initEventSources() {
		eventSources = {};
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
	
	function modify(rnum) {
		var title = $.trim(TimeObj.title.getValue());
		var startTime = $.trim(TimeObj.startTime.getRawValue());
		var endTime = $.trim(TimeObj.endTime.getRawValue());
		
		if(title == '') {
			TimeObj.title.markInvalid('제목을 입력하세요');
			return;
		}
		
		if(startTime == '') {
			TimeObj.startTime.markInvalid('시작시간을 선택하세요');
			return;
		}
		
		if(endTime == '') {
			TimeObj.endTime.markInvalid('종료시간을 선택하세요');
			return;
		}
		
		if(parseInt(endTime.replace(':', '')) - parseInt(startTime.replace(':', '')) <= 0) {
			TimeObj.startTime.markInvalid('시작시간은 종료시간보다 빨라야 합니다.');
			return;
		}
		
		common.ajaxExt({
			url: '/calendar/conference/mod/reservation',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }, 
			jsonData: {
				title: title,
				startTime: startTime,
				endTime: endTime,
				ymd: getCurrentDate(),
				rnum: rnum 
			},
			loadmask: {
				msg: '수정중 입니다.'
			},
			success: function(jo) {
				var data = jo.datas[0];
				modEvent({
					title: data.title,
					start: data.ymd + 'T' + data.startTime,
					end: data.ymd + 'T' + data.endTime,
					reserver: data.reserver,
					mine: data.mine,
					rnum: data.rnum
				});
				
				timeModifyWin.close();
				
			}
		});
	}
	
	function deleteReservation(rnum) {
		common.ajaxExt({
			url: '/calendar/conference/del/reservation?rnum=' + rnum + '&ymd=' + getCurrentDate(),
			method: 'GET',
			loadmask: {
				msg: '삭제중 입니다.'
			},
			success: function(jo) {
				delEvent(rnum);
				timeModifyWin.close();
			}
		});
	}
	
	function modifyConferenceTime(event) {
		var rnum = event.rnum;
		timeModifyWin = parent.Ext.create('Ext.window.Window', {
			title: '시간설정(' + getCurrentDate() + ')',
			iconCls: 'icon-timer',
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
			        { xtype: 'button', text: '수정', iconCls: 'icon-modi', listeners: {
			        	click: function() {
			        		modify(rnum);
			        	}
			        } },
			        { xtype: 'button', text: '삭제', iconCls: 'icon-del', listeners: {
			        	click: function() {
			        		deleteReservation(rnum);
			        	}
			        } },
			        { xtype: 'button', text: '닫기', iconCls: 'icon-close', listeners: {
			        	click: function(btn) {
			        		timeModifyWin.close();
			        	}
			        } }
			    ]
			}]  
		});
		
		timeModifyWin.show();
	}
	
	function delEvent(rnum) {
		$(calId).fullCalendar('removeEvents', function(evt) {
			return evt.rnum == rnum;
		});
		
	
		var events = eventSources['default'].events;
		var b = false;
		
		var defaultEventsLen = events.length;
		if(defaultEventsLen) {
			for(var i=0; i<defaultEventsLen; i++) {
				if(events[i].rnum == rnum) {
					events.splice(i, 1);
					b = true;
					break;
				}
			}
		}
		
		if(b == true) return;
		
		events = eventSources['mine'].events;
		defaultEventsLen = events.length;
		
		if(defaultEventsLen) {
			for(var i=0; i<defaultEventsLen; i++) {
				if(events[i].rnum == rnum) {
					events.splice(i, 1);
					break;
				}
			}
		}
	
	}
	
	window.getCurrentDate = getCurrentDate;
	
	window.addEvent = function(event, key) {
		$(calId).fullCalendar('removeEventSource', eventSources[key]);
		
		eventSources[key].events.push(event);
		$(calId).fullCalendar('addEventSource', eventSources[key]);
	}
	
	window.delEvent = delEvent;
	
	window.modEvent = function(event) {
		var item = $(calId).fullCalendar('clientEvents', function(evt) {
			return evt.rnum == event.rnum;
		});
		
		item[0].title = event.title;
		item[0].start = event.start;
		item[0].end = event.end;
		
		$(calId).fullCalendar('updateEvent', item[0]);
	}
});