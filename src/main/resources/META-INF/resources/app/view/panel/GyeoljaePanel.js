Ext.define('Drpnd.view.panel.GyeoljaePanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.gyeoljaepanel',
	requires:['Drpnd.util.CommonFn'],
	initComponent: function() {
		var itemObj = {
			html: 'yy'
		};
		var that = this;
		
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
		
		function newGyeoljaeClick() {
			var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'gyeoljae/view/new' });
			addItem(iframe);
		}
		
		function overviewClick() {
			var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'gyeoljae/view/overview' });
			addItem(iframe);
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
					}
				}
			}, '-', {
				xtype: 'button',
				text: '수신함'
			}, '-', {
				xtype: 'button',
				text: '상신함'
			}, '-', {
				xtype: 'button',
				text: '보관함'
			}, '-', {
				xtype: 'button',
				text: '새결재',
				iconCls: 'icon-add',
				listeners: {
					click: function(btn) {
						newGyeoljaeClick();
					}
				}
			}]
		});
		
		this.callParent(arguments);
	}
});