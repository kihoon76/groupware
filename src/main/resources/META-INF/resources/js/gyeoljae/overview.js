$(document).ready(function() {
	
	var clipImg = '/resources/images/attachment.png';
	
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
		layout:'fitColumns',
	    autoResize:true,
	    selectable:1,
		height: '200px',
		movableRows: true,
		columns: [
//		    {title:'상신코드', field:'sangsinNum', visible: false},
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
		],
		//data: tableData,
		rowMoved:function(row) {
			
		}
	});
	
	
});