Ext.define('Drpnd.store.VacationHistoryListStore', {
	 extend : 'Ext.data.Store',
	 requires : ['Drpnd.util.Constants', 'Drpnd.util.CommonFn'],
	 baseParams: {
		 sawonCode:''
	 },
	 proxy : {
	        type : 'ajax'
	       ,url : Drpnd.util.Constants.context + '/sawon/vacation/history'
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
	  fields : ['vType', 'vStartDate', 'vEndDate', 'vTerm', 'vContent'],
	  autoLoad : false,
});