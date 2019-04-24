(function() {
	var mask, calMStart, calMEnd, categoryMonth;
	var eventSources = {};
	
	window.getCompanyEvents = function(eventId, startDate, endDate) {
		$('#ceCalendar').fullCalendar('gotoDate', startDate);
		$('#ceCalendar').fullCalendar('select', startDate, endDate);
	}
	
	window.setObject = function(_mask) {
		mask = _mask;
	}
	
	function initEventSources() {
		eventSources = {};
		$('#ceCalendar').fullCalendar('removeEventSources');
		
		eventSources['C04'] = {
			events: [],
			color: '',
			textColor: ''
		} 
	}
	
	function getData(eventId) {
		common.ajaxExt({
    		url: '/calendar/view/companyevent/month?startDate=' + calMStart + '&endDate=' + calMEnd,
    		method: 'GET',
    		loadmask: {
    			msg: '정보로딩중...'
    		},
			success: function(jo) {
				if(jo.success) {
					if(jo.datas.length > 0) {
						var events = jo.datas[0];
						
						for(var k in events) {
							eventSources[k].events = events[k];
							$('#ceCalendar').fullCalendar('removeEventSource', eventSources[k]);
							$('#ceCalendar').fullCalendar('addEventSource', eventSources[k]);
						}
					}
				}
			}
    	});
	}
	
	$(document).ready(function() {
		var currentDate = $('#hdnCurrentDate').val();
		calendar = $('#ceCalendar').fullCalendar({
			 header: {
				 left: 'title',
				 center: '',
				 right: 'today prevYear,prev,next,nextYear'
			 },
			 buttonText: {
				 prevYear: new moment().year()-1,
				 nextYear: new moment().year()+1
			 },
			 height: 'auto',
			 defaultDate: currentDate,//$('body').data('date'),
			 navLinks: true, // can click day/week names to navigate views
		     editable: false,
		     selectable: true,
		     eventLimit: false,//true, // allow "more" link when too many events
		     eventClick: function(calEvent, jsEvent, view) {
		    	 //console.log(calEvent.end.format());
		    	 
		    	
		     },
		     navLinkDayClick: function(date, jsEvent) {
		    	 console.log('yyyyy')
		     },
		     viewRender: function(view) {
		    	 mask.hide(); 
		    	 calMStart = view.start.format();
		    	 calMEnd = view.end.format();
		    	 var changedCategoryMonth = $('#ceCalendar').fullCalendar('getDate').format().substring(0, 7);
		    	 
		    	 if(categoryMonth != changedCategoryMonth) {
		    		 categoryMonth = changedCategoryMonth;
		    		 initEventSources();
		    		 getData();
		    	 }
		    	 
		    	 var y = moment($('#ceCalendar').fullCalendar('getDate')).year();
		    	 $('.fc-prevYear-button').text(y-1);
		    	 $('.fc-nextYear-button').text(y+1);
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
