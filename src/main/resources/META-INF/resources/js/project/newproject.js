$(document).ready(function() {
	
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
	    	left: 'promptResource today prev,next',
	        center: 'title',
	        right: 'timelineDay,timelineTenDay,timelineMonth,timelineYear'
	    },
	    customButtons: {
	    	promptResource: {
	    		text: '+ Task',
	    		click: function() {
	    			parent.Ext.Msg.prompt('', 'Task를 입력하세요', function(btn, txt) {
	    				if(btn == 'ok') {
	    					$('#calendar').fullCalendar('addResource', { title: txt }, true /* scroll to the new resource?*/ );
	    				}
	    			});
	    		}
	        }
	    },
	    defaultView: 'timelineDay',
	    views: {
	    	timelineDay: {
	    		buttonText: ':30분 간격',
	    		slotDuration: '00:30'
	        },
	        timelineTenDay: {
	           	type: 'timeline',
	           	duration: { days: 7 }
	        }
	    },
	    resourceLabelText: 'Tasks',
	    resourceRender: function(resource, cellEls) {
	    	cellEls.on('click', function() {
		   		common.showExtMsg({
		   			type: 'confirm',
		   			msg: '항목 [' + resource.title + ']을 삭제하시겠습니까?',
		   			callback: function(btn) {
		   				if(btn == 'ok') {
		   					$('#calendar').fullCalendar('removeResource', resource);  
		   				}
		   			}
		   		});
	    	});
	    },
	    resources: [
	        { id: 'a', title: 'Auditorium A' },
	        { id: 'b', title: 'Auditorium B', eventColor: 'green' },
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
	        { id: 'h', title: 'Auditorium H' },
	    ],
	    events: [
	        { id: '1', resourceId: 'b', start: '2018-04-07T02:00:00', end: '2018-04-07T07:00:00', title: 'event 1' },
	        { id: '2', resourceId: 'c', start: '2018-04-07T05:00:00', end: '2018-04-07T22:00:00', title: 'event 2' },
	        { id: '3', resourceId: 'd', start: '2018-04-06', end: '2018-04-08', title: 'event 3' },
	        { id: '4', resourceId: 'e', start: '2018-04-07T03:00:00', end: '2018-04-07T08:00:00', title: 'event 4' },
	        { id: '5', resourceId: 'f', start: '2018-04-07T00:30:00', end: '2018-04-07T02:30:00', title: 'event 5' }
	    ],
	    drop: function(date, jsEvent, ui, resourceId) {
	    	console.log('drop', date.format(), resourceId);
	    	// is the "remove after drop" checkbox checked?
	    	if ($('#drop-remove').is(':checked')) {
	    		// if so, remove the element from the "Draggable Events" list
	    		$(this).remove();
	    	}
	    },
	    eventReceive: function(event) { // called when a proper external event is dropped
	    	console.log('eventReceive', event);
	    },
	    eventDrop: function(event) { // called when an event (already on the calendar) is moved
	        console.log('eventDrop', event);
	    }
	});
});