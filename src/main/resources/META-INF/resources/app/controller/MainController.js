Ext.define('Drpnd.controller.MainController', {
	extend: 'Drpnd.controller.BaseController',
	views: ['panel.CategoryPanel'],
	onLaunch : function() {
		
		this.addContentTabPanel(
				'cate-main',
				'일정관리',
				Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'calendar/view' }),
				false);
		
		this.callParent(arguments);
	},
	onItemClick: function() {}
});