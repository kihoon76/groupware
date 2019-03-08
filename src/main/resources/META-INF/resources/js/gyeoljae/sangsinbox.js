(function() {
	var extMask = null;
	var extDivModGyeoljae = null;
	
	window.setParam = function(divModGyeoljae, mask) {
		extDivModGyeoljae = divModGyeoljae;
		extMask = mask;
	}
	
	$(document).ready(function() {
		if(extMask) extMask.hide();
		var myGian = Gyeoljae.createTabulator({
			id: '#myGian',
			pagination: 'remote',
			ajaxURL: '/mysangsin',
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
			placeholder: '내가 올린 기안이 없습니다.',
			selectable:1,
			height: '800px',
			rowClick: function(e, row) {
				Gyeoljae.getMyGianDetail(row.getData().sangsinNum, extDivModGyeoljae);
			},
			toolbar: true
		});
		
		//extDivModGyeoljae.dom.click();
	});
	
	
})();