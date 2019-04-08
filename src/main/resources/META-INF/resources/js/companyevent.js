(function() {
	var mask;
	
	window.getCompanyEvents = function(eventId, startDate) {
		//console.log('listId==>' + listId);
		//mask.show();
		/*common.ajaxExt({
    		url: '/calendar/view/companyevent/' + eventId,
    		method: 'GET',
    		loadmask: {
    			msg: '정보로딩중...'
    		},
			success: function(jo) {
				//console.log(jo);
				if(jo.success) {
					
				}
			}
    	});*/
		$('#ceCalendar').fullCalendar('gotoDate', startDate);
		$('#ceCalendar').fullCalendar('select', startDate);
	}
	
	window.setObject = function(_mask) {
		mask = _mask;
	}
	
	$(document).ready(function() {
		var currentDate = $('#hdnCurrentDate').val();
		calendar = $('#ceCalendar').fullCalendar({
			 			
//			 header: {
//				 left: 'today',
//			     center: 'title',
//			     right: ''//'month,basicWeek,basicDay'
//			 },
			 height: 'auto',
			 defaultDate: currentDate,//$('body').data('date'),
			 navLinks: true, // can click day/week names to navigate views
		     editable: false,
		     selectable: true,
		     eventLimit: false,//true, // allow "more" link when too many events
		     dayClick: function(date, jsEvent, view) {
		    	 //console.log('dayClick');
		     },
		     eventClick: function(calEvent, jsEvent, view) {
		    	 //console.log(calEvent.end.format());
		    	 
		    	
		     },
		     eventDrop: function(event, delta, revertFunc) {
		    	 $('#ceCalendar').fullCalendar('updateEvent', event);
		     },
		     eventResize: function(event, delta, revertFunc) {
		    	 $('#ceCalendar').fullCalendar('updateEvent', event);
		     },
		     navLinkDayClick: function(date, jsEvent) {
		    	 console.log('yyyyy')
		     },
		     viewRender: function(view) {
		    	 mask.hide(); 
		     },
		     select: function(start, end, jsEvent) {
		    	 console.log('pp')
		    	 
		     },
		     eventRender: function(event, element) {
		    	 
		     }, 
		     dayRender: function(date, cell) {
		    	 //cell.append('<div class="unavailable">Unavailablefhfghfhfhfghfdhfghdfghdfghfdgh</div>'); 
		     }
		});
	});
}());

//dayRender: function(date, cell) {
//    cell.append('<div class="unavailable">Unavailable</div>');
//  },
//  eventAfterAllRender: function(view) {
//    var dayEvents = $('#calendar').fullCalendar('clientEvents', function(event) {
//      if (event.end) {
//        var dates = getDates(event.start, event.end);
//        $.each(dates, function(index, value) {
//          var td = $('td.fc-day[data-date="' + value + '"]');
//          td.find('div:first').remove();
//        });
//      } else {
//        var td = $('td.fc-day[data-date="' + event.start.format('YYYY-MM-DD') + '"]');
//        td.find('div:first').remove();
//      }
//    });
//  }
