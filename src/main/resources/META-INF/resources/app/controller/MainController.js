Ext.define('Drpnd.controller.MainController', {
	extend: 'Drpnd.controller.BaseController',
	requires: ['Drpnd.util.ErrorCode', 'Drpnd.custom.Socket', 'Drpnd.util.Html'],
	views: ['panel.CategoryPanel', 'panel.OverworkChartPanel', 'panel.GyeoljaePanel', 'panel.ProjectPanel'],
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
		
		this.html = Drpnd.util.Html;
		//console.log(html.organizationchart)
	},
	onItemClick : function(tree, record, item, idx, e) {
		var recObj = record.raw;
		var that = this;
		if(recObj.leaf && recObj.cate == 'system') {
			if(!this.categoryPanel.isAttachedCategory(recObj.id)) {
				switch(recObj.id) {
				case 'system-list' :
					this.addContentTabPanel(recObj.id, recObj.text, {
						xtype: 'panel',
						html: that.html.organizationchart
					});
					break;
				default :
					break;
				}
			}
			else {
				this.contentPanel.setActiveTab(recObj.id + '-panel');
			}
		}
		else if(recObj.leaf && recObj.cate == 'statistics') {
			if(!this.categoryPanel.isAttachedCategory(recObj.id)) {
				switch(recObj.id) {
				case 'statistics-overwork' :
					this.addContentTabPanel(recObj.id, recObj.text, {
						xtype: 'overworkpanel',
					});
					break;
				default :
					break;
				}
			}
			else {
				this.contentPanel.setActiveTab(recObj.id + '-panel');
			}
		}
		else if(recObj.leaf && recObj.cate == 'gyeoljae') {
			if(!this.categoryPanel.isAttachedCategory(recObj.id)) {
				this.addContentTabPanel(recObj.id, recObj.tabText, {
					xtype: 'gyeoljaepanel',
				});
			}
			else {
				this.contentPanel.setActiveTab(recObj.id + '-panel');
			}
		}
		else if(recObj.leaf && recObj.cate == 'project') {
			if(!this.categoryPanel.isAttachedCategory(recObj.id)) {
				this.addContentTabPanel(recObj.id, recObj.text, {
					xtype: 'projectpanel',
				});
			}
			else {
				this.contentPanel.setActiveTab(recObj.id + '-panel');
			}
		}
	}
});