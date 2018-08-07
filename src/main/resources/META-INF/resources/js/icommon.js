var common = (function() {
	var win = null;
	
	return {
		refreshExtTab: function(id, callback) {
			//cate-notice-list-panel
			//parent.Ext.getCmp('cate-notice-list-panel')
			var item = this.isInTab(id);
			if(item) {
				if(callback) {
					callback(item);
				}
			}
		},
		isInTab: function(tabId) {
			var tabPanel = parent.Ext.getCmp('app-contents');
			var tabExists = null;
			var items = tabPanel.items.items;
			var len = items.length;
		    for(var i=0; i<len; i++) {
	            if(items[i].id == tabId) {
	                tabExists = items[i];
	                break;
	            }
	        }
		    
		    return tabExists;
		},
		showExtWin: function(param) {
			var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
//			var teamComboStore = parent.Ext.create('Ext.data.Store', {
//				 fields   : ['name', 'code'],
//				 proxy : {
//				        type : 'ajax'
//				       ,url : '/calendar/category'
//				       ,actionMethods : 'GET'
//				       ,reader : {
//				           type : 'json'
//				          ,root : 'datas'
//				          ,successProperty: 'success'
//				          //,totalProperty : 'total'
//				       },
//				       listeners: {
//				    	   exception: function(proxy, response, operation, eOpts) {
//				    		   var rText = null;
//				    		   if((rText = response.responseText)) {
//				    			   Ext.Msg.alert('', rText);
//				    		   }
//				    	   }
//				       }
//				  },
//				  autoLoad : true,
//			});
			var items = [{
	        	fieldLabel: '제목',
	            afterLabelTextTpl: required,
	            id: 'ifm-cal-title',
	            allowBlank: false,
	        }, {
	        	xtype: 'datefield',
	        	id: 'ifm-cal-start',
	        	fieldLabel: '시작일',
	        	disabled: true,
	        	format: 'Y-m-d',
	        	value: param.start
	        }, {
	        	xtype: 'datefield',
	        	id: 'ifm-cal-end',
	        	fieldLabel: '종료일',
	        	disabled: true,
	        	format: 'Y-m-d',
	        	value: param.end
	        }, {
	        	fieldLabel: '설명',
	        	xtype: 'textarea',
	        	id: 'ifm-cal-desc',
	        	afterLabelTextTpl: required,
	        	allowBlank: false,
	        }];
			
			var buttons = [];
			
			if(param.cate == 'C1') {
				items.push({
		        	fieldLabel: '시간',
		        	xtype: 'timefield',
		        	id: 'ifm-cal-time',
		        	afterLabelTextTpl: required,
		        	allowBlank: false,
		        	editable: false,
		            increment: 60,
		        });
			}
			
			if(param.mode == 'insert') {
				buttons.push({
					text: '추가',
					iconCls: 'icon-add',
				    handler: function() {
				    	var title = parent.Ext.getCmp('ifm-cal-title');
				    	var desc = parent.Ext.getCmp('ifm-cal-desc');
				    	var time = null;
				    	//var team = parent.Ext.getCmp('ifm-cal-team');
				    	
				    	if(!title.validate()) return;
				    	if(!desc.validate()) return;
				    	
				    	if(param.cate == 'C1') {
				    		time = parent.Ext.getCmp('ifm-cal-time');
				    	  	if(!time.validate()) return;
				    	}
				    	
				    	param.add(win, {
				    		title: title.getValue(),
				    		desc: desc.getValue(), 
				    		time: time == null ? '' : time.getRawValue()
				    	});
			        }
				});
			}
			else if(param.mode == 'update') {
				buttons.push({
					text: '수정',
					iconCls: 'icon-modi',
				    handler: function() {
				    	var title = parent.Ext.getCmp('ifm-cal-title');
				    	var desc = parent.Ext.getCmp('ifm-cal-desc');
				    	var time = null;
				    	//var team = parent.Ext.getCmp('ifm-cal-team');
				    	
				    	if(!title.validate()) return;
				    	if(!desc.validate()) return;
				    	
				    	if(param.cate == 'C1') {
				    		time = parent.Ext.getCmp('ifm-cal-time');
				    	  	if(!time.validate()) return;
				    	}
				    	
				    	param.modify(win, {
				    		title: title.getValue(),
				    		desc: desc.getValue(), 
				    		time: time == null ? '' : time.getRawValue()
				    	});
			        }
				}, {
					text: '삭제',
					iconCls: 'icon-del',
				    handler: function() {
				    	param.del(win);
			        }
				});
			}
			
			buttons.push({
				text: '닫기',
				iconCls: 'icon-close',
			    handler: function() {
			    	win.close();
		        }
			});
		
			
			var	win = parent.Ext.create('Ext.window.Window', {
					title: param.d,
					height: param.cate == 'C1' ? 250 : 230, 
					width: 400,
					layout: 'fit',
					modal: true,
					resizable: false,
					closeAction: 'destroy',
					animateTarget: param.aniTarget,
					items: [{
						xtype: 'form',
						bodyStyle  : 'padding: 10px;',
				        margins    : '0 0 0 3',
				        fieldDefaults: {
				            msgTarget: 'side',
				            labelWidth: 85,
				            anchor: '100%'
				        },
				        defaultType: 'textfield',
				        items: items,
					}],
					buttons: buttons,
					listeners: {
						afterrender: function(w) {
							if(param.mode == 'update') {
								var title = parent.Ext.getCmp('ifm-cal-title');
						    	var desc = parent.Ext.getCmp('ifm-cal-desc');
						    	var time = null;
						    	
						    	if(param.cate == 'C1') {
						    		time = parent.Ext.getCmp('ifm-cal-time');
						    		time.setValue(param.time);
						    	}
						    	
						    	title.setValue(param.title);
						    	desc.setValue(param.description);
							}
						}
					}
			}).show();
			
			
			//parent.Ext.getCmp('ifm-cal-start').setRawValue(param.start);
			
		},
		getYmd: function(date) {
			var yyyy = date.getFullYear();
			var mm = date.getMonth()+1; 
			var dd = date.getDate();
			
			mm = mm < 10 ? '0' + mm : mm;
			dd = dd < 10 ? '0' + dd : dd;
			
			return yyyy + '-' + mm + '-' + dd; 
		},
		showExtMsg: function(param) {
			parent.Ext.Msg.show({
				title: param.title || '',
				msg: param.msg,
				buttons: (param.type == 'alert') ? parent.Ext.Msg.OK : (param.buttons || parent.Ext.Msg.OKCANCEL),
				icon: (param.type == 'alert' && !param.icon) ?  parent.Ext.MessageBox.WARNING : (param.icon || parent.Ext.MessageBox.QUESTION),
				fn: function(btn) {
					switch(param.type) {
					case 'alert' :
						if(btn == 'ok') {
							if(param.callback) param.callback(btn);
						}
						break;
					case 'confirm' :
						param.callback(btn);
						break;
					}
				}
			});
		},
		ajaxExt: function(cfg) {
			var param = {
				url: cfg.url,
				method: cfg.method || 'POST',
				timeout: cfg.timeout || 60000
			};
			var myMask = null;
			
			if(cfg.params) param.params = cfg.params;
			if(cfg.headers) param.headers = cfg.headers;
			if(cfg.jsonData) param.jsonData = cfg.jsonData;
			
			
			param.success = function(response) {
				try {
					var jo = parent.Ext.decode(response.responseText);
					var errCode = jo.errCode;
					
					//중복로그인 세션 체크
					if(!jo.success) {
						if(errCode == '202') {
							Ext.Msg.alert('', '중복로그인이  발생했습니다.', function() {
								window.location.href = context + '/signin';
							});
							return;
						}
					}
					
					if(cfg.success) {
						cfg.success(jo);
					}
					
				}
				catch(e) {
					if(!parent.Ext.String.trim(response.responseText).startsWith('{')) {
						//html로 간주
						parent.Ext.Msg.alert('', '세션만료 되었습니다.', function() {
							window.location.href = context + '/signin';
						});
					}
				}
				finally {
					if(myMask) myMask.hide();
				}
			}
			
			param.failure = function(response) {
				if(myMask) myMask.hide();
				parent.Ext.Msg.alert('', '오류가 발생했습니다.');
				
				if(cfg.failure) cfg.failure(response);
			}
			
			if(cfg.loadmask) {
				myMask = new parent.Ext.LoadMask(cfg.loadmask.el || parent.Ext.getBody(), {msg:cfg.loadmask.msg || 'loading..'});
				myMask.show();
			}
			
			parent.Ext.Ajax.request(param);
		}
	}
})();