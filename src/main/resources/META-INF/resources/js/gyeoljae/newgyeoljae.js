$(document).ready(function() {
	
	var $btnSearchSawon = $('#btnSearchSawon');
	var $btnSangsin = $('#btnSangsin');
	var $txtSearchSawon = $('#txtSearchSawon');
	var $gianTitle = $('#gianTitle');
	var $gyeoljaeFileUp = $('#gyeoljaeFileUp');
	var $gyeoljaeContent = $('#gyeoljaeContent');
	var gyeoljaeAddObj = {};
	var delImgUrl = '/resources/images/delete.png';
	var gyeoljaeSelectedFiles = {};
	
	function hasFileInGyeoljae() {
        for(var k in gyeoljaeSelectedFiles) {
            if(gyeoljaeSelectedFiles[k]) return true;
        }

        return false;
    }
	
	function getSangsinParams(isString) {
		var gyeoljaeLineData = getGyeoljaeLineData();
		var len = gyeoljaeLineData.length;
		var gyeoljaeParam = [];
		
		for(var i=0; i<len; i++) {
			gyeoljaeParam.push({
				sawonCode: String(gyeoljaeLineData[i].sawonCode),
				order: String(i+1)
			});
		}
		
		if(isString) {
			gyeoljaeParam = JSON.stringify(gyeoljaeParam);
		}
		
		var codeContent = $gyeoljaeContent.summernote('code');
		
		return {
			title: $.trim($gianTitle.val()),
			gyeoljaeLines: gyeoljaeParam,
			content: codeContent,
			plainContent: $(codeContent).text()
		}
	}
	
	function sangsin() {
		common.checkSession(function() {
			if(hasFileInGyeoljae()) {
				$gyeoljaeFileUp.startUpload();
		    }
			else {
				common.ajaxExt({
					url: '/gyeoljae/reg/newgyeoljae_nofile',
					method: 'POST',
					headers: { 'Content-Type': 'application/json' }, 
					jsonData: getSangsinParams(),
					loadmask: {
						msg: '상신중 입니다.'
					},
					success: function(jo) {
						var param = {type: 'alert'};
						if(jo.success) {
							param.icon = parent.Ext.MessageBox.INFO;
							param.callback = function() {
								window.location.reload();
							};
							param.msg = '상신되었습니다.';
						}
						else {
							param.msg = jo.errMsg;
						}
						
						common.showExtMsg(param);
					}
				});
			}
		});
	}
	
	function validateGyeoljaeTitle() {
		return $.trim($gianTitle.val()) != '';
	}
	
	function validateGyeoljaeLine() {
		return excludeSawonData() != '';
	}
	
	function validateGyeoljaeContent() {
		return !$gyeoljaeContent.summernote('isEmpty');
	}
	
	function clearGyeoljaeFile() {
		$gyeoljaeFileUp.reset();
		gyeoljaeSelectedFiles = {};
	}
	
	$gyeoljaeFileUp.uploadFile({
		fileName: 'file',
		showCancel: true,
		showDone: true,
		autoSubmit: false,
		showPreview: true,
		maxFileCount: 2,
		returnType: 'json',
		url: '/gyeoljae/reg/newgyeoljaeWithfile',
		dragdropWidth: '500px',
		previewHeight: '100px',
		previewWidth: '100px',
		statusBarWidth: '300px',
		//allowedTypes: 'jpg,png,gif',
		dynamicFormData: function() {
            return getSangsinParams(true);
        },
		onSuccess: function(files, data, xhr) {
			console.log(data)
			if(data.success) {
				common.showExtMsg({
					type: 'alert',
					icon: parent.Ext.MessageBox.INFO,
					msg: '상신되었습니다.',
					callback: function() {
						window.location.reload();
					}
				});
			}
			else {
				common.showExtMsg({
					type: 'alert',
					msg: '상신중 오류가 발생했습니다.',
					callback: function() {
						clearGyeoljaeFile();
					}
				});
			}
		},
		onError: function(files, status, errMsg, pd) {
			//세션만료
			if(status == 'parsererror') {
				common.showExtMsg({
					type: 'alert',
					msg: '세션만료 되었습니다.',
					callback: function() {
						parent.window.location.href = '/signin';
					}
				});
			}
			else {
				common.showExtMsg({
					type: 'alert',
					msg: '상신중 오류가 발생했습니다.',
					callback: function() {
						clearGyeoljaeFile();
					}
				});
			}
		},
		onSelect: function(files) {
			if(gyeoljaeSelectedFiles[files[0].name]) {
				common.showExtMsg({
					type: 'alert',
					msg: '같은 이름의 파일이 있습니다.'
				});
	            return false;
	        }
			
			gyeoljaeSelectedFiles[files[0].name] = files[0];
			return true;
		},
		onCancel: function(files) {
			 delete gyeoljaeSelectedFiles[files[0].name];
		}
	});
	   
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
					msg: '결재자검색중 입니다.'
				},
				success: function(jo) {
					openSawonSearchWin(jo.datas);
				}
			});
		});
	});
	
	$btnSangsin.on('click', function() {
		if(!validateGyeoljaeTitle()) {
			common.showExtMsg({
				type: 'alert',
				msg: '기안제목을 입력하세요',
				callback: function() {
					$gianTitle.focus();
				}
			});
			return;
		}
		
		if(!validateGyeoljaeLine()) {
			common.showExtMsg({
				type: 'alert',
				msg: '결재자를 입력하세요',
				callback: function() {
					$txtSearchSawon.focus();
				}
			});
			return;
		}
		
		if(!validateGyeoljaeContent()) {
			common.showExtMsg({
				type: 'alert',
				msg: '결재내용을 입력하세요',
				callback: function() {
					$gyeoljaeContent.summernote('focus');
				}
			});
			return;
		}
		
		sangsin();
	});
	
	function addSawonClick(win) {
		if($.isEmptyObject(gyeoljaeAddObj)) {
			common.showExtMsg({
				msg: '결재라인에 추가할 결재자를 선택해 주세요.',
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
				title: '결재자검색결과',
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
				msg: '결재라인에 있거나 결재권한이 없거나 존재하지 않는 사원입니다.',
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
		    {title:'사원명', field:'sawonName', width:150,  headerSort:false, align:'center'},
		    {title:'사원아이디', field:'sawonId', width:200,  headerSort:false, align:'center'},
		    {title:'직급', field:'sawonPosition', width:100,  headerSort:false, align:'center'},
		    {title:'이메일', field:'email', widthGrow:4,  headerSort:false, align:'center'},
		    {title:'삭제', field:'del', width:60,  headerSort:false, align:'center', formatter: 'image', formatterParams: {
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
	
	
	$gyeoljaeContent.summernote({
		lang: 'ko-KR',
		height: 300,
		placeholder: '기안내용',
		dialogsFade: true,
		fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New'],
		toolbar: [
		    ['style', ['bold', 'italic', 'underline', 'clear']],
		    ['font', ['strikethrough', 'superscript', 'subscript']],
		    ['fontname', ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New']],
		    ['fontsize', ['fontsize']],
		    ['color', ['color']],
		    ['para', ['ul', 'ol', 'paragraph']],
		    ['height', ['height']],
		    ['link'],
		    ['hr'],
		    ['undo'],
		    ['redo']
		],
	    popover: {
	    	link: [
	    	    ['link', ['linkDialogShow', 'unlink']]
	    	],
	    },
	    callbacks: {
	    	onBlur: function() {
	    		var codeContent = $gyeoljaeContent.summernote('code');
	    		var plainTxt = $(codeContent).text();
	    		
	    		console.log(codeContent);
	    		console.log(plainTxt);
	    	}
	    }
	});
});