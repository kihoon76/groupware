(function() {
	var receivedExtBtn = null;
	var sangsinExtBtn = null;
	var keepboxExtBtn = null;
	var modifyExtBtn = null;
	var extMask = null;
	
	window.setGyeoljaeButton = function(received, sangsin, keepbox, modify, mask) {
		receivedExtBtn = received;
		sangsinExtBtn = sangsin;
		keepboxExtBtn = keepbox;
		modifyExtBtn = modify;
		console.log(modifyExtBtn)
		extMask = mask;
	}

	$(document).ready(function() {
		if(extMask) extMask.hide();
		var myGian = Gyeoljae.createTabulator({
			id: '#myGian',
			ajaxURL: '/mysangsin',
			ajaxParams: {summary:'5'},
			placeholder: '내가 올린 기안이 없습니다.',
			selectable:1,
			height: '300px',
			rowClick: function(e, row) {
				Gyeoljae.getMyGianDetail(row.getData().sangsinNum, modifyExtBtn);
			}
		});
		
		
		var myGyeoljae = Gyeoljae.createTabulator({
			id: '#myGyeoljae',
			ajaxURL: '/mygyeoljae',
			ajaxParams: {summary:'5'},
			placeholder: '내가 처리할 결재가 존재하지 않습니다.',
			selectable:1,
			height: '300px',
			rowClick: function(e, row) {
				Gyeoljae.getMyGyeoljaeDetail(row.getData().sangsinNum);
			}
		});
		
		$('#btnSansin').on('click', function() {
			if(sangsinExtBtn) {
				sangsinExtBtn.fireEvent('click')
			}
		});
		
		$('#btnReceived').on('click', function() {
			if(receivedExtBtn) {
				receivedExtBtn.fireEvent('click')
			}
		});
	});
})();

