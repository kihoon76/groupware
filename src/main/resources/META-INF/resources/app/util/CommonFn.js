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
	}
   
});