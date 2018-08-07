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
   
});