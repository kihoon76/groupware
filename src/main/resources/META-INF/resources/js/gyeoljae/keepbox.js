$(document).ready(function() {
	var columns = [
    		{title: '첨부', field:'attCnt', width:50, headerSort:false, align:'center', formatter: function(cell) {
   			if(cell.getValue() > 0) {
   				return '<img src="' + common.getClipImage() + '" style="width:25px; height:25px;"/>';
   			}
   			
   			return '';
   		}},
   	    {title:'제목', field:'title', widthGrow:4, align:'center', headerSort:false},
   	    {title:'작성자', field:'gianja', width:100, align:'center', headerSort:false},
   	    {title:'상태', field:'status', width:150, align:'center', headerSort:false},
   	    {title:'작성일자', field:'writeDate', width:200, align:'center', headerSort:false}
   	];
	       	
   	var myKeepBox = new Tabulator('#myKeepBox', {
   		ajaxURL: '/gyeoljae/mycommited',
   		ajaxResponse: function(url, params, response) {
   			if(response.success) {
   				var datas = response.datas;
   				var len = datas.length;
   				
   				return datas;
   			}
   			else {
   				
   			}
   		},
   		placeholder: '결재완료된 기안이  존재하지 않습니다.',
   		layout:'fitColumns',
   	    autoResize:true,
   	    selectable:1,
   		height: '800px',
   		columns: columns,
   		rowClick: function(e, row) {
   			getMyGyeoljaeDetail(row.getData());
   		}
   	});
	
});