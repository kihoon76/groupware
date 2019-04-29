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
	    var sawonCode = Ext.getBody().getAttribute('data-sawon-code');
	    var mygyeoljaeCount = parseInt(Ext.getBody().getAttribute('data-gyeoljae-count'));
	    var offworkNotAuto = Ext.getBody().getAttribute('data-offwork-notauto') == 'true';
	    
	    var treeGyeoljae = null; 
	    
	    var currentTime10 = Ext.get('hdnTime').getValue();
	    var hasWorker = false;
	    var worker = null;
	    
	    var toolbarObj = {
	    	btnOffwork: null,
	    	btnGotowork: null
	    }
	    
	    var offworkObj = {
	    	txtWorkContent: null,
	    	txtOutworkContent: null,
	    	comboOverworkType: null,
	    	chkOverworkSix: null,
	    }
	    
	    var offWorkWin = null;
	    var myInfoWin = null;
	    var signatureContentWin = null;
	    var msgCt = null;
	    
	    function createAlarmBox(t, s) {
	    	 return '<div class="msg ' + Ext.baseCSSPrefix + 'border-box"><h3>' + t + '</h3><p>' + s + '</p></div>';
	    }
	    
	    function createSocket() {
	    	setTimeout(function() {
	        	var Socket = Ext.create('Drpnd.custom.Socket', {
	        		socketUrl: '/websocket',
	             	subscribe: [{
	             		url: '/message/gyeoljae/keepbox/' + sawonCode + '/alarm',
	             		callback: function(message, mBody) {
	             			if(!msgCt){
	                            msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
	                        }
	             			var s = '<span style="color:#ff0000;">' + mBody.msg + '</span>님이 올린 결재가  완료되었습니다<br/>'
	             			      + '<span style="color:#0000ff;">보관함</span>에서 확인하세요.';
	                        var m = Ext.DomHelper.overwrite(msgCt, createAlarmBox('알림', s), true);
	                        m.hide();
	                        m.slideIn('t').ghost('t', { delay: 5000, remove: true});
	             		}
	             	},{
	             		url: '/message/gyeoljae/received/' + sawonCode + '/alarm',
	             		callback: function(message, mBody) {
	             			mygyeoljaeCount++;
	             			treeGyeoljae.innerText = mygyeoljaeCount;
	             			if(!msgCt){
	                            msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
	                        }
	             			var s = '<span style="color:#ff0000;">' + mBody.msg + '</span>님이 올린 결재건이 도착했습니다<br/>'
	             			      + '<span style="color:#0000ff;">결재수신함</span>에서 확인하세요.';
	                        var m = Ext.DomHelper.overwrite(msgCt, createAlarmBox('알림', s), true);
	                        m.hide();
	                        m.slideIn('t').ghost('t', { delay: 5000, remove: true});
	                        
	                        
	             		}
	             	},{
	             		url: '/message/gyeoljae/modified/' + sawonCode + '/alarm',
	             		callback: function(message, mBody) {
	             			if(!msgCt){
	                            msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
	                        }
	             			var s = '<span style="color:#ff0000;">' + mBody.msg + '</span>님이 올린 결재내용이 수정되었습니다.<br/>';
	                        var m = Ext.DomHelper.overwrite(msgCt, createAlarmBox('알림', s), true);
	                        m.hide();
	                        m.slideIn('t').ghost('t', { delay: 5000, remove: true});
	                        
	                        
	             		}
	             	},{
	             		url: '/message/gyeoljae/delete/line/' + sawonCode + '/alarm',
	             		callback: function(message, mBody) {
	             			mygyeoljaeCount--;
	             			treeGyeoljae.innerText = mygyeoljaeCount;
	             			if(!msgCt){
	                            msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
	                        }
	             			var s = '<span style="color:#ff0000;">' + mBody.msg + '</span>님이 올린 결재의 결재라인이 변경되었습니다.<br/>';
	                        var m = Ext.DomHelper.overwrite(msgCt, createAlarmBox('알림', s), true);
	                        m.hide();
	                        m.slideIn('t').ghost('t', { delay: 5000, remove: true});
	                        
	                        
	             		}
	             	},{
	             		url: '/message/gyeoljae/delete/' + sawonCode + '/alarm',
	             		callback: function(message, mBody) {
	             			mygyeoljaeCount--;
	             			treeGyeoljae.innerText = mygyeoljaeCount;
	             			if(!msgCt){
	                            msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
	                        }
	             			var s = '<span style="color:#ff0000;">' + mBody.msg + '</span>님이 올린 결재가 삭제되었습니다<br/>';
	                        var m = Ext.DomHelper.overwrite(msgCt, createAlarmBox('알림', s), true);
	                        m.hide();
	                        m.slideIn('t').ghost('t', { delay: 5000, remove: true});
	             		}
	             	},{
	             		url: '/message/gyeoljae/reject/' + sawonCode + '/alarm',
	             		callback: function(message, mBody) {
	             			console.log(mBody)
	             			if(!msgCt){
	                            msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
	                        }
	             			var s = '<span style="color:#ff0000;">' + mBody.msg + '</span>님이 올린 결재가  <span style="color:#ff0000;">반려</span>되었습니다<br/>'
	             			      + '<span style="color:#0000ff;">상신함</span>에서 확인하세요.';
	                        var m = Ext.DomHelper.overwrite(msgCt, createAlarmBox('알림', s), true);
	                        m.hide();
	                        m.slideIn('t').ghost('t', { delay: 5000, remove: true});
	             		}
	             	}]
	        	});
	             	
	            Socket.connect();
	    	}, 2000);
        }
	    
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
					height: 400,
					width: 400,
					layout: 'fit',
					iconCls: 'icon-offwork',
					closeAction: 'destroy',
					resizable: false,
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
				        	height: 130,
				        	listeners: {
				        		afterrender: function(txt) {
				        			offworkObj.txtWorkContent = txt;
				        		}
				        	}
				        },{
				        	fieldLabel: '야근유형',
				        	xtype: 'combo',
				        	queryMode: 'remote',
				        	displayField: 'overworkName',
					        valueField: 'overworkCode',
					        editable: false,
					        store: Ext.create('Drpnd.store.OverworkListStore'),
					        value: '0',
				        	listeners: {
				        		afterrender: function(combo) {
				        			offworkObj.comboOverworkType = combo;
				        		},
				        		change: function(c, nV) {
				        			if(nV == '0') {
				        				offworkObj.txtOutworkContent.setValue('');
				        				offworkObj.chkOverworkSix.setDisabled(true);
				        				offworkObj.chkOverworkSix.setValue(false);
				        				offworkObj.txtOutworkContent.setDisabled(true);
				        			}
				        			else {
				        				offworkObj.chkOverworkSix.setDisabled(false);
				        				offworkObj.txtOutworkContent.setDisabled(false);
				        			}
				        		}
				        	}
				        },{
				        	fieldLabel: '야근시작시간',
				        	xtype: 'checkbox',
				        	boxLabel: '6시부터(선택안하면 7시부터 적용)',
				        	disabled: true,
				        	listeners: {
				        		afterrender: function(chk) {
				        			offworkObj.chkOverworkSix = chk;
				        		}
				        	}
				        },{
				        	fieldLabel: '야근내용',
				        	height: 130,
				        	disabled: true,
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
					        { xtype: 'button', text: '퇴근', iconCls: 'icon-offwork', listeners: {
					        	click: function() {
					        		offwork();
					        	}
					        } },
					        { xtype: 'button', text: '닫기', iconCls: 'icon-close', listeners: {
					        	click: function(btn) {
					        		offWorkWin.close();
					        	}
					        } }
					    ]
					}]  
				});
				
		    	offWorkWin.show();
	    	}, true);
	    	
	    	
	    }
	    
	    function mySignClick() {
	    	
	    	CommonFn.checkSession(function() {
	    		var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: '/signatureview', load: function(dom) {
		    		signatureContentWin = dom.contentWindow;
		    	} });
		    	var mySignWin = Ext.create('Ext.window.Window', {
		    		title: '서명등록',
		    		width: 440,
					height: 350,
					layout: 'fit',
					iconCls: 'icon-sign',
					closeAction: 'destroy',
					modal: true,
					draggable: true,
					resizable: false,
					items: [iframe],
					dockedItems: [{
					    xtype: 'toolbar',
					    dock: 'bottom',
					    ui: 'footer',
					    //defaults: {minWidth: minButtonWidth},
					    items: [
					        { xtype: 'component', flex: 1 },
					        { xtype: 'button', iconCls: 'icon-sign', text: '등록', listeners: {
					        	click: function(btn) {
					        		signatureContentWin.regSignature(mySignWin);
					        	}
					        } },
					        { xtype: 'button', iconCls: 'icon-close', text: '닫기', listeners: {
					        	click: function(btn) {
					        		mySignWin.close();
					        	}
					        } }
					    ]
					}],
					listeners: {
						close: function() {
							
						}
					}
				});
				
		    	mySignWin.show();
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
	    					height: 500,
	    					draggable: false,
	    					modal: true,
	    					closable: false,
	    					resizable: false,
	    					closeAction: 'destroy',
	    					layout: 'fit',
	    					items: [getMyInfoForm(jo.datas[0])],
	    					buttons: [{
	    						text: '수정',
	    						id: 'btnRegist',
	    						iconCls: 'icon-modi',
	    					    handler: function() {
	    					    	modifyMyInfo();
	    				        }
	    					}, {
	    						text: '닫기',
	    						iconCls: 'icon-close',
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
	    	var signSrc = info.sign;
	    	
	    	if(signSrc == 'NOSIGN') {
	    		signSrc = '/resources/images/nosign.png'; //'http://placehold.it/200x80?text=NO SIGN'
	    	}
	    	
			return Ext.create('Ext.form.Panel', {
				 frame: true,
				 title: '내정보',
			     anchor: '100%',
			     bodyPadding: 5,
			     iconCls: 'icon-myinfo',

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
			        },{
			        	xtype: 'fieldcontainer',
	                    fieldLabel: '서명',
	                    layout: 'hbox',
	                    items: [{
	                    	xtype: 'image',
							width: 200,
							height: 80,
							src: signSrc
	                    }]
	                    
			        }/*,{
			        	xtype: 'image',
						width: 200,
						height: 80,
						margin: '10 0 10 95',
						src: signSrc
			        }*//*,{
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
	    	 var otVal = offworkObj.comboOverworkType.getValue();
	    	 var ocsVal = offworkObj.chkOverworkSix.getValue() ? 'Y' : 'N';
	    	 
	    	 //console.log(ocsVal);
	    	 //return;
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
					outworkContent: ocVal,
					overworkType: otVal,
					startFrom6: ocsVal
				},
				loadmask: {
					msg: '퇴근처리중 입니다.'
				},
				success: function(jo) {
					if(jo.success) {
						//Ext.MessageBox.alert('알림', jo.datas[0] + ' - '+ jo.datas[1] + ' 퇴근처리 되었습니다.');
						Ext.Msg.show({
							title: '',
							msg: jo.datas[0] + ' - '+ jo.datas[1] + ' 퇴근처리 되었습니다.',
							buttons: Ext.Msg.OK,
							icon: Ext.MessageBox.INFO
						});
						
						toolbarObj.btnOffwork.setDisabled(true);
						offWorkWin.close();
					}
					else {
						Ext.Msg.show({
							title: '',
							msg: jo.errMsg,
							buttons: Ext.Msg.OK,
							icon: Ext.MessageBox.WARNING
						});
						//Ext.MessageBox.alert('alert', jo.errMsg);
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
			
			worker.postMessage('SESSION');
		}
	    
	    var alarmButton = '';
	    if(!offworkNotAuto) {
	    	alarmButton = {
	    		xtype: 'button',
				iconCls: 'icon-lamp',
				text: '퇴근처리안됨',
				listeners: {
				   click: function() {
					  Ext.Msg.alert('', '어제 퇴근처리가 되지 않았습니다.<br/>퇴근시간/업무내용을 카톡으로 보내주세요<br/><b>e-biz팀 남기훈(차장)</b>'); 
				   }
				}
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
				   html: Html.logo + Html.appTitle
			   }, 
			   '->',alarmButton,{
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
						   btn.setDisabled(true);
						   
						   CommonFn.getLatLng(function(lat, lng) {
							   CommonFn.ajax({
									url: '/geuntae/gotowork?lat=' + lat + '&lng=' + lng,
									method:'GET',
									loadmask: {
										msg: '출근처리중 입니다.'
									},
									success: function(jo) {
										if(jo.success) {
											Ext.Msg.show({
												title: '',
												msg: jo.datas[0] + '분에 출근처리 되었습니다.',
												buttons: Ext.Msg.OK,
												icon: Ext.MessageBox.INFO
											});
											btn.setDisabled(true);
											toolbarObj.btnOffwork.setDisabled(false);
										}
										else {
											btn.setDisabled(false);
											Ext.Msg.show({
												title: '',
												msg: jo.errMsg,
												buttons: Ext.Msg.OK,
												icon: Ext.MessageBox.WARNING
											});
										}
									},
									failure: function() {
										btn.setDisabled(false);
									}
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
				   text: '회사메일',
				   iconCls: 'icon-email',
				   qtip: '★ 회사메일 등록 및 관리는 <br/><span style="color:#0000ff;font-weight:bold;">[강상훈사원]</span>에게 문의해 주세요',
				   listeners: {
					   click: function() {
						   window.open('https://auth.worksmobile.com/login/login?accessUrl=https%3A%2F%2Fcommon.worksmobile.com%2Fproxy%2Fmy', '_blank');
					   },
					   render: function(c) {
						   Ext.QuickTips.register({
							   target: c.getEl(),
			                   text: c.qtip,
			                   showDelay: 1,
			                   cls: 'qBodyStyle'
			               });
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
				   text: '서명등록',
				   iconCls: 'icon-sign',
				   listeners: {
					   click: function() {
						   mySignClick();
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
            }],
            listeners: {
            	afterlayout: function() {
            		createSocket();
                  	treeGyeoljae = Ext.query('#spTreeMyGyeoljae')[0];
                  	console.log(treeGyeoljae);
                     
            	}
            }
        });

        Ext.EventManager.onWindowResize(function(w, h) {
    		Observer.notifyWinResize(w, h);
    	});
        
        this.callParent(arguments);
    }
});
