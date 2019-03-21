(function() {
	var panel = null;
	var btnSangsin = null;
	window.setGyeoljaeButton = function(p, s) {
		panel = p;
		btnSangsin = s;
	}
	
	$(document).ready(function() {
		var $btnRefresh = $('#btnRefresh');
		var $btnSearchSawon = $('#btnSearchSawon');
		var $btnModifySangsin = $('#btnModifySangsin');
		var $btnDeleteSangsin = $('#btnDeleteSangsin');
		var $txtSearchSawon = $('#txtSearchSawon');
		var $gianTitle = $('#gianTitle');
		var $gyeoljaeFileUp = $('#gyeoljaeFileUp');
		var $gyeoljaeContent = $('#gyeoljaeContent');
		var $selGyeoljaeType = $('#selGyeoljaeType');
		var $txtVacationStart = $('#txtVacationStart');
		var $txtVacationEnd = $('#txtVacationEnd');
		var $datepicker = $('#datepicker');
		var $body = $('body');
		var $dvContainer = $('#dvContainer');
		var $chkAlarm = $('#chkAlarm');
		var sangsinNum = $('#hdnSangsinNum').val();
		var $selGyeoljaeSubType = $('#selGyeoljaeSubType');
		var $dvGyeoljaeSubType = $('#dvGyeoljaeSubType');
		var $dvVacationTerm = $('#dvVacationTerm');
		var $dvDocNum = $('#dvDocNum');
		var $docNum = $('#docNum');
		var $numTerm = $('#numTerm');
		
		var gyeoljaeAddObj = {};
		var delImgUrl = '/resources/images/delete.png';
		var gyeoljaeSelectedFiles = {};
		var chkNoLogic = false;
		var attachFileCodeInDB = null;
		var hasAttachFileInDB = false;
		var removeAttachFileCodeInDB = null;
		var maxFileCount = 1
		
		function onKeyDown(e) {
			e.preventDefault();
		}
		
		$('.input-daterange').datepicker({
			language: 'ko',
			autoclose: true,
		})
		.on('changeDate', function(e) {
			var term = common.datediff($txtVacationStart.val(), $txtVacationEnd.val());
			$numTerm.val((term+1));
		});
		
		$chkAlarm.on('click', function(e, args) {
			var checked = $(this).hasClass('btn-default');
			
			if(checked) {
				modifyAlaram();
			}
			else {
				modifyCancelAlarm();
			}
			
		});
		
		$body.on('keydown', onKeyDown);
		
		$btnRefresh.on('click', function() {
			window.location.reload();
		});
		
		function refreshDisable(disable) {
			$btnRefresh.prop('disabled', disable);
		}
		
		function alarmDisable(disable) {
			$chkAlarm.prop('disabled', disable);
		}
		
		function alarmSuccess() {
			$chkAlarm.removeClass('btn-default').addClass('btn-info');
			$chkAlarm.html('알림OFF');
			$dvContainer.removeClass('modify-disabled').addClass('modify-enable');
			$body.off('keydown', onKeyDown);
		}
		
		function alarmCancelSuccess() {
			$chkAlarm.removeClass('btn-info').addClass('btn-default');
			$chkAlarm.html('알림ON');
			$dvContainer.removeClass('modify-enable').addClass('modify-disabled');
			$body.on('keydown', onKeyDown);
		}
		
		function modifyAlaram() {
			alarmDisable(true);
			common.checkSession(function() {
				common.ajaxExt({
					url: 'gyeoljae/modify/alarm/' + sangsinNum,
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
					loadmask: {
						msg: '수정알림중 입니다.'
					},
					success: function(jo) {
						if(jo.success) {
							alarmSuccess();
						}
						
						alarmDisable(false);
						refreshDisable(true);
					},
					failure: function() {
						alarmDisable(false);
					}
				});
			});
		}
		
		function modifyCancelAlarm() {
			alarmDisable(true);
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
							alarmCancelSuccess();
						}
						
						alarmDisable(false);
						refreshDisable(false);
					},
					failure: function() {
						alarmDisable(false);
					}
				});
			});
		}
		
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
			var param = null;
			
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
			var gyeoljaeType = $selGyeoljaeType.val();
			
			param = {
				title: $.trim($gianTitle.val()),
				gyeoljaeLines: gyeoljaeParam,
				content: codeContent,
				plainContent: $(codeContent).text(),
				gyeoljaeType: gyeoljaeType,
				sangsinNum: sangsinNum
			}
			
			if(removeAttachFileCodeInDB) {
				param.delAttachCode = removeAttachFileCodeInDB;
			}
			
			//휴가
			if(gyeoljaeType == '2') {
				param.startDate = $.trim($txtVacationStart.val());
				param.endDate = $.trim($txtVacationEnd.val());
				param.gyeoljaeSubType = $selGyeoljaeSubType.val();
				param.term = $numTerm.val();
			}
			else {
				param.docNum = $.trim($docNum.val());
			}
			
			return param;
		}
		
		function sangsin() {
			common.checkSession(function() {
				if(hasFileInGyeoljae()) {
					mask = new parent.Ext.LoadMask(panel, {msg: '파일 업로드 중입니다.'});
					mask.show();
					$gyeoljaeFileUp.startUpload();
			    }
				else {
					common.ajaxExt({
						url: '/gyeoljae/mod/mysangsinNoNewFile',
						method: 'POST',
						headers: { 'Content-Type': 'application/json' }, 
						jsonData: getSangsinParams(),
						loadmask: {
							msg: '상신수정중 입니다.'
						},
						success: function(jo) {
							var param = {type: 'alert'};
							if(jo.success) {
								param.icon = parent.Ext.MessageBox.INFO;
								param.callback = function() {
									window.location.reload();
								};
								param.msg = '상신 수정되었습니다.';
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
		
		function sangsinDel() {
			common.checkSession(function() {
				common.ajaxExt({
					url: '/gyeoljae/del/mysangsin/' + sangsinNum,
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }, 
					loadmask: {
						msg: '상신삭제중 입니다.'
					},
					success: function(jo) {
						var param = {type: 'alert'};
						if(jo.success) {
							param.icon = parent.Ext.MessageBox.INFO;
							param.callback = function() {
								btnSangsin.fireEvent('click', btnSangsin);
							};
							param.msg = '상신 삭제되었습니다.';
						}
						else {
							param.msg = jo.errMsg;
						}
						
						common.showExtMsg(param);
					}
				});
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
		
		function validateGyeoljaeType() {
			//휴가
			if($selGyeoljaeType.val() == '2') {
				var s = $.trim($txtVacationStart.val());
				var e = $.trim($txtVacationEnd.val());
				
				return s != '' && e != '';
			}
			
			return true;
		}
		
		function validateGyeoljaeSubType() {
			//휴가
			if($selGyeoljaeType.val() == '2') {
				var t = $.trim($numTerm.val());
				
				return t != '' && t >= 1;
			}
			
			return true;
		}
		
		function validateGyeoljaeDocNum() {
			if($selGyeoljaeType.val() == '1') {
				var d = $.trim($docNum.val());
				
				return /^\d+-\d+$/.test(d);
			}
			
			return true;
		}
		
		function clearGyeoljaeFile() {
			$gyeoljaeFileUp.reset();
			gyeoljaeSelectedFiles = {};
		}
		
		function checkMaxFileCount() {
			var arr = Object.keys(gyeoljaeSelectedFiles);
			if(arr.length >= maxFileCount) return false;
			
			return true;
		}
		
		$selGyeoljaeType
		.off('change')
		.on('change', function() {
			var v = $(this).val();
			//휴가
			if(v == '2') {
				$datepicker.show();
				$dvGyeoljaeSubType.show();
				$dvVacationTerm.show();
				//getVacationGyeoljaeLines();
			}
			else {
				$datepicker.hide();
				$dvGyeoljaeSubType.hide();
				$dvVacationTerm.hide();
				//getDefaultGyeoljaeLines();
			}
			
		});
		
		$gyeoljaeFileUp.uploadFile({
			fileName: 'file',
			showCancel: true,
			showDone: true,
			autoSubmit: false,
			showPreview: true,
			maxFileCount: maxFileCount,
			showAbort: false,
			returnType: 'json',
			url: '/gyeoljae/mod/mysangsinWithNewFile',
			dragdropWidth: '500px',
			previewHeight: '100px',
			previewWidth: '100px',
			statusBarWidth: '300px',
			maxFileSize: 50000000,
			//allowedTypes: 'jpg,png,gif',
			dynamicFormData: function() {
	            return getSangsinParams(true);
	        },
			onSuccess: function(files, data, xhr) {
				if(mask) {
					mask.hide();
					mask = null;
				}
				
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
				if(mask) {
					mask.hide();
					mask = null;
				}
				
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
				var k = files[0].name;//.replace(/\./gm, '');
				
				if(gyeoljaeSelectedFiles[k]) {
					common.showExtMsg({
						type: 'alert',
						msg: '같은 이름의 파일이 있습니다.'
					});
		            return false;
		        }
				
				//최대파일갯수 체크
				if(checkMaxFileCount()) {
					if(files[0].size <= 50000000) {
						gyeoljaeSelectedFiles[k] = files[0];
					}
				}
				
				return true;
				
			},
			onCancel: function(files) {
				var k = files[0];//.name.replace(/\./gm, '');
				delete gyeoljaeSelectedFiles[k];
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
		
		$btnModifySangsin.on('click', function() {
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
			
			if(!validateGyeoljaeType()) {
				common.showExtMsg({
					type: 'alert',
					msg: '휴가기간을 선택하세요',
					callback: function() {
						$txtVacationStart.focus();
					}
				});
				return;
			}
			
			if(!validateGyeoljaeSubType()) {
				common.showExtMsg({
					type: 'alert',
					msg: '휴가일수를 입력하세요',
					callback: function() {
						$numTerm.focus();
					}
				});
				return;
			}
			
			if(!validateGyeoljaeDocNum()) {
				common.showExtMsg({
					type: 'alert',
					msg: '문서번호 형식이 맞지 않습니다.',
					callback: function() {
						$docNum.focus();
					}
				});
				
				return;
			}
			
			sangsin();
		});
		
		$btnDeleteSangsin.on('click', function() {
			common.showExtMsg({
				type: 'confirm',
				msg: '삭제하시겠습니까?',
				callback: function(btn) {
					if(btn == 'ok') {
						sangsinDel();
					}
				}
			});
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
		
		/*function getVacationGyeoljaeLines() {
			gyeoljaeLine.setData('/gyeoljae/vacationline');
		}
		
		function getDefaultGyeoljaeLines() {
			gyeoljaeLine.setData('/gyeoljae/myline');
		}*/
		function makeData() {
			var data = $.parseJSON($('#lines').val());
			
			for(var i=0, len=data.length; i<len; i++) {
				data[i].del = delImgUrl;
			}
			
			return data;
		}
		
		function makeAttachFileData() {
			var str = $('#hdnAttachFile').val();
			str = str.replace(/▦/ig, "'");
			var data = $.parseJSON(str);
			var len = data.length;
			
			if(len > 0) {
				hasAttachFileInDB = true;
				attachFileCodeInDB = data[0].code;
			}
			else {
				hasAttachFileInDB = false;
			}
			
			for(var i=0; i<len; i++) {
				data[i].del = delImgUrl;
			}
			
			return data;
		}
		
		var gyeoljaeLine = new Tabulator('#gyeoljaeLine', {
			data: makeData(),
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
		
		var attachedFileInDB = new Tabulator('#attachedFileInDB', {
			data: makeAttachFileData(),
			layout:'fitColumns',
		    autoResize:true,
		    placeholder: '첨부파일이 없습니다.',
		    //selectable:1,
			height: '100px',
			movableRows: false,
			columns: [
			    {title:'첨부파일명', field:'name', headerSort:false, widthGrow:4},
			    {title:'파일크기', field:'size', width:150,  headerSort:false, align:'center'},
			    {title:'삭제', field:'del', width:60,  headerSort:false, align:'center', formatter: 'image', formatterParams: {
			    	width: '20px', height: '20px'
			    }, cellClick:function(e, cell) {
			    	var row = cell.getRow();
			    	row.delete();
			    	removeAttachFileCodeInDB = row.getData().code;
			    }}
			],
			//data: tableData,
			rowMoved:function(row) {
				
			}
		});
		
		
		$gyeoljaeContent.summernote({
			lang: 'ko-KR',
			height: 200,
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
//		    		var codeContent = $gyeoljaeContent.summernote('code');
//		    		var plainTxt = $(codeContent).text();
		    		
		    	}
		    }
		});
		
		$gyeoljaeContent.summernote('code', $('#hdnContent').val().replace(/▦/gi, '"'));
	});
}());

