(function(){
	var draw = null;
	var recW = 200;
	var recH = 50;
	var recColor = '#ccc';
	var recPadding = 10;
	var cellPhoneW = recW;
	var cellPhoneH = 20;
	var cellColor = '#00f';
	var innerPhoneW = recW;
	var innerPhoneH = 0; //20;
	var innerColor = '#66c';
	var gap = 40;
	var linePadding = 10;
	var lineWidth = 10;
	var lineColor = '#000';
	var seatSpace = recH + cellPhoneH + innerPhoneH + gap;
	var divH = recH + cellPhoneH + innerPhoneH;
	var seatMap = [];
	var TimeObj = {
		title: null,
		startTime: null,
		endTime: null,
		ymd: ''
	};
	var timeSettingWin = null;
	var myToken = $('#_csrfToken').val();
	var hasSocketConntected = false;
	var reservationContentWin = null;
	var reconTotal = 10;
	var reconAttemp = 0;
	var sawonList = null;
	
	var socket = new SockJS('/websocket'),
	stompClient = Stomp.over(socket);
	
	function successCallback() {
		hasSocketConntected = true;
		reconAttemp = 0;
		
	    stompClient.subscribe('/message/conference/reservation', function(message){
	       var m = $.parseJSON(message.body);
	       console.log(m.token+ '/' + myToken)
	       
	       if(m.token != myToken) {
	    	  //같은 날짜를 보고 있을경우에만 
	    	  if(reservationContentWin && reservationContentWin.getCurrentDate() == m.ymd) {
	    		  reservationContentWin.addEvent({
	    			  title: m.title,
	    			  start: m.ymd + 'T' + m.startTime,
	    			  end: m.ymd + 'T' + m.endTime,
	    			  reserver: m.reserver,
	    			  mine: m.mine
				  }, 'default');  
	    	  }
	       }
	    });
	    
	    stompClient.subscribe('/message/conference/del/reservation', function(message) {
	    	var m = $.parseJSON(message.body);
		    console.log(m.token+ '/' + myToken)
		       
		    if(m.token != myToken) {
		    	//같은 날짜를 보고 있을경우에만 
		    	if(reservationContentWin && reservationContentWin.getCurrentDate() == m.ymd) {
		    		reservationContentWin.delEvent(m.rnum);  
		    	  }
		       }
	    });
	    
	    stompClient.subscribe('/message/conference/mod/reservation', function(message) {
	    	var m = $.parseJSON(message.body);
		    console.log(m.token+ '/' + myToken)
		       
		    if(m.token != myToken) {
		    	//같은 날짜를 보고 있을경우에만 
		    	if(reservationContentWin && reservationContentWin.getCurrentDate() == m.ymd) {
		    		reservationContentWin.modEvent({
						title: m.title,
						start: m.ymd + 'T' + m.startTime,
						end: m.ymd + 'T' + m.endTime,
						reserver: m.reserver,
						mine: 'N',
						rnum: m.rnum
					});
		    	  }
		       }
	    });
	    
	    stompClient.subscribe('/message/geuntae/gotowork', function(message) {
	    	var seatNum = $.parseJSON(message.body);
		    
	    	if(seatNum >= 0) {
	    		var sm = seatMap[seatNum];
	    		gotowork(sm);
	    	}
		       
		   
	    });
	    
	    stompClient.subscribe('/message/geuntae/offwork', function(message) {
	    	var seatNum = $.parseJSON(message.body);
		    
	    	if(seatNum >= 0) {
	    		var sm = seatMap[seatNum];
	    		offwork(sm);
				/*sm.ownerTxt.text(sawonList[i].sawonName);
				sm.phoneTxt.text(sawonList[i].sawonPhone + ' / ' + sawonList[i].sawonInnerPhone);*/
	    	}
		       
		   
	    });
	    
//	    stompClient.subscribe('/message/conference/mod/reservation', function(message){
//		       var m = $.parseJSON(message.body);
//		       console.log(m.token+ '/' + myToken)
//		       
//		       if(m.token != myToken) {
//		    	  var m = $.parseJSON(message.body);
//		    	  
//		    	  //같은 날짜를 보고 있을경우에만 
//		    	  if(reservationContentWin && reservationContentWin.getCurrentDate() == m.ymd) {
//		    		  reservationContentWin.modEvent({
//		    			  title: m.title,
//		    			  start: m.ymd + 'T' + m.startTime,
//		    			  end: m.ymd + 'T' + m.endTime,
//		    			  reserver: m.reserver,
//		    			  mine: m.mine
//					  }, 'default');  
//		    	  }
//		       }
//		    });
	}
	
	function gotowork(obj) {
		if(obj) {
			obj.rect.attr({
    			fill: '#003'
    		});
    		
    		obj.ownerTxt.font({
    			fill: '#fff'
    		});
		}
	}
	
	function offwork(obj) {
		if(obj) {
			obj.rect.attr({
    			fill: recColor
    		});
    		
    		obj.ownerTxt.font({
    			fill: '#000'
    		});
		}
	}
	
	function reconnect() {
		hasSocketConntected = false;
		reconAttemp++;
		
		if(reconAttemp > reconTotal) return;
		
		var reconInv = setTimeout(function() {
			socket = new SockJS('/websocket'),
			stompClient = Stomp.over(socket);
			
			stompClient.connect({}, function(frame) {
				clearTimeout(reconInv);
				successCallback();	    
			}, function(error) {
				reconnect();
			});
			
		}, 5000);
	}

	stompClient.connect({}, function(frame) {
		successCallback();	    
	    
	}, function(error) {
		reconnect();
	});
	
	
	
	function Seat(x, y, isSudo) {
		
		var group = draw.group();
		var rect = draw.rect(recW, recH).attr({
			x:x,
			y:y,
			fill: isSudo ? '#033' : recColor,
		});
		
		if(isSudo) {
			rect.radius(30, 30);
		}
		
		var rectCell = draw.rect(cellPhoneW, cellPhoneH).attr({
			x:x,
			y:y+recH,
			fill: cellColor
		});
//		var rectInnerPhone = draw.rect(innerPhoneW, innerPhoneH).attr({
//			x:x,
//			y:y+recH+cellPhoneH,
//			fill:innerColor,
//		});
		
		var ownerTxt = draw.text('x').attr({x:50, y:50});
		ownerTxt.font({anchor: 'middle', size: 15, family: 'Helvetica'});
		ownerTxt.move(x + (recW/6), y + 10);
		
		var phoneTxt = draw.text('- / -').attr({x:50, y:50});
		phoneTxt.font({anchor: 'middle', size: 13, family: 'Helvetica'});
		phoneTxt.fill('#fff');
		phoneTxt.move(x + (recW/3) + 5, y + recH + 3);
//		
//		var lblInner = draw.text('내선전화  ').attr({x:50, y:50});
//		lblInner.font({anchor: 'middle', size: 13, family: 'Helvetica'});
//		lblInner.fill('#fff');
//		lblInner.move(x + (recW/6), y + recH + cellPhoneH + 3);
		
		
		group.add(rect);
		group.add(rectCell);
		//group.add(rectInnerPhone);
		group.add(ownerTxt);
		group.add(phoneTxt);
		//group.add(lblInner);
		
		return {
			rect: rect,
			ownerTxt: ownerTxt,
			phoneTxt: phoneTxt
		};
	}
	
	function imwonSeat(cnt) {
		var w = window.innerWidth;
		var lastStartY = 0;
		for(var i=0; i<cnt; i++) {
			seatMap.push(Seat(w - recW + recPadding, lastStartY = seatSpace * i));
		}
		
		return lastStartY;
	}
	
	function drawDivider(sx, sy, seatCnt, ey) {
		var line = draw.line(sx, sy, seatCnt * (recW + recPadding) - recPadding, ey).move(0, sy + linePadding);
		line.stroke({ width: lineWidth, color: lineColor })
	}
	
	function makeRowSeat(cnt, y, sudoIndex) {
		var isSudo = false;
		for(var i=0; i<cnt; i++) {
			isSudo = i == sudoIndex;
			seatMap.push(Seat(i*(recW + recPadding), y, isSudo));
		}
	}
	
	function makeConferenceSeat(x, y) {
		var rect = draw.rect(recW, 200).attr({
			x:x,
			y:y,
			fill:recColor,
		});
		
		rect.on('click', function() {
			viewTimeline();
		})
		.on('mouseover', function() {
			this.fill({ color : recColor, opacity: 0.3})
		})
		.on('mouseout', function() {
			this.fill({ color : recColor, opacity: 1})
		})
		
		var ownerTxt = draw.text('회의실').attr({x:50, y:50});
		ownerTxt.font({anchor: 'middle', size: 25, family: 'Helvetica'});
		ownerTxt.move(x + (recW/4), y + 10);
		
		seatMap.push({
			rect: rect
		});
	}
	
	function viewTimeline() {
		var iframe = parent.Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'reservation', load: function(dom) {
			reservationContentWin = $(dom)[0].contentWindow;
		} });
		
		//console.log(iframe.getId());
		//$(iframe.el.dom).find('iframe')[0].contentWindow.t();
		var reserveWin = parent.Ext.create('Ext.window.Window', {
			title: '회의실 예약현황',
			height: 800,
			width: 800,
			layout: 'fit',
			closeAction: 'destroy',
			modal: true,
			draggable: false,
			items: [iframe],
			dockedItems: [{
			    xtype: 'toolbar',
			    dock: 'bottom',
			    ui: 'footer',
			    //defaults: {minWidth: minButtonWidth},
			    items: [
			        { xtype: 'component', flex: 1 },
			        { xtype: 'button', text: '시간설정', listeners: {
			        	click: function() {
			        		//setConferenceTime();
			        		//reservationContentWin = $(iframe.el.dom).find('iframe')[0].contentWindow;
			        		TimeObj.ymd = reservationContentWin.getCurrentDate();
			        		setConferenceTime();
			        	}
			        } },
			        { xtype: 'button', text: '닫기', listeners: {
			        	click: function(btn) {
			        		reserveWin.close();
			        	}
			        } }
			    ]
			}],
			listeners: {
				close: function() {
					
				}
			}
		})
		
		reserveWin.show();
	
	}
	
	function setConferenceTime() {
		timeSettingWin = parent.Ext.create('Ext.window.Window', {
			title: '시간설정(' + TimeObj.ymd + ')',
			height: 200,
			width: 400,
			layout: 'fit',
			closeAction: 'destroy',
			modal: true,
			items: [{
				xtype: 'form',
				bodyStyle  : 'padding: 10px;',
		        margins    : '0 0 0 0',
		        fieldDefaults: {
		            msgTarget: 'side',
		            labelWidth: 85,
		            anchor: '100%'
		        },
		        defaultType: 'textfield',
		        items: [{
		        	fieldLabel: '제목',
		        	id: 'conf-title',
		        	listeners: {
		        		afterrender: function(txt) {
		        			TimeObj.title = txt;
		        		}
		        	}
		        },{
		        	fieldLabel: '시작시간',
		        	xtype: 'timefield',
		        	id: 'conf-start',
		        	allowBlank: false,
		        	editable: false,
		            increment: 30,
		            format: 'H:i',
		            minValue: '08:00',
		            maxValue: '19:00',
		            listeners: {
		        		afterrender: function(time) {
		        			TimeObj.startTime = time;
		        		}
		        	}
				},{
		        	fieldLabel: '종료시간',
		        	xtype: 'timefield',
		        	id: 'conf-end',
		        	allowBlank: false,
		        	editable: false,
		            increment: 30,
		            format: 'H:i',
		            minValue: '08:00',
		            maxValue: '19:00',
		            listeners: {
		        		afterrender: function(time) {
		        			TimeObj.endTime = time;
		        		}
		        	}
				}]
			}],
			dockedItems: [{
			    xtype: 'toolbar',
			    dock: 'bottom',
			    ui: 'footer',
			    //defaults: {minWidth: minButtonWidth},
			    items: [
			        { xtype: 'component', flex: 1 },
			        { xtype: 'button', text: '예약', listeners: {
			        	click: function() {
			        		reserve();
			        	}
			        } },
			        { xtype: 'button', text: '닫기', listeners: {
			        	click: function(btn) {
			        		timeSettingWin.close();
			        	}
			        } }
			    ]
			}]  
		});
		
		timeSettingWin.show();
	}
	
	function reserve() {
//		if(!hasSocketConntected) {
//			common.showExtMsg({
//				msg: '소켓연결에 실패했습니다.',
//				type: 'alert'
//			});
//			
//			return;
//		}
		
		var title = $.trim(TimeObj.title.getValue());
		var startTime = $.trim(TimeObj.startTime.getRawValue());
		var endTime = $.trim(TimeObj.endTime.getRawValue());
		
		if(title == '') {
			TimeObj.title.markInvalid('제목을 입력하세요');
			return;
		}
		
		if(startTime == '') {
			TimeObj.startTime.markInvalid('시작시간을 선택하세요');
			return;
		}
		
		if(endTime == '') {
			TimeObj.endTime.markInvalid('종료시간을 선택하세요');
			return;
		}
		
		if(parseInt(endTime.replace(':', '')) - parseInt(startTime.replace(':', '')) <= 0) {
			TimeObj.startTime.markInvalid('시작시간은 종료시간보다 빨라야 합니다.');
			return;
		}
		
		
		common.ajaxExt({
			url: '/calendar/conference/reservation',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }, 
			jsonData: {
				title: title,
				startTime: startTime,
				endTime: endTime,
				ymd: TimeObj.ymd
			},
			loadmask: {
				msg: '예약등록중 입니다.'
			},
			success: function(jo) {
				if(reservationContentWin) {
					var data = jo.datas[0];
					reservationContentWin.addEvent({
						id: parseInt(data.rnum),
						rnum: data.rnum,
						title: data.title,
						start: data.ymd + 'T' + data.startTime,
						end: data.ymd + 'T' + data.endTime,
						reserver: data.reserver,
						mine: 'Y'
					}, 'mine');
					
					timeSettingWin.close();
				}
			}
		});
	}
	
	function makeSeat() {
		var row2Y = seatSpace;
		var div1Y = row2Y + divH;
		var row3Y = div1Y + linePadding + lineWidth;
		var row4Y = row3Y + seatSpace;
		var div2Y = row4Y + divH;
		var row5Y = div2Y + linePadding + lineWidth;
		var row6Y = row5Y + seatSpace;
		var div3Y = row6Y + divH;
		
		makeRowSeat(4, 0);
		makeRowSeat(4, row2Y);
		drawDivider(0, div1Y, 4, div1Y);
		makeRowSeat(4, row3Y);
		makeRowSeat(4, row4Y);
		drawDivider(0, div2Y, 4, div2Y);
		makeRowSeat(4, row5Y);
		makeRowSeat(3, row6Y);
		drawDivider(0, div3Y, 3, div3Y);
		var lastY = imwonSeat(4);
		makeConferenceSeat(window.innerWidth - recW + recPadding, lastY + seatSpace);
		
	}
	
	if(SVG.supported) {
		SVG.on(document, 'DOMContentLoaded', function() {
			draw = SVG('drawing').size('100%', 800);
			makeSeat();
			initSawonInfo();
		});
	}
	else {
		$('#drawing').html('SVG를 지원하지 않는 브라우저 입니다.')
	}
	
	function initSawonInfo() {
		sawonList = $.parseJSON($('#list').val());
		
		for(var i=0, len=sawonList.length; i<len; i++) {
			var sm = seatMap[sawonList[i].seatNum];
			sm.ownerTxt.text(sawonList[i].sawonName);
			sm.phoneTxt.text(sawonList[i].sawonPhone + ' / ' + sawonList[i].sawonInnerPhone);
			
			if(sawonList[i].isGotowork == 'Y' && sawonList[i].isOffwork == 'N') {
				gotowork(sm);
			}
		}
	}
	
	
}());