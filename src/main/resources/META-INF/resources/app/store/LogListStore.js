Ext.define('Hotplace.store.LogListStore', {
	 extend : 'Ext.data.Store',
	 requires : ['Hotplace.util.Constants', 'Hotplace.util.CommonFn'],
	 proxy : {
	        type : 'ajax'
	       ,url : Hotplace.util.Constants.context + '/log/list'
	       ,actionMethods : 'POST'
	       ,reader : {
	           type : 'json'
	          ,root : 'datas'
	          ,totalProperty : 'total'
	       },
	       listeners: {
	    	   exception: function(proxy, response, operation, eOpts) {
	    		   Hotplace.util.CommonFn.redirectStoreAjax(response);
	    	   }
	       }

	  },
	  fields : ['ip', 'accountId', 'referer', 'url', 'parameter', 'accessTime', 'userAgent', 'isMobile'],
	  autoLoad : true,
	  pageSize : Hotplace.util.Constants.gridPageSize
});