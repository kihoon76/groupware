Ext.define('Drpnd.controller.MainController', {
	extend: 'Drpnd.controller.BaseController',
	requires: ['Drpnd.util.ErrorCode', 'Drpnd.custom.Socket'],
	views: ['panel.CategoryPanel'],
	onLaunch : function() {
		this.addContentTabPanel(
				'cate-main',
				'캘린더',
				Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'calendar/view' }),
				false);
		
		this.addContentTabPanel(
				'cate-drawing',
				'오늘의 근태',
				Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'floormap' }),
				false);
		
		this.callParent(arguments);
	},
	onItemClick: function() {}
});