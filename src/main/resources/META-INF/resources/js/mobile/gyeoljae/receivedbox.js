(function(c) {

	var $selLink = null;
	
	function btnHandler() {
		var $this = $(this);
		if($this.hasClass('BTN-ACC')) {
			console.log('y')
		}
		else {
			console.log('p')
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

