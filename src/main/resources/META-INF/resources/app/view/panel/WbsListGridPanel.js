Ext.define('Drpnd.view.panel.WbsListGridPanel', {
	extend: 'Ext.grid.Panel',
	requires : ['Drpnd.util.Constants' ,'Drpnd.util.CommonFn'],
	xtype: 'wbsgrid',
	id: 'wbsListGrid',
	win: null,
	initComponent: function() {
		var	constants = Drpnd.util.Constants,
			commFn = Drpnd.util.CommonFn,
			categoryPanel = Ext.getCmp('app-category'),
			contentPanel = Ext.getCmp('app-contents'),
			//searchWin = null,
			that = this;
		
		try {
			var store = Ext.create('Drpnd.store.WbsListStore');
		}
		catch(e) {
			console.log(e);
			//세션만료 및 중복로그인시  js파일을 가져오지 못해서 오류발생함
			//commFn.loadJsError();
		}
		//store.baseParams = {ip:'', id: '', regDate: null}
		
		var searchComboStore = Ext.create('Ext.data.Store', {
			 fields   : ['name', 'value']
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
				id: 'logSearchForm',
				bodyPadding: 5,
				height: 300,
				defaults: {
	                width: 250,
	                height: 22,
	                labelWidth: 70
	            },
	            defaultType: 'textfield',
	            items: [{
	            	fieldLabel: '아이피',
					name: 'txtLogSearchIp',
					id: 'txtLogSearchIp'
	            }, {
	            	fieldLabel: '아이디',
					name: 'txtLogSearchId',
					id: 'txtLogSearchId'
	            }, {
	            	xtype: 'datefield',
	            	fieldLabel: '접속시간',
	            	height: 22,
	            	editable: false,
	            	name: 'dateLogSearch',
					id: 'dateLogSearch',
			    	format: 'Y-m-d',
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
			var ip = Ext.getCmp('txtLogSearchIp');
			var id = Ext.getCmp('txtLogSearchId');
			var date = Ext.getCmp('dateLogSearch');
			
			if(validate && Ext.String.trim(ip.getValue()) == '' 
			   && Ext.String.trim(id.getValue()) == ''
			   && date.getValue() == null) return;
			
			if(init) {
				ip.setValue('');
				id.setValue('');
				date.setRawValue('');
			}
			
			var ipV = Ext.String.trim(ip.getValue());
			var idV = Ext.String.trim(id.getValue());
			var regDateV = (date.getRawValue()) ? date.getRawValue().substring(0,10) : null;
			
			if(isProxy) {
				store.getProxy().setExtraParam('ip', ipV);
				store.getProxy().setExtraParam('id', idV);
				store.getProxy().setExtraParam('regDate', regDateV);
				store.getProxy().setExtraParam('limit', Ext.getCmp('log-paging-combo').getValue());
				return;
			}
			
			store.loadPage(1, {
				params: {
					limit: Ext.getCmp('log-paging-combo').getValue(),
					ip: ipV,
					id: idV,
					regDate: regDateV
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
					Ext.getCmp('logListGrid').getStore().load();
				},
				items: ['-', {
					text: '목록수 : '
				}, Ext.create('Ext.form.field.ComboBox', {
					queryMode: 'local',
					id: 'log-paging-combo',
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