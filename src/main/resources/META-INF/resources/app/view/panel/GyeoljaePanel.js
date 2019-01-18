Ext.define('Drpnd.view.panel.GyeoljaePanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.gyeoljaepanel',
	requires:['Drpnd.util.CommonFn'],
	initComponent: function() {
		var CommonFn = Drpnd.util.CommonFn;
		
		var itemObj = {};
		var that = this;
		
		var btnOverview = null;
		var btnReceiveBox = null;
		var btnSansinBox = null;
		var btnKeepBox = null;
		var btnNewGyeoljae = null;
		var activeColor = '#17a2b8';
		
		function activeButtonCSS(activeBtn) {
			if(activeBtn == 'OVERVIEW') {
				btnOverview.getEl().setStyle('background-color', activeColor);
			}
			else {
				btnOverview.getEl().setStyle('background-color', 'transparent');
			}
			
			if(activeBtn == 'RECEIVE_BOX') {
				btnReceiveBox.getEl().setStyle('background-color', activeColor);
			}
			else {
				btnReceiveBox.getEl().setStyle('background-color', 'transparent');
			}
			
			if(activeBtn == 'SANGSIN_BOX') {
				btnSansinBox.getEl().setStyle('background-color', activeColor);
			}
			else {
				btnSansinBox.getEl().setStyle('background-color', 'transparent');
			}
			
			if(activeBtn == 'KEEP_BOX') {
				btnKeepBox.getEl().setStyle('background-color', activeColor);
			}
			else {
				btnKeepBox.getEl().setStyle('background-color', 'transparent');
			}
			
			if(activeBtn == 'NEW_GYEOLJAE') {
				btnNewGyeoljae.getEl().setStyle('background-color', activeColor);
			}
			else {
				btnNewGyeoljae.getEl().setStyle('background-color', 'transparent');
			}
			
			
		}
		
		function clearItems() {
			var record = that.items.items;
			var recordLen = record.length;
			
			if(recordLen == 1) {
				var r = record[0];
				record.remove(r);
			}
		}
		
		function addItem(obj) {
			clearItems();
			that.add(obj);
			rerender();
		}
		
		function rerender() {
			that.update();
			that.doLayout();
		}
		
		//새결재
		function newGyeoljaeClick() {
			activeButtonCSS('NEW_GYEOLJAE');
			CommonFn.checkSession(function() {
				var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'gyeoljae/view/new' });
				addItem(iframe);
			});
		}
		
		//요약
		function overviewClick(isNotSessionCheck) {
			activeButtonCSS('OVERVIEW');
			if(isNotSessionCheck) {
				var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'gyeoljae/view/overview' });
				addItem(iframe);
			}
			else {
				CommonFn.checkSession(function() {
					var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'gyeoljae/view/overview' });
					addItem(iframe);
				});
			}
		}
		
		//수신함
		function receiveBoxClick() {
			activeButtonCSS('RECEIVE_BOX');
		}
		
		//상신함
		function sangsinBoxClick() {
			activeButtonCSS('SANGSIN_BOX');
		}
		
		//보관함
		function keepBoxClick() {
			activeButtonCSS('KEEP_BOX');
			CommonFn.checkSession(function() {
				var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'gyeoljae/view/keepbox' });
				addItem(iframe);
			});
		}
		
		Ext.apply(this, {
			items: itemObj,
			layout: 'fit',
			tbar: [{
				xtype: 'button',
				text: '요약',
				listeners: {
					click: function(btn) {
						overviewClick();
					},
					afterrender: function(btn) {
						btnOverview = btn;
					}
				}
			}, '-', {
				xtype: 'button',
				text: '수신함',
				listeners: {
					click: function() {
						receiveBoxClick();
					},
					afterrender: function(btn) {
						btnReceiveBox = btn;
					}
				}
			}, '-', {
				xtype: 'button',
				text: '상신함',
				listeners: {
					click: function() {
						sangsinBoxClick();
					},
					afterrender: function(btn) {
						btnSansinBox = btn;
					}
				}
			}, '-', {
				xtype: 'button',
				text: '보관함',
				listeners: {
					click: function() {
						keepBoxClick();
					},
					afterrender: function(btn) {
						btnKeepBox = btn;
					}
				}
			}, '-', {
				xtype: 'button',
				text: '새결재',
				iconCls: 'icon-add',
				listeners: {
					click: function(btn) {
						newGyeoljaeClick();
					},
					afterrender: function(btn) {
						btnNewGyeoljae = btn;
					}
				}
			}],
			listeners: {
				afterrender: function() {
					overviewClick(true);
				}
			}
		});
		
		this.callParent(arguments);
	}
});