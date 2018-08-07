<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<head>
	<title>동림피엔디</title>
	<link rel="icon" href="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}${req.contextPath}/resources/images/favicon.png" type="image/png" />
	<link rel="stylesheet" href="/resources/core/ver/4.1.1-rc2/css/ext-all-gray.css"/>
</head>
<body>
	<script src="/resources/core/ver/4.1.1-rc2/js/ext-all.js"></script>
	
	<!-- locale -->
	<script src="/resources/core/locale/ext-lang-ko.js"></script>
	
	<script>
		Ext.onReady(function() {
			
			function submit() {
				var form = Ext.getCmp('form').getForm();
	        	if (form.isValid()) {
	            	form.submit({
	            		success: function(form, action) {
	                        window.location.href = '/main';
	                     },
	                     failure: function(form, action) {
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
					src: '/resources/images/site.png'
				}, {
					xtype: 'form',
					id: 'form',
					bodyPadding: 30,
					height: 250,
					url: '/login',
					defaults: {
		                width: 400,
		                labelWidth: 50
		            },
		            defaultType: 'textfield',
					items: [{
						fieldLabel: '아이디',
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
					text: '로그인',
					formBind: true, //only enabled once the form is valid
					id: 'btnLogin',
				    handler: function() {
				    	submit();
			        }
				}]
			}).show();
			
			Ext.EventManager.onWindowResize(function(w, h) {
				var xPos = (w/2) - (loginWin.getWidth()/2);
				var yPos = (h/2) - (loginWin.getHeight()/2);
				loginWin.setPosition(xPos, yPos);
			});
		});
	</script>
</body>