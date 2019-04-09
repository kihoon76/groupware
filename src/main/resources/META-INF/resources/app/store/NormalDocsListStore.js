Ext.define('Drpnd.store.NormalDocsListStore', {
	 extend : 'Ext.data.Store',
	 requires : ['Drpnd.util.Constants', 'Drpnd.util.CommonFn'],
	 proxy : {
	        type : 'ajax'
	       ,url : Drpnd.util.Constants.context + '/doc/normal/list'
	       ,actionMethods : 'POST'
	       ,reader : {
	           type : 'json'
	          ,root : 'datas'
	       },
	       listeners: {
	    	   exception: function(proxy, response, operation, eOpts) {
	    		   Drpnd.util.CommonFn.redirectStoreAjax(response);
	    	   }
	       }

	  },
	  fields : ['docName', 'fileName', 'ext'],
	  autoLoad : true
});