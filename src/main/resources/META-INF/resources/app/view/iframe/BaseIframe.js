Ext.define('Drpnd.view.iframe.BaseIframe', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.baseiframe',
	uses: ['Drpnd.util.CommonFn'],
	layout: 'fit',
	constructor: function() {
		this.param = arguments[0];
		this.callParent(arguments);
	},
	initComponent: function() {
		var that = this;
		Ext.apply(this, {
			items: [{
				xtype: 'box',
				autoEl: {
					tag: 'iframe',
					frameborder: 0,
					src: Drpnd.util.CommonFn.getFullUrl(that.param.url)
				}
			}]
		});
		
		this.callParent(arguments);
	}
});