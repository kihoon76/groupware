(function() {
	var extMask = null;
	
	window.setParam = function(mask) {
		extMask = mask;
	}
	
	$(document).ready(function() {
		if(extMask) extMask.hide();
		var myGyeoljae = Gyeoljae.createTabulator({
			id: '#myGyeoljae',
			pagination: 'remote',
			ajaxURL: '/mygyeoljae',
			ajaxParams: {
				searchStatus: 'A',
				searchTextType: 'A',
				searchGyeoljaeType: 'A',
				searchText: $.trim($('#txtSearchContent').val()),
				searchStartDate: $.trim($('#txtStartDate').val()),
				searchEndDate: $.trim($('#txtEndDate').val())
			},
			ajaxResponse: function(response) {
				$('#spBadge').text(response.totalRow);
				return response;
			},
			placeholder: '내가 처리할 결재가 존재하지 않습니다.',
			selectable:1,
			height: '800px',
			rowClick: function(e, row) {
				Gyeoljae.getMyGyeoljaeDetail(row.getData().sangsinNum);
			},
			toolbar: true
		});
	});
})();