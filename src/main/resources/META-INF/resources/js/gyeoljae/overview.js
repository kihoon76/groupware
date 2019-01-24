$(document).ready(function() {
	
	var accRejectWin = null;
	
	var commonColumns = [
 		{title: '첨부', field:'attCnt', width:50, headerSort:false, align:'center', formatter: function(cell) {
			if(cell.getValue() > 0) {
				return '<img src="' + common.getClipImage() + '" style="width:25px; height:25px;"/>';
			}
			
			return '';
		}},
	    {title:'제목', field:'title', widthGrow:4, align:'center', headerSort:false},
	    {title:'작성자', field:'gianja', width:100, align:'center', headerSort:false},
	    {title:'상태', field:'status', width:150, align:'center', headerSort:false, formatter: function(cell) {
	    	if(cell.getValue() == '반려') {
	    		return '<span style="color: #ff0000;">' + cell.getValue() + '</span>';
	    	}
	    	
	    	return cell.getValue();
	    }},
	    {title:'작성일자', field:'writeDate', width:200, align:'center', headerSort:false}
	];
	
	
	var myGian = new Tabulator('#myGian', {
		//pagination: 'remote',
		ajaxURL: '/gyeoljae/mysangsin',
		paginationSize:10,
		ajaxResponse: function(url, params, response) {
			if(response.success) {
				var datas = response.datas;
				var len = datas.length;
				
				return datas;
			}
			else {
				
			}
		},
		placeholder: '내가 올린 기안이 없습니다.',
		layout:'fitColumns',
	    autoResize:true,
	    selectable:1,
		height: '200px',
		columns: commonColumns,
		rowClick: function(e, row) {
			
		}
	});
	
	function getMyGyeoljaeDetail(rowData) {
		common.checkSession(function() {
			common.ajaxExt({
				url: '/gyeoljae/mygyeoljae/' + rowData.sangsinNum,
				method: 'GET',
				loadmask: {
					msg: '결재문서를 로딩중입니다.'
				},
				success: function(jo) {
					openMyGyeoljaeWin(jo.datas[0]);
				}
			});
		});
	}
	
	function openMyGyeoljaeWin(sangsin) {
		var fileStore = parent.Ext.create('Ext.data.JsonStore', {
			fields: ['code', 'name', 'size', 'ext'],
			data:sangsin.attachFiles
		});
		
		var form = parent.Ext.widget('form', {
			layout: {
				type: 'vbox',
				align: 'strech'
			},
			border: false,
			bodyPadding: 10,
			fieldDefaults: {
				labelAlign: 'top',
				labelWidth: 100,
				labelStyle: 'font-weight:bold',
			},
			items: [{
				xtype: 'textfield',
				fieldLabel: '기안제목',
				readOnly: true,
				width: '100%',
				value: sangsin.title
			},{
				xtype: 'textfield',
				fieldLabel: '기안자',
				readOnly: true,
				width: '100%',
				value: sangsin.gianja
			},{
				xtype: 'textfield',
				fieldLabel: '기안작성일자',
				readOnly: true,
				width: '100%',
				value: sangsin.writeDate
			},{
				xtype: 'htmleditor',
				fieldLabel: '기안내용',
				width: '99.9%',
				height: 400,
				readOnly: true,
				value: sangsin.content
			},{
				xtype: 'grid',
				fieldLabel: '첨부파일',
				store: fileStore,
				columns: [
				    {text: '첨부파일명', dataIndex: 'name', flex:1},
				    {text: '파일크기', dataIndex: 'size', renderer: function(value) {
				    	var kb = Math.round((value/1024) * 10) / 10;
				    	return kb + 'K';
				    }},
				    {text: '다운로드', width: 100, dataIndex: 'ext', align: 'center', renderer: function(value) {
				    	return common.getFileFormatIcon(value);
				    }},
				],
				width: '100%',
				height: 80,
				listeners: {
					cellclick: function(grid, td, cellIndex, record) {
						var code = record.data.code;
						
						common.checkSession(function() {
							if(code) {
								var form = document.createElement('form');
								form.action = '/gyeoljae/file/' + code;
								form.method = 'POST';
								form.target = '_blank';
								
								var input = document.createElement('input');
								input.type = 'hidden';
							   
							    form.appendChild(input);
								form.style.display = 'none';
								document.body.appendChild(form);
								form.submit();
							}
						});
					
					}
				}
			}]
		});
		
		accRejectWin = parent.Ext.create('Ext.window.Window', {
			height: 800,
			width: 800,
			layout: 'fit',
			closeAction: 'destroy',
			closable: false,
			modal: true,
			draggable: false,
			resizable: false,
			items: form,
			dockedItems: [{
			    xtype: 'toolbar',
			    dock: 'top',
			    ui: 'footer',
			    //defaults: {minWidth: minButtonWidth},
			    items: [
			        { xtype: 'component', flex: 1 },
			        { xtype: 'button', text: '결재', iconCls: 'icon-gyeoljae', listeners: {
			        	click: function() {
			        		gyeoljaeClick(sangsin);
			        	}
			        } },
			        { xtype: 'button', text: '반려', iconCls: 'icon-reject', listeners: {
			        	click: function() {
			        		rejectClick(sangsin);
			        	}
			        } },
			        { xtype: 'button', text: '닫기', iconCls: 'icon-close', listeners: {
			        	click: function(btn) {
			        		accRejectWin.close();
			        	}
			        } }
			    ]
			}],
			listeners: {
				afterrender: function() {
					
				}
			}
		})
		
		accRejectWin.show();
	}
	
	function gyeoljaeClick(sangsin) {
		var txtField = null;
		common.checkSession(function() {
			var win = parent.Ext.create('Ext.window.Window', {
				title: '결재',
				iconCls: 'icon-gyeoljae',
				layout: 'fit',
				width: 400,
				height: 400,
				autoScroll: true,
				closeAction: 'destroy',
				//bodyPadding: '10 10 10 10',
				resizable: false,
				modal: true,
				items: [{
					xtype: 'textarea',
					emptyText: '의견을 입력하세요',
					listeners: {
						afterrender: function(txt) {
							txtField = txt;
						}
					}
				}],
				buttons:[{
					text: '결재',
					iconCls: 'icon-gyeoljae',
					listeners: {
						click: function() {
							var opinion = $.trim(txtField.getValue());
							if(opinion == '') {
								txtField.markInvalid('의견을 입력하세요.');
							}
							else {
								gyeoljae(win, sangsin, opinion);
							}
						}
					}
				},{
					text: '닫기',
					iconCls: 'icon-close',
					listeners: {
						click: function() {
							win.close();
						}
					}
				}]
			});
			
			win.show();
		});
	}
	
	function rejectClick(sangsin) {
		var txtField = null;
		common.checkSession(function() {
			var win = parent.Ext.create('Ext.window.Window', {
				title: '반려',
				iconCls: 'icon-reject',
				width: 400,
				height: 400,
				layout: 'fit',
				autoScroll: true,
				closeAction: 'destroy',
				//bodyPadding: '10 10 10 10',
				resizable: false,
				modal: true,
				items: [{
					xtype: 'textarea',
					emptyText: '반려사유를 입력하세요',
					listeners: {
						afterrender: function(txt) {
							txtField = txt;
						}
					}
				}],
				buttons:[{
					text: '반려',
					iconCls: 'icon-reject',
					listeners: {
						click: function() {
							var opinion = $.trim(txtField.getValue());
							if(opinion == '') {
								txtField.markInvalid('반려사유를 입력하세요.');
							}
							else {
								reject(win, sangsin, opinion);
							}
						}
					}
				},{
					text: '닫기',
					iconCls: 'icon-close',
					listeners: {
						click: function() {
							win.close();
						}
					}
				}]
			});
			
			win.show();
		});
	}
	
	function gyeoljae(win, sangsin, opinion) {
		common.ajaxExt({
			url: '/gyeoljae/commit/',
			headers: { 'Content-Type': 'application/json' }, 
			jsonData: {
				sangsinCode: String(sangsin.sangsinNum),
				opinion: opinion
			},
			loadmask: {
				msg: '결재중 입니다.'
			},
			success: function(jo) {
				console.log(jo);
				var param = {type: 'alert'};
				if(jo.success) {
					param.msg = '결재되었습니다.';
					param.callback = function() {
						win.close();
						accRejectWin.close();
						window.location.reload();
					}
				}
				else {
					param.msg = jo.errMsg;
				}
				common.showExtMsg(param);
			}
		});
	}
	
	function reject(win, sangsin, opinion) {
		common.ajaxExt({
			url: '/gyeoljae/reject/',
			headers: { 'Content-Type': 'application/json' }, 
			jsonData: {
				sangsinCode: String(sangsin.sangsinNum),
				opinion: opinion
			},
			loadmask: {
				msg: '반려중 입니다.'
			},
			success: function(jo) {
				console.log(jo);
				var param = {type: 'alert'};
				if(jo.success) {
					param.msg = '반려되었습니다.';
					param.callback = function() {
						win.close();
						accRejectWin.close();
						window.location.reload();
					}
				}
				else {
					param.msg = jo.errMsg;
					param.icon = parent.Ext.MessageBox.WARNING;
				}
				common.showExtMsg(param);
			}
		});
	}
	

	//내가 결재해야 할 목록
	var myGyeoljae = new Tabulator('#myGyeoljae', {
		ajaxURL: '/gyeoljae/mygyeoljae',
		ajaxResponse: function(url, params, response) {
			if(response.success) {
				var datas = response.datas;
				var len = datas.length;
				
				return datas;
			}
			else {
				
			}
		},
		placeholder: '내가 처리할 결재가 존재하지 않습니다.',
		layout:'fitColumns',
	    autoResize:true,
	    selectable:1,
		height: '200px',
		columns: commonColumns,
		rowClick: function(e, row) {
			getMyGyeoljaeDetail(row.getData());
		}
	});
});