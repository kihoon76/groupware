Ext.define('Drpnd.custom.Socket', function() {
	var socket = null;
	var stompClient = null;
	var hasSocketConntected = false;
	var reconTotal = 10;
	var reconAttemp = 0;
	
    function connect(url, subscribe) {
    	socket = new SockJS(url);
		stompClient = Stomp.over(socket);
		
		stompClient.connect({}, function(frame) {
			setTimeout(function() {
				successCallback(subscribe);
			}, 500);
		}, function(error) {
			//reconnect(url, subscribe);
		});
    }
    
	function successCallback(subscribe) {
		hasSocketConntected = true;
		reconAttemp = 0;
		
		var len = subscribe.length;
		
		for(var s=0; s<len; s++) {
			(function(x) {
				stompClient.subscribe(subscribe[x].url, function(message) {
					var msgBody = Ext.JSON.decode(message.body);
					subscribe[x].callback(message, msgBody);
				});
			})(s);
		}
	}
	
	function reconnect(url, subscribe) {
		hasSocketConntected = false;
		reconAttemp++;
		
		if(reconAttemp > reconTotal) return;
		
		var reconInv = setTimeout(function() {
			socket = new SockJS(url),
			stompClient = Stomp.over(socket);
			
			stompClient.connect({}, function(frame) {
				clearTimeout(reconInv);
				successCallback(subscribe);	    
			}, function(error) {
				reconnect(url, subscribe);
			});
			
		}, 5000);
	}
	
	return {
		config: {
			socketUrl: '',
			subscribe: []
		},
		constructor : function(config){ //config 속성으로 주어진 속성들 초기화 this.initConfig(config); }
			this.initConfig(config)
		},
		connect: function() {
			connect(this.getSocketUrl(), this.getSubscribe());
		}
	}
});