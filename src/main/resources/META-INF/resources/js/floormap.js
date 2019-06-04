(function(){
	var draw = null;
	var recW = 200;
	var recH = 50;
	var recVacationW = 80;
	var recColor = '#ccc';
	var recPadding = 10;
	var cellPhoneW = recW;
	var cellPhoneH = 20;
	var cellColor = '#00f';
	var innerPhoneW = recW;
	var innerPhoneH = 0;
	var planH = 15; //20;
	var planW = 60;
	var planColor = recColor;
	var planActiveColor = '#ff0000';
	var innerColor = '#66c';
	var gap = 40;
	var linePadding = 10;
	var lineWidth = 10;
	var lineColor = '#000';
	var seatSpace = recH + cellPhoneH + innerPhoneH + gap;
	var divH = recH + cellPhoneH + innerPhoneH;
	var seatMap = [];
	var imwonSeatMap = [];
	var conferenceMap = [];
	
	var TimeObj = {
		title: null,
		startTime: null,
		endTime: null,
		ymd: ''
	};
	var timeSettingWin = null;
	var myToken = $('#_csrfToken').val();
	var crCountStr = $('#crCount').val();
	var mySeatNum = $('#mySeatNum').val();
	
	var crCount = parseInt(crCountStr, 10);
	var today = $('body').data('date');
	//var hasSocketConntected = false;
	var reservationContentWin = null;
	//var reconTotal = 10;
	//var reconAttemp = 0;
	var sawonList = null;
	var vacationSawonList = null;
	var sawonPlanList = null;
	//var IN_OUT_TYPE = '';
	var inOutMap = {};
	
	//var socket = new SockJS('/websocket'),
	//stompClient = Stomp.over(socket);
	
	var Socket = parent.Ext.create('Drpnd.custom.Socket', {
		socketUrl: '/websocket',
		subscribe: [{
			url: '/message/conference/reservation',
			callback: function(message, mBody) {
				if(mBody.token != myToken) {
					//같은 날짜를 보고 있을경우에만 
			    	if(reservationContentWin && reservationContentWin.getCurrentDate() == mBody.ymd) {
			    		reservationContentWin.addEvent({
			    			title: mBody.title,
			    			start: mBody.ymd + 'T' + mBody.startTime,
			    			end: mBody.ymd + 'T' + mBody.endTime,
			    			reserver: mBody.reserver,
			    			mine: mBody.mine,
			    			rnum: mBody.rnum
			    		}, 'default');  
			    	}
				}
				
				//회의실 예약 카운트 +1
				if(mBody.ymd == today) {
					conferenceMap[0].ownerTxt.text('회의실(' + (++crCount) + ')');
				}
			}
		},{
			url: '/message/conference/del/reservation',
			callback: function(message, mBody) {
				if(mBody.token != myToken) {
					//같은 날짜를 보고 있을경우에만 
				    if(reservationContentWin && reservationContentWin.getCurrentDate() == mBody.ymd) {
				    	reservationContentWin.delEvent(mBody.rnum);  
				    }
				}
				
				//회의실 예약 카운트 +1
				if(mBody.ymd == today && crCount >= 1) {
					conferenceMap[0].ownerTxt.text('회의실(' + (--crCount) + ')');
				}
			}
		},{
			url: '/message/conference/mod/reservation',
			callback: function(message, mBody) {
				if(mBody.token != myToken) {
					//같은 날짜를 보고 있을경우에만 
				    if(reservationContentWin && reservationContentWin.getCurrentDate() == mBody.ymd) {
				    	reservationContentWin.modEvent({
							title: mBody.title,
							start: mBody.ymd + 'T' + mBody.startTime,
							end: mBody.ymd + 'T' + mBody.endTime,
							reserver: mBody.reserver,
							mine: 'N',
							rnum: mBody.rnum
						});  
				    }
				}
			}
		},{
			url: '/message/geuntae/gotowork',
			callback: function(message, mBody) {
				if(mBody.seatNum >= 0) {
		    		var sm = seatMap[mBody.seatNum];
		    		gotowork(sm, mBody.isOutwork, mBody.seatNum, mBody.geuntaeCode);
		    	}
			}
		},{
			url: '/message/geuntae/offwork',
			callback: function(message, seatNum) {
				if(seatNum >= 0) {
		    		var sm = seatMap[seatNum];
		    		offwork(sm);
		    	}
			}
		},{
			url: '/message/geuntae/change/outwork',
			callback: function(message, mBody) {
				var seatNum = mBody.seatNum;
				if(seatNum >= 0) {
		    		var sm = seatMap[seatNum];
		    		changeSeatOutToIn(seatNum, sm, 'TO_OUT');
		    	}
			}
		},{
			url: '/message/geuntae/change/inwork',
			callback: function(message, mBody) {
				var seatNum = mBody.seatNum;
				if(seatNum >= 0) {
		    		var sm = seatMap[seatNum];
		    		changeSeatOutToIn(seatNum, sm, 'TO_IN');
		    	}
			}
		}]
	});
	
	Socket.connect();
	
	function changeOutToIn(geuntaeCode, seatNum, type) {
		if(type == 'TO_IN') {
			common.showExtMsg({
				type: 'confirm',
				msg: '내근으로 전환하시겠습니까?',
				callback: function(btn) {
					if(btn == 'ok') {
						common.ajaxExt({
							url: '/geuntae/change/outwork/' + geuntaeCode + '?seatNum=' + seatNum,
							method: 'GET',
							headers: { 'Content-Type': 'application/json' }, 
							loadmask: {
								msg: '내근전환중 입니다.'
							},
							success: function(jo) {
								if(jo.success) {
									common.showExtMsg({
										type: 'alert',
										icon: parent.Ext.MessageBox.INFO,
										msg: '내근전환 되었습니다.'
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
				}
			});
		}
		else {
			common.showExtMsg({
				type: 'confirm',
				msg: '외근으로 전환하시겠습니까?',
				callback: function(btn) {
					if(btn == 'ok') {
						common.ajaxExt({
							url: '/geuntae/change/inwork/' + geuntaeCode + '?seatNum=' + seatNum,
							method: 'GET',
							headers: { 'Content-Type': 'application/json' }, 
							loadmask: {
								msg: '외근전환중 입니다.'
							},
							success: function(jo) {
								if(jo.success) {
									common.showExtMsg({
										type: 'alert',
										icon: parent.Ext.MessageBox.INFO,
										msg: '외근전환 되었습니다.'
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
				}
			});
		}
	}
	
	function changeSeatOutToIn(seatNum, sm, type) {
		if(sm) {
			sm.outworkTxt.attr({
				fill: type == 'TO_OUT' ? '#003' : '#fff'
			});
			
			if(seatNum == mySeatNum) {
				inOutMap[String(mySeatNum)] = type;
			}
			//IN_OUT_TYPE = type;
//			sm.rect
//			.off('click')
//			.off('mouseover')
//			.off('mouseout');
//    		
//    		sm.ownerTxt
//			.off('click')
//			.off('mouseover')
//			.off('mouseout');
//    		
//    		sm.outworkTxt
//			.off('click')
//			.off('mouseover')
//			.off('mouseout');
		}
	}
	
	function gotowork(obj, isOutwork, seatNum, todayGeuntaeCode) {
		if(obj) {
			obj.rect.attr({
    			fill: '#003'
    		});
    		
    		obj.ownerTxt.font({
    			fill: '#fff'
    		});
    		
    		obj.rectVacation.attr({
    			fill: '#003'
    		});
    		
    		obj.vacationTxt.attr({
    			fill: '#003'
    		});
    		
    		if(obj.hasPlan) {
    			obj.rectPlan.attr({
        			fill: planActiveColor
        		});
    		}
    		else {
    			obj.rectPlan.attr({
        			fill: '#003'
        		});
    		}
    		
    		if(isOutwork == 'Y'/* && todayGeuntaeCode != 0*/) {
    			obj.outworkTxt.attr({
    				fill: '#fff'
    			});
    		}
    		else {
    			obj.outworkTxt.attr({
    				fill: '#003'
    			});
    		}
    		
    		if(mySeatNum == seatNum) {
    			if(!inOutMap[String(mySeatNum)])
    			if(isOutwork == 'Y'/* && todayGeuntaeCode != 0*/) {
        			//IN_OUT_TYPE = 'TO_IN';
        			inOutMap[String(mySeatNum)] = 'TO_IN';
        		}
        		else {
        			//IN_OUT_TYPE = 'TO_OUT';
        			inOutMap[String(mySeatNum)] = 'TO_OUT';
        		}
    			
				obj.rect
				.off('click')
				.off('mouseover')
				.off('mouseout')
				.on('click', function() {
					//changeOutToIn(todayGeuntaeCode, seatNum, IN_OUT_TYPE);
					changeOutToIn(todayGeuntaeCode, seatNum, inOutMap[String(mySeatNum)]);
				})
				.on('mouseover', function() {
					this.fill({opacity: 0.3});
//					if(IN_OUT_TYPE == 'TO_OUT') {
//						obj.outworkTxt.fill({opacity: 0});
//					}
					
					if(inOutMap[String(mySeatNum)] == 'TO_OUT') {
						obj.outworkTxt.fill({opacity: 0});
					}
					
					
				})
				.on('mouseout', function() {
					this.fill({opacity: 1});
//					if(IN_OUT_TYPE == 'TO_OUT') {
//						obj.outworkTxt.fill({opacity: 1});
//					}
					
					if(inOutMap[String(mySeatNum)] == 'TO_OUT') {
						obj.outworkTxt.fill({opacity: 1});
					}
				});
				
				obj.ownerTxt
				.off('click')
				.off('mouseover')
				.off('mouseout')
				.on('click', function() {
					//changeOutToIn(todayGeuntaeCode, seatNum, IN_OUT_TYPE);
					changeOutToIn(todayGeuntaeCode, seatNum, inOutMap[String(mySeatNum)]);
				})
				.on('mouseover', function() {
					obj.rect.fill({opacity: 0.3});
//					if(IN_OUT_TYPE == 'TO_OUT') {
//						obj.outworkTxt.fill({opacity: 0});
//					}
					
					if(inOutMap[String(mySeatNum)] == 'TO_OUT') {
						obj.outworkTxt.fill({opacity: 0});
					}
				})
				.on('mouseout', function() {
					obj.rect.fill({opacity: 1});
//					if(IN_OUT_TYPE == 'TO_OUT') {
//						obj.outworkTxt.fill({opacity: 1});
//					}
					
					if(inOutMap[String(mySeatNum)] == 'TO_OUT') {
						obj.outworkTxt.fill({opacity: 1});
					}
				});
				
				obj.outworkTxt
				.off('click')
				.off('mouseover')
				.off('mouseout')
				.on('click', function() {
					//changeOutToIn(todayGeuntaeCode, seatNum, IN_OUT_TYPE);
					changeOutToIn(todayGeuntaeCode, seatNum, inOutMap[String(mySeatNum)]);
				})
				.on('mouseover', function() {
					obj.rect.fill({opacity: 0.3});
//					if(IN_OUT_TYPE == 'TO_OUT') {
//						this.fill({opacity: 0});
//					}
					
					if(inOutMap[String(mySeatNum)] == 'TO_OUT') {
						this.fill({opacity: 0});
					}
				})
				.on('mouseout', function() {
					obj.rect.fill({opacity: 1});
//					if(IN_OUT_TYPE == 'TO_OUT') {
//						this.fill({opacity: 1});
//					}
					
					if(inOutMap[String(mySeatNum)] == 'TO_OUT') {
						this.fill({opacity: 1});
					}
				});
				
			}
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
    		
    		obj.rectVacation.attr({
    			fill: recColor
    		});
    		
    		obj.vacationTxt.attr({
    			fill: recColor
    		});
    		
    		obj.outworkTxt.attr({
				fill: recColor
			});
    		
    		if(obj.hasPlan) {
    			obj.rectPlan.attr({
    				fill: planActiveColor
    			});
    		}
    		else {
    			obj.rectPlan.attr({
    				fill: recColor
    			});
    		}
    		
    		obj.rect
			.off('click')
			.off('mouseover')
			.off('mouseout');
    		
    		obj.ownerTxt
			.off('click')
			.off('mouseover')
			.off('mouseout');
    		
    		obj.outworkTxt
			.off('click')
			.off('mouseover')
			.off('mouseout');
		}
	}
	
//	function reconnect() {
//		hasSocketConntected = false;
//		reconAttemp++;
//		
//		if(reconAttemp > reconTotal) return;
//		
//		var reconInv = setTimeout(function() {
//			socket = new SockJS('/websocket'),
//			stompClient = Stomp.over(socket);
//			
//			stompClient.connect({}, function(frame) {
//				clearTimeout(reconInv);
//				successCallback();	    
//			}, function(error) {
//				reconnect();
//			});
//			
//		}, 5000);
//	}
//
//	stompClient.connect({}, function(frame) {
//		successCallback();	    
//	    
//	}, function(error) {
//		reconnect();
//	});
	
	
	
	function Seat(x, y, isSudo) {
		
		var group = draw.group();
		var rect = draw.rect(recW, recH).attr({
			x:x,
			y:y,
			fill: isSudo ? '#033' : recColor,
		});
		
//		var rect = draw.rect(recW, recH);
//		rect.attr({
//			x:x,
//			y:y,
//			fill: isSudo ? '#033' : recColor,
//		});
//		rect.select().resize();
		
		var rectVacation = draw.rect(recVacationW, recH).attr({
			x:x+120,
			y:y,
			fill: recColor
		});
		
		if(isSudo) {
			rect.radius(30, 30);
		}
		
		var rectCell = draw.rect(cellPhoneW, cellPhoneH).attr({
			x:x,
			y:y+recH,
			fill: cellColor
		});
		
		var rectPlan = draw.rect(planW, planH).attr({
			x:x,
			y:y+(recH-planH),
			fill:planColor,
		});
		
		var ownerTxt = draw.text('x').attr({x:50, y:50});
		ownerTxt.font({anchor: 'middle', size: 15, family: 'Helvetica'});
		ownerTxt.move(x + (recW/6), y + 10);
		
		var outworkTxt = draw.text('(외근)').attr({x:50, y:50});
		outworkTxt.font({anchor: 'middle', size: 15, family: 'Helvetica'});
		outworkTxt.fill(recColor);
		outworkTxt.move(x + (recW/6) + 50, y + 10);
		
		var phoneTxt = draw.text('- / -').attr({x:50, y:50});
		phoneTxt.font({anchor: 'middle', size: 13, family: 'Helvetica'});
		phoneTxt.fill('#fff');
		phoneTxt.move(x + (recW/3) + 5, y + recH + 3);
		
		var vacationTxt = draw.text('휴가').attr({x:50, y:50});
		vacationTxt.font({anchor: 'middle', size: 15, family: 'Helvetica', fill: recColor});
		vacationTxt.move(x + (recW/6) + 125, y + 17);
//		
//		var lblInner = draw.text('내선전화  ').attr({x:50, y:50});
//		lblInner.font({anchor: 'middle', size: 13, family: 'Helvetica'});
//		lblInner.fill('#fff');
//		lblInner.move(x + (recW/6), y + recH + cellPhoneH + 3);
		
		
		group.add(rect);
		group.add(rectVacation);
		group.add(rectCell);
		group.add(rectPlan);
		group.add(ownerTxt);
		group.add(outworkTxt);
		group.add(phoneTxt);
		group.add(vacationTxt);
		//group.add(lblInner);
		
		return {
			rect: rect,
			rectCell: rectCell,
			rectVacation: rectVacation,
			rectPlan: rectPlan,
			ownerTxt: ownerTxt,
			outworkTxt: outworkTxt, 
			phoneTxt: phoneTxt,
			vacationTxt: vacationTxt,
			hasPlan: false
		};
	}
	
	function imwonSeat(cnt) {
		var w = window.innerWidth;
		var lastStartY = 0;
		var seat = null;
		for(var i=0; i<cnt; i++) {
			seat = Seat(w - recW + recPadding, lastStartY = seatSpace * i);
			seatMap.push(seat);
			imwonSeatMap.push(seat);
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
			common.checkSession(viewTimeline);
		})
		.on('mouseover', function() {
			this.fill({ color : recColor, opacity: 0.3})
		})
		.on('mouseout', function() {
			this.fill({ color : recColor, opacity: 1})
		})
		
		var ownerTxt = draw.text('회의실(' + crCountStr + ')').attr({x:50, y:50});
		ownerTxt.font({anchor: 'middle', size: 25, family: 'Helvetica'});
		ownerTxt.move(x + (recW/4), y + 10);
		
		var obj = {
			rect: rect,
			ownerTxt: ownerTxt
		}
		
		conferenceMap.push(obj);
		seatMap.push(obj);
	}
	
	function viewTimeline() {
		var iframe = parent.Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'reservation', load: function(dom) {
			reservationContentWin = $(dom)[0].contentWindow;
		} });
		
		//console.log(iframe.getId());
		//$(iframe.el.dom).find('iframe')[0].contentWindow.t();
		var reserveWin = parent.Ext.create('Ext.window.Window', {
			title: '회의실 예약현황',
			iconCls: 'icon-reserved',
			height: 600,
			width: 800,
			layout: 'fit',
			closeAction: 'destroy',
			modal: true,
			draggable: false,
			resizable: false,
			items: [iframe],
			dockedItems: [{
			    xtype: 'toolbar',
			    dock: 'bottom',
			    ui: 'footer',
			    //defaults: {minWidth: minButtonWidth},
			    items: [
			        { xtype: 'component', flex: 1 },
			        { xtype: 'button', text: '시간설정', iconCls: 'icon-timer', listeners: {
			        	click: function() {
			        		//setConferenceTime();
			        		//reservationContentWin = $(iframe.el.dom).find('iframe')[0].contentWindow;
			        		TimeObj.ymd = reservationContentWin.getCurrentDate();
			        		common.checkSession(setConferenceTime);
			        	}
			        } },
			        { xtype: 'button', text: '닫기', iconCls: 'icon-close', listeners: {
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
			iconCls: 'icon-timer',
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
			        { xtype: 'button', text: '예약', iconCls: 'icon-reserved', listeners: {
			        	click: function() {
			        		reserve();
			        	}
			        } },
			        { xtype: 'button', text: '닫기', iconCls: 'icon-close', listeners: {
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
		var row7Y = div3Y + linePadding + lineWidth;
		
		makeRowSeat(4, 0);
		makeRowSeat(4, row2Y);
		drawDivider(0, div1Y, 4, div1Y);
		makeRowSeat(4, row3Y);
		makeRowSeat(4, row4Y);
		drawDivider(0, div2Y, 4, div2Y);
		makeRowSeat(4, row5Y);
		makeRowSeat(3, row6Y);
		drawDivider(0, div3Y, 3, div3Y);
		makeRowSeat(2, row7Y);
		var lastY = imwonSeat(4);
		makeConferenceSeat(window.innerWidth - recW + recPadding, lastY + seatSpace);
		
	}
	
	if(SVG.supported) {
		SVG.on(document, 'DOMContentLoaded', function() {
			draw = SVG('drawing').size('100%', 800);
			makeSeat();
			initSawonInfo();
			initSawonVacationInfo();
			initSawonPlanInfo();
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
				gotowork(sm, sawonList[i].isOutwork, sawonList[i].seatNum, sawonList[i].todayGeuntaeCode);
			}
		}
	}
	
	function initSawonVacationInfo() {
		vacationSawonList = $.parseJSON($('#vacation').val());
		
		for(var i=0, len=vacationSawonList.length; i<len; i++) {
			var sm = seatMap[vacationSawonList[i].seatNum];
			sm.rectVacation.attr({fill: '#033'});
			sm.vacationTxt.font({fill: '#fff'});
		}
	}
	
	function initSawonPlanInfo() {
		sawonPlanList = $.parseJSON($('#plan').val());
		
		for(var i=0, len=sawonPlanList.length; i<len; i++) {
			var sm = seatMap[sawonPlanList[i].seatNum];
			sm.hasPlan = true;
			sm.rectPlan.attr({fill: planActiveColor});
			sm.rectPlan
			.off('click')
			.off('mouseover')
			.off('mouseout')
			.on('click', (function(code) {
				return function() {
					planMarkClick(code);
				}
			})(sawonPlanList[i].planCode))
			.on('mouseover', function() {
				this.fill({ color : planActiveColor, opacity: 0.5})
			})
			.on('mouseout', function() {
				this.fill({ color : planActiveColor, opacity: 1})
			});
		}
	}
	
	function planMarkClick(planCode) {
		common.ajaxExt({
			url: '/calendar/plan/' + planCode,
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }, 
			loadmask: {
				msg: '일정로딩중 입니다.'
			},
			success: function(jo) {
				console.log(jo);
				var data = jo.datas[0];
				if(data) {
					openPlanWin(data);
				}
				else {
					common.showExtMsg({
						type: 'alert',
						msg: '정보가 없습니다.'
					});
				}
			}
		});
	}
	
	function openPlanWin(data) {
		var planWin = parent.Ext.create('Ext.window.Window', {
			title: '<span style="color:#0000FF;">' + data.sawonName + '</span>님의 오늘 일정',
			iconCls: 'icon-calendar',
			height: 600,
			width: 600,
			layout: 'fit',
			closeAction: 'destroy',
			modal: true,
			items: [{
				xtype: 'textarea',
				value: data.detail,
				readOnly: true
			}]  
		});
		
		planWin.show();
	}
	
	/*var Observer = parent.window.Observer;//parent.Ext.create('Drpnd.util.Observer');
	Observer.addWinResizeObserver(function(w, h) {
		var len = imwonSeatMap.length;
		for(var i=0; i<len; i++) {
			var rect = imwonSeatMap[i].rect;
			var y = rect.y();
			var currentX = rect.x();
			var x = window.innerWidth; //w - recW + recPadding;
			console.log(x + "/" + (x-recW+recPadding) + "/" + currentX);
			rect.dmove((x-recW+recPadding) - currentX , 0);
			//var y = rect.y();
			
			//rect.translate(w - recW + recPadding, y).attr({fill: recColor});
		}
	})*/
	
	var rtime;
	var timeout = false;
	var delta = 200;
	var currentWinWidth = window.innerWidth;
	
	$(window).resize(function() {
	    rtime = new Date();
	    if (timeout === false) {
	        timeout = true;
	        setTimeout(resizeend, delta);
	    }
	});

	function resizeend() {
	    if (new Date() - rtime < delta) {
	        setTimeout(resizeend, delta);
	    } 
	    else {
	        timeout = false;
	        var x = window.innerWidth;
	        
	        //console.log(currentWinWidth + "/" + x);
	        var len = imwonSeatMap.length;
			for(var i=0; i<len; i++) {
				var rect = imwonSeatMap[i].rect;
				var rectCell = imwonSeatMap[i].rectCell;
				var rectVacation = imwonSeatMap[i].rectVacation;
				var rectPlan = imwonSeatMap[i].rectPlan;
				var ownerTxt = imwonSeatMap[i].ownerTxt;
				var phoneTxt = imwonSeatMap[i].phoneTxt;
				var vacationTxt = imwonSeatMap[i].vacationTxt;
				var outworkTxt = imwonSeatMap[i].outworkTxt;
				
				 //w - recW + recPadding;
				console.log(Math.floor(ownerTxt.x()) + "/" + (Math.floor(ownerTxt.x()) - (currentWinWidth - x)));
				rect.dmove((x - recW + recPadding) - rect.x() , 0);
				rectCell.dmove((x - cellPhoneW + recPadding) - rectCell.x(), 0);
				rectVacation.dmove((x - recVacationW + recPadding) - rectVacation.x(), 0);
				rectPlan.dmove((x - recW + recPadding) - rectPlan.x(), 0);
				
				ownerTxt.move(Math.floor(ownerTxt.x()) - (currentWinWidth - x), ownerTxt.y());
				phoneTxt.move(Math.floor(phoneTxt.x()) - (currentWinWidth - x), phoneTxt.y());
				vacationTxt.move(Math.floor(vacationTxt.x()) - (currentWinWidth - x), vacationTxt.y());
				outworkTxt.move(Math.floor(outworkTxt.x()) - (currentWinWidth - x), outworkTxt.y());
			}
			
			var conferenceRect = conferenceMap[0].rect;
			var conferenceOwnerTxt = conferenceMap[0].ownerTxt;
			conferenceRect.dmove((x - recW + recPadding) - conferenceRect.x() , 0);
			conferenceOwnerTxt.move(Math.floor(conferenceOwnerTxt.x()) - (currentWinWidth - x), conferenceOwnerTxt.y());
			
			currentWinWidth = x;
	    }               
	}
	
}());