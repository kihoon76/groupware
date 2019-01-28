$(document).ready(function() {
	var $txtSearchContent = $('#txtSearchContent');
	var $txtStartDate = $('#txtStartDate');
	var $txtEndDate = $('#txtEndDate');
	var searchStatus = 'A';
	var searchTextType = 'A';
	
	var columns = [
  		{title: '첨부', field:'attCnt', width:50, headerSort:false, align:'center', formatter: function(cell) {
 			if(cell.getValue() > 0) {
 				return '<img src="' + common.getClipImage() + '" style="width:15px; height:15px;"/>';
 			}
 			
 			return '';
 		}},
 	    {title:'제목', field:'title', widthGrow:4, align:'center', headerSort:false},
 	    {title:'작성자', field:'gianja', width:100, align:'center', headerSort:false},
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
	
	var myGian = new Tabulator('#myGian', {
		pagination: 'remote',
		ajaxURL: '/gyeoljae/mysangsin',
		paginationSize:5,
		paginationDataReceived: {
			'last_page':'totalPage',
			'data':'datas'
		},
		ajaxParams: {
			searchStatus: searchStatus,
			searchTextType: searchTextType,
			searchText: $.trim($txtSearchContent.val()),
			searchStartDate: $.trim($txtStartDate.val()),
			searchEndDate: $.trim($txtEndDate.val())
		},
		ajaxResponse: function(url, params, response) {
			if(response.success) {
				$('#spBadge').text(response.totalRow);
				return response;
			}
			else {
				common.showExtMsg({
					type: 'alert',
					msg: response.errMsg
				});
			}
		},
		placeholder: '내가 올린 기안이 없습니다.',
		layout:'fitColumns',
	    autoResize:true,
	    selectable:1,
		height: '800px',
		columns: columns,
		rowClick: function(e, row) {
			getMyGianDetail(row.getData());
		}
	});
	
	function getMyGianDetail(rowData) {
		common.checkSession(function() {
			common.ajaxExt({
				url: '/gyeoljae/mysangsin/' + rowData.sangsinNum,
				method: 'GET',
				loadmask: {
					msg: '나의 상신문서를 로딩중입니다.'
				},
				success: function(jo) {
					openMyGianWin(jo.datas[0]);
				}
			});
		});
	}
	
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
	
	function openMyGianWin(sangsin) {
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
						url: '/gyeoljae/comment/' + code,
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
				xtype: 'fieldcontainer',
				fieldLabel: '결재상황(결재완료나 반려일 경우 클릭하시면 의견을 보실수 있습니다)',
				labelWidth: 500,
				layout: 'hbox',
				items:gyeoljaeLineComponent
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
				    	if(value < 1024) {
				    		return value + 'Byte';
				    	}
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
		
		var win = parent.Ext.create('Ext.window.Window', {
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
			    dock: 'bottom',
			    ui: 'footer',
			    //defaults: {minWidth: minButtonWidth},
			    items: [
			        { xtype: 'component', flex: 1 },
			        { xtype: 'button', text: '닫기', iconCls: 'icon-close', listeners: {
			        	click: function(btn) {
			        		win.close();
			        	}
			        } }
			    ]
			}],
			listeners: {
				afterrender: function() {
					
				}
			}
		})
		
		win.show();
	}
	
	$('.input-daterange').datepicker({
		language: 'ko',
		autoclose: true,
		
	});
	
	$('#status').on('change', function() {
		searchStatus = $(this).val();
		console.log(searchStatus);
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
					msg: '검색할 제목을 입력하세요',
					callback: function() {
						$txtSearchContent.focus();
					}
				});
				
				return;
			}
		}
		
		
		myGian.setData('/gyeoljae/mysangsin', {
			searchStatus: searchStatus,
			searchTextType: searchTextType,
			searchText: $.trim($txtSearchContent.val()),
			searchStartDate: $.trim($txtStartDate.val()),
			searchEndDate: $.trim($txtEndDate.val())
		});
		
	});
});