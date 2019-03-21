(function(c) {

	var $selLink = null;
	
	function commit() {
		var $txtGyeoljaeOpinion = $('#txtGyeoljaeOpinion');
		var v = $.trim($txtGyeoljaeOpinion.val());
		
		if(v == '') {
			$txtGyeoljaeOpinion.focus();
			return;
		}
		c.ajax({
			url: '/gyeoljae/m/commit/',
	    	method: 'POST',
			headers: {'CUSTOM': 'Y'},
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify({
				sangsinCode: String($selLink.data('sangsinNum')),
				opinion: v
			}),
			success: function(data, textStatus, jqXHR) {
				if(data.success) {
					c.makeResultMsg('결재처리 되었습니다.', function() {
						window.location.reload();	
					});  				
				}
			},
		});
	}
	
	function reject() {
		var $txtGyeoljaeOpinion = $('#txtGyeoljaeOpinion');
		var v = $.trim($txtGyeoljaeOpinion.val());
		
		if(v == '') {
			$txtGyeoljaeOpinion.focus();
			return;
		}
		c.ajax({
			url: '/gyeoljae/m/reject/',
	    	method: 'POST',
			headers: {'CUSTOM': 'Y'},
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify({
				sangsinCode: String($selLink.data('sangsinNum')),
				opinion: v
			}),
			success: function(data, textStatus, jqXHR) {
				if(data.success) {
					c.makeResultMsg('반려처리 되었습니다.', function() {
						window.location.reload();	
					});  				
				}
			},
		});
	}
	
	function btnHandler() {
		var $this = $(this);
		var h = '';
		
		c.closePopup();
		
		if($this.hasClass('BTN-ACC')) {
			h = '<span style="padding-left:15px;">결재승인</span>';
			c.makePopup(h, String.format( c.myGyeoljaePopup, '승인합니다.'));
			c.makePopupOkHandler(commit);
			c.openPopup('commit_gyeoljae');
		}
		else {
			h = '<span style="padding-left:15px;">반려</span>';
			c.makePopup(h, String.format( c.myGyeoljaePopup, '반려합니다.'));
			c.makePopupOkHandler(reject);
			c.openPopup('reject_gyeoljae');
		}
	}
	
	function getContent($link, sangsinNum) {
		c.ajax({
			url: '/gyeoljae/m/content/' + sangsinNum,
	    	method: 'GET',
			dataType: 'html',
			headers: {'CUSTOM': 'Y'},
			success: function(data, textStatus, jqXHR) {
				try {
					var json = $.parseJSON(data);
					jqXHR.errCode = json.errCode;
				}
				catch(e) {
					if($selLink != null) {
						$selLink.next().html('');
						var btns = $selLink.next().find('button');
						btns.off('click');
					}
					
					$selLink = $link;
					$link.next().html(data);
					$link.next().find('button').on('click', btnHandler);
				}
			},
			
		});
	}
	
	
	
	c.viewMyGyeoljaeList = function() {
		$('.GYEOLJAE')
		.off('click')
		.on('click', function() {
			var $this = $(this);
			getContent($this, $this.data('sangsinNum'));
		});
		
		
	}
	
}(Common));

