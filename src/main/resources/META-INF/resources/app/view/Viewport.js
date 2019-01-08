Ext.define('Drpnd.view.Viewport', {
    extend : 'Ext.container.Viewport'
   ,requires: ['Drpnd.util.CommonFn', 'Drpnd.util.Html', 'Drpnd.util.Observer']
   ,initComponent: function(){
	    var CommonFn = Drpnd.util.CommonFn;
	    var Html = Drpnd.util.Html;
	    window.Observer = Drpnd.util.Observer;
	    var SawonRegForm = Ext.create('Drpnd.custom.SawonRegForm');
	    
	    var isGotowork = Ext.getBody().getAttribute('data-gotowork') == 'true';
	    var isOffwork = Ext.getBody().getAttribute('data-offwork') == 'true';
	    var sawonName = Ext.getBody().getAttribute('data-sawon-name');
	    var currentTime10 = Ext.get('hdnTime').getValue();
	    var hasWorker = false;
	    var worker = null;
	    
	    var toolbarObj = {
	    	btnOffwork: null,
	    	btnGotowork: null
	    }
	    
	    var offworkObj = {
	    	txtWorkContent: null,
	    	txtOutworkContent: null	
	    }
	    
	    var offWorkWin = null;
	    var myInfoWin = null;
	    
	    function logoutClick(button) {
	    	if(button == 'yes') {
				CommonFn.ajax({
					url: '/logout',
					method:'GET',
					success: function(jo) {
						if(jo.success) {
							window.location.href = CommonFn.getFullUrl(); 
						}
						else {
							Ext.MessageBox.alert('info', '로그아웃에 실패했습니다.');
						}
					},
				});
			}
	    }
	    
	    function offWorkClick() {
	    	
	    	CommonFn.checkSession(function() {
	    		offWorkWin = Ext.create('Ext.window.Window', {
					title: '퇴근처리',
					height: 800,
					width: 800,
					layout: 'fit',
					closeAction: 'destroy',
					modal: true,
					items: [{
						xtype: 'form',
						bodyStyle  : 'padding: 10px;',
				        margins    : '0 0 0 0',
				        fieldDefaults: {
				            msgTarget: 'side',
				            labelWidth: 85,
				            anchor: '100%'
				        },
				        defaultType: 'textarea',
				        items: [{
				        	fieldLabel: '업무내용',
				        	height: 350,
				        	listeners: {
				        		afterrender: function(txt) {
				        			offworkObj.txtWorkContent = txt;
				        		}
				        	}
				        },{
				        	fieldLabel: '야근내용',
				        	height: 350,
				        	listeners: {
				        		afterrender: function(txt) {
				        			offworkObj.txtOutworkContent = txt;
				        		}
				        	}
				        }]
					}],
					dockedItems: [{
					    xtype: 'toolbar',
					    dock: 'bottom',
					    ui: 'footer',
					    //defaults: {minWidth: minButtonWidth},
					    items: [
					        { xtype: 'component', flex: 1 },
					        { xtype: 'button', text: '처리', listeners: {
					        	click: function() {
					        		offwork();
					        	}
					        } },
					        { xtype: 'button', text: '닫기', listeners: {
					        	click: function(btn) {
					        		offWorkWin.close();
					        	}
					        } }
					    ]
					}]  
				});
				
		    	offWorkWin.show();
	    	});
	    	
	    	
	    }
	    
	    function myInfoClick() {
	    	//if(myInfoWin == null) {
	    		CommonFn.ajax({
	    			url: '/sawon/myinfo',
	    			method: 'GET',
	    			success: function(jo) {
	    				console.log(jo)
	    				
	    				myInfoWin = Ext.create('Ext.window.Window', {
	    					width: 500,
	    					height: 380,
	    					closeAction: 'hide',
	    					draggable: false,
	    					modal: true,
	    					closable: false,
	    					resizable: false,
	    					closeAction: 'destroy',
	    					items: [getMyInfoForm(jo.datas[0])],
	    					buttons: [{
	    						text: '수정',
	    						id: 'btnRegist',
	    					    handler: function() {
	    					    	modifyMyInfo();
	    				        }
	    					}, {
	    						text: '닫기',
	    					    handler: function() {
	    					    	myInfoWin.close();
	    				        }
	    					}],
	    					listeners: {
	    						destroy: function() {
	    							SawonRegForm.initSetting();
	    						}
	    					}
	    				});
	    				
	    				myInfoWin.show();
	    	    	}
	    		});
	    	//}
	    }
	    
	    function modifyMyInfo() {
	    	if(SawonRegForm.isValid()) {
				CommonFn.ajax({
					url: '/sawon/mod/myinfo',
					method:'POST',
					headers: { 'Content-Type': 'application/json' }, 
					jsonData: SawonRegForm.getJsonParam(),
					timeout:60000,
					success: function(jo) {
						
						if(jo.success) {
							Ext.Msg.alert('', '내정보가 수정되었습니다. 다시 로그인해 주세요', function() {
								window.location.href = CommonFn.getFullUrl();
							});
						}
						else {
							var msg = '';
							if(jo.errCode == '10000') {
								Ext.Msg.alert('', '아이디가 중복되었습니다.', function() {
									SawonRegForm.validIdDuplicate();
								});
							}
							else {
								console.log();
								Ext.Msg.alert('에러', 'DB 오류입니다.');
							}
						}
					}
				});
			}
	    }
	    
	    function getMyInfoForm(info) {
			return Ext.create('Ext.form.Panel', {
				 frame: true,
				 title: '내정보',
			     anchor: '100%',
			     bodyPadding: 5,

			        fieldDefaults: {
			            labelAlign: 'left',
			            labelWidth: 90,
			            anchor: '100%'
			        },

			        items: [{
			            xtype: 'combo',
			            name: 'sawonDepartment',
			            id: 'sawonDepartment',
			            fieldLabel: '부서',
			            queryMode: 'remote',
			            displayField: 'departmentName',
			            valueField: 'departmentCode',
			            editable: false,
			            store: Ext.create('Drpnd.store.DepartmentListStore'),
			            listeners: {
			            	afterrender: function(combo) {
			            		SawonRegForm.setDepartmentCombo(combo);
			            		combo.getStore().load();
			            		combo.setValue(info.department);
			            	},
			            	select: function(combo, records) {
			            		SawonRegForm.onSelectDepartmentCombo(); 
			            	}
			            }
			        },{
			            xtype: 'combo',
			            id: 'comboTeam',
			            name: 'sawonTeam',
			            fieldLabel: '소속팀',
			            queryMode: 'remote',
			            displayField: 'teamName',
			            valueField: 'teamCode',
			            editable: false,
			            store: Ext.create('Drpnd.store.TeamListStore'),
			            disabled: true,
			            listeners: {
			            	afterrender: function(combo) {
			            		SawonRegForm.setTeamCombo(combo);
			            		
			            		//임원이면 설정안함
			            		if(info.positionGubun == '3') {
			            			combo.getStore().load();
				            		combo.setValue(info.team);
			            		}
			            	},
			            	beforequery: function(qe) {
			            		if(SawonRegForm.getDepartmentChanged()) {
			            			delete qe.combo.lastQuery;
			            			SawonRegForm.setDepartmentChanged(false);
			            		}
			            	}
			            }
			        },{
			            xtype: 'combo',
			            name: 'sawonPosition',
			            fieldLabel: '직급',
			            queryMode: 'remote',
			            displayField: 'positionName',
			            valueField: 'positionCode',
			            editable: false,
			            store: Ext.create('Drpnd.store.PositionListStore'),
			            listeners: {
			            	afterrender: function(combo) {
			            		SawonRegForm.setPositionCombo(combo);
			            		combo.getStore().load();
			            		combo.setValue(info.position);
			            		
			            		SawonRegForm.setImwon(info.positionGubun);
			            	},
			            	select: function(combo, records) {
			            		SawonRegForm.setImwon(records[0].data.positionGubun);
			            	}
			            	
			            }
			        },{
			            xtype: 'textfield',
			            name: 'sawonName',
			            fieldLabel: '사원명',
			            listeners: {
			            	afterrender: function(txt) {
			            		SawonRegForm.setNameTxt(txt);
			            		txt.setValue(info.sawonName);
			            	}
			            }
			        },{
			            xtype: 'textfield',
			            name: 'sawonId',
			            fieldLabel: '아이디',
			            listeners: {
			            	afterrender: function(txt) {
			            		SawonRegForm.setIdTxt(txt);
			            		txt.setValue(info.sawonId);
			            	}
			            }
			        },{
			            xtype: 'textfield',
			            name: 'sawonPassword',
			            inputType: 'password',
			            fieldLabel: '비밀번호',
			            listeners: {
			            	afterrender: function(txt) {
			            		SawonRegForm.setPwTxt(txt);
			            	}
			            }
			        },{
			            xtype: 'textfield',
			            id: 'passwordConfirm',
			            inputType: 'password',
			            fieldLabel: '비밀번호확인',
			            listeners: {
			            	afterrender: function(txt) {
			            		SawonRegForm.setPwConfirmTxt(txt);
			            	}
			            }
			        },{
			            xtype: 'textfield',
			            name: 'sawonPhone',
			            fieldLabel: '연락처',
			            enableKeyEvents: true,
			            listeners: {
			            	afterrender: function(txt) {
			            		SawonRegForm.setPhoneTxt(txt);
			            		txt.setValue(info.phone);
			            	},
			            	keyup: function(txt, e, eOpts) {
		                		var v = txt.getValue();
		                		
		                		if(!v.startsWith('010-')) {
		                			txt.setValue('010-');
		                		}
		                		
		                		//space key
		                		if(e.keyCode == 32) {
		                			txt.setValue(Ext.util.Format.trim(v));
		                		}
			            	}
			            }
			        },{
			            xtype: 'textfield',
			            name: 'sawonInnerPhone',
			            fieldLabel: '내선번호',
			            listeners: {
			            	afterrender: function(txt) {
			            		SawonRegForm.setInnerPhoneTxt(txt);
			            		txt.setValue(info.innerPhone);
			            	}
			            }
			        },{
			            xtype: 'textfield',
			            name: 'sawonEmail',
			            fieldLabel: '이메일',
			            listeners: {
			            	afterrender: function(txt) {
			            		SawonRegForm.setEmailTxt(txt);
			            		txt.setValue(info.email)
			            	}
			            }
			        },{
			            xtype: 'datefield',
			            name: 'sawonBirthday',
			            fieldLabel: '생년월일',
			            format:'Y-m-d',
			            editable: false,
			            listeners: {
			            	afterrender: function(date) {
			            		SawonRegForm.setBirthdayDate(date);
			            		date.setRawValue(info.birthday);
			            	}
			            }
			        }/*,{
			        	xtype: 'radiogroup',
		            	fieldLabel: '팀리더',
		            	//height: 120,
		            	items: [{
		            		boxLabel: '예',
		            		boxLabelAlign: 'after',
		            		name: 'sawonTeamLeader',
		            		id: 'rdoSawonTeamLeaderY',
		            		checked: info.leader == 'Y' ? true : false,
		            		padding: '0 50 0 0',
		            		_value: 'Y'
		            		
		            	},{
		            		boxLabel: '아니오',
		            		boxLabelAlign: 'after',
		            		checked: info.leader == 'N' ? true : false,
		            		name: 'sawonTeamLeader',
		            		id: 'rdoSawonTeamLeaderN',
		            		_value: 'N'
		            	}],
		            	listeners: {
			            	afterrender: function(rdoGrp) {
			            		SawonRegForm.setTeamLeaderRdoGrp(rdoGrp);
			            	}
			            }
			        }*/]
			});
		}
	    
	    function offwork() {
	    	 var wcVal = Ext.String.trim(offworkObj.txtWorkContent.getValue());
	    	 var ocVal = Ext.String.trim(offworkObj.txtOutworkContent.getValue());
	    	 
	    	 if(wcVal == '') {
	    		 offworkObj.txtWorkContent.markInvalid('업무내용을 입력하세요.');
	    		 return;
	    	 }
	    	
	    	CommonFn.ajax({
				url: '/geuntae/offwork',
				method:'POST',
				headers: { 'Content-Type': 'application/json' }, 
				jsonData: {
					workContent: wcVal,
					outworkContent: ocVal
				},
				loadmask: {
					msg: '퇴근처리중 입니다.'
				},
				success: function(jo) {
					if(jo.success) {
						Ext.MessageBox.alert('알림', jo.datas[0] + ' - '+ jo.datas[1] + ' 퇴근처리 되었습니다.');
						toolbarObj.btnOffwork.setDisabled(true);
						offWorkWin.close();
					}
					else {
						Ext.MessageBox.alert('alert', jo.errMsg);
					}
				},
			}); 
	    }
	    
	    if(window.Worker) {
	    	hasWorker = true;
			if(worker) {
				worker.terminate();
			}
			
			worker = new Worker(CommonFn.getFullUrl() + '/resources/js/mobile/worker.js');
			
			worker.onmessage = function(event) {
				var d = event.data;
				Ext.getCmp('timer').setValue(d);
			}
		}
	    
	    
        Ext.apply(this, {
            id     : 'app-viewport'
           ,layout : {
                type    : 'border'
               ,padding : '0 5 5 5'
            }
           ,items: [{
			   xtype : 'loadmask'
			  ,id : 'load-indicator'
			  ,indicator:true
			  ,hidden : true
			  ,target : this
		   },{
                id     : 'app-header'
               ,xtype  : 'toolbar'//'box'
               ,region : 'north'
			   ,height : 50
			   ,items: [{
				   html: Html.logo
			   }, 
			   '->',{
				   xtype: 'textfield',
				   id: 'timer',
				   readOnly: true,
				   fieldStyle: 'background-color: #ddd; background-image: none; color:#0000ff;',
				   listeners: {
					   afterrender: function(txt) {
						   if(hasWorker) {
							   var time = currentTime10;
							   var ymd = time.split(' ');
							   var ymdSplit = ymd[0].split('-');
							   var hmsSplit = ymd[1].split(':');
								
							   var timeObj = {
								   year: ymdSplit[0],
								   month: ymdSplit[1],
								   day: ymdSplit[2],
								   hour: hmsSplit[0],
								   min: hmsSplit[1],
								   sec: hmsSplit[2]
							   }
								
							   worker.postMessage(timeObj);   
						   }
						   else {
							   txt.setValue(currentTime10);
						   }
					   }
				   }
			   },{
				   xtype: 'button',
				   text: '출근처리',
				   iconCls: 'icon-gotowork',
				   listeners: {
					   afterrender: function(btn) {
						   toolbarObj.btnGotowork = btn;
						   btn.setDisabled(isGotowork);
					   },
					   click: function(btn) {
						   CommonFn.getLatLng(function(lat, lng) {
							   CommonFn.ajax({
									url: '/geuntae/gotowork?lat=' + lat + '&lng=' + lng,
									method:'GET',
									loadmask: {
										msg: '출근처리중 입니다.'
									},
									success: function(jo) {
										if(jo.success) {
											Ext.MessageBox.alert('알림', jo.datas[0] + '분에 출근처리 되었습니다.');
											btn.setDisabled(true);
											toolbarObj.btnOffwork.setDisabled(false);
										}
										else {
											Ext.MessageBox.alert('alert', jo.errMsg);
										}
									},
							   });  
						   });
					   }
				   }
			   },{
				   xtype: 'button',
				   text: '퇴근처리',
				   iconCls: 'icon-offwork',
				   disabled: true,
				   listeners: {
					   afterrender: function(btn) {
						   toolbarObj.btnOffwork = btn;
						   btn.setDisabled(isOffwork);
					   },
					   click: function() {
						   offWorkClick();
					   }
				   }
				   
			   },{
				   xtype: 'button',
				   text: '<span style="font-weight:bold; color:#0000ff;">'  + sawonName + '</span>님 정보',
				   iconCls: 'icon-myinfo',
				   listeners: {
					   click: function() {
						   myInfoClick();
					   }
				   }
				   
			   },{
					xtype: 'button',
					text: '로그아웃',
					iconCls: 'icon-logout',
					//pressed: true,
					height: 30,
					listeners: {
						click: function() {
							Ext.Msg.confirm(
								'로그아웃',
								'로그아웃 하시겠습니까?',
								function(button) {
									logoutClick(button);
								}
							);
						}
					}
			   }]
            },{
            	id          : 'app-category'
               ,xtype       : 'categorypanel'
               ,region      : 'west'
               ,width       : '20%'
               ,split       : true
               ,collapsible : true
               ,minWidth    : 150
               ,maxWidth    : 250
            },{
                id        : 'app-contents'
               ,xtype     : 'tabpanel'
               ,plugins   : [Ext.create('Drpnd.plugins.TabClose')]
               ,region    : 'center'
        	   ,listeners : {
            	   remove :  function(pl, component, opt) {
            		   var id = component.getItemId().replace('-panel', '');
            		   Ext.getCmp('app-category').rmCategoryInTab(id);
            	   }
                  ,tabchange : function(tp, nC, oC) {
                	  if(oC == undefined) return;
                	  //이전 탭이 메시지 작성이라면 선택한 아이템 목록 윈도우를 닫아준다.
                	  if(oC.id == 'cate-bbs-batchWrite-panel') {
                		 var win = Ext.getCmp('bbsItemListWin');
                		 if(!Ext.isEmpty(win) && !win.isHidden()) {
                			 win.hide();
                		 }
                	  }

                	  if(oC.id == 'cate-event-reg-panel') {
                		  var win = Ext.getCmp('eventItemListWin');
                		  if(!Ext.isEmpty(win) && !win.isHidden()) {
                			  win.hide();
                		  }
                	  }

                	  //Ext.getCmp('app-results').collapse(Ext.Component.DIRECTION_BOTTOM, true);
                  }
               }
            }]
        });

        Ext.EventManager.onWindowResize(function(w, h) {
    		Observer.notifyWinResize(w, h);
    	});
        
        this.callParent(arguments);
    }
});
