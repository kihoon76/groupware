$(document).ready(function() {
	var taskContextMenu = null;
	var resourceIdCnt = 1;
	var eventIdCnt = 1;
	var resources = [
        {id: 'a', title: 'Task 1'},
        /*{ id: 'b', title: 'Auditorium B', eventColor: 'green' },
        { id: 'c', title: 'Auditorium C', eventColor: 'orange' },
        { id: 'd', title: 'Auditorium D', 
        	children: [
                { id: 'd1', title: 'Room D1' },
                { id: 'd2', title: 'Room D2' }
            ]
        },
        { id: 'e', title: 'Auditorium E' },
        { id: 'f', title: 'Auditorium F', eventColor: 'red' },
        { id: 'g', title: 'Auditorium G' },
        { id: 'h', title: 'Auditorium H' },*/
    ];
	
	var events = [ { id: '1', resourceId: 'a', start: '2018-04-07', end: '2018-04-08', title: '' },
	   	        { id: '2', resourceId: 'a', start: '2018-04-09', end: '2018-04-10', title: '' },];
	
	
	function searchEvent(searchId, callback) {
		var len = events.length;
		if(len > 0) {
			for(var i=0; i<len; i++) {
				if(events[i].id == searchId) {
					callback(i);
					break;
				}
			}
		}
	}
	
	
	function modifyResource(id, title) {
		commonSearchResources(id, function(item, i) {
			item.title = title;
		}, function(arr, i) {
			arr[i].title = title;
		});
	}
	
	function commonSearchResources(searchId, callback, recursiveCallback, finalCallback) {
		var rLen = resources.length;
		var r = null;
		var modified = false;
		for(var i=0; i<rLen; i++) {
			r = resources[i];
			if(r.id == searchId) {
				callback(r, i);				
				
				modified = true;
				break;
			}
			else if(r.children && r.children.length > 0) {
				if(recursive(searchId, r.children, recursiveCallback)) {
					modified = true;
					break;
				}
			}
		}
		
		if(modified) {
			if(finalCallback) finalCallback(r, i);
			$('#calendar').fullCalendar('refetchResources');
		}
	}
	
	
	function addResource(parentId, currentId, newId, upDown, title) {
		if(parentId) {
			commonSearchResources(parentId, function(item, i) {
				if(resources[i].children) {
					resources[i].children.push({id: newId, title: title});
				}
				else {
					resources[i].children = [{id: newId, title: title}];
				}
			}, function(arr, i) {
				if(arr[i].children) {
					arr[i].children.push({id: newId, title: title});
				}
				else {
					arr[i].children = [{id: newId, title: title}];
				}
			});
		}
		else {
			commonSearchResources(currentId, function(item, i) {
				if(upDown == 'up') {
					resources.splice(i, 0, {id: newId, title: title});
				}
				else if(upDown == 'down') {
					resources.splice(i+1, 0, {id: newId, title: title});
				}
			}, function(arr, i) {
				if(upDown == 'up') {
					arr.splice(i, 0, {id: newId, title: title});
				}
				else if(upDown == 'down') {
					arr.splice(i+1, 0, {id: newId, title: title});
				}
			});
		}
	}
	
	function removeResource(id) {
		if(resources.length == 1) return;
		
		commonSearchResources(id, function(item, i) {
			resources.splice(i, 1);
		}, function(arr, i) {
			arr.splice(i, 1);
		});
	}
	
	function recursive(searchId, itemArr, callback) {
		if(itemArr) {
			var len = itemArr.length;
			var r = null;
			for(var i=0; i<len; i++) {
				r = itemArr[i];
				if(searchId == r.id) {
					callback(itemArr, i);
					return true;
				}
				else if(r.children && r.children.length > 0) {
					if(recursive(searchId, r.children, callback)) return true;
				}
			}
		}
		
		return false;
	}
	
	function moveUp(currentId) {
		commonSearchResources(currentId, function(item, i) {
			resources.splice(i, 1);
		}, function(arr, i) {
			if(i>0) {
				var item = arr[i];
				arr.splice(i, 1);
				arr.splice(i-1, 0, item);
			}
		}, function(item, i) {
			resources.splice(i-1, 0, item);
		});
	}
	
	function moveDown(currentId) {
		commonSearchResources(currentId, function(item, i) {
			resources.splice(i, 1);
		}, function(arr, i) {
			if(i<arr.length-1) {
				var item = arr[i];
				arr.splice(i, 1);
				arr.splice(i+1, 0, item);
			}
		}, function(item, i) {
			resources.splice(i+1, 0, item);
		});
	}
	
	function eventReceive(resourceId, start, end) {
		var id = 'e' + (++eventIdCnt);
		events.push({
			id: id,
			resourceId: resourceId,
			title: ' ',
			start: start,
			end: end
			
		});
		
		return id;
	}
	
	$.contextMenu({
        selector: '.fc-cell-content', 
        callback: function(key, options) {
            switch(key) {
            case 'delete':
            	common.showExtMsg({
		   			type: 'confirm',
		   			msg: '항목 [' + taskContextMenu.title + ']을 삭제하시겠습니까?',
		   			callback: function(btn) {
		   				if(btn == 'ok') {
		   					removeResource(taskContextMenu.id);
		   				}
		   			}
		   		});
            	break;
            case 'add_sub':
            	parent.Ext.Msg.prompt('', taskContextMenu.title + '의 하위 Task를 입력하세요', function(btn, txt) {
    				if(btn == 'ok') {
    					//$('#calendar').fullCalendar('addResource', { parentId:taskContextMenu.id, title: txt }, true /* scroll to the new resource?*/ );
    					var newId = 'r' + (++resourceIdCnt);
    					addResource(taskContextMenu.id, null, newId, null, txt);
    				}
    			});
            	break;
            case 'edit' :
            	parent.Ext.Msg.prompt('', 'Task를 입력하세요', function(btn, txt) {
    				if(btn == 'ok') {
    					//$('#calendar').fullCalendar('addResource', { parentId:taskContextMenu.id, title: txt }, true /* scroll to the new resource?*/ );
    					if(taskContextMenu.title != txt) {
    						modifyResource(taskContextMenu.id, txt);
    					}
    				}
    			}, null, null, taskContextMenu.title);
            	break;
            case 'add_up':
            	parent.Ext.Msg.prompt('', 'Task를 입력하세요', function(btn, txt) {
    				if(btn == 'ok') {
    					var newId = 'r' + (++resourceIdCnt);
    					addResource(null, taskContextMenu.id, newId, 'up', txt);
    				}
    			});
            	break;
            case 'add_down':
            	parent.Ext.Msg.prompt('', 'Task를 입력하세요', function(btn, txt) {
    				if(btn == 'ok') {
    					var newId = 'r' + (++resourceIdCnt);
    					addResource(null, taskContextMenu.id, newId, 'down', txt);
    				}
    			});
            	break;
            case 'moveup':
            	moveUp(taskContextMenu.id);
            	break;
            case 'movedown':
            	moveDown(taskContextMenu.id);
            	break;
            }
           
            
            console.log();
        },
        items: {
            'edit': {name: '수정', icon: 'fa-edit'},
            'add_up': {name: '위에 추가', icon: 'add'},
            'add_down': {name: '아래에 추가', icon: 'add'},
            'add_sub': {name: '하위메뉴로 추가', icon: 'add'},
            'moveup': {name: '위로 옮기기', icon: 'fa-arrow-circle-up'},
            'movedown': {name: '아래로 옮기기', icon: 'fa-arrow-circle-down'},
            'delete': {name: '삭제', icon: 'fa-trash'},
            'sep1': '---------',
            'quit': {name: '닫기', icon: function(){
                return 'context-menu-icon context-menu-icon-quit';
            }}
        }
    });
	
	$('#external-events .fc-event').each(function() {
		// store data so the calendar knows to render an event upon drop
	    $(this).data('event', {
	    	title: $.trim($(this).text()), // use the element's text as the event title
	        stick: true // maintain when user navigates (see docs on the renderEvent method)
	    });

	    // make the event draggable using jQuery UI
	    $(this).draggable({
	    	zIndex: 999,
	        revert: true,      // will cause the event to go back to its
	        revertDuration: 0  //  original position after the drag
	    });
	});
	
	$('#calendar').fullCalendar({
		schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
		customButtons: {
			save: {
				text: '저장',
				click: function() {
					var events = $('#calendar').fullCalendar('getEventSources');
					console.log(events[0].rawEventDefs);
					
				}
			}
		},
		now: '2018-04-07',
	    editable: true,
	    droppable: true, // this allows things to be dropped onto the calendar
	    aspectRatio: 1.8,
	    scrollTime: '00:00',
	    header: {
	    	//left: 'promptResource today prev,next',
	    	left: 'today prev,next save',
	        center: 'title',
	        //right: 'timelineDay,timelineTenDay,timelineMonth,timelineYear'
	        right: 'timelineMonth,timelineYear'
	    },
	    /*customButtons: {
	    	promptResource: {
	    		text: '+ Task',
	    		click: function() {
	    			parent.Ext.Msg.prompt('', 'Task를 입력하세요', function(btn, txt) {
	    				if(btn == 'ok') {
	    					$('#calendar').fullCalendar('addResource', { title: txt }, true  scroll to the new resource? );
	    				}
	    			});
	    		}
	        }
	    },*/
	    defaultView: 'timelineYear',
	    /*views: {
	    	timelineDay: {
	    		buttonText: ':30분 간격',
	    		slotDuration: '00:30'
	        },
	        timelineTenDay: {
	           	type: 'timeline',
	           	duration: { days: 7 }
	        }
	    },*/
	    resourceLabelText: 'Tasks',
	    resourceRender: function(resource, cellEls) {
	    	/*cellEls.on('click', function() {
		   		common.showExtMsg({
		   			type: 'confirm',
		   			msg: '항목 [' + resource.title + ']을 삭제하시겠습니까?',
		   			callback: function(btn) {
		   				if(btn == 'ok') {
		   					$('#calendar').fullCalendar('removeResource', resource);  
		   				}
		   			}
		   		});
	    	});*/
	    	$(cellEls).contextmenu(function() {
	    		taskContextMenu = resource;
	    	})
	    },
	    resources: resources,
	    events: events/*[
	        { id: '1', resourceId: 'b', start: '2018-04-07T02:00:00', end: '2018-04-07T07:00:00', title: 'event 1' },
	        { id: '2', resourceId: 'c', start: '2018-04-07T05:00:00', end: '2018-04-07T22:00:00', title: 'event 2' },
	        { id: '3', resourceId: 'd', start: '2018-04-06', end: '2018-04-08', title: 'event 3' },
	        { id: '4', resourceId: 'e', start: '2018-04-07T03:00:00', end: '2018-04-07T08:00:00', title: 'event 4' },
	        { id: '5', resourceId: 'f', start: '2018-04-07T00:30:00', end: '2018-04-07T02:30:00', title: 'event 5' }
	    ]*/,
	    drop: function(date, jsEvent, ui, resourceId) {
	    	console.log('drop', date.format(), resourceId);
	    	console.log(this)
	    },
	    eventOverlap: false,
	    eventReceive: function(event) { // called when a proper external event is dropped
	    	console.log('eventReceive', event.resourceId);
	    	console.log('eventReceive', event.start.format());
	    	var id = eventReceive(event.resourceId, event.start.format(), null);
	    	event.id = id;
	    	$('#calendar').fullCalendar('updateEvent', event);  
	    },
	    eventDrop: function(event) { // called when an event (already on the calendar) is moved
	        console.log('eventDrop', event);
	        $('#calendar').fullCalendar('updateEvent', event);
	    },
	    eventClick: function(calEvent, jsEvent, view) {
	    	console.log(calEvent.id);
	    	console.log(calEvent.resourceId);
	    	
	    	commonSearchResources(calEvent.resourceId, function(item, i) {
		    	common.showExtMsg({
		   			type: 'confirm',
		   			msg: '[' + item.title + ']의 일정을 삭제하시겠습니까?',
		   			callback: function(btn) {
		   				if(btn == 'ok') {
		   					searchEvent(calEvent.id, function(i) {
		   						events.splice(i, 1);
		   						$('#calendar').fullCalendar('removeEvents', calEvent.id);
		   					});
		   				}
		   			}
		   		});
			}, function(arr, i) {
				common.showExtMsg({
		   			type: 'confirm',
		   			msg: '[' + arr[i].title + ']의 일정을 삭제하시겠습니까?',
		   			callback: function(btn) {
		   				if(btn == 'ok') {
		   					searchEvent(calEvent.id, function(i) {
		   						events.splice(i, 1);
		   						$('#calendar').fullCalendar('removeEvents', calEvent.id);
		   					});   
		   				}
		   			}
		   		});
			});
	    },
	    eventResize: function(event, delta, revertFunc) {
	    	console.log(event.end.format())
	    	var end = event.end.format();
	    	//event.end = end;
	    	console.log(event)
	    	 $('#calendar').fullCalendar('updateEvent', event);
	     },
	});
});