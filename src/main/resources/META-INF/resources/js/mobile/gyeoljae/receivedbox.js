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
	
	function downloadHandler(code, name) {
		var form = document.createElement('form');
		form.action = '/gyeoljae/m/file/' + code;
		form.method = 'GET';
		form.target = '_self';
		
		//var input = document.createElement('input');
		//input.type = 'hidden';
	   
	    //form.appendChild(input);
		form.style.display = 'none';
		document.body.appendChild(form);
		form.submit();

		//window.location.href = ':download'
		
//		$.fileDownload('/gyeoljae/m/file/' + code)
//		.done(function() {alert('download success')})
//		.fail(function() {alert('download fail')});
		/*$.fileDownload('/gyeoljae/m/file/' + code ,{
			httpMethod: 'GET',
			successCallback: function() {
				alert('hh')
			},
			failCallback: function(responseHtml, url, error) {
				alert(error)
			}
		});
		
		return false;*/
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
						$selLink.next().find('button').off('click');
						$selLink.next().find('.FILES').off('click');
					}
					
					$selLink = $link;
					$link.next().html(data);
					$link.next().find('button').on('click', btnHandler);
					$link.next().find('.FILES').on('click', function() {
						var code = $(this).data('code');
						var name = $(this).html();
						console.log(name)
						downloadHandler(code, name);
					});
					
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

