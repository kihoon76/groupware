Ext.define('Drpnd.store.PositionListStore', {
	 extend : 'Ext.data.Store',
	 requires : ['Drpnd.util.CommonFn'],
	 proxy : {
	        type : 'ajax'
	       ,url : Drpnd.util.CommonFn.getFullUrl('code/position') //Drpnd.util.Constants.context + '/code/position'
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
	  fields : ['positionCode', 'positionName', 'positionGubun'],
	  //autoLoad : true,
});