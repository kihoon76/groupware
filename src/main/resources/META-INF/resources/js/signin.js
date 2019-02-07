Ext.Loader.setConfig({
	enabled: true,
	disableCaching: false,
	paths: {
		'Drpnd.store': '/resources/app/store',
		'Drpnd.util': '/resources/app/util',
		'Drpnd.custom': '/resources/app/custom'
	}
});

Ext.require([
	'Drpnd.util.CommonFn',
	//'Drpnd.custom.SawonRegForm'
]);

Ext.onReady(function() {
	var CommonFn = Drpnd.util.CommonFn;
	
	if(CommonFn.checkBrower().msie || CommonFn.checkBrower().msedge) {
		Ext.Msg.show({
			title: '브라우저 알림',
			msg: 'Explorer에서는 일부기능이 동작하지 않습니다.<br/>크롬을 설치해 주세요 (<a href="https://www.google.co.kr/chrome/index.html" target="_blank" style="font-size:.9em; color:#298A08;">크롬다운로드</a>)',
			buttons: Ext.Msg.OK,
			icon: parent.Ext.MessageBox.WARNING,
			fn: function(btn) {
				window.location.reload();
			}
		});
	}
	else {
		var SawonRegForm = Ext.create('Drpnd.custom.SawonRegForm');
		
		function submit() {
			var form = Ext.getCmp('form').getForm();
	    	if (form.isValid()) {
	    		var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"로그인 중입니다..."});
				myMask.show();
	        	form.submit({
	        		success: function(form, action) {
	                    window.location.href = '/main';
	                 },
	                 failure: function(form, action) {
	                	myMask.hide();
	                 	var result = action.result;
	                	var msg;
	                	 
	                	switch(result.errCode) {
	                	case '103' :
	                		msg = '권한이 없습니다';
	                		break;
	                	case '202' :
	                		msg = '이미 로그인된 계정입니다.';
	                		break;
	                	default :
	                		msg = '아이디/패스워드 정보가 올바르지 않습니다';
	                		break;
	                	 }
	                	 
	                    Ext.Msg.alert('실패', msg);
	                 }
	        	});
	        }
		}
		
		var regWin = null;
		
		function sendRegForm() {
			if(SawonRegForm.isValid()) {
				CommonFn.ajax({
					url: '/sawon/reg',
					method:'POST',
					headers: { 'Content-Type': 'application/json' }, 
					jsonData: SawonRegForm.getJsonParam(),
					timeout:60000,
					success: function(jo) {
						
						if(jo.success) {
							Ext.Msg.alert('', '사원등록 되었습니다.', function() {
								regWin.close();
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
								Ext.Msg.alert('에러', 'DB 오류입니다.');
							}
						}
					}
				});
			}
			

		}
		
		function getForm() {
			return Ext.create('Ext.form.Panel', {
				frame: true,
				title: '사원등록',
			    anchor: '100%',
			    bodyPadding: 5,
			    iconCls: 'icon-regist',
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
		            	}
		            }
		        },{
		            xtype: 'textfield',
		            name: 'sawonId',
		            fieldLabel: '아이디',
		            listeners: {
		            	afterrender: function(txt) {
		            		SawonRegForm.setIdTxt(txt);
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
		            value: '010-',
		            listeners: {
		            	afterrender: function(txt) {
		            		SawonRegForm.setPhoneTxt(txt);
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
		            	}
		            }
		        },{
		            xtype: 'textfield',
		            name: 'sawonEmail',
		            fieldLabel: '이메일',
		            listeners: {
		            	afterrender: function(txt) {
		            		SawonRegForm.setEmailTxt(txt);
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
	            		padding: '0 50 0 0',
	            		_value: 'Y'
	            		
	            	},{
	            		boxLabel: '아니오',
	            		boxLabelAlign: 'after',
	            		checked: true,
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
		
		
		function reg() {
			regWin = Ext.create('Ext.window.Window', {
				title: '동림피엔디 로그인',
				width: 500,
				height: 500,
				closeAction: 'destroy',
				draggable: false,
				closable: false,
				resizable: false,
				layout: 'fit',
				iconCls: 'icon-dongrim',
				items: [getForm()],
				buttons: [{
					text: '등록',
					id: 'btnRegist',
					iconCls: 'icon-regist',
				    handler: function() {
				    	sendRegForm()
			        }
				}, {
					text: '취소',
				    handler: function() {
				    	regWin.close();
			        }
				}],
				listeners: {
					destroy: function() {
						SawonRegForm.initSetting();
					}
				}
			}).show();
		}
		
		Ext.getDoc().on('keydown', function(e, t) {
			if(e.getKey() == e.BACKSPACE) {
				if(t.hasAttribute('readonly')) {
					return false;
				}
			}
			else if(t.nodeName == 'BODY' || t.nodeName == 'DIV') return false;
		});
		
		
		var loginWin = Ext.create('Ext.window.Window', {
			title: '동림피엔디 로그인',
			width: 500,
			height: 500,
			draggable: false,
			closable: false,
			resizable: false,
			iconCls: 'icon-dongrim',
			//layout: 'fit',
			items:[{
				xtype: 'image',
				anchor: '100%',
				height: 300,
				src: '/resources/images/dongrim.png'
			}, {
				xtype: 'form',
				id: 'form',
				bodyPadding: 30,
				height: 250,
				url: '/login',
				defaults: {
	                width: 400,
	                labelWidth: 55
	            },
	            defaultType: 'textfield',
				items: [{
					fieldLabel: '아이디',
					name: 'id',
					height: 30,
					allowBlank: false,
				},{
					fieldLabel: '비밀번호',
					inputType: 'password',
					name: 'pw',
					height: 30,
					allowBlank: false,
					enableKeyEvents: true,
					listeners: {
						keydown: function(btn, e) {
							if(e.keyCode == 13) {
								submit();
							}
						}
					}
				}]
			}],
			buttons: [{
				text: '사원등록',
				id: 'btnRegSawon',
				iconCls: 'icon-regist',
				disabled: true,
			    handler: function() {
			    	reg();
		        }
			}, {
				text: '로그인',
				formBind: true, //only enabled once the form is valid
				id: 'btnLogin',
				iconCls: 'icon-login',
			    handler: function() {
			    	submit();
		        }
			}]
		}).show();
		
		function resize(w, h, win) {
			var xPos = (w/2) - (win.getWidth()/2);
			var yPos = (h/2) - (win.getHeight()/2);
			win.setPosition(xPos, yPos);
		}
		
		Ext.EventManager.onWindowResize(function(w, h) {
			var wins = [loginWin, regWin];
			for(var x=0; x<2; x++) {
				if(wins[x] != null && wins[x].isVisible()) {
					resize(w, h, wins[x]);
				}
			}
		});
	}
	

});