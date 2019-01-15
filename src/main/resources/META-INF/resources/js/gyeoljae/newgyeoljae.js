$(document).ready(function() {
	
	var $searchSawon = $('#searchSawon');
	
	$searchSawon.on('click', function() {
		comm.checkSession(function() {
			comm.ajaxExt({
				url: 'gyeoljae/search/sawon',
				method: 'POST',
				param: {
					excludeSawon: excludeSawonData(),
				},
				loadmask: {
					msg: '사원검색중 입니다.'
				},
				success: function(jo) {
					console.log(jo)
				}
			});
		});
	});
	
	function excludeSawonData() {
		var datas = getGyeoljaeLineData();
		var len = datas.length;
		
		if(len > 0) {
			
		}
		
		return '';
	}
	
	function getGyeoljaeLineData() {
		return gyeoljaeLine.getData();
		
	}
//	common.ajaxExt({
//		url: '/calendar/plan/' + planCode,
//		method: 'GET',
//		headers: { 'Content-Type': 'application/json' }, 
//		loadmask: {
//			msg: '일정로딩중 입니다.'
//		},
//		success: function(jo) {
//			console.log(jo);
//			var data = jo.datas[0];
//			if(data) {
//				openPlanWin(data);
//			}
//			else {
//				common.showExtMsg({
//					type: 'alert',
//					msg: '정보가 없습니다.'
//				});
//			}
//		}
//	});
	
	var tableData = [
	    {sawonCode: '1', sawonName: '남기훈', sawonId: 'khnam', sawonPosition: '부장', email: 'test@tyty.com'},
	    {sawonCode: '2', sawonName: '박승석', sawonId: 'sspark', sawonPosition: '차장', email: 'test@tyty.com'},
	];
	
	var gyeoljaeLine = new Tabulator('#gyeoljaeLine', {
		fitColumns:true, //fit columns to width of table (optional)
	    autoResize:true,
	    selectable:1,
		height: '400px',
		movableRows: true,
		columns: [
		    {rowHandle:true, formatter:'handle', headerSort:false, frozen:true, width:30, minWidth:30},
		    {title:'사원코드', field:'sawonCode', visible: false},
		    {title:'사원명', field:'sawonName', width:150,  headerSort:false},
		    {title:'사원아이디', field:'sawonId', width:200,  headerSort:false},
		    {title:'직급', field:'sawonPosition', width:100,  headerSort:false},
		    {title:'이메일', field:'email', width:200,  headerSort:false}
		],
		data: tableData,
		rowMoved:function(row) {
			
		}
	});
	
	console.log(gyeoljaeLine.getData());
	
	/*$table.tabulator('setData', [{
		sawonName: 'ttt', sawonId: 'rrr', sawonPosition: '부장', email: 'test@tyty.com'
	}]);*/
});