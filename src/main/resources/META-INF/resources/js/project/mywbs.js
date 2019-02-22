$(document).ready(function() {
	var taskContextMenu = null;
	var taskEventContextMenu = null;
	var $txtWbsName = $('#txtWbsName');
	var $txtWbsWriter = $('#txtWbsWriter');
	var today = $('body').data('date');
	
	var prefix = common.s4();
	var resourceIdCnt = 1;
	var eventIdCnt = 1;
	var resources = [];
	var events = [];
	var wbsWin = null;
	
	var recWbsName = null;
	var recWbsDefaultDay = null;
	var recRange = null;
	var recCode = null;
	
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
		
		recWbsName = data.name;
		recWbsDefaultDay = data.defaultDay;
		recRange = data.range;
		recCode = data.code;
		
		$('#calendar').fullCalendar('gotoDate', today);
		$('#calendar').fullCalendar('removeResource', resources);
		$('#calendar').fullCalendar('removeEvents');
		$('#calendar').fullCalendar('refetchResources');
		$('#calendar').fullCalendar('refetchEvents');
		
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
	
	function getNewEventId() {
		return 'e' + prefix + (++eventIdCnt);
	}
	
	function getNewResourceId() {
		return 'r' + prefix + (++resourceIdCnt);
	}
	
	$.contextMenu({
        selector: 'tbody.fc-body .fc-cell-content', 
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
    					//var newId = 'r' + prefix + (++resourceIdCnt);
    					addResource(taskContextMenu.id, null, getNewResourceId(), null, txt);
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
    					//var newId = 'r' + prefix + (++resourceIdCnt);
    					addResource(null, taskContextMenu.id, getNewResourceId(), 'up', txt);
    				}
    			});
            	break;
            case 'add_down':
            	parent.Ext.Msg.prompt('', 'Task를 입력하세요', function(btn, txt) {
    				if(btn == 'ok') {
    					//var newId = 'r' + prefix + (++resourceIdCnt);
    					addResource(null, taskContextMenu.id, getNewResourceId(), 'down', txt);
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
	
	//event 삭제
	$.contextMenu({
        selector: 'a.fc-timeline-event div.fc-content', 
        callback: function(key, options) {
        	console.log(taskEventContextMenu)
            switch(key) {
            case 'delete':
            	$('#calendar').fullCalendar('removeEvents', taskEventContextMenu.id);
            	taskEventContextMenu = null;
            	break;
            }
        },
        items: {
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
	
	var extTxtWbsName = null;
	var extRgp = null;
	var extDate = null;
	
	function getModForm() {
		return parent.Ext.create('Ext.form.Panel', {
			frame: true,
		    anchor: '100%',
		    bodyPadding: 5,
	        fieldDefaults: {
	            labelAlign: 'left',
	            labelWidth: 90,
	            anchor: '100%'
	        },
	        items: [{
	            xtype: 'textfield',
	            fieldLabel: 'WBS 이름',
	            value: recWbsName,
	            listeners: {
	            	afterrender: function(txt) {
	            		extTxtWbsName = txt;
	            	}
	            }
	        },{
	            xtype: 'datefield',
	            fieldLabel: '시작일자',
	            format:'Y-m-d',
	            editable: false,
	            value: recWbsDefaultDay,
	            listeners: {
	            	afterrender: function(date) {
	            		extDate = date;
	            	}
	            }
	        },{
	        	xtype: 'radiogroup',
            	fieldLabel: '공유범위',
            	//height: 120,
            	items: [{
            		boxLabel: '나만보기',
            		boxLabelAlign: 'after',
            		name: 'range',
            		padding: '0 50 0 0',
            		checked: (recRange == 'P' ? true : false),
            		_value: 'P'
            		
            	},{
            		boxLabel: '팀공유',
            		boxLabelAlign: 'after',
            		name: 'range',
            		checked: (recRange == 'T' ? true : false),
            		_value: 'T'
            	},{
            		boxLabel: '전체공유',
            		boxLabelAlign: 'after',
            		name: 'range',
            		checked: (recRange == 'A' ? true : false),
            		_value: 'A'
            	}],
            	listeners: {
	            	afterrender: function(rdoGrp) {
	            		extRgp = rdoGrp;
	            	}
	            }
	        }]
		});
	}
	
	function delWin() {
		common.showExtMsg({
			type: 'confirm',
			msg: 'WBS [' + recWbsName + '] 삭제하시겠습니까?' ,
			callback: function(btn) {
				if(btn == 'ok') {
					common.checkSession(function() {
						delWBS();
					});
				}
			}
		});
	}
	
	function delWBS() {
		common.ajaxExt({
			url: '/project/del/wbs/' + recCode,
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			loadmask: {
				msg: 'WBS 삭제중입니다.'
			},
			success: function(jo) {
				console.log(jo);
				if(jo.success) {
					common.showExtMsg({
						type: 'alert',
						icon: parent.Ext.MessageBox.INFO,
						msg: 'WBS 삭제되었습니다.',
						callback: function() {
							window.location.reload();
						}
					});
				}
				else {
					common.showExtMsg({
						type: 'alert',
						msg: jo.errMsg
					});
				}
			}
		});
	}
	
	function modWin() {
		var wbsModWin = parent.Ext.create('Ext.window.Window', {
			title: 'WBS 수정',
			iconCls: 'icon-project',
			height: 200,
			width: 600,
			layout: 'fit',
			closeAction: 'destroy',
			modal: true,
			resizable: false,
			items: [getModForm()],
			dockedItems: [{
			    xtype: 'toolbar',
			    dock: 'bottom',
			    ui: 'footer',
			    //defaults: {minWidth: minButtonWidth},
			    items: [
			        { xtype: 'component', flex: 1 },
			        { xtype: 'button', text: '수정', iconCls: 'icon-project', listeners: {
			        	click: function() {
			        		var wbsName = $.trim(extTxtWbsName.getValue());
			        		var range = (extRgp.getChecked())[0]._value;
			        		var start = extDate.getRawValue();
			        		
			        		if($.trim(wbsName) == '') {
			        			extTxtWbsName.markInvalid('WBS 이름을 입력하세요');
			        		}
			        		else if(start == '') {
			        			extDate.markInvalid('WBS 시작일자를 선택하세요');
			        		}
			        		else {
				        		modWBS(wbsName, range, start, wbsModWin);
			        		}
			        	}
			        } },
			        { xtype: 'button', text: '닫기', iconCls: 'icon-close', listeners: {
			        	click: function(btn) {
			        		wbsModWin.close();
			        	}
			        } }
			    ]
			}],
			listeners: {
				close: function() {
					
				}
			}
		})
		
		wbsModWin.show();
	}
	
	function modWBS(wbsName, range, start, win) {
		var events = $('#calendar').fullCalendar('clientEvents');
		var event = null;
		var len = events.length;
		var eventObject = [];
		var end = null;
		
		//end가 null인 경우: drop만 한 경우
		for(var i=0; i<len; i++) {
			event = events[i];
			end = event.end;
			if(end) {
				end = event.end.format();
			}
			else {
				var d = new Date(event.start.format());
		    	d.setDate(d.getDate() + 1);
		    	end = common.getYmd(d); 
			}
			eventObject.push({
				id: event.id,
				resourceId: event.resourceId,
				start: event.start.format(),
				end: end,
				title: ''
			});
		}
		
		common.ajaxExt({
			url: '/project/mod/wbs',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			jsonData: {
				resources: JSON.stringify(resources),
				events: JSON.stringify(eventObject),
				title: wbsName, 
				range: range,
				start: start,
				code: recCode
			},
			loadmask: {
				msg: 'WBS 수정중입니다.'
			},
			success: function(jo) {
				console.log(jo);
				if(jo.success) {
					common.showExtMsg({
						type: 'alert',
						icon: parent.Ext.MessageBox.INFO,
						msg: 'WBS 수정되었습니다.',
						callback: function() {
							win.close();
							window.location.reload();
						}
						
					});
				}
				else {
					common.showExtMsg({
						type: 'alert',
						msg: jo.errMsg
					});
				}
			}
		});
	}
	
	function searchWin() {
		var grid = parent.Ext.create('Drpnd.view.panel.MyWbsListGridPanel');
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
		customButtons: {
			save: {
				text: '수정',
				click: function() {
					if(resources.length > 0) {
						modWin();
					}
				}
			},
			del: {
				text: '삭제',
				click: function() {
					if(resources.length > 0) {
						delWin();
					}
				}
			}
		},
		now: today,
	    editable: true,
	    droppable: true, // this allows things to be dropped onto the calendar
	    aspectRatio: 1.8,
	    scrollTime: '00:00',
	    header: {
	    	left: 'today prev,next save del',
	        center: 'title',
	        right: 'timelineMonth,timelineYear'
	    },
	    defaultView: 'timelineYear',
	    resourceLabelText: 'Tasks',
	    resourceRender: function(resource, cellEls) {
	    	$(cellEls).contextmenu(function() {
	    		taskContextMenu = resource;
	    	})
	    },
	    resources: function(callback) {
	    	callback(resources);
	    },
	    events: function(s,e,t,callback) {
	    	callback(events);
	    },
	    drop: function(date, jsEvent, ui, resourceId) {},
	    eventOverlap: false,
	    eventReceive: function(event) { // called when a proper external event is dropped
	    	event.id = getNewEventId();
	    	$('#calendar').fullCalendar('updateEvent', event);  
	    },
	    eventDrop: function(event) { // called when an event (already on the calendar) is moved
	        console.log('eventDrop', event);
	        $('#calendar').fullCalendar('updateEvent', event);
	    },
	    eventResize: function(event, delta, revertFunc) {
	    	$('#calendar').fullCalendar('updateEvent', event);
	    },
	    eventAfterAllRender: function() {
	    	$('#spLoading').text('');
	    },
	    eventRender: function(event, element) {
	    	$(element).contextmenu(function() {
	    		taskEventContextMenu = event;
	    	})
	    },
	    eventAfterAllRender: function() {
	    	$('#spLoading').text('');
	    	$('body').LoadingOverlay('hide');
	    },
	});
});