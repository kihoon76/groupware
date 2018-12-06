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
		
		var ownerTxt = draw.text('').attr({x:50, y:50});
		ownerTxt.font({anchor: 'middle', size: 15, family: 'Helvetica'});
		ownerTxt.move(x + (recW/6), y + 10);
		
		var phoneTxt = draw.text('010-0000-0000 / 6790').attr({x:50, y:50});
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
			reservation();
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
	
	function reservation() {
		var reserveWin = parent.Ext.create('Ext.window.Window', {
			title: '회의실 예약현황',
			height: 800,
			width: 800,
			layout: 'fit',
			closeAction: 'destroy',
			modal: true,
			draggable: false,
			items: [parent.Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'reservation' })],
			dockedItems: [{
			    xtype: 'toolbar',
			    dock: 'bottom',
			    ui: 'footer',
			    //defaults: {minWidth: minButtonWidth},
			    items: [
			        { xtype: 'component', flex: 1 },
			        { xtype: 'button', text: '예약하기' },
			        { xtype: 'button', text: '닫기', listeners: {
			        	click: function(btn) {
			        		reserveWin.close();
			        	}
			        } }
			    ]
			}]  
			    
		})
		
		
		reserveWin.show();
	
	}
	
	function makeSeat() {
		var row2Y = seatSpace;
		var div1Y = row2Y + divH;
		var row3Y = div1Y + linePadding + lineWidth;
		var row4Y = row3Y + seatSpace;
		var div2Y = row4Y + divH;
		var row5Y = div2Y + linePadding + lineWidth;
		var row6Y = row5Y + seatSpace;
		
		makeRowSeat(4, 0);
		makeRowSeat(4, row2Y);
		drawDivider(0, div1Y, 4, div1Y);
		makeRowSeat(4, row3Y);
		makeRowSeat(4, row4Y);
		drawDivider(0, div2Y, 4, div2Y);
		makeRowSeat(4, row5Y);
		makeRowSeat(3, row6Y);
		var lastY = imwonSeat(4);
		makeConferenceSeat(window.innerWidth - recW + recPadding, lastY + seatSpace);
		
	}
	
	if(SVG.supported) {
		SVG.on(document, 'DOMContentLoaded', function() {
			draw = SVG('drawing').size('100%', 800);
			makeSeat();
		});
	}
	else {
		$('#drawing').html('SVG를 지원하지 않는 브라우저 입니다.')
	}
	
}());