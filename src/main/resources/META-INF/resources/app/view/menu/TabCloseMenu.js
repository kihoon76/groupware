Ext.define('Drpnd.view.menu.TabCloseMenu', {
	extend : 'Ext.menu.Menu'
   ,xtype  : 'tabmenu'
   ,width  : 200
   ,items  : [{
	    text   : '현재탭 닫기'
	   ,itemId : 'currentClose'
	}, '-', {
		text   : '모든탭 닫기'
	   ,itemId : 'closeAll'
	}, '-', {
		text   : '현재탭 제외하고 모든탭 닫기'
	   ,itemId : 'closeOthers'
	}]
});