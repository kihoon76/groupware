Ext.define('Drpnd.view.panel.VacationHistoryPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.vacationhistory',
	initComponent: function() {
	
		var historyGrid = null;
		var centerPanel = null;
		
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
	            title: '사원정보<span style="color:#0000ff;">(사원을 클릭하세요)</span>',
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
	    			listeners: {
	    				itemclick: function(t, record) {
	    					var raw = record.raw;
	    					var sawonCode = raw.sawonCode;
	    					centerPanel.setTitle('휴가내역 (<span style="color:#0000ff;">' + raw.sawonName + '(' + raw.sawonId + ')</span>)<span style="color:#0000ff;">-★ 내역은 결재완료된 것만 나타냅니다.</span>');
	    					historyGrid.getStore().load({params:{sawonCode: sawonCode}});
	    				}
	    			}
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
	            	store: historyStore,
	            	viewConfig: {
	            		preserveScrollOnRefresh: true,
	                    deferEmptyText         : true,
	                    emptyText              : '<div class="grid-data-empty"><div data-icon="/" class="empty-grid-icon"></div><div class="empty-grid-headline">휴가내역이 존재하지 않습니다.</div></div>'
	                },
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
	    				flex: 0,
	    				renderer: function(v) {
	    					if(v) {
	    						if(v == -1) {
	    							v = '0.5';
	    						}
	    						v = v + '일';
	    					}
	    					
	    					return v;
	    				}
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
	            margins: '5 5 0 0',
	            listeners: {
	            	afterrender: function(panel) {
	            		centerPanel = panel;
	            	}
	            }
	        }],
	        listeners: {
	        	afterrender: function(panel) {
	        		
	        	}
	        }
		});
		
		this.callParent(arguments);
	}
});