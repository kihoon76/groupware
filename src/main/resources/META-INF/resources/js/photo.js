$(document).ready(function() {
	var _jijeok;
	var _grid;
	var _mask;
	
	var datas;
	var infoWin;
	var Context = parent.Drpnd.util.Constants.context;
	
	window.setUp = function(jijeok, grid, mask) {
		_jijeok = jijeok;
		_grid = grid;
		_mask = mask;
		
		_jijeok.on('click', function(btn) {
			if(btn.mode == 'J') {
				map.removeOverlayMapTypeId(daum.maps.MapTypeId.USE_DISTRICT);
				btn.mode = 'N';
				btn.setText('일반');
			}
			else {
				map.addOverlayMapTypeId(daum.maps.MapTypeId.USE_DISTRICT);
				btn.mode = 'J';
				btn.setText('지적도');
			}
		})
		
		_grid.on('itemclick', function(g, record) {
			var num = record.data.photoNum;
			var fileName = record.data.photoName;
			//makeInfo(num, fileName);
			
			var file = record.data.photoObj;
			var reader = new FileReader();
			reader.readAsDataURL(file);
			
			reader.onload = function(e) {
				//console.log(e.target.result)
				makeInfo(num, e.target.result);
			}
			
		});
		
		_grid.getStore().on('clear', function() {
			_mask.hide();
		})
		
		_grid.getStore().removeAll();
	}
	
	window.callPhotos = function(photos) {
		$('#file-input').trigger('click');
	}
	
	window.callPhotosClear = function() {
		var len = markers.length;
		for(var k in markers) {
			markers[k].setMap(null);
		}
		
		for(var k in overlays) {
			overlays[k].setMap(null);
		}
		
		if(infoWin) infoWin.close();
		markers = {};
		datas = null;
		zIndexLastMarker = null;
		markerLog = {};
		overlays = {};
		
		//file 초기화
		var o = $('#file-input')[0];
		o.value = '';
		o.type = 'file';
				
		$('#file-input').off('change', fileHandler).on('change', fileHandler);
	}
	
	
	var imageSrc = Context + '/resources/images/photos/markerimg1.png',
		imageSize = new daum.maps.Size(30, 36), // 마커이미지의 크기입니다
		imageOption = {offset: new kakao.maps.Point(15, 36)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
	
	var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
	
	var markers = {};
	var overlays = {};
	var markerLog = {};
	var zIndexLastMarker;
	//var images = {};

	var container = $('#map'); //지도를 담을 영역의 DOM 레퍼런스
	var options = { //지도를 생성할 때 필요한 기본 옵션
	    center: new kakao.maps.LatLng(37.48625277087912, 127.11888909474317), //지도의 중심좌표.
	    level: 3//container.data('level') //지도의 레벨(확대, 축소 정도)
	};
	
	var map = new kakao.maps.Map(container.get(0), options); //지도 생성 및 객체 리턴
	map.addOverlayMapTypeId(kakao.maps.MapTypeId.USE_DISTRICT);
	
	
	function _info(num) {
	    return '<div class="customoverlay" data-num="' + num + '">' + num + '</div>';
	}

	function createMarker(num, lng, lat) {
		try {
            //if(markerLog[num]) return;
            var marker =  new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng),
                image: markerImage
            });

            marker.setMap(map);

            var customOverlay = new kakao.maps.CustomOverlay({
                map: map,
                position: new kakao.maps.LatLng(lat, lng),
                content: _info(num),
                yAnchor: 1 
            });
           
           
            markers[num] = marker;
            markerLog[num] = {lng: lng, lat: lat};
            overlays[num] = customOverlay;
        }
        catch(e) {
            alert(e.message);
        }
	}
	
	function makeModal(num,img) {
		var	win = parent.Ext.create('Ext.window.Window', {
			title: num + '번 사진:GPS정보가 없습니다.',
			height: 250, 
			width: 400,
			layout: 'fit',
			modal: true,
			resizable: false,
			closeAction: 'destroy',
			//animateTarget: param.aniTarget,
			items: [{
				xtype: 'image',
				src: img
			}]
		
		}).show();


	}
	function makeInfo(num, img) {
		var gps = markerLog[num];
		if(!gps) {
			makeModal(num, img);
			//alert('num: ' + num + ' 사진은 GPS정보가 없습니다.');
			return;
		}
		var m = markers[num];
		var o = overlays[num];
		
		
		//zindex조정
		if(zIndexLastMarker) {
			markers[zIndexLastMarker].setZIndex(1);
			overlays[zIndexLastMarker].setZIndex(1);
		}
		
		zIndexLastMarker = num;
		m.setZIndex(1000);
		o.setZIndex(1000);
		
		if(infoWin) infoWin.close();
		
		map.setCenter(new kakao.maps.LatLng(markerLog[num].lat, markerLog[num].lng));
		
		infoWin = new kakao.maps.InfoWindow({
		    map: map,
		    position: new kakao.maps.LatLng(gps.lat, gps.lng),
		    content: '<img height="200", width="200" src="' + img + '">',
		    removable: true
		});
		
		infoWin.open(map, m); 
	}
	
	function fileHandler(e) {
		var files = e.target.files;
		var fileLen = files.length;
		if(datas == null) {	datas = [];	}
		
		var dIdx = datas.length;
		for(var i=0; i<fileLen; i++) {
			if(files[i] && files[i].name) {
				datas.push({
					photoNum: dIdx + (i+1),
					photoName: files[i].name,
					photoType: files[i].type,
					photoSize: files[i].size,
					photoObj: files[i]
				});
				
				(function(x) {
					EXIF.getData(files[x], function() {
		            	/*
		                var exifData = EXIF.pretty(this);
		                if (exifData) {
		                    alert(exifData);
		                    console.dir(EXIF.getTag(this, 'GPSLatitude'));
		                } else {
		                    alert("No EXIF data found in image '" + file.name + "'.");
		                }
		                */
		            	
		            	var aLat = EXIF.getTag(files[x], 'GPSLatitude');
		    			var aLong = EXIF.getTag(files[x], 'GPSLongitude');
	
		    			if (!(aLat && aLong)) return; // whoops, no GPS info
	
		    			// convert from deg/min/sec to decimal for Google
		    			var strLatRef = EXIF.getTag(files[x], 'GPSLatitudeRef') || 'N';
		    			var strLongRef = EXIF.getTag(files[x], 'GPSLongitudeRef') || 'W';
		    			var fLat = (aLat[0] + aLat[1]/60 + aLat[2]/3600) * (strLatRef == 'N' ? 1 : -1);
		    			var fLong = (aLong[0] + aLong[1]/60 + aLong[2]/3600) * (strLongRef == 'W' ? -1 : 1);
	
		    			// center the google map and add a marker
		    			if(fileLen-1 == x) map.setCenter(new kakao.maps.LatLng(fLat, fLong), 13);
		    			createMarker(dIdx + (x+1), fLong, fLat);
		            });
				}(i));
			}
		}
		
		//zIndexLastMarker = markers[markers.length-1];
		_grid.getStore().loadData(datas);
	}
	
	
	$('#file-input').on('change', fileHandler);
	
	
	   
});