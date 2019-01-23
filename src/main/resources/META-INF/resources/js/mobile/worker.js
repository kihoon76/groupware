var time = null;
var maxDayInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var sessionUrl = '';

onmessage = function(event) {
	var receiveData = event.data;
	
	if(receiveData == 'SESSION') {
		sessionUrl = '/checkSession';
		sessionPush();
	}
	else {
		time = receiveData;
		calcTime();
	}
}

function calcTime() {
	
	setTimeout(function() {
		
		var s = parseInt(time.sec);
		if(s == 59) {
			time.sec = '00';
			
			var m = parseInt(time.min);
			m++;
			if(m == 60) {
				time.min = '00';
				var h = parseInt(time.hour);
				h++;
				if(h == 24) {
					time.hour = '00';
					var mon = parseInt(time.month);
					var day = parseInt(time.day);
					var maxDay = maxDayInMonth[mon - 1];
					var year = parseInt(time.year);
					
					if(mon == 2 && ( year%4 == 0 && year%100 != 0 || year%400 == 0)) {
						maxDay = 29;
					}
					
					if(++day > maxDay) {
						day = '01';
						if(++mon > 12) {
							time.month = '01';
							time.year = ++year; 
						}
						else {
							if(mon < 10) {
								time.month = '0' + mon;
							}
							else {
								time.month = mon;
							}
						}
					}
					else {
						if(day < 10) {
							time.day = '0' + day;
						}
						else {
							time.day = day;
						}
					}
				}
				else {
					if(h < 10) {
						time.hour = '0' + h;
					}
					else {
						time.hour = h;
					}
				}
			}
			else {
				if(m < 10) {
					time.min = '0' + m;
				}
				else {
					time.min = m;
				}
			}
		}
		else {
			s++;
			if(s < 10) {
				time.sec = '0' + s;
			}
			else {
				time.sec = s;
			}
		}
		
		var d = time.year + '-' + time.month + '-' + time.day + ' ' + time.hour + ':' + time.min + ':' + time.sec;
		
		postMessage(d);
		calcTime();
	}, 1000);
}

function sessionPush(callback) {
	setTimeout(function() {
		var xhr;
		if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
		
		if(xhr == null) return; 
			
		xhr.onreadystatechange = ensureReadiness;
			
		function ensureReadiness() {
			if(xhr.readyState < 4) {
				return;
			}
				
			if(xhr.status !== 200) {
				return;
			}

			// all is well	
			if(xhr.readyState === 4) {
				sessionPush();
			}			
		}
			
		xhr.open('GET', sessionUrl, true);
		xhr.send('');
	}, 600000);
}