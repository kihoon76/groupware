$(document).ready(function() {
	var idx = 1;
	var categoryMonth = null; //$('body').data('date').substring(0, 7);
	var category = $('#selCate').val();
	var calMStart = null;
	var calMEnd = null;
	var isModified = false;
	
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
			 left: 'cPrev,cNext today cSave',
		     center: 'title',
		     right: 'month,basicWeek,basicDay'
		 },
		 height: 'auto',
		 defaultDate: $('body').data('date'),
		 navLinks: true, // can click day/week names to navigate views
	     editable: false,
	     selectable: true,
	     eventLimit: true, // allow "more" link when too many events
	     dayClick: function(date, jsEvent, view) {
	    	 /*console.log(common.getYmd(date._d));
	    	 //console.log($('#calendar').fullCalendar('getEventSources'));
	    	 
	    	 //var d = common.getYmd(date._d);
	    	 var d = date._d.yyyymmdd();
	    	 var cd = convertDate($('#calendar').fullCalendar('getDate')).substring(0, 7);
	    	 
	    	 if(d.substring(0, 7) != cd) return;
	    	 
	    	 common.showExtWin({
	    		 x: jsEvent.pageX,
	    		 y: jsEvent.pageY,
	    		 //type: 
	    		 d: d,
	    		 add: function(win, winData) {
	    			 console.log(winData);
	    			 
	    			 var event = {
	    				 title: winData.title + '(' + winData.time + ')',
	    				 id: createEventId(),
	    				 start: d,
	    				 cate: category,
	    				 cateMonth: categoryMonth,
	    				 editable: true,
	    				 isNew: true,
	    			 }
	    			
	    			 addEvent(event);
	    			 win.close();
	    		 }
	    	 });*/
	     },
	     eventClick: function(calEvent, jsEvent, view) {
	    	 console.log(calEvent.end.format());
	    	 
	    	 if(calEvent.editable) {
	    		 var sDate = calEvent.start.format();
		    	 var eDate = calEvent.end.format();
		    	 var title = calEvent.title;
		    	 var time = '';
		    	 
		    	 if(category == 'C1') {
		    		 var sIdx = title.indexOf('(');
		    		 var eIdx = title.indexOf(')');
		    		 title = title.substring(0, sIdx);
		    		 time = calEvent.title.substring(sIdx+1, eIdx);
		    		 console.log(time);
		    	 }
	    		
		    	 /*common.showExtMsg({
		    		 msg: '삭제하시겠습니까?',
		    		 type: 'confirm',
		    		 callback: function(btn) {
		    			 if(btn == 'ok') {
		    				 if(calEvent.isDb) {
		    					 delEvents.push({
		    	    				 id: calEvent.id,
		    	    				 isDelete: true
		    					 }); 
		    					 
		    					 isModified = true;
		    				 }
		    				 
		    				 deleteEvent(calEvent);
		    			 }
		    		 }
		    	 });*/
	    		 
	    		 common.showExtWin({
	    			 mode: 'update',
		    		 start: sDate,
		    		 end: eDate,
		    		 cate: category,
		    		 title: title,
		    		 description: calEvent.description,
		    		 time: time,
	    			 modify: function(win, winData) {
	    				 var title = (category == 'C1') ? winData.title + '(' + winData.time + ')' : winData.title;
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
	     viewRender: function(view) {
	    	calMStart = view.start.format();
	    	calMEnd = view.end.format();
	    	
	    	categoryMonth = $('#calendar').fullCalendar('getDate').format().substring(0, 7);
   		 	initEventSources();
   		 	getData();
	     },
	     select: function(start, end, jsEvent) {
	    	 var sDate = start.format();
	    	 var eDate = end.format();
	    	 //var eDate = end.add(-1, 'days').format();
	    	 
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
	    			 var title = (category == 'C1') ? winData.title + '(' + winData.time + ')' : winData.title;
	    			 
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
			window.location.href = '/calendar/view?dftCate=' + category;
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
				console.log(jo);
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