Ext.define('Drpnd.store.OverworkHistoryListStore', {
	 extend : 'Ext.data.Store',
	 requires : ['Drpnd.util.Constants', 'Drpnd.util.CommonFn'],
	 baseParams: {
		 sawonCode:''
	 },
	 proxy : {
	        type : 'ajax'
	       ,url : Drpnd.util.Constants.context + '/sawon/overwork/history'
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
	  fields : ['overworkDate', 'startDate', 'endDate', 'fromSix', 'overworkYoil', 'overworkTime'],
	  autoLoad : false,
});