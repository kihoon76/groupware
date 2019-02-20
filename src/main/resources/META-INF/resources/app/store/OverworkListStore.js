Ext.define('Drpnd.store.OverworkListStore', {
	 extend : 'Ext.data.Store',
	 requires : ['Drpnd.util.CommonFn'],
	 proxy : {
	        type : 'ajax'
	       ,url : Drpnd.util.CommonFn.getFullUrl('code/overwork') //Drpnd.util.Constants.context + '/code/department'
	       ,actionMethods : 'POST'
	       ,reader : {
	           type : 'json'
	          ,root : 'datas'
	          ,totalProperty : 'total'
	       },
	       listeners: {
	    	   exception: function(proxy, response, operation, eOpts) {
	    		   console.log(response)
	    	   }
	       }
	  },
	  fields : ['overworkCode', 'overworkName'],
	  autoLoad : true
});