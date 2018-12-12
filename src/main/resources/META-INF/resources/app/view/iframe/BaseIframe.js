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
				},
				listeners: {
					afterrender: function() {
						var obj = this.getEl();
						obj.on('load', function() {
							if(that.param.load) {
								that.param.load(Ext.getDom(obj));
							}
						});
					}
				}
			}]
		});
		
		this.callParent(arguments);
	}
});