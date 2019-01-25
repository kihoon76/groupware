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
		var activeColor = '#ccffff';
		
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
			CommonFn.checkSession(function() {
				var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'gyeoljae/view/receivedbox' });
				addItem(iframe);
			});
		}
		
		//상신함
		function sangsinBoxClick() {
			activeButtonCSS('SANGSIN_BOX');
			CommonFn.checkSession(function() {
				var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'gyeoljae/view/sangsinbox' });
				addItem(iframe);
			});
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
				iconCls: 'icon-gyeoljae-overview',
				qtip: '★ 상신함,수신함 최근 5개만 요약해서 보여줍니다.<br/>★ 전체 항목이나 검색기능은 각각 보관함에서 처리하세요. ',
				listeners: {
					click: function(btn) {
						overviewClick();
					},
					afterrender: function(btn) {
						btnOverview = btn;
					},
					render: function(c) {
						Ext.QuickTips.register({
		                    target: c.getEl(),
		                    text: c.qtip,
		                    showDelay: 1 
		                });
					}
				}
			}, '-', {
				xtype: 'button',
				text: '수신함',
				qtip: '★ 내가 결재해야 할 기안 보관함',
				iconCls: 'icon-gyeoljae-receive',
				listeners: {
					click: function() {
						receiveBoxClick();
					},
					afterrender: function(btn) {
						btnReceiveBox = btn;
					},
					render: function(c) {
						Ext.QuickTips.register({
		                    target: c.getEl(),
		                    text: c.qtip,
		                    showDelay: 1 
		                });
					}
				}
			}, '-', {
				xtype: 'button',
				text: '상신함',
				qtip: '★ 내가 올린 기안 보관함',
				iconCls: 'icon-gyeoljae-sangsin',
				listeners: {
					click: function() {
						sangsinBoxClick();
					},
					afterrender: function(btn) {
						btnSansinBox = btn;
					},
					render: function(c) {
						Ext.QuickTips.register({
		                    target: c.getEl(),
		                    text: c.qtip,
		                    showDelay: 1 
		                });
					}
					
				}
			}, '-', {
				xtype: 'button',
				text: '보관함',
				iconCls: 'icon-gyeoljae-keepbox',
				qtip: '★ 결재완료된 내 기안 보관함<br/>★ 반려된 내 기안은 상신함이나 요약에서 확인하세요',
				listeners: {
					click: function() {
						keepBoxClick();
					},
					afterrender: function(btn) {
						btnKeepBox = btn;
					},
					render: function(c) {
						Ext.QuickTips.register({
		                    target: c.getEl(),
		                    text: c.qtip,
		                    showDelay: 1 
		                });
					}
				}
			}, '-', {
				xtype: 'button',
				text: '새결재',
				iconCls: 'icon-gyeoljae-new',
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
					overviewClick();
				}
			}
		});
		
		this.callParent(arguments);
	}
});