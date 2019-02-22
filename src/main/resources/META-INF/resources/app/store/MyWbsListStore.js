Ext.define('Drpnd.store.MyWbsListStore', {
	 extend : 'Ext.data.Store',
	 requires : ['Drpnd.util.Constants', 'Drpnd.util.CommonFn'],
	 proxy : {
	        type : 'ajax'
	       ,url : Drpnd.util.Constants.context + '/project/list/mywbs'
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
	  fields : ['code', 'name', 'defaultDay', 'writer', 'range', 'resources', 'events'],
	  autoLoad : true,
	  pageSize : Drpnd.util.Constants.gridPageSize
});