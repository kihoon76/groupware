(function(c) {

	var $selLink = null;
	var $progressBar = null;
	var downCurrentSize = 0;
	
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
		var form = document.getElementById('gyeoljaeDownForm');
		var isNew = false;
		
		if(!form) {
			form = document.createElement('form');
			form.setAttribute('id', 'gyeoljaeDownForm');
			isNew = true;
		}
		
		form.action = '/gyeoljae/m/file/' + code;
		form.method = 'GET';
		form.target = '_self';
		form.style.display = 'none';
		if(isNew) document.body.appendChild(form);
		form.submit();
		
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
	
	/*c.fileDownReady = function() {
		c.closePopup();
		c.makePopup('다운로드', '<div id="progressbar"></div>');
		c.makePopupOkHandler(function() {});
		
		
		$progressBar = jQMProgressBar('progressbar')
	    .setOuterTheme('b')
	    .setInnerTheme('e')
	    .isMini(true)
	    .setMax(100)
	    .setStartFrom(0)
	    .setInterval(1000000000)
	    .showCounter(true)
	    .build();
		
		downTotalSize = 0;
		
		c.openPopup('app');
	}*/
	
	
	//안드로이드 앱에서 호출
	/*c.fileDownStart = function(total, current) {
		downCurrentSize += current;
		
		$progressBar
		.setValue(Math.floor((downCurrentSize/total)*100))
		.run();

		$progressBar.stop();
	}
	
	c.fileDownEnd = function() {
		c.closePopup();
	}*/
	
}(Common));

