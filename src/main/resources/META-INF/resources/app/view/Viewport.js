Ext.define('Drpnd.view.Viewport', {
    extend : 'Ext.container.Viewport'
   ,initComponent: function(){
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
				   html:'<span><img src="resources/images/logo.png" style="width:54px; height:40px"></span>'
			   }, 
			   '->', {
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
									if(button == 'yes') {
										var url = Ext.getBody().getAttribute('data-url');
										Ext.Ajax.request({
											url: url + '/logout',
											method: 'GET',
											success:function(res) {
												try {
													var data = JSON.parse(res.responseText);
													if(data.success) {
														window.location.href = url;
													}
													else {
														Ext.MessageBox.alert('info', '로그아웃에 실패했습니다.');
													}
												}
												catch(e) {
													throw e;
												}
											},
											failure: function() {
												Ext.MessageBox.alert('info', '로그아웃에 실패했습니다.');
											}
										});
									}
								});
						}
					}
			   }]
               //,html   : '<img src="../../resources/images/asher.png" style="width:200px; height:40px">'
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
