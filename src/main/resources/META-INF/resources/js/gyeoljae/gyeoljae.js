var Gyeoljae = (function() {
	var multiWin = null;
	var paginationSize = 10;
	var extTreeGyeoljaeCount = $('#spTreeMyGyeoljae', window.parent.document);
	
	var commonColumns = [
  		{title: '첨부', field:'attCnt', width:50, headerSort:false, align:'center', formatter: function(cell) {
 			if(cell.getValue() > 0) {
 				return '<img src="' + common.getClipImage() + '" style="width:15px; height:15px;"/>';
 			}
 			
 			return '';
 		}},
 	    {title:'제목', field:'title', widthGrow:4, align:'center', headerSort:false},
 	    {title:'작성자', field:'gianja', width:100, align:'center', headerSort:false},
 	    {title:'결재타입', field:'type', width:100, align:'center', headerSort:false},
 	    {title:'상태', field:'status', width:150, align:'center', headerSort:false, formatter: function(cell) {
 	    	if(cell.getValue() == '반려') {
 	    		return '<span style="color: #ff0000;">' + cell.getValue() + '</span>';
 	    	}
 	    	else if(cell.getValue() == '결재중') {
 	    		return '<span style="color: #17a2b8;">' + cell.getValue() + '</span>';
 	    	}
 	    	
 	    	return cell.getValue();
 	    }},
 	    {title:'작성일자', field:'writeDate', width:200, align:'center', headerSort:false}
 	];
	
	function makeGyeoljaeHtml(data) {
		var style = '', name = '', status = '', code = '';
		var html = ['<div class="gyeoljae"><div class="wrapper"><div class="arrow-steps clearfix">'];
		for(var i=0; i<data.length; i++) {
			switch(data[i].status) {
			case 'D':
			case 'S':
				status = '결재중';
				style = 'submission';
				code = '-1';
				break;
			case 'C':
				status = '결재완료';
				style = 'commit';
				code = data[i].code;
				break;
			case 'R':
				status = '반려';
				style = 'reject';
				code = data[i].code;
				break;
			default:
				status = '&nbsp;';
				style = '';
				code = '-1';
				break;
			}
			html.push(getMalformedHtml(style, data[i].gyeoljaeja, status, code));
		}
		
		html.push('</div></div></div>');
		
		return html;
	}
	
	function getMalformedHtml(style, name, status, code) {
		return '<div class="step ' + style + '" data-code="' + code + '"> <span>' + status + ' (' + name + ')</span> </div>';
	}
	
	function openMyGianGyeoljaeWin(type, sangsin, isCommitted, ext) {
		var fileStore = parent.Ext.create('Ext.data.JsonStore', {
			fields: ['code', 'name', 'size', 'ext'],
			data:sangsin.attachFiles
		});
		
		function getGyeoljae(c) {
			var lines = sangsin.gyeoljaeLines;
			var len = lines.length;
			for(var i=0; i<len; i++) {
				if(lines[i].code == c) {
					if(lines[i].status == 'C') {
						return lines[i].gyeoljaeja + '(결재의견)';
					}
					
					return lines[i].gyeoljaeja + '(반려사유)';
				}
			}
			
			return '';
		}
		
		function clickFn(e) {
			var target = e.target;
			var nodeName = target.nodeName.toLowerCase();
			var divNode = nodeName == 'span' ? target.parentNode : target;
			var code = divNode.getAttribute('data-code');
			
			 
			if(code != null && code != '-1') {
				common.checkSession(function() {
					common.ajaxExt({
						url: isCommitted ? '/gyeoljae/comment/' + code + '?committed' : '/gyeoljae/comment/' + code,
						method: 'GET',
						loadmask: {
							msg: '의견을 로딩중입니다.'
						},
						success: function(jo) {
							if(jo.success) {
								if(jo.datas.length == 1) {
									parent.Ext.create('Ext.window.Window', {
										title: getGyeoljae(code),
										height: 200,
										width: 200,
										layout: 'fit',
										closeAction: 'destroy',
										modal: true,
										draggable: false,
										resizable: false,
										items: [{
											xtype: 'textarea',
											readOnly: true,
											value: jo.datas[0]
										}]
									}).show();
								}
								else {
									common.showExtMsg({
										type: 'alert',
										msg: '의견이 없습니다.'
									});
								}
							}
							else {
								common.showExtMsg({
									type: 'alert',
									msg: jo.errMsg
								});
							}
						}
					});
				});
			}
		}
		
		var renderTpl = makeGyeoljaeHtml(sangsin.gyeoljaeLines);
		var gyeoljaeLineComponent = new parent.Ext.container.Container({
		    width: 700,
		    height: 50,
		    layout: 'fit',
		    items: {
		        xtype: 'component',
		        renderTpl: renderTpl,
		        listeners: {
		        	render: function(c) {
		        		c.getEl().on({
		        			click: clickFn
		        		});
		        	},
		        	destroy: function(c) {
		        		c.getEl().un('click', clickFn);
		        	}
		        }
		    },
		});
		
		var gyeoljaeType = sangsin.gyeoljaeType;
		if(gyeoljaeType == '2') {
			gyeoljaeType = '휴가';
			if(sangsin.startDate && sangsin.endDate) {
				gyeoljaeType = gyeoljaeType + ' (' + sangsin.startDate + ' ~ ' + sangsin.endDate + ')';
			}
		}
		else {
			gyeoljaeType = '일반업무';
		}
		
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
				fieldLabel: '기안타입',
				readOnly: true,
				width: '100%',
				value: gyeoljaeType
			},{
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
				xtype: 'fieldcontainer',
				fieldLabel: '결재상황(결재완료나 반려일 경우 클릭하시면 의견을 보실수 있습니다)',
				labelWidth: 500,
				layout: 'hbox',
				items:gyeoljaeLineComponent
			},{
				xtype: 'htmleditor',
				fieldLabel: '기안내용',
				width: '99.9%',
				height: 200,
				readOnly: true,
				value: sangsin.content
			},{
				xtype: 'grid',
				fieldLabel: '첨부파일',
				store: fileStore,
				columns: [
				    {text: '첨부파일명', dataIndex: 'name', flex:1},
				    {text: '파일크기', dataIndex: 'size', renderer: function(value) {
				    	if(value < 1024) {
				    		return value + 'Byte';
				    	}
				    	else if(value < 1024*1024) {
				    		var kb = Math.round((value/1024) * 10) / 10;
					    	return kb + 'K';
				    	}
				    	else {
				    		var mb = Math.round((value/(1024*1024)) * 10) / 10;
					    	return mb + 'M';
				    	}
				    	
				    }},
				    {text: '다운로드', width: 100, dataIndex: 'ext', align: 'center', renderer: function(value, meta) {
				    	meta.tdAttr = 'data-qtip="다운로드 하시려면 이미지를 클릭하세요."';
				    	return common.getFileFormatIcon(value);
				    }},
				],
				width: '100%',
				height: 60,
				draggable: false,
				enableColumnHide: false,
				enableColumnMove: false,
				listeners: {
					cellclick: function(grid, td, cellIndex, record) {
						var code = record.data.code;
						if(cellIndex == 2) {
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
									
									document.body.removeChild(form);
								}
							});
						}
					}
				}
			}]
		});
		
		var winParam = {
			height: 600,
			width: 800,
			layout: 'fit',
			closeAction: 'destroy',
			closable: false,
			modal: true,
			draggable: false,
			resizable: false,
			items: form
		};
		
		if(type == 'gian') {
			var btnItems = [{ xtype: 'component', flex: 1 }];
			if(isCommitted) {
				//결재타입이 휴가면 문서
				if(sangsin.gyeoljaeType == '2') {
					btnItems.push({ xtype: 'button', text: '문서출력', iconCls: 'icon-print', listeners: {
			        	click: function(btn) {
			        		vacationDoc(sangsin.sangsinNum);
			        	}
			        } });
				}
				
				
				btnItems.push({ xtype: 'button', text: '닫기', iconCls: 'icon-close', listeners: {
		        	click: function(btn) {
		        		multiWin.close();
		        	}
		        } });
			}
			else {
				if(sangsin.modify == 'Y') {
					btnItems.push({ xtype: 'button', text: '수정중 취소', iconCls: 'icon-modi', listeners: {
			        	click: function(btn) {
			        		modifyCancelMySangsin(btn, sangsin.sangsinNum);
			        	}
			        } });
				}
				
				if(sangsin.status != 'C' && sangsin.status != 'R') {
					btnItems.push({ xtype: 'button', text: '수정', iconCls: 'icon-modi', listeners: {
			        	click: function(btn) {
			        		console.log(sangsin);
			        		modifyMySangsin(sangsin, multiWin, ext);
			        	}
			        } });
				}
				else {
					if(sangsin.gyeoljaeType == '2') {
						btnItems.push({ xtype: 'button', text: '문서출력', iconCls: 'icon-print', listeners: {
				        	click: function(btn) {
				        		vacationDoc(sangsin.sangsinNum);
				        	}
				        } });
					}
				}
				
				btnItems.push({ xtype: 'button', text: '닫기', iconCls: 'icon-close', listeners: {
		        	click: function(btn) {
		        		multiWin.close();
		        	}
		        } });
			}
			winParam.dockedItems = [{
			    xtype: 'toolbar',
			    dock: 'bottom',
			    ui: 'footer',
			    //defaults: {minWidth: minButtonWidth},
			    items: btnItems
			}];
		}
		else if(type == 'gyeoljae') {
			winParam.dockedItems = [{
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
			        		multiWin.close();
			        	}
			        } }
			    ]
			}];
		}
		
		multiWin = parent.Ext.create('Ext.window.Window', winParam);
		multiWin.show();
	}
	
	function vacationDoc(sangsinNum) {
		//multiWin.close();
		/*common.showExtMsg({
			type: 'alert',
			msg: '개발중입니다.'
		});*/
		
		docWin('/doc/vacation/' + sangsinNum, 'GET');
	}
	
	function docWin(url, method) {
		var form = document.createElement('form');
		form.action = url;
		form.method = method;
		form.target = '_blank';
		
		form.style.display = 'none';
		document.body.appendChild(form);
		form.submit();
	}
	
	function modifyCancelMySangsin(btn, sangsinNum) {
		common.checkSession(function() {
			common.ajaxExt({
				url: 'gyeoljae/modify/cancel/alarm/' + sangsinNum,
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				loadmask: {
					msg: '수정알림 취소중 입니다.'
				},
				success: function(jo) {
					if(jo.success) {
						btn.setVisible(false);
						common.showExtMsg({
							type: 'alert',
							icon: parent.Ext.MessageBox.INFO,
							msg: '수정취소 되었습니다.'
						});
					}
				}
			});
		});
	}
	
	function modifyMySangsin(sangsin, multiWin, ext) {
		common.checkSession(function() {
			common.ajaxExt({
				url: '/gyeoljae/check/editable/' + sangsin.sangsinNum,
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }, 
				success: function(jo) {
					if(jo.success) {
						console.log(jo);
						ext.dom.setAttribute('data-sangsin', sangsin.sangsinNum);
						ext.dom.click();
						multiWin.close();
//						common.showExtMsg({
//							type: 'alert',
//							icon: parent.Ext.MessageBox.INFO,
//							msg: '내근전환 되었습니다.'
//						});
					}
					else {
						common.showExtMsg({
							type: 'alert',
							msg: jo.errMsg
						});
					}
				}
			});
		});
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
					value: '승인합니다.',
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
					value: '반려합니다',
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
					
					var curCnt = parseInt(extTreeGyeoljaeCount.text());
					curCnt--;
					extTreeGyeoljaeCount.text(curCnt);
					
					param.msg = '결재되었습니다.';
					param.callback = function() {
						win.close();
						multiWin.close();
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
				var curCnt = parseInt(extTreeGyeoljaeCount.text());
				curCnt--;
				extTreeGyeoljaeCount.text(curCnt);
				
				var param = {type: 'alert'};
				if(jo.success) {
					param.msg = '반려되었습니다.';
					param.callback = function() {
						win.close();
						multiWin.close();
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
	
	function initSearchToolbar(url, tabObj) {
		var $txtSearchContent = $('#txtSearchContent');
		var $txtStartDate = $('#txtStartDate');
		var $txtEndDate = $('#txtEndDate');
		var searchStatus = 'A';
		var searchTextType = 'A';
		var searchGyeoljaeType = 'A';
		
		$('.input-daterange').datepicker({
			language: 'ko',
			autoclose: true,
		});
		
		$('#status').on('change', function() {
			searchStatus = $(this).val();
		});
		
		$('#selGyeoljaeType').on('change', function() {
			searchGyeoljaeType = $(this).val();
		});
		
		$('#selSearchTxt').on('change', function() {
			searchTextType = $(this).val();
			
			if(searchTextType == 'A') {
				$txtSearchContent.prop('disabled', true);
				$txtSearchContent.val('');
			}
			else {
				$txtSearchContent.prop('disabled', false);
			}
		});
		
		$('#btnSearch').on('click', function() {
			if(searchTextType != 'A') {
				if($.trim($txtSearchContent.val()) == '') {
					common.showExtMsg({
						type: 'alert',
						msg: searchTextType == 'G' ? '작성자이름을 입력하세요' : '검색할 제목을 입력하세요',
						callback: function() {
							$txtSearchContent.focus();
						}
					});
					
					return;
				}
			}
			
			tabObj.setData('/gyeoljae' + url, {
				searchStatus: searchStatus,
				searchTextType: searchTextType,
				searchGyeoljaeType: searchGyeoljaeType,
				searchText: $.trim($txtSearchContent.val()),
				searchStartDate: $.trim($txtStartDate.val()),
				searchEndDate: $.trim($txtEndDate.val()),
				
			});
			
		});
	}
	return {
		createTabulator: function(cfg) {
			var param = {};

			if(cfg.ajaxURL) param.ajaxURL = '/gyeoljae' + cfg.ajaxURL;
			if(cfg.ajaxParams) param.ajaxParams = cfg.ajaxParams;
			if(cfg.ajaxURL) {
				param.ajaxResponse = function(url, params, response) {
					if(response.success) {
						if(cfg.ajaxResponse) {
							return cfg.ajaxResponse(response);
						}
						else {
							return response.datas;
						}
					}
					else {
						common.showExtMsg({
							type: 'alert',
							msg: response.errMsg
						});
					}
				}
			}	
			
			if(cfg.pagination) {
				param.pagination = cfg.pagination;
				param.paginationSize = cfg.paginationSize || paginationSize;
				param.paginationDataReceived = {
					'last_page':'totalPage',
					'data':'datas'
				};
			}
			
			param.placeholder = cfg.placeholder || '결과가 없습니다.';
			param.layout = cfg.layout || 'fitColumns';
			param.autoResize = true;
			if(cfg.selectable) param.selectable = cfg.selectable;
			param.height = cfg.height || '500px';
			param.columns = cfg.columns || commonColumns;
			if(cfg.rowClick) {
				param.rowClick = function(e, row) {
					cfg.rowClick(e, row);
				}
			}
			
			var tab = new Tabulator(cfg.id, param);
			
			if(cfg.toolbar) {
				initSearchToolbar(cfg.ajaxURL, tab);
			}
			
			return tab;
		},
		getMyGianDetail: function(sangsinNum, ext) {
			common.checkSession(function() {
				common.ajaxExt({
					url: '/gyeoljae/mysangsin/' + sangsinNum,
					method: 'GET',
					loadmask: {
						msg: '나의 상신문서를 로딩중입니다.'
					},
					success: function(jo) {
						openMyGianGyeoljaeWin('gian', jo.datas[0], false, ext);
					}
				});
			});
		},
		getCommittedGianDetail: function(sangsinNum) {
			common.checkSession(function() {
				common.ajaxExt({
					url: '/gyeoljae/committedsangsin/' + sangsinNum,
					method: 'GET',
					loadmask: {
						msg: '상신문서를 로딩중입니다.'
					},
					success: function(jo) {
						openMyGianGyeoljaeWin('gian', jo.datas[0], true);
					}
				});
			});
		},
		getMyGyeoljaeDetail: function(sangsinNum, extGyeoljaeMod) {
			common.checkSession(function() {
				common.ajaxExt({
					url: '/gyeoljae/mygyeoljae/' + sangsinNum,
					method: 'GET',
					loadmask: {
						msg: '결재문서를 로딩중입니다.'
					},
					success: function(jo) {
						openMyGianGyeoljaeWin('gyeoljae', jo.datas[0]);
					}
				});
			});
		}
	}
})();