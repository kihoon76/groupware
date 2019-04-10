Ext.define('Drpnd.view.panel.VacationHistoryPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.vacationhistory',
	initComponent: function() {
	
		var historyGrid = null;
		
		try {
			var sawonStore = Ext.create('Drpnd.store.SawonListStore');
			var historyStore = Ext.create('Drpnd.store.VacationHistoryListStore');
		}
		catch(e) {
			console.log(e);
		}
		
		Ext.apply(this, {
			width: 500,
	        height: 400,
	        layout: 'border',
	        items: [{
	            title: '사원정보',
	            region:'west',
	            xtype: 'panel',
	            items: [{
	            	xtype: 'grid',
	            	store: sawonStore,
	    			columns: [{
	    				text: '아이디',
	    				dataIndex: 'sawonId',
	    				flex: 0
	    			}, {
	    				text: '직급',
	    				dataIndex: 'sawonPosition',
	    				flex: 0
	    			}, {
	    				text: '사원명',
	    				dataIndex: 'sawonName',
	    				flex: 1
	    			}],
	            }],
	            margins: '5 0 0 5',
	            width: 300,
	            split: true,
	            collapsible: true,   // make collapsible
	            layout: 'fit'
	        },{
	            title: '휴가내역',
	            region: 'center',     // center region is required, no width/height specified
	            xtype: 'panel',
	            items: [{
	            	xtype: 'grid',  
	            	store: sawonStore,
	    			columns: [{
	    				text: '타입',
	    				dataIndex: 'vType',
	    				flex: 0
	    			}, {
	    				text: '시작일',
	    				dataIndex: 'vStartDate',
	    				flex: 0
	    			}, {
	    				text: '종료일',
	    				dataIndex: 'vEndDate',
	    				flex: 0
	    			}, {
	    				text: '기간',
	    				dataIndex: 'vTerm',
	    				flex: 0
	    			}, {
	    				text: '내용',
	    				dataIndex: 'vContent',
	    				flex: 1
	    			}],
	            	listeners: {
	            		afterrender: function(grid) {
	            			historyGrid = grid;
	            		}
	            	}
	            }],
	            layout: 'fit',
	            margins: '5 5 0 0'
	        }],
	        listeners: {
	        	afterrender: function(panel) {
	        		
	        	}
	        }
		});
		
		this.callParent(arguments);
	}
});