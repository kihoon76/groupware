Ext.define('Drpnd.view.panel.NormalDocsGridPanel', {
	extend: 'Ext.grid.Panel',
	requires : ['Drpnd.util.Constants' ,'Drpnd.util.CommonFn'],
	xtype: 'normaldocsgrid',
	initComponent: function() {
		var CommonFn = Drpnd.util.CommonFn;
		try {
			var store = Ext.create('Drpnd.store.NormalDocsListStore');
		}
		catch(e) {
			console.log(e);
		}
		
		function download(url) {
			var form = document.getElementById('extDownloadForm');
			var isNew = false;
			if(!form) {
				form = document.createElement('form');
				form.setAttribute('id', 'extDownloadForm');
				isNew = true;
			} 
		
			form.action = url;
			form.method = 'GET';
			form.target = '_blank';
			form.style.display = 'none';
			if(isNew) {
				document.body.appendChild(form);
			}
			
			form.submit();
		}
		
		Ext.apply(this, {
			store: store,
			title: '<span style="color:#ff0000;">★ 다운로드를 하시려면 다운로드 셀영역을 더블클릭하세요.</span>',
			columns: [{
				text: '문서명',
				dataIndex: 'docName',
				flex: 1
			}, {
				text: '파일이름',
				dataIndex: 'fileName',
				flex: 0,
				renderer: function(v, t, r) {
					return v + '.' + r.raw.ext;
				}
			}, {
				text: '다운로드',
				dataIndex: 'ext',
				flex: 0,
				align: 'center',
				renderer: function(v) {
					return CommonFn.getFileFormatIcon(v);
				},
				
			}],
			listeners: {
				itemdblclick: function(grid, record, item) {
					console.log(record);
					Ext.Msg.show({
						title: '',
						msg: '[' + record.raw.fileName + ']문서를 다운로드 하시겠습니까?',
						buttons: Ext.Msg.OKCANCEL,
						icon: Ext.MessageBox.QUESTION,
						fn: function(btn) {
							if(btn == 'ok') {
								download('doc/normal/download/' + record.raw.fileName + '/' + record.raw.ext);
							}
						}
					});
				}
			}
		});
		
		this.callParent(arguments);
	}
});
