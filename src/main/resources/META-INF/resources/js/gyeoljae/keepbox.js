(function() {
	var extMask = null;
	
	window.setParam = function(mask) {
		extMask = mask;
	}
	
	$(document).ready(function() {
		if(extMask) extMask.hide();
	   	var myKeepBox = Gyeoljae.createTabulator({
			id: '#myKeepBox',
			pagination: 'remote',
			ajaxURL: '/allcommited',
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
			placeholder: '결재완료된 기안이  존재하지 않습니다.',
			selectable:1,
			height: '800px',
			rowClick: function(e, row) {
				Gyeoljae.getCommittedGianDetail(row.getData().sangsinNum);
			},
			toolbar: true
		});
		
	});
})();