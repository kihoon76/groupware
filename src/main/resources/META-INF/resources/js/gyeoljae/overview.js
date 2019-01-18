$(document).ready(function() {
	
	var clipImg = '/resources/images/attachment.png';
	var commonColumns = [
 		{title: '첨부', field:'attCnt', width:50, headerSort:false, formatter: function(cell) {
			if(cell.getValue() > 0) {
				return '<img src="' + clipImg + '" style="width:25px; height:25px;"/>';
			}
			
			return '';
		}},
	    {title:'제목', field:'title', width:250,  headerSort:false},
	    {title:'작성자', field:'gianja', width:100,  headerSort:false},
	    {title:'상태', field:'status', width:150,  headerSort:false},
	    {title:'작성일자', field:'writeDate', width:200,  headerSort:false}
	];
	
	
	var myGian = new Tabulator('#myGian', {
		ajaxURL: '/gyeoljae/mysangsin',
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
				],
				width: '100%',
				height: 80
			}]
		});
		
		var win = parent.Ext.create('Ext.window.Window', {
			title: '',
			height: 800,
			width: 800,
			layout: 'fit',
			closeAction: 'destroy',
			modal: true,
			draggable: true,
			resizable: false,
			items: form,
			dockedItems: [{
			    xtype: 'toolbar',
			    dock: 'bottom',
			    ui: 'footer',
			    //defaults: {minWidth: minButtonWidth},
			    items: [
			        { xtype: 'component', flex: 1 },
			        { xtype: 'button', text: '결재', listeners: {
			        	click: function() {
			        		
			        	}
			        } },
			        { xtype: 'button', text: '닫기', listeners: {
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