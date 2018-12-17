Ext.define('Drpnd.view.Viewport', {
    extend : 'Ext.container.Viewport'
   ,requires: ['Drpnd.util.CommonFn', 'Drpnd.util.Html']
   ,initComponent: function(){
	    var CommonFn = Drpnd.util.CommonFn;
	    var Html = Drpnd.util.Html;
	    var isGotowork = Ext.getBody().getAttribute('data-gotowork') || false;
	    
	    var toolbarObj = {
	    	btnOffwork: null,
	    	btnGotowork: null
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
				   xtype: 'button',
				   text: '출근처리',
				   iconCls: 'icon-gotowork',
				   listeners: {
					   afterrender: function(btn) {
						   toolbarObj.btnGotowork = btn;
						   btn.setDisabled(isGotowork);
					   },
					   click: function(btn) {
						   CommonFn.ajax({
								url: '/geuntae/gotowork',
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
						   btn.setDisabled(!isGotowork);
					   },
					   click: function() {
						   Ext.Msg.confirm(
								'퇴근처리',
								'로그아웃 하시겠습니까?',
								function(button) {
									logoutClick(button);
								}
						   );
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
									logout(button);
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

        this.callParent(arguments);
    }
});
