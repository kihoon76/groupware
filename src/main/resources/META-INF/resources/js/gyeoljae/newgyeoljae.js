$(document).ready(function() {
	
	var $btnSearchSawon = $('#btnSearchSawon');
	var $txtSearchSawon = $('#txtSearchSawon');
	var gyeoljaeAddObj = {};
	var delImgUrl = '/resources/images/delete.png';
	
	$btnSearchSawon.on('click', function() {
		var searchSawonName = $.trim($txtSearchSawon.val());
		var param = {excludeSawon: excludeSawonData()};
		
		if(searchSawonName != '') {
			param.searchSawonName = searchSawonName;
		}
		
		common.checkSession(function() {
			common.ajaxExt({
				url: 'gyeoljae/search/sawon',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				jsonData: param,
				loadmask: {
					msg: '사원검색중 입니다.'
				},
				success: function(jo) {
					openSawonSearchWin(jo.datas);
				}
			});
		});
	});
	
	function addSawonClick(win) {
		if($.isEmptyObject(gyeoljaeAddObj)) {
			common.showExtMsg({
				msg: '결재라인에 추가할 사원을 선택해 주세요.',
				type: 'alert'
			});
			
			return;
		}
		
		addDataInTabulator();
		gyeoljaeAddObj = {};
		win.close();
		
	}
	
	function addDataInTabulator() {
		for(var v in gyeoljaeAddObj) {
			gyeoljaeAddObj[v].del = delImgUrl;
			gyeoljaeLine.addRow(gyeoljaeAddObj[v]);
		}
	}
	
	function openSawonSearchWin(datas) {
		var len = datas.length;
		
		if(len > 0) {
			var items = [];
			var item = null;
			
			for(var i=0; i<len; i++) {
				item = datas[i];
				items.push({
					xtype: 'checkbox',
					boxLabel: item.sawonName + '(' + item.sawonId + ')(' + item.sawonPosition + ')(' + item.email + ')',
					_value: item,
					listeners: {
						change: function(chk, value) {
							var _v = chk._value;
							
							if(value) {
								gyeoljaeAddObj[_v.sawonId] = _v;
							}
							else {
								delete gyeoljaeAddObj[_v.sawonId];
							}
							
						}
					}
				});
			}
			
			var win = parent.Ext.create('Ext.window.Window', {
				title: '사원검색결과',
				iconCls: 'icon-search',
				width: 600,
				height: 400,
				autoScroll: true,
				closeAction: 'destroy',
				bodyPadding: '10 10 10 10',
				resizable: false,
				modal: true,
				items: items,
				buttons:[{
					text: '결재라인추가',
					iconCls: 'icon-add',
					listeners: {
						click: function() {
							addSawonClick(win);
						}
					}
				},{
					text: '닫기',
					iconCls: 'icon-close',
					listeners: {
						click: function() {
							win.close();
							gyeoljaeAddObj = {};
						}
					}
				}]
			});
			
			win.show();
		}
		else {
			common.showExtMsg({
				msg: '결재라인에 있거나 존재하지 않는 사원입니다.',
				type: 'alert'
			});
		}
	}
	
	function excludeSawonData() {
		var datas = getGyeoljaeLineData();
		var len = datas.length;
		
		if(len > 0) {
			var d = [];
			for(var i=0; i<len; i++) {
				d.push(datas[i].sawonCode);
			}
			
			return d.join(',');
		}
		
		return '';
	}
	
	function getGyeoljaeLineData() {
		return gyeoljaeLine.getData();
		
	}
	
	var tableData = [
	    {sawonCode: '1', sawonName: '남기훈', sawonId: 'khnam', sawonPosition: '부장', email: 'test@tyty.com', del: delImgUrl},
	    {sawonCode: '2', sawonName: '박승석', sawonId: 'sspark', sawonPosition: '차장', email: 'test@tyty.com', del: delImgUrl},
	];
	
	var gyeoljaeLine = new Tabulator('#gyeoljaeLine', {
		ajaxURL: '/gyeoljae/myline',
		ajaxResponse: function(url, params, response) {
			if(response.success) {
				var datas = response.datas;
				var len = datas.length;
				
				for(var i=0; i<len; i++) {
					datas[i].del = delImgUrl;
				}
				
				$('#btnSangsin').prop('disabled', false);
				$('#btnSearchSawon').prop('disabled', false);
				
				return datas;
			}
			else {
				
			}
		},
		layout:'fitColumns',
	    autoResize:true,
	    //selectable:1,
		height: '200px',
		movableRows: true,
		columns: [
		    {rowHandle:true, formatter:'handle', headerSort:false, frozen:true, width:30, minWidth:30},
		    {title:'사원코드', field:'sawonCode', visible: false},
		    {title:'사원명', field:'sawonName', width:150,  headerSort:false},
		    {title:'사원아이디', field:'sawonId', width:200,  headerSort:false},
		    {title:'직급', field:'sawonPosition', width:100,  headerSort:false},
		    {title:'이메일', field:'email', width:200,  headerSort:false},
		    {title:'삭제', field:'del', width:40,  headerSort:false, formatter: 'image', formatterParams: {
		    	width: '20px', height: '20px'
		    }, cellClick:function(e, cell) {
		    	var row = cell.getRow();
		    	row.delete();
		    }}
		],
		//data: tableData,
		rowMoved:function(row) {
			
		}
	});
	
	console.log(gyeoljaeLine.getData());
	
	var toolbarOptions = [
	                      [{
	                        'header': [1, 2, 3, 4, 5, 6, false]
	                      }],
	                      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
	                      ['blockquote', 'code-block'],

	                      [{
	                        'header': 1
	                      }, {
	                        'header': 2
	                      }], // custom button values
	                      [{
	                        'list': 'ordered'
	                      }, {
	                        'list': 'bullet'
	                      }],
	                      [{
	                        'script': 'sub'
	                      }, {
	                        'script': 'super'
	                      }], // superscript/subscript
	                      [{
	                        'indent': '-1'
	                      }, {
	                        'indent': '+1'
	                      }], // outdent/indent
	                      [{
	                        'direction': 'rtl'
	                      }], // text direction

	                      [{
	                        'size': ['small', false, 'large', 'huge']
	                      }], // custom dropdown

	                      [{
	                        'color': []
	                      }, {
	                        'background': []
	                      }], // dropdown with defaults from theme
	                      [{
	                        'font': []
	                      }],
	                      [{
	                        'align': []
	                      }],
	                      ['link', 'image'],

	                      ['clean'] // remove formatting button
	                    ];

	                  var quillFull = new Quill('#document-full', {
	                    modules: {
	                      toolbar: toolbarOptions,
	                      autoformat: true
	                    },
	                    theme: 'snow',
	                    placeholder: "Write something..."
	                  });
});