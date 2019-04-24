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
	var myToken = $('#_csrfToken').val();
	//var map = null;
	
	var eventSources = {}
	var delEvents = [];
	var eventElement = {};
	
	
	
	var Socket = parent.Ext.create('Drpnd.custom.Socket', {
		socketUrl: '/websocket',
		subscribe: [{
			url: '/message/geuntae/modify',
			callback: function(message, mBody) {
				var startDate = parseInt(mBody.startDate);
				var calMStartNum = parseInt(calMStart.replace(/-/g, ''));
				var calMEndNum = parseInt(calMEnd.replace(/-/g, ''));
				
				//근태현황 같은달을 보고 있으면
				if(category == 'C01' && startDate >= calMStartNum && startDate < calMEndNum) {
					
					var id = mBody.geuntaeCode;
					var eventArr = eventSources[category].events;
					var len = eventArr.length;
					
					for(var i=0; i< len; i++) {
						if(eventArr[i].id == id) {
							eventArr[i].description = mBody.content;
							eventElement['k' + id].attr('title', mBody.content);
							break;
						}
					}
	
				}
				
			}
		}]
	});
	
	Socket.connect();
	
	
	function makeSaveParam() {
		var param = null;
		if(delEvents.length > 0) {
			param = eventSources[category].events.concat(delEvents);
		}
		else {
			param = eventSources[category].events;
		}
		
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
	
	function getPlanDetail(event) {
		//console.log(event)
		var nameIdx = event.title.indexOf('_');
		var name = event.title.substring(0, nameIdx);
		openPlanDetailWin(name, event.description);
	}
	
	function updateGeuntae(geuntaeCode, modifyObj, details, win) {
		var vContent = '';
		var vOverworkContent = '';
		var vStartFrom6 = modifyObj.chkOverworkSix.getValue() ? 'Y' : 'N';
		
		if(modifyObj.oContent) {
			vContent = $.trim(modifyObj.oContent.getValue());
			
			if(vContent == '') {
				modifyObj.oContent.markInvalid('업무내용을 입력하세요');
				return;
			}
		}
		
		if(modifyObj.oOverworkContent) {
			vOverworkContent = $.trim(modifyObj.oOverworkContent.getValue());
		}
		else {
			vOverworkContent = details.overworkContent;
		}
		
		common.ajaxExt({
    		url: '/geuntae/modify',
    		headers: { 'Content-Type': 'application/json' }, 
			jsonData: {
				geuntaeCode: geuntaeCode,
				content: vContent,
				overworkContent: vOverworkContent,
				startDate: details.gotowork.substring(0, 10),
				startFrom6: vStartFrom6
			},
			success: function(jo) {
				console.log(jo);
				if(jo.success) {
					common.showExtMsg({
						msg: '수정되었습니다.',
						type: 'alert',
						icon: parent.Ext.MessageBox.INFO,
						callback: function() {
							win.close();
						}
					});
				}
				else {
					comon.showExtMsg({
						msg: jo.errMsg,
						type: 'alert'
					});
				}
			}
    	});
	}
	
	function viewPositionAtMap(details) {
		var map = null;
		
		try {
			var panel = parent.Ext.create('Drpnd.view.panel.NMapPanel', {
				lat: details.lat,
				lng: details.lng
			});
				
			map = parent.Ext.create('Ext.window.Window', {
				title: '출근위치',
				iconCls: 'icon-position',
				height: 500, 
				width: 500,
				layout: 'fit',
				modal: true,
				resizable: false,
				closeAction: 'destroy',
				items: [panel]
			});
			
			map.show();
		}
		catch(e) {
			map.close();
			
			common.showExtMsg({
				type: 'alert',
				msg: '맵이 로드되지 않았습니다. 브라우저를 새로고침 해 주세요'
			});
		}
		
	}
	
	function openPlanDetailWin(title, content) {
		console.log(content)
		var	win = parent.Ext.create('Ext.window.Window', {
			title: '<span style="color:#0000ff">' + title + '</span>님 일정',
			iconCls: 'icon-calendar',
			height: 500, 
			width: 500,
			layout: 'fit',
			modal: true,
			resizable: false,
			closeAction: 'destroy',
			items: [{
				xtype: 'textarea',
				anchor: '100%',
				//height: 400,
				readOnly: true,
				value: content
			}],
			buttons: [{
				text: '닫기',
				iconCls: 'icon-close',
			    handler: function() {
			    	win.close();
		        }
			}],
		});
		
		win.show();
	}
	
	function openGeuntaeWin(event, details) {
		var buttons = [];
		var modifyObj = {oContent: null, oOverworkContent: null, chkOverworkSix: null};
		
		if(event.mine == 'Y') {
			buttons.push({
				text: '수정',
				iconCls: 'icon-modi',
			    handler: function() {
			    	updateGeuntae(event.id, modifyObj, details, win);
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
			iconCls: 'icon-calendar',
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
		            readOnly: event.mine == 'Y' ? false : true,
		            listeners: {
		            	afterrender: function(txtArea) {
		            		modifyObj.oContent = txtArea;
		            	}
		            }
		        }, {
		        	fieldLabel: '야근시작시간',
		        	xtype: 'checkbox',
		        	boxLabel: '6시부터(선택안하면 7시부터 적용)',
		        	checked: details.startFrom6 == 'Y' ? true : false,
		        	listeners: {
		        		afterrender: function(chk) {
		        			modifyObj.chkOverworkSix = chk;
		        		}
		        	}
		        }, {
		        	fieldLabel: '야근내용',
		        	xtype: 'textarea',
		        	height: 100,
		            value: details.overworkContent,
		            readOnly: event.mine == 'Y' ? false : true,
		            listeners: {
		            	afterrender: function(txtArea) {
		            		modifyObj.oOverworkContent = txtArea;
		            	}
		            }
		        }, {
		        	fieldLabel: '외근',
		            value: details.outwork == 'Y' ? '예' : '아니오',
		            readOnly: true
		        }/*, {
		        	xtype: 'button',
		            margin: '0 0 5 90',
		            text: '출근위치보기',
		            iconCls: 'icon-position',
		            listeners: {
		            	click: function() {
		            		viewPositionAtMap(details);
		            	}
		            }
		        }*/, {
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
	
	var calendar = $('#calendar').fullCalendar({
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
			 left: 'cPrevYear,cPrev,cNext cSave today',
		     center: 'title',
		     right: ''//'month,basicWeek,basicDay'
		 },
		 height: 'auto',
		 defaultDate: $('body').data('date'),
		 navLinks: true, // can click day/week names to navigate views
	     editable: false,
	     selectable: true,
	     eventLimit: false,//true, // allow "more" link when too many events
	     dayClick: function(date, jsEvent, view) {
	    	 //console.log('dayClick');
	     },
	     eventClick: function(calEvent, jsEvent, view) {
	    	 //console.log(calEvent.end.format());
	    	 
	    	 common.checkSession(function() {
	    		 if(calEvent.cate == 'C01') {
		    		 getGeuntaeDetail(calEvent);
		    	 }
		    	 else if(calEvent.cate == 'C02' || calEvent.cate == 'C03'){
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
		    		 else if(calEvent.cate == 'C03') {
		    			 getPlanDetail(calEvent);
		    		 }
		    		 else if(calEvent.cate == 'C02') {
		    			 //getVacationDetail(calEvent); 
		    		 }
		    	 } 
	    	 });
	     },
	     eventDrop: function(event, delta, revertFunc) {
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
	    	 var eDate1 = null;
	    	 //일정관리는 하루만 선택가능
	    	 if(category == 'C03') {
	    		 eDate1 = end.add(-1, 'days').format();
	    		 if(eDate1 != sDate){
	    	          calendar.fullCalendar('unselect');
	    	          common.showExtMsg({
	    	        	  type: 'alert',
	    	        	  msg: '일정은 하루단위로 추가 가능합니다.'
	    	          });
	    	          return;
	    	      }
	    	 }
	    	 
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
	    	 //console.log(element);
	    	 var id = event.id;
	    	 eventElement['k' + id] = element;
	    	 
	    	 element.attr('title', event.description);
	    	 element.tooltip({
	    		 classes: {
	    			 'ui-tooltip': 'highlight'
	    		 }
	    	 });
	    	 
	    	 if(event.confirm == 'Y') {
	    		 element.find('div.fc-content').prepend('<img src="/resources/images/stamp.png" width="16px" height="16px">'); 
	    	 }
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
		eventElement = {};
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
		event.borderColor = mineBgColor;
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