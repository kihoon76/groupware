/*
 * For example, if it's something your class instantiates Foo in the constructor, then it should be in requires.
   If it instantiates Foo in some method that might get called later by the developer, it could go in uses.
 * */
Ext.define('Drpnd.util.CommonFn', function() {
	var fileFormatPath = '<img style="width:20px; height:20px;" src="/resources/images/format_icons/';
	
	return {
		 singleton : true
		,uses: ['Drpnd.util.Constants']
	    ,getFullUrl : function(url) {
	    	var fullUrl = Drpnd.util.Constants.context;
	    	if(!Ext.isEmpty(url)) {
	    		if(url.indexOf('/') != 0) {
	    			fullUrl += '/' + url;
	    		}
	    		else {
	    			fullUrl += url;
	    		}
	    	}
	
	    	return fullUrl;
	    }
	    ,redirectStoreAjax: function(response) {
			var context = Drpnd.util.Constants.context;
			var rText = null
			
			if(response && (rText = response.responseText)) {
				 
				if(!Ext.String.trim(rText).startsWith('{')) {
					//html로 간주
					var status = response.status;
					var msg = '';
					
					switch(status) {
					case 404:
						msg = '존재하지 않는 요청입니다';
						break;
					default:
						msg = '세션만료로 인해 다시 로그인해주세요';
						break;
					}
					
					Ext.Msg.alert('', msg, function() {
						if(status == 404) return;
						window.location.href = context + '/signin';
					});
					
					return;
				}
				
				var jo = Ext.decode(response.responseText);
				 
				if(!jo.success && jo.errCode) {
					var errCode = jo.errCode;
					
					if(errCode == '202') {
						Ext.Msg.alert('', '중복로그인이  발생했습니다.', function() {
							window.location.href = context + '/signin';
						});
						return;
					} 
				}
			}
		},
		getUserIP: function(onNewIP) { //  onNewIp - your listener function for new IPs
		    //compatibility for firefox and chrome
		    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
		    var pc = new myPeerConnection({
		        iceServers: []
		    }),
		    noop = function() {},
		    localIPs = {},
		    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
		    key;
	
		    function iterateIP(ip) {
		        if (!localIPs[ip]) onNewIP(ip);
		        localIPs[ip] = true;
		    }
	
		     //create a bogus data channel
		    pc.createDataChannel("");
	
		    // create offer and set local description
		    pc.createOffer().then(function(sdp) {
		        sdp.sdp.split('\n').forEach(function(line) {
		            if (line.indexOf('candidate') < 0) return;
		            line.match(ipRegex).forEach(iterateIP);
		        });
		        
		        pc.setLocalDescription(sdp, noop, noop);
		    })
		    .catch(function(reason) {
		        // An error occurred, so handle the failure to connect
		    	console.log(reason);
		    });
	
		    //listen for candidate events
		    pc.onicecandidate = function(ice) {
		        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
		        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
		    };
		    
	//	    getUserIP(function(ip){
	//		    alert("Got IP! :" + ip);
	//		});
		},
		validEmail: function(val) {
			var re =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
			return re.test(val);
		},
		validPhone: function(val) {
			var re = /^\d{3}-\d{3,4}-\d{4}$/;
			return re.test(val);
		},
		validInnerPhone: function(val) {
			var re = /^\d{4}$/;
			return re.test(val);
		},
		ajax: function(param) {
			var Constants = Drpnd.util.Constants;
			var context = Constants.context;
			
			var config = {};
			if(!param) throw new Error('파라미터 객체없음');
			if(!param.url) throw new Error('url not found');
			
			var myMask = null;
			
			config.url = context + param.url;
			config.method = (param.method || 'GET').toUpperCase();
			config.timeout = param.timeout || Constants.ajaxTimeout;
			
			if(param.params) config.params = param.params;
			if(param.headers) config.headers = param.headers;
			if(param.jsonData) config.jsonData = param.jsonData;
			
			config.success = function(response) {
				try {
					var jo = Ext.decode(response.responseText);
					var errCode = jo.errCode;
					
					//중복로그인 세션 체크
					if(!jo.success) {
						if(errCode == '202') {
							Ext.Msg.alert('', '중복로그인이  발생했습니다.', function() {
								window.location.href = context + '/signin';
							});
							return;
						}
					}
					
					if(param.success) {
						param.success(jo);
					}
				}
				catch(e) {
					if(!Ext.String.trim(response.responseText).startsWith('{')) {
						//html로 간주
						Ext.Msg.alert('', '세션만료 되었습니다.', function() {
							window.location.href = context + '/signin';
						});
					}
				}
				finally {
					if(myMask) myMask.hide();
				}
			}
			
			config.failure = function(response) {
				if(myMask) myMask.hide();
				Ext.Msg.alert('', '오류가 발생했습니다.');
				
				if(param.failure) param.failure(response);
			}
			
			if(param.loadmask) {
				if(typeof param.loadmask === 'boolean') {
					myMask = new Ext.LoadMask(Ext.getBody(), {msg: 'loading..'});
				}
				else {
					myMask = new Ext.LoadMask(param.loadmask.el || Ext.getBody(), {msg: param.loadmask.msg});
				}
				
				myMask.show();
			}
			
			Ext.Ajax.request(config);
		},
		checkSession: function(fn, hasMask) {
			var param = {
				url: '/checkSession',
	    		method: 'GET',
				success: function(jo) {
					fn();
				}	
			};
			
			if(hasMask) {
				param.loadmask = {
					msg: '세션체크 중입니다.'
				};
			}
			
			this.ajax(param);
		},
		getLatLng: function(callback) {
			var geoErrMsg = '';
			if('geolocation' in navigator) {
				// 지오로케이션 사용 가능 
				var options = {
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0
				};
				
				navigator.geolocation.getCurrentPosition(function(position) {
					var coords = position.coords;
					if(callback) callback(coords.latitude, coords.longitude);
					
				}, function(err) {
					geoErrMsg = '브라우져가 위치정보를 차단하였습니다.';
					//alert(geoErrMsg);
					Ext.Msg.alert('', geoErrMsg);
				}, options);
			}
			else {
				//geoErrMsg = '사용하시는 브라우져가 위치기반 서비스를 제공하지 않습니다.';
				//Ext.Msg.alert('', geoErrMsg);
				callback(0, 0);
			}
		},
		getMonthComboData: function() {
			var data = [];
			for(var i=0; i<12; i++) {
				data.push({
					name: (i+1) + '월',
					value: i+1
				});
			}
			
			return data;
		},
		checkBrower: function() {
	    	var b = {
				msie: false,
				msedge: false,
				msie_ver: '',
				chrome: false,
				firefox: false,
				safari: false,
				opera: false
	    	};
	    	
	    	var ua = navigator.userAgent;
	    	
	    	if(ua.search('Chrome') >= 0 && ua.search('Edge') < 0) {
	    		b.chrome = true;
	    	}
	    	else if(ua.search('Firefox') >= 0) {
	    		b.firefox = true;
	    	}
	    	else if(ua.search('Safari') >= 0 && ua.search('Chrome') < 0) {
	    		b.safari = true;
	    	}
	    	else if(ua.search('Opera') >= 0) {
	    		b.opera = true;
	    	}
	    	else if(ua.search('Trident') >=0) {
	    		b.msie = true;
	    		if(ua.search('Trident/7.0') >=0) {
	    			b.msie_ver = '11';
	    		}
	    		else if(ua.search('Trident/6.0') >=0) {
	    			b.msie_ver = '10';
	    		}
	    		else if(ua.search('Trident/5.0') >=0) {
	    			b.msie_ver = '9';
	    		}
	    	}
	    	else if(ua.search('Edge') >=0) {
	    		b.msedge = true;
	    	}
	    	
	    	return b;
		},
		getFileFormatIcon: function(ext) {
			switch(ext) {
	    	case 'xls':
	    	case 'xlsx':
	    		ext = fileFormatPath + 'xls.png" />';
	    		break;
	    	case 'ppt':
	    	case 'pptx':
	    		ext = fileFormatPath + 'ppt.png" />';
	    		break;
	    	case 'hwp':
	    		ext = fileFormatPath + 'hwp.png" />';
	    		break;
	    	case 'doc':
	    	case 'docx':
	    		ext = fileFormatPath + 'docx.png" />';
	    		break;
	    	case 'pdf':
	    		ext = fileFormatPath + 'pdf.png" />';
	    		break;
	    	case 'txt':
	    		ext = fileFormatPath + 'txt.png" />';
	    		break;
	    	case 'psd':
	    		ext = fileFormatPath + 'photoshop.png" />';
	    		break;
	    	case 'csv':
	    		ext = fileFormatPath + 'csv.png" />';
	    		break;
	    	case 'csv':
	    		ext = fileFormatPath + 'csv.png" />';
	    		break;
	    	case 'png':
	    		ext = fileFormatPath + 'png.png" />';
	    		break;
	    	case 'jpg':
	    	case 'jpeg':
	    		ext = fileFormatPath + 'jpg.png" />';
	    		break;
	    	case 'ai':
	    		ext = fileFormatPath + 'ai.png" />';
	    		break;
	    	case 'zip':
	    		ext = fileFormatPath + 'zip.png" />';
	    		break;
	    	case 'gif':
	    		ext = fileFormatPath + 'gif.png" />';
	    		break;
	    	case 'exe':
	    		ext = fileFormatPath + 'exe.png" />';
	    		break;
	    	default:
	    		ext = fileFormatPath + 'default.png" />';
	    		break;
	    	}
			
			return ext;
		},
	}
});