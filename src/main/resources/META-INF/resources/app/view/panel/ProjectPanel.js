Ext.define('Drpnd.view.panel.ProjectPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.projectpanel',
	requires:['Drpnd.util.CommonFn'],
	initComponent: function() {
		var CommonFn = Drpnd.util.CommonFn;
		
		Ext.apply(this, {
			items: Ext.create('Drpnd.view.iframe.BaseIframe', { url: '/project/newproject', load: function(dom) {
	    		
	    	} }),
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
				text: '프로젝트 생성',
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
					
				}
			}
		});
		
		this.callParent(arguments);
	}
});