Ext.define('Drpnd.controller.MainController', {
	extend: 'Drpnd.controller.BaseController',
	requires: ['Drpnd.util.ErrorCode', 'Drpnd.custom.Socket', 'Drpnd.util.Html'],
	views: [
	     'panel.CategoryPanel', 
	     'panel.OverworkChartPanel', 
	     'panel.GyeoljaePanel', 
	     'panel.ProjectPanel', 
	     'panel.InnerViewportPanel',
	     'panel.NormalDocsGridPanel',
	     'panel.VacationHistoryPanel',
	     'panel.OverworkHistoryPanel',
	     'panel.KakaomapPanel'
	],
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
					this.addContentTabPanel(
						recObj.id, 
						recObj.text, 
						Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'view/orgchart' })
					);
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
				case 'statistics-overwork-history' :
					this.addContentTabPanel(recObj.id, recObj.text, {
						xtype: 'overworkhistorypanel',
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
		else if(recObj.leaf && recObj.cate == 'company') {
			if(!this.categoryPanel.isAttachedCategory(recObj.id)) {
				this.addContentTabPanel(recObj.id, recObj.text, {
					xtype: 'innerviewport',
				});
			}
			else {
				this.contentPanel.setActiveTab(recObj.id + '-panel');
			}
		}
		else if(recObj.leaf && recObj.cate == 'docs') {
			switch(recObj.id) {
			case 'docs-normal':
				if(!this.categoryPanel.isAttachedCategory(recObj.id)) {
					this.addContentTabPanel(recObj.id, recObj.text, {
						xtype: 'normaldocsgrid',
					});
				}
				else {
					this.contentPanel.setActiveTab(recObj.id + '-panel');
				}
				break;
			}
		}
		else if(recObj.leaf && recObj.cate == 'help') {
			if(!this.categoryPanel.isAttachedCategory(recObj.id)) {
				this.addContentTabPanel(recObj.id, '이용안내(' + recObj.text + ')', Ext.create('Drpnd.view.iframe.BaseIframe', { url: recObj.url}));
			}
			else {
				this.contentPanel.setActiveTab(recObj.id + '-panel');
			}
		}
		else if(recObj.leaf && recObj.cate == 'vacation') {
			if(!this.categoryPanel.isAttachedCategory(recObj.id)) {
				this.addContentTabPanel(recObj.id, recObj.text, {
					xtype: 'vacationhistory',
				});
			}
			else {
				this.contentPanel.setActiveTab(recObj.id + '-panel');
			}
		}
		else if(recObj.leaf && recObj.cate == 'photo') {
			if(!this.categoryPanel.isAttachedCategory(recObj.id)) {
				switch(recObj.id) {
				case 'photo-list' :
					this.addContentTabPanel(recObj.id, recObj.text, {
						xtype: 'kakaopanel',
					});
					/*
					this.addContentTabPanel(
						recObj.id, 
						recObj.text, 
						Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'view/photos' })
					);
					*/
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