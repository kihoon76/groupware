Ext.define('Drpnd.view.panel.NMapPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.nmappanel',
	config: {
		lat: 0,
		lng: 0
	},
	initComponent: function() {
		var mapHtml  = '<div id="map" style="width: 100%; height: 800px;">';
//		    mapHtml += '<div class="buttons" style="position: relative; top: 10px; left: 30px; z-index: 1000;">';
//		    mapHtml += '	<input id="cadastral" type="button" class="control-btn control-btn-default" value="지적도" /> ';
//            mapHtml += '</div>'; 
            mapHtml += '</div>';
		var that = this;
		var marker = null;
		
        function search() {
        	var lat = Ext.getCmp('nmap-lat');
        	var lng = Ext.getCmp('nmap-lng');
        	
        	if(lat.validate() && lng.validate()) {
        		morph(parseFloat(lat.getValue()), parseFloat(lng.getValue()));
        	}
        }
        
        function morph(lat, lng) {
        	that.nmap.morph(new naver.maps.LatLng(lat, lng), 14, {duration: 100});
        	getMarker(lat, lng);
        }
        
        function getMarker(lat, lng) {
        	if(marker == null) {
        		marker = new naver.maps.Marker({
        		    position: new naver.maps.LatLng(lat, lng),
        		    map: that.nmap
        		});
        	}
        	else {
        		marker.setPosition(new naver.maps.LatLng(lat, lng));
        	}
        }
        
		Ext.apply(this, {
			layout: {
				align: 'stretch',
				type: 'vbox'
			},
			items:[{
				html:mapHtml,
			}]
			
		});
		
		this.callParent();
	},
	createMap: function() {
		var that = this;
		var mapOptions = {
		 	center: new naver.maps.LatLng(that.getLat(), that.getLng()), //지도의 초기 중심 좌표(36.0207091, 127.9204629)
	        zoom: 13, //지도의 초기 줌 레벨
	        mapTypeControl: false,
//	        mapTypeControlOptions: {
//	        	style: naver.maps.MapTypeControlStyle.DROPDOWN
//	        }
		};
		
		var nmap = new naver.maps.Map('map', mapOptions);

		var marker = new naver.maps.Marker({
		    position: new naver.maps.LatLng(that.getLat(), that.getLng()),
		    map: nmap
		});

	},
	afterFirstLayout: function() {
		this.callParent();
		this.createMap();
	}
	
});