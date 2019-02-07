$(document).ready(function() {
	var taskContextMenu = null;
	var resourceIdCnt = 1;
	var eventIdCnt = 1;
	var resources = [
        { id: 'a', title: 'Auditorium A' },
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
	
	var events = [];
	
	function modifyResource(id, title) {
		var rLen = resources.length;
		var r = null;
		var modified = false;
		for(var i=0; i<rLen; i++) {
			r = resources[i];
			if(r.id == id) {
				r.title = title;
				modified = true;
				break;
			}
		}
		
		if(modified) {
			$('#calendar').fullCalendar('refetchResources');
		}
	}
	
	function addResource(parentId, currentId, newId, upDown, title) {
		if(parentId) {
			
		}
		else {
			var rLen = resources.length;
			var r = null;
			var modified = false;
			for(var i=0; i<rLen; i++) {
				r = resources[i];
				if(r.id == currentId) {
					if(upDown == 'up') {
						resources.splice(i, 0, {id: newId, title: title});
					}
					else if(upDown == 'down') {
						resources.splice(i+1, 0, {id: newId, title: title});
					}
					
					
					modified = true;
					break;
				}
			}
			
			if(modified) {
				$('#calendar').fullCalendar('refetchResources');
			}
		}
	}
	
	function removeResource(id) {
		var rLen = resources.length;
		
		if(rLen == 1) return;
		var r = null;
		var modified = false;
		for(var i=0; i<rLen; i++) {
			r = resources[i];
			if(r.id == id) {
				resources.splice(i, 1);
				modified = true;
				break;
			}
		}
		
		if(modified) {
			$('#calendar').fullCalendar('refetchResources');
		}
	}
	
	function moveUp(currentId) {
		var rLen = resources.length;
		var r = null;
		var modified = false;
		var insertIdx = 0;
		
		for(var i=0; i<rLen; i++) {
			r = resources[i];
			if(r.id == currentId && i > 0) {
				resources.splice(i, 1);
				insertIdx = i-1;
				modified = true;
				break;
			}
		}
		
		if(modified) {
			resources.splice(insertIdx, 0, r);
			
			$('#calendar').fullCalendar('refetchResources');
		}
	}
	
	function moveDown(currentId) {
		var rLen = resources.length;
		var r = null;
		var modified = false;
		var insertIdx = 0;
		
		for(var i=0; i<rLen; i++) {
			r = resources[i];
			if(r.id == currentId && i != rLen-1) {
				resources.splice(i, 1);
				insertIdx = i+1;
				modified = true;
				break;
			}
		}
		
		if(modified) {
			resources.splice(insertIdx, 0, r);
			
			$('#calendar').fullCalendar('refetchResources');
		}
	}
	
	function eventReceived(resourceId, start, end) {
		events.push({
			id: 'e' + (++eventIdCnt),
			resourceId: resourceId,
			title: ' ',
			start: start,
			end: end
			
		});
	}
	
	$.contextMenu({
        selector: '.fc-cell-content', 
        callback: function(key, options) {
            var m = "clicked: " + key;
            console.log(m); 
            console.log(taskContextMenu.title);
            
            switch(key) {
            case 'delete':
            	common.showExtMsg({
		   			type: 'confirm',
		   			msg: '항목 [' + taskContextMenu.title + ']을 삭제하시겠습니까?',
		   			callback: function(btn) {
		   				if(btn == 'ok') {
		   					removeResource(taskContextMenu.id);
		   					//$('#calendar').fullCalendar('removeResource', taskContextMenu);  
		   				}
		   			}
		   		});
            	break;
            case 'add_sub':
            	parent.Ext.Msg.prompt('', taskContextMenu.title + '의 하위 Task를 입력하세요', function(btn, txt) {
    				if(btn == 'ok') {
    					$('#calendar').fullCalendar('addResource', { parentId:taskContextMenu.id, title: txt }, true /* scroll to the new resource?*/ );
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
            "edit": {name: "수정", icon: "edit"},
            "add_up": {name: "위에 추가", icon: "add"},
            "add_down": {name: "아래에 추가", icon: "add"},
            "add_sub": {name: "하위메뉴로 추가", icon: "add"},
           //copy: {name: "Copy", icon: "copy"},
            //"paste": {name: "Paste", icon: "paste"},
            "moveup": {name: "위로 옮기기", icon: "moveup"},
            "movedown": {name: "아래로 옮기기", icon: "movedown"},
            "delete": {name: "삭제", icon: "delete"},
            "sep1": "---------",
            "quit": {name: "닫기", icon: function(){
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
		now: '2018-04-07',
	    editable: true,
	    droppable: true, // this allows things to be dropped onto the calendar
	    aspectRatio: 1.8,
	    scrollTime: '00:00',
	    header: {
	    	//left: 'promptResource today prev,next',
	    	left: 'today prev,next',
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
	    	console.log(jsEvent);
	    	console.log('drop', date.format(), resourceId);
	    	// is the "remove after drop" checkbox checked?
	    	//if ($('#drop-remove').is(':checked')) {
	    		// if so, remove the element from the "Draggable Events" list
	    		//$(this).remove();
	    	//}
	    },
	    eventReceive: function(event) { // called when a proper external event is dropped
	    	console.log('eventReceive', event.resourceId);
	    	console.log('eventReceive', event.start.format());
	    	eventReceived(event.resourceId, event.start.format(), null);
	    },
	    eventDrop: function(event) { // called when an event (already on the calendar) is moved
	        console.log('eventDrop', event);
	    },
	    eventClick: function(calEvent, jsEvent, view) {
	    	console.log(calEvent.id);
	    	console.log(calEvent.resourceId);
	    	
//	    	common.showExtMsg({
//	   			type: 'confirm',
//	   			msg: '삭제하시겠습니까?',
//	   			callback: function(btn) {
//	   				if(btn == 'ok') {
//	   					$('#calendar').fullCalendar('removeResource', resource);  
//	   				}
//	   			}
//	   		});
	    }
	});
});