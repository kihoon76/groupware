$(document).ready(function() {
	var idx = 1;
	var categoryMonth = null; //$('body').data('date').substring(0, 7);
	var category = $('#selCate').val();
	var calMStart = null;
	var calMEnd = null;
	var isModified = false;
	var mineBgColor = $('#mineBgColor').val();
	var mineTxtColor = $('#mineTxtColor').val();
	var prefix = $('#prefix').val();
	var map = null;
	
	var eventSources = {
//		team1: {
//			events:[],
//			color: 'red',
//			textColor: 'black'
//		},
//		team2: {
//			events:[],
//			color: 'green',
//			textColor: 'yellow'
//		},
//		team3: {
//			events:[],
//			color: 'blue',
//			textColor: 'white'
//		}
	}
	
	var delEvents = [];
	
	function makeSaveParam() {
		var param = null;
		if(delEvents.length > 0) {
			param = eventSources[category].events.concat(delEvents);
		}
		else {
			param = eventSources[category].events;
		}
		
		console.log(param)
		return param;
		//return eventSources.team1.events.concat(eventSources.team2.events, eventSources.team3.events);
		
	}
	
	function createEventId() {
		var id = 'ev-' + idx;
		idx++;
		
		return id;
	}
	
	function getGeuntaeDetail(event) {
		common.ajaxExt({
    		url: '/geuntae/detail/' + event.id,
    		method: 'GET',
    		loadmask: {
    			msg: '정보로딩중...'
    		},
			success: function(jo) {
				//console.log(jo);
				if(jo.success) {
					if(jo.datas.length > 0) {
						var details = jo.datas[0];
						openGeuntaeWin(event, details);
					}
				}
			}
    	});
	}
	
	function updateGeuntae(geuntaeCode, details) {
		
	}
	
	function viewPositionAtMap() {
		if(map == null) {
			var panel = parent.Ext.create('Drpnd.view.panel.NMapPanel');
			
			map = parent.Ext.create('Ext.window.Window', {
				title: '외근위치',
				height: 500, 
				width: 500,
				layout: 'fit',
				modal: true,
				resizable: false,
				closeAction: 'hide',
				items: [panel]
			});
		}
		
		map.show();
		
	}
	
	function openGeuntaeWin(event, details) {
		var buttons = [];
		
		if(event.mine == 'Y') {
			buttons.push({
				text: '수정',
				iconCls: 'icon-modi',
			    handler: function() {
			    	updateGeuntae(event.id, details);
		        }
			});
		}
		
		buttons.push({
			text: '닫기',
			iconCls: 'icon-close',
		    handler: function() {
		    	win.close();
	        }
		});
		
		
		var	win = parent.Ext.create('Ext.window.Window', {
			title: event.start.format() + ' (' + details.sawonName + ')',
			height: 500, 
			width: 500,
			layout: 'fit',
			modal: true,
			resizable: false,
			closeAction: 'destroy',
			items: [{
				xtype: 'form',
				bodyStyle  : 'padding: 10px;',
		        margins    : '0 0 0 3',
		        fieldDefaults: {
		            msgTarget: 'side',
		            labelWidth: 85,
		            anchor: '100%'
		        },
		        defaultType: 'textfield',
		        items: [{
		        	fieldLabel: '팀명',
		            value: details.teamName,
		            readOnly: true
		        }, {
		        	fieldLabel: '팀장',
		            value: details.teamLeader,
		            readOnly: true
		        }, {
		        	fieldLabel: '이름',
		            value: details.sawonName,
		            readOnly: true
		        }, {
		        	fieldLabel: '출퇴근 시간',
		            value: details.gotowork + ' ~ ' + details.offwork,
		            readOnly: true
		        }, {
		        	fieldLabel: '업무내용',
		        	xtype: 'textarea',
		        	height: 100,
		            value: details.content,
		            readOnly: true
		        }, {
		        	fieldLabel: '야근내용',
		        	xtype: 'textarea',
		        	height: 100,
		            value: details.overworkContent,
		            readOnly: true
		        }, {
		        	fieldLabel: '외근',
		            value: details.outwork == 'Y' ? '예' : '아니오',
		            readOnly: true
		        }, {
		        	xtype: 'button',
		            margin: '0 0 5 90',
		            text: '출근위치보기',
		            listeners: {
		            	click: function() {
		            		viewPositionAtMap();
		            	}
		            }
		        }, {
		        	fieldLabel: '근태처리수단',
		            value: details.gotoworkMethod == 'P' ? 'PC' : '모바일',
		            readOnly: true
		        }],
			}],
			buttons: buttons,
			listeners: {
				afterrender: function(w) {
					
				}
			}
		});
		
		win.show();
	}
	
	$('#calendar').fullCalendar({
		 customButtons: {
			 cPrev: {
				 icon:'left-single-arrow',
				 click: function() {
					 if(isModified) {
						 common.showExtMsg({
							 type: 'confirm',
							 msg: '변경사항을 저장하시겠습니까?',
							 callback: function(btn) {
							     if(btn == 'ok') {
							    	 save(function() {
										 $('#calendar').fullCalendar('getCalendar').prev();
									 }); 
							     }
							 }
						 });
					 }
					 else {
						 $('#calendar').fullCalendar('getCalendar').prev(); 
					 }
				 }
			 },
			 cNext: {
				 icon:'right-single-arrow',
				 click: function() {
					 if(isModified) {
						 common.showExtMsg({
							 type: 'confirm',
							 msg: '변경사항을 저장하시겠습니까?',
							 callback: function(btn) {
							     if(btn == 'ok') {
							    	 save(function() {
										 $('#calendar').fullCalendar('getCalendar').next();
									 }); 
							     }
							 }
						 });
					 }
					 else {
						 $('#calendar').fullCalendar('getCalendar').next(); 
					 }
				 } 
			 },
			 cSave: {
				 text: '저장',
				 click: function() {
					 common.showExtMsg({
						 type: 'confirm',
						 msg: '저장하시겠습니까?',
						 callback: function(btn) {
						     if(btn == 'ok') {
						    	
						    	save(function() {
						    		common.showExtMsg({
										msg: '저장되었습니다.',
										type: 'alert',
										callback: function() {
											initView();
										} 
									});
						    	});
						     }
						 }
					 });
				 } 
			 }
		 },
		 header: {
			 left: 'cPrev,cNext today',
		     center: 'title',
		     right: 'cSave'//'month,basicWeek,basicDay'
		 },
		 height: 'auto',
		 defaultDate: $('body').data('date'),
		 navLinks: true, // can click day/week names to navigate views
	     editable: false,
	     selectable: true,
	     eventLimit: true, // allow "more" link when too many events
	     dayClick: function(date, jsEvent, view) {
	    	 console.log('dayClick');
	     },
	     eventClick: function(calEvent, jsEvent, view) {
	    	 console.log(calEvent.end.format());
	    	 
	    	 common.checkSession(function() {
	    		 if(calEvent.cate == 'C01') {
		    		 console.log(calEvent.id);
		    		 getGeuntaeDetail(calEvent);
		    	 }
		    	 else if(calEvent.cate == 'C02'){
		    		 if(calEvent.editable) {
			    		 var sDate = calEvent.start.format();
				    	 var eDate = calEvent.end.format();
				    	 var title = calEvent.title;
				    	 var time = '';
				    	 //OOO(test)_title
				    	 var sIdx = title.indexOf('_');
			    		 title = title.substring(sIdx + 1);
				    		 
			    		 common.showExtWin({
			    			 mode: 'update',
				    		 start: sDate,
				    		 end: eDate,
				    		 cate: category,
				    		 title: title,
				    		 description: calEvent.description,
				    		 time: time,
			    			 modify: function(win, winData) {
			    				 var title = prefix + '_' + winData.title;
			    				 calEvent.title = title;
			    				 calEvent.description = winData.desc;
				    			
			    				 $('#calendar').fullCalendar('updateEvent', calEvent);
			    				 modifyEvent(calEvent);
				    			 win.close(); 
			    			 },
			    			 del: function(win) {
			    				 if(calEvent.isDb) {
			    					 delEvents.push({
			    	    				 id: calEvent.id,
			    	    				 isDelete: true
			    					 }); 
			    					 
			    					 isModified = true;
			    				 }
			    				 
			    				 deleteEvent(calEvent); 
			    				 win.close();
			    			 }
			    		 });
			    	 } 
		    	 } 
	    	 });
	     },
	     eventDrop: function(event, delta, revertFunc) {
	    	 /*var prev = event.start._i.substring(0, 7);
	    	 var cur = event.start.format().substring(0, 7);
	    	 
	    	 if(prev != cur) {
	    		 revertFunc(); 
	    	 }
	    	 else {
	    		 $('#calendar').fullCalendar('updateEvent', event);
		    	 
		    	 modifyEvent(event);
		    	 console.log(eventSources ); 
	    	 }*/
	    	 $('#calendar').fullCalendar('updateEvent', event);
	    	 modifyEvent(event);
	     },
	     eventResize: function(event, delta, revertFunc) {
	    	 $('#calendar').fullCalendar('updateEvent', event);
	    	 modifyEvent(event);
	     },
	     navLinkDayClick: function(date, jsEvent) {
	    	 console.log('yyyyy')
	     },
	     viewRender: function(view) {
	    	calMStart = view.start.format();
	    	calMEnd = view.end.format();
	    	
	    	categoryMonth = $('#calendar').fullCalendar('getDate').format().substring(0, 7);
   		 	initEventSources();
   		 	getData();
	     },
	     select: function(start, end, jsEvent) {
	    	 
	    	 if(category == 'C01') return;
	    	 var sDate = start.format();
	    	 var eDate = end.format();
	    	 //var eDate = end.add(-1, 'days').format();
	    	 
	    	 common.checkSession(function() {
	    		 common.showExtWin({
		    		 //x: jsEvent.pageX,
		    		 //y: jsEvent.pageY,
		    		 //type: 
		    		 mode: 'insert',
		    		 start: sDate,
		    		 end: eDate,
		    		 cate: category,
		    		 add: function(win, winData) {
		    			 console.log(winData);
		    			 var title = (category == 'C1') ? winData.title + '(' + winData.time + ')' : prefix + '_' + winData.title;
		    			 
		    			 var event = {
		    				 title: title,
		    				 id: createEventId(),
		    				 start: sDate,
		    				 end: eDate,
		    				 cate: category,
		    				 cateMonth: categoryMonth,
		    				 editable: true,
		    				 isNew: true,
		    				 description: winData.desc
		    			 }
		    			
		    			 addEvent(event);
		    			 win.close();
		    		 }
		    	 }); 
	    	 });
	     },
	     eventRender: function(event, element) {
	    	 element.attr('title', event.description)
	    	 element.tooltip({
	    		 classes: {
	    			 'ui-tooltip': 'highlight'
	    		 }
	    	 });
	     }
	});
	
	$('#selCate').selectmenu({
		width: '150',
		select: function(event, ui) {
			category = ui.item.value;
			
			common.checkSession(function() {
				window.location.href = '/calendar/view?dftCate=' + category;
			});
	
		},
		
	});
	
	function save(successFn) {
		common.ajaxExt({
    		url: '/calendar/save',
    		headers: { 'Content-Type': 'application/json' }, 
			jsonData: makeSaveParam(),
			success: function(jo) {
				isModified = false;
				if(successFn) successFn();
			}
    	});
	}
	
	function initView() {
		window.location.href = '/calendar/view?dftCate=' + category;
	}
	
	function initEventSources() {
		var json = $('#selCate').data('cate');
		var len = json.length;
		
		eventSources = {};
		delEvents.length = 0;
		$('#calendar').fullCalendar('removeEventSources');
		
		if(len > 0) {
			var cate;
			for(var i=0; i<len; i++) {
				cate = json[i];
				eventSources[cate.code] = {
					events: [],
					color: cate.color,
					textColor: cate.textColor
				} 
			}
			
			//
		}
	}
	
	function getData() {
		common.ajaxExt({
    		url: '/calendar/load?startDate=' + calMStart + '&endDate=' + calMEnd + '&cate=' + category,
    		method: 'GET',
    		loadmask: {
    			msg: '정보로딩중...'
    		},
			success: function(jo) {
				//console.log(jo);
				if(jo.success) {
					if(jo.datas.length > 0) {
						var events = jo.datas[0];
						
						for(var k in events) {
							eventSources[k].events = events[k];
							$('#calendar').fullCalendar('removeEventSource', eventSources[k]);
							$('#calendar').fullCalendar('addEventSource', eventSources[k]);
						}
					}
				}
			}
    	});
	}
	
	function addEvent(event) {
		var teamId = event.cate;
		event.backgroundColor = mineBgColor;
		event.textColor = mineTxtColor;
		$('#calendar').fullCalendar('removeEventSource', eventSources[teamId]);
		
		eventSources[teamId].events.push(event);
		$('#calendar').fullCalendar('addEventSource', eventSources[teamId]);
//		if(!eventSource) return;
//		
//		eventSource.eventDefs.push(event);
//		$('#calendar').fullCalendar('renderEvent', event);
//		
		
		isModified = true;
		console.log($('#calendar').fullCalendar('getEventSources'));

	}
	
	function modifyEvent(event) {
		var changeStartDate = event.start.format();
		var changeEndDate = event.end.format();
		
		console.log(event)
		var id = event.id;
		var cate = event.cate;
		
		var eventArr = eventSources[cate].events;
		var len = eventArr.length;
		
		for(var i=0; i< len; i++) {
			if(eventArr[i].id == id) {
				eventArr[i].start = changeStartDate;
				eventArr[i].end = changeEndDate;
				eventArr[i].title = event.title;
				eventArr[i].description = event.description;
				
				if(!eventArr[i].isNew) {
					eventArr[i].isModify = true;
					isModified = true;
				}
				
				break;
			}
		}
	}
	
	function deleteEvent(event) {
		var id = event.id;
		var cate = event.cate;
		
		var eventArr = eventSources[cate].events;
		var len = eventArr.length;
		
		$('#calendar').fullCalendar('removeEventSource', eventSources[cate]);
		for(var i=0; i< len; i++) {
			if(eventArr[i].id == id) {
				eventArr.splice(i, 1);
				break;
			}
		}
		
		$('#calendar').fullCalendar('addEventSource', eventSources[cate]);
	}
	
	//받은 날짜값을 date 형태로 형변환 해주어야 한다.
//	function convertDate(date) {
//	    var date = new Date(date);
//	    return date.yyyymmdd();
//	}
//
//	Date.prototype.yyyymmdd = function() {
//        var yyyy = this.getFullYear().toString();
//        var mm = (this.getMonth() + 1).toString();
//        var dd = this.getDate().toString();
//        return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);
//    }
});