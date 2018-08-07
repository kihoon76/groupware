Ext.define('Drpnd.controller.CalendarController', {
	extend: 'Drpnd.controller.BaseController',
	views: ['panel.CategoryPanel'],
	onLaunch : function() {
		this.callParent(arguments);
	},
	onItemClick : function(tree, record, item, idx, e) {
		var recObj = record.raw;
		
		if(recObj.leaf) {
			if(!this.categoryPanel.isAttachedCategory(recObj.id)) {
				switch(recObj.id) {
				case 'cate-geuntae-overwork' :
					this.addContentTabPanel(
							recObj.id,
							recObj.text,
							Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'calendar/view' }));
					break;
				default :
					break;
				}
			}
			else {
				this.contentPanel.setActiveTab(recObj.id + '-panel');
			}
		}
	}
});