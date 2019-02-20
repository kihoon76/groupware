Ext.define('Drpnd.view.panel.WbsListGridPanel', {
	extend: 'Ext.grid.Panel',
	requires : ['Drpnd.util.Constants' ,'Drpnd.util.CommonFn'],
	xtype: 'wbsgrid',
	id: 'wbsListGrid',
	win: null,
	initComponent: function() {
		var	constants = Drpnd.util.Constants,
			commFn = Drpnd.util.CommonFn,
			searchWbsName = null,
			searchWbsWriter = null,
			searchWbsRange = null,
			that = this;
		
		try {
			var store = Ext.create('Drpnd.store.WbsListStore');
		}
		catch(e) {
			console.log(e);
			//세션만료 및 중복로그인시  js파일을 가져오지 못해서 오류발생함
			//commFn.loadJsError();
		}
		
		store.baseParams = {wbsName:'', writer: '', range: 'D'}
		
		var searchComboStore = Ext.create('Ext.data.Store', {
			 fields : ['name', 'value'],
			 data : [
			     {name: '내것+팀+전체', value: 'D'},
			     {name: '내가작성한것 보기', value: 'P'}, 
			     {name: '팀공유', value: 'T'}, 
			     {name: '전체공유', value: 'A'}
			 ]
		});
		
		var searchComboArr = [], searchType = '', searchValue = '';
		
		var searchWin = Ext.create('Ext.window.Window',{
			iconCls: 'icon-window',
			width: 300,
			height: 150,
			modal: true,
			draggable: false,
			resizable: false,
			closeAction: 'hide',
			items: [{
				xtype: 'form',
				id: 'wbsSearchForm',
				bodyPadding: 5,
				height: 300,
				defaults: {
	                width: 250,
	                height: 22,
	                labelWidth: 70
	            },
	            defaultType: 'textfield',
	            items: [{
	            	fieldLabel: 'wbs이름',
					listeners: {
						afterrender: function(txt) {
							searchWbsName = txt
						}
					}
	            }, {
	            	fieldLabel: '작성자',
	            	disabled: true,
					listeners: {
						afterrender: function(txt) {
							searchWbsWriter = txt;
						}
					}
	            }, {
	            	xtype: 'combobox',
	            	fieldLabel: '공유범위',
	            	editable: false,
	            	displayField: 'name',
	            	valueField: 'value',
			    	queryMode: 'local',
			    	value: 'D',
			    	store: searchComboStore,
			    	listeners: {
			    		afterrender: function(combo) {
			    			searchWbsRange = combo;
			    		},
			    		change: function(c, nV) {
			    			if(nV != 'A') {
			    				searchWbsWriter.setValue('');
			    				searchWbsWriter.setDisabled(true);
			    			}
			    			else {
			    				searchWbsWriter.setDisabled(false);
			    			}
			    		}
			    	}
	            }]
			}],
			buttons: [{
				xtype: 'button',
				iconCls: 'icon-search',
				text: '검색',
				listeners: {
					click: function() {
						makeParam(true, false);
					}
				}
			}, {
				xtype: 'button',
				iconCls: 'icon-close',
				text: '닫기',
				listeners: {
					click: function() {
						searchWin.hide();
					}
				}
			}]
		});
		
		function makeParam(validate, init, isProxy) {
			
			if(validate && Ext.String.trim(searchWbsName.getValue()) == '' 
			   && Ext.String.trim(searchWbsWriter.getValue()) == ''
			   && searchWbsRange.getValue() == null) return;
			
			if(init) {
				searchWbsName.setValue('');
				searchWbsWriter.setValue('');
				searchWbsRange.setValue('D');
			}
			
			var searchWbsNameV = Ext.String.trim(searchWbsName.getValue());
			var searchWbsWriterV = Ext.String.trim(searchWbsWriter.getValue());
			var searchWbsRangeV = searchWbsRange.getValue();
			
			if(isProxy) {
				store.getProxy().setExtraParam('wbsName', searchWbsNameV);
				store.getProxy().setExtraParam('writer', searchWbsWriterV);
				store.getProxy().setExtraParam('range', searchWbsRangeV);
				store.getProxy().setExtraParam('limit', Ext.getCmp('wbs-paging-combo').getValue());
				return;
			}
			
			store.loadPage(1, {
				params: {
					limit: Ext.getCmp('wbs-paging-combo').getValue(),
					wbsName: searchWbsNameV,
					writer: searchWbsWriterV,
					range: searchWbsRangeV
				}
			});
		}
		
		Ext.apply(this, {
			store: store,
			columns: [{
				text: 'WBS이름',
				dataIndex: 'name',
				flex: 1
			}, {
				text: '시작일',
				dataIndex: 'defaultDay',
				flex: 0
			}, {
				text: '작성자',
				dataIndex: 'writer',
				flex: 0
			}, {
				text: '공개범위',
				dataIndex: 'range',
				renderer: function(v) {
					switch(v) {
					case 'P' :
						v = 'private';
						break;
					case 'T':
						v = '팀공유';
						break;
					case 'A' :
						v = '전체공유';
						break;
					}
					
					return v;
						
				},
				flex: 0
			}],
			tbar: [{
				xtype: 'button',
				iconCls: 'icon-search',
				text: '검색',
				listeners: {
					click: function(btn, e) {
						searchWin.showAt(btn.getPosition());
					}
				}
			}, {
				xtype: 'button',
				iconCls: 'icon-refresh',
				text: '전체보기',
				listeners: {
					click: function() {
						makeParam(false, true);
					}
				}
			}], 
			
			dockedItems: [{
				xtype: 'pagingtoolbar',
				store: store,
				displayInfo: true,
				displayMsg: 'WBS 리스트 {0} - {1} of {2}',
				dock: 'bottom',
				doRefresh: function() {
					makeParam(false, false, true);
					store.load();
				},
				items: ['-', {
					text: '목록수 : '
				}, Ext.create('Ext.form.field.ComboBox', {
					queryMode: 'local',
					id: 'wbs-paging-combo',
					displayField: 'name',
					valueField: 'value',
					editable: false,
					width: 100,
					value: constants.gridPageSize,
					store: Ext.create('Drpnd.store.PagingSize'),
					listeners: {
						change: function(cb, nV, oV) {
							makeParam(false, false);
						}
					}
				})],
				listeners: {
    				beforechange: function() {
    					makeParam(false, false, true);
	    			}
    			}
			}],
			listeners: {
				afterrender: function(grid, eOpts) {
					
				},
				itemdblclick: function(grid, rec, item) {
					that.myExtraParams.win.makeCalendar(rec.data);
				}
			}
		});
		
		
		
		this.callParent(arguments);
	}
});