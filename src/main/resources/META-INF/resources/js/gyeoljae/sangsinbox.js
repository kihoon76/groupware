$(document).ready(function() {
	var myGian = Gyeoljae.createTabulator({
		id: '#myGian',
		pagination: 'remote',
		ajaxURL: '/mysangsin',
		ajaxParams: {
			searchStatus: 'A',
			searchTextType: 'A',
			searchText: $.trim($('#txtSearchContent').val()),
			searchStartDate: $.trim($('#txtStartDate').val()),
			searchEndDate: $.trim($('#txtEndDate').val())
		},
		ajaxResponse: function(response) {
			$('#spBadge').text(response.totalRow);
			return response;
		},
		placeholder: '내가 올린 기안이 없습니다.',
		selectable:1,
		height: '800px',
		rowClick: function(e, row) {
			Gyeoljae.getMyGianDetail(row.getData().sangsinNum);
		},
		toolbar: true
	});
	
});