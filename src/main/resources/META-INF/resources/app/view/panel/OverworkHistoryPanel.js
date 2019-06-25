Ext.define('Drpnd.view.panel.OverworkHistoryPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.overworkhistorypanel',
	requires:['Drpnd.util.CommonFn'],
	initComponent: function() {
		var historyGrid = null;
		var centerPanel = null;
		
		var CommonFn = Drpnd.util.CommonFn;
		var dateObj = new Date();
		var currentYear = dateObj.getFullYear();
		var currentMonth = dateObj.getMonth();
		var yearNumField = null;
		var comboSel = null;
		var comboMonth = null;
		var selectedSawonCode = null;
		var total = 0;
		var totalHour = 0;
		
		try {
			var sawonStore = Ext.create('Drpnd.store.SawonListStore');
			var historyStore = Ext.create('Drpnd.store.OverworkHistoryListStore');
			historyStore.on('load', function(t, r, s) {
				if(!s) {
					t.removeAll();
				}
				else {
					t.add({
						overworkDate: '', 
						startDate: '', 
						endDate: '', 
						fromSix: '', 
						overworkYoil: '', 
						overworkTime: -1000
					});
				}
			})
		}
		catch(e) {
			console.log(e);
		}
		
		function search() {
			if(selectedSawonCode) {
				var searchMonth = comboMonth.getValue();
				var searchYear = yearNumField.getValue();
				
				historyGrid.getStore().load({params:{
					sawonCode: selectedSawonCode,
					searchYear: searchYear,
					searchMonth: searchMonth
				}});
			}
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
	    					selectedSawonCode = sawonCode;
	    					
	    					centerPanel.setTitle('야근내역 (<span style="color:#0000ff;">' + raw.sawonName + '(' + raw.sawonId + ')</span>)<span style="color:#0000ff;">-★ 내역은 (월,화,목 19시 - 22시) 야근수당 지급 기준으로 나타낸 것입니다.</span>');
	    					
	    					historyGrid.getStore().load({params:{
	    						sawonCode: sawonCode,
	    						searchYear: yearNumField.getValue(),
	    						searchMonth: comboMonth.getValue()
	    					}});
	    				}
	    			}
	            }],
	            margins: '5 0 0 5',
	            width: 300,
	            split: true,
	            collapsible: true,   // make collapsible
	            layout: 'fit'
	        },{
	            title: '야근내역',
	            region: 'center',     // center region is required, no width/height specified
	            xtype: 'panel',
	            tbar:[{
					xtype: 'numberfield',
					value: currentYear,
					width: 100,
					editable: false,
					listeners: {
						afterrender: function(num) {
							yearNumField = num;
						}
					}
				},'년',{
					xtype: 'combobox',
					queryMode: 'local',
					width: 100,
			    	displayField: 'name',
			    	valueField: 'value',
			    	editable: false,
			    	store: Ext.create('Ext.data.Store', {
						fields : ['name', 'value'],
						data: CommonFn.getMonthComboData()
					}),
					value:currentMonth + 1,
					listeners: {
						afterrender: function(combo) {
							comboMonth = combo;
						}
					}
				},{
					xtype: 'button',
					iconCls: 'icon-search',
					text: '검색',
					listeners: {
						click: function(btn) {
							search();
						}
					}
				}],
	            items: [{
	            	xtype: 'grid',  
	            	store: historyStore,
	            	viewConfig: {
	            		preserveScrollOnRefresh: true,
	                    deferEmptyText         : true,
	                    emptyText              : '<div class="grid-data-empty"><div data-icon="/" class="empty-grid-icon"></div><div class="empty-grid-headline">조회할수 없습니다.</div></div>'
	                },
	    			columns: [{
	    				text: '야근기준일자',
	    				dataIndex: 'overworkDate',
	    				flex: 0,
	    				align: 'center'
	    			}, {
	    				text: '출근시간',
	    				dataIndex: 'startDate',
	    				flex: 1,
	    				align: 'center'
	    			}, {
	    				text: '퇴근시간',
	    				dataIndex: 'endDate',
	    				flex: 1,
	    				align: 'center'
	    			}, {
	    				text: '야근요일',
	    				dataIndex: 'overworkYoil',
	    				flex: 0,
	    				align: 'center',
	    				renderer: function(v) {
	    					var s = '';
	    					switch(v) {
	    					case '0':
	    						s = '월요일';
	    						break;
	    					case '1':
	    						s = '화요일';
	    						break;
	    					case '2':
	    						s = '수요일';
	    						break;
	    					case '3':
	    						s = '목요일';
	    						break;
	    					case '4':
	    						s = '금요일';
	    						break;
	    					case '5':
	    						s = '토요일';
	    						break;
	    					case '-1':
	    						s = '일요일';
	    						break;
	    					}
	    					
	    					return s;
	    				}
	    				
	    			}, {
	    				text: '야근6시부터',
	    				dataIndex: 'fromSix',
	    				flex: 0,
	    				align: 'center',
	    				renderer: function(v) {
	    					if(v == 'Y') {
	    						v = '<img src="/resources/images/check-mark-3-16.png">';
	    					}
	    					else {
	    						v = '';
	    					}
	    					
	    					return v;
	    				}
	    			}, {
	    				text: '야근시간',
	    				dataIndex: 'overworkTime',
	    				flex: 1,
	    				renderer: function(v) {
	    					var s = '';
	    					var h = 0;
	    					if(v && !isNaN(v)) {
	    						if(v == -1000) {
	    							s  = '<span style="color:#f00;">총 야근시간: ' + total + '분</span>';
	    							s += '/(<span style="color:#f00;font-weight:bold;">' + totalHour + '</span>시간 | <span style="color:#f00;font-weight:bold;">' + parseInt(total/60) + '</span>시간)';
	    							
	    							totalHour = 0;
	    							total = 0;
	    						}
	    						else {
	    						
		    						v = parseInt(v);
		    						total += v;
		    						if(v >= 60) {
		    							h = parseInt(v/60);
		    							totalHour += h;
		    							s = h + '시간';
		    							if(v%60 != 0) {
		    								s += (v%60) + '분';
		    							}
		    							s += '(' + v + '분)';
		    						}
		    						else {
		    							s = v + '분';
		    						}

	    						}
	    						
	    					}
	    					
	    					return s;
	    				}
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