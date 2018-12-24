Ext.define('Drpnd.controller.MainController', {
	extend: 'Drpnd.controller.BaseController',
	requires: ['Drpnd.util.ErrorCode'],
	views: ['panel.CategoryPanel'],
	onLaunch : function() {
		this.addContentTabPanel(
				'cate-main',
				'일정관리',
				Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'calendar/view' }),
				false);
		
		this.addContentTabPanel(
				'cate-drawing',
				'오늘의 근태상황',
				Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'floormap' }),
				false);
		
		this.callParent(arguments);
	},
	onItemClick: function() {}
});