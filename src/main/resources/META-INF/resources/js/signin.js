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
	
	function getForm() {
		return Ext.create('Ext.form.Panel', {
			 frame: true,
			 title: 'Form Fields',
		     anchor: '100%',
		     bodyPadding: 5,

		        fieldDefaults: {
		            labelAlign: 'left',
		            labelWidth: 90,
		            anchor: '100%'
		        },

		        items: [{
		            xtype: 'textfield',
		            name: 'textfield1',
		            fieldLabel: 'Text field',
		            value: 'Text field value'
		        }, {
		            xtype: 'hiddenfield',
		            name: 'hidden1',
		            value: 'Hidden field value'
		        },{
		            xtype: 'textfield',
		            name: 'password1',
		            inputType: 'password',
		            fieldLabel: 'Password field'
		        }, {
		            xtype: 'filefield',
		            name: 'file1',
		            fieldLabel: 'File upload'
		        }, {
		            xtype: 'textareafield',
		            name: 'textarea1',
		            fieldLabel: 'TextArea',
		            value: 'Textarea value'
		        }, {
		            xtype: 'displayfield',
		            name: 'displayfield1',
		            fieldLabel: 'Display field',
		            value: 'Display field <span style="color:green;">value</span>'
		        }, {
		            xtype: 'numberfield',
		            name: 'numberfield1',
		            fieldLabel: 'Number field',
		            value: 5,
		            minValue: 0,
		            maxValue: 50
		        }, {
		            xtype: 'checkboxfield',
		            name: 'checkbox1',
		            fieldLabel: 'Checkbox',
		            boxLabel: 'box label'
		        }, {
		            xtype: 'radiofield',
		            name: 'radio1',
		            value: 'radiovalue1',
		            fieldLabel: 'Radio buttons',
		            boxLabel: 'radio 1'
		        }, {
		            xtype: 'radiofield',
		            name: 'radio1',
		            value: 'radiovalue2',
		            fieldLabel: '',
		            labelSeparator: '',
		            hideEmptyLabel: false,
		            boxLabel: 'radio 2'
		        }, {
		            xtype: 'datefield',
		            name: 'date1',
		            fieldLabel: 'Date Field'
		        }, {
		            xtype: 'timefield',
		            name: 'time1',
		            fieldLabel: 'Time Field',
		            minValue: '1:30 AM',
		            maxValue: '9:15 PM'
		        }]
		});
	}
	
	
	function reg() {
		regWin = Ext.create('Ext.window.Window', {
			title: '사원등록',
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
			}]
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
			if(wins[x] != null) {
				resize(w, h, wins[x]);
			}
		}
	});
});