$(document).ready(function() {
	
	var imageSrc = 'https://localhost:58443/resources/images/photos/markerimg1.png',
		imageSize = new daum.maps.Size(30, 36), // 마커이미지의 크기입니다
		imageOption = {offset: new kakao.maps.Point(15, 36)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
	
	var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
	
	var markers = [];
	var infos = [];
	var markerLog = {};

	var container = $('#map'); //지도를 담을 영역의 DOM 레퍼런스
	var options = { //지도를 생성할 때 필요한 기본 옵션
	    center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
	    level: 3//container.data('level') //지도의 레벨(확대, 축소 정도)
	};
	
	var map = new kakao.maps.Map(container.get(0), options); //지도 생성 및 객체 리턴
	map.addOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT);
	
	function _info(num) {
	    return '<div class="customoverlay">' + num + '</div>';
	}

	function createMarker(num, lng, lat) {
		try {
            if(markerLog[num]) return;
            var marker =  new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lng, lat),
                image: markerImage
            });

            marker.setMap(map);
            /*var infoWin = new daum.maps.InfoWindow({
                position : new daum.maps.LatLng(lng, lat), 
                content : _info(num) 
            });*/

            var customOverlay = new kakao.maps.CustomOverlay({
                map: map,
                position: new kakao.maps.LatLng(lng, lat),
                content: _info(num),
                yAnchor: 1 
            });
           
           
            markers.push(marker);
            markerLog[num] = {lng: lng, lat: lat};
            infos.push(customOverlay);
            //infoWin.open(map, marker); 
        }
        catch(e) {
            alert(e.message);
        }
	}
	
	$('#file-input').on('change', function(e) {
		var file = e.target.files[0]
        if (file && file.name) {
            EXIF.getData(file, function() {
            	/*
                var exifData = EXIF.pretty(this);
                if (exifData) {
                    alert(exifData);
                    console.dir(EXIF.getTag(this, 'GPSLatitude'));
                } else {
                    alert("No EXIF data found in image '" + file.name + "'.");
                }
                */
            	
            	var aLat = EXIF.getTag(file, "GPSLatitude");
    			var aLong = EXIF.getTag(file, "GPSLongitude");

    			if (!(aLat && aLong)) return; // whoops, no GPS info

    			// convert from deg/min/sec to decimal for Google
    			var strLatRef = EXIF.getTag(file, 'GPSLatitudeRef') || 'N';
    			var strLongRef = EXIF.getTag(file, "GPSLongitudeRef") || 'W';
    			var fLat = (aLat[0] + aLat[1]/60 + aLat[2]/3600) * (strLatRef == 'N' ? 1 : -1);
    			var fLong = (aLong[0] + aLong[1]/60 + aLong[2]/3600) * (strLongRef == 'W' ? -1 : 1);

    			// center the google map and add a marker
    			map.setCenter(new kakao.maps.LatLng(fLat, fLong), 13);
    			createMarker(0, fLong, fLat);
    			/*
    			var marker = new kakao.maps.Marker({
    				map: map,
    				position: new kakao.maps.LatLng(fLat, fLong)
    			});
    			*/
    			//oMarker = new GMarker(new GLatLng(fLat, fLong));
    			//oMap.addOverlay(oMarker);
            });
        }
	});
	   
});