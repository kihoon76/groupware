var common = (function() {
	var win = null;
	var ErrCode = parent.Drpnd.util.ErrorCode;
	var Context = parent.Drpnd.util.Constants.context;
	var loadMask = null;
	var fileFormatPath = '<img style="width:20px; height:20px;" src="/resources/images/format_icons/';
	var clipImg = '/resources/images/attachment.png';
	
	//var ErrCode = parent.Ext.create('Drpnd.util.ErrorCode');
	function redirect(msg) {
		parent.Ext.Msg.alert('', msg, function() {
			parent.window.location.href = Context + '/signin';
		});
	}
	
	function parseDate(str) {
		return new Date(str);
	}
	
	return {
		datediff: function(first, second) {
			return Math.round((parseDate(second)-parseDate(first))/(1000*60*60*24));
		},
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
			var isDesignAdmin = param.cate == 'C05' && param.isDesignAdmin;
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
			
			if(isDesignAdmin) {
				items.push({
					fieldLabel: '디자인요청자',
					afterLabelTextTpl: required,
					id: 'ifm-cal-design',
					xtype: 'combobox',
					queryMode: 'local',
					allowBlank: false,
			    	displayField: 'sawonName',
			    	valueField: 'sawonCode',
			    	editable: false,
			    	store: parent.Ext.create('Ext.data.Store', {
						fields : ['sawonName', 'sawonCode'],
						data: param.extraData
					}),
				});
			}
			
			var buttons = [];
			
//			if(param.cate == 'C1') {
//				items.push({
//		        	fieldLabel: '시간',
//		        	xtype: 'timefield',
//		        	id: 'ifm-cal-time',
//		        	afterLabelTextTpl: required,
//		        	allowBlank: false,
//		        	editable: false,
//		            increment: 60,
//		        });
//			}
			
			if(param.mode == 'insert') {
				buttons.push({
					text: '추가',
					iconCls: 'icon-add',
				    handler: function() {
				    	var title = parent.Ext.getCmp('ifm-cal-title');
				    	var desc = parent.Ext.getCmp('ifm-cal-desc');
				    	var sawonCode = isDesignAdmin ? parent.Ext.getCmp('ifm-cal-design') : null;
				    	var time = null;
				    	//var team = parent.Ext.getCmp('ifm-cal-team');
				    	
				    	if(!title.validate()) return;
				    	if(!desc.validate()) return;
				    	if(isDesignAdmin && !sawonCode.validate()) return;
				    	
				    	
//				    	if(param.cate == 'C1') {
//				    		time = parent.Ext.getCmp('ifm-cal-time');
//				    	  	if(!time.validate()) return;
//				    	}
				    	
				    	param.add(win, {
				    		title: title.getValue(),
				    		desc: desc.getValue(), 
				    		time: time == null ? '' : time.getRawValue(),
				    		sawonCode: sawonCode == null ? '' : sawonCode.getValue(),
				    		sawonName: sawonCode == null ? '' : sawonCode.getRawValue()	
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
				    	var sawonCode = isDesignAdmin ? parent.Ext.getCmp('ifm-cal-design') : null;
				    	//var time = null;
				    	//var team = parent.Ext.getCmp('ifm-cal-team');
				    	
				    	if(!title.validate()) return;
				    	if(!desc.validate()) return;
				    	if(isDesignAdmin && !sawonCode.validate()) return;
				    	
//				    	if(param.cate == 'C1') {
//				    		time = parent.Ext.getCmp('ifm-cal-time');
//				    	  	if(!time.validate()) return;
//				    	}
				    	
				    	param.modify(win, {
				    		title: title.getValue(),
				    		desc: desc.getValue(), 
				    		sawonCode: sawonCode == null ? '' : sawonCode.getValue(),
						    sawonName: sawonCode == null ? '' : sawonCode.getRawValue()
				    		//time: time == null ? '' : time.getRawValue()
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
					iconCls: 'icon-calendar',
					height: 250, 
					width: 400,
					layout: 'fit',
					modal: true,
					resizable: false,
					closeAction: 'destroy',
					//animateTarget: param.aniTarget,
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
						    	var sawonCode = isDesignAdmin ? parent.Ext.getCmp('ifm-cal-design') : null;
						    	//var time = null;
						    	
//						    	if(param.cate == 'C1') {
//						    		time = parent.Ext.getCmp('ifm-cal-time');
//						    		time.setValue(param.time);
//						    	}
						    	
						    	if(sawonCode != null) sawonCode.setValue(param.sawonCode);
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
			var that = this;
			
			if(cfg.params) param.params = cfg.params;
			if(cfg.headers) param.headers = cfg.headers;
			if(cfg.jsonData) param.jsonData = cfg.jsonData;
			
			
			param.success = function(response) {
				try {
					var jo = parent.Ext.decode(response.responseText);
					var errCode = jo.errCode;
					
					if(!jo.success) {
						if(errCode == '202') {
							redirect('중복로그인이  발생했습니다.');
							return;
						}
						
						parent.Ext.Msg.alert('오류', jo.errMsg);
					}
					
					if(cfg.success) {
						cfg.success(jo);
					}
					
				}
				catch(e) {
					if(!parent.Ext.String.trim(response.responseText).startsWith('{')) {
						//html로 간주
						redirect('세션만료 되었습니다.');
					}
				}
				finally {
					if(myMask) myMask.hide();
				}
			}
			
			param.failure = function(response) {
				if(myMask) myMask.hide();
				//parent.Ext.Msg.alert('', '오류가 발생했습니다.');
				that.showExtMsg({
					type: 'alert',
					msg: '오류가 발생했습니다.'
				});
				
				if(cfg.failure) cfg.failure(response);
			}
			
			if(cfg.loadmask) {
				myMask = new parent.Ext.LoadMask(cfg.loadmask.el || parent.Ext.getBody(), {msg:cfg.loadmask.msg || 'loading..'});
				myMask.show();
			}
			
			parent.Ext.Ajax.request(param);
		},
		checkSession: function(fn) {
			common.ajaxExt({
	    		url: '/checkSession',
	    		method: 'GET',
				success: function(jo) {
					fn();
				}
	    	});
		},
		getFileFormatIcon: function(ext) {
			switch(ext) {
	    	case 'xls':
	    	case 'xlsx':
	    		ext = fileFormatPath + 'xls.png" />';
	    		break;
	    	case 'ppt':
	    	case 'pptx':
	    		ext = fileFormatPath + 'ppt.png" />';
	    		break;
	    	case 'hwp':
	    		ext = fileFormatPath + 'hwp.png" />';
	    		break;
	    	case 'doc':
	    	case 'docx':
	    		ext = fileFormatPath + 'docx.png" />';
	    		break;
	    	case 'pdf':
	    		ext = fileFormatPath + 'pdf.png" />';
	    		break;
	    	case 'txt':
	    		ext = fileFormatPath + 'txt.png" />';
	    		break;
	    	case 'psd':
	    		ext = fileFormatPath + 'photoshop.png" />';
	    		break;
	    	case 'csv':
	    		ext = fileFormatPath + 'csv.png" />';
	    		break;
	    	case 'csv':
	    		ext = fileFormatPath + 'csv.png" />';
	    		break;
	    	case 'png':
	    		ext = fileFormatPath + 'png.png" />';
	    		break;
	    	case 'jpg':
	    	case 'jpeg':
	    		ext = fileFormatPath + 'jpg.png" />';
	    		break;
	    	case 'ai':
	    		ext = fileFormatPath + 'ai.png" />';
	    		break;
	    	case 'zip':
	    		ext = fileFormatPath + 'zip.png" />';
	    		break;
	    	case 'gif':
	    		ext = fileFormatPath + 'gif.png" />';
	    		break;
	    	case 'exe':
	    		ext = fileFormatPath + 'exe.png" />';
	    		break;
	    	default:
	    		ext = fileFormatPath + 'default.png" />';
	    		break;
	    	}
			
			return ext;
		},
		getClipImage: function() {
			return clipImg;
		},
		s4: function() {
			return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
		}
	}
})();