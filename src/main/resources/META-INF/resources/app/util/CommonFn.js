/*
 * For example, if it's something your class instantiates Foo in the constructor, then it should be in requires.
   If it instantiates Foo in some method that might get called later by the developer, it could go in uses.
 * */
Ext.define('Drpnd.util.CommonFn', {
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
				Ext.Msg.alert('', '세션만료로 인해 다시 로그인해주세요', function() {
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
				myMask = new Ext.LoadMask(param.loadmask.el, {msg: param.loadmask.msg});
			}
			
			myMask.show();
		}
		
		Ext.Ajax.request(config);
	}
   
});