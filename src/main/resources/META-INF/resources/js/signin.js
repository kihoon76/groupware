Ext.Loader.setConfig({
	enabled: true,
	disableCaching: false,
	paths: {
		'Drpnd.store': '/resources/app/store',
		'Drpnd.util': '/resources/app/util/'
	}
});

Ext.require('Drpnd.util.CommonFn');

Ext.onReady(function() {
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
	var departmentChanged = true;
	
	function eventHandlerDepartment(combo, records) {
		var comboTeam = Ext.getCmp('comboTeam');
		if(comboTeam.isDisabled()) comboTeam.setDisabled(false);
		
		var departmentCode = combo.getValue();
		departmentChanged = true;
		
		comboTeam.clearValue();
		comboTeam.getStore().setPCode(departmentCode);
	}
	
	function getForm() {
		return Ext.create('Ext.form.Panel', {
			 frame: true,
			 title: '사원등록',
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
		            allowBlank: false,
		            store: Ext.create('Drpnd.store.DepartmentListStore'),
		            listeners: {
		            	select: function(combo, records) {
		            		eventHandlerDepartment(combo, records);
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
		            allowBlank: false,
		            store: Ext.create('Drpnd.store.TeamListStore'),
		            disabled: true,
		            listeners: {
		            	beforequery: function(qe) {
		            		if(departmentChanged) {
		            			delete qe.combo.lastQuery;
		            			departmentChanged = false;
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
		            allowBlank: false,
		            store: Ext.create('Drpnd.store.PositionListStore')
		        },{
		            xtype: 'textfield',
		            name: 'sawonName',
		            fieldLabel: '사원명',
		            allowBlank: false
		        },{
		            xtype: 'textfield',
		            name: 'sawonId',
		            fieldLabel: '아이디',
		            allowBlank: false
		        },{
		            xtype: 'textfield',
		            name: 'sawonPassword',
		            inputType: 'password',
		            fieldLabel: '비밀번호',
		            allowBlank: false
		        },{
		            xtype: 'textfield',
		            id: 'passwordConfirm',
		            inputType: 'password',
		            fieldLabel: '비밀번호확인',
		            allowBlank: false
		        },{
		            xtype: 'textfield',
		            name: 'sawonPhone',
		            fieldLabel: '연락처',
		            allowBlank: false
		        },{
		            xtype: 'textfield',
		            name: 'sawonEmail',
		            fieldLabel: '이메일',
		            allowBlank: false
		        },{
		            xtype: 'datefield',
		            name: 'sawonBirthday',
		            fieldLabel: '생년월일',
		            format:'Y-m-d',
		            editable: false
		        },{
		        	xtype: 'radiogroup',
	            	fieldLabel: '성별',
	            	//height: 120,
	            	items: [{
	            		boxLabel: '남',
	            		boxLabelAlign: 'after',
	            		name: 'sawonManWoman',
	            		checked: true,
	            		id: 'rdoSawonMan',
	            		padding: '0 50 0 0',
	            		
	            	},{
	            		boxLabel: '여',
	            		boxLabelAlign: 'after',
	            		name: 'sawonManWoman',
	            		id: 'rdoSawonWoman'
	            	}]
		        },{
		        	xtype: 'radiogroup',
	            	fieldLabel: '팀리더',
	            	//height: 120,
	            	items: [{
	            		boxLabel: '예',
	            		boxLabelAlign: 'after',
	            		name: 'sawonTeamLeader',
	            		id: 'rdoSawonTeamLeaderY',
	            		padding: '0 50 0 0',
	            		
	            	},{
	            		boxLabel: '아니오',
	            		boxLabelAlign: 'after',
	            		checked: true,
	            		name: 'sawonTeamLeader',
	            		id: 'rdoSawonTeamLeaderN'
	            	}]
		        }]
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
			items: [getForm()],
			buttons: [{
				text: '등록',
				id: 'btnRegist',
			    handler: function() {
			    	
		        }
			}, {
				text: '취소',
			    handler: function() {
			    	regWin.close();
		        }
			}],
			listeners: {
				destroy: function() {
					departmentChanged = true;
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
				fieldLabel: '사원번호',
				name: 'id',
				height: 30,
				allowBlank: false,
			},{
				fieldLabel: '비번',
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
		    handler: function() {
		    	reg();
	        }
		}, {
			text: '로그인',
			formBind: true, //only enabled once the form is valid
			id: 'btnLogin',
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
});