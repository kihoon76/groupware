$(function() {
	$('#reservation').fullCalendar({
		height: 'auto',
		defaultView: 'agendaDay',
		events: [
		    // events go here
		],
		resources: [
		   { id: 'a', title: 'Room A' },
		   { id: 'b', title: 'Room B' },
		   { id: 'c', title: 'Room C' },
		   { id: 'd', title: 'Room D' }
		]
	});
});