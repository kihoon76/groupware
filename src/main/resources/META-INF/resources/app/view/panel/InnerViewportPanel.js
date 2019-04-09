Ext.define('Drpnd.view.panel.InnerViewportPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.innerviewport',
	initComponent: function() {
		var that = this;
		var calendarWin = null;
		var currentYear = Ext.getBody().getAttribute('data-date').substring(0, 4);
		var mask = null;
		
		var listTree = Ext.create('Ext.tree.Panel', {
			rootVisible : false,
			store: Ext.create('Ext.data.TreeStore', {
				autoload:true,
				proxy: {
					type : 'ajax'
			 	   ,url : Drpnd.util.CommonFn.getFullUrl('calendar/view/companyevent/list') //Drpnd.util.Constants.context + '/code/department'
			 	   ,actionMethods : 'POST'
			 	   ,reader : {
			 		   type : 'json'
			 	      ,root : 'datas'
			 	   }
			 	   ,listeners: {
			 		   exception: function(proxy, response, operation, eOpts) {
			 			   console.log(response)
			 		   }
			 	   }
			 	}
			}),
    	    listeners: {
    	    	itemclick: function(tree, record) {
    	    		calendarWin.getCompanyEvents(record.internalId, record.raw.startDate, record.raw.endDate);
    	    	}
    	    }
		});
		
		Ext.apply(this, {
			width: 500,
	        height: 400,
	        //title: 'Border Layout',
	        layout: 'border',
	        items: [{
	            title: '일정상세',
	            region: 'south',     // position for region
	            xtype: 'panel',
	            height: 300,
	            split: true,         // enable resizing
	            margins: '0 5 5 5'
	        },{
	            // xtype: 'panel' implied by default
	            title: '일정목록(' + currentYear + '년도)',
	            region:'west',
	            //xtype: 'treepanel',
	            items:[listTree],
	            margins: '5 0 0 5',
	            width: 200,
	            split: true,
	            collapsible: true,   // make collapsible
	            id: 'west-region-container',
	            layout: 'fit'
	        },{
	            title: '일정 캘린더',
	            region: 'center',     // center region is required, no width/height specified
	            //xtype: 'panel',
	            items: Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'calendar/view/companyevent', load: function(dom) {
	            	calendarWin = dom.contentWindow;
	            	calendarWin.setObject(mask);
				} }),
	            layout: 'fit',
	            margins: '5 5 0 0'
	        }],
	        listeners: {
	        	afterrender: function(panel) {
	        		mask = new Ext.LoadMask(that, {msg: '목록과 캘린더 로딩중입니다.'});
	        		mask.show();
	        	}
	        }
		});
		
		this.callParent(arguments);
	}
});