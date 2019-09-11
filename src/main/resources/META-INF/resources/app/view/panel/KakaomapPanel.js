Ext.define('Drpnd.view.panel.KakaomapPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.kakaopanel',
	initComponent: function() {
		var kakaoWin;
		var jijeok;
		var mask;
		
		var grid = Ext.create('Ext.grid.Panel',{
			store: {
				autolaod: false,
				fields: [{
		            name: 'photoNum',
		            mapping: 'photoNum',
		            type: 'string'
		        }, {
		            name: 'photoName',
		            mapping: 'photoName',
		            type: 'string'
		        }, {
		            name: 'photoType',
		            mapping: 'photoType',
		            type: 'String'
		        }, {
		        	name: 'photoSize',
		        	mapping: 'photoSize',
		        	type: 'string'
		        }, {
		        	name: 'photoObj',
		        	mapping: 'photoObj',
		        }],
		        reader: {
		            type: 'json'
		        }
			},
			width:'100%',
			height:200,
			columns: [{
		        header: '번호',
		        dataIndex: 'photoNum'
		    }, {
		        header: '파일명',
		        flex:1,
		        dataIndex: 'photoName',
		        width: 150
		    }, {
		        header: '파일타입',
		        dataIndex: 'photoType',
		        width: 150
		    }, {
		    	header: '파일사이즈',
		    	dataIndex: 'photoSize',
		    	width: 150
		    }, {
		    	header: '파일',
		    	dataIndex: 'photoObj',
		    	width: 150,
		    	hidden: true
		    }],
		    emptyText: '사진을 선택해 주세요.'
		});
		
		function gridClear() {
			grid.getStore().removeAll();
		}
		
		Ext.apply(this, {
			autoScroll: false,
			//layout: 'fit',
			tbar:[{
				xtype: 'button',
				text: '지적도',
				iconCls: 'icon-jijeokdo',
				listeners: {
					afterrender: function(button) {
						jijeok = button;
						jijeok.mode='J';
					}
				}
			}, {
				xtype: 'button',
				text: '사진선택',
				qtip: '★ 전체선택 (CTRL+A)',
				iconCls: 'icon-camera',
				listeners: {
					click: function() {
						if(!kakaoWin) {
							Ext.Msg.show({
								msg: '사진탭을 닫고 다시 열어주세요',
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.WARNING,
							});
						}
						else {
							kakaoWin.callPhotos();
						}
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
			}, {
				xtype: 'button',
				iconCls: 'icon-refresh',
				text: '새로고침',
				listeners: {
					click: function() {
						gridClear();
						kakaoWin.callPhotosClear();
					}
				}
			}/*,{
				xtype: 'filefield',
				buttonText:'사진선택',
				buttonOnly: true,
				multiple: true,
				listeners: {
					afterrender: function(fileObj) {
						fileObj.fileInputEl.set({multiple: 'multiple'})
					},
					change: function(fileObj) {
						var files = fileObj.fileInputEl.dom.files;
						var len = files.length;
						datas.length = 0;
						
						for(var i=0; i<len; i++) {
							datas.push({
								photoNum: i+1,
								photoName: files[i].name,
								photoType: files[i].type,
								photoSize: files[i].size
							});
						}
						
						grid.getStore().loadData(datas);
						kakaoWin.callPhotos(files);
					}
				}
			}*/],
			items:[grid,Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'view/photos', height: 600, load: function(dom) {
				setTimeout(function() {
					kakaoWin = dom.contentWindow;
					kakaoWin.setUp(jijeok, grid, mask);
				}, 1000);
				
			} })],
			listeners: {
				afterrender: function(panel) {
					mask = new Ext.LoadMask(panel, {msg: '로딩중 입니다.'});
					mask.show();
				}
			}
		});
		
		this.callParent(arguments);
	}
});