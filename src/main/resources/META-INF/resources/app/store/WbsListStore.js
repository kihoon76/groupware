Ext.define('Drpnd.store.WbsListStore', {
	 extend : 'Ext.data.Store',
	 requires : ['Drpnd.util.Constants', 'Drpnd.util.CommonFn'],
	 proxy : {
	        type : 'ajax'
	       ,url : Drpnd.util.Constants.context + '/project/list'
	       ,actionMethods : 'POST'
	       ,reader : {
	           type : 'json'
	          ,root : 'datas'
	          ,totalProperty : 'total'
	       },
	       listeners: {
	    	   exception: function(proxy, response, operation, eOpts) {
	    		   Drpnd.util.CommonFn.redirectStoreAjax(response);
	    	   }
	       }

	  },
	  fields : ['WbsCode', 'WbsName', 'WbsDefaultDay', 'WbsStart', 'WbsWriter', 'WbsRange'],
	  autoLoad : true,
	  pageSize : Drpnd.util.Constants.gridPageSize
});