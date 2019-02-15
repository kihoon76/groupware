$(document).ready(function() {
	
	function searchWin() {
		var wbsWin = parent.Ext.create('Ext.window.Window', {
			title: 'WBS 리스트',
			iconCls: 'icon-project',
			height: 600,
			width: 600,
			layout: 'fit',
			closeAction: 'destroy',
			modal: true,
			draggable: false,
			resizable: false,
			items: [parent.Ext.create('Drpnd.view.panel.WbsListGridPanel')],
			dockedItems: [{
			    xtype: 'toolbar',
			    dock: 'bottom',
			    ui: 'footer',
			    items: [
			        { xtype: 'component', flex: 1 },
			        { xtype: 'button', text: '시간설정', iconCls: 'icon-timer', listeners: {
			        	click: function() {
			        		
			        	}
			        } },
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
//	$('#calendar').fullCalendar({
//		schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
//		now: $('body').data('date'),
//	    editable: false,
//	    droppable: false, // this allows things to be dropped onto the calendar
//	    aspectRatio: 1.8,
//	    scrollTime: '00:00',
//	    header: {
//	    	//left: 'promptResource today prev,next',
//	    	left: 'today prev,next save',
//	        center: 'title',
//	        //right: 'timelineDay,timelineTenDay,timelineMonth,timelineYear'
//	        right: 'timelineMonth,timelineYear'
//	    },
//	    defaultView: 'timelineYear',
//	    resourceLabelText: 'Tasks',
//	    resources: resources,
//	    events: events,
//	    eventOverlap: false,
//	});
});