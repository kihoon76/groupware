Ext.define('Drpnd.view.panel.ProjectPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.projectpanel',
	requires:['Drpnd.util.CommonFn'],
	initComponent: function() {
		var CommonFn = Drpnd.util.CommonFn;
		var activeColor = '#ccffff';
		var btnNewWBS = null;
		var btnMyWBS = null;
		var btnListWBS = null;
		var newWBSWin = null;
		var myWBSWin = null;
		var listWBSWin = null;
		var that = this;
		
		function activeButtonCSS(activeBtn) {
			if(activeBtn == 'NEW_WBS') {
				btnNewWBS.getEl().setStyle('background-color', activeColor);
			}
			else {
				btnNewWBS.getEl().setStyle('background-color', 'transparent');
			}
			
			if(activeBtn == 'LIST_WBS') {
				btnListWBS.getEl().setStyle('background-color', activeColor);
			}
			else {
				btnListWBS.getEl().setStyle('background-color', 'transparent');
			}
			
			if(activeBtn == 'MY_WBS') {
				btnMyWBS.getEl().setStyle('background-color', activeColor);
			}
			else {
				btnMyWBS.getEl().setStyle('background-color', 'transparent');
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
		
		
		//WBS생성
		function newWBSClick() {
			activeButtonCSS('NEW_WBS');
			CommonFn.checkSession(function() {
				var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: '/project/newwbs', load: function(dom) {
					newWBSWin = dom.contentWindow;
				} });
				addItem(iframe);
			});
		}
		
		//나의 WBS
		function myWBSClick() {
			activeButtonCSS('MY_WBS');
			CommonFn.checkSession(function() {
				var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: '/project/mywbs', load: function(dom) {
					myWBSWin = dom.contentWindow;
				} });
				addItem(iframe);
			});
		}
		
		//WBS 리스트
		function listWBSClick() {
			activeButtonCSS('LIST_WBS');
			CommonFn.checkSession(function() {
				var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: '/project/listwbs', load: function(dom) {
					listWBSWin = dom.contentWindow;
				} });
				addItem(iframe);
			});
		}
		
		Ext.apply(this, {
			items: {},
			layout: 'fit',
			tbar: [/*{
				xtype: 'button',
				text: '요약',
				iconCls: 'icon-gyeoljae-overview',
				qtip: '★ 상신함,수신함 최근 5개만 요약해서 보여줍니다.<br/>★ 전체 항목이나 검색기능은 각각 보관함에서 가능합니다.',
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
			}, '-', */{
				xtype: 'button',
				text: 'WBS 생성',
				iconCls: 'icon-gyeoljae-new',
				listeners: {
					click: function(btn) {
						newWBSClick();
					},
					afterrender: function(btn) {
						btnNewWBS = btn;
					}
				}
			}, '-', {
				xtype: 'button',
				text: '나의 WBS',
				iconCls: 'icon-myproject',
				listeners: {
					click: function(btn) {
						myWBSClick();
					},
					afterrender: function(btn) {
						btnMyWBS = btn;
					}
				}
			}, '-', {
				xtype: 'button',
				text: 'WBS 리스트',
				iconCls: 'icon-project',
				listeners: {
					click: function(btn) {
						listWBSClick();
					},
					afterrender: function(btn) {
						btnListWBS = btn;
					}
				}
			}],
			listeners: {
				afterrender: function() {
					newWBSClick();
				}
			}
		});
		
		this.callParent(arguments);
	}
});