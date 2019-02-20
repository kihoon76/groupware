$(document).ready(function() {
	var resources = [];
	var events = [];
	var wbsWin = null;
	var $txtWbsName = $('#txtWbsName');
	var $txtWbsWriter = $('#txtWbsWriter');
	var today = $('body').data('date');
	
	window.makeCalendar = function(data) {
		wbsWin.close();
		
		$.LoadingOverlay('show', {
		    image       : '',
		    text        : 'WBS를 로딩중입니다.'
		});
		
		$('body').LoadingOverlay('show');
		
		$txtWbsName.val(data.name);
		$txtWbsWriter.val(data.writer);
		resources = $.parseJSON(data.resources);
		events = $.parseJSON(data.events);
		today = data.defaultDay;
		
		$('#calendar').fullCalendar('gotoDate', today);
		$('#calendar').fullCalendar('removeResource', resources);
		$('#calendar').fullCalendar('removeEvents');
		$('#calendar').fullCalendar('refetchResources');
		$('#calendar').fullCalendar('refetchEvents');
		
	}
	
	function searchWin() {
		var grid = parent.Ext.create('Drpnd.view.panel.WbsListGridPanel');
		grid.myExtraParams = {win: window};
		wbsWin = parent.Ext.create('Ext.window.Window', {
			title: 'WBS 리스트',
			iconCls: 'icon-project',
			height: 500,
			width: 800,
			layout: 'fit',
			closeAction: 'destroy',
			modal: true,
			draggable: true,
			resizable: false,
			items: [grid/*parent.Ext.create('Drpnd.view.panel.WbsListGridPanel')*/],
			dockedItems: [{
			    xtype: 'toolbar',
			    dock: 'bottom',
			    ui: 'footer',
			    items: [
			        { xtype: 'component', flex: 1 },
//			        { xtype: 'button', text: '시간설정', iconCls: 'icon-timer', listeners: {
//			        	click: function() {
//			        		
//			        	}
//			        } },
			        { xtype: 'button', text: '닫기', iconCls: 'icon-close', listeners: {
			        	click: function(btn) {
			        		wbsWin.close();
			        	}
			        } }
			    ]
			}],
			listeners: {
				close: function() {
					
				}
			}
		})
		
		wbsWin.show();
	}
	
	$('#btnWBSPop').on('click', function() {
		searchWin();
	});
	
	
	$('#calendar').fullCalendar({
		schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
		now: today,
	    editable: false,
	    droppable: false, // this allows things to be dropped onto the calendar
	    aspectRatio: 1.8,
	    scrollTime: '00:00',
	    header: {
	    	left: 'today prev,next save',
	        center: 'title',
	        right: 'timelineMonth,timelineYear'
	    },
	    defaultView: 'timelineYear',
	    resourceLabelText: 'Tasks',
	    resources: function(callback) {
	    	callback(resources);
	    },
	    events: function(s,e,t,callback) {
	    	callback(events);
	    },
	    eventOverlap: false,
	    eventAfterAllRender: function() {
	    	$('#spLoading').text('');
	    	$('body').LoadingOverlay('hide');
	    },
	});
});