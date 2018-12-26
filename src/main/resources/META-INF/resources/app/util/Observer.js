Ext.define('Drpnd.util.Observer', function(){
	var fnArrWinResize = [];
	
	return {
		singleton : true,
		addWinResizeObserver: function(fn) {
			fnArrWinResize.push(fn);
		},
		notifyWinResize: function(w, h) {
			var len = fnArrWinResize.length;
			for(var i=0; i<len; i++) {
				fnArrWinResize[i](w, h);
			}
		}
	}
});